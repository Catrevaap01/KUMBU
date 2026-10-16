import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KUBIKA — Compara. Poupa. Escolhe melhor.",
    short_name: "KUBIKA",
    description: "Compara preços. Poupa. Escolhe melhor. Os melhores preços e ofertas em Angola.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B0D",
    theme_color: "#16a34a",
    orientation: "portrait",
    categories: ["shopping", "finance", "business"],
    icons: [
      {
        src: "/kubika-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/kubika-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
