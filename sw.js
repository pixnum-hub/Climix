const CACHE_NAME = 'climix-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Install SW and cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if(key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
  );
});
