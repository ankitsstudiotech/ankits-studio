import Link from "next/link";
import type { Metadata } from "next";
import { LocationTeaserCard } from "@/components/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Body, TextLink } from "@/components/ui";
import { getPubliclyListedBranches } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/locations";

export const metadata: Metadata = buildPageMetadata({
  title: "Locations",
  description: "Find an Ankit's Studio branch near you — programmes, timings, and contact details for each location.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Locations", path: PATH },
];

/** Only publicly-listed branches — Thane stays unlinked here until
 *  confirmed (docs/DECISIONS.md ADR-007 finding I2). */
export default function LocationsIndexPage() {
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main id="locations-index" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              Locations
            </li>
          </ol>
        </nav>
      </Container>

      <Section
        eyebrow="Locations"
        title="Find a branch"
        description="Each location page covers address, opening hours, programmes offered, timetable, trainers, and contact details."
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <li key={branch.slug}>
              <LocationTeaserCard
                name={branch.name}
                href={`/locations/${branch.slug}`}
                areaLabel={branch.slug}
                programmeCountLabel={`${branch.programmeSlugs.length} programmes offered`}
                mockDisclaimer={branch.dataStatus === "verified" ? "" : branch.mockDisclaimer}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Programmes" title="Looking for a specific programme instead?">
        <Body>
          <TextLink href="/programs">Browse all programmes</TextLink>.
        </Body>
      </Section>
    </main>
  );
}
