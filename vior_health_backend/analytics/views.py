from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, F, Q
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
from sales.models import Sale, SaleItem
from inventory.models import Product, StockMovement
from prescriptions.models import Prescription


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today = datetime.now().date()
    
    # Sales statistics
    today_sales = Sale.objects.filter(created_at__date=today, status='completed')
    today_revenue = today_sales.aggregate(Sum('total'))['total__sum'] or 0
    today_transactions = today_sales.count()
    
    # Total statistics
    total_revenue = Sale.objects.filter(status='completed').aggregate(Sum('total'))['total__sum'] or 0
    total_products = Product.objects.filter(is_active=True).count()
    low_stock_products = Product.objects.filter(is_active=True).count()  # Will need custom filter
    pending_prescriptions = Prescription.objects.filter(status='pending').count()
    
    return Response({
        'today_revenue': today_revenue,
        'today_transactions': today_transactions,
        'total_revenue': total_revenue,
        'total_products': total_products,
        'low_stock_products': low_stock_products,
        'pending_prescriptions': pending_prescriptions
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_chart(request):
    days = int(request.query_params.get('days', 7))
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    sales_data = Sale.objects.filter(
        created_at__date__range=[start_date, end_date],
        status='completed'
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        revenue=Sum('total'),
        transactions=Count('id')
    ).order_by('date')
    
    return Response(list(sales_data))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_products(request):
    limit = int(request.query_params.get('limit', 10))
    
    top_products = SaleItem.objects.values(
        'product__id',
        'product__name'
    ).annotate(
        total_quantity=Sum('quantity'),
        total_revenue=Sum('total')
    ).order_by('-total_revenue')[:limit]
    
    return Response(list(top_products))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_summary(request):
    total_products = Product.objects.filter(is_active=True).count()
    total_value = Product.objects.filter(is_active=True).aggregate(
        total=Sum(F('quantity') * F('cost_price'))
    )['total'] or 0
    
    low_stock = [p for p in Product.objects.filter(is_active=True) if p.is_low_stock]
    low_stock_count = len(low_stock)
    
    out_of_stock = Product.objects.filter(is_active=True, quantity=0).count()
    
    return Response({
        'total_products': total_products,
        'total_value': total_value,
        'low_stock_count': low_stock_count,
        'out_of_stock': out_of_stock
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activities(request):
    limit = int(request.query_params.get('limit', 10))
    
    # Recent sales
    recent_sales = Sale.objects.select_related('customer', 'cashier').order_by('-created_at')[:limit]
    
    # Recent stock movements
    recent_movements = StockMovement.objects.select_related('product', 'created_by').order_by('-created_at')[:limit]
    
    # Recent prescriptions
    recent_prescriptions = Prescription.objects.select_related('customer', 'created_by').order_by('-created_at')[:limit]
    
    activities = []
    
    for sale in recent_sales:
        activities.append({
            'type': 'sale',
            'id': sale.id,
            'description': f"Sale {sale.invoice_number}",
            'amount': sale.total,
            'user': sale.cashier.username,
            'created_at': sale.created_at
        })
    
    for movement in recent_movements:
        activities.append({
            'type': 'stock_movement',
            'id': movement.id,
            'description': f"{movement.movement_type.upper()} - {movement.product.name}",
            'quantity': movement.quantity,
            'user': movement.created_by.username,
            'created_at': movement.created_at
        })
    
    for prescription in recent_prescriptions:
        activities.append({
            'type': 'prescription',
            'id': prescription.id,
            'description': f"Prescription {prescription.prescription_number}",
            'status': prescription.status,
            'user': prescription.created_by.username,
            'created_at': prescription.created_at
        })
    
    # Sort by created_at
    activities.sort(key=lambda x: x['created_at'], reverse=True)
    
    return Response(activities[:limit])
