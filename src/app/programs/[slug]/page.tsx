import Link from "next/link";
import type { Metadata } from "next";
import {
  ProgrammeDetailView,
} from "@/components/programs/pulse/ProgrammeDetailView";
import { LegacyProgrammeNotice } from "@/components/programs/pulse/LegacyProgrammeNotice";
import { Container } from "@/components/ui/Container";
import {
  getProgrammeBySlug,
  getProgrammes,
  getPubliclyListedBranches,
  isConfirmedProgramme,
  isMigrationPendingProgramme,
} from "@/content";
import {
  buildWhatsAppProgrammeEnquiryUrl,
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildCourseJsonLd } from "@/lib/seo/structured-data";
import { getProgrammeOrNotFound } from "../_lib/lookup";

type ProgrammePageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProgrammes().map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({ params }: ProgrammePageParams): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeOrNotFound(slug);
  return buildPageMetadata({
    title: programme.seoTitle ?? programme.name,
    description: programme.seoDescription ?? programme.shortDescription,
    path: `/programs/${programme.slug}`,
    forceNoIndex: isMigrationPendingProgramme(programme),
  });
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageParams) {
  const { slug } = await params;
  const programme = getProgrammeOrNotFound(slug);
  const whatsappHref =
    buildWhatsAppProgrammeEnquiryUrl(programme.name) ?? getPrimaryConversionHref();
  const whatsappLabel = getPrimaryConversionLabel();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/programs" },
    { name: programme.name, path: `/programs/${programme.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  if (isMigrationPendingProgramme(programme)) {
    const related = programme.taxonomyRelatedSlug
      ? getProgrammeBySlug(programme.taxonomyRelatedSlug)
      : undefined;

    return (
      <main className="flex flex-1 flex-col">
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
              <li>
                <Link href="/programs" className="hover:text-ink">
                  Programmes
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink break-words">
                {programme.name}
              </li>
            </ol>
          </nav>
        </Container>
        <LegacyProgrammeNotice
          programme={programme}
          relatedName={related?.name}
          relatedHref={related ? `/programs/${related.slug}` : undefined}
          whatsappHref={whatsappHref}
        />
      </main>
    );
  }

  const courseJsonLd = isConfirmedProgramme(programme) ? buildCourseJsonLd(programme) : null;
  const locations = getPubliclyListedBranches()
    .filter((branch) => programme.branchSlugs.includes(branch.slug))
    .map((branch) => ({
      slug: branch.slug,
      name: branch.name.replace(/^Ankit's Studio —\s*/i, ""),
      href: `/locations/${branch.slug}`,
    }));

  const related = (programme.relatedProgrammeSlugs ?? [])
    .map((relatedSlug) => getProgrammeBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item && isConfirmedProgramme(item)))
    .map((item) => ({ slug: item.slug, name: item.name }));

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {courseJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(courseJsonLd) }}
        />
      ) : null}

      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/programs" className="hover:text-ink">
                Programmes
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink break-words">
              {programme.name}
            </li>
          </ol>
        </nav>
      </Container>

      <ProgrammeDetailView
        programme={programme}
        locations={locations}
        related={related}
        whatsappHref={whatsappHref}
        whatsappLabel={whatsappLabel}
      />
    </main>
  );
}
