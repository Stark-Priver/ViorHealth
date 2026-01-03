import StatCard from '../common/StatCard';
import { ShoppingCart, Package, AlertCircle, Clock } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const PharmacistDashboard = () => {
  const pharmacistStats = [
    {
      icon: ShoppingCart,
      title: "Today's Sales",
      value: '42',
      change: '+8',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Package,
      title: 'Prescriptions Filled',
      value: '28',
      change: '+5',
      changeType: 'increase',
      iconColor: 'bg-success-600',
    },
    {
      icon: AlertCircle,
      title: 'Low Stock Alerts',
      value: '12',
      change: '+3',
      changeType: 'increase',
      iconColor: 'bg-warning-500',
    },
    {
      icon: Clock,
      title: 'Pending Orders',
      value: '8',
      change: '-2',
      changeType: 'decrease',
      iconColor: 'bg-danger-600',
    },
  ];

  const pendingPrescriptions = [
    { id: 'PRX-001', patient: 'John Smith', medication: 'Amoxicillin 500mg', status: 'pending', time: '10 min ago' },
    { id: 'PRX-002', patient: 'Mary Johnson', medication: 'Metformin 850mg', status: 'ready', time: '25 min ago' },
    { id: 'PRX-003', patient: 'Robert Brown', medication: 'Lisinopril 10mg', status: 'pending', time: '35 min ago' },
    { id: 'PRX-004', patient: 'Sarah Davis', medication: 'Atorvastatin 20mg', status: 'ready', time: '1 hour ago' },
  ];

  const quickTasks = [
    { task: 'Verify prescription for John Smith', priority: 'high' },
    { task: 'Check expiry dates for Batch-2024-045', priority: 'medium' },
    { task: 'Restock Paracetamol 500mg', priority: 'low' },
    { task: 'Update patient counseling records', priority: 'medium' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Pharmacist Dashboard</h1>
        <p className="text-neutral-600">Your daily workflow and tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {pharmacistStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Prescriptions */}
        <Card title="Pending Prescriptions">
          <div className="space-y-3">
            {pendingPrescriptions.map((prescription, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-neutral-800">{prescription.patient}</p>
                    <p className="text-sm text-neutral-600">{prescription.medication}</p>
                  </div>
                  <Badge variant={prescription.status === 'ready' ? 'success' : 'warning'} size="sm">
                    {prescription.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{prescription.id}</span>
                  <span>{prescription.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Tasks */}
        <Card title="Today's Tasks">
          <div className="space-y-3">
            {quickTasks.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <input type="checkbox" className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">{item.task}</p>
                </div>
                <Badge 
                  variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'info'} 
                  size="sm"
                >
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
