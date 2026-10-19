const CACHE_NAME = "extensao-cache-v2";

const ARQUIVOS_LOCAIS = [
    "./",
    "./index.html",
    "./main.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
];

const SCRIPTS_EXTERNOS = [
    "https://cdn.tailwindcss.com",
    "https://unpkg.com/vue@3/dist/vue.global.prod.js",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            await cache.addAll(ARQUIVOS_LOCAIS);

            for (const url of SCRIPTS_EXTERNOS) {
                const requisicao = new Request(url, {
                    mode: "no-cors",
                    cache: "reload",
                });

                const resposta = await fetch(requisicao);
                await cache.put(requisicao, resposta);
            }

            console.log("Cache offline pronto:", CACHE_NAME);
            await self.skipWaiting();
        })(),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const nomes = await caches.keys();

            await Promise.all(
                nomes
                    .filter((nome) => {
                        return nome.startsWith("extensao-cache-") && nome !== CACHE_NAME;
                    })
                    .map((nome) => caches.delete(nome)),
            );

            await self.clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const respostaSalva = await cache.match(event.request);

            return respostaSalva || fetch(event.request);
        })(),
    );
});
