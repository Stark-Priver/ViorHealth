from django.core.management.base import BaseCommand
from laboratory.models import TestType


class Command(BaseCommand):
    help = 'Seeds initial test types with default costs'

    def handle(self, *args, **kwargs):
        test_types = [
            {
                'name': 'Blood Pressure Check',
                'code': 'blood_pressure',
                'description': 'Measurement of systolic and diastolic blood pressure',
                'cost': 5000.00,
                'is_active': True
            },
            {
                'name': 'Blood Sugar Test',
                'code': 'blood_sugar',
                'description': 'Glucose level measurement',
                'cost': 8000.00,
                'is_active': True
            },
            {
                'name': 'Cholesterol Test',
                'code': 'cholesterol',
                'description': 'Total cholesterol, HDL, and LDL measurement',
                'cost': 15000.00,
                'is_active': True
            },
            {
                'name': 'Hemoglobin Test',
                'code': 'hemoglobin',
                'description': 'Hemoglobin level measurement',
                'cost': 10000.00,
                'is_active': True
            },
            {
                'name': 'Urinalysis',
                'code': 'urinalysis',
                'description': 'Complete urine analysis',
                'cost': 12000.00,
                'is_active': True
            },
            {
                'name': 'Pregnancy Test',
                'code': 'pregnancy_test',
                'description': 'HCG pregnancy test',
                'cost': 5000.00,
                'is_active': True
            },
            {
                'name': 'Malaria Test',
                'code': 'malaria_test',
                'description': 'Rapid diagnostic test for malaria',
                'cost': 7000.00,
                'is_active': True
            },
            {
                'name': 'HIV Test',
                'code': 'hiv_test',
                'description': 'Rapid HIV antibody test',
                'cost': 10000.00,
                'is_active': True
            },
        ]

        created_count = 0
        for test_type_data in test_types:
            test_type, created = TestType.objects.get_or_create(
                code=test_type_data['code'],
                defaults=test_type_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created test type: {test_type.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Test type already exists: {test_type.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully seeded {created_count} new test types')
        )
