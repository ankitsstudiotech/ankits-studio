import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { GuidesIndexView } from "@/components/guides/GuidesIndexView";
import { RouteOpening } from "@/components/motion";
import { getPublishedGuides } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import styles from "@/components/guides/guides.module.css";

const PATH = "/guides";

const CLUSTER_ORDER = [
  "Zumba",
  "Functional Training",
  "Wedding & Sangeet",
  "Personal Training",
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Guides — Zumba, Training & Wedding Choreography",
  description:
    "Practical guides from Ankit’s Studio on Zumba, functional training, wedding choreography and home personal training — written to help you choose with clarity.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Guides", path: PATH },
];

export default function GuidesIndexPage() {
  const guides = getPublishedGuides();
  const clusters = CLUSTER_ORDER.map((label) => ({
    label,
    guides: guides.filter((guide) => guide.clusterLabel === label),
  })).filter((cluster) => cluster.guides.length > 0);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: "Guides | Ankit’s Studio",
    description:
      "Practical guides on Zumba, training formats, wedding choreography and home coaching.",
    path: PATH,
  });

  return (
    <PageWithFooter>
      <main className={`${styles.page} flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }}
        />

        <div className="pulse-crumb-bar">
          <PageBreadcrumb items={breadcrumbTrail} />
        </div>

        <RouteOpening>
          <GuidesIndexView clusters={clusters} />
        </RouteOpening>
      </main>
    </PageWithFooter>
  );
}
