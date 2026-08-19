import { notFound } from "next/navigation";
import { branchSlugSchema, getBranchBySlug, type Branch } from "@/content";

/**
 * Validates the route param against the known slug enum before looking it up.
 * Legacy `/locations/airoli` is handled by a permanent redirect in next.config.ts
 * (see docs/migrations/LOCATION-ROUTE-MIGRATION.md).
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
