from django.urls import path
from .views import (
    dashboard_stats, sales_chart, top_products, 
    inventory_summary, recent_activities
)

urlpatterns = [
    path('dashboard-stats/', dashboard_stats, name='dashboard_stats'),
    path('sales-chart/', sales_chart, name='sales_chart'),
    path('top-products/', top_products, name='top_products'),
    path('inventory-summary/', inventory_summary, name='inventory_summary'),
    path('recent-activities/', recent_activities, name='recent_activities'),
]
