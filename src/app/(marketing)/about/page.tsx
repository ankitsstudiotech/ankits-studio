import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import styles from "@/components/about/pulse/about.module.css";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioAbout,
  getStudioCommercial,
  siteHasUnverifiedContent,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
  WHATSAPP_REVIEW_HELPER,
} from "@/lib/conversion";
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
 * Founder narrative and founding year are published; certification claims stay unpublished.
 */
export default function AboutPage() {
  const about = getStudioAbout();
  const commercial = getStudioCommercial();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();
  const showDevPending = siteHasUnverifiedContent;

  const physical = programmes.filter((p) => p.deliveryMode === "in-studio");
  const delivery = programmes.filter(
    (p) => p.deliveryMode === "home" || p.deliveryMode === "online",
  );

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: about.seoTitle,
    description: about.seoDescription,
    path: PATH,
  });

  const showFounder =
    about.founderStoryStatus === "verified" && Boolean(about.founderStory);

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

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-title">
        <p className={styles.kicker}>About Ankit’s Studio</p>
        <h1 id="about-title" className={styles.title}>
          {about.headline}
        </h1>
        <p className={styles.lede}>{about.lede}</p>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-approach-title">
        <h2 id="about-approach-title" className={styles.sectionTitle}>
          {about.approachTitle}
        </h2>
        {commercial.differentiator ? (
          <p className={styles.lede} style={{ marginBottom: "0.85rem" }}>
            {commercial.differentiator}
          </p>
        ) : null}
        <p className={styles.body}>{about.approachBody}</p>
      </section>

      {showFounder && about.founderStory ? (
        <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-founder-title">
          <h2 id="about-founder-title" className={styles.sectionTitle}>
            Founder
          </h2>
          {about.foundingDateLabel ? (
            <p className={styles.kicker}>Founded {about.foundingDateLabel}</p>
          ) : null}
          <p className={styles.body}>{about.founderStory}</p>
          <p className={styles.provenance}>
            Founder: Ankit Nalawade. Individual certification details are not listed on this page.
          </p>
        </section>
      ) : showDevPending ? (
        <section className={`${styles.band} ${styles.bandNarrow}`}>
          <p className={styles.devPending} data-about-pending="founder">
            Founder story will appear here once it is ready to publish.
          </p>
        </section>
      ) : null}

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-disciplines-title">
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
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-branches-title">
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
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-team-title">
        <h2 id="about-team-title" className={styles.sectionTitle}>
          {about.teamTitle}
        </h2>
        <div className={styles.teamBlock}>
          <p className={styles.kicker}>Team size</p>
          <p className={styles.teamCount}>15+</p>
          <p className={styles.body}>{about.teamBody}</p>
          <p className={styles.provenance}>{about.teamCountProvenance}</p>
        </div>
      </section>

      {about.faqs.length > 0 ? (
        <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="about-faq-title">
          <h2 id="about-faq-title" className={styles.sectionTitle}>
            FAQ
          </h2>
          <ul className={styles.faqList}>
            {about.faqs.map((item) => (
              <li key={item.id}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.band} aria-labelledby="about-discover-title">
        <h2 id="about-discover-title" className={styles.sectionTitle}>
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
          </div>
        </div>
      </section>

      <section
        className={`${styles.band} ${styles.bandNarrow} ${styles.ctaBand}`}
        aria-labelledby="about-cta-title"
      >
        <h2 id="about-cta-title" className={styles.sectionTitle}>
          Book a free trial
        </h2>
        <p className={styles.body}>
          Try a session at a neighbourhood branch. Tell us your preferred branch, service and time on
          WhatsApp.
        </p>
        <div className={styles.ctaRow}>
          <a
            className={styles.cta}
            href={trialHref}
            {...(trialHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {trialLabel}
          </a>
          <Link className={styles.ctaSecondary} href="/programs">
            Explore Programmes
          </Link>
          <Link className={styles.ctaSecondary} href="/locations">
            Find a Studio
          </Link>
        </div>
        <p className={styles.ctaNote}>{WHATSAPP_REVIEW_HELPER}</p>
      </section>
    </main>
  );
}
