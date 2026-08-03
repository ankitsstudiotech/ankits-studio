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
  "/timetable",
  "/trial",
  "/programs",
  "/locations",
  "/privacy-policy",
  "/terms",
];

/**
 * Sitemap entries for indexable production builds.
 * Soft mock domains (sample blog) stay out until verified.
 * `/trainers` and `/transformations` require their own publish thresholds.
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
