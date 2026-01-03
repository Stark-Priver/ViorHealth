from rest_framework import serializers
from .models import Category, Supplier, Product, StockMovement


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    profit_margin = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ['created_at']


class ProductStockUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(required=True)
    movement_type = serializers.ChoiceField(choices=['in', 'out', 'adjustment', 'return'])
    reference_number = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
