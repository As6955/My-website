const CACHE_NAME = 'wedding-countdown-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/background-images.js',
  // כאן ניתן להוסיף קבצים נוספים שאתה רוצה לשמור במטמון
  '/1.jpg', // אם יש צורך להוסיף את כל התמונות באופן ידני, אפשר להשתמש בלולאה ליצירת רשימה
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // הקובץ נמצא במטמון, נשתמש בו
        }
        return fetch(event.request); // אם הקובץ לא נמצא במטמון, נוריד אותו מהרשת
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
