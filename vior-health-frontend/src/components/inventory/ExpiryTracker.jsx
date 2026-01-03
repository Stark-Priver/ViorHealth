import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Table from '../common/Table';
import { Calendar, AlertCircle } from 'lucide-react';
import { inventoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const ExpiryTracker = () => {
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [stats, setStats] = useState({
    expiring30: 0,
    expiring60: 0,
    expiring90: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiringProducts();
  }, []);

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchExpiringProducts = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getProducts();
      const products = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Filter products with expiry dates and calculate days left
      const productsWithExpiry = products
        .filter(product => product.expiry_date)
        .map(product => {
          const daysLeft = calculateDaysLeft(product.expiry_date);
          return {
            id: product.id,
            name: product.name,
            sku: product.sku,
            batch: product.batch_number || 'N/A',
            quantity: product.quantity,
            expiry: product.expiry_date,
            daysLeft: daysLeft,
            status: daysLeft < 30 ? 'danger' : daysLeft < 60 ? 'warning' : 'info',
          };
        })
        .filter(product => product.daysLeft <= 90 && product.daysLeft >= 0) // Only show products expiring within 90 days
        .sort((a, b) => a.daysLeft - b.daysLeft); // Sort by expiry date (soonest first)
      
      setExpiringProducts(productsWithExpiry);
      
      // Calculate stats
      const expiring30 = productsWithExpiry.filter(p => p.daysLeft <= 30).length;
      const expiring60 = productsWithExpiry.filter(p => p.daysLeft <= 60).length;
      const expiring90 = productsWithExpiry.length;
      
      setStats({ expiring30, expiring60, expiring90 });
    } catch (error) {
      console.error('Error fetching expiring products:', error);
      toast.error('Failed to load expiry tracker');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.name}</p>
          <p className="text-xs text-neutral-500">SKU: {row.sku}</p>
        </div>
      ),
    },
    {
      header: 'Batch Number',
      accessor: 'batch',
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
    },
    {
      header: 'Expiry Date',
      accessor: 'expiry',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-800">{row.expiry}</p>
          <p className="text-xs text-neutral-500">{row.daysLeft} days left</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'danger' ? 'danger' :
            row.status === 'warning' ? 'warning' :
            'info'
          }
        >
          {row.daysLeft < 30 ? 'Urgent' : row.daysLeft < 60 ? 'Soon' : 'Tracked'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 30 Days</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.expiring30}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Calendar className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 60 Days</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.expiring60}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 90 Days</p>
              <p className="text-2xl font-bold text-neutral-800">{stats.expiring90}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Products Table */}
      <Card title="Products Nearing Expiry">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-neutral-600">Loading expiring products...</p>
          </div>
        ) : expiringProducts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
            <p>No products expiring soon</p>
            <p className="text-sm">All products are within safe expiry dates</p>
          </div>
        ) : (
          <Table columns={columns} data={expiringProducts} />
        )}
      </Card>
    </div>
  );
};

export default ExpiryTracker;
