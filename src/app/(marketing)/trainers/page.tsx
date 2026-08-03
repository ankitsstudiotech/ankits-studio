import type { Metadata } from "next";
import Link from "next/link";
import { PulseMediaPlate } from "@/components/home/pulse/PulseMotion";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PublishableTrainerList } from "@/components/trainers/pulse/PublishableTrainerList";
import styles from "@/components/trainers/pulse/trainers.module.css";
import {
  getConfirmedProgrammes,
  getPublishableTrainers,
  getPubliclyListedBranches,
  getStudioTrainersPage,
  shouldIndexTrainersRoute,
  siteHasUnverifiedContent,
} from "@/content";
import {
  buildWhatsAppTrainerAvailabilityUrl,
  getPrimaryConversionHref,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/trainers";

export function generateMetadata(): Metadata {
  const page = getStudioTrainersPage();
  return buildPageMetadata({
    title: page.pageTitle,
    description: page.seoDescription,
    path: PATH,
    forceNoIndex: !shouldIndexTrainersRoute(),
  });
}

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Trainers", path: PATH },
];

function deliveryLabel(mode: string | undefined): string {
  if (mode === "home") return "Home";
  if (mode === "online") return "Online";
  return "In studio";
}

/**
 * Honest team page — no fake profile grid.
 * Individual profiles render only when publishable (ADR-019).
 */
export default function TrainersIndexPage() {
  const page = getStudioTrainersPage();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const publishable = getPublishableTrainers();
  const showDevPending = siteHasUnverifiedContent;
  const enquiryHref =
    buildWhatsAppTrainerAvailabilityUrl() ?? getPrimaryConversionHref();

  const physical = programmes.filter((p) => p.deliveryMode === "in-studio");
  const delivery = programmes.filter(
    (p) => p.deliveryMode === "home" || p.deliveryMode === "online",
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: page.seoTitle,
    description: page.seoDescription,
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

      <div className={styles.crumbBar}>
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="trainers-title">
        <p className={styles.kicker}>Training team</p>
        <h1 id="trainers-title" className={styles.title}>
          {page.headline}
        </h1>
        <p className={styles.lede}>{page.lede}</p>
        <div className={styles.mediaWrap}>
          <PulseMediaPlate
            slotKey="about.team"
            family="warm"
            label="Team photograph placeholder — real photography pending"
            aspect="16/9"
          />
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="trainers-size-title">
        <h2 id="trainers-size-title" className={styles.sectionTitle}>
          Team size
        </h2>
        <div className={styles.teamBlock}>
          <p className={styles.kicker}>Owner-provided</p>
          <p className={styles.teamCount}>{page.teamSizeLabel}</p>
          <p className={styles.body}>{page.teamSizeBody}</p>
          <p className={styles.provenance}>{page.teamSizeProvenanceNote}</p>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="trainers-programmes-title">
        <h2 id="trainers-programmes-title" className={styles.sectionTitle}>
          {page.programmesTitle}
        </h2>
        <p className={styles.body}>{page.programmesBody}</p>
        <ul className={styles.linkList}>
          {programmes.map((programme) => (
            <li key={programme.slug}>
              <Link href={`/programs/${programme.slug}`}>
                <span>{programme.name}</span>
                <span className={styles.linkMeta}>{deliveryLabel(programme.deliveryMode)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mediaWrap}>
          <PulseMediaPlate
            slotKey="trainers.coaching-action"
            family="strength"
            label="Coaching in action placeholder — real photography pending"
            aspect="16/9"
          />
        </div>
      </section>

      <section className={styles.band} aria-labelledby="trainers-branches-title">
        <h2 id="trainers-branches-title" className={styles.sectionTitle}>
          {page.branchesTitle}
        </h2>
        <p className={styles.body}>{page.branchesBody}</p>
        <ul className={styles.branchList}>
          {branches.map((branch) => (
            <li key={branch.slug}>
              <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="trainers-readiness-title">
        <h2 id="trainers-readiness-title" className={styles.sectionTitle}>
          {page.readinessTitle}
        </h2>
        <div className={styles.readinessBox}>
          <p className={styles.body}>{page.readinessBody}</p>
          {publishable.length > 0 ? (
            <PublishableTrainerList trainers={publishable} enableProfileLinks={false} />
          ) : null}
          {showDevPending && publishable.length === 0 && page.readinessBodyMockPreview ? (
            <p className={styles.devPending} data-trainers-pending="profiles">
              {page.readinessBodyMockPreview}
            </p>
          ) : null}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="trainers-discover-title">
        <h2 id="trainers-discover-title" className={styles.sectionTitle}>
          Explore programmes and studios
        </h2>
        <div className={styles.linkColumns}>
          <div>
            <p className={styles.kicker}>Programmes</p>
            <ul className={styles.linkList}>
              {physical.map((programme) => (
                <li key={programme.slug}>
                  <Link href={`/programs/${programme.slug}`}>{programme.name}</Link>
                </li>
              ))}
            </ul>
            {delivery.length > 0 ? (
              <>
                <p className={styles.kicker} style={{ marginTop: "1.1rem" }}>
                  Home &amp; online
                </p>
                <ul className={styles.linkList}>
                  {delivery.map((programme) => (
                    <li key={programme.slug}>
                      <Link href={`/programs/${programme.slug}`}>{programme.name}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className={styles.moreLink}>
              <Link href="/programs">Explore Programmes</Link>
            </p>
          </div>
          <div>
            <p className={styles.kicker}>Locations</p>
            <ul className={styles.linkList}>
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                </li>
              ))}
            </ul>
            <p className={styles.moreLink}>
              <Link href="/locations">Find a Studio</Link>
            </p>
            <p className={styles.moreLink}>
              <Link href="/about">About Ankit’s Studio</Link>
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${styles.band} ${styles.bandNarrow} ${styles.ctaBand}`}
        aria-labelledby="trainers-cta-title"
      >
        <h2 id="trainers-cta-title" className={styles.sectionTitle}>
          Ask about availability
        </h2>
        <p className={styles.body}>
          Enquire on WhatsApp about training availability for your preferred branch and programme.
          We do not assign a named trainer in this message.
        </p>
        <div className={styles.ctaRow}>
          <a
            className={styles.cta}
            href={enquiryHref}
            {...(enquiryHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Ask about trainer and programme availability on WhatsApp
          </a>
          <Link className={styles.ctaSecondary} href="/programs">
            Explore Programmes
          </Link>
        </div>
        <p className={styles.ctaNote}>
          Opening WhatsApp starts a chat — it does not mean your enquiry was submitted.
        </p>
      </section>
    </main>
  );
}
