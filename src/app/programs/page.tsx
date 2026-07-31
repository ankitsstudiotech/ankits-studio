import Link from "next/link";
import type { Metadata } from "next";
import { ProgrammeCard, type ProgrammeAccent } from "@/components/home";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Body, TextLink } from "@/components/ui";
import { getProgrammes } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/programs";

export const metadata: Metadata = buildPageMetadata({
  title: "Programmes",
  description:
    "Strength training, personal training, yoga, Zumba, and dance programmes at Ankit's Studio — browse every programme and its available branches.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Programmes", path: PATH },
];

export default function ProgrammesIndexPage() {
  const programmes = getProgrammes();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main id="programmes-index" className="flex flex-1 flex-col">
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
              Programmes
            </li>
          </ol>
        </nav>
      </Container>

      <Section
        eyebrow="Programmes"
        title="Every programme at Ankit's Studio"
        description="Strength, personal training, yoga, Zumba, and dance — each programme page covers who it's for, class structure, available branches, timings, and trainers."
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((programme) => (
            <li key={programme.slug}>
              <ProgrammeCard
                name={programme.name}
                href={`/programs/${programme.slug}`}
                shortDescription={programme.shortDescription}
                accent={programme.heroAccent as ProgrammeAccent}
                tags={programme.audienceTags}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Locations"
        title="Available across our branches"
        description="Every programme page lists exactly which branches currently offer it, with a direct link through."
      >
        <Body>
          Looking for a specific branch instead? <TextLink href="/locations">Browse locations</TextLink>.
        </Body>
      </Section>
    </main>
  );
}
