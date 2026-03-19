const CACHE_NAME = 'ruel-pos-cache-v6';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline-outbox.js',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(APP_SHELL.map(async (assetPath) => {
        try {
          const response = await fetchFresh(assetPath);
          if (response && response.status === 200) {
            await cache.put(assetPath, response.clone());
          }
        } catch (_error) {
          // Keep install alive even when a fresh asset request fails.
        }
      })))
      .catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isApiRequest(requestUrl) {
  return requestUrl.pathname.startsWith('/api/');
}

function isRuntimeAsset(requestUrl) {
  return requestUrl.pathname === '/app.js'
    || requestUrl.pathname === '/styles.css'
    || requestUrl.pathname === '/offline-outbox.js'
    || requestUrl.pathname === '/manifest.webmanifest';
}

function fetchFresh(request) {
  return fetch(request, {
    cache: 'no-store'
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetchFresh(event.request).catch(() => caches.match(event.request).then((cached) => cached || new Response('', { status: 503 })))
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetchFresh(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (isRuntimeAsset(requestUrl)) {
    event.respondWith(
      fetchFresh(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request))
        .then((response) => response || new Response('', { status: 503, statusText: 'Offline script unavailable' }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      });
    })
  );
});
