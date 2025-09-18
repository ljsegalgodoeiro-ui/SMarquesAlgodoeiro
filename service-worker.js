const CACHE_NAME = "correspondencias-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo_condominio.jpg"
];

// Instala o Service Worker e faz o cache inicial
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Arquivos em cache inicial");
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Cache antigo removido:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepta as requisições e responde com cache ou rede
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna do cache ou busca na internet
      return response || fetch(event.request);
    })
  );
});
