import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Eye, Download, Search, Filter } from 'lucide-react';
import { salesAPI, analyticsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const SalesHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    average: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
    fetchStats();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getSales();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getDashboardStats();
      const data = response.data;
      
      setStats({
        today: data.today_revenue || 0,
        week: data.week_revenue || 0,
        month: data.month_revenue || 0,
        average: data.average_transaction || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: 'N/A', time: 'N/A' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const columns = [
    {
      header: 'Invoice No.',
      accessor: 'invoice_number',
      render: (row) => (
        <span className="font-semibold text-primary-600">{row.invoice_number || `INV-${row.id}`}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => row.customer?.name || row.customer_name || 'Walk-in Customer',
    },
    {
      header: 'Date & Time',
      accessor: 'created_at',
      render: (row) => {
        const { date, time } = formatDateTime(row.created_at);
        return (
          <div>
            <p className="text-neutral-800">{date}</p>
            <p className="text-xs text-neutral-500">{time}</p>
          </div>
        );
      },
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="font-semibold">{row.items?.length || row.total_items || 0}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'total',
      render: (row) => (
        <span className="font-bold text-neutral-800">
          TSH {parseFloat(row.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment_method',
      render: (row) => (
        <Badge variant="info" size="sm">{row.payment_method || 'Cash'}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={row.status === 'completed' || row.status === 'Completed' ? 'success' : 'warning'}
        >
          {row.status || 'Completed'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: () => (
        <button className="text-primary-600 hover:text-primary-700">
          <Eye className="w-5 h-5" />
        </button>
      ),
    },
  ];

  const filteredSales = salesData.filter(sale => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (sale.invoice_number?.toLowerCase().includes(searchLower)) ||
      (sale.customer?.name?.toLowerCase().includes(searchLower)) ||
      (sale.customer_name?.toLowerCase().includes(searchLower)) ||
      (sale.id?.toString().includes(searchLower))
    );
  });

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by invoice, customer, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">Today's Sales</p>
          <p className="text-2xl font-bold text-neutral-800">
            TSH {parseFloat(stats.today).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">This Week</p>
          <p className="text-2xl font-bold text-neutral-800">
            TSH {parseFloat(stats.week).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">This Month</p>
          <p className="text-2xl font-bold text-neutral-800">
            TSH {parseFloat(stats.month).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">Avg. Transaction</p>
          <p className="text-2xl font-bold text-neutral-800">
            TSH {parseFloat(stats.average).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-neutral-600">Loading sales...</p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <p>No sales found</p>
          </div>
        ) : (
          <Table columns={columns} data={filteredSales} />
        )}
      </Card>
    </div>
  );
};

export default SalesHistory;
