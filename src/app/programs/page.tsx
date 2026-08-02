import Link from "next/link";
import type { Metadata } from "next";
import { ProgrammeDiscovery } from "@/components/programs/pulse/ProgrammeDiscovery";
import { Container } from "@/components/ui/Container";
import { getConfirmedProgrammes } from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/programs";

export const metadata: Metadata = buildPageMetadata({
  title: "Programmes",
  description:
    "Functional Training, Yoga, Zumba, Dance, Wedding Choreography, Home Personal Training and Online Training at Ankit’s Studio — enquire for a free trial on WhatsApp.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Programmes", path: PATH },
];

export default function ProgrammesIndexPage() {
  const programmes = getConfirmedProgrammes();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

  return (
    <main id="programmes-index" className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <Container className="pt-8 pb-2">
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

      <ProgrammeDiscovery
        programmes={programmes}
        trialHref={trialHref}
        trialLabel={trialLabel}
      />
    </main>
  );
}
