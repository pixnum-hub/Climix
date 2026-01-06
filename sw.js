const CACHE_NAME = "weathia-v1";
const DATA_CACHE_NAME = "weathia-data-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", event => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);

  // Cache API responses separately
  if (requestUrl.hostname.includes("open-meteo.com")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache =>
        fetch(event.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          })
      )
    );
    return;
  }

  // Offline caching for app shell
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        if (event.request.destination === "document") {
          return caches.match("/");
        }
      });
    })
  );
});
