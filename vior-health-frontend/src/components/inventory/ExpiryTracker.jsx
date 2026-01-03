import Card from '../common/Card';
import Badge from '../common/Badge';
import Table from '../common/Table';
import { Calendar, AlertCircle } from 'lucide-react';

const ExpiryTracker = () => {
  const expiringProducts = [
    {
      id: 1,
      name: 'Vitamin C 1000mg',
      sku: 'MED-015',
      batch: 'BATCH-2024-045',
      quantity: 120,
      expiry: '2025-02-15',
      daysLeft: 43,
      status: 'warning',
    },
    {
      id: 2,
      name: 'Omeprazole 20mg',
      sku: 'MED-004',
      batch: 'BATCH-2024-023',
      quantity: 15,
      expiry: '2025-02-28',
      daysLeft: 56,
      status: 'warning',
    },
    {
      id: 3,
      name: 'Ibuprofen 200mg',
      sku: 'MED-010',
      batch: 'BATCH-2024-078',
      quantity: 85,
      expiry: '2025-03-10',
      daysLeft: 66,
      status: 'info',
    },
    {
      id: 4,
      name: 'Paracetamol Syrup',
      sku: 'MED-018',
      batch: 'BATCH-2024-012',
      quantity: 40,
      expiry: '2025-01-30',
      daysLeft: 27,
      status: 'danger',
    },
  ];

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.name}</p>
          <p className="text-xs text-neutral-500">SKU: {row.sku}</p>
        </div>
      ),
    },
    {
      header: 'Batch Number',
      accessor: 'batch',
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
    },
    {
      header: 'Expiry Date',
      accessor: 'expiry',
      render: (row) => (
        <div>
          <p className="font-medium text-neutral-800">{row.expiry}</p>
          <p className="text-xs text-neutral-500">{row.daysLeft} days left</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'danger' ? 'danger' :
            row.status === 'warning' ? 'warning' :
            'info'
          }
        >
          {row.daysLeft < 30 ? 'Urgent' : row.daysLeft < 60 ? 'Soon' : 'Tracked'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 30 Days</p>
              <p className="text-2xl font-bold text-neutral-800">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Calendar className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 60 Days</p>
              <p className="text-2xl font-bold text-neutral-800">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Expiring in 90 Days</p>
              <p className="text-2xl font-bold text-neutral-800">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Products Table */}
      <Card title="Products Nearing Expiry">
        <Table columns={columns} data={expiringProducts} />
      </Card>
    </div>
  );
};

export default ExpiryTracker;
