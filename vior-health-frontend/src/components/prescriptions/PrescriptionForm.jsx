import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import { inventoryAPI, prescriptionsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PrescriptionForm = ({ onSuccess, prescription = null }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    doctor_name: '',
    diagnosis: '',
    medications: [{ drug: '', quantity: 1, dosage: '', frequency: '', duration: '' }]
  });
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (prescription) {
      setFormData({
        patient_name: prescription.patient_name || '',
        patient_phone: prescription.patient_phone || '',
        doctor_name: prescription.doctor_name || '',
        diagnosis: prescription.diagnosis || '',
        medications: prescription.medications || [{ drug: '', quantity: 1, dosage: '', frequency: '', duration: '' }]
      });
    }
  }, [prescription]);

  const fetchProducts = async () => {
    try {
      const response = await inventoryAPI.getProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { drug: '', quantity: 1, dosage: '', frequency: '', duration: '' }]
    });
  };

  const removeMedication = (index) => {
    if (formData.medications.length === 1) {
      toast.warning('At least one medication is required');
      return;
    }
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patient_name.trim()) {
      toast.error('Patient name is required');
      return;
    }
    if (!formData.doctor_name.trim()) {
      toast.error('Doctor name is required');
      return;
    }
    
    const validMedications = formData.medications.filter(med => med.drug);
    if (validMedications.length === 0) {
      toast.error('At least one medication is required');
      return;
    }

    try {
      setSubmitting(true);
      
      const prescriptionData = {
        patient_name: formData.patient_name,
        patient_phone: formData.patient_phone || '',
        doctor_name: formData.doctor_name,
        diagnosis: formData.diagnosis || '',
        medications: validMedications.map(med => ({
          drug: parseInt(med.drug),
          quantity: parseInt(med.quantity),
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          duration: med.duration || ''
        }))
      };

      if (prescription) {
        await prescriptionsAPI.updatePrescription(prescription.id, prescriptionData);
        toast.success('Prescription updated successfully');
      } else {
        await prescriptionsAPI.createPrescription(prescriptionData);
        toast.success('Prescription created successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to save prescription';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">Patient Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Patient Name *
          </label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter patient name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Patient Phone
          </label>
          <input
            type="tel"
            name="patient_phone"
            value={formData.patient_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      {/* Doctor Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">Doctor Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Doctor Name *
          </label>
          <input
            type="text"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter doctor name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Diagnosis
          </label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter diagnosis"
            rows={3}
          />
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-neutral-800">Medications</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addMedication}
          >
            Add Medication
          </Button>
        </div>

        {formData.medications.map((medication, index) => (
          <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-neutral-700">Medication {index + 1}</span>
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Drug *
                </label>
                <select
                  value={medication.drug}
                  onChange={(e) => handleMedicationChange(index, 'drug', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a drug</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.category?.name || 'General'} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={medication.quantity}
                  onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  value={medication.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 3 times daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 7 days"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : prescription ? 'Update Prescription' : 'Create Prescription'}
        </Button>
      </div>
    </form>
  );
};

export default PrescriptionForm;
