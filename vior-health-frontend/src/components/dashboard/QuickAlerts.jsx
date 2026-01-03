import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertTriangle, Calendar } from 'lucide-react';
import { analyticsAPI, prescriptionsAPI } from '../../services/api';

const QuickAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const [statsResponse, prescriptionsResponse] = await Promise.all([
        analyticsAPI.getDashboardStats(),
        prescriptionsAPI.getPendingPrescriptions()
      ]);
      
      const stats = statsResponse.data;
      const pendingPrescriptions = prescriptionsResponse.data?.results || prescriptionsResponse.data || [];
      
      const alertsList = [];
      
      if (stats.low_stock_count > 0) {
        alertsList.push({
          id: 1,
          type: 'danger',
          title: 'Critical Stock Level',
          message: `${stats.low_stock_count} products below minimum stock level`,
          action: 'View Details',
        });
      }
      
      if (stats.expiring_soon_count > 0) {
        alertsList.push({
          id: 2,
          type: 'warning',
          title: 'Expiring Soon',
          message: `${stats.expiring_soon_count} products expiring in next 30 days`,
          action: 'Review Items',
        });
      }
      
      if (pendingPrescriptions.length > 0) {
        alertsList.push({
          id: 3,
          type: 'info',
          title: 'Pending Prescriptions',
          message: `${pendingPrescriptions.length} prescriptions awaiting processing`,
          action: 'Review Prescriptions',
        });
      }
      
      if (alertsList.length === 0) {
        alertsList.push({
          id: 0,
          type: 'info',
          title: 'All Clear',
          message: 'No alerts at this time',
          action: '',
        });
      }
      
      setAlerts(alertsList);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Quick Alerts" className="mb-8">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-neutral-600">Loading alerts...</p>
        </div>
      ) : (
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
                {alert.action && (
                  <button className="text-sm font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap">
                    {alert.action} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default QuickAlerts;
