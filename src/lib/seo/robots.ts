import type { MetadataRoute } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { siteConfig } from "@/lib/metadata";

/**
 * Mirrors `shouldNoIndex()` — while mock/unverified content exists (dev,
 * Vercel preview, or `ALLOW_MOCK_PUBLISH=true`), disallow all paths and
 * omit the sitemap URL so crawlers are not invited to discover routes.
 * See docs/MOCK-PREVIEW-DEPLOYMENT.md and ADR-011.
 */
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
    },
    sitemap: `${normalizedBase}/sitemap.xml`,
  };
}
