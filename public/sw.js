self.addEventListener('install', () => {
  // Just activate the service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', () => {
  // Don't interfere with fetch requests, let the browser handle everything
  return;
});