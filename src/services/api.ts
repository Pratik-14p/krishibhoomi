/**
 * Krishibhoomi Frontend API Client
 * Connects the React UI to the Node.js/Express backend with full error handling,
 * JWT authentication headers, and same-origin API routing.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  statusCode?: number;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Resolve API base URL from environment or the same origin as the full-stack server.
// The Express server and Vite frontend share localhost:3000.
const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.replace(/\/+$/, '');
  }

  return '/api';
};

export const API_BASE_URL = getBaseUrl();

// Storage keys for JWT auth token
const TOKEN_KEY = 'krishibhoomi_auth_token_v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string, persist: boolean = true): void => {
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Format user-friendly error messages based on HTTP status codes
 */
const formatErrorMessage = (status: number, serverMessage?: string): string => {
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }

  switch (status) {
    case 400:
      return 'The submitted request contained invalid parameters. Please review your entries.';
    case 401:
      return 'Your session has expired or authentication is required. Please log in.';
    case 403:
      return 'Access forbidden: You do not have permission to execute this operation.';
    case 404:
      return 'The requested agricultural record or endpoint was not found.';
    case 500:
      return 'The backend server encountered an error processing your request. Please try again.';
    default:
      return 'Unable to communicate with the Krishibhoomi API service.';
  }
};

/**
 * Core request dispatcher with JWT injection and error handling
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Strip redundant leading /api/ if already provided by caller
  if (cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.slice(4);
  } else if (cleanEndpoint === '/api') {
    cleanEndpoint = '';
  }
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  
  // Attach Bearer JWT token if present
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Attach user's selected language preference
  try {
    const selectedLang = localStorage.getItem('krishibhoomi_language_v1') || 'en';
    if (!headers.has('X-Language')) {
      headers.set('X-Language', selectedLang);
    }
  } catch {}

  // Set default JSON Content-Type unless uploading FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr: any) {
      // If an explicitly configured API host is unavailable, attempt the same-origin /api path
      if (API_BASE_URL !== '/api') {
        const fallbackUrl = `/api${cleanEndpoint}`;
        try {
          response = await fetch(fallbackUrl, {
            ...options,
            headers,
          });
        } catch {
          throw networkErr;
        }
      } else {
        throw networkErr;
      }
    }

    let jsonResponse: any = null;
    const responseText = await response.text();
    if (responseText.trim()) {
      try {
        jsonResponse = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new ApiError('The backend returned an invalid response. Please try again.', response.status);
        }
      }
    }

    if (!response.ok) {
      const errorMessage = formatErrorMessage(response.status, jsonResponse?.message || jsonResponse?.detail);
      
      // Auto-clear invalid token on 401
      if (response.status === 401) {
        removeAuthToken();
      }

      throw new ApiError(errorMessage, response.status, Array.isArray(jsonResponse?.errors) ? jsonResponse.errors : undefined);
    }

    // The backend contract carries success separately from HTTP status. Do not
    // let an application-level error with HTTP 200 become a successful result.
    if (jsonResponse && typeof jsonResponse === 'object' && jsonResponse.success === false) {
      throw new ApiError(
        formatErrorMessage(response.status, jsonResponse.message),
        response.status,
        Array.isArray(jsonResponse.errors) ? jsonResponse.errors : undefined
      );
    }

    if (responseText.trim() && (!jsonResponse || typeof jsonResponse !== 'object' || Array.isArray(jsonResponse))) {
      throw new ApiError('The backend returned an unexpected response. Please try again.', response.status);
    }

    return {
      success: true,
      statusCode: response.status,
      message: jsonResponse?.message || 'Operation successful',
      data: jsonResponse?.data !== undefined ? jsonResponse.data : jsonResponse,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network disconnection / server offline
    console.warn(`[Krishibhoomi API] Network request to ${url} failed:`, error.message);
    throw new ApiError(
      'Unable to connect to the Krishibhoomi backend API server. Please verify the network connection.',
      0
    );
  }
}

/**
 * High-level API Service methods
 */
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string | number | boolean>) => {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString();
      if (query) {
        url += (url.includes('?') ? '&' : '?') + query;
      }
    }
    return request<T>(url, { method: 'GET' });
  },

  post: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put: <T = any>(endpoint: string, body?: any) => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete: <T = any>(endpoint: string) => {
    return request<T>(endpoint, { method: 'DELETE' });
  },

  upload: <T = any>(endpoint: string, formData: FormData) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};

export default api;
