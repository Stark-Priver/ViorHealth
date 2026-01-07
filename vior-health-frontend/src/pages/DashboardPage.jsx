import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import SalesChart from '../components/dashboard/SalesChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickAlerts from '../components/dashboard/QuickAlerts';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import PharmacistDashboard from '../components/dashboard/PharmacistDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role || 'cashier';

  // Redirect lab technicians to their specific dashboard
  useEffect(() => {
    if (userRole === 'lab_technician') {
      navigate('/laboratory/dashboard');
    }
  }, [userRole, navigate]);

  // Render role-based dashboard
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'pharmacist':
        return <PharmacistDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      default:
        return (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
              <p className="text-neutral-600">Welcome back! Here's what's happening today.</p>
            </div>
            <DashboardStats />
            <QuickAlerts />
            <SalesChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
            </div>
          </>
        );
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default DashboardPage;
