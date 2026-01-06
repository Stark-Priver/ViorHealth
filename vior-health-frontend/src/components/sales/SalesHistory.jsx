import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Eye, Download, Search, Filter, X } from 'lucide-react';
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
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const handleViewSale = async (saleId) => {
    try {
      setLoadingDetails(true);
      const response = await salesAPI.getSale(saleId);
      setSelectedSale(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching sale details:', error);
      toast.error('Failed to load sale details');
    } finally {
      setLoadingDetails(false);
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
      render: (row) => (
        <button 
          onClick={() => handleViewSale(row.id)}
          className="text-primary-600 hover:text-primary-700"
          disabled={loadingDetails}
        >
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

      {/* Sale Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSale(null);
        }}
        title="Sale Details"
        size="lg"
      >
        {loadingDetails ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-neutral-600">Loading details...</p>
          </div>
        ) : selectedSale ? (
          <div className="space-y-6">
            {/* Sale Information */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200">
              <div>
                <p className="text-sm text-neutral-600">Invoice Number</p>
                <p className="font-semibold text-neutral-800">{selectedSale.invoice_number || `INV-${selectedSale.id}`}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Customer</p>
                <p className="font-semibold text-neutral-800">{selectedSale.customer?.name || selectedSale.customer_name || 'Walk-in Customer'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Date & Time</p>
                <p className="font-semibold text-neutral-800">
                  {formatDateTime(selectedSale.created_at).date} at {formatDateTime(selectedSale.created_at).time}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Payment Method</p>
                <Badge variant="info" size="sm">{selectedSale.payment_method || 'Cash'}</Badge>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Items Sold</h3>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">Product</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {selectedSale.items && selectedSale.items.length > 0 ? (
                      selectedSale.items.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="px-4 py-3 text-sm text-neutral-800">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-neutral-800">
                            {item.product?.name || item.product_name || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-neutral-800 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-neutral-800 text-right">
                            TSH {parseFloat(item.unit_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-neutral-800 text-right">
                            TSH {parseFloat(item.subtotal || (item.quantity * item.unit_price) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-neutral-500">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              {selectedSale.subtotal && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span className="font-semibold text-neutral-800">
                    TSH {parseFloat(selectedSale.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {selectedSale.tax && parseFloat(selectedSale.tax) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Tax (VAT):</span>
                  <span className="font-semibold text-neutral-800">
                    TSH {parseFloat(selectedSale.tax).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {selectedSale.discount && parseFloat(selectedSale.discount) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Discount:</span>
                  <span className="font-semibold text-red-600">
                    - TSH {parseFloat(selectedSale.discount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-neutral-300">
                <span className="text-lg font-bold text-neutral-800">Total:</span>
                <span className="text-lg font-bold text-primary-600">
                  TSH {parseFloat(selectedSale.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            {selectedSale.notes && (
              <div>
                <p className="text-sm text-neutral-600 mb-1">Notes:</p>
                <p className="text-sm text-neutral-800 bg-neutral-50 p-3 rounded-lg">{selectedSale.notes}</p>
              </div>
            )}

            {/* Served By */}
            {selectedSale.created_by_name && (
              <div className="text-sm text-neutral-600">
                Served by: <span className="font-semibold text-neutral-800">{selectedSale.created_by_name}</span>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default SalesHistory;
