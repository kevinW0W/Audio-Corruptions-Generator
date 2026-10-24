const CACHE_NAME = 'audio-stutter-studio-v11';
const APP_FILES = [
  'index.html',
  'audio-corruptions.html',
  'audio-corruptions.css',
  'styles/audio-corruptions.css',
  'audio-corruptions.svg',
  'apple-touch-icon.png',
  'apple-touch-icon-v2.png',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'vendor/lucide.min.js',
  'vendor/lame.min.js',
  'PWA/offline.html'
];

const appUrl = (path) => new URL(path, self.registration.scope).href;
const appPageUrl = appUrl('audio-corruptions.html');
const offlinePageUrl = appUrl('PWA/offline.html');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache independently so one unavailable optional file won't cancel the app shell.
    await Promise.all(APP_FILES.map((path) =>
      cache.add(appUrl(path)).catch((error) => {
        console.warn('Offline asset was not cached:', path, error);
      })
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) ||
          (await caches.match(appPageUrl)) ||
          (await caches.match(offlinePageUrl)) ||
          Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
