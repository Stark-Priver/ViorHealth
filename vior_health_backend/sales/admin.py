from django.contrib import admin
from .models import Customer, Sale, SaleItem


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'date_of_birth', 'created_at')
    search_fields = ('name', 'email', 'phone')
    ordering = ('name',)


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ('total',)


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer', 'total', 'payment_method', 'status', 'cashier', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('invoice_number', 'customer__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SaleItemInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('invoice_number', 'customer', 'cashier')
        }),
        ('Amounts', {
            'fields': ('subtotal', 'tax', 'discount', 'total', 'amount_paid', 'change_amount')
        }),
        ('Payment & Status', {
            'fields': ('payment_method', 'status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    list_display = ('sale', 'product', 'quantity', 'unit_price', 'discount', 'total')
    search_fields = ('sale__invoice_number', 'product__name')
    ordering = ('-sale__created_at',)
