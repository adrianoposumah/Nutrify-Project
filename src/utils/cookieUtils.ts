import Cookies from 'js-cookie';

/**
 * Cookie utility functions for managing authentication tokens
 */
export class CookieUtils {
  private static readonly AUTH_TOKEN_NAME = 'jwt';

  /**
   * Set the authentication token in cookies
   * @param token - The JWT token to store
   * @param options - Optional cookie settings
   */
  static setAuthToken(token: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(this.AUTH_TOKEN_NAME, token, {
      expires: 7, // 7 days default
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...options,
    });
  }

  /**
   * Get the authentication token from cookies
   * @returns The JWT token or undefined if not found
   */
  static getAuthToken(): string | undefined {
    return Cookies.get(this.AUTH_TOKEN_NAME);
  }
  /**
   * Remove the authentication token from cookies
   */
  static removeAuthToken(): void {
    console.log('🍪 Attempting to remove JWT cookie...');

    // Try removing with different path configurations to ensure deletion
    Cookies.remove(this.AUTH_TOKEN_NAME);
    Cookies.remove(this.AUTH_TOKEN_NAME, { path: '/' });

    if (typeof window !== 'undefined') {
      Cookies.remove(this.AUTH_TOKEN_NAME, { path: '/', domain: window.location.hostname });
      Cookies.remove(this.AUTH_TOKEN_NAME, { path: '/', domain: `.${window.location.hostname}` });
    }

    // Manual removal as backup
    if (typeof document !== 'undefined') {
      document.cookie = `${this.AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${this.AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
      document.cookie = `${this.AUTH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
    }
  }
  /**
   * Clear all authentication-related cookies
   */
  static clearAuthCookies(): void {
    console.log('🍪 Clearing authentication cookies...');

    // List all cookies before clearing
    console.log('🍪 All cookies before clearing:', typeof document !== 'undefined' ? document.cookie : 'N/A');

    // Check if token exists before removal
    const tokenBefore = this.getAuthToken();
    console.log('🍪 JWT token before removal:', tokenBefore ? 'EXISTS' : 'NOT_FOUND');

    // Primary removal method
    this.removeAuthToken();

    // Also try to remove any other potential cookie variations
    const cookieNames = ['jwt', 'authToken', 'auth_token', 'token'];
    cookieNames.forEach((name) => {
      // Try different path and domain combinations
      Cookies.remove(name);
      Cookies.remove(name, { path: '/' });
      Cookies.remove(name, { path: '/', domain: window.location.hostname });
      Cookies.remove(name, { path: '/', domain: `.${window.location.hostname}` });
    });

    // Manual cookie clearing for stubborn cookies
    if (typeof document !== 'undefined') {
      // Force expire all auth-related cookies
      const cookiesToClear = ['jwt', 'authToken', 'auth_token', 'token'];
      cookiesToClear.forEach((name) => {
        // Set to expire immediately with different path/domain combinations
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=strict`;
      });
    }

    // Verify removal
    const tokenAfter = this.getAuthToken();
    console.log('🍪 JWT token after removal:', tokenAfter ? 'STILL_EXISTS' : 'REMOVED');
    console.log('🍪 All cookies after clearing:', typeof document !== 'undefined' ? document.cookie : 'N/A');

    if (tokenAfter) {
      console.warn('⚠️ JWT cookie removal failed. Token still exists:', tokenAfter);
    } else {
      console.log('✅ JWT cookie cleared successfully');
    }
  }

  /**
   * Check if user is authenticated based on cookie presence
   * @returns true if auth token exists in cookies
   */
  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}
