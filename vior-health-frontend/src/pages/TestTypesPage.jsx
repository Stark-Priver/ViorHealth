import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { laboratoryAPI } from '../services/laboratory';
import { Plus, Edit, Trash2, TestTube, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const TestTypesPage = () => {
  const navigate = useNavigate();
  const [testTypes, setTestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    cost: '',
    is_active: true
  });

  useEffect(() => {
    fetchTestTypes();
  }, []);

  const fetchTestTypes = async () => {
    try {
      setLoading(true);
      const response = await laboratoryAPI.getTestTypes();
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || [];
      setTestTypes(data);
    } catch (error) {
      console.error('Error fetching test types:', error);
      toast.error('Failed to load test types');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testType = null) => {
    if (testType) {
      setEditingType(testType);
      setFormData({
        name: testType.name,
        code: testType.code,
        description: testType.description || '',
        cost: testType.cost,
        is_active: testType.is_active
      });
    } else {
      setEditingType(null);
      setFormData({
        name: '',
        code: '',
        description: '',
        cost: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingType(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      cost: '',
      is_active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...formData,
        cost: parseFloat(formData.cost)
      };

      if (editingType) {
        await laboratoryAPI.updateTestType(editingType.id, dataToSend);
        toast.success('Test type updated successfully');
      } else {
        await laboratoryAPI.createTestType(dataToSend);
        toast.success('Test type created successfully');
      }
      
      handleCloseModal();
      fetchTestTypes();
    } catch (error) {
      console.error('Error saving test type:', error);
      toast.error(error.response?.data?.message || 'Failed to save test type');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test type?')) return;
    
    try {
      await laboratoryAPI.deleteTestType(id);
      toast.success('Test type deleted successfully');
      fetchTestTypes();
    } catch (error) {
      console.error('Error deleting test type:', error);
      toast.error('Failed to delete test type');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredTestTypes = testTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Test Name',
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium text-neutral-900">{row.name}</div>
          <div className="text-sm text-neutral-500">{row.code}</div>
        </div>
      ),
    },
    {
      header: 'Cost (TSH)',
      accessor: 'cost',
      cell: (row) => (
        <span className="font-semibold text-neutral-900">
          {Number(row.cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active',
      cell: (row) => (
        row.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="default">Inactive</Badge>
        )
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => (
        <span className="text-neutral-600">{row.description || 'N/A'}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={Edit}
            onClick={() => handleOpenModal(row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={() => handleDelete(row.id)}
          >
            Delete
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
          <h1 className="text-2xl font-bold text-neutral-900">Test Types</h1>
          <p className="text-neutral-600 mt-1">Manage laboratory test types and pricing</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => handleOpenModal()}
        >
          Add Test Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by test name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Test Types Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredTestTypes}
            emptyMessage="No test types found"
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingType ? 'Edit Test Type' : 'Add Test Type'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Test Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Blood Pressure Check"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Test Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={!!editingType}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-neutral-100"
              placeholder="e.g., blood_pressure"
            />
            <p className="text-xs text-neutral-500 mt-1">Code cannot be changed after creation</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Cost (TSH) *
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the test..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-neutral-700">
              Test type is active
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" icon={editingType ? Edit : Plus}>
              {editingType ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestTypesPage;
