/**
 * Centralized API Client Helper — GradRadar Capstone
 * 
 * Provides type-safe, shared methods for GET, POST, PUT, PATCH, and DELETE requests.
 * It automatically handles base URL configuration, default JSON headers, 
 * authentication token injection, and structured error extraction.
 */

// 1. WE KEPT AND EXPORTED YOUR EXACT ORIGINAL VARIABLE AND PORT HERE:
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  bodyData?: any; // Automatically stringified if provided
}

/**
 * Core request helper that standardizes headers, body stringifying, 
 * auth token injection, and error handling.
 */
async function requestHelper<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Set up standard headers
  const headers = new Headers(options.headers);
  
  // Default to application/json if not uploading multi-part form data
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject authentication token if stored locally
  const token = localStorage.getItem('auth_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Construct request configuration
  const config: RequestInit = {
    ...options,
    headers,
  };

  // Automatically serialize object bodies to JSON string
  if (options.bodyData) {
    config.body = JSON.stringify(options.bodyData);
  }

  try {
    const response = await fetch(url, config);
    
    // Attempt to parse JSON response body
    let payload: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      payload = await response.json();
    }

    if (!response.ok) {
      // Extract backend validation or custom error messages
      const errorMessage = payload?.message || payload?.error || `Request failed with status ${response.status}`;
      const errorDetails = payload?.details || null;
      
      const errorObj = new Error(errorMessage) as any;
      errorObj.status = response.status;
      errorObj.details = errorDetails;
      
      throw errorObj;
    }

    return payload as T;
  } catch (error: any) {
    // Pass network failures or thrown errors straight up
    if (!error.status) {
      console.error(`Network or system failure calling API [${config.method || 'GET'}] ${url}:`, error);
      throw new Error('Connection refused. Please make sure the backend server is running.');
    }
    throw error;
  }
}

/**
 * Shared API helper client methods
 */
export const api = {
  /**
   * Performs a GET request to fetch data from the backend
   * @template T The expected response data structure
   */
  get: <T>(endpoint: string, options?: RequestInit) => {
    return requestHelper<T>(endpoint, { method: 'GET', ...options });
  },

  /**
   * Performs a POST request to create a new database record
   * @template T The expected response data structure
   */
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => {
    return requestHelper<T>(endpoint, { method: 'POST', bodyData: data, ...options });
  },

  /**
   * Performs a PUT request to completely replace or upsert an existing record
   * @template T The expected response data structure
   */
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => {
    return requestHelper<T>(endpoint, { method: 'PUT', bodyData: data, ...options });
  },

  /**
   * Performs a PATCH request to perform a partial update on a record
   * @template T The expected response data structure
   */
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => {
    return requestHelper<T>(endpoint, { method: 'PATCH', bodyData: data, ...options });
  },

  /**
   * Performs a DELETE request to remove a record
   * @template T The expected response data structure
   */
  delete: <T>(endpoint: string, options?: RequestInit) => {
    return requestHelper<T>(endpoint, { method: 'DELETE', ...options });
  }
};

export default api;