from django.contrib import admin
from .models import Expense, ExpenseCategory


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['expense_date', 'category', 'description', 'amount', 'payment_method', 'created_by', 'created_at']
    list_filter = ['category', 'payment_method', 'expense_date', 'created_at']
    search_fields = ['category', 'description', 'reference_number']
    date_hierarchy = 'expense_date'
    readonly_fields = ['created_by', 'created_at', 'updated_at']

