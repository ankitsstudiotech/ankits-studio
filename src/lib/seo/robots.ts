import type { MetadataRoute } from "next";
import { shouldNoIndex } from "@/content/content-mode";
import { siteConfig } from "@/lib/metadata";

/**
 * Mirrors `shouldNoIndex()` exactly — disallows everything while any
 * unverified content exists anywhere in the site (dev, preview, or an
 * `ALLOW_MOCK_PUBLISH=true` build), matching this task's "noindex and
 * nofollow" mock-mode rule and docs/DECISIONS.md ADR-011.
 */
export function buildRobotsRules(): MetadataRoute.Robots {
  const blocked = shouldNoIndex();
  const normalizedBase = siteConfig.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      ...(blocked ? { disallow: "/" } : { allow: "/" }),
    },
    sitemap: `${normalizedBase}/sitemap.xml`,
  };
}
