from django.contrib import admin
from .models import TestType, LabTest, LabMeasurement


@admin.register(TestType)
class TestTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'cost', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(LabTest)
class LabTestAdmin(admin.ModelAdmin):
    list_display = ['test_number', 'test_name', 'patient_name', 'status', 'assigned_to', 'created_at']
    list_filter = ['status', 'test_type', 'created_at']
    search_fields = ['test_number', 'patient_name', 'test_name']
    readonly_fields = ['test_number', 'created_at', 'updated_at']


@admin.register(LabMeasurement)
class LabMeasurementAdmin(admin.ModelAdmin):
    list_display = ['lab_test', 'parameter_name', 'value', 'unit', 'is_normal', 'measured_at']
    list_filter = ['is_normal', 'measured_at']
    search_fields = ['parameter_name', 'lab_test__test_number']
