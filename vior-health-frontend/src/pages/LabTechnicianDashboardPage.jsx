import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { laboratoryAPI } from '../services/laboratory';
import { 
  Microscope, 
  ClipboardList, 
  Activity, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TestTube,
  FileText,
  Plus
} from 'lucide-react';
import { toast } from 'react-toastify';

const LabTechnicianDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
  });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, testsResponse] = await Promise.all([
        laboratoryAPI.getLabStats(),
        laboratoryAPI.getLabTests()
      ]);
      
      setStats(statsResponse.data);
      const tests = Array.isArray(testsResponse.data) 
        ? testsResponse.data 
        : testsResponse.data.results || [];
      setRecentTests(tests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const quickStats = [
    {
      title: 'Pending Tests',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'In Progress',
      value: stats.in_progress,
      icon: Activity,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Completed Today',
      value: stats.completed,
      icon: CheckCircle,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Tests',
      value: stats.total,
      icon: TestTube,
      color: 'bg-purple-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Laboratory Dashboard</h1>
          <p className="text-neutral-600 mt-1">Manage lab tests and measurements</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            icon={Microscope}
            onClick={() => navigate('/laboratory/tests')}
          >
            View All Tests
          </Button>
          <Button 
            icon={Plus}
            onClick={() => navigate('/laboratory/tests/create')}
          >
            Create Test
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.iconBg}`}>
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="w-5 h-5 text-neutral-700" />
          <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/laboratory/tests?status=pending')}
            className="p-6 border-2 border-neutral-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Start Pending Test</h3>
                <p className="text-sm text-neutral-600">Begin new measurements</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/laboratory/tests?status=in_progress')}
            className="p-6 border-2 border-neutral-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Continue Test</h3>
                <p className="text-sm text-neutral-600">Resume in-progress tests</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/laboratory/tests?status=completed')}
            className="p-6 border-2 border-neutral-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">Completed Tests</h3>
                <p className="text-sm text-neutral-600">View finished tests</p>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Recent Tests */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">Recent Tests</h2>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/laboratory/tests')}
          >
            View All
          </Button>
        </div>

        {recentTests.length === 0 ? (
          <div className="text-center py-12">
            <Microscope className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No lab tests assigned yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Test No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Test Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Requested</th>
                  <th className="text-right py-3 px-4 font-semibold text-neutral-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test) => (
                  <tr key={test.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium text-neutral-900">{test.test_number}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-neutral-900">{test.patient_name}</div>
                        {test.patient_phone && (
                          <div className="text-sm text-neutral-500">{test.patient_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">{test.test_name}</div>
                      <div className="text-sm text-neutral-500">
                        {test.test_type_name || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(test.status)}</td>
                    <td className="py-3 px-4 text-neutral-600">
                      {new Date(test.requested_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/laboratory/tests/${test.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LabTechnicianDashboardPage;
