    import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Log the API URL for debugging
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (userData) => api.post('/accounts/register/', userData),
  getCurrentUser: () => api.get('/accounts/users/me/'),
  updateProfile: (data) => api.put('/accounts/users/me/', data),
  changePassword: (passwords) => api.post('/accounts/users/change_password/', passwords),
  
  // User Management (Admin)
  getAllUsers: () => api.get('/accounts/users/'),
  getUser: (id) => api.get(`/accounts/users/${id}/`),
  createUser: (userData) => api.post('/accounts/users/', userData),
  updateUser: (id, userData) => api.put(`/accounts/users/${id}/`, userData),
  deleteUser: (id) => api.delete(`/accounts/users/${id}/`),
};

// Inventory API
export const inventoryAPI = {
  // Categories
  getCategories: () => api.get('/inventory/categories/'),
  createCategory: (data) => api.post('/inventory/categories/', data),
  updateCategory: (id, data) => api.put(`/inventory/categories/${id}/`, data),
  deleteCategory: (id) => api.delete(`/inventory/categories/${id}/`),
  
  // Suppliers
  getSuppliers: () => api.get('/inventory/suppliers/'),
  getActiveSuppliers: () => api.get('/inventory/suppliers/active/'),
  createSupplier: (data) => api.post('/inventory/suppliers/', data),
  updateSupplier: (id, data) => api.put(`/inventory/suppliers/${id}/`, data),
  deleteSupplier: (id) => api.delete(`/inventory/suppliers/${id}/`),
  
  // Products
  getProducts: (params) => api.get('/inventory/products/', { params }),
  getProduct: (id) => api.get(`/inventory/products/${id}/`),
  getLowStockProducts: () => api.get('/inventory/products/low_stock/'),
  createProduct: (data) => api.post('/inventory/products/', data),
  updateProduct: (id, data) => api.put(`/inventory/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/inventory/products/${id}/`),
  updateStock: (id, data) => api.post(`/inventory/products/${id}/update_stock/`, data),
  
  // Stock Movements
  getStockMovements: (params) => api.get('/inventory/stock-movements/', { params }),
};

// Sales API
export const salesAPI = {
  // Customers
  getCustomers: (params) => api.get('/sales/customers/', { params }),
  getCustomer: (id) => api.get(`/sales/customers/${id}/`),
  createCustomer: (data) => api.post('/sales/customers/', data),
  updateCustomer: (id, data) => api.put(`/sales/customers/${id}/`, data),
  deleteCustomer: (id) => api.delete(`/sales/customers/${id}/`),
  
  // Sales
  getSales: (params) => api.get('/sales/sales/', { params }),
  getSale: (id) => api.get(`/sales/sales/${id}/`),
  createSale: (data) => api.post('/sales/sales/create_sale/', data),
  getTodaySales: () => api.get('/sales/sales/today_sales/'),
  getSalesStatistics: (params) => api.get('/sales/sales/statistics/', { params }),
};

// Prescriptions API
export const prescriptionsAPI = {
  getPrescriptions: (params) => api.get('/prescriptions/prescriptions/', { params }),
  getPrescription: (id) => api.get(`/prescriptions/prescriptions/${id}/`),
  createPrescription: (data) => api.post('/prescriptions/prescriptions/create_prescription/', data),
  dispensePrescription: (id, data = {}) => api.post(`/prescriptions/prescriptions/${id}/dispense/`, data),
  cancelPrescription: (id) => api.post(`/prescriptions/prescriptions/${id}/cancel/`),
  getPendingPrescriptions: () => api.get('/prescriptions/prescriptions/pending/'),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard-stats/'),
  getSalesChart: (days = 7) => api.get('/analytics/sales-chart/', { params: { days } }),
  getTopProducts: (limit = 10) => api.get('/analytics/top-products/', { params: { limit } }),
  getInventorySummary: () => api.get('/analytics/inventory-summary/'),
  getRecentActivities: (limit = 10) => api.get('/analytics/recent-activities/', { params: { limit } }),
};

export default api;
