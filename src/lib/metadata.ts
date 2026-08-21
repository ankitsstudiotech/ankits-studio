import type { Metadata } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { env } from "./env";
import { resolveSiteOrigin } from "./seo/site-origin";

/**
 * Central metadata configuration — see docs/SEO-STRATEGY.md.
 * Every route's metadata should build on `baseMetadata` / `siteConfig`.
 *
 * Site origin comes ONLY from NEXT_PUBLIC_SITE_URL (via resolveSiteOrigin).
 * Production builds refuse empty / localhost origins so SEO never ships
 * http://localhost:3000 into canonicals, sitemap, robots, or JSON-LD.
 */
const siteUrl = resolveSiteOrigin({
  configured: env.NEXT_PUBLIC_SITE_URL,
  nodeEnv: env.NODE_ENV,
  isVitest: process.env.VITEST === "true",
  vercelEnv: process.env.VERCEL_ENV,
  vercelUrl: process.env.VERCEL_URL,
});

export const siteConfig = {
  name: "Ankit's Studio",
  defaultTitle: "Ankit's Studio",
  titleTemplate: "%s | Ankit's Studio",
  description:
    "Machine-free, coach-led fitness, yoga, Zumba and dance across four neighbourhood studios in Airoli, Ghansoli and Thane. Book a free trial on WhatsApp.",
  url: siteUrl,
};

/**
 * Index only a fully verified production build — see content-mode shouldNoIndex().
 */
export function buildRobotsMeta(): NonNullable<Metadata["robots"]> {
  const noIndex = shouldNoIndex();
  if (noIndex) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

/**
 * Root metadata omits `robots` on purpose: Next.js `not-found` auto-injects
 * `noindex`, and pairing it with a root `index, follow` emitted dual conflicting
 * meta tags. Every indexable route sets robots via `buildPageMetadata`.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  /**
   * Google Search favicon: declare a clear ≥48px square first.
   * Avoid leading with 16/32 (undersized for SERP) or the oversized
   * transparent symbol (no sizes attr — ambiguous candidate).
   * `public/favicon.ico` (48px PNG-in-ICO) covers crawlers that hit /favicon.ico.
   */
  icons: {
    icon: [
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};
