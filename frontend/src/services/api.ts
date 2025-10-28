import axios, { type AxiosResponse } from 'axios';
import type {
  User,
  LoginRequest,
  LoginResponse,
  BackendLoginResponse,
  Medicine,
  MedicineDTO,
  Supplier,
  SupplierDTO,
  SaleResponse,
  SaleRequest,
  Purchase,
  PurchaseDTO,
  StockReportDTO,
  ExpiryReport,
  SalesSummary
} from '@/types';

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
  login: (credentials: LoginRequest): Promise<AxiosResponse<BackendLoginResponse>> => 
    api.post('/auth/login', credentials),
  register: (userData: User): Promise<AxiosResponse<User>> => 
    api.post('/auth/register', userData),
};

export const userAPI = {
  getAll: (): Promise<AxiosResponse<User[]>> => api.get('/users'),
  getById: (id: number): Promise<AxiosResponse<User>> => api.get(`/users/${id}`),
  create: (userData: User): Promise<AxiosResponse<User>> => api.post('/users', userData),
  update: (id: number, userData: User): Promise<AxiosResponse<User>> => api.put(`/users/${id}`, userData),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/users/${id}`),
};

export const supplierAPI = {
  getAll: (): Promise<AxiosResponse<Supplier[]>> => api.get('/suppliers'),
  getById: (id: number): Promise<AxiosResponse<Supplier>> => api.get(`/suppliers/${id}`),
  create: (supplierData: SupplierDTO): Promise<AxiosResponse<Supplier>> => 
    api.post('/suppliers', supplierData),
  update: (id: number, supplierData: SupplierDTO): Promise<AxiosResponse<Supplier>> => 
    api.put(`/suppliers/${id}`, supplierData),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/suppliers/${id}`),
};

export const medicineAPI = {
  getAll: (): Promise<AxiosResponse<Medicine[]>> => api.get('/medicines'),
  getById: (id: number): Promise<AxiosResponse<Medicine>> => api.get(`/medicines/${id}`),
  create: (medicineData: MedicineDTO): Promise<AxiosResponse<Medicine>> => 
    api.post('/medicines', medicineData),
  update: (id: number, medicineData: MedicineDTO): Promise<AxiosResponse<Medicine>> => 
    api.put(`/medicines/${id}`, medicineData),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/medicines/${id}`),
};

export const saleAPI = {
  getAll: (): Promise<AxiosResponse<SaleResponse[]>> => api.get('/sales'),
  create: (saleData: SaleRequest): Promise<AxiosResponse<SaleResponse>> => 
    api.post('/sales', saleData),
  getByDateRange: (startDate: string, endDate: string): Promise<AxiosResponse<SaleResponse[]>> =>
    api.get(`/sales/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
  getSummary: (startDate: string, endDate: string): Promise<AxiosResponse<SalesSummary>> =>
    api.get(`/sales/summary?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
};

export const purchaseAPI = {
  getAll: (): Promise<AxiosResponse<Purchase[]>> => api.get('/purchases'),
  create: (purchaseData: PurchaseDTO): Promise<AxiosResponse<Purchase>> => 
    api.post('/purchases', purchaseData),
  getByDateRange: (startDate: string, endDate: string): Promise<AxiosResponse<Purchase[]>> =>
    api.get(`/purchases/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
};

export const reportAPI = {
  getStock: (): Promise<AxiosResponse<StockReportDTO[]>> => api.get('/reports/stock'),
  getExpiry: (): Promise<AxiosResponse<ExpiryReport[]>> => api.get('/reports/expiry'),
  getExpiring: (days: number = 30): Promise<AxiosResponse<ExpiryReport[]>> => 
    api.get(`/reports/expiring?days=${days}`),
};

export default api;
