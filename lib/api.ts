/**
 * API Client for XMarket Frontend
 * Provides typed API functions for backend integration
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface WrappedApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor({ message, status, code, details }: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private config: ApiConfig;
  private onAuthError?: () => void;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  // Remove token methods since we use HTTP-only cookies
  // setAuthToken and getAuthToken are no longer needed

  setAuthErrorHandler(handler: () => void) {
    this.onAuthError = handler;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    let defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header for Bearer token authentication
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        defaultHeaders = {
          ...defaultHeaders,
          'Authorization': `Bearer ${accessToken}`
        };
      }
    }

    const requestOptions: RequestInit = {
      ...options,
      credentials: 'omit', // Don't include cookies for Bearer token auth
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Create a more descriptive error for better handling
          const apiError = new ApiError({
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
            details: errorData,
          });
          
          // Enhanced error handling - suppress console logs for expected user errors
          if (response.status === 401) {
            // Authentication errors are expected, handle silently
            apiError.name = 'AuthenticationError';
            
            // Only trigger auth error handler for actual authentication failures,
            // not for email authorization during signup
            const isEmailAuthorizationError = errorData.message?.includes('not authorized to register');
            const isSignupRelated = endpoint.includes('/auth/send-otp') || 
                                  endpoint.includes('/auth/verify-otp') || 
                                  endpoint.includes('/auth/complete-registration');
            
            if (!isEmailAuthorizationError && !isSignupRelated && this.onAuthError) {
              this.onAuthError();
            }
          } else if (response.status === 403) {
            // Authorization errors are expected
            apiError.name = 'AuthorizationError';
          } else if (response.status === 400) {
            // Bad request - usually validation errors, expected user errors
            apiError.name = 'ValidationError';
          } else if (response.status >= 400 && response.status < 500) {
            // Other client errors
            apiError.name = 'ClientError';
          } else if (response.status >= 500) {
            // Server errors should be logged
            console.error(`API Server Error [${response.status}]:`, errorData);
            apiError.name = 'ServerError';
          }
          
          throw apiError;
        }

        // Handle empty responses (common for DELETE operations and some PUT/POST operations)
        const contentType = response.headers.get('content-type');
        let data = null;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              
              data = { message: 'Operation completed successfully' };
            }
          } else {
            data = { message: 'Operation completed successfully' };
          }
        } else {
          // Non-JSON response, likely successful operation
          data = { message: 'Operation completed successfully' };
        }

        return {
          data,
          status: response.status,
          message: data?.message || 'Success',
        };

      } catch (error) {
        if (attempt === this.config.retries || 
            (error instanceof ApiError && error.status < 500)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new ApiError({
      message: 'Request failed after all retries',
      status: 0,
    });
  }

  async get<T>(endpoint: string, params?: unknown): Promise<ApiResponse<T>> {
    let cleanedParams: Record<string, string> | undefined;

    if (params && typeof params === 'object') {
      cleanedParams = Object.entries(params as Record<string, unknown>).reduce(
        (acc, [k, v]) => {
          if (v === undefined || v === null) return acc;
          acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>
      );
    }

    const url = cleanedParams && Object.keys(cleanedParams).length
      ? `${endpoint}?${new URLSearchParams(cleanedParams)}`
      : endpoint;

    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload form data (files) to the given endpoint. This method intentionally
   * avoids setting a Content-Type header so the browser can set the multipart
   * boundary appropriately.
   */
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        let headers: HeadersInit = {};
        
        // Add Authorization header for Bearer token authentication
        if (typeof window !== 'undefined') {
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            headers = {
              'Authorization': `Bearer ${accessToken}`
            };
          }
        }

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers,
          credentials: 'omit', // Don't include cookies for Bearer token auth
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError({
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
            details: errorData,
          });
        }

        // Handle empty responses for file uploads
        const contentType = response.headers.get('content-type');
        let data = null;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (e) {
              
              data = { message: 'File uploaded successfully' };
            }
          } else {
            data = { message: 'File uploaded successfully' };
          }
        } else {
          // Non-JSON response, likely successful operation
          data = { message: 'File uploaded successfully' };
        }

        return {
          data,
          status: response.status,
          message: data?.message || 'Upload successful',
        };

      } catch (error) {
        if (attempt === this.config.retries || (error instanceof ApiError && error.status < 500)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new ApiError({
      message: 'Upload failed after all retries',
      status: 0,
    });
  }
}

// Always use SSR API routes to hide backend URLs
const apiClient = new ApiClient({
  baseUrl: '/api',
  timeout: 10000,
  retries: 3,
});

export { apiClient, ApiClient };
export default apiClient;
