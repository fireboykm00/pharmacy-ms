// User Types
export interface User {
  userId: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER';
  password?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Backend returns flat structure, frontend uses nested
export interface BackendLoginResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Medicine Types
export interface Medicine {
  medicineId: number;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  expiryDate: string;
  reorderLevel: number;
  supplierId: number;
  supplierName: string;
}

export interface MedicineDTO {
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  expiryDate: string;
  reorderLevel: number;
  supplierId: number;
}

// Supplier Types
export interface Supplier {
  supplierId: number;
  name: string;
  contact: string;
  email: string;
}

export interface SupplierDTO {
  name: string;
  contact: string;
  email: string;
}

// Sale Types
export interface SaleResponse {
  saleId: number;
  medicineName: string;
  quantity: number;
  totalAmount: number;
  profit: number;
  saleDate: string;
  userName: string;
}

export interface SaleRequest {
  medicineId: number;
  quantity: number;
}

// Purchase Types
export interface Purchase {
  purchaseId: number;
  medicineName: string;
  quantity: number;
  totalCost: number;
  purchaseDate: string;
  supplierName: string;
}

export interface PurchaseDTO {
  medicineId: number;
  supplierId: number;
  quantity: number;
  totalCost: number;
  purchaseDate: string;
}

// Report Types
export interface StockReportDTO {
  medicineId: number;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  status: 'LOW' | 'NORMAL' | 'OUT_OF_STOCK';
}

export interface ExpiryReport {
  medicineId: number;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalProfit: number;
}

// Dashboard Types
export interface DashboardStats {
  totalMedicines: number;
  lowStockItems: number;
  expiredItems: number;
  todaySales: number;
  monthlyRevenue: number;
  monthlyProfit: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Error Types
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
  code?: string;
  message?: string;
}

// Form Types
export interface MedicineFormData {
  name: string;
  category: string;
  costPrice: string;
  sellingPrice: string;
  quantity: string;
  expiryDate: string;
  reorderLevel: string;
  supplierId: number;
}

export interface SupplierFormData {
  name: string;
  contact: string;
  email: string;
}

export interface SaleFormData {
  medicineId: number;
  quantity: string;
}

export interface PurchaseFormData {
  medicineId: number;
  supplierId: number;
  quantity: string;
  totalCost: string;
  purchaseDate: string;
}

// Filter and Search Types
export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export interface SearchFilter {
  query?: string;
  category?: string;
  status?: string;
}
