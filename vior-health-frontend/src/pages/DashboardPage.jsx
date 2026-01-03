import { useState } from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import SalesChart from '../components/dashboard/SalesChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickAlerts from '../components/dashboard/QuickAlerts';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import PharmacistDashboard from '../components/dashboard/PharmacistDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';

// Role selector component for demo purposes
const RoleSelector = ({ userRole, setUserRole }) => (
  <div className="mb-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
    <label className="block text-sm font-medium text-neutral-700 mb-2">
      Select Dashboard View (Demo):
    </label>
    <div className="flex gap-2">
      <button
        onClick={() => setUserRole('general')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          userRole === 'general'
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        General
      </button>
      <button
        onClick={() => setUserRole('admin')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          userRole === 'admin'
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        Admin
      </button>
      <button
        onClick={() => setUserRole('pharmacist')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          userRole === 'pharmacist'
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        Pharmacist
      </button>
      <button
        onClick={() => setUserRole('manager')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          userRole === 'manager'
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        Manager
      </button>
    </div>
  </div>
);

const DashboardPage = () => {
  // Get user role from context/auth (for demo, we'll use state)
  const [userRole, setUserRole] = useState('general'); // 'admin', 'pharmacist', 'manager', 'general'
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

  return (
    <div>
      <RoleSelector userRole={userRole} setUserRole={setUserRole} />
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
