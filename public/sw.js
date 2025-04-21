self.addEventListener('install', () => {
  // Just activate the service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle all fetches normally
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If fetch fails, return a simple response
        return new Response('', { status: 200 });
      })
  );
});