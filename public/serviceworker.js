const CACHE_NAME = "version-2";
const urlsTocache =['index.html', 'offline.html'];

const self = this;

//Install SW
self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsTocache);
            })
            .catch((error) => {
                console.error('Failed to cache', error);
            })
    )

});

// Listen for requests
// TODO jos haluaa index sivun toimivan offline, niin pitää hakea se cachesta??
self.addEventListener('fetch',(event)=>{
    event.respondWith(
        caches.match(event.request)
            .then(()=>{
                console.log('Fetch');
                return fetch(event.request)
                    .catch(()=>caches.match('offline.html'));
            })
            .catch((error) => {
                console.error('Failed to fetch', error);
            })
    )
    
});

// Activate the SW
self.addEventListener('activate',(event)=>{
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames)=>Promise.all(
            cacheNames.map((cacheName)=>{
                if(cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
    
});


