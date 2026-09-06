/* Ammi's Diet Plan — cache-first service worker.
   Bump CACHE_VERSION whenever index.html changes so phones pick up the update. */
const CACHE_VERSION = 'diet-plan-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // addAll is all-or-nothing; add one by one so a single 404 can't
      // leave the app with no cache at all.
      .then((cache) => Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => {}))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          // Only cache same-origin, successful, basic responses.
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline and not cached: for a page request, hand back the app shell
          // so she never sees the browser's dinosaur.
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
