import { useState, useEffect } from 'react';
import StatCard from '../common/StatCard';
import { DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { analyticsAPI } from '../../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState([
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: 'TSH 0',
      change: '+0%',
      changeType: 'increase',
      iconColor: 'bg-success-600',
    },
    {
      icon: ShoppingCart,
      title: 'Total Sales',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Package,
      title: 'Products in Stock',
      value: '0',
      change: '0%',
      changeType: 'decrease',
      iconColor: 'bg-warning-500',
    },
    {
      icon: AlertTriangle,
      title: 'Low Stock Items',
      value: '0',
      change: '+0',
      changeType: 'increase',
      iconColor: 'bg-danger-600',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboardStats();
      const data = response.data;
      
      setStats([
        {
          icon: DollarSign,
          title: 'Total Revenue',
          value: `TSH ${parseFloat(data.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          change: data.revenue_growth || '+0%',
          changeType: 'increase',
          iconColor: 'bg-success-600',
        },
        {
          icon: ShoppingCart,
          title: 'Total Sales',
          value: (data.total_sales || 0).toString(),
          change: data.sales_growth || '+0%',
          changeType: 'increase',
          iconColor: 'bg-primary-600',
        },
        {
          icon: Package,
          title: 'Products in Stock',
          value: (data.products_count || 0).toString(),
          change: data.stock_change || '0%',
          changeType: data.stock_change?.startsWith('-') ? 'decrease' : 'increase',
          iconColor: 'bg-warning-500',
        },
        {
          icon: AlertTriangle,
          title: 'Low Stock Items',
          value: (data.low_stock_count || 0).toString(),
          change: data.low_stock_change || '+0',
          changeType: 'increase',
          iconColor: 'bg-danger-600',
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
