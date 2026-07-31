import { notFound } from "next/navigation";
import { getProgrammeBySlug, programmeSlugSchema, type Programme } from "@/content";

/**
 * Validates the route param against the known slug enum before looking it
 * up — an unknown/malformed slug 404s immediately rather than reaching the
 * accessor with an unsafe cast. Used by both `generateMetadata` and the
 * page component so a missing programme never renders bogus metadata for a
 * page that's about to 404 anyway.
 */
export function getProgrammeOrNotFound(slug: string): Programme {
  const parsedSlug = programmeSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    notFound();
  }
  const programme = getProgrammeBySlug(parsedSlug.data);
  if (!programme) {
    notFound();
  }
  return programme;
}
