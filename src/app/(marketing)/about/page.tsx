import type { Metadata } from "next";
import Link from "next/link";
import { PulseMediaPlate } from "@/components/home/pulse/PulseMotion";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import styles from "@/components/about/pulse/about.module.css";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioAbout,
  getStudioCommercial,
} from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/about";

export function generateMetadata(): Metadata {
  const about = getStudioAbout();
  return buildPageMetadata({
    title: about.pageTitle,
    description: about.seoDescription,
    path: PATH,
  });
}

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "About", path: PATH },
];

function deliveryLabel(mode: string | undefined): string {
  if (mode === "home") return "Home";
  if (mode === "online") return "Online";
  return "In studio";
}

/**
 * Honest About page — verified studio story only.
 * Omits founder narrative, founding date, and credentials until owner-confirmed.
 */
export default function AboutPage() {
  const about = getStudioAbout();
  const commercial = getStudioCommercial();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: about.seoTitle,
    description: about.seoDescription,
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

      <PageBreadcrumb items={breadcrumbTrail} />

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-title">
        <p className={styles.kicker}>About Ankit’s Studio</p>
        <h1 id="about-title" className={styles.title}>
          {about.headline}
        </h1>
        <p className={styles.lede}>{about.lede}</p>
        <div className={styles.mediaWrap} style={{ marginTop: "1.5rem" }}>
          <PulseMediaPlate
            slotKey="about.hero"
            family="strength"
            label="Studio atmosphere placeholder — real photography pending"
            aspect="16/9"
          />
        </div>
      </section>

      <section className={styles.band} aria-labelledby="about-approach-title">
        <div className={styles.split}>
          <div className={styles.mediaWrap}>
            <PulseMediaPlate
              slotKey="about.machine-free"
              family="calm"
              label="Machine-free training atmosphere placeholder — real photography pending"
              aspect="16/9"
            />
          </div>
          <div className={styles.splitCopy}>
            <h2 id="about-approach-title" className={styles.sectionTitle}>
              {about.approachTitle}
            </h2>
            {commercial.differentiator ? (
              <p className={styles.lede} style={{ marginBottom: "0.85rem" }}>
                {commercial.differentiator}
              </p>
            ) : null}
            <p className={styles.body}>{about.approachBody}</p>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="about-disciplines-title">
        <h2 id="about-disciplines-title" className={styles.sectionTitle}>
          {about.disciplinesTitle}
        </h2>
        <p className={styles.body}>{about.disciplinesBody}</p>
        <ol className={styles.disciplineIndex}>
          {programmes.map((programme, index) => (
            <li key={programme.slug}>
              <Link href={`/programs/${programme.slug}`}>
                <span>
                  {String(index + 1).padStart(2, "0")} · {programme.name}
                </span>
                <span className={styles.disciplineMeta}>
                  {deliveryLabel(programme.deliveryMode)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className={styles.mediaWrap} style={{ marginTop: "1.5rem" }}>
          <PulseMediaPlate
            slotKey="about.disciplines"
            family="high-energy"
            label="Multi-discipline activity placeholder — real photography pending"
            aspect="16/9"
          />
        </div>
      </section>

      <section className={styles.band} aria-labelledby="about-branches-title">
        <div className={`${styles.split} ${styles.splitReverse}`}>
          <div className={styles.mediaWrap}>
            <PulseMediaPlate
              slotKey="about.branches"
              family="warm"
              label="Neighbourhood branch atmosphere placeholder — real photography pending"
              aspect="16/9"
            />
          </div>
          <div className={styles.splitCopy}>
            <h2 id="about-branches-title" className={styles.sectionTitle}>
              {about.branchesTitle}
            </h2>
            <p className={styles.body}>{about.branchesBody}</p>
            <ul className={styles.branchList}>
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
