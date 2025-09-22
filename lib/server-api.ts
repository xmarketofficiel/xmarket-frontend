/**
 * Server-side API Client for Next.js API Routes
 * This client runs on the server and communicates with the backend
 * Keeps the same interface as the client-side API but handles server-side authentication
 */

export interface ServerApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface ServerApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ServerApiError extends Error {
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
    this.name = 'ServerApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ServerApiClient {
  private config: ServerApiConfig;

  constructor(config: ServerApiConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    authToken?: string
  ): Promise<ServerApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Debug logging for URL construction
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ServerAPI] Making request to: ${url}`);
      console.log(`[ServerAPI] Base URL: ${this.config.baseUrl}`);
      console.log(`[ServerAPI] Endpoint: ${endpoint}`);
    }
    
    let defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if token is provided
    if (authToken) {
      defaultHeaders = {
        ...defaultHeaders,
        'Authorization': `Bearer ${authToken}`
      };
    }

    const requestOptions: RequestInit = {
      ...options,
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
          
          throw new ServerApiError({
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
            details: errorData,
          });
        }

        // Handle empty responses
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
          data = { message: 'Operation completed successfully' };
        }

        return {
          data,
          status: response.status,
          message: data?.message || 'Success',
        };

      } catch (error) {
        if (attempt === this.config.retries || 
            (error instanceof ServerApiError && error.status < 500)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new ServerApiError({
      message: 'Request failed after all retries',
      status: 0,
    });
  }

  async get<T>(endpoint: string, params?: unknown, authToken?: string): Promise<ServerApiResponse<T>> {
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

    return this.makeRequest<T>(url, { method: 'GET' }, authToken);
  }

  async post<T>(endpoint: string, data?: unknown, authToken?: string): Promise<ServerApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, authToken);
  }

  async put<T>(endpoint: string, data?: unknown, authToken?: string): Promise<ServerApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, authToken);
  }

  async patch<T>(endpoint: string, data?: unknown, authToken?: string): Promise<ServerApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, authToken);
  }

  async delete<T>(endpoint: string, authToken?: string): Promise<ServerApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, authToken);
  }

  async uploadFile<T>(endpoint: string, formData: FormData, authToken?: string): Promise<ServerApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        let headers: HeadersInit = {};
        
        if (authToken) {
          headers = {
            'Authorization': `Bearer ${authToken}`
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData: any = {};
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } else {
              const errorText = await response.text();
              if (errorText) {
                errorMessage = errorText;
                errorData = { rawError: errorText };
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse error response:', parseError);
          }
          
          throw new ServerApiError({
            message: errorMessage,
            status: response.status,
            code: errorData.code,
            details: errorData,
          });
        }

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
          data = { message: 'File uploaded successfully' };
        }

        return {
          data,
          status: response.status,
          message: data?.message || 'Upload successful',
        };

      } catch (error) {
        if (attempt === this.config.retries || (error instanceof ServerApiError && error.status < 500)) {
          throw error;
        }

        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new ServerApiError({
      message: 'Upload failed after all retries',
      status: 0,
    });
  }
}

// Get backend URL for server-side requests
const getBackendApiUrl = () => {
  // Use environment variable (BACKEND_URL is server-side only, never exposed to client)
  const backendUrl = process.env.BACKEND_URL || process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  
  // Debug logging for backend URL resolution
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ServerAPI] Backend URL resolved to: ${backendUrl}`);
    console.log(`[ServerAPI] BACKEND_URL: ${process.env.BACKEND_URL}`);
    console.log(`[ServerAPI] BACKEND_API_URL: ${process.env.BACKEND_API_URL}`);
    console.log(`[ServerAPI] NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
  }
  
  return backendUrl;
};

const serverApiClient = new ServerApiClient({
  baseUrl: getBackendApiUrl(),
  timeout: 10000,
  retries: 3,
});

export { serverApiClient, ServerApiClient, getBackendApiUrl };
export default serverApiClient;
