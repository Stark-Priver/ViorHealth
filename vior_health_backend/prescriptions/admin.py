from django.contrib import admin
from .models import Prescription, PrescriptionItem


class PrescriptionItemInline(admin.TabularInline):
    model = PrescriptionItem
    extra = 0


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('prescription_number', 'customer', 'doctor_name', 'prescription_date', 'status', 'dispensed_by', 'created_at')
    list_filter = ('status', 'prescription_date', 'created_at')
    search_fields = ('prescription_number', 'customer__name', 'doctor_name', 'doctor_license')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PrescriptionItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('prescription_number', 'customer', 'prescription_date')
        }),
        ('Doctor Information', {
            'fields': ('doctor_name', 'doctor_license', 'diagnosis')
        }),
        ('Status', {
            'fields': ('status', 'dispensed_by', 'dispensed_at', 'notes')
        }),
        ('Audit', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )


@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ('prescription', 'product', 'dosage', 'frequency', 'duration', 'quantity')
    search_fields = ('prescription__prescription_number', 'product__name')
    ordering = ('-prescription__created_at',)
