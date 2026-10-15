const CACHE_NAME = "kumbu-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/kumbu-icon.svg",
  "/kumbu-logo.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Apenas métodos GET
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Network-first para navegação e páginas dinâmicas, com fallback de cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        return cached || (await caches.match("/"));
      })
    );
    return;
  }

  // Cache-first para ícones estáticos
  if (url.pathname.endsWith(".svg") || url.pathname.endsWith(".png") || url.pathname.endsWith(".webmanifest")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response.status === 200) {
              const resClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // Network padrão para o resto
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
