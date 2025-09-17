// Authentication utility for handling both cookies and localStorage
// This handles the case where cookies might be blocked by browser

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
}

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'xmarket_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'xmarket_refresh_token';

  // Store tokens (fallback when cookies are blocked)
  static storeTokens(tokens: AuthTokens): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access_token);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
        
        // Set expiration time
        if (tokens.expires_in) {
          const expirationTime = Date.now() + (tokens.expires_in * 1000);
          localStorage.setItem(`${this.ACCESS_TOKEN_KEY}_expires`, expirationTime.toString());
        }
      }
    } catch (error) {
      
    }
  }

  // Get access token from localStorage or cookies
  static getAccessToken(): string | null {
    try {
      if (typeof window !== 'undefined') {
        // Check if token is expired
        const expirationTime = localStorage.getItem(`${this.ACCESS_TOKEN_KEY}_expires`);
        if (expirationTime && Date.now() > parseInt(expirationTime)) {
          this.clearTokens();
          return null;
        }
        
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
      }
    } catch (error) {
      
    }
    return null;
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      
    }
    return null;
  }

  // Clear all tokens
  static clearTokens(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(`${this.ACCESS_TOKEN_KEY}_expires`);
      }
    } catch (error) {
      
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  // Get Authorization header for API requests
  static getAuthHeader(): { Authorization?: string } {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Enhanced fetch with automatic token inclusion
  static async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeader = this.getAuthHeader();
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...authHeader, // Add Authorization header as fallback
        ...options.headers,
      },
    });

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401 && this.getRefreshToken()) {
      try {
        await this.refreshTokens();
        // Retry the original request with new token
        const newAuthHeader = this.getAuthHeader();
        return fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...newAuthHeader,
            ...options.headers,
          },
        });
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        this.clearTokens();
        window.location.href = '/login';
      }
    }

    return response;
  }

  // Refresh tokens
  private static async refreshTokens(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    if (data.tokens) {
      this.storeTokens(data.tokens);
    }
  }
}

export default AuthService;
