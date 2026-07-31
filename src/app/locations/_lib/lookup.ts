import { notFound } from "next/navigation";
import { branchSlugSchema, getBranchBySlug, type Branch } from "@/content";

/**
 * Validates the route param against the known slug enum before looking it
 * up — mirrors src/app/programs/_lib/lookup.ts. Note this intentionally
 * does NOT gate on `publiclyListed` — Thane's own detail page still
 * renders (direct URL only; excluded from index/nav/sitemap) per
 * docs/DECISIONS.md ADR-007 finding I2 and docs/INFORMATION-ARCHITECTURE.md.
 */
export function getBranchOrNotFound(slug: string): Branch {
  const parsedSlug = branchSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    notFound();
  }
  const branch = getBranchBySlug(parsedSlug.data);
  if (!branch) {
    notFound();
  }
  return branch;
}
