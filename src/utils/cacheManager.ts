/* eslint-disable @typescript-eslint/no-explicit-any */
// Cache management utilities for offline support

export class CacheManager {
  private static readonly CACHE_KEYS = {
    RANDOM_ITEMS: 'nutrify-random-items',
    USER_PREFERENCES: 'nutrify-user-preferences',
    NAVIGATION_DATA: 'nutrify-navigation-data',
  };

  private static readonly CACHE_EXPIRY = {
    RANDOM_ITEMS: 24 * 60 * 60 * 1000, // 24 hours
    USER_PREFERENCES: 7 * 24 * 60 * 60 * 1000, // 7 days
    NAVIGATION_DATA: 60 * 60 * 1000, // 1 hour
  };

  static setCache(key: string, data: any, customExpiry?: number): void {
    try {
      const expiryTime = customExpiry || this.CACHE_EXPIRY.RANDOM_ITEMS;
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expiryTime,
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  static getCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsedCache = JSON.parse(cached);
      const now = Date.now();

      if (now > parsedCache.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedCache.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  static clearCache(key?: string): void {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        // Clear all nutrify-related caches
        Object.values(this.CACHE_KEYS).forEach((cacheKey) => {
          localStorage.removeItem(cacheKey);
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  static clearExpiredCaches(): void {
    try {
      Object.values(this.CACHE_KEYS).forEach((key) => {
        const cached = localStorage.getItem(key);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          const now = Date.now();
          if (now > parsedCache.expiry) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error clearing expired caches:', error);
    }
  }

  static getCacheSize(): string {
    try {
      let totalSize = 0;
      Object.values(this.CACHE_KEYS).forEach((key) => {
        const cached = localStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
        }
      });

      // Convert bytes to KB/MB
      if (totalSize < 1024) {
        return `${totalSize} bytes`;
      } else if (totalSize < 1024 * 1024) {
        return `${(totalSize / 1024).toFixed(2)} KB`;
      } else {
        return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
      }
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return '0 bytes';
    }
  }

  // Service Worker cache management
  static async clearServiceWorkerCaches(): Promise<void> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes('nutrify')) {
              return caches.delete(cacheName);
            }
          })
        );
        console.log('Service Worker caches cleared');
      } catch (error) {
        console.error('Error clearing Service Worker caches:', error);
      }
    }
  }

  static async getServiceWorkerCacheSize(): Promise<string> {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        for (const cacheName of cacheNames) {
          if (cacheName.includes('nutrify')) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();

            for (const request of requests) {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
              }
            }
          }
        }

        // Convert bytes to KB/MB
        if (totalSize < 1024) {
          return `${totalSize} bytes`;
        } else if (totalSize < 1024 * 1024) {
          return `${(totalSize / 1024).toFixed(2)} KB`;
        } else {
          return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
        }
      } catch (error) {
        console.error('Error calculating Service Worker cache size:', error);
        return '0 bytes';
      }
    }
    return '0 bytes';
  }
}
