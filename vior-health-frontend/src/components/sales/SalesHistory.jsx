import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Eye, Download, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const SalesHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const salesData = [
    {
      id: 1,
      invoiceNo: 'INV-2024-0847',
      customer: 'John Doe',
      date: '2024-01-03',
      time: '10:30 AM',
      items: 5,
      amount: 125.50,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 2,
      invoiceNo: 'INV-2024-0846',
      customer: 'Jane Smith',
      date: '2024-01-03',
      time: '09:15 AM',
      items: 3,
      amount: 87.25,
      paymentMethod: 'Card',
      status: 'Completed',
    },
    {
      id: 3,
      invoiceNo: 'INV-2024-0845',
      customer: 'Michael Brown',
      date: '2024-01-02',
      time: '04:45 PM',
      items: 8,
      amount: 234.75,
      paymentMethod: 'Card',
      status: 'Completed',
    },
    {
      id: 4,
      invoiceNo: 'INV-2024-0844',
      customer: 'Sarah Wilson',
      date: '2024-01-02',
      time: '02:20 PM',
      items: 2,
      amount: 45.50,
      paymentMethod: 'Cash',
      status: 'Completed',
    },
    {
      id: 5,
      invoiceNo: 'INV-2024-0843',
      customer: 'David Lee',
      date: '2024-01-02',
      time: '11:30 AM',
      items: 4,
      amount: 156.00,
      paymentMethod: 'Insurance',
      status: 'Pending',
    },
  ];

  const columns = [
    {
      header: 'Invoice No.',
      accessor: 'invoiceNo',
      render: (row) => (
        <span className="font-semibold text-primary-600">{row.invoiceNo}</span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (row) => (
        <div>
          <p className="text-neutral-800">{row.date}</p>
          <p className="text-xs text-neutral-500">{row.time}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => (
        <span className="font-semibold">{row.items}</span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="font-bold text-neutral-800">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentMethod',
      render: (row) => (
        <Badge variant="info" size="sm">{row.paymentMethod}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={row.status === 'Completed' ? 'success' : 'warning'}
        >
          {row.status}
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Sales History</h2>
          <p className="text-sm text-neutral-600">View all completed transactions</p>
        </div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
          Export Report
        </Button>
      </div>

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
          <p className="text-2xl font-bold text-neutral-800">$2,145</p>
          <p className="text-xs text-success-600 mt-1">↑ 12.5%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">This Week</p>
          <p className="text-2xl font-bold text-neutral-800">$15,342</p>
          <p className="text-xs text-success-600 mt-1">↑ 8.3%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">This Month</p>
          <p className="text-2xl font-bold text-neutral-800">$65,789</p>
          <p className="text-xs text-success-600 mt-1">↑ 15.7%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-600 mb-1">Avg. Transaction</p>
          <p className="text-2xl font-bold text-neutral-800">$129.50</p>
          <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={salesData} />
      </Card>
    </div>
  );
};

export default SalesHistory;
