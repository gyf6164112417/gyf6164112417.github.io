const CACHE_NAME = 'zhinenghuanzhuang-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    // Network first, fallback to cache for API requests
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to put one copy in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              // Only cache successful responses
              if (response.status === 200) {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        })
        .catch(() => {
          // If network request fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Cache first, fallback to network for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream that can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response to put one copy in cache and serve the other
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
  );
});

// Handle communication with the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// Sync stored form data when online
async function syncFormData() {
  try {
    const db = await openDatabase();
    const tx = db.transaction('offlineFormData', 'readwrite');
    const store = tx.objectStore('offlineFormData');
    
    // Get all stored form submissions
    const submissions = await store.getAll();
    
    // Try to submit each stored form
    for (const submission of submissions) {
      try {
        const response = await fetch(submission.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          // If successful, remove from store
          await store.delete(submission.id);
        }
      } catch (error) {
        console.error('Error syncing form data:', error);
        // Will be retried on next sync
      }
    }
  } catch (error) {
    console.error('Database error during sync:', error);
  }
}

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineFormDatabase', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineFormData')) {
        db.createObjectStore('offlineFormData', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
} 