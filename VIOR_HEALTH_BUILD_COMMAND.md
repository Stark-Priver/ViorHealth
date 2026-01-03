# VIOR HEALTH - Professional Build Command for AI Agent

## 🎯 PROJECT OVERVIEW

Build a **professional, enterprise-grade Pharmacy Management System** called **Vior Health Integrated Pharmacy Management System** (PRITECH VIOR Platform).

## ✅ PROJECT STATUS - COMPLETE

### Completed Features
- ✅ Full React frontend (34 files, 25+ components)
- ✅ Simplified landing page with TSH pricing
- ✅ Django REST API backend with JWT authentication
- ✅ Role-based access control (Admin, Manager, Pharmacist, Cashier)
- ✅ All database models created and migrated
- ✅ Admin panel configured for all models
- ✅ API endpoints for inventory, sales, prescriptions, analytics
- ✅ Protected routes with user authentication
- ✅ Environment variable configuration

## 🚀 Quick Start Guide

### Backend Setup

```bash
# Navigate to backend directory
cd vior_health_backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample users (admin, manager, pharmacist, cashier)
python manage.py create_sample_users

# Start development server
python manage.py runserver
```

**Backend URL**: http://localhost:8000/api/
**Admin Panel**: http://localhost:8000/admin/

### Frontend Setup

