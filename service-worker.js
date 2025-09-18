const CACHE_NAME = "smarques-cache-v1";

// Lista de arquivos que podem ser usados offline (mínimo necessário)
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo_condominio.jpg"
];

// Instala o Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de busca: sempre tenta rede primeiro, se falhar usa cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualiza cache com a versão mais recente
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se não houver rede, usa o cache
        return caches.match(event.request);
      })
  );
});
