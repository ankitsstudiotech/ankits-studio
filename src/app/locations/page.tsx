import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { LocationDiscovery } from "@/components/locations/pulse/LocationDiscovery";
import { getPubliclyListedBranches } from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/locations";

const PAGE_DESCRIPTION =
  "Four Ankit’s Studio branches in Airoli Sector 19, Airoli Sector 8, Ghansoli, and Thane. Enquire on WhatsApp for a free trial and current batch availability.";

export const metadata: Metadata = buildPageMetadata({
  title: "Locations",
  description: PAGE_DESCRIPTION,
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Locations", path: PATH },
];

export default function LocationsIndexPage() {
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Locations",
    description: PAGE_DESCRIPTION,
    path: PATH,
  });
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

  return (
    <PageWithFooter>
    <main id="locations-index" className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
      />

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <LocationDiscovery
        branches={branches}
        trialHref={trialHref}
        trialLabel={trialLabel}
      />
    </main>
    </PageWithFooter>
  );
}