```bash
# Navigate to frontend directory
cd vior-health-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend URL**: http://localhost:5173/

## 🔐 Login Credentials

Test users created by `create_sample_users` command:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | admin | admin123 | Full system access |
| **Manager** | manager | manager123 | Inventory, sales, reports, settings |
| **Pharmacist** | pharmacist | pharmacist123 | Inventory, sales, prescriptions |
| **Cashier** | cashier | cashier123 | Sales, customers only |

## 🏗️ System Architecture

---

## 📋 TECHNICAL STACK

### Frontend
- **Framework**: React 18+ with Hooks
- **Styling**: Tailwind CSS + Custom CSS for advanced animations
- **State Management**: React Context API or Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts/Visualization**: Recharts or Chart.js
- **Icons**: Lucide React
- **Date Handling**: date-fns or Day.js
- **Forms**: React Hook Form + Yup validation
- **Notifications**: React-Toastify or Sonner

### Backend
- **Framework**: Django 5.0+ with Django REST Framework (DRF)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT with djangorestframework-simplejwt
- **API Documentation**: drf-spectacular (OpenAPI/Swagger)
- **CORS**: django-cors-headers
- **Environment**: python-decouple for config management

---

## 🏗️ SYSTEM ARCHITECTURE

### Frontend Structure
```
vior-health-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Loader.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── Charts.jsx
│   │   ├── prescriptions/
│   │   │   ├── PrescriptionList.jsx
│   │   │   ├── PrescriptionForm.jsx
│   │   │   └── PrescriptionDetail.jsx
│   │   ├── inventory/
│   │   │   ├── InventoryList.jsx
│   │   │   ├── InventoryForm.jsx
│   │   │   ├── StockAlerts.jsx
│   │   │   └── ExpiryTracker.jsx
│   │   ├── sales/
│   │   │   ├── POSInterface.jsx
│   │   │   ├── SalesHistory.jsx
│   │   │   └── Receipt.jsx
│   │   ├── suppliers/
│   │   │   ├── SupplierList.jsx
│   │   │   ├── SupplierForm.jsx
│   │   │   └── ProcurementOrders.jsx
│   │   ├── reports/
│   │   │   ├── SalesReports.jsx
│   │   │   ├── InventoryReports.jsx
│   │   │   └── AuditLogs.jsx
│   │   └── users/
│   │       ├── UserManagement.jsx
│   │       ├── RolePermissions.jsx
│   │       └── UserProfile.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PrescriptionsPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── SalesPage.jsx
│   │   ├── SuppliersPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── prescriptionService.js
│   │   ├── inventoryService.js
│   │   ├── salesService.js
│   │   └── reportService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── App.jsx
│   └── index.js
├── package.json
├── tailwind.config.js
└── vite.config.js (or craco.config.js for CRA)
```

### Backend Structure
```
vior-health-backend/
├── vior_health/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── authentication/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── prescriptions/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── filters.py
│   ├── inventory/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tasks.py (for expiry alerts)
│   ├── sales/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── suppliers/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── reports/
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   └── users/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
├── requirements.txt
├── manage.py
├── .env.example
└── README.md
```

---

## 🎨 DESIGN REQUIREMENTS

### Design Aesthetic
- **Style**: Modern, clinical, professional with a healthcare-focused design
- **Color Palette**: 
  - Primary: Medical blue (#0066CC, #1E88E5)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Danger: Red (#EF4444)
  - Neutral: Gray scale (#F9FAFB to #111827)
- **Typography**: 
  - Headings: 'Outfit', 'Plus Jakarta Sans', or 'Clash Display' (modern, professional)
  - Body: 'Inter', 'DM Sans', or 'Manrope' (clean, readable)
- **Layout**: Clean, spacious, card-based design with subtle shadows
- **Animations**: Smooth transitions, micro-interactions on hover/click
- **Responsive**: Mobile-first design, works perfectly on tablets and phones

### UI Components to Include
- Professional navigation sidebar with icons
- Top navbar with search, notifications, and user profile
- Dashboard cards with statistics and trends
- Data tables with sorting, filtering, and pagination
- Modal dialogs for forms and confirmations
- Toast notifications for user feedback
- Loading states and skeletons
- Empty states with helpful messages
- Dropdown menus and select inputs
- Date pickers and time selectors
- Charts (line, bar, pie) for analytics

---

## 🔧 CORE MODULES & FEATURES

### 1. **Authentication & Authorization**
**Frontend:**
- Login page with email/password
- JWT token storage in localStorage/cookies
- Protected routes with authentication checks
- Role-based access control (Admin, Pharmacist, Cashier)
- Automatic token refresh
- Logout functionality

**Backend:**
- Custom User model with roles
- JWT authentication endpoints
- Token refresh mechanism
- Password reset functionality
- Role and permission system

**API Endpoints:**
```
POST   /api/auth/login/
POST   /api/auth/register/
POST   /api/auth/logout/
POST   /api/auth/refresh/
POST   /api/auth/password-reset/
GET    /api/auth/me/
```

---

### 2. **Dashboard**
**Frontend:**
- Overview statistics cards:
  - Total prescriptions (today/month)
  - Active inventory items
  - Low stock alerts
  - Total sales (today/month)
  - Expiring items (next 30 days)
- Line chart: Sales trend (last 7 days)
- Bar chart: Top-selling medications
- Recent prescription activity feed
- Quick actions (New prescription, Add stock, POS sale)

**Backend:**
- Dashboard analytics endpoint
- Real-time statistics aggregation
- Trend calculation

**API Endpoints:**
```
GET    /api/dashboard/stats/
GET    /api/dashboard/trends/
GET    /api/dashboard/recent-activity/
```

---

### 3. **Prescription Management**
**Frontend:**
- List view with filters (status, date, priority)
- Search by patient name, prescription ID, medication
- Create new prescription form:
  - Patient information
  - Doctor details
  - Medication name and dosage
  - Quantity
  - Priority level (Normal, High, Urgent)
  - Special instructions
- Edit prescription
- View prescription details
- Update prescription status (Pending → Processing → Completed → Dispensed)
- Print prescription

**Backend:**
- Prescription model with all fields
- CRUD operations
- Status workflow validation
- Search and filter functionality
- Audit trail for changes

**API Endpoints:**
```
GET    /api/prescriptions/
POST   /api/prescriptions/
GET    /api/prescriptions/{id}/
PUT    /api/prescriptions/{id}/
PATCH  /api/prescriptions/{id}/
DELETE /api/prescriptions/{id}/
GET    /api/prescriptions/search/?q=<query>
POST   /api/prescriptions/{id}/update-status/
```

---

### 4. **Drug Inventory & Stock Management**
**Frontend:**
- Inventory list with columns:
  - Drug name, category, stock level, price
  - Batch number, expiry date, supplier
- Color-coded stock status:
  - Green: Stock > Min Stock
  - Yellow: Stock ≤ Min Stock
  - Red: Stock critical (< 20% of min stock)
- Add new drug form
- Update stock quantity
- Set minimum stock thresholds
- Bulk import via CSV
- Stock adjustment history
- Low stock alerts section
- Expiry tracker (items expiring in 30/60/90 days)

**Backend:**
- Drug/Medication model
- Stock tracking
- Batch and expiry management
- Low stock alert system
- Stock movement history
- Automated expiry notifications

**API Endpoints:**
```
GET    /api/inventory/
POST   /api/inventory/
GET    /api/inventory/{id}/
PUT    /api/inventory/{id}/
DELETE /api/inventory/{id}/
GET    /api/inventory/low-stock/
GET    /api/inventory/expiring-soon/
POST   /api/inventory/{id}/adjust-stock/
POST   /api/inventory/bulk-upload/
GET    /api/inventory/stock-history/{id}/
```

---

### 5. **Expiry & Batch Monitoring**
**Frontend:**
- Calendar view of expiring items
- List view with filters (30/60/90 days)
- Alert badges for critical expiries
- Batch tracking table
- Disposal records for expired items

**Backend:**
- Batch model linked to inventory
- Expiry calculation and alerts
- Disposal tracking
- Background task for daily expiry checks (Celery)

**API Endpoints:**
```
GET    /api/batches/
GET    /api/batches/expiring-soon/
POST   /api/batches/{id}/mark-disposed/
GET    /api/batches/disposal-records/
```

---

### 6. **Sales & POS Management**
**Frontend:**
- POS interface:
  - Search medication by name/barcode
  - Add items to cart
  - Apply discounts
  - Calculate total, tax, change
  - Multiple payment methods (Cash, Card, Insurance)
  - Print receipt
- Sales history table
- Daily sales summary
- Invoice generation
- Return/refund functionality

**Backend:**
- Sale/Transaction model
- Sale items (line items)
- Payment processing
- Receipt generation
- Stock deduction on sale
- Sales analytics

**API Endpoints:**
```
GET    /api/sales/
POST   /api/sales/
GET    /api/sales/{id}/
GET    /api/sales/daily-summary/
POST   /api/sales/{id}/refund/
GET    /api/sales/{id}/receipt/
```

---

### 7. **Supplier & Procurement Management**
**Frontend:**
- Supplier directory
- Add/Edit supplier details
- Purchase order creation
- Track order status (Pending, Shipped, Received)
- Delivery verification
- Supplier performance metrics

**Backend:**
- Supplier model
- Purchase order model
- Order items
- Delivery tracking
- Supplier rating system

**API Endpoints:**
```
GET    /api/suppliers/
POST   /api/suppliers/
GET    /api/suppliers/{id}/
PUT    /api/suppliers/{id}/
DELETE /api/suppliers/{id}/
GET    /api/purchase-orders/
POST   /api/purchase-orders/
PATCH  /api/purchase-orders/{id}/update-status/
```

---

### 8. **User Management & Roles**
**Frontend:**
- User list (Admin only)
- Add new user with role assignment
- Edit user details
- Deactivate/Activate users
- Role management (Admin, Pharmacist, Cashier)
- Permission settings per role

**Backend:**
- Custom user model with roles
- Role-based permissions
- User CRUD operations
- Permission checking middleware

**API Endpoints:**
```
GET    /api/users/
POST   /api/users/
GET    /api/users/{id}/
PUT    /api/users/{id}/
DELETE /api/users/{id}/
GET    /api/roles/
POST   /api/users/{id}/assign-role/
```

---

### 9. **Reports & Analytics**
**Frontend:**
- Sales reports:
  - Daily, weekly, monthly, custom range
  - Revenue trends
  - Top-selling medications
  - Payment method breakdown
- Inventory reports:
  - Stock valuation
  - Stock movement
  - Expiry reports
  - Supplier performance
- Export to PDF/Excel
- Visual charts and graphs

**Backend:**
- Report generation service
- Data aggregation
- PDF generation (ReportLab or WeasyPrint)
- Excel export (openpyxl)

**API Endpoints:**
```
GET    /api/reports/sales/
GET    /api/reports/inventory/
GET    /api/reports/prescriptions/
POST   /api/reports/generate-pdf/
POST   /api/reports/export-excel/
```

---

### 10. **Audit Logs & Security**
**Frontend:**
- Activity log viewer (Admin only)
- Filter by user, action, date
- Export audit logs

**Backend:**
- Audit log model
- Automatic logging of all CRUD operations
- User action tracking
- IP address and timestamp logging

**API Endpoints:**
```
GET    /api/audit-logs/
GET    /api/audit-logs/user/{user_id}/
```

---

## 🔐 SECURITY REQUIREMENTS

### Frontend Security
- Store JWT tokens securely (httpOnly cookies preferred)
- Implement CSRF protection
- Sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting on API calls
- Handle authentication errors gracefully

### Backend Security
- Use Django's built-in security features
- Implement JWT token expiration and refresh
- Rate limiting with django-ratelimit
- SQL injection protection (ORM)
- XSS protection
- CORS configuration for frontend domain only
- Secure password storage (Django's default)
- Environment variable for secrets
- Input validation and sanitization
- Role-based access control on all endpoints

---

## 📊 DATABASE MODELS (Django)

### User Model
```python
- id (UUID, primary key)
- email (unique)
- first_name
- last_name
- role (choices: admin, pharmacist, cashier)
- phone
- is_active
- date_joined
- last_login
```

### Prescription Model
```python
- id (UUID, primary key)
- prescription_number (unique)
- patient_name
- patient_phone
- patient_email
- doctor_name
- doctor_license
- medication (ForeignKey to Drug)
- dosage
- quantity
- priority (choices: normal, high, urgent)
- status (choices: pending, processing, completed, dispensed, cancelled)
- special_instructions
- prescribed_date
- dispensed_date
- dispensed_by (ForeignKey to User)
- created_at
- updated_at
```

### Drug/Medication Model
```python
- id (UUID, primary key)
- name
- generic_name
- category (choices: antibiotic, cardiovascular, diabetes, painkiller, etc.)
- description
- manufacturer
- unit_type (choices: tablet, capsule, syrup, injection, etc.)
- price
- stock_quantity
- min_stock_level
- reorder_level
- location (storage location)
- requires_prescription (boolean)
- created_at
- updated_at
```

### Batch Model
```python
- id (UUID, primary key)
- drug (ForeignKey to Drug)
- batch_number
- quantity
- manufacture_date
- expiry_date
- supplier (ForeignKey to Supplier)
- purchase_date
- purchase_price
- is_expired (computed)
- is_disposed (boolean)
- disposal_date
- disposal_reason
```

### Sale/Transaction Model
```python
- id (UUID, primary key)
- transaction_number (unique)
- customer_name
- customer_phone
- sale_date
- total_amount
- tax_amount
- discount_amount
- grand_total
- payment_method (choices: cash, card, insurance, mobile_money)
- payment_status (choices: pending, completed, refunded)
- cashier (ForeignKey to User)
- created_at
```

### SaleItem Model
```python
- id (UUID, primary key)
- sale (ForeignKey to Sale)
- drug (ForeignKey to Drug)
- batch (ForeignKey to Batch)
- quantity
- unit_price
- discount
- subtotal
```

### Supplier Model
```python
- id (UUID, primary key)
- name
- contact_person
- email
- phone
- address
- city
- country
- rating
- is_active
- created_at
```

### PurchaseOrder Model
```python
- id (UUID, primary key)
- order_number (unique)
- supplier (ForeignKey to Supplier)
- order_date
- expected_delivery_date
- actual_delivery_date
- status (choices: pending, confirmed, shipped, received, cancelled)
- total_amount
- created_by (ForeignKey to User)
- notes
```

### PurchaseOrderItem Model
```python
- id (UUID, primary key)
- purchase_order (ForeignKey to PurchaseOrder)
- drug (ForeignKey to Drug)
- quantity_ordered
- quantity_received
- unit_price
- subtotal
```

### AuditLog Model
```python
- id (UUID, primary key)
- user (ForeignKey to User)
- action (choices: create, read, update, delete)
- model_name
- object_id
- changes (JSONField)
- ip_address
- timestamp
```

---

## 🚀 IMPLEMENTATION INSTRUCTIONS

### Phase 1: Setup & Configuration

**Frontend:**
```bash
# Create React app
npx create-react-app vior-health-frontend
cd vior-health-frontend

