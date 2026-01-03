import StatCard from '../common/StatCard';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Settings
} from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const AdminDashboard = () => {
  const adminStats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '47',
      change: '+5',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Package,
      title: 'Total Products',
      value: '1,234',
      change: '+45',
      changeType: 'increase',
      iconColor: 'bg-success-600',
    },
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: '$124,592',
      change: '+12.5%',
      changeType: 'increase',
      iconColor: 'bg-warning-500',
    },
    {
      icon: TrendingUp,
      title: 'System Uptime',
      value: '99.9%',
      change: 'Stable',
      changeType: 'increase',
      iconColor: 'bg-danger-600',
    },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Added new product', time: '5 min ago', type: 'success' },
    { user: 'Jane Smith', action: 'Updated inventory', time: '15 min ago', type: 'info' },
    { user: 'System', action: 'Backup completed', time: '1 hour ago', type: 'success' },
    { user: 'Mike Wilson', action: 'Generated report', time: '2 hours ago', type: 'info' },
  ];

  const systemAlerts = [
    { title: 'Database backup scheduled', severity: 'info', time: 'Today at 11:00 PM' },
    { title: 'Low disk space warning', severity: 'warning', time: '2 hours ago' },
    { title: 'User login from new device', severity: 'info', time: '3 hours ago' },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card title="Recent User Activities">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-800">{activity.user}</p>
                  <p className="text-sm text-neutral-600">{activity.action}</p>
                </div>
                <div className="text-right">
                  <Badge variant={activity.type} size="sm">{activity.type}</Badge>
                  <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card title="System Alerts">
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'warning'
                    ? 'bg-warning-50 border-warning-600'
                    : 'bg-primary-50 border-primary-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-800 text-sm mb-1">{alert.title}</h4>
                    <p className="text-xs text-neutral-600">{alert.time}</p>
                  </div>
                  <Badge variant={alert.severity} size="sm">{alert.severity}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
