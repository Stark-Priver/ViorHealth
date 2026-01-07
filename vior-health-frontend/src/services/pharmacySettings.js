import api from './api';

// Get pharmacy settings
export const getPharmacySettings = async () => {
  const response = await api.get('/accounts/pharmacy-settings/');
  return response.data;
};

// Update pharmacy settings
export const updatePharmacySettings = async (data) => {
  const response = await api.patch('/accounts/pharmacy-settings/1/', data);
  return response.data;
};
