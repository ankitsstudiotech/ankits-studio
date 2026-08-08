import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/blog/pulse/studio-notes.module.css";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RouteOpening, SectionReveal } from "@/components/motion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const PATH = "/blog";

export const metadata: Metadata = buildPageMetadata({
  title: "Studio Notes",
  description:
    "Studio Notes from Ankit’s Studio. Explore programmes, neighbourhood studios and batch availability.",
  path: PATH,
  forceNoIndex: true,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Studio Notes", path: PATH },
];

/**
 * Concise noindex Studio Notes hub — no sample article cards (ADR-023).
 */
export default function BlogIndexPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: "Studio Notes | Ankit’s Studio",
    description:
      "Studio Notes from Ankit’s Studio. Explore programmes, neighbourhood studios and batch availability.",
    path: PATH,
  });

  return (
    <main className={`${styles.page} flex flex-1 flex-col`}>
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

      <section className={styles.band} aria-labelledby="blog-title">
        <RouteOpening>
          <div className={styles.openMeasure}>
            <p className={styles.kicker}>Studio Notes</p>
            <h1 id="blog-title" className={styles.title}>
              Studio Notes
            </h1>
            <p className={styles.lede}>
              We’ll use this space for practical studio updates and training guidance.
            </p>
          </div>
        </RouteOpening>
      </section>

      <section className={styles.band} aria-labelledby="blog-explore-title">
        <SectionReveal>
          <h2 id="blog-explore-title" className={styles.sectionTitle}>
            Explore the studio
          </h2>
          <p className={styles.body}>
            Meanwhile, find a programme, neighbourhood studio, or batch time that suits you.
          </p>
          <ul className={styles.linkList}>
            <li>
              <Link href="/programs">Programmes</Link>
            </li>
            <li>
              <Link href="/locations">Locations</Link>
            </li>
            <li>
              <Link href="/timetable">Batch availability</Link>
            </li>
          </ul>
        </SectionReveal>
      </section>
    </main>
  );
}
