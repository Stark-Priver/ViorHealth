import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { useSidebar } from './hooks/useSidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Breadcrumb from './components/common/Breadcrumb';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import POSPage from './pages/POSPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SuppliersPage from './pages/SuppliersPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import CreatePrescriptionPage from './pages/CreatePrescriptionPage';
import CustomersPage from './pages/CustomersPage';
import ProfilePage from './pages/ProfilePage';
import ExpensesPage from './pages/ExpensesPage';
import PharmacySettingsPage from './pages/PharmacySettingsPage';
import LabTechnicianDashboardPage from './pages/LabTechnicianDashboardPage';
import LaboratoryTestsPage from './pages/LaboratoryTestsPage';
import LabTestDetailPage from './pages/LabTestDetailPage';
import CreateLabTestPage from './pages/CreateLabTestPage';
import TestTypesPage from './pages/TestTypesPage';

// Layout component for authenticated pages
const MainLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Navbar />
      <div className="flex overflow-x-hidden">
        <Sidebar />
        <main 
          className={`
            flex-1 min-h-screen transition-all duration-300 overflow-x-hidden
            ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
          `}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Home route component that redirects based on auth status
const Home = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="font-poppins">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Protected Routes - All authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Inventory - Admin, Manager, Pharmacist */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager', 'pharmacist']}>
                  <MainLayout>
                    <InventoryPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Point of Sale - All authenticated users can process sales */}
            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <POSPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Sales History - All authenticated users can view sales */}
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SalesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Reports - Admin and Manager only */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Settings - Admin and Manager only */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Pharmacy Settings - Admin and Manager only */}
            <Route
              path="/pharmacy-settings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MainLayout>
                    <PharmacySettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Suppliers - Admin and Manager only */}
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MainLayout>
                    <SuppliersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Expenses - All authenticated users can record their own expenses */}
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ExpensesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Prescriptions - Admin, Pharmacist only */}
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                  <MainLayout>
                    <PrescriptionsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Create Prescription - Admin and Pharmacist only */}
            <Route
              path="/prescriptions/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                  <MainLayout>
                    <CreatePrescriptionPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* Customers - Admin, Manager, Pharmacist, Cashier */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager', 'pharmacist', 'cashier']}>
                  <MainLayout>
                    <CustomersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Profile - All authenticated users */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Laboratory Routes - Lab Technicians and higher */}
            <Route
              path="/laboratory/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LabTechnicianDashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/tests"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LaboratoryTestsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/test-types"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MainLayout>
                    <TestTypesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/tests/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateLabTestPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laboratory/tests/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LabTestDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
