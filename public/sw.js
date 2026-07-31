// =====================================================================
// Service worker — makes the mandir app work fully offline.
// Strategy: network-first for pages (devotees always get the newest
// texts when online), falling back to the cached copy when offline.
// Bump CACHE_VERSION whenever you change the texts significantly.
// =====================================================================

const CACHE_VERSION = 'mandir-v9';

const PRECACHE_URLS = [
  '/',
  '/history',
  '/aarti-baba',
  '/aarti-sai',
  '/aarti-hinglaj',
  '/chalisa',
  '/vidhi',
  '/samagri-bahar',
  '/samagri-mandir',
  '/pallav',
  '/mantra',
  '/ashtak',
  '/notes',
  '/vidhi/patila.jpg',
  '/vidhi/sai.jpg',
  '/hinglaj/mata.jpg',
  '/samagri/bahar.jpg',
  '/samagri/mandir.jpg',
  '/manifest.json',
  '/jhulelal.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // addAll would reject the whole install if one URL fails
      // (e.g. photo not added yet) — cache individually instead.
      .then((cache) =>
        Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.g')) return;

  // Static assets (JS/CSS/fonts/images) are content-hashed → cache-first.
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname.includes('fonts.g') ||
    /\.(png|jpg|jpeg|webp|svg|woff2?)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            // never cache errors/404s — a missing image would otherwise
            // stay "missing" forever even after the file is added
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            }
            return res;
          })
      )
    );
    return;
  }

  // Pages: network-first with cache fallback.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/'))
      )
  );
});
