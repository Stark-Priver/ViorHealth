import { useState, useEffect } from 'react';
import StatCard from '../common/StatCard';
import { 
  Package, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Settings,
  Pill,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Loader from '../common/Loader';
import { analyticsAPI, prescriptionsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes, prescriptionsRes] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        analyticsAPI.getRecentActivities(10),
        prescriptionsAPI.getPendingPrescriptions(),
      ]);

      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
      setPendingPrescriptions(prescriptionsRes.data.results || prescriptionsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const adminStats = [
    {
      icon: Package,
      title: 'Total Products',
      value: stats?.total_products || '0',
      change: `${stats?.low_stock_products || 0} low stock`,
      changeType: 'warning',
      iconColor: 'bg-success-600',
    },
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: `TSH ${(stats?.total_revenue || 0).toLocaleString()}`,
      change: `Today: TSH ${(stats?.today_revenue || 0).toLocaleString()}`,
      changeType: 'increase',
      iconColor: 'bg-warning-500',
    },
    {
      icon: TrendingUp,
      title: "Today's Sales",
      value: `${stats?.today_transactions || 0}`,
      change: 'Transactions',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: ClipboardList,
      title: 'Pending Prescriptions',
      value: `${stats?.pending_prescriptions || 0}`,
      change: 'Awaiting',
      changeType: stats?.pending_prescriptions > 0 ? 'warning' : 'increase',
      iconColor: 'bg-danger-600',
    },
  ];

  const getActivityBadgeVariant = (type) => {
    switch (type) {
      case 'sale':
        return 'success';
      case 'stock_movement':
        return 'warning';
      case 'prescription':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleDispensePrescription = async (prescriptionId) => {
    try {
      await prescriptionsAPI.dispensePrescription(prescriptionId);
      toast.success('Prescription dispensed successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error dispensing prescription:', error);
      toast.error('Failed to dispense prescription');
    }
  };

  const handleCancelPrescription = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this prescription?')) {
      return;
    }
    try {
      await prescriptionsAPI.cancelPrescription(prescriptionId);
      toast.success('Prescription cancelled');
      fetchDashboardData();
    } catch (error) {
      console.error('Error cancelling prescription:', error);
      toast.error('Failed to cancel prescription');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
        <p className="text-neutral-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Pending Prescriptions */}
      <Card title="Pending Prescriptions" className="mb-8">
        <div className="space-y-3">
          {pendingPrescriptions.length === 0 ? (
            <p className="text-center text-neutral-500 py-4">No pending prescriptions</p>
          ) : (
            pendingPrescriptions.slice(0, 5).map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-warning-100 rounded-lg">
                    <Pill className="w-5 h-5 text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">
                      {prescription.patient_name || 'Unknown Patient'}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Doctor: {prescription.doctor_name || 'N/A'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span className="text-xs text-neutral-500">
                        {formatTime(prescription.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDispensePrescription(prescription.id)}
                    className="p-2 bg-success-100 text-success-600 rounded-lg hover:bg-success-200 transition-colors"
                    title="Dispense"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCancelPrescription(prescription.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Cancel"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
            <UserCheck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-800">Manage Users</p>
          </button>
          <button className="p-4 border-2 border-neutral-200 rounded-lg hover:border-success-500 hover:bg-success-50 transition-all">
            <ClipboardList className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-800">View Reports</p>
          </button>
          <button className="p-4 border-2 border-neutral-200 rounded-lg hover:border-warning-500 hover:bg-warning-50 transition-all">
            <AlertTriangle className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-800">System Alerts</p>
          </button>
          <button className="p-4 border-2 border-neutral-200 rounded-lg hover:border-neutral-500 hover:bg-neutral-50 transition-all">
            <Settings className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-800">Settings</p>
          </button>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card title="Recent Activities">
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-center text-neutral-500 py-4">No recent activities</p>
          ) : (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-800">{activity.user}</p>
                  <p className="text-sm text-neutral-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={getActivityBadgeVariant(activity.type)} size="sm">
                    {activity.type}
                  </Badge>
                  <p className="text-xs text-neutral-500 mt-1">{formatTime(activity.created_at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
