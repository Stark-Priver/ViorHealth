from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from datetime import datetime
from .models import Prescription, PrescriptionItem
from sales.models import Customer
from inventory.models import Product
from .serializers import PrescriptionSerializer, CreatePrescriptionSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related('customer', 'dispensed_by', 'created_by').prefetch_related('items').all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        customer = self.request.query_params.get('customer', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        if customer:
            queryset = queryset.filter(customer_id=customer)
        
        return queryset.order_by('-created_at')

    @action(detail=False, methods=['post'])
    def create_prescription(self, request):
        serializer = CreatePrescriptionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            with transaction.atomic():
                # Generate prescription number
                today = datetime.now()
                prescription_prefix = f"RX{today.strftime('%Y%m%d')}"
                last_prescription = Prescription.objects.filter(
                    prescription_number__startswith=prescription_prefix
                ).order_by('-prescription_number').first()
                
                if last_prescription:
                    last_number = int(last_prescription.prescription_number[-4:])
                    prescription_number = f"{prescription_prefix}{str(last_number + 1).zfill(4)}"
                else:
                    prescription_number = f"{prescription_prefix}0001"
                
                # Create prescription
                prescription = Prescription.objects.create(
                    prescription_number=prescription_number,
                    customer_id=data['customer'],
                    doctor_name=data['doctor_name'],
                    doctor_license=data['doctor_license'],
                    diagnosis=data['diagnosis'],
                    prescription_date=data['prescription_date'],
                    status='pending',
                    notes=data.get('notes', ''),
                    created_by=request.user
                )
                
                # Create prescription items
                for item_data in data['items']:
                    PrescriptionItem.objects.create(
                        prescription=prescription,
                        product_id=item_data['product'],
                        dosage=item_data['dosage'],
                        frequency=item_data['frequency'],
                        duration=item_data['duration'],
                        quantity=item_data['quantity'],
                        instructions=item_data.get('instructions', '')
                    )
                
                return Response(
                    PrescriptionSerializer(prescription).data,
                    status=status.HTTP_201_CREATED
                )
        
        except Customer.DoesNotExist:
            return Response(
                {'error': 'Customer not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def dispense(self, request, pk=None):
        prescription = self.get_object()
        
        if prescription.status != 'pending':
            return Response(
                {'error': 'Prescription has already been dispensed or cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Check stock for all items
                for item in prescription.items.all():
                    if item.product.quantity < item.quantity:
                        return Response(
                            {'error': f'Insufficient stock for {item.product.name}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                # Update stock
                for item in prescription.items.all():
                    product = item.product
                    product.quantity -= item.quantity
                    product.save()
                
                # Update prescription
                prescription.status = 'dispensed'
                prescription.dispensed_by = request.user
                prescription.dispensed_at = datetime.now()
                prescription.save()
                
                return Response(PrescriptionSerializer(prescription).data)
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        prescription = self.get_object()
        
        if prescription.status == 'dispensed':
            return Response(
                {'error': 'Cannot cancel a dispensed prescription'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        prescription.status = 'cancelled'
        prescription.save()
        
        return Response(PrescriptionSerializer(prescription).data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        prescriptions = self.queryset.filter(status='pending')
        serializer = self.get_serializer(prescriptions, many=True)
        return Response(serializer.data)
