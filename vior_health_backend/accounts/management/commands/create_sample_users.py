from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Create sample users for testing'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                'username': 'admin',
                'email': 'admin@viorhealth.com',
                'password': 'admin123',
                'role': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'username': 'manager',
                'email': 'manager@viorhealth.com',
                'password': 'manager123',
                'role': 'manager',
                'first_name': 'Manager',
                'last_name': 'User',
            },
            {
                'username': 'pharmacist',
                'email': 'pharmacist@viorhealth.com',
                'password': 'pharmacist123',
                'role': 'pharmacist',
                'first_name': 'Pharmacist',
                'last_name': 'User',
            },
            {
                'username': 'cashier',
                'email': 'cashier@viorhealth.com',
                'password': 'cashier123',
                'role': 'cashier',
                'first_name': 'Cashier',
                'last_name': 'User',
            },
        ]

        for user_data in users_data:
            username = user_data['username']
            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.WARNING(f'User "{username}" already exists. Skipping.')
                )
                continue

            password = user_data.pop('password')
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {username} (password: {password})')
            )

        self.stdout.write(self.style.SUCCESS('\nSample users created successfully!'))
        self.stdout.write('\nLogin credentials:')
        self.stdout.write('  Admin:      username: admin      | password: admin123')
        self.stdout.write('  Manager:    username: manager    | password: manager123')
        self.stdout.write('  Pharmacist: username: pharmacist | password: pharmacist123')
        self.stdout.write('  Cashier:    username: cashier    | password: cashier123')
