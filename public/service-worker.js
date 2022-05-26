const APP_PREFIX = 'BudgetTracker-';
const CACHE_NAME = APP_PREFIX + "V1"

const CACHE_FILES = [
    './index.html',
    './css/styles.css',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png',
    './js/index.js',
];

self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(CACHE_FILES);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(function (keys) {
            let keepCache = keys.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            keepCache.push(CACHE_NAME);

            return Promise.all(
                keys.map(function (key, i) {
                    if (keepCache.indexOf(key) === -1) {
                        console.log('deleting ' + keys[i]);
                        return caches.delete(keys[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e)=>{
    console.log('fetch @' + e.req.url)
    e.respondWith(
        caches.match(e.req).then((req)=>{
            if (req) {
                return req
            } else {
                return fetch(e.req)
            }
        })
    )
})
