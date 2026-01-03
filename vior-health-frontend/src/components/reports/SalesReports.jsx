import Card from '../common/Card';
import Button from '../common/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

const SalesReports = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, sales: 320, profit: 12000 },
    { month: 'Feb', revenue: 52000, sales: 385, profit: 15600 },
    { month: 'Mar', revenue: 48000, sales: 340, profit: 13440 },
    { month: 'Apr', revenue: 61000, sales: 445, profit: 18300 },
    { month: 'May', revenue: 58000, sales: 420, profit: 17400 },
    { month: 'Jun', revenue: 67000, sales: 495, profit: 20100 },
  ];

  const topProducts = [
    { name: 'Paracetamol 500mg', sales: 1240, revenue: 3100 },
    { name: 'Ibuprofen 400mg', sales: 980, revenue: 3675 },
    { name: 'Amoxicillin 250mg', sales: 765, revenue: 3825 },
    { name: 'Cetirizine 10mg', sales: 620, revenue: 1395 },
    { name: 'Omeprazole 20mg', sales: 540, revenue: 2430 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Sales Reports</h2>
          <p className="text-sm text-neutral-600">Comprehensive sales analytics and insights</p>
        </div>
        <Button variant="primary" icon={<Download className="w-4 h-4" />}>
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-neutral-800">$331,000</h3>
              <p className="text-sm text-success-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +18.5% from last period
              </p>
            </div>
            <div className="p-4 bg-success-100 rounded-xl">
              <DollarSign className="w-8 h-8 text-success-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Sales</p>
              <h3 className="text-3xl font-bold text-neutral-800">2,405</h3>
              <p className="text-sm text-success-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.3% from last period
              </p>
            </div>
            <div className="p-4 bg-primary-100 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Profit</p>
              <h3 className="text-3xl font-bold text-neutral-800">$96,840</h3>
              <p className="text-sm text-success-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.2% from last period
              </p>
            </div>
            <div className="p-4 bg-warning-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Monthly Revenue & Sales">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={2} name="Revenue ($)" />
              <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} name="Sales Count" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Profit Trend">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="month" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip />
              <Bar dataKey="profit" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <Card title="Top Selling Products">
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-primary-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">{product.name}</h4>
                  <p className="text-sm text-neutral-600">{product.sales} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-800">${product.revenue.toFixed(2)}</p>
                <p className="text-xs text-neutral-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SalesReports;
