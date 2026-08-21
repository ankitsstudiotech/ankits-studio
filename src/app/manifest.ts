import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

/**
 * PWA / install manifest — Studio Pulse dark theme + brand favicon ladder.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Ankit's Studio",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e10",
    theme_color: "#0e0e10",
    icons: [
      {
        src: "/brand/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
