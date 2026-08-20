import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { ProgrammeDiscovery } from "@/components/programs/pulse/ProgrammeDiscovery";
import { getConfirmedProgrammes } from "@/content";
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

const PATH = "/programs";

const PAGE_DESCRIPTION =
  "Functional Training, Yoga, Zumba, Dance, Wedding Choreography, Corporate Wellness, Home Personal Training and Online Training at Ankit’s Studio — enquire for a free trial on WhatsApp.";

export const metadata: Metadata = buildPageMetadata({
  title: "Programmes — fitness, yoga, Zumba & dance",
  description: PAGE_DESCRIPTION,
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Programmes", path: PATH },
];

export default function ProgrammesIndexPage() {
  const programmes = getConfirmedProgrammes();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: "Programmes",
    description: PAGE_DESCRIPTION,
    path: PATH,
    itemList: programmes.map((programme) => ({
      name: programme.name,
      path: `/programs/${programme.slug}`,
    })),
  });
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

  return (
    <PageWithFooter>
    <main id="programmes-index" className="flex flex-col">
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

      <ProgrammeDiscovery
        programmes={programmes}
        trialHref={trialHref}
        trialLabel={trialLabel}
      />
    </main>
    </PageWithFooter>
  );
}
