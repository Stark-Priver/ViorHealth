import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Breadcrumb from '../components/common/Breadcrumb';
import { laboratoryAPI } from '../services/laboratory';
import { Search, Filter, Plus, Eye, Play, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const LaboratoryTestsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await laboratoryAPI.getLabTests();
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load laboratory tests');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      await laboratoryAPI.startTest(testId);
      toast.success('Test started successfully');
      fetchTests();
      navigate(`/laboratory/tests/${testId}`);
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      in_progress: { variant: 'info', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
      reviewed: { variant: 'default', label: 'Reviewed' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = 
      test.test_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || test.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Test Number',
      accessor: 'test_number',
      cell: (row) => (
        <span className="font-medium text-neutral-900">{row.test_number}</span>
      ),
    },
    {
      header: 'Patient',
      accessor: 'patient_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.patient_name}</div>
          {row.patient_phone && (
            <div className="text-sm text-neutral-500">{row.patient_phone}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Test',
      accessor: 'test_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.test_name}</div>
          <div className="text-sm text-neutral-500">
            {row.test_type_name || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Cost',
      accessor: 'cost',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">
            TSH {Number(row.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div>
            {row.paid ? (
              <Badge variant="success">Paid</Badge>
            ) : (
              <Badge variant="warning">Unpaid</Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Requested',
      accessor: 'requested_at',
      cell: (row) => new Date(row.requested_at).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <Button
              size="sm"
              icon={Play}
              onClick={() => handleStartTest(row.id)}
            >
              Start
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            icon={Eye}
            onClick={() => navigate(`/laboratory/tests/${row.id}`)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Laboratory Tests</h1>
          <p className="text-neutral-600 mt-1">Manage and track all laboratory tests</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => navigate('/laboratory/tests/create')}
        >
          Create Test
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by test number, patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tests Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredTests}
            emptyMessage="No laboratory tests found"
          />
        )}
      </Card>
    </div>
  );
};

export default LaboratoryTestsPage;
