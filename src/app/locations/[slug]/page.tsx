import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { BranchDetailView } from "@/components/locations/pulse/BranchDetailView";
import {
  getBranchMapsUrl,
  getBranchPhysicalProgrammes,
  getBranches,
  getProgrammeBySlug,
} from "@/content";
import type { Programme } from "@/content";
import {
  buildWhatsAppTrialUrl,
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";
import { BranchViewTracker } from "@/components/analytics/AnalyticsPageTracker";
import { getBranchOrNotFound } from "../_lib/lookup";

type LocationPageParams = { params: Promise<{ slug: string }> };

/** Unknown / malformed branch slugs must hard-404 — never soft-200 shells. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getBranches().map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: LocationPageParams): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchOrNotFound(slug);
  return buildPageMetadata({
    title: branch.seoTitle,
    description: branch.seoDescription,
    path: `/locations/${branch.slug}`,
  });
}

export default async function LocationDetailPage({ params }: LocationPageParams) {
  const { slug } = await params;
  const branch = getBranchOrNotFound(slug);
  const mapsUrl = getBranchMapsUrl(branch);
  const physicalProgrammes = getBranchPhysicalProgrammes(branch);
  const otherProgrammes = (branch.relatedProgrammeSlugs ?? [])
    .map((programmeSlug) => getProgrammeBySlug(programmeSlug))
    .filter((programme): programme is Programme =>
      Boolean(
        programme &&
          programme.taxonomyStatus === "confirmed" &&
          (programme.deliveryMode === "home" ||
            programme.deliveryMode === "online" ||
            programme.slug === "corporate-wellness"),
      ),
    );

  const whatsappHref =
    buildWhatsAppTrialUrl({ preferredBranch: branch.locality }) ?? getPrimaryConversionHref();
  const whatsappLabel = getPrimaryConversionLabel();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: branch.locality, path: `/locations/${branch.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: branch.name,
    description: branch.seoDescription,
    path: `/locations/${branch.slug}`,
  });
  const localBusinessJsonLd = buildLocalBusinessJsonLd(branch);

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
      {localBusinessJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd) }}
        />
      ) : null}

      <BranchViewTracker name={branch.locality} />
      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <BranchDetailView
        branch={branch}
        physicalProgrammes={physicalProgrammes}
        otherProgrammes={otherProgrammes}
        mapsUrl={mapsUrl}
        whatsappHref={whatsappHref}
        whatsappLabel={whatsappLabel}
      />
    </main>
    </PageWithFooter>
  );
}
