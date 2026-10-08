import type { Metadata } from "next";
import { GarbaNightView } from "@/components/events";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { getGarbaNight2026 } from "@/content";
import { getGarbaMediaAvailability } from "@/content/events/media-availability";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildGarbaNightEventJsonLd,
} from "@/lib/seo/structured-data";

const event = getGarbaNight2026();

export const metadata: Metadata = buildPageMetadata({
  title: event.seoTitle,
  description: event.seoDescription,
  path: event.path,
  ogImagePath: `${event.path}/opengraph-image`,
});

export default function GarbaNight2026Page() {
  const media = getGarbaMediaAvailability();
  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Garba Night 2026", path: event.path },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const eventJsonLd = buildGarbaNightEventJsonLd(event);

  return (
    <PageWithFooter>
      <main className="flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        />
        {eventJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(eventJsonLd) }}
          />
        ) : null}

        <div className="pulse-crumb-bar">
          <PageBreadcrumb items={breadcrumbTrail} />
        </div>

        <GarbaNightView event={event} media={media} />
      </main>
    </PageWithFooter>
  );
}
