import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getProgrammes,
  getPubliclyListedBranches,
  getPublishableTrainers,
  shouldIndexMemberStoriesRoute,
  shouldIndexTrainersRoute,
} from "@/content";
import { shouldNoIndex } from "@/content/content-mode";
import { buildCanonicalUrl } from "./canonical";

/** Static marketing routes — trainers and member stories added only when thresholds are met. */
const STATIC_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/pricing",
  "/contact",
  "/blog",
  "/timetable",
  "/trial",
  "/programs",
  "/locations",
  "/privacy-policy",
  "/terms",
];

/**
 * A sitemap entry is an implicit "this is indexable, confirmed content"
 * signal — so this returns nothing at all while the site has any
 * unverified content anywhere (`shouldNoIndex()`), rather than trying to
 * selectively include "safe" entries. This is the simplest rule that
 * satisfies "the sitemap must not imply mock location information is
 * verified" — see docs/DECISIONS.md ADR-002/ADR-011.
 *
 * Once `shouldNoIndex()` is false (a production build with zero unverified
 * content anywhere), builds real entries: every static marketing route,
 * plus one entry per verified programme/publicly-listed branch/trainer/blog
 * post. `/trainers` and trainer slug URLs require `shouldIndexTrainersRoute()`
 * (ADR-019). Dynamic entries are additionally filtered by publishability.
 * See docs/DECISIONS.md ADR-013 (SEO-001) and ADR-019.
 */
export function buildSitemapEntries(): MetadataRoute.Sitemap {
  if (shouldNoIndex()) {
    return [];
  }

  const staticPaths = [
    ...STATIC_ROUTES,
    ...(shouldIndexTrainersRoute() ? ["/trainers"] : []),
    ...(shouldIndexMemberStoriesRoute() ? ["/transformations"] : []),
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: buildCanonicalUrl(path),
  }));

  const programmeEntries: MetadataRoute.Sitemap = getProgrammes()
    .filter(
      (programme) =>
        programme.dataStatus === "verified" && programme.taxonomyStatus === "confirmed",
    )
    .map((programme) => ({ url: buildCanonicalUrl(`/programs/${programme.slug}`) }));

  const branchEntries: MetadataRoute.Sitemap = getPubliclyListedBranches()
    .filter((branch) => branch.dataStatus === "verified")
    .map((branch) => ({ url: buildCanonicalUrl(`/locations/${branch.slug}`) }));

  const trainerEntries: MetadataRoute.Sitemap = shouldIndexTrainersRoute()
    ? getPublishableTrainers().map((trainer) => ({
        url: buildCanonicalUrl(`/trainers/${trainer.slug}`),
      }))
    : [];

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts()
    .filter((post) => post.dataStatus === "verified")
    .map((post) => ({ url: buildCanonicalUrl(`/blog/${post.slug}`) }));

  return [...staticEntries, ...programmeEntries, ...branchEntries, ...trainerEntries, ...blogEntries];
}
