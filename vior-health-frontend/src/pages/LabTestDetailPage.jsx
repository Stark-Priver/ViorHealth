import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { laboratoryAPI } from '../services/laboratory';
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  CheckCircle, 
  Activity,
  Trash2,
  User,
  Calendar,
  Phone,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';

const LabTestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [completionData, setCompletionData] = useState({
    results: '',
    diagnosis: '',
    notes: ''
  });

  const [newMeasurement, setNewMeasurement] = useState({
    parameter_name: '',
    value: '',
    unit: '',
    reference_range: '',
    is_normal: true
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchTestDetails();
    }
  }, [id]);

  const fetchTestDetails = async () => {
    if (!id || id === 'undefined') {
      toast.error('Invalid test ID');
      navigate('/laboratory/tests');
      return;
    }
    
    try {
      setLoading(true);
      const [testResponse, measurementsResponse] = await Promise.all([
        laboratoryAPI.getLabTest(id),
        laboratoryAPI.getMeasurements(id)
      ]);
      
      setTest(testResponse.data);
      const measData = Array.isArray(measurementsResponse.data)
        ? measurementsResponse.data
        : measurementsResponse.data.results || [];
      setMeasurements(measData);
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast.error('Failed to load test details');
      navigate('/laboratory/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = async () => {
    try {
      await laboratoryAPI.createMeasurement({
        ...newMeasurement,
        lab_test: id
      });
      
      toast.success('Measurement added successfully');
      setShowAddMeasurement(false);
      setNewMeasurement({
        parameter_name: '',
        value: '',
        unit: '',
        reference_range: '',
        is_normal: true
      });
      fetchTestDetails();
    } catch (error) {
      console.error('Error adding measurement:', error);
      toast.error('Failed to add measurement');
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) return;
    
    try {
      await laboratoryAPI.deleteMeasurement(measurementId);
      toast.success('Measurement deleted successfully');
      fetchTestDetails();
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast.error('Failed to delete measurement');
    }
  };

  const handleCompleteTest = async () => {
    try {
      await laboratoryAPI.completeTest(id, completionData);
      toast.success('Test completed successfully');
      setShowCompleteModal(false);
      fetchTestDetails();
    } catch (error) {
      console.error('Error completing test:', error);
      toast.error('Failed to complete test');
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      await laboratoryAPI.markAsPaid(id, paymentMethod);
      toast.success('Test marked as paid');
      setShowPaymentModal(false);
      fetchTestDetails();
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error('Failed to mark test as paid');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Test not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate('/laboratory/tests')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{test.test_number}</h1>
            <p className="text-neutral-600 mt-1">{test.test_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(test.status)}
          {!test.paid && (
            <Button
              variant="success"
              icon={DollarSign}
              onClick={() => setShowPaymentModal(true)}
            >
              Mark as Paid
            </Button>
          )}
          {test.status === 'pending' && (
            <Button
              icon={Activity}
              onClick={async () => {
                try {
                  await laboratoryAPI.startTest(id);
                  toast.success('Test started successfully');
                  fetchTestDetails();
                } catch (error) {
                  console.error('Error starting test:', error);
                  toast.error('Failed to start test');
                }
              }}
            >
              Start Test
            </Button>
          )}
          {test.status === 'in_progress' && (
            <Button
              icon={CheckCircle}
              onClick={() => setShowCompleteModal(true)}
            >
              Complete Test
            </Button>
          )}
        </div>
      </div>

      {/* Test Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </h2>
          <div className="space-y-3">
            {test.customer_name && (
              <div className="pb-3 mb-3 border-b border-neutral-200">
                <label className="text-sm font-medium text-neutral-600">Customer</label>
                <p className="text-neutral-900 font-semibold">{test.customer_name}</p>
                {test.customer_phone && (
                  <p className="text-sm text-neutral-600">{test.customer_phone}</p>
                )}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-neutral-600">Name</label>
              <p className="text-neutral-900 font-medium">{test.patient_name}</p>
            </div>
            {test.patient_age && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Age</label>
                <p className="text-neutral-900">{test.patient_age} years</p>
              </div>
            )}
            {test.patient_gender && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Gender</label>
                <p className="text-neutral-900 capitalize">{test.patient_gender}</p>
              </div>
            )}
            {test.patient_phone && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Phone</label>
                <p className="text-neutral-900">{test.patient_phone}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Test Details */}
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Test Details
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-600">Test Type</label>
              <p className="text-neutral-900">{test.test_type_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600">Cost</label>
              <p className="text-neutral-900 font-semibold">TSH {Number(test.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600">Payment Status</label>
              <div className="flex items-center gap-2">
                {test.paid ? (
                  <>
                    <Badge variant="success">Paid</Badge>
                    {test.payment_method && (
                      <span className="text-xs text-neutral-600">via {test.payment_method}</span>
                    )}
                  </>
                ) : (
                  <Badge variant="warning">Unpaid</Badge>
                )}
              </div>
              {test.paid && test.paid_at && (
                <p className="text-xs text-neutral-500 mt-1">Paid on {new Date(test.paid_at).toLocaleString()}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600">Requested By</label>
              <p className="text-neutral-900">{test.requested_by_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600">Requested Date</label>
              <p className="text-neutral-900">{new Date(test.requested_at).toLocaleString()}</p>
            </div>
            {test.description && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Description</label>
                <p className="text-neutral-900">{test.description}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Measurements */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Measurements</h2>
          {test.status !== 'completed' && test.status !== 'reviewed' && (
            <Button
              icon={Plus}
              size="sm"
              onClick={() => setShowAddMeasurement(true)}
            >
              Add Measurement
            </Button>
          )}
        </div>

        {measurements.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No measurements recorded yet</p>
            {test.status !== 'completed' && test.status !== 'reviewed' && (
              <Button
                className="mt-4"
                icon={Plus}
                onClick={() => setShowAddMeasurement(true)}
              >
                Add First Measurement
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Parameter</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Reference Range</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-neutral-700">Measured By</th>
                  {test.status !== 'completed' && test.status !== 'reviewed' && (
                    <th className="text-right py-3 px-4 font-semibold text-neutral-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-medium text-neutral-900">{measurement.parameter_name}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900">{measurement.value}</span>
                      <span className="text-neutral-600 ml-1">{measurement.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{measurement.reference_range || 'N/A'}</td>
                    <td className="py-3 px-4">
                      {measurement.is_normal ? (
                        <Badge variant="success">Normal</Badge>
                      ) : (
                        <Badge variant="danger">Abnormal</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{measurement.measured_by_name || 'N/A'}</td>
                    {test.status !== 'completed' && test.status !== 'reviewed' && (
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                          onClick={() => handleDeleteMeasurement(measurement.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Results Section (for completed tests) */}
      {(test.status === 'completed' || test.status === 'reviewed') && (
        <Card>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Results & Diagnosis</h2>
          <div className="space-y-4">
            {test.results && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Test Results</label>
                <p className="text-neutral-900 whitespace-pre-wrap mt-1">{test.results}</p>
              </div>
            )}
            {test.diagnosis && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Diagnosis</label>
                <p className="text-neutral-900 whitespace-pre-wrap mt-1 bg-blue-50 border border-blue-200 rounded-lg p-3">{test.diagnosis}</p>
              </div>
            )}
            {test.notes && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Notes</label>
                <p className="text-neutral-900 whitespace-pre-wrap mt-1">{test.notes}</p>
              </div>
            )}
            {test.completed_at && (
              <div>
                <label className="text-sm font-medium text-neutral-600">Completed At</label>
                <p className="text-neutral-900">{new Date(test.completed_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Add Measurement Modal */}
      <Modal
        isOpen={showAddMeasurement}
        onClose={() => setShowAddMeasurement(false)}
        title="Add Measurement"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Parameter Name *
            </label>
            <input
              type="text"
              value={newMeasurement.parameter_name}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, parameter_name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Blood Pressure, Glucose Level"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Value *
              </label>
              <input
                type="text"
                value={newMeasurement.value}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Unit *
              </label>
              <input
                type="text"
                value={newMeasurement.unit}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, unit: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="mmHg, mg/dL"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Reference Range
            </label>
            <input
              type="text"
              value={newMeasurement.reference_range}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, reference_range: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 90-120 mmHg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_normal"
              checked={newMeasurement.is_normal}
              onChange={(e) => setNewMeasurement({ ...newMeasurement, is_normal: e.target.checked })}
              className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_normal" className="text-sm font-medium text-neutral-700">
              Value is within normal range
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowAddMeasurement(false)}
            >
              Cancel
            </Button>
            <Button
              icon={Save}
              onClick={handleAddMeasurement}
              disabled={!newMeasurement.parameter_name || !newMeasurement.value || !newMeasurement.unit}
            >
              Add Measurement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Test Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Test"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Test Results *
            </label>
            <textarea
              value={completionData.results}
              onChange={(e) => setCompletionData({ ...completionData, results: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter overall test results and findings..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Diagnosis
            </label>
            <textarea
              value={completionData.diagnosis}
              onChange={(e) => setCompletionData({ ...completionData, diagnosis: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Medical diagnosis based on test results..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={completionData.notes}
              onChange={(e) => setCompletionData({ ...completionData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional observations or recommendations..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Once completed, this test will be sent to the pharmacist for review.
              Make sure all measurements are recorded accurately.
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCompleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              icon={CheckCircle}
              onClick={handleCompleteTest}
            >
              Complete Test
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Mark Test as Paid"
        >
          <div className="space-y-4">
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600">Test Number:</span>
                <span className="text-neutral-900 font-semibold">{test.test_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600">Amount:</span>
                <span className="text-lg font-bold text-neutral-900">
                  TSH {Number(test.cost || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Money</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                This will mark the test as paid and record the payment time.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                icon={DollarSign}
                onClick={handleMarkAsPaid}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LabTestDetailPage;
