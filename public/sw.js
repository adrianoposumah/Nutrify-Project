/* eslint-disable @typescript-eslint/no-unused-vars */
// Service Worker for Nutrify App - Offline Support
const CACHE_NAME = 'nutrify-v1';
const OFFLINE_CACHE = 'nutrify-offline-v1';
const API_CACHE = 'nutrify-api-v1';

// Static assets to cache
const STATIC_ASSETS = ['/', '/manifest.json', '/NutrifyLogo.svg', '/Facebook.svg', '/Instagram.svg', '/Twitter.svg', '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

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
        const essentialAssets = ['/', '/NutrifyLogo.svg', '/manifest.json'];

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

      caches.open(OFFLINE_CACHE).then((cache) => {
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

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  if (url.pathname.includes('/api/') || isApiEndpoint(url.pathname)) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(handleNextStaticFiles(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleStaticRequest(request));
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);

      if (request.url.includes('/random-items')) {
        await cacheRandomItemsData(networkResponse.clone());
      }
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.url.includes('/random-items')) {
      return await getOfflineRandomItems();
    }

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

async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for static request:', request.url);
  }

  return new Response('Not found', { status: 404 });
}

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

async function getOfflineRandomItems() {
  const offlineCache = await caches.open(OFFLINE_CACHE);
  const cachedData = await offlineCache.match('/offline-random-items');

  if (cachedData) {
    return cachedData;
  }

  return new Response(
    JSON.stringify({
      status: 'success',
      message: 'Offline data',
      data: [],
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

function isApiEndpoint(pathname) {
  return API_ENDPOINTS.some((endpoint) => pathname.includes(endpoint));
}

async function handleNavigationRequest(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for navigation:', request.url);
  }

  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const rootPage = await cache.match('/');
  if (rootPage) {
    return rootPage;
  }
  const offlineCache = await caches.open(CACHE_NAME);
  if (offlinePage) {
    return offlinePage;
  }

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

async function handleNextStaticFiles(request) {
  const cache = await caches.open(CACHE_NAME);

  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed for Next.js static file:', request.url);
  }

  return new Response('', { status: 404 });
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
