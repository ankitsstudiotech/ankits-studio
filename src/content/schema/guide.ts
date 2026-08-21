import { z } from "zod";
import { provenanced } from "./provenance";
import { programmeSlugSchema } from "./slugs";

export const guideClusterSchema = z.enum([
  "zumba",
  "functional",
  "wedding",
  "home-pt",
  "yoga",
  "dance",
  "online",
  "corporate",
  "cross",
]);
export type GuideCluster = z.infer<typeof guideClusterSchema>;

export const guideCtaKindSchema = z.enum([
  "free-trial",
  "wedding-enquiry",
  "home-pt-enquiry",
]);
export type GuideCtaKind = z.infer<typeof guideCtaKindSchema>;

const inlinePartSchema = z.union([
  z.string(),
  z.object({
    href: z.string().min(1),
    label: z.string().min(1),
  }),
]);

export const guideBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("p"),
    children: z.array(inlinePartSchema).min(1),
  }),
  z.object({
    type: z.literal("h2"),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("ul"),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal("table"),
    caption: z.string().optional(),
    headers: z.array(z.string().min(1)).min(2),
    rows: z.array(z.array(z.string())).min(1),
  }),
]);
export type GuideBlock = z.infer<typeof guideBlockSchema>;

/**
 * Evergreen SEO guide (ADR-024). Educational copy only — no invented fees,
 * batch times, medical claims, or unverified business facts.
 */
export const guideSchema = provenanced({
  slug: z.string().min(1),
  /** Browser / SERP title (without site template suffix). */
  title: z.string().min(1),
  /** Visible H1 — may differ slightly from title. */
  h1: z.string().min(1),
  /** Meta description + Article description. */
  description: z.string().min(1),
  /** Short hub card blurb. */
  excerpt: z.string().min(1),
  cluster: guideClusterSchema,
  /** Hub grouping label. */
  clusterLabel: z.string().min(1),
  primaryProgrammeSlug: programmeSlugSchema,
  relatedGuideSlugs: z.array(z.string().min(1)).max(2),
  ctaKind: guideCtaKindSchema,
  ctaLabel: z.string().min(1),
  publishedAt: z.string().min(1),
  /** ISO date; same as publishedAt until a real edit lands. */
  modifiedAt: z.string().min(1),
  blocks: z.array(guideBlockSchema).min(1),
});
export type Guide = z.infer<typeof guideSchema>;
