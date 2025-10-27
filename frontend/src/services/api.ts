import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors and JWT signature issues
    if (error.response?.status === 401 || 
        error.response?.data?.error === "Invalid token signature" ||
        error.response?.data?.error === "Invalid token format" ||
        error.response?.data?.error === "Token expired" ||
        error.response?.data?.error === "Unsupported token" ||
        error.response?.data?.error === "Invalid token") {
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenTimestamp');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // Show appropriate error message
        const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
        console.error('Authentication error:', errorMessage);
        
        // Redirect to login
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('Network error - unable to connect to backend');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend took too long to respond');
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export const supplierAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: number) => api.get(`/suppliers/${id}`),
  create: (supplierData: any) => api.post('/suppliers', supplierData),
  update: (id: number, supplierData: any) => api.put(`/suppliers/${id}`, supplierData),
  delete: (id: number) => api.delete(`/suppliers/${id}`),
};

export const medicineAPI = {
  getAll: () => api.get('/medicines'),
  getById: (id: number) => api.get(`/medicines/${id}`),
  create: (medicineData: any) => api.post('/medicines', medicineData),
  update: (id: number, medicineData: any) => api.put(`/medicines/${id}`, medicineData),
  delete: (id: number) => api.delete(`/medicines/${id}`),
};

export const saleAPI = {
  getAll: () => api.get('/sales'),
  create: (saleData: any) => api.post('/sales', saleData),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get(`/sales/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
  getSummary: (startDate: string, endDate: string) =>
    api.get(`/sales/summary?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
};

export const purchaseAPI = {
  getAll: () => api.get('/purchases'),
  create: (purchaseData: any) => api.post('/purchases', purchaseData),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get(`/purchases/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
};

export const reportAPI = {
  getStock: () => api.get('/reports/stock'),
  getExpiry: () => api.get('/reports/expiry'),
  getExpiring: (days: number = 30) => api.get(`/reports/expiring?days=${days}`),
};

export default api;
