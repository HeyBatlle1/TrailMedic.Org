// ChironSurvival Service Worker - Emergency Medical App
// Provides offline capabilities for emergency medical scenarios

const CACHE_NAME = 'chiron-survival-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker caching core assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - cache-first strategy for assets, network-first for API calls
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('pexels.com')) {
    return;
  }
  
  // Network-first strategy for API calls
  if (event.request.url.includes('/api') || 
      event.request.url.includes('firebase')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful or non-GET responses
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return the offline page for HTML requests
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // Otherwise return a simple error response
            return new Response('Offline: Unable to fetch resource');
          });
      })
  );
});