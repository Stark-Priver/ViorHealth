import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Clock, CheckCircle, XCircle, User, Eye } from 'lucide-react';
import { prescriptionsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';

const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionsAPI.getPrescriptions();
      setPrescriptions(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (id) => {
    const createSale = window.confirm(
      'Do you want to create a sale record for this prescription?\n\n' +
      'Click OK to create a sale, or Cancel to just dispense without sale.'
    );
    
    try {
      const response = await prescriptionsAPI.dispensePrescription(id, {
        create_sale: createSale,
        payment_method: 'cash'
      });
      
      if (createSale && response.data.invoice_number) {
        toast.success(`Prescription dispensed successfully! Invoice: ${response.data.invoice_number}`);
      } else {
        toast.success('Prescription dispensed successfully');
      }
      
      fetchPrescriptions();
    } catch (error) {
      console.error('Error dispensing prescription:', error);
      toast.error(error.response?.data?.error || 'Failed to dispense prescription');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this prescription?')) return;
    
    try {
      await prescriptionsAPI.cancelPrescription(id);
      toast.success('Prescription cancelled');
      fetchPrescriptions();
    } catch (error) {
      console.error('Error cancelling prescription:', error);
      toast.error('Failed to cancel prescription');
    }
  };

  const handleViewDetails = async (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'dispensed':
        return 'bg-success-100 text-success-800';
      case 'cancelled':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Prescriptions</h1>
          <p className="text-neutral-600 mt-1">Manage and track prescription orders</p>
        </div>
        {hasRole(['admin', 'pharmacist']) && (
          <button
            onClick={() => navigate('/prescriptions/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Prescription
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-warning-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('dispensed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'dispensed'
                ? 'bg-success-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Dispensed
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-neutral-600">Loading prescriptions...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {prescription.customer_name || 'Unknown Patient'}
                          </div>
                          <div className="text-sm text-neutral-500">
                            RX #{prescription.prescription_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{prescription.doctor_name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        {formatDate(prescription.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {prescription.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleDispense(prescription.id)}
                              className="p-2 bg-success-100 text-success-600 rounded-lg hover:bg-success-200 transition-colors"
                              title="Dispense"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleCancel(prescription.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Cancel"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                No prescriptions found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPrescription(null);
        }}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm text-neutral-600">Prescription Number</p>
                <p className="font-semibold text-neutral-900">{selectedPrescription.prescription_number}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Status</p>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(selectedPrescription.status)}`}>
                  {selectedPrescription.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Patient Name</p>
                <p className="font-semibold text-neutral-900">{selectedPrescription.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Prescription Date</p>
                <p className="font-semibold text-neutral-900">{new Date(selectedPrescription.prescription_date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Doctor Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Doctor Name</p>
                  <p className="font-medium text-neutral-900">{selectedPrescription.doctor_name}</p>
                </div>
                {selectedPrescription.doctor_license && (
                  <div>
                    <p className="text-sm text-neutral-600">License Number</p>
                    <p className="font-medium text-neutral-900">{selectedPrescription.doctor_license}</p>
                  </div>
                )}
              </div>
              {selectedPrescription.diagnosis && (
                <div className="mt-3">
                  <p className="text-sm text-neutral-600">Diagnosis</p>
                  <p className="text-neutral-900">{selectedPrescription.diagnosis}</p>
                </div>
              )}
            </div>

            {/* Medications */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Prescribed Medications</h4>
              <div className="space-y-3">
                {selectedPrescription.items?.map((item, index) => (
                  <div key={index} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-neutral-900">{item.product_name}</h5>
                      <span className="px-2 py-1 bg-white rounded text-sm font-medium">Qty: {item.quantity}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-neutral-600">Dosage</p>
                        <p className="font-medium text-neutral-900">{item.dosage}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Frequency</p>
                        <p className="font-medium text-neutral-900">{item.frequency}</p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Duration</p>
                        <p className="font-medium text-neutral-900">{item.duration}</p>
                      </div>
                    </div>
                    {item.instructions && (
                      <div className="mt-2 pt-2 border-t border-amber-300">
                        <p className="text-xs text-neutral-600">Instructions</p>
                        <p className="text-sm text-neutral-900">{item.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {selectedPrescription.notes && (
              <div className="border-t border-neutral-200 pt-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Additional Notes</h4>
                <p className="text-neutral-700">{selectedPrescription.notes}</p>
              </div>
            )}

            {/* Dispensing Info */}
            {selectedPrescription.status === 'dispensed' && (
              <div className="border-t border-neutral-200 pt-4 bg-success-50 p-4 rounded-lg">
                <h4 className="font-semibold text-success-900 mb-2">Dispensing Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-success-700">Dispensed By</p>
                    <p className="font-medium text-success-900">{selectedPrescription.dispensed_by_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-success-700">Dispensed At</p>
                    <p className="font-medium text-success-900">{selectedPrescription.dispensed_at ? formatDate(selectedPrescription.dispensed_at) : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPrescription(null);
                }}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionsPage;
