import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

/**
 * Minimal, functional PWA manifest — not a final branding deliverable.
 * `theme_color`/`background_color` are neutral placeholders (final values
 * are a design-tokens/Track A decision, out of this task's ownership).
 * Icons reference the only real icon asset that exists (`/favicon.ico`);
 * proper 192/512px app icons are a follow-up once brand assets exist —
 * see docs/HANDOFF-SEO.md.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
