import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { laboratoryAPI } from '../services/laboratory';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Play, 
  CheckCircle, 
  TestTube, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';

const LaboratoryTestsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    totalRevenue: 0,
    paidTests: 0,
    unpaidTests: 0
  });

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
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load laboratory tests');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (testsData) => {
    const stats = {
      total: testsData.length,
      pending: testsData.filter(t => t.status === 'pending').length,
      in_progress: testsData.filter(t => t.status === 'in_progress').length,
      completed: testsData.filter(t => t.status === 'completed' || t.status === 'reviewed').length,
      totalRevenue: testsData.reduce((sum, t) => sum + parseFloat(t.cost || 0), 0),
      paidTests: testsData.filter(t => t.paid).length,
      unpaidTests: testsData.filter(t => !t.paid).length
    };
    setStats(stats);
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
        <div>
          <span className="font-semibold text-blue-600">{row.test_number}</span>
          <div className="text-xs text-neutral-500 mt-0.5">
            {new Date(row.requested_at).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Patient Information',
      accessor: 'patient_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.patient_name}</div>
          {row.customer_name && row.customer_name !== row.patient_name && (
            <div className="text-xs text-neutral-500">Customer: {row.customer_name}</div>
          )}
          {row.patient_phone && (
            <div className="text-xs text-neutral-500">{row.patient_phone}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Test Details',
      accessor: 'test_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.test_name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {row.test_type_name || 'N/A'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Cost & Payment',
      accessor: 'cost',
      cell: (row) => (
        <div>
          <div className="font-bold text-neutral-900 text-lg">
            TSH {Number(row.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1">
            {row.paid ? (
              <div className="flex items-center gap-1">
                <Badge variant="success">Paid</Badge>
                {row.payment_method && (
                  <span className="text-xs text-neutral-600">({row.payment_method})</span>
                )}
              </div>
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
      cell: (row) => (
        <div>
          {getStatusBadge(row.status)}
          {row.assigned_to_name && (
            <div className="text-xs text-neutral-500 mt-1">
              Assigned: {row.assigned_to_name.split(' ')[0]}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && (
            <Button
              size="sm"
              variant="primary"
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tests */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Tests</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <TestTube className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>

        {/* Pending Tests */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              <p className="text-xs text-yellow-600 mt-1">Awaiting processing</p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-700" />
            </div>
          </div>
        </Card>

        {/* In Progress Tests */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-purple-900">{stats.in_progress}</p>
              <p className="text-xs text-purple-600 mt-1">Being processed</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-purple-700" />
            </div>
          </div>
        </Card>

        {/* Completed Tests */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              <p className="text-xs text-green-600 mt-1">Ready for review</p>
            </div>
            <div className="bg-green-200 p-3 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue & Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-900">
                TSH {stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">Paid Tests</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.paidTests}</p>
              <p className="text-xs text-neutral-500">
                {stats.total > 0 ? Math.round((stats.paidTests / stats.total) * 100) : 0}% of total
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">Unpaid Tests</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.unpaidTests}</p>
              <p className="text-xs text-neutral-500">Requires payment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by test number, patient name, test type..."
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

      {/* Test Summary */}
      {!loading && filteredTests.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Test Summary</h3>
            <span className="text-sm text-neutral-600">
              Showing {filteredTests.length} of {tests.length} tests
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-2xl font-bold text-neutral-900">
                {filteredTests.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-xs text-neutral-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">
                {filteredTests.filter(t => t.status === 'in_progress').length}
              </p>
              <p className="text-xs text-purple-600 mt-1">In Progress</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">
                {filteredTests.filter(t => t.status === 'completed' || t.status === 'reviewed').length}
              </p>
              <p className="text-xs text-green-600 mt-1">Completed</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">
                TSH {filteredTests.reduce((sum, t) => sum + parseFloat(t.cost || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-blue-600 mt-1">Total Value</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tests Table */}
      <Card>
        <div className="mb-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">All Laboratory Tests</h2>
              <p className="text-sm text-neutral-600 mt-1">
                Complete list of all tests with their details and current status
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <TestTube className="w-4 h-4" />
              <span>{filteredTests.length} tests</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <TestTube className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg font-medium">No laboratory tests found</p>
            <p className="text-neutral-400 text-sm mt-2">
              {searchTerm || statusFilter 
                ? "Try adjusting your filters" 
                : "Create your first test to get started"}
            </p>
            {!searchTerm && !statusFilter && (
              <Button
                icon={Plus}
                onClick={() => navigate('/laboratory/tests/create')}
                className="mt-4"
              >
                Create First Test
              </Button>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredTests}
          />
        )}
      </Card>
    </div>
  );
};

export default LaboratoryTestsPage;
