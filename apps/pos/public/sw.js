const CACHE_NAME = 'ruel-pos-cache-v4';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/vendor/dexie.min.js',
  '/offline-outbox.js',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => Promise.resolve())
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

function isRuntimeScript(requestUrl) {
  return requestUrl.pathname === '/app.js'
    || requestUrl.pathname === '/offline-outbox.js'
    || requestUrl.pathname === '/vendor/dexie.min.js';
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request).catch(() => (
        new Response(
          JSON.stringify({ error: 'offline_api_unreachable' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      ))
    );
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (isRuntimeScript(requestUrl)) {
    event.respondWith(
      fetch(event.request)
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
      }).catch(() => (
        new Response('', { status: 503, statusText: 'Offline resource unavailable' })
      ));
    })
  );
});
