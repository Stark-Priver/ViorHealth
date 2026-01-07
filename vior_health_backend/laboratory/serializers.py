from rest_framework import serializers
from .models import TestType, LabTest, LabMeasurement
from accounts.serializers import UserSerializer


class TestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestType
        fields = [
            'id', 'name', 'code', 'description', 'cost', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class LabMeasurementSerializer(serializers.ModelSerializer):
    measured_by_name = serializers.CharField(source='measured_by.get_full_name', read_only=True)
    
    class Meta:
        model = LabMeasurement
        fields = [
            'id', 'lab_test', 'parameter_name', 'value', 'unit',
            'reference_range', 'is_normal', 'measured_by', 'measured_by_name',
            'measured_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['measured_at', 'created_at', 'updated_at']


class LabTestSerializer(serializers.ModelSerializer):
    measurements = LabMeasurementSerializer(many=True, read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    test_type_name = serializers.CharField(source='test_type.name', read_only=True)
    test_type_code = serializers.CharField(source='test_type.code', read_only=True)
    
    class Meta:
        model = LabTest
        fields = [
            'id', 'test_number', 'test_type', 'test_type_name', 'test_type_code',
            'test_name', 'description',
            'patient_name', 'patient_age', 'patient_gender', 'patient_phone',
            'cost', 'paid',
            'requested_by', 'requested_by_name', 'requested_at',
            'assigned_to', 'assigned_to_name',
            'status', 'started_at', 'completed_at',
            'results', 'diagnosis', 'notes',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at',
            'measurements', 'created_at', 'updated_at'
        ]
        read_only_fields = ['test_number', 'requested_at', 'created_at', 'updated_at']


class LabTestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = [
            'test_type', 'test_name', 'description',
            'patient_name', 'patient_age', 'patient_gender', 'patient_phone',
            'cost', 'paid',
            'assigned_to'
        ]
