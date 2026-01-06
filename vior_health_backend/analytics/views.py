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
    week_start = today - timedelta(days=today.weekday())  # Start of week (Monday)
    month_start = today.replace(day=1)  # Start of month
    thirty_days_ago = today - timedelta(days=30)
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_end = month_start - timedelta(days=1)
    
    # Sales statistics - Today
    today_sales = Sale.objects.filter(created_at__date=today, status='completed')
    today_revenue = today_sales.aggregate(Sum('total'))['total__sum'] or 0
    today_transactions = today_sales.count()
    
    # Sales statistics - This Week
    week_sales = Sale.objects.filter(created_at__date__gte=week_start, status='completed')
    week_revenue = week_sales.aggregate(Sum('total'))['total__sum'] or 0
    
    # Sales statistics - This Month
    month_sales = Sale.objects.filter(created_at__date__gte=month_start, status='completed')
    month_revenue = month_sales.aggregate(Sum('total'))['total__sum'] or 0
    month_transactions = month_sales.count()
    
    # Sales statistics - Last Month (for comparison)
    last_month_sales = Sale.objects.filter(
        created_at__date__gte=last_month_start,
        created_at__date__lte=last_month_end,
        status='completed'
    )
    last_month_revenue = last_month_sales.aggregate(Sum('total'))['total__sum'] or 0
    last_month_transactions = last_month_sales.count()
    
    # Calculate growth percentages
    revenue_growth = 0
    if last_month_revenue > 0:
        revenue_growth = ((month_revenue - last_month_revenue) / last_month_revenue) * 100
    
    sales_growth = 0
    if last_month_transactions > 0:
        sales_growth = ((month_transactions - last_month_transactions) / last_month_transactions) * 100
    
    # Average transaction (last 30 days)
    last_30_days_sales = Sale.objects.filter(created_at__date__gte=thirty_days_ago, status='completed')
    last_30_days_revenue = last_30_days_sales.aggregate(Sum('total'))['total__sum'] or 0
    last_30_days_count = last_30_days_sales.count()
    average_transaction = last_30_days_revenue / last_30_days_count if last_30_days_count > 0 else 0
    
    # All time totals
    total_revenue = Sale.objects.filter(status='completed').aggregate(Sum('total'))['total__sum'] or 0
    total_sales = Sale.objects.filter(status='completed').count()
    
    # Product statistics
    total_products = Product.objects.filter(is_active=True).count()
    low_stock_products = [p for p in Product.objects.filter(is_active=True) if p.is_low_stock]
    low_stock_count = len(low_stock_products)
    
    # Prescription statistics
    pending_prescriptions = Prescription.objects.filter(status='pending').count()
    
    return Response({
        'today_revenue': float(today_revenue),
        'today_transactions': today_transactions,
        'week_revenue': float(week_revenue),
        'month_revenue': float(month_revenue),
        'month_transactions': month_transactions,
        'average_transaction': float(average_transaction),
        'total_revenue': float(total_revenue),
        'total_sales': total_sales,
        'products_count': total_products,
        'low_stock_count': low_stock_count,
        'pending_prescriptions': pending_prescriptions,
        'revenue_growth': f"{'+' if revenue_growth >= 0 else ''}{revenue_growth:.1f}%",
        'sales_growth': f"{'+' if sales_growth >= 0 else ''}{sales_growth:.1f}%",
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_chart(request):
    days = int(request.query_params.get('days', 7))
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Get sales data grouped by date
    sales_data = Sale.objects.filter(
        created_at__date__range=[start_date, end_date],
        status='completed'
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        total=Sum('total'),
        count=Count('id')
    ).order_by('date')
    
    # Convert to list and format dates
    result = []
    for item in sales_data:
        result.append({
            'date': item['date'].strftime('%Y-%m-%d'),
            'total': float(item['total'] or 0),
            'count': item['count']
        })
    
    return Response(result)


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
