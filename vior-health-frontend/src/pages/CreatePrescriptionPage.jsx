import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, User, Stethoscope, FileText, Pill } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { inventoryAPI, prescriptionsAPI, salesAPI } from '../services/api';
import { toast } from 'react-toastify';

const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    doctor_name: '',
    doctor_license: '',
    diagnosis: '',
    prescription_date: new Date().toISOString().split('T')[0],
    notes: '',
    medications: [{ 
      drug: '', 
      quantity: 1, 
      dosage: '', 
      frequency: '', 
      duration: '',
      instructions: '' 
    }]
  });

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

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

  const fetchCustomers = async () => {
    try {
      const response = await salesAPI.getCustomers();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
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
      medications: [...formData.medications, { 
        drug: '', 
        quantity: 1, 
        dosage: '', 
        frequency: '', 
        duration: '',
        instructions: '' 
      }]
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
    let customerId = formData.customer;
    
    // If creating new customer
    if (showNewCustomer) {
      if (!formData.patient_name.trim()) {
        toast.error('Patient name is required');
        return;
      }
      if (!formData.patient_phone.trim()) {
        toast.error('Patient phone is required for new customer');
        return;
      }
      
      try {
        const customerData = {
          name: formData.patient_name,
          phone: formData.patient_phone,
          email: formData.patient_email || ''
        };
        const response = await salesAPI.createCustomer(customerData);
        customerId = response.data.id;
      } catch {
        toast.error('Failed to create customer');
        return;
      }
    } else {
      if (!customerId) {
        toast.error('Please select a customer');
        return;
      }
    }
    
    if (!formData.doctor_name.trim()) {
      toast.error('Doctor name is required');
      return;
    }
    
    if (!formData.diagnosis.trim()) {
      toast.error('Diagnosis is required');
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
        customer: parseInt(customerId),
        doctor_name: formData.doctor_name,
        doctor_license: formData.doctor_license || '',
        diagnosis: formData.diagnosis,
        prescription_date: formData.prescription_date,
        notes: formData.notes || '',
        items: validMedications.map(med => ({
          product: parseInt(med.drug),
          quantity: parseInt(med.quantity),
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          duration: med.duration || '',
          instructions: med.instructions || ''
        }))
      };

      await prescriptionsAPI.createPrescription(prescriptionData);
      toast.success('Prescription created successfully');
      navigate('/prescriptions');
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

  const getProductInfo = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    return product;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/prescriptions')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Prescriptions
        </button>
        <h1 className="text-3xl font-bold text-neutral-800">Create New Prescription</h1>
        <p className="text-neutral-600 mt-1">Fill in the details to create a new prescription</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information Card */}
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-800">Patient Information</h2>
                  <p className="text-sm text-neutral-600">Select or create a new patient</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Customer Selection Toggle */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={!showNewCustomer}
                      onChange={() => setShowNewCustomer(false)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm font-medium text-neutral-700">Select Existing Customer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={showNewCustomer}
                      onChange={() => setShowNewCustomer(true)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm font-medium text-neutral-700">New Customer</span>
                  </label>
                </div>

                {/* Customer Selection or Creation */}
                {!showNewCustomer ? (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Select Customer <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="customer"
                      value={formData.customer}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required={!showNewCustomer}
                    >
                      <option value="">-- Select a customer --</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Patient Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="patient_name"
                        value={formData.patient_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter patient's full name"
                        required={showNewCustomer}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="patient_phone"
                        value={formData.patient_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+255..."
                        required={showNewCustomer}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="patient_email"
                        value={formData.patient_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Doctor Information Card */}
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-800">Doctor Information</h2>
                  <p className="text-sm text-neutral-600">Enter prescribing physician details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Doctor Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Dr. ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="doctor_license"
                    value={formData.doctor_license}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="License #"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Prescription Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    name="prescription_date"
                    value={formData.prescription_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Diagnosis <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter diagnosis or condition"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Medications Card */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-800">Medications</h2>
                    <p className="text-sm text-neutral-600">Add prescribed medications</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addMedication}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Medication
                </Button>
              </div>

              <div className="space-y-4">
                {formData.medications.map((medication, index) => {
                  const productInfo = getProductInfo(medication.drug);
                  return (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-neutral-800">Medication {index + 1}</h3>
                        {formData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Drug <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={medication.drug}
                            onChange={(e) => handleMedicationChange(index, 'drug', e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                            required
                          >
                            <option value="">Select a drug</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - {product.category?.name || 'General'} (Stock: {product.quantity})
                              </option>
                            ))}
                          </select>
                          {productInfo && (
                            <p className="mt-2 text-xs text-neutral-600 bg-blue-50 p-2 rounded">
                              💊 Available: {productInfo.quantity} units | Price: TZS {parseFloat(productInfo.unit_price || 0).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Quantity <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={medication.quantity}
                            onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., 500mg, 10ml"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Frequency
                          </label>
                          <select
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select frequency</option>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="Four times daily">Four times daily</option>
                            <option value="Every 4 hours">Every 4 hours</option>
                            <option value="Every 6 hours">Every 6 hours</option>
                            <option value="Every 8 hours">Every 8 hours</option>
                            <option value="Before meals">Before meals</option>
                            <option value="After meals">After meals</option>
                            <option value="At bedtime">At bedtime</option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="e.g., 7 days, 2 weeks"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Special Instructions
                          </label>
                          <textarea
                            value={medication.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Any special instructions for this medication..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - Summary & Notes */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Summary Card */}
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-neutral-600" />
                  <h3 className="font-semibold text-neutral-800">Prescription Summary</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-neutral-600">Patient:</span>
                    <p className="font-medium text-neutral-800">
                      {formData.patient_name || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-neutral-600">Doctor:</span>
                    <p className="font-medium text-neutral-800">
                      {formData.doctor_name || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-neutral-600">Total Medications:</span>
                    <p className="font-medium text-neutral-800">
                      {formData.medications.filter(m => m.drug).length} item(s)
                    </p>
                  </div>

                  {formData.diagnosis && (
                    <div>
                      <span className="text-neutral-600">Diagnosis:</span>
                      <p className="font-medium text-neutral-800 text-xs">
                        {formData.diagnosis}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Additional Notes Card */}
              <Card>
                <h3 className="font-semibold text-neutral-800 mb-3">Additional Notes</h3>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add any additional notes or instructions..."
                  rows={6}
                />
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {submitting ? 'Creating...' : 'Create Prescription'}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/prescriptions')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePrescriptionPage;
