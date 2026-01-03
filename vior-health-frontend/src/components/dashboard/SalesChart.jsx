import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import Card from '../common/Card';
import { analyticsAPI } from '../../services/api';

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const [salesResponse, topProductsResponse] = await Promise.all([
        analyticsAPI.getSalesChart(),
        analyticsAPI.getTopProducts()
      ]);
      
      const sales = salesResponse.data?.sales_data || [];
      const topProducts = topProductsResponse.data || [];
      
      // Format sales data
      const formattedSales = sales.length > 0 ? sales : [
        { month: 'Jan', sales: 0, revenue: 0 },
        { month: 'Feb', sales: 0, revenue: 0 },
        { month: 'Mar', sales: 0, revenue: 0 },
        { month: 'Apr', sales: 0, revenue: 0 },
        { month: 'May', sales: 0, revenue: 0 },
        { month: 'Jun', sales: 0, revenue: 0 },
      ];
      
      setSalesData(formattedSales);
      
      // Format category data from top products
      const colors = ['#0284c7', '#22c55e', '#f59e0b', '#a855f7', '#ef4444'];
      const formattedCategories = topProducts.slice(0, 5).map((product, index) => ({
        name: product.name || product.category || `Product ${index + 1}`,
        value: product.total_quantity || product.value || 0,
        color: colors[index % colors.length]
      }));
      
      setCategoryData(formattedCategories.length > 0 ? formattedCategories : [
        { name: 'No Data', value: 100, color: '#e5e5e5' }
      ]);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setSalesData([
        { month: 'Jan', sales: 0, revenue: 0 },
        { month: 'Feb', sales: 0, revenue: 0 },
        { month: 'Mar', sales: 0, revenue: 0 },
        { month: 'Apr', sales: 0, revenue: 0 },
        { month: 'May', sales: 0, revenue: 0 },
        { month: 'Jun', sales: 0, revenue: 0 },
      ]);
      setCategoryData([{ name: 'No Data', value: 100, color: '#e5e5e5' }]);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-semibold text-neutral-800 mb-1">{payload[0]?.payload?.month}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-neutral-600">
              {entry.name}: TSH {entry.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Sales Trend */}
      <Card title="Sales & Revenue Trend" className="lg:col-span-2">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
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
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#0284c7" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} name="Sales" />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Category Distribution */}
      <Card title="Top Products">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => categoryData[0]?.name === 'No Data' ? name : `${name} ${(percent * 100).toFixed(0)}%`}
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
        )}
      </Card>
    </div>
  );
};

export default SalesChart;
