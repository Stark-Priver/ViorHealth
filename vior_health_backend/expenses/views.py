from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Expense, ExpenseCategory
from .serializers import ExpenseSerializer, ExpenseCategorySerializer


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['category', 'description', 'reference_number']
    ordering_fields = ['expense_date', 'amount', 'created_at']

    def get_queryset(self):
        queryset = Expense.objects.all()
        
        # Non-admin users can only see their own expenses
        if not self.request.user.is_staff and self.request.user.role != 'admin':
            queryset = queryset.filter(created_by=self.request.user)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(expense_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(expense_date__lte=end_date)
        
        # Filter by payment method
        payment_method = self.request.query_params.get('payment_method', None)
        if payment_method:
            queryset = queryset.filter(payment_method=payment_method)
        
        return queryset

    def update(self, request, *args, **kwargs):
        """Override update to check if expense can be edited"""
        expense = self.get_object()
        user = request.user
        
        # Admin can edit any expense
        if user.is_staff or user.role == 'admin':
            return super().update(request, *args, **kwargs)
        
        # Non-admin can only edit their own unapproved expenses
        if expense.created_by != user:
            return Response(
                {'error': 'You can only edit your own expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if expense.is_approved:
            return Response(
                {'error': 'This expense has been approved and cannot be edited. Please contact an administrator.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Override delete to check permissions"""
        expense = self.get_object()
        user = request.user
        
        # Admin can delete any expense
        if user.is_staff or user.role == 'admin':
            return super().destroy(request, *args, **kwargs)
        
        # Non-admin can only delete their own unapproved expenses
        if expense.created_by != user:
            return Response(
                {'error': 'You can only delete your own expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if expense.is_approved:
            return Response(
                {'error': 'This expense has been approved and cannot be deleted. Please contact an administrator.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an expense (admin only)"""
        user = request.user
        
        if not (user.is_staff or user.role == 'admin'):
            return Response(
                {'error': 'Only administrators can approve expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        expense = self.get_object()
        expense.is_approved = True
        expense.approved_by = user
        expense.approved_at = timezone.now()
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unapprove(self, request, pk=None):
        """Unapprove an expense (admin only)"""
        user = request.user
        
        if not (user.is_staff or user.role == 'admin'):
            return Response(
                {'error': 'Only administrators can unapprove expenses'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        expense = self.get_object()
        expense.is_approved = False
        expense.approved_by = None
        expense.approved_at = None
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get expense summary statistics"""
        today = datetime.now().date()
        month_start = today.replace(day=1)
        year_start = today.replace(month=1, day=1)
        
        # Filter by user if not admin
        queryset = Expense.objects.all()
        if not request.user.is_staff and request.user.role != 'admin':
            queryset = queryset.filter(created_by=request.user)
        
        # Total expenses
        total_expenses = queryset.aggregate(total=Sum('amount'))['total'] or 0
        
        # Today's expenses
        today_expenses = queryset.filter(expense_date=today).aggregate(total=Sum('amount'))['total'] or 0
        
        # This month's expenses
        month_expenses = queryset.filter(expense_date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        
        # This year's expenses
        year_expenses = queryset.filter(expense_date__gte=year_start).aggregate(total=Sum('amount'))['total'] or 0
        
        # Expenses by category (this month)
        expenses_by_category = queryset.filter(
            expense_date__gte=month_start
        ).values('category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')
        
        # Monthly trend (last 6 months)
        six_months_ago = month_start - timedelta(days=180)
        monthly_trend = queryset.filter(
            expense_date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('expense_date')
        ).values('month').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('month')
        
        return Response({
            'total_expenses': float(total_expenses),
            'today_expenses': float(today_expenses),
            'month_expenses': float(month_expenses),
            'year_expenses': float(year_expenses),
            'expenses_by_category': list(expenses_by_category),
            'monthly_trend': list(monthly_trend)
        })

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        
        # Filter by user if not admin
        if not request.user.is_staff and request.user.role != 'admin':
            queryset = queryset.filter(created_by=request.user)
        
        """Get expenses grouped by category"""
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)
        
        queryset = Expense.objects.all()
        if start_date:
            queryset = queryset.filter(expense_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(expense_date__lte=end_date)
        
        expenses_by_category = queryset.values('category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')
        
        return Response(expenses_by_category)

