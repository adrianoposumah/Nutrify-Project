/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError } from 'axios';

interface CacheEntry {
  data: any;
  timestamp: number;
  expiry: number;
}

class OfflineApiClient {
  private client: AxiosInstance;
  private memoryCache = new Map<string, CacheEntry>();
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getTokenFromCookie();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        // Cache successful GET requests
        if (response.config.method === 'get') {
          this.setCacheEntry(response.config.url!, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearTokenCookie();
        }

        // Handle network errors (offline scenario)
        if (!navigator.onLine || error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          const cachedData = this.getCacheEntry(error.config?.url);
          if (cachedData) {
            console.log('Serving cached data for:', error.config?.url);
            return { data: cachedData };
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'jwt') {
        return value;
      }
    }
    return null;
  }

  private clearTokenCookie(): void {
    if (typeof document !== 'undefined') {
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    }
  }

  private setCacheEntry(url: string, data: any): void {
    const now = Date.now();
    this.memoryCache.set(url, {
      data,
      timestamp: now,
      expiry: now + this.CACHE_EXPIRY,
    });
  }

  private getCacheEntry(url?: string): any | null {
    if (!url) return null;

    const entry = this.memoryCache.get(url);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiry) {
      this.memoryCache.delete(url);
      return null;
    }

    return entry.data;
  }

  private async tryServiceWorkerCache(url: string): Promise<any | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('nutrify-api-v1');
        const response = await cache.match(url);
        if (response) {
          return await response.json();
        }
      } catch (error) {
        console.error('Error accessing service worker cache:', error);
      }
    }
    return null;
  }

  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      // Try service worker cache as last resort
      if (!navigator.onLine) {
        const cachedData = await this.tryServiceWorkerCache(url);
        if (cachedData) {
          console.log('Serving Service Worker cached data for:', url);
          return cachedData;
        }
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    if (!navigator.onLine) {
      throw new Error('Cannot perform POST request while offline');
    }
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    if (!navigator.onLine) {
      throw new Error('Cannot perform PUT request while offline');
    }
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    if (!navigator.onLine) {
      throw new Error('Cannot perform DELETE request while offline');
    }
    const response = await this.client.delete(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    if (!navigator.onLine) {
      throw new Error('Cannot perform PATCH request while offline');
    }
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }

  clearCache(): void {
    this.memoryCache.clear();
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

export const offlineApiClient = new OfflineApiClient();
