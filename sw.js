/* sw.js: offline support.
   Cache-first: every file is saved on first visit, then served from the cache, even offline.
   After you edit any file, change VERSION below (for example v1 to v2) so phones fetch the new files. */
var VERSION = 'at3-study-v2';
var FILES = [
  './',
  'index.html',
  'content-topics.js',
  'content-practice.js',
  'content-code.js',
  'manifest.webmanifest',
  'icon.svg',
  'apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    return fetch(event.request).then(function (res) {
      if (res && res.ok && new URL(event.request.url).origin === self.location.origin) {
        var copy = res.clone();
        caches.open(VERSION).then(function (cache) { cache.put(event.request, copy); });
      }
      return res;
    }).catch(function () {
      // offline and not cached: fall back to the app shell for page requests
      if (event.request.mode === 'navigate') return caches.match('index.html');
    });
  }));
});
