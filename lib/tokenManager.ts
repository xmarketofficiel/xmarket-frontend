// Token utility for Bearer token authentication
// Handles token storage, expiration, and automatic refresh

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_EXPIRES_KEY = 'token_expires';

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const expires = localStorage.getItem(this.TOKEN_EXPIRES_KEY);
    
    if (!token || !expires) return false;
    
    // Check if token is expired
    const expirationTime = parseInt(expires);
    const now = Date.now();
    
    if (now >= expirationTime) {
      // Token expired, clear it
      this.clearTokens();
      return false;
    }
    
    return true;
  }

  // Get access token if valid
  static getAccessToken(): string | null {
    if (!this.isAuthenticated()) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Store tokens after login/signup
  static storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRES_KEY, (Date.now() + (expiresIn * 1000)).toString());
    } catch (error) {
      
    }
  }

  // Update access token after refresh
  static updateAccessToken(accessToken: string, expiresIn: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.TOKEN_EXPIRES_KEY, (Date.now() + (expiresIn * 1000)).toString());
    } catch (error) {
      
    }
  }

  // Clear all tokens
  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRES_KEY);
    } catch (error) {
      
    }
  }

  // Check if token needs refresh (within 5 minutes of expiry)
  static shouldRefreshToken(): boolean {
    if (typeof window === 'undefined') return false;
    
    const expires = localStorage.getItem(this.TOKEN_EXPIRES_KEY);
    if (!expires) return false;
    
    const expirationTime = parseInt(expires);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Return true if token expires within 5 minutes
    return (expirationTime - now) < fiveMinutes;
  }

  // Get Authorization header for API requests
  static getAuthHeader(): { Authorization?: string } {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default TokenManager;
