// Service Worker – Fishing Bait Advisor
// Cache-First-Strategie für alle statischen App-Ressourcen

const CACHE_NAME = 'fba-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/filter-engine.js',
  '/js/profile-manager.js',
  '/js/warning-engine.js',
  '/js/recommendation-renderer.js',
  '/js/bait-data.js',
];

// ── Install ──────────────────────────────────────────────────────────────────
// Alle statischen Assets werden beim ersten Laden in den Cache geschrieben.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
// Alte Cache-Versionen (alle Caches außer CACHE_NAME) werden gelöscht.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
// Cache-First: zuerst Cache prüfen; bei Cache-Miss Netzwerk abrufen und
// Antwort für künftige Anfragen in den Cache schreiben.
self.addEventListener('fetch', (event) => {
  // Nur GET-Anfragen werden gecacht; alle anderen werden direkt durchgeleitet.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Cache-Miss: Netzwerk abrufen und Kopie in Cache speichern.
      return fetch(event.request)
        .then((networkResponse) => {
          // Nur gültige Antworten cachen (status 200, kein opaker Response von
          // Cross-Origin-Anfragen ohne CORS, die uns als Status 0 ankommen).
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Netzwerk nicht erreichbar und kein Cache-Eintrag vorhanden.
          // Für HTML-Anfragen: index.html aus Cache als Fallback liefern.
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          // Für alle anderen Ressourcentypen: leere Antwort zurückgeben.
          return new Response('', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
