from rest_framework import serializers
from .models import PharmacySettings


class PharmacySettingsSerializer(serializers.ModelSerializer):
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)
    
    class Meta:
        model = PharmacySettings
        fields = [
            'id',
            'pharmacy_name',
            'business_registration_number',
            'tax_id',
            'phone',
            'email',
            'website',
            'address_line1',
            'address_line2',
            'city',
            'state_province',
            'postal_code',
            'country',
            'receipt_header',
            'receipt_footer',
            'show_logo_on_receipt',
            'business_hours',
            'currency_symbol',
            'currency_code',
            'created_at',
            'updated_at',
            'updated_by',
            'updated_by_username'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'updated_by', 'updated_by_username']
