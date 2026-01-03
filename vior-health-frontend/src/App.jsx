import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import SuppliersPage from './pages/SuppliersPage';
import PrescriptionsPage from './pages/PrescriptionsPage';

// Layout component for authenticated pages
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 ml-64">
          {children}
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

            {/* Sales - All authenticated users can view/create sales */}
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

            {/* Prescriptions - Admin, Manager, Pharmacist */}
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager', 'pharmacist']}>
                  <MainLayout>
                    <PrescriptionsPage />
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
    </AuthProvider>
  );
}

export default App;
