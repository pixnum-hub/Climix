self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  self.clients.claim();
});

/* IMPORTANT:
   Do NOT intercept fetch.
   Let network work normally.
*/
