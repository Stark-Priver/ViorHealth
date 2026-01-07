from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .models import TestType, LabTest, LabMeasurement
from .serializers import TestTypeSerializer, LabTestSerializer, LabTestCreateSerializer, LabMeasurementSerializer


class TestTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing test types (admin/manager only)
    """
    queryset = TestType.objects.all()
    serializer_class = TestTypeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = TestType.objects.all()
        
        # Filter active test types for non-admin users
        if self.request.user.role not in ['admin', 'manager']:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def perform_create(self, serializer):
        # Save the user who created the test type
        serializer.save(created_by=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Only admin and manager can create test types
        if request.user.role not in ['admin', 'manager']:
            return Response(
                {'error': 'Only admin and manager can create test types'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Only admin and manager can update test types
        if request.user.role not in ['admin', 'manager']:
            return Response(
                {'error': 'Only admin and manager can update test types'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Only admin and manager can delete test types
        if request.user.role not in ['admin', 'manager']:
            return Response(
                {'error': 'Only admin and manager can delete test types'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class LabTestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing laboratory tests
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = LabTest.objects.select_related(
            'requested_by', 'assigned_to', 'reviewed_by'
        ).prefetch_related('measurements')
        
        # Filter based on user role
        if user.role == 'lab_technician':
            # Lab technicians see tests assigned to them
            queryset = queryset.filter(assigned_to=user)
        elif user.role in ['pharmacist', 'manager', 'admin']:
            # Pharmacists, managers, and admins see all tests
            pass
        else:
            # Other roles see tests they requested
            queryset = queryset.filter(requested_by=user)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LabTestCreateSerializer
        return LabTestSerializer
    
    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Override create to return full serialized data"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Use the detail serializer for the response
        instance = serializer.instance
        output_serializer = LabTestSerializer(instance)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=['post'])
    def start_test(self, request, pk=None):
        """Start working on a test"""
        lab_test = self.get_object()
        
        if lab_test.status != 'pending':
            return Response(
                {'error': 'Test has already been started'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lab_test.status = 'in_progress'
        lab_test.started_at = timezone.now()
        if not lab_test.assigned_to:
            lab_test.assigned_to = request.user
        lab_test.save()
        
        serializer = self.get_serializer(lab_test)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete_test(self, request, pk=None):
        """Mark test as completed"""
        lab_test = self.get_object()
        
        if lab_test.status == 'completed':
            return Response(
                {'error': 'Test is already completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lab_test.status = 'completed'
        lab_test.completed_at = timezone.now()
        lab_test.results = request.data.get('results', lab_test.results)
        lab_test.diagnosis = request.data.get('diagnosis', lab_test.diagnosis)
        lab_test.notes = request.data.get('notes', lab_test.notes)
        lab_test.save()
        
        serializer = self.get_serializer(lab_test)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_paid(self, request, pk=None):
        """Mark test as paid"""
        lab_test = self.get_object()
        
        if lab_test.paid:
            return Response(
                {'error': 'Test is already marked as paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lab_test.paid = True
        lab_test.paid_at = timezone.now()
        lab_test.payment_method = request.data.get('payment_method', 'cash')
        lab_test.save()
        
        serializer = self.get_serializer(lab_test)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def review_test(self, request, pk=None):
        """Review completed test (pharmacist/admin)"""
        lab_test = self.get_object()
        
        if lab_test.status != 'completed':
            return Response(
                {'error': 'Test must be completed before review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if request.user.role not in ['pharmacist', 'manager', 'admin']:
            return Response(
                {'error': 'Only pharmacists, managers, or admins can review tests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        lab_test.status = 'reviewed'
        lab_test.reviewed_by = request.user
        lab_test.reviewed_at = timezone.now()
        lab_test.save()
        
        serializer = self.get_serializer(lab_test)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get laboratory statistics"""
        user = request.user
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'completed': queryset.filter(status='completed').count(),
            'reviewed': queryset.filter(status='reviewed').count(),
        }
        
        return Response(stats)


class LabMeasurementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing laboratory measurements
    """
    serializer_class = LabMeasurementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = LabMeasurement.objects.select_related('lab_test', 'measured_by')
        
        # Filter based on lab test access
        if user.role == 'lab_technician':
            queryset = queryset.filter(lab_test__assigned_to=user)
        elif user.role in ['pharmacist', 'manager', 'admin']:
            pass
        else:
            queryset = queryset.filter(lab_test__requested_by=user)
        
        # Filter by lab test if provided
        lab_test_id = self.request.query_params.get('lab_test')
        if lab_test_id and lab_test_id != 'undefined':
            try:
                queryset = queryset.filter(lab_test_id=int(lab_test_id))
            except (ValueError, TypeError):
                # Invalid ID format, return empty queryset
                return queryset.none()
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(measured_by=self.request.user)
