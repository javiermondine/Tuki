// Service Worker para Myotragus - Capacidades offline
const CACHE_NAME = 'myotragus-v1.1.7';

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/activities.html',
  '/teachings.html',
  '/forum.html',
  '/signup.html',
  '/offline.html',
  '/styles/main.css',
  '/styles/activities.css',
  '/styles/forum.css',
  '/scripts/main.js',
  '/scripts/i18n.js',
  '/scripts/security.js',
  '/scripts/forum.js',
  '/scripts/activities.js',
  '/assets/mytogagus.jpg',
  '/assets/hero-photo.svg',
  '/assets/favicon.svg',
  '/assets/favicon-1760644697.png',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Almacenando en caché archivos estáticos');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché: Network First con fallback a caché
self.addEventListener('fetch', event => {
  // Solo manejamos solicitudes GET
  if (event.request.method !== 'GET') return;

  // No interceptamos llamadas a API
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonamos la respuesta porque solo podemos usarla una vez
        const responseToCache = response.clone();
        
        // Actualizamos la caché con la nueva respuesta
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos desde la caché
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Si no está en caché y es una página HTML, devolvemos la página offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Sincronización en segundo plano para formularios
self.addEventListener('sync', event => {
  if (event.tag === 'form-submission') {
    event.waitUntil(submitPendingForms());
  }
});

// Función para enviar formularios pendientes cuando vuelve la conexión
async function submitPendingForms() {
  const pendingForms = await getPendingForms();
  
  return Promise.all(pendingForms.map(async (form) => {
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.data)
      });
      
      if (response.ok) {
        // Eliminar formulario de pendientes
        await removePendingForm(form.id);
      }
    } catch (error) {
      console.error('Error al enviar formulario pendiente', error);
    }
  }));
}

// Funciones para gestionar formularios pendientes
async function getPendingForms() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readonly');
    const store = transaction.objectStore('pendingForms');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingForm(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingForms'], 'readwrite');
    const store = transaction.objectStore('pendingForms');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyotragusForms', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore('pendingForms', { keyPath: 'id' });
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}