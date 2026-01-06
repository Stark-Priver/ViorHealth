import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { salesAPI, inventoryAPI, analyticsAPI } from '../services/api';
import { toast } from 'react-toastify';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  
  const [salesStats, setSalesStats] = useState(null);
  const [salesChart, setSalesChart] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch sales statistics with date range
      const statsRes = await salesAPI.getSalesStatistics({ days: parseInt(dateRange) });
      setSalesStats(statsRes.data);
      
      // Fetch sales chart data
      const chartRes = await analyticsAPI.getSalesChart(parseInt(dateRange));
      setSalesChart(chartRes.data || []);
      
      // Fetch top products
      const topProdRes = await analyticsAPI.getTopProducts(10);
      setTopProducts(topProdRes.data || []);
      
      // Fetch low stock products
      const lowStockRes = await inventoryAPI.getLowStockProducts();
      setLowStockProducts(lowStockRes.data || []);
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const tabs = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'products', label: 'Product Performance', icon: ShoppingBag },
  ];

  const renderSalesReport = () => (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-neutral-800">
                TSH {parseFloat(salesStats?.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-sm text-success-600 mt-2">
                Last {dateRange} days
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold text-neutral-800">
                {(salesStats?.total_sales || 0).toLocaleString()}
              </h3>
              <p className="text-sm text-primary-600 mt-2">
                Transactions
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Avg. Sale Value</p>
              <h3 className="text-2xl font-bold text-neutral-800">
                TSH {parseFloat(salesStats?.average_sale_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Per transaction
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold text-neutral-800">
                {(salesStats?.total_customers || 0).toLocaleString()}
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Unique buyers
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Sales Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="date" 
                stroke="#737373" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#737373" tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => `TSH ${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#0284c7" 
                strokeWidth={2} 
                name="Revenue (TSH)"
                dot={{ fill: '#0284c7', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sales Volume">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis 
                dataKey="date" 
                stroke="#737373" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#737373" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px' }}
              />
              <Bar 
                dataKey="count" 
                fill="#22c55e" 
                radius={[8, 8, 0, 0]} 
                name="Sales Count" 
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Payment Methods */}
      {salesStats?.payment_methods && (
        <Card title="Payment Methods Distribution">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(salesStats.payment_methods).map(([method, data]) => (
              <div key={method} className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-neutral-800 capitalize mb-2">{method}</h4>
                <p className="text-2xl font-bold text-primary-600">
                  TSH {parseFloat(data.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  {data.count || 0} transactions
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );

  const renderInventoryReport = () => (
    <>
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Low Stock Items</p>
              <h3 className="text-3xl font-bold text-danger-600">
                {lowStockProducts.length}
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Requires attention
              </p>
            </div>
            <div className="p-3 bg-danger-100 rounded-xl">
              <Package className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-neutral-800">
                {salesStats?.total_products || 0}
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                In inventory
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-xl">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Out of Stock</p>
              <h3 className="text-3xl font-bold text-warning-600">
                {lowStockProducts.filter(p => p.stock_quantity === 0).length}
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Needs restock
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-xl">
              <Package className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card title="Low Stock Alert">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Current Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Min. Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm text-neutral-800">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{product.sku}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-semibold ${
                      product.stock_quantity === 0 ? 'text-danger-600' : 'text-warning-600'
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{product.min_stock_level}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock_quantity === 0
                        ? 'bg-danger-100 text-danger-700'
                        : 'bg-warning-100 text-warning-700'
                    }`}>
                      {product.stock_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-neutral-500">
                    No low stock products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );

  const renderProductPerformance = () => (
    <>
      <Card title="Top Selling Products">
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-primary-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">{product.name}</h4>
                  <p className="text-sm text-neutral-600">
                    {product.total_quantity} units sold
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-800">
                  TSH {product.total_revenue?.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-500">Revenue</p>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              No product data available
            </div>
          )}
        </div>
      </Card>
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Reports & Analytics</h1>
          <p className="text-neutral-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'sales' && renderSalesReport()}
          {activeTab === 'inventory' && renderInventoryReport()}
          {activeTab === 'products' && renderProductPerformance()}
        </>
      )}
    </div>
  );
};

export default ReportsPage;

