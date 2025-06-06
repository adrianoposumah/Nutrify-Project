/* eslint-disable @typescript-eslint/no-unused-vars */
// Service Worker for Nutrify App - Offline Support
const CACHE_NAME = 'nutrify-v1';
const OFFLINE_CACHE = 'nutrify-offline-v1';
const API_CACHE = 'nutrify-api-v1';

// Static assets to cache
const STATIC_ASSETS = ['/', '/manifest.json', '/offline.html', '/NutrifyLogo.svg', '/Facebook.svg', '/Instagram.svg', '/Twitter.svg', '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

// API endpoints to cache
const API_ENDPOINTS = ['/random-items', '/items', '/display-ingredients'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then(async (cache) => {
        console.log('Caching static assets...');

        // Cache essential files first
        const essentialAssets = ['/', '/offline.html', '/NutrifyLogo.svg', '/manifest.json'];

        // Try to cache each asset individually to avoid failing the entire cache
        const cachePromises = essentialAssets.map(async (url) => {
          try {
            await cache.add(url);
            console.log('Cached:', url);
          } catch (error) {
            console.warn('Failed to cache:', url, error);
          }
        });

        await Promise.allSettled(cachePromises);

        // Cache additional assets
        const additionalAssets = STATIC_ASSETS.filter((asset) => !essentialAssets.includes(asset));
        const additionalPromises = additionalAssets.map(async (url) => {
          try {
            await cache.add(url);
          } catch (error) {
            console.warn('Failed to cache additional asset:', url);
          }
        });

        await Promise.allSettled(additionalPromises);
      }),

      // Set up offline cache
      caches.open(OFFLINE_CACHE).then((cache) => {
        console.log('Setting up offline cache...');
        return cache.put(
          '/offline',
          new Response(
            `<!DOCTYPE html>
            <html><head><title>Offline</title></head>
            <body><h1>You're offline</h1><p>Please check your connection.</p></body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          )
        );
      }),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests
  if (url.pathname.includes('/api/') || isApiEndpoint(url.pathname)) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle Next.js static files
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(handleNextStaticFiles(request));
    return;
  }

  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other static assets
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);

      // Special handling for random items endpoint
      if (request.url.includes('/random-items')) {
        await cacheRandomItemsData(networkResponse.clone());
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);

    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline data for specific endpoints
    if (request.url.includes('/random-items')) {
      return await getOfflineRandomItems();
    }

    // Return generic offline response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Data not available offline',
        data: [],
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response for future use
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for static request:', request.url);
  }

  // Return 404 for failed static requests
  return new Response('Not found', { status: 404 });
}

// Cache random items data for offline use
async function cacheRandomItemsData(response) {
  try {
    const data = await response.json();
    const offlineCache = await caches.open(OFFLINE_CACHE);

    await offlineCache.put('/offline-random-items', new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));

    console.log('Random items cached for offline use');
  } catch (error) {
    console.error('Failed to cache random items:', error);
  }
}

// Get offline random items
async function getOfflineRandomItems() {
  const offlineCache = await caches.open(OFFLINE_CACHE);
  const cachedData = await offlineCache.match('/offline-random-items');

  if (cachedData) {
    return cachedData;
  }

  // Return fallback data
  return new Response(
    JSON.stringify({
      status: 'success',
      message: 'Offline data',
      data: [],
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Check if URL is an API endpoint
function isApiEndpoint(pathname) {
  return API_ENDPOINTS.some((endpoint) => pathname.includes(endpoint));
}

// Create offline fallback page
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nutrify - Offline</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 20px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #fe6301;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .btn {
          background: #fe6301;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background: #e55a01;
        }
      </style>
    </head>
    <body>
      <div class="logo">🍽️</div>
      <h1>Nutrify</h1>
      <p>You're currently offline. Some features may not be available.</p>
      <button class="btn" onclick="window.location.reload()">Try Again</button>
      <script>
        // Auto-reload when back online
        window.addEventListener('online', () => {
          window.location.reload();
        });
      </script>
    </body>
    </html>
  `;
}

// Handle navigation requests (page loads)
async function handleNavigationRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful navigation responses
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for navigation:', request.url);
  }

  // Try cache for exact match
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Try to serve the root page for SPA routing
  const rootPage = await cache.match('/');
  if (rootPage) {
    return rootPage;
  }
  // Last resort: return offline page
  const offlineCache = await caches.open(CACHE_NAME);
  const offlinePage = await offlineCache.match('/offline.html');
  if (offlinePage) {
    return offlinePage;
  }

  // Final fallback
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head><title>Offline - Nutrify</title></head>
      <body>
        <h1>You're offline</h1>
        <p>Please check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Retry</button>
      </body>
    </html>
  `,
    {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

// Handle Next.js static files
async function handleNextStaticFiles(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try cache first for static files
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful responses
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for Next.js static file:', request.url);
  }

  // Return empty response if not found
  return new Response('', { status: 404 });
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker loaded successfully');
