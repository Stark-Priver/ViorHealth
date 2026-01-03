import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertTriangle, Package, Calendar } from 'lucide-react';

const StockAlerts = () => {
  const alerts = [
    {
      id: 1,
      product: 'Omeprazole 20mg',
      sku: 'MED-004',
      currentStock: 15,
      minStock: 30,
      type: 'critical',
      category: 'Gastric',
    },
    {
      id: 2,
      product: 'Amoxicillin 250mg',
      sku: 'MED-002',
      currentStock: 45,
      minStock: 50,
      type: 'low',
      category: 'Antibiotic',
    },
    {
      id: 3,
      product: 'Metformin 500mg',
      sku: 'MED-008',
      currentStock: 25,
      minStock: 40,
      type: 'low',
      category: 'Diabetes',
    },
    {
      id: 4,
      product: 'Aspirin 75mg',
      sku: 'MED-009',
      currentStock: 8,
      minStock: 25,
      type: 'critical',
      category: 'Cardiovascular',
    },
  ];

  return (
    <Card title="Stock Alerts" className="mb-6">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'critical'
                ? 'bg-danger-50 border-danger-600'
                : 'bg-warning-50 border-warning-600'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`p-2 rounded-lg ${
                    alert.type === 'critical' ? 'bg-danger-100' : 'bg-warning-100'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      alert.type === 'critical' ? 'text-danger-600' : 'text-warning-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-800">{alert.product}</h4>
                    <Badge variant={alert.type === 'critical' ? 'danger' : 'warning'} size="sm">
                      {alert.type === 'critical' ? 'Critical' : 'Low Stock'}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    SKU: {alert.sku} | Category: {alert.category}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-neutral-700">
                      Current: <span className="font-semibold">{alert.currentStock}</span>
                    </span>
                    <span className="text-neutral-500">|</span>
                    <span className="text-neutral-700">
                      Minimum: <span className="font-semibold">{alert.minStock}</span>
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap ml-4">
                Reorder →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StockAlerts;
