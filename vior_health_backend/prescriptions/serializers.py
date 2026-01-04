from rest_framework import serializers
from .models import Prescription, PrescriptionItem


class PrescriptionItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PrescriptionItem
        fields = ['id', 'product', 'product_name', 'dosage', 'frequency', 'duration', 'quantity', 'instructions']


class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    dispensed_by_name = serializers.CharField(source='dispensed_by.username', read_only=True, allow_null=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['prescription_number', 'created_at', 'updated_at', 'dispensed_at']


class CreatePrescriptionSerializer(serializers.Serializer):
    customer = serializers.IntegerField()
    doctor_name = serializers.CharField(max_length=200)
    doctor_license = serializers.CharField(max_length=100, required=False, allow_blank=True)
    diagnosis = serializers.CharField()
    prescription_date = serializers.DateField()
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required")
        
        for item in value:
            required_fields = ['product', 'dosage', 'frequency', 'duration', 'quantity']
            for field in required_fields:
                if field not in item:
                    raise serializers.ValidationError(f"Each item must have {field}")
        
        return value