# Install dependencies
npm install react-router-dom axios recharts lucide-react
npm install react-hook-form yup @hookform/resolvers
npm install react-toastify date-fns
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure Tailwind
# Update tailwind.config.js and add custom colors
```

**Backend:**
```bash
# Create Django project
django-admin startproject vior_health
cd vior_health

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt
pip install django-cors-headers drf-spectacular
pip install python-decouple psycopg2-binary pillow
pip install django-filter

# Create apps
python manage.py startapp authentication
python manage.py startapp prescriptions
python manage.py startapp inventory
python manage.py startapp sales
python manage.py startapp suppliers
python manage.py startapp reports
python manage.py startapp users

# Configure settings.py
# Add INSTALLED_APPS, REST_FRAMEWORK, CORS, etc.
```

---

### Phase 2: Backend Development

1. **Configure Django settings** (JWT, CORS, REST Framework)
2. **Create all models** in respective apps
3. **Create serializers** for each model
4. **Implement ViewSets** with proper permissions
5. **Configure URLs** for all endpoints
6. **Add authentication** (JWT login, register, refresh)
7. **Implement role-based permissions**
8. **Add filtering and search** functionality
9. **Create audit logging** middleware
10. **Write API documentation** with drf-spectacular
11. **Add data validation** and error handling
12. **Create management commands** for initial data seeding

---

### Phase 3: Frontend Development

1. **Setup routing** with React Router
2. **Create authentication context** and protected routes
3. **Build API service layer** with Axios
4. **Implement authentication** (login, token management)
5. **Create layout components** (Navbar, Sidebar)
6. **Build Dashboard page** with stats and charts
7. **Create Prescription module** (list, form, detail)
8. **Build Inventory module** with alerts
9. **Implement POS/Sales interface**
10. **Create Supplier management**
11. **Build Reports module** with exports
12. **Add User management** (admin only)
13. **Implement audit log viewer**
14. **Add loading states** and error handling
15. **Create responsive design** for mobile
16. **Add animations** and micro-interactions

---

### Phase 4: Integration & Testing

1. **Connect frontend to backend API**
2. **Test all CRUD operations**
3. **Verify authentication flow**
4. **Test role-based access control**
5. **Check data validation**
6. **Test error handling**
7. **Verify responsive design**
8. **Test on multiple browsers**
9. **Performance optimization**
10. **Security audit**

---

### Phase 5: Deployment Preparation

**Frontend:**
- Build production bundle
- Configure environment variables
- Setup hosting (Vercel, Netlify, etc.)

**Backend:**
- Configure production settings
- Setup PostgreSQL database
- Configure static files and media
- Setup hosting (Railway, Render, DigitalOcean, AWS)
- Configure CORS for production frontend URL
- Setup SSL/HTTPS

---

## 📝 SPECIFIC BUILD INSTRUCTIONS FOR AI AGENT

### Priority Order:
1. ✅ Setup both projects (React + Django)
2. ✅ Build backend authentication system
3. ✅ Create all Django models
4. ✅ Implement core API endpoints
5. ✅ Build frontend authentication
6. ✅ Create Dashboard
7. ✅ Implement Prescription Management
8. ✅ Build Inventory Management
9. ✅ Create POS/Sales system
10. ✅ Add Supplier Management
11. ✅ Implement Reports & Analytics
12. ✅ Add User Management
13. ✅ Implement Audit Logs
14. ✅ Polish UI/UX
15. ✅ Testing & Bug fixes

### Code Quality Standards:
- ✅ Use modern ES6+ JavaScript
- ✅ Follow React best practices (hooks, functional components)
- ✅ Use Django REST Framework best practices
- ✅ Implement proper error handling
- ✅ Add loading states everywhere
- ✅ Write clean, commented code
- ✅ Use consistent naming conventions
- ✅ Implement proper validation
- ✅ Add helpful user feedback (toasts, messages)
- ✅ Make it fully responsive

### Design Requirements:
- ✅ Professional, healthcare-focused aesthetic
- ✅ Clean, modern interface
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation
- ✅ Clear visual hierarchy
- ✅ Consistent color scheme
- ✅ Accessible (WCAG AA)
- ✅ Mobile-first responsive design

---

## 🎯 EXPECTED DELIVERABLES

### Frontend:
- Complete React application
- All pages and components
- Responsive design
- Working authentication
- API integration
- package.json with all dependencies
- README with setup instructions

### Backend:
- Complete Django project
- All apps and models
- REST API with all endpoints
- JWT authentication
- Role-based permissions
- API documentation
- requirements.txt
- README with setup instructions

### Documentation:
- API documentation (Swagger/OpenAPI)
- Setup instructions
- User roles and permissions guide
- Database schema diagram
- Deployment guide

---

## 🔥 FINAL NOTES

This is a **professional, enterprise-grade system**. Every component should:
- Work flawlessly
- Look polished and professional
- Be secure and performant
- Have proper error handling
- Include user feedback
- Be fully documented

**Build this as if it's going into production for a real pharmacy.**

The system should be:
- ✅ Scalable
- ✅ Maintainable  
- ✅ Secure
- ✅ User-friendly
- ✅ Professional
- ✅ Future-proof

---

## 🎨 BRANDING

**Official Name:** Vior Health Integrated Pharmacy Management System  
**Platform:** PRITECH VIOR Platform  
**Tagline:** "Advanced Healthcare Management Solutions"

Use this branding consistently across:
- Login page
- Dashboard header
- Documentation
- Email templates
- Receipts and reports

---

## ✨ BONUS FEATURES (If Time Permits)

- Email notifications for low stock
- SMS notifications for prescriptions ready
- Barcode scanning for POS
- Multi-language support
- Dark mode toggle
- Advanced analytics with predictive insights
- Mobile app (React Native)
- Backup and restore functionality
- Integration with external pharmacy systems

---

**BUILD IT PROFESSIONAL. BUILD IT SECURE. BUILD IT SCALABLE.**
