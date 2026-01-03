import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import Card from '../common/Card';

const SalesChart = () => {
  const salesData = [
    { month: 'Jan', sales: 45000, revenue: 65000 },
    { month: 'Feb', sales: 52000, revenue: 72000 },
    { month: 'Mar', sales: 48000, revenue: 68000 },
    { month: 'Apr', sales: 61000, revenue: 85000 },
    { month: 'May', sales: 58000, revenue: 79000 },
    { month: 'Jun', sales: 67000, revenue: 92000 },
  ];

  const categoryData = [
    { name: 'Prescription', value: 45, color: '#0284c7' },
    { name: 'OTC', value: 30, color: '#22c55e' },
    { name: 'Surgical', value: 15, color: '#f59e0b' },
    { name: 'Wellness', value: 10, color: '#a855f7' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Sales Trend */}
      <Card title="Sales & Revenue Trend" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" stroke="#737373" />
            <YAxis stroke="#737373" />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#0284c7" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Distribution */}
      <Card title="Sales by Category">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default SalesChart;
