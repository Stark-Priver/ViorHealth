import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock, User, Package } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'sale',
      icon: Package,
      title: 'New sale completed',
      description: 'Invoice #INV-2024-0847',
      user: 'John Doe',
      time: '5 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'prescription',
      icon: Package,
      title: 'Prescription added',
      description: 'Prescription #PRX-2024-0234',
      user: 'Dr. Sarah Johnson',
      time: '15 minutes ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'stock',
      icon: Package,
      title: 'Stock alert',
      description: 'Paracetamol 500mg - Low stock',
      user: 'System',
      time: '1 hour ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'order',
      icon: Package,
      title: 'Purchase order received',
      description: 'PO #PO-2024-0456 from ABC Pharma',
      user: 'Jane Smith',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 5,
      type: 'expiry',
      icon: Package,
      title: 'Expiry alert',
      description: '5 products expiring in 30 days',
      user: 'System',
      time: '3 hours ago',
      status: 'danger',
    },
  ];

  return (
    <Card title="Recent Activity">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <div className={`p-2 rounded-lg ${
              activity.status === 'success' ? 'bg-success-100' :
              activity.status === 'warning' ? 'bg-warning-100' :
              activity.status === 'danger' ? 'bg-danger-100' :
              'bg-primary-100'
            }`}>
              <activity.icon className={`w-5 h-5 ${
                activity.status === 'success' ? 'text-success-600' :
                activity.status === 'warning' ? 'text-warning-600' :
                activity.status === 'danger' ? 'text-danger-600' :
                'text-primary-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-semibold text-neutral-800">{activity.title}</h4>
                <Badge variant={activity.status} size="sm">{activity.status}</Badge>
              </div>
              <p className="text-sm text-neutral-600 mb-1">{activity.description}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {activity.user}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
