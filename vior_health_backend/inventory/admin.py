from django.contrib import admin
from .models import Category, Supplier, Product, StockMovement


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'email', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'contact_person', 'email', 'phone')
    ordering = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'supplier', 'sku', 'unit_price', 'quantity', 'is_low_stock', 'expiry_date', 'is_active')
    list_filter = ('category', 'supplier', 'is_active', 'is_prescription_required')
    search_fields = ('name', 'generic_name', 'sku', 'barcode')
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at', 'is_low_stock', 'profit_margin')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'generic_name', 'category', 'supplier', 'description', 'image')
        }),
        ('Identification', {
            'fields': ('sku', 'barcode', 'batch_number')
        }),
        ('Pricing & Stock', {
            'fields': ('cost_price', 'unit_price', 'quantity', 'reorder_level', 'profit_margin')
        }),
        ('Additional Info', {
            'fields': ('expiry_date', 'is_prescription_required', 'is_active', 'created_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'movement_type', 'quantity', 'reference_number', 'created_by', 'created_at')
    list_filter = ('movement_type', 'created_at')
    search_fields = ('product__name', 'reference_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
