import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../common/StatCard';
import { ShoppingCart, Package, AlertCircle, Clock, Pill, Calendar, FileText, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { analyticsAPI, prescriptionsAPI, inventoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    prescriptionsFilled: 0,
    lowStockAlerts: 0,
    pendingPrescriptions: 0
  });
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics stats
      const statsResponse = await analyticsAPI.getDashboardStats();
      
      // Fetch pending prescriptions
      const prescriptionsResponse = await prescriptionsAPI.getPendingPrescriptions();
      const prescriptionsList = Array.isArray(prescriptionsResponse.data) 
        ? prescriptionsResponse.data 
        : prescriptionsResponse.data.results || [];
      setPendingPrescriptions(prescriptionsList.slice(0, 5)); // Show top 5
      
      // Fetch products for stock alerts
      const productsResponse = await inventoryAPI.getProducts();
      const productsList = Array.isArray(productsResponse.data) 
        ? productsResponse.data 
        : productsResponse.data.results || [];
      
      // Filter low stock products
      const lowStock = productsList.filter(p => p.quantity > 0 && p.quantity <= p.reorder_level);
      setLowStockProducts(lowStock.slice(0, 4)); // Show top 4
      
      // Filter expiring products (within 60 days)
      const today = new Date();
      const sixtyDaysFromNow = new Date(today.getTime() + (60 * 24 * 60 * 60 * 1000));
      const expiring = productsList.filter(p => {
        if (!p.expiry_date) return false;
        const expiryDate = new Date(p.expiry_date);
        return expiryDate <= sixtyDaysFromNow && expiryDate > today;
      });
      setExpiringProducts(expiring.slice(0, 4)); // Show top 4
      
      // Set stats
      setStats({
        todaySales: statsResponse.data.today_sales || 0,
        prescriptionsFilled: statsResponse.data.prescriptions_dispensed_today || 0,
        lowStockAlerts: lowStock.length,
        pendingPrescriptions: prescriptionsList.length
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pharmacistStats = [
    {
      icon: ShoppingCart,
      title: "Today's Sales",
      value: stats.todaySales.toString(),
      change: '',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Package,
      title: 'Prescriptions Filled',
      value: stats.prescriptionsFilled.toString(),
      change: '',
      iconColor: 'bg-success-600',
    },
    {
      icon: AlertCircle,
      title: 'Low Stock Alerts',
      value: stats.lowStockAlerts.toString(),
      change: '',
      iconColor: 'bg-warning-500',
    },
    {
      icon: Clock,
      title: 'Pending Prescriptions',
      value: stats.pendingPrescriptions.toString(),
      change: '',
      iconColor: 'bg-teal-600',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Pharmacist Dashboard</h1>
        <p className="text-neutral-600">Your daily workflow and tasks</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-neutral-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {pharmacistStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pending Prescriptions */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Pending Prescriptions</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/prescriptions')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {pendingPrescriptions.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                    <p>No pending prescriptions</p>
                  </div>
                ) : (
                  pendingPrescriptions.map((prescription) => (
                    <div 
                      key={prescription.id} 
                      className="p-4 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/prescriptions')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-neutral-800">{prescription.customer_name}</p>
                          <p className="text-sm text-neutral-600">
                            {prescription.items?.length || 0} medication{prescription.items?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="warning" size="sm">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="font-medium">RX #{prescription.prescription_number}</span>
                        <span>{getTimeAgo(prescription.created_at)}</span>
                      </div>
                      {prescription.doctor_name && (
                        <p className="text-xs text-neutral-600 mt-2">Dr. {prescription.doctor_name}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Low Stock Alerts */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">Low Stock Alerts</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/inventory')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {lowStockProducts.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                    <p>All stock levels are adequate</p>
                  </div>
                ) : (
                  lowStockProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="p-4 bg-warning-50 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/inventory')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-neutral-800">{product.name}</p>
                          <p className="text-xs text-neutral-600">{product.sku}</p>
                        </div>
                        <Badge variant="warning" size="sm">
                          Low Stock
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          Current: <span className="font-semibold text-warning-700">{product.quantity} {product.unit_type}</span>
                        </span>
                        <span className="text-neutral-600">
                          Min: {product.reorder_level}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Expiring Products */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-danger-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Expiring Soon (Next 60 Days)</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/inventory')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {expiringProducts.length === 0 ? (
                <div className="col-span-full text-center py-8 text-neutral-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-neutral-400" />
                  <p>No products expiring soon</p>
                </div>
              ) : (
                expiringProducts.map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiry_date);
                  const isUrgent = daysUntilExpiry <= 30;
                  
                  return (
                    <div 
                      key={product.id} 
                      className={`p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${
                        isUrgent 
                          ? 'bg-danger-50 border-danger-300' 
                          : 'bg-warning-50 border-warning-300'
                      }`}
                      onClick={() => navigate('/inventory')}
                    >
                      <div className="mb-2">
                        <p className="font-semibold text-neutral-800 text-sm line-clamp-2">{product.name}</p>
                        <p className="text-xs text-neutral-600">{product.sku}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600">Stock:</span>
                          <span className="font-semibold">{product.quantity} {product.unit_type}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600">Expires:</span>
                          <span className={`font-semibold ${isUrgent ? 'text-danger-700' : 'text-warning-700'}`}>
                            {daysUntilExpiry} days
                          </span>
                        </div>
                        <Badge 
                          variant={isUrgent ? 'danger' : 'warning'} 
                          size="sm"
                          className="w-full justify-center mt-2"
                        >
                          {isUrgent ? 'Urgent' : 'Warning'}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default PharmacistDashboard;
