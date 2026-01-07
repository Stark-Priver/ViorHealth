import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { laboratoryAPI } from '../services/laboratory';
import { 
  Search, 
  Eye, 
  Activity, 
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';

const LabReportsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      
      // Filter for tests that need reporting (in_progress and completed)
      const reportTests = data.filter(t => 
        t.status === 'in_progress' || t.status === 'completed'
      );
      setTests(reportTests);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load laboratory reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: { variant: 'info', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
    };
    const config = statusConfig[status];
    return <Badge variant={config?.variant}>{config?.label}</Badge>;
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = 
      test.test_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    inProgress: tests.filter(t => t.status === 'in_progress').length,
    completed: tests.filter(t => t.status === 'completed').length,
    needingMeasurements: tests.filter(t => t.status === 'in_progress' && (!t.measurements || t.measurements.length === 0)).length,
    totalTests: tests.length
  };

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
      header: 'Patient',
      accessor: 'patient_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.patient_name}</div>
          {row.patient_age && (
            <div className="text-xs text-neutral-500">{row.patient_age} years old</div>
          )}
        </div>
      ),
    },
    {
      header: 'Test Type',
      accessor: 'test_name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.test_name}</div>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {row.test_type_name || 'N/A'}
          </span>
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
              By: {row.assigned_to_name.split(' ')[0]}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Progress',
      accessor: 'measurements',
      cell: (row) => {
        const measurementCount = row.measurements?.length || 0;
        return (
          <div>
            <div className="text-sm font-medium text-neutral-900">
              {measurementCount} measurement{measurementCount !== 1 ? 's' : ''}
            </div>
            {row.status === 'in_progress' && measurementCount === 0 && (
              <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                Needs data
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <Button
          size="sm"
          variant="primary"
          icon={Eye}
          onClick={() => navigate(`/laboratory/tests/${row.id}`)}
        >
          View & Add Data
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Test Reports & Measurements</h1>
          <p className="text-neutral-600 mt-1">Active tests requiring measurements and completion</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* In Progress Tests */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-purple-900">{stats.inProgress}</p>
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

        {/* Needs Measurements */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Needs Data</p>
              <p className="text-3xl font-bold text-red-900">{stats.needingMeasurements}</p>
              <p className="text-xs text-red-600 mt-1">Requires measurements</p>
            </div>
            <div className="bg-red-200 p-3 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-700" />
            </div>
          </div>
        </Card>

        {/* Total Reports */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalTests}</p>
              <p className="text-xs text-blue-600 mt-1">Active tests</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-lg">
              <FileText className="w-8 h-8 text-blue-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
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
        </div>
      </Card>

      {/* Reports Table */}
      <Card>
        <div className="mb-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Active Test Reports</h2>
              <p className="text-sm text-neutral-600 mt-1">
                Tests in progress and completed awaiting review
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <ClipboardList className="w-4 h-4" />
              <span>{filteredTests.length} reports</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg font-medium">No active reports</p>
            <p className="text-neutral-400 text-sm mt-2">
              {searchTerm 
                ? "Try adjusting your search" 
                : "All tests have been reviewed or are pending start"}
            </p>
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

export default LabReportsPage;
