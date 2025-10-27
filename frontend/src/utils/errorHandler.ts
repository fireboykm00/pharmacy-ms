import { toast } from 'sonner';

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

export const handleApiError = (error: ApiError): string => {
  // Default error message
  let errorMessage = 'An unexpected error occurred. Please try again.';

  // Handle specific HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        errorMessage = error.response.data?.message || 'Invalid request. Please check your input and try again.';
        break;
      case 401:
        errorMessage = 'Session expired. Please login again.';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 409:
        errorMessage = 'This action conflicts with existing data. Please refresh and try again.';
        break;
      case 422:
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
        break;
      case 500:
        errorMessage = 'Server error occurred. Please try again later.';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'Service unavailable. Please try again later.';
        break;
      default:
        errorMessage = error.response.data?.message || `Request failed with status ${error.response.status}`;
    }
  }

  // Handle network errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
    errorMessage = 'Unable to connect to the server. Please check your internet connection.';
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    errorMessage = 'Request timed out. Please try again.';
  }

  // Handle specific JWT errors
  if (error.response?.data?.error) {
    switch (error.response.data.error) {
      case 'Invalid token signature':
      case 'Invalid token format':
      case 'Unsupported token':
      case 'Invalid token':
        errorMessage = 'Session invalid. Please login again.';
        break;
      case 'Token expired':
        errorMessage = 'Your session has expired. Please login again.';
        break;
      default:
        errorMessage = error.response.data.message || errorMessage;
    }
  }

  return errorMessage;
};

export const showErrorToast = (error: ApiError): void => {
  const message = handleApiError(error);
  toast.error(message);
};

export const showSuccessToast = (message: string): void => {
  toast.success(message);
};

export const showInfoToast = (message: string): void => {
  toast.info(message);
};

export const showWarningToast = (message: string): void => {
  toast.warning(message);
};
