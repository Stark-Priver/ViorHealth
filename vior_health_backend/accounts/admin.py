from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, PharmacySettings


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'phone', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'phone')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'address', 'profile_image')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PharmacySettings)
class PharmacySettingsAdmin(admin.ModelAdmin):
    list_display = ('pharmacy_name', 'phone', 'email', 'city', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('pharmacy_name', 'business_registration_number', 'tax_id')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'website')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state_province', 'postal_code', 'country')
        }),
        ('Receipt Settings', {
            'fields': ('receipt_header', 'receipt_footer', 'show_logo_on_receipt', 'business_hours')
        }),
        ('Currency', {
            'fields': ('currency_symbol', 'currency_code')
        }),
        ('Metadata', {
            'fields': ('updated_by', 'created_at', 'updated_at')
        }),
    )
