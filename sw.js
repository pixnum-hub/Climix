const CACHE_NAME = 'climix-cache-v1';
const urlsToCache = ['./','./index.html','./manifest.json','./icon-512.png','./icon-192.png'];

// Install SW
self.addEventListener('install', e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});

// Activate SW
self.addEventListener('activate', e=>{
 e.waitUntil(self.clients.claim());
});

// Fetch requests
self.addEventListener('fetch', e=>{
 e.respondWith(caches.match(e.request).then(resp=>resp||fetch(e.request)));
});
