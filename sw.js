const CACHE_NAME = 'climix-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './icon.png',   // your 3D icon
  './manifest.json',
  // Add other assets if you have CSS/JS files separated
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(()=>caches.match('./index.html'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if(key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});
