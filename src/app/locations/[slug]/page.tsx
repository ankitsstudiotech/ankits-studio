import Link from "next/link";
import type { Metadata } from "next";
import { BranchDetailView } from "@/components/locations/pulse/BranchDetailView";
import { Container } from "@/components/ui/Container";
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
import { getBranchOrNotFound } from "../_lib/lookup";

type LocationPageParams = { params: Promise<{ slug: string }> };

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
          (programme.deliveryMode === "home" || programme.deliveryMode === "online") &&
          programme.taxonomyStatus === "confirmed",
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
    <main className="flex flex-1 flex-col">
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
              <Link href="/locations" className="hover:text-ink">
                Locations
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink break-words">
              {branch.locality}
            </li>
          </ol>
        </nav>
      </Container>

      <BranchDetailView
        branch={branch}
        physicalProgrammes={physicalProgrammes}
        otherProgrammes={otherProgrammes}
        mapsUrl={mapsUrl}
        whatsappHref={whatsappHref}
        whatsappLabel={whatsappLabel}
      />
    </main>
  );
}
