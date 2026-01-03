import StatCard from '../common/StatCard';
import { DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: '$124,592',
      change: '+12.5%',
      changeType: 'increase',
      iconColor: 'bg-success-600',
    },
    {
      icon: ShoppingCart,
      title: 'Total Sales',
      value: '2,847',
      change: '+8.2%',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Package,
      title: 'Products in Stock',
      value: '8,543',
      change: '-3.1%',
      changeType: 'decrease',
      iconColor: 'bg-warning-500',
    },
    {
      icon: AlertTriangle,
      title: 'Low Stock Items',
      value: '23',
      change: '+5',
      changeType: 'increase',
      iconColor: 'bg-danger-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
