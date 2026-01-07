from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('pharmacist', 'Pharmacist'),
        ('cashier', 'Cashier'),
        ('lab_technician', 'Lab Technician'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cashier')
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class PharmacySettings(models.Model):
    """
    Store pharmacy configuration and details for receipts and documents
    """
    # Basic Information
    pharmacy_name = models.CharField(max_length=255, help_text="Official pharmacy name")
    business_registration_number = models.CharField(max_length=100, blank=True, null=True)
    tax_id = models.CharField(max_length=100, blank=True, null=True, help_text="Tax ID/VAT number")
    
    # Contact Information
    phone = models.CharField(max_length=50)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)
    
    # Address
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="United States")
    
    # Receipt Settings
    receipt_header = models.TextField(blank=True, null=True, help_text="Custom header text for receipts")
    receipt_footer = models.TextField(blank=True, null=True, help_text="Custom footer text for receipts")
    show_logo_on_receipt = models.BooleanField(default=True)
    
    # Business Hours
    business_hours = models.TextField(blank=True, null=True, help_text="e.g., Mon-Fri: 9AM-8PM")
    
    # Currency and Formatting
    currency_symbol = models.CharField(max_length=10, default="$")
    currency_code = models.CharField(max_length=3, default="USD")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pharmacy_settings_updates')
    
    class Meta:
        verbose_name = "Pharmacy Settings"
        verbose_name_plural = "Pharmacy Settings"
        
    def __str__(self):
        return self.pharmacy_name
    
    @classmethod
    def get_settings(cls):
        """Get or create the pharmacy settings (singleton pattern)"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings
