import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import ReportsPage from './pages/ReportsPage';

// Layout component for authenticated pages
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  // For demo purposes, always show as authenticated
  // In production, check actual auth state
  const isAuthenticated = true;

  return (
    <Router>
      <div className="font-poppins">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                }
              />
              <Route
                path="/inventory"
                element={
                  <MainLayout>
                    <InventoryPage />
                  </MainLayout>
                }
              />
              <Route
                path="/sales"
                element={
                  <MainLayout>
                    <SalesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/prescriptions"
                element={
                  <MainLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Prescriptions</h2>
                      <p className="text-neutral-600">Coming soon...</p>
                    </div>
                  </MainLayout>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <MainLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Suppliers</h2>
                      <p className="text-neutral-600">Coming soon...</p>
                    </div>
                  </MainLayout>
                }
              />
              <Route
                path="/customers"
                element={
                  <MainLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Customers</h2>
                      <p className="text-neutral-600">Coming soon...</p>
                    </div>
                  </MainLayout>
                }
              />
              <Route
                path="/audit"
                element={
                  <MainLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Audit Logs</h2>
                      <p className="text-neutral-600">Coming soon...</p>
                    </div>
                  </MainLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <MainLayout>
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Settings</h2>
                      <p className="text-neutral-600">Coming soon...</p>
                    </div>
                  </MainLayout>
                }
              />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>

        {/* Toast Notifications */}
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
  );
}

export default App
