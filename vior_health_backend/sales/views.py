from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.db import transaction
from decimal import Decimal
from datetime import datetime
from .models import Customer, Sale, SaleItem
from inventory.models import Product
from .serializers import CustomerSerializer, SaleSerializer, CreateSaleSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                name__icontains=search
            ) | queryset.filter(
                phone__icontains=search
            )
        return queryset


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.select_related('customer', 'cashier').prefetch_related('items').all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['post'])
    def create_sale(self, request):
        serializer = CreateSaleSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            with transaction.atomic():
                # Calculate totals
                subtotal = Decimal('0.00')
                sale_items_data = []
                
                for item_data in data['items']:
                    product = Product.objects.select_for_update().get(id=item_data['product'])
                    quantity = item_data['quantity']
                    
                    # Check stock
                    if product.quantity < quantity:
                        return Response(
                            {'error': f'Insufficient stock for {product.name}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    unit_price = item_data.get('unit_price', product.unit_price)
                    discount = Decimal(item_data.get('discount', 0))
                    item_total = (unit_price * quantity) - discount
                    subtotal += item_total
                    
                    sale_items_data.append({
                        'product': product,
                        'quantity': quantity,
                        'unit_price': unit_price,
                        'discount': discount,
                        'total': item_total
                    })
                
                # Create sale
                tax = data.get('tax', Decimal('0.00'))
                discount = data.get('discount', Decimal('0.00'))
                total = subtotal + tax - discount
                amount_paid = data['amount_paid']
                change_amount = amount_paid - total if amount_paid >= total else Decimal('0.00')
                
                # Generate invoice number
                today = datetime.now()
                invoice_prefix = f"INV{today.strftime('%Y%m%d')}"
                last_sale = Sale.objects.filter(
                    invoice_number__startswith=invoice_prefix
                ).order_by('-invoice_number').first()
                
                if last_sale:
                    last_number = int(last_sale.invoice_number[-4:])
                    invoice_number = f"{invoice_prefix}{str(last_number + 1).zfill(4)}"
                else:
                    invoice_number = f"{invoice_prefix}0001"
                
                sale = Sale.objects.create(
                    invoice_number=invoice_number,
                    customer_id=data.get('customer'),
                    subtotal=subtotal,
                    tax=tax,
                    discount=discount,
                    total=total,
                    payment_method=data['payment_method'],
                    amount_paid=amount_paid,
                    change_amount=change_amount,
                    status='completed',
                    notes=data.get('notes', ''),
                    cashier=request.user
                )
                
                # Create sale items and update stock
                for item_data in sale_items_data:
                    SaleItem.objects.create(
                        sale=sale,
                        product=item_data['product'],
                        quantity=item_data['quantity'],
                        unit_price=item_data['unit_price'],
                        discount=item_data['discount'],
                        total=item_data['total']
                    )
                    
                    # Update product stock
                    product = item_data['product']
                    product.quantity -= item_data['quantity']
                    product.save()
                
                return Response(
                    SaleSerializer(sale).data,
                    status=status.HTTP_201_CREATED
                )
        
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def today_sales(self, request):
        today = datetime.now().date()
        sales = self.queryset.filter(created_at__date=today, status='completed')
        
        total_sales = sales.aggregate(
            total=Sum('total'),
            count=Count('id')
        )
        
        return Response({
            'total_amount': total_sales['total'] or 0,
            'total_count': total_sales['count'] or 0,
            'sales': SaleSerializer(sales, many=True).data
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        today = datetime.now().date()
        
        # Today's sales
        today_sales = self.queryset.filter(created_at__date=today, status='completed')
        today_total = today_sales.aggregate(Sum('total'))['total__sum'] or 0
        
        # Total sales
        total_sales = self.queryset.filter(status='completed').aggregate(Sum('total'))['total__sum'] or 0
        
        # Total transactions
        total_transactions = self.queryset.filter(status='completed').count()
        
        return Response({
            'today_sales': today_total,
            'total_sales': total_sales,
            'total_transactions': total_transactions
        })
