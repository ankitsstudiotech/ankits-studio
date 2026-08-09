import type { Metadata } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { env } from "./env";

/**
 * Central metadata configuration — see docs/SEO-STRATEGY.md.
 * Every route's metadata should build on `baseMetadata` / `siteConfig`.
 */
const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/ankits-studio-symbol-transparent.png", type: "image/png" },
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
