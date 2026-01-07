from django.core.management.base import BaseCommand
from expenses.models import ExpenseCategory


class Command(BaseCommand):
    help = 'Create default expense categories'

    def handle(self, *args, **kwargs):
        default_categories = [
            {'name': 'Utilities', 'description': 'Electricity, water, internet, and other utilities'},
            {'name': 'Salaries', 'description': 'Employee salaries and wages'},
            {'name': 'Rent', 'description': 'Office or building rent payments'},
            {'name': 'Supplies', 'description': 'Office supplies and materials'},
            {'name': 'Marketing', 'description': 'Marketing and advertising expenses'},
            {'name': 'Maintenance', 'description': 'Equipment and facility maintenance'},
            {'name': 'Transportation', 'description': 'Vehicle fuel, repairs, and transportation costs'},
            {'name': 'Insurance', 'description': 'Insurance premiums and coverage'},
            {'name': 'Taxes', 'description': 'Tax payments and related fees'},
            {'name': 'Equipment', 'description': 'Equipment purchases and upgrades'},
            {'name': 'Professional Services', 'description': 'Legal, accounting, and consulting services'},
            {'name': 'Training', 'description': 'Employee training and development'},
            {'name': 'Other', 'description': 'Miscellaneous expenses'},
        ]

        created_count = 0
        for cat_data in default_categories:
            category, created = ExpenseCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
            else:
                self.stdout.write(f'Category already exists: {category.name}')

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} new categories'))
