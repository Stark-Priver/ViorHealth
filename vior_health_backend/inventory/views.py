from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Category, Supplier, Product, StockMovement
from .serializers import (
    CategorySerializer, SupplierSerializer, ProductSerializer, 
    StockMovementSerializer, ProductStockUpdateSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def active(self, request):
        suppliers = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(suppliers, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'supplier', 'created_by').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        low_stock = self.request.query_params.get('low_stock', None)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(generic_name__icontains=search) | 
                Q(sku__icontains=search) |
                Q(barcode__icontains=search)
            )
        
        if category:
            queryset = queryset.filter(category_id=category)
        
        if low_stock == 'true':
            queryset = [product for product in queryset if product.is_low_stock]
        
        return queryset

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        products = [product for product in self.get_queryset() if product.is_low_stock]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        product = self.get_object()
        serializer = ProductStockUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            movement_type = serializer.validated_data['movement_type']
            quantity = serializer.validated_data['quantity']
            
            # Update product quantity
            if movement_type == 'in':
                product.quantity += quantity
            elif movement_type == 'out':
                if product.quantity < quantity:
                    return Response(
                        {'error': 'Insufficient stock'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                product.quantity -= quantity
            elif movement_type == 'adjustment':
                product.quantity = quantity
            
            product.save()
            
            # Create stock movement record
            StockMovement.objects.create(
                product=product,
                movement_type=movement_type,
                quantity=quantity,
                reference_number=serializer.validated_data.get('reference_number', ''),
                notes=serializer.validated_data.get('notes', ''),
                created_by=request.user
            )
            
            return Response(ProductSerializer(product).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockMovement.objects.select_related('product', 'created_by').all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset
