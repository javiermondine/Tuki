const CACHE_NAME = 'scout-site-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/assets/mytogagus.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});