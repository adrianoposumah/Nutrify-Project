export interface JWTPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export class AuthUtils {
  static isValidJWTFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    try {
      for (const part of parts) {
        if (!part || part.length === 0) {
          return false;
        }
        atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      }
      return true;
    } catch {
      return false;
    }
  }

  static isTokenExpired(token: string): boolean {
    if (!token || !this.isValidJWTFormat(token)) {
      return true;
    }

    try {
      const parts = token.split('.');
      const payload = parts[1];

      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

      if (!decodedPayload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp < currentTime;
    } catch {
      return true;
    }
  }
  static getUserFromToken(token: string): JWTPayload | null {
    if (!token || !this.isValidJWTFormat(token) || this.isTokenExpired(token)) {
      return null;
    }

    try {
      const parts = token.split('.');
      const payload = parts[1];

      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decodedPayload;
    } catch {
      return null;
    }
  }

  static getTokenRemainingTime(token: string): number {
    if (!token || !this.isValidJWTFormat(token)) {
      return 0;
    }

    try {
      const parts = token.split('.');
      const payload = parts[1];

      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

      if (!decodedPayload.exp) {
        return 0;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = decodedPayload.exp - currentTime;
      return Math.max(0, remainingTime);
    } catch {
      return 0;
    }
  }
}
