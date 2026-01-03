import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertTriangle, Package, Calendar } from 'lucide-react';
import { inventoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockAlerts();
  }, []);

  const fetchStockAlerts = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getProducts();
      const products = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Filter products that are low stock or critical (quantity <= reorder_level)
      const lowStockProducts = products
        .filter(product => product.quantity <= product.reorder_level)
        .map(product => ({
          id: product.id,
          product: product.name,
          sku: product.sku,
          currentStock: product.quantity,
          minStock: product.reorder_level,
          type: product.quantity === 0 ? 'critical' : product.quantity <= product.reorder_level / 2 ? 'critical' : 'low',
          category: product.category?.name || 'N/A',
        }))
        .sort((a, b) => a.currentStock - b.currentStock); // Sort by stock level (lowest first)
      
      setAlerts(lowStockProducts);
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      toast.error('Failed to load stock alerts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Stock Alerts" className="mb-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-neutral-600">Loading stock alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p>No stock alerts at this time</p>
          <p className="text-sm">All products have sufficient stock</p>
        </div>
      ) : (
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
      )}
    </Card>
  );
};

export default StockAlerts;
