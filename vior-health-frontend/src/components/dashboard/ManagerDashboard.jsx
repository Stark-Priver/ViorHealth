import StatCard from '../common/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import Card from '../common/Card';

const ManagerDashboard = () => {
  const managerStats = [
    {
      icon: DollarSign,
      title: 'Monthly Revenue',
      value: '$124,592',
      change: '+12.5%',
      changeType: 'increase',
      iconColor: 'bg-success-600',
    },
    {
      icon: ShoppingBag,
      title: 'Total Sales',
      value: '2,847',
      change: '+8.2%',
      changeType: 'increase',
      iconColor: 'bg-primary-600',
    },
    {
      icon: Users,
      title: 'Active Staff',
      value: '24',
      change: '+2',
      changeType: 'increase',
      iconColor: 'bg-warning-500',
    },
    {
      icon: TrendingUp,
      title: 'Profit Margin',
      value: '34.2%',
      change: '+2.1%',
      changeType: 'increase',
      iconColor: 'bg-danger-600',
    },
  ];

  const weeklyData = [
    { day: 'Mon', sales: 12000, customers: 45 },
    { day: 'Tue', sales: 15000, customers: 52 },
    { day: 'Wed', sales: 11000, customers: 38 },
    { day: 'Thu', sales: 18000, customers: 65 },
    { day: 'Fri', sales: 20000, customers: 72 },
    { day: 'Sat', sales: 16000, customers: 58 },
    { day: 'Sun', sales: 13000, customers: 42 },
  ];

  const teamPerformance = [
    { name: 'Sarah Johnson', role: 'Senior Pharmacist', sales: 145, rating: 4.9 },
    { name: 'Mike Chen', role: 'Pharmacist', sales: 128, rating: 4.7 },
    { name: 'Emily Davis', role: 'Pharmacy Tech', sales: 98, rating: 4.8 },
    { name: 'John Wilson', role: 'Pharmacist', sales: 112, rating: 4.6 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Manager Dashboard</h1>
        <p className="text-neutral-600">Business insights and team performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {managerStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Weekly Sales Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="day" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip />
              <Bar dataKey="sales" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Customer Traffic">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="day" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Performance */}
      <Card title="Team Performance">
        <div className="space-y-4">
          {teamPerformance.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{member.name}</p>
                  <p className="text-sm text-neutral-600">{member.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-neutral-800">{member.sales} sales</p>
                <p className="text-sm text-warning-600">⭐ {member.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
