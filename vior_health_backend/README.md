# VIOR Health Backend - Quick Start Guide

## Setup Instructions

### 1. Install Dependencies
```bash
cd vior_health_backend
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create Sample Users
```bash
python manage.py create_sample_users
```

This will create the following test users:
- **Admin**: username: `admin` | password: `admin123`
- **Manager**: username: `manager` | password: `manager123`
- **Pharmacist**: username: `pharmacist` | password: `pharmacist123`
- **Cashier**: username: `cashier` | password: `cashier123`

### 4. Start Development Server
```bash
python manage.py runserver
```

The API will be available at: http://localhost:8000/api/

## API Endpoints

### Authentication
- POST `/api/accounts/login/` - Login (returns JWT tokens)
- POST `/api/accounts/register/` - Register new user
- POST `/api/accounts/token/refresh/` - Refresh JWT token
- GET `/api/accounts/users/me/` - Get current user info

### Inventory
- GET/POST `/api/inventory/products/` - List/Create products
- GET/PUT/DELETE `/api/inventory/products/{id}/` - Product details
- GET `/api/inventory/categories/` - List categories
- GET `/api/inventory/suppliers/` - List suppliers

### Sales
- GET/POST `/api/sales/sales/` - List/Create sales
- POST `/api/sales/sales/create_sale/` - Create sale with items
- GET `/api/sales/customers/` - List customers

### Prescriptions
- GET/POST `/api/prescriptions/prescriptions/` - List/Create prescriptions
- POST `/api/prescriptions/prescriptions/create_prescription/` - Create prescription
- POST `/api/prescriptions/prescriptions/{id}/dispense/` - Dispense prescription

### Analytics
- GET `/api/analytics/dashboard-stats/` - Dashboard statistics
- GET `/api/analytics/sales-chart/` - Sales chart data
- GET `/api/analytics/recent-activities/` - Recent activities

## Role-Based Access

- **Admin**: Full system access
- **Manager**: Inventory, sales, reports, settings
- **Pharmacist**: Inventory, sales, prescriptions
- **Cashier**: Sales, customers only

## Frontend Integration

The frontend is configured to connect to the backend via `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Login credentials are the same as above.
