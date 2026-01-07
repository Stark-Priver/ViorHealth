from django.db import models
from django.conf import settings
from sales.models import Customer


class TestType(models.Model):
    """
    Test types that can be performed in the laboratory
    """
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True, help_text="Unique code for the test type")
    description = models.TextField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Default cost for this test")
    is_active = models.BooleanField(default=True, help_text="Whether this test type is available")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='test_types_created'
    )
    
    class Meta:
        db_table = 'test_types'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.cost}"


class LabTest(models.Model):
    """
    Laboratory test requested by pharmacist or doctor
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed'),
    )
    
    # Test Information
    test_number = models.CharField(max_length=50, unique=True, editable=False)
    test_type = models.ForeignKey(
        TestType,
        on_delete=models.PROTECT,
        related_name='lab_tests',
        help_text="Type of test to perform"
    )
    test_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # Patient Information
    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lab_tests',
        help_text="Customer who is taking the test"
    )
    patient_name = models.CharField(max_length=255)
    patient_age = models.IntegerField(null=True, blank=True)
    patient_gender = models.CharField(max_length=10, choices=(('male', 'Male'), ('female', 'Female'), ('other', 'Other')), blank=True)
    patient_phone = models.CharField(max_length=20, blank=True)
    
    # Cost Information
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Cost of the lab test")
    paid = models.BooleanField(default=False, help_text="Payment status")
    paid_at = models.DateTimeField(null=True, blank=True, help_text="When payment was made")
    payment_method = models.CharField(
        max_length=20, 
        choices=(
            ('cash', 'Cash'),
            ('card', 'Card'),
            ('mobile', 'Mobile Money'),
            ('insurance', 'Insurance'),
        ),
        blank=True,
        null=True,
        help_text="Method of payment"
    )
    
    # Request Information
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='lab_tests_requested'
    )
    requested_at = models.DateTimeField(auto_now_add=True)
    
    # Lab Technician Assignment
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lab_tests_assigned',
        limit_choices_to={'role': 'lab_technician'}
    )
    
    # Status and Results
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Results
    results = models.TextField(blank=True, null=True, help_text="Test results and findings")
    diagnosis = models.TextField(blank=True, null=True, help_text="Medical diagnosis based on test results")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes or observations")
    
    # Review
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lab_tests_reviewed'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lab_tests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['test_number']),
            models.Index(fields=['status']),
            models.Index(fields=['patient_name']),
        ]
    
    def __str__(self):
        return f"{self.test_number} - {self.test_name} ({self.patient_name})"
    
    def save(self, *args, **kwargs):
        if not self.test_number:
            # Generate unique test number
            from django.utils import timezone
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            self.test_number = f"LAB-{timestamp}"
        super().save(*args, **kwargs)


class LabMeasurement(models.Model):
    """
    Individual measurements taken during a lab test
    """
    lab_test = models.ForeignKey(
        LabTest,
        on_delete=models.CASCADE,
        related_name='measurements'
    )
    
    # Measurement Details
    parameter_name = models.CharField(max_length=255, help_text="e.g., Systolic BP, Glucose Level")
    value = models.CharField(max_length=100, help_text="Measured value")
    unit = models.CharField(max_length=50, help_text="e.g., mmHg, mg/dL")
    reference_range = models.CharField(max_length=100, blank=True, help_text="Normal range for this parameter")
    
    # Status
    is_normal = models.BooleanField(default=True, help_text="Is value within normal range?")
    
    # Technician who took the measurement
    measured_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='measurements_taken'
    )
    measured_at = models.DateTimeField(auto_now_add=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lab_measurements'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.parameter_name}: {self.value} {self.unit}"
