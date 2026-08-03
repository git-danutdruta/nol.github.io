const CACHE_VERSION = 'v3';
const CACHE_PREFIX = `nol-math-${CACHE_VERSION}`;
const STATIC_CACHE = `${CACHE_PREFIX}-static`;
const CONTENT_CACHE = `${CACHE_PREFIX}-content`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime`;

const MAX_CONTENT_ENTRIES = 400;
const MAX_RUNTIME_ENTRIES = 180;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/locales/en/translation.json',
  '/locales/fr/translation.json',
  '/curriculum/index.json',
];

const CACHEABLE_STATIC_EXTENSIONS = /\.(?:js|css|png|jpg|jpeg|svg|webp|woff2?|ttf)$/i;

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isCurriculumOrLocale(pathname) {
  return pathname.startsWith('/curriculum/') || pathname.startsWith('/locales/');
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  const overflow = requests.length - maxEntries;
  if (overflow <= 0) return;

  for (let i = 0; i < overflow; i++) {
    await cache.delete(requests[i]);
  }
}

async function safeCachePut(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  try {
    await cache.put(request, response);
  } catch (error) {
    if (error && error.name === 'QuotaExceededError') {
      if (cacheName === CONTENT_CACHE) {
        await trimCache(CONTENT_CACHE, Math.floor(MAX_CONTENT_ENTRIES * 0.8));
      } else {
        await trimCache(RUNTIME_CACHE, Math.floor(MAX_RUNTIME_ENTRIES * 0.8));
      }
      await cache.put(request, response);
    }
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    await safeCachePut(cacheName, request, response.clone());
    await trimCache(cacheName, maxEntries);
  }
  return response;
}

async function staleWhileRevalidate(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await safeCachePut(cacheName, request, response.clone());
        await trimCache(cacheName, maxEntries);
      }
      return response;
    })
    .catch(() => cached);

  return cached || network;
}

async function networkFirst(request, cacheName, maxEntries) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await safeCachePut(cacheName, request, response.clone());
      await trimCache(cacheName, maxEntries);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error('Offline and no cached response available.');
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('nol-math-') && !key.startsWith(CACHE_PREFIX))
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (!isSameOrigin(request)) return;

  const { pathname } = new URL(request.url);

  if (isNavigationRequest(request)) {
    event.respondWith(
      networkFirst(request, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES).catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (isCurriculumOrLocale(pathname)) {
    // Prefer fresh curriculum/locales to avoid stale cached content regressions.
    event.respondWith(networkFirst(request, CONTENT_CACHE, MAX_CONTENT_ENTRIES));
    return;
  }

  if (CACHEABLE_STATIC_EXTENSIONS.test(pathname) || pathname === '/manifest.json') {
    event.respondWith(cacheFirst(request, STATIC_CACHE, MAX_CONTENT_ENTRIES));
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
});

