import type { Metadata } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { env } from "./env";

/**
 * Central metadata configuration — see docs/SEO-STRATEGY.md's metadata
 * mechanics section. Every route's `metadata`/`generateMetadata` should
 * build on `baseMetadata`/`siteConfig` rather than repeating these values.
 *
 * Thane is deliberately not named here even generically ("multiple
 * locations" instead) — it isn't publicly listed yet (ADR-007 finding I2),
 * and this text ships even on a future verified-but-Thane-still-unconfirmed
 * build.
 */
const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Ankit's Studio",
  defaultTitle: "Ankit's Studio",
  titleTemplate: "%s | Ankit's Studio",
  description:
    "Strength training, personal training, yoga, Zumba, and dance programmes across multiple locations.",
  url: siteUrl,
};

/**
 * Index only a fully verified production build — see
 * src/content/content-mode.ts shouldNoIndex() and DECISIONS.md ADR-011.
 * Every route's metadata should include this rather than hand-rolling a
 * `robots` value.
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
 * meta tags. Every indexable/withheld route sets robots via `buildPageMetadata`
 * (or design-lab layout metadata).
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
};
