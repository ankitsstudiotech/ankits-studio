import type { MetadataRoute } from "next";
import { shouldNoIndex } from "@/content/content-mode";

/**
 * A sitemap entry is an implicit "this is indexable, confirmed content"
 * signal — so this returns nothing at all while the site has any
 * unverified content anywhere (`shouldNoIndex()`), rather than trying to
 * selectively include "safe" entries. This is the simplest rule that
 * satisfies "the sitemap must not imply mock location information is
 * verified" — see docs/DECISIONS.md ADR-002/ADR-011.
 *
 * No routes exist yet (Track D, docs/IMPLEMENTATION-PLAN.md) — once they
 * do, extend this to build entries from src/content's accessor
 * (publicly-listed, verified branches/programmes, etc.), still gated the
 * same way.
 */
export function buildSitemapEntries(): MetadataRoute.Sitemap {
  if (shouldNoIndex()) {
    return [];
  }
  return [];
}
