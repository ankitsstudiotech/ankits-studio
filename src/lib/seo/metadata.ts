import type { Metadata } from "next";
import { z } from "zod";
import { buildRobotsMeta, siteConfig } from "@/lib/metadata";
import { buildCanonicalUrl } from "./canonical";

/**
 * Per-page metadata builder. Every route should build its `metadata`/
 * `generateMetadata` export from this rather than hand-rolling title/
 * description/canonical/OG/Twitter — see docs/SEO-STRATEGY.md metadata
 * mechanics. `title` is a plain string, not `{ absolute: ... }`, so it
 * still resolves through the root layout's title template
 * ("%s | Ankit's Studio") — see src/lib/metadata.ts baseMetadata.
 */
const pageMetadataInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  path: z.string().min(1).startsWith("/"),
  ogImagePath: z.string().optional(),
  /** Force noindex even if the site-wide mock gate is later lifted (e.g. sample blog). */
  forceNoIndex: z.boolean().optional(),
});

export type PageMetadataInput = z.infer<typeof pageMetadataInputSchema>;

/** Throws (via Zod) if a required field is missing or malformed. */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { title, description, path, ogImagePath, forceNoIndex } = pageMetadataInputSchema.parse(input);
  const canonical = buildCanonicalUrl(path);
  const robots = forceNoIndex ? { index: false, follow: false } : buildRobotsMeta();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      images: ogImagePath ? [{ url: ogImagePath }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImagePath ? [ogImagePath] : undefined,
    },
    robots,
  };
}
