from rest_framework import serializers
from .models import Customer, Sale, SaleItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'discount', 'total']
        read_only_fields = ['total']


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    cashier_name = serializers.CharField(source='cashier.username', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['invoice_number', 'created_at', 'updated_at']


class CreateSaleSerializer(serializers.Serializer):
    customer = serializers.IntegerField(required=False, allow_null=True)
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )
    payment_method = serializers.ChoiceField(choices=['cash', 'card', 'mobile', 'insurance'])
    amount_paid = serializers.DecimalField(max_digits=10, decimal_places=2)
    discount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required")
        
        for item in value:
            if 'product' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have product and quantity")
        
        return value
