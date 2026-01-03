import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertTriangle, Calendar } from 'lucide-react';

const QuickAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'danger',
      title: 'Critical Stock Level',
      message: '5 products below minimum stock level',
      action: 'View Details',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Expiring Soon',
      message: '12 products expiring in next 30 days',
      action: 'Review Items',
    },
    {
      id: 3,
      type: 'info',
      title: 'Pending Orders',
      message: '8 purchase orders awaiting approval',
      action: 'Review Orders',
    },
  ];

  return (
    <Card title="Quick Alerts" className="mb-8">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'danger' ? 'bg-danger-50 border-danger-600' :
              alert.type === 'warning' ? 'bg-warning-50 border-warning-600' :
              'bg-primary-50 border-primary-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'danger' ? 'text-danger-600' :
                  alert.type === 'warning' ? 'text-warning-600' :
                  'text-primary-600'
                }`} />
                <div>
                  <h4 className="font-semibold text-neutral-800 text-sm mb-1">{alert.title}</h4>
                  <p className="text-sm text-neutral-600">{alert.message}</p>
                </div>
              </div>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap">
                {alert.action} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickAlerts;
