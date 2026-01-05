const CACHE_NAME = 'climix-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './icon.png',
  './manifest.json',
  // Add any other CSS/JS/images used
];

// Install event: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if(key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch event: serve cached files if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache new files dynamically
        return caches.open(CACHE_NAME).then(cache => {
          if(event.request.url.startsWith('http')) cache.put(event.request, response.clone());
          return response;
        });
      }).catch(()=>caches.match('./index.html'));
    })
  );
});

// Push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {title:'Climix', body:'Weather Alert'};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon.png',
      vibrate: [100,50,100],
      tag: 'weather-alert'
    })
  );
});

// Notification click action
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type:'window'}).then(clientList=>{
      if(clientList.length>0) clientList[0].focus();
      else clients.openWindow('./');
    })
  );
});
