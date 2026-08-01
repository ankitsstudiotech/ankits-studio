/**
 * Mirrors `shouldNoIndex()` — while mock/unverified content exists (dev,
 * Vercel preview, or `ALLOW_MOCK_PUBLISH=true`), disallow all paths and
 * omit the sitemap URL so crawlers are not invited to discover routes.
 * See docs/MOCK-PREVIEW-DEPLOYMENT.md and ADR-011.
 *
 * When the site is indexable, `/design-lab/` remains permanently disallowed
 * (ADR-014 / frozen prototypes — never public SEO landings).
 */
import type { MetadataRoute } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { siteConfig } from "@/lib/metadata";

/** Always excluded from crawl invitations once the wider site is indexable. */
export const DESIGN_LAB_DISALLOW_PATHS = ["/design-lab/", "/design-lab"] as const;

export function buildRobotsRules(): MetadataRoute.Robots {
  const blocked = shouldNoIndex();
  const normalizedBase = siteConfig.url.replace(/\/$/, "");
  if (blocked) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...DESIGN_LAB_DISALLOW_PATHS],
    },
    sitemap: `${normalizedBase}/sitemap.xml`,
  };
}
