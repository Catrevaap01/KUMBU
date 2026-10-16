import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/?source=pwa",
    name: "KUBIKA — Compara. Poupa. Escolhe melhor.",
    short_name: "KUBIKA",
    description: "Compara preços. Poupa. Escolhe melhor. Os melhores preços e ofertas em Angola.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#16a34a",
    orientation: "portrait",
    categories: ["shopping", "business", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/kubika-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Pesquisar Preços",
        short_name: "Pesquisar",
        description: "Encontre os preços mais baixos em Luanda e Angola",
        url: "/search",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Cotação / Carrinho",
        short_name: "Cotação",
        description: "Veja o total da sua cotação e imprima a fatura",
        url: "/cart",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Início",
        short_name: "Início",
        description: "Página inicial do KUBIKA",
        url: "/",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  };
}
