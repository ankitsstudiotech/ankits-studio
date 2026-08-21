import type { Metadata } from "next";
import { ProgrammeViewTracker } from "@/components/analytics/AnalyticsPageTracker";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import {
  ProgrammeDetailView,
} from "@/components/programs/pulse/ProgrammeDetailView";
import { LegacyProgrammeNotice } from "@/components/programs/pulse/LegacyProgrammeNotice";
import {
  getGuidesForProgramme,
  getProgrammeBySlug,
  getProgrammes,
  getPubliclyListedBranches,
  isConfirmedProgramme,
  isMigrationPendingProgramme,
} from "@/content";
import {
  getPrimaryConversionHref,
  getProgrammeConversionHref,
  getProgrammeConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd, buildServiceJsonLd } from "@/lib/seo/structured-data";
import { getProgrammeOrNotFound } from "../_lib/lookup";

type ProgrammePageParams = { params: Promise<{ slug: string }> };

/** Unknown / malformed slugs must hard-404 — never soft-200 shells. */
export const dynamicParams = false;

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
  const whatsappHref = getProgrammeConversionHref(programme) ?? getPrimaryConversionHref();
  const whatsappLabel = getProgrammeConversionLabel(programme);

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
      <PageWithFooter>
      <main className="flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        />
        <div className="pulse-crumb-bar">
          <PageBreadcrumb items={breadcrumbTrail} />
        </div>
        <LegacyProgrammeNotice
          programme={programme}
          relatedName={related?.name}
          relatedHref={related ? `/programs/${related.slug}` : undefined}
          whatsappHref={whatsappHref}
        />
      </main>
      </PageWithFooter>
    );
  }

  const pageJsonLd = buildWebPageJsonLd({
    name: programme.name,
    description: programme.shortDescription,
    path: `/programs/${programme.slug}`,
  });
  const serviceJsonLd = buildServiceJsonLd(programme);
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

  const helpfulGuides = getGuidesForProgramme(programme.slug).map((guide) => ({
    slug: guide.slug,
    title: guide.title,
  }));

  return (
    <PageWithFooter>
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }}
      />
      {serviceJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
        />
      ) : null}

      <ProgrammeViewTracker name={programme.name} />
      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <ProgrammeDetailView
        programme={programme}
        locations={locations}
        related={related}
        helpfulGuides={helpfulGuides}
        whatsappHref={whatsappHref}
        whatsappLabel={whatsappLabel}
      />
    </main>
    </PageWithFooter>
  );
}
