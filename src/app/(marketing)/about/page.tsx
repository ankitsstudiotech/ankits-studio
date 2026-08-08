import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import styles from "@/components/about/pulse/about.module.css";
import { RouteOpening, SectionReveal } from "@/components/motion";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioAbout,
  getStudioCommercial,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
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
 * Founder narrative published when verified; no pending placeholders in production.
 */
export default function AboutPage() {
  const about = getStudioAbout();
  const commercial = getStudioCommercial();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

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

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <section className={styles.band} aria-labelledby="about-title">
        <RouteOpening>
          <div className={styles.openGrid}>
            <div className={styles.openMeasure}>
              <p className={styles.kicker}>About Ankit’s Studio</p>
              <h1 id="about-title" className={styles.title}>
                {about.headline}
              </h1>
              <p className={styles.lede}>{about.lede}</p>
            </div>
            <aside className={styles.openFacts} aria-label="Studio at a glance">
              <p>
                <span className={styles.openFactLabel}>Branches</span>
                <span className={styles.openFactValue}>{branches.length} neighbourhood studios</span>
              </p>
              <p>
                <span className={styles.openFactLabel}>Team</span>
                <span className={styles.openFactValue}>15+ coaches</span>
              </p>
              <p>
                <span className={styles.openFactLabel}>Approach</span>
                <span className={styles.openFactValue}>Machine-free · coach-led</span>
              </p>
              <p>
                <span className={styles.openFactLabel}>Hours</span>
                <span className={styles.openFactValue}>6:00 AM–10:00 PM daily</span>
              </p>
            </aside>
          </div>
        </RouteOpening>
      </section>

      <section className={styles.band} aria-labelledby="about-approach-disciplines">
        <div className={`${styles.diffGrid} pulse-split`}>
          <div>
            <SectionReveal>
              <h2 id="about-approach-disciplines" className={styles.sectionTitle}>
                {about.approachTitle}
              </h2>
            </SectionReveal>
            {commercial.differentiator ? (
              <p className={styles.lede} style={{ marginBottom: "0.85rem" }}>
                {commercial.differentiator}
              </p>
            ) : null}
            <p className={styles.body}>{about.approachBody}</p>
          </div>
          <div>
            <SectionReveal>
              <h2 id="about-disciplines-title" className={styles.sectionTitle}>
                {about.disciplinesTitle}
              </h2>
            </SectionReveal>
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
          </div>
        </div>
      </section>

      {(showFounder && about.founderStory) || branches.length > 0 ? (
        <section
          className={styles.band}
          aria-labelledby={
            showFounder && about.founderStory
              ? "about-founder-title"
              : "about-branches-title"
          }
        >
          <div className={styles.pairGrid}>
            {showFounder && about.founderStory ? (
              <div>
                <SectionReveal>
                  <h2 id="about-founder-title" className={styles.sectionTitle}>
                    Founder
                  </h2>
                </SectionReveal>
                {about.foundingDateLabel ? (
                  <p className={styles.kicker}>Founded {about.foundingDateLabel}</p>
                ) : null}
                <p className={styles.body}>{about.founderStory}</p>
                <p className={styles.provenance}>Founder: Ankit Nalawade.</p>
              </div>
            ) : null}
            <div>
              <SectionReveal>
                <h2 id="about-branches-title" className={styles.sectionTitle}>
                  {about.branchesTitle}
                </h2>
              </SectionReveal>
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
      ) : null}

      <section
        className={styles.band}
        aria-labelledby={
          about.faqs.length > 0 ? "about-faq-title" : "about-team-title"
        }
      >
        <div className={styles.pairGrid}>
          <div className={styles.teamBlock}>
            <SectionReveal>
              <h2 id="about-team-title" className={styles.sectionTitle}>
                {about.teamTitle}
              </h2>
            </SectionReveal>
            <p className={styles.kicker}>Team size</p>
            <p className={styles.teamCount}>15+</p>
            <p className={styles.body}>{about.teamBody}</p>
            <p className={styles.provenance}>{about.teamCountProvenance}</p>
          </div>
          {about.faqs.length > 0 ? (
            <div>
              <SectionReveal>
                <h2 id="about-faq-title" className={styles.sectionTitle}>
                  FAQ
                </h2>
              </SectionReveal>
              <div className="pulse-accordion">
                {about.faqs.map((item) => (
                  <details key={item.id} className="pulse-accordion-item">
                    <summary>{item.question}</summary>
                    <div className="pulse-accordion-panel">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="about-discover-title">
        <SectionReveal>
          <h2 id="about-discover-title" className={styles.sectionTitle}>
            Explore programmes and studios
          </h2>
        </SectionReveal>
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

      <section className={`${styles.band} ${styles.ctaBand}`} aria-labelledby="about-cta-title">
        <SectionReveal>
          <h2 id="about-cta-title" className={styles.sectionTitle}>
            Book a free trial
          </h2>
        </SectionReveal>
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
      </section>
    </main>
  );
}
