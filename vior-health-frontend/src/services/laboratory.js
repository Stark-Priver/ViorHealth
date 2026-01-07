import api from './api';

const BASE_URL = '/laboratory';

export const laboratoryAPI = {
  // Test Types
  getTestTypes: () => api.get(`${BASE_URL}/test-types/`),
  getTestType: (id) => api.get(`${BASE_URL}/test-types/${id}/`),
  createTestType: (data) => api.post(`${BASE_URL}/test-types/`, data),
  updateTestType: (id, data) => api.patch(`${BASE_URL}/test-types/${id}/`, data),
  deleteTestType: (id) => api.delete(`${BASE_URL}/test-types/${id}/`),
  
  // Lab Tests
  getLabTests: () => api.get(`${BASE_URL}/tests/`),
  getLabTest: (id) => api.get(`${BASE_URL}/tests/${id}/`),
  createLabTest: (data) => api.post(`${BASE_URL}/tests/`, data),
  updateLabTest: (id, data) => api.patch(`${BASE_URL}/tests/${id}/`, data),
  deleteLabTest: (id) => api.delete(`${BASE_URL}/tests/${id}/`),
  
  // Lab Test Actions
  startTest: (id) => api.post(`${BASE_URL}/tests/${id}/start_test/`),
  completeTest: (id, data) => api.post(`${BASE_URL}/tests/${id}/complete_test/`, data),
  reviewTest: (id) => api.post(`${BASE_URL}/tests/${id}/review_test/`),
  markAsPaid: (id, paymentMethod = 'cash') => api.post(`${BASE_URL}/tests/${id}/mark_as_paid/`, { payment_method: paymentMethod }),
  
  // Lab Test Stats
  getLabStats: () => api.get(`${BASE_URL}/tests/stats/`),
  
  // Lab Measurements
  getMeasurements: (labTestId) => api.get(`${BASE_URL}/measurements/`, { params: { lab_test: labTestId } }),
  createMeasurement: (data) => api.post(`${BASE_URL}/measurements/`, data),
  updateMeasurement: (id, data) => api.patch(`${BASE_URL}/measurements/${id}/`, data),
  deleteMeasurement: (id) => api.delete(`${BASE_URL}/measurements/${id}/`),
};
