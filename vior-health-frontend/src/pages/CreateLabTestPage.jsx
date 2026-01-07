import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { laboratoryAPI } from '../services/laboratory';
import { authAPI } from '../services/api';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateLabTestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [labTechnicians, setLabTechnicians] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [formData, setFormData] = useState({
    test_type: '',
    test_name: '',
    description: '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    patient_phone: '',
    cost: '',
    paid: false,
    assigned_to: ''
  });

  useEffect(() => {
    fetchLabTechnicians();
    fetchTestTypes();
  }, []);

  const fetchLabTechnicians = async () => {
    try {
      const response = await authAPI.getAllUsers();
      const users = Array.isArray(response.data) ? response.data : response.data.results || [];
      const techs = users.filter(user => user.role === 'lab_technician');
      setLabTechnicians(techs);
    } catch (error) {
      console.error('Error fetching lab technicians:', error);
    }
  };

  const fetchTestTypes = async () => {
    try {
      const response = await laboratoryAPI.getTestTypes();
      const types = Array.isArray(response.data) ? response.data : response.data.results || [];
      setTestTypes(types.filter(type => type.is_active));
    } catch (error) {
      console.error('Error fetching test types:', error);
      toast.error('Failed to load test types');
    }
  };

  const handleTestTypeChange = (e) => {
    const testTypeId = e.target.value;
    const selectedTestType = testTypes.find(type => type.id === parseInt(testTypeId));
    
    if (selectedTestType) {
      setFormData(prev => ({
        ...prev,
        test_type: testTypeId,
        test_name: selectedTestType.name,
        cost: selectedTestType.cost
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        test_type: '',
        test_name: '',
        cost: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.test_type || !formData.patient_name || !formData.cost) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await laboratoryAPI.createLabTest({
        ...formData,
        patient_age: formData.patient_age ? parseInt(formData.patient_age) : null,
        cost: parseFloat(formData.cost)
      });
      toast.success('Lab test created successfully');
      navigate(`/laboratory/tests/${response.data.id}`);
    } catch (error) {
      console.error('Error creating lab test:', error);
      toast.error('Failed to create lab test');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/laboratory/tests')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Create Lab Test</h1>
          <p className="text-neutral-600 mt-1">Add a new laboratory test request</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            {/* Test Information */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Test Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Test Type *
                  </label>
                  <select
                    name="test_type"
                    value={formData.test_type}
                    onChange={handleTestTypeChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select test type</option>
                    {testTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - TSH {Number(type.cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    name="test_name"
                    value={formData.test_name}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Test name will be auto-filled"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes or instructions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Test Cost *
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    readOnly
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cost will be auto-filled"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Cost is automatically set based on test type</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Payment Status
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="checkbox"
                      name="paid"
                      checked={formData.paid}
                      onChange={(e) => setFormData(prev => ({ ...prev, paid: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-neutral-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-neutral-700">Mark as paid</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Assign to Lab Technician
                  </label>
                  <select
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select technician (optional)</option>
                    {labTechnicians.map(tech => (
                      <option key={tech.id} value={tech.id}>
                        {tech.first_name} {tech.last_name} ({tech.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="patient_age"
                    value={formData.patient_age}
                    onChange={handleChange}
                    min="0"
                    max="150"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Age in years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="patient_gender"
                    value={formData.patient_gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="patient_phone"
                    value={formData.patient_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., +255 123 456 789"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/laboratory/tests')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={Plus}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Lab Test'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateLabTestPage;
