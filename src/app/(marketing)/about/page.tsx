import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import styles from "@/components/about/pulse/about.module.css";
import { PulseMedia } from "@/components/media";
import { RouteOpening, SectionReveal } from "@/components/motion";
import { resolveSlotMedia } from "@/content/media";
import {
  getConfirmedProgrammes,
  getPubliclyListedBranches,
  getStudioAbout,
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
 * About — studio philosophy, founder, branches, team.
 * Directories deferred to /programs and /locations.
 */
export default function AboutPage() {
  const about = getStudioAbout();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();
  const communityMedia = resolveSlotMedia("about.community");
  // Founder portrait is verified-real-only — resolve returns null until real asset.
  const founderMedia = resolveSlotMedia("about.founder");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: about.seoTitle,
    description: about.seoDescription,
    path: PATH,
  });

  const showFounder =
    about.founderStoryStatus === "verified" && Boolean(about.founderStory);

  // Keep only FAQs that add something not already on the page.
  const faqs = about.faqs.filter((item) => item.id === "about-faq-machine-free").slice(0, 1);

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
            </aside>
          </div>
        </RouteOpening>
      </section>

      <section className={styles.band} aria-labelledby="about-approach-disciplines">
        <div className={`${styles.diffGrid} pulse-split`}>
          <SectionReveal pattern="B" side="left">
            <h2 id="about-approach-disciplines" className={styles.sectionTitle}>
              {about.approachTitle}
            </h2>
            <p className={styles.body}>{about.approachBody}</p>
          </SectionReveal>
          <SectionReveal pattern="B" side="right">
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
          </SectionReveal>
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
              <div className={styles.founderBlock}>
                <SectionReveal>
                  <h2 id="about-founder-title" className={styles.sectionTitle}>
                    Founder
                  </h2>
                </SectionReveal>
                {about.foundingDateLabel ? (
                  <p className={styles.founderAnchor}>
                    <span className={styles.founderAnchorLabel}>Founded</span>
                    <span className={styles.founderAnchorYear}>{about.foundingDateLabel}</span>
                  </p>
                ) : null}
                <p className={styles.founderName}>Ankit Nalawade · Founder</p>
                {founderMedia ? (
                  <div className={styles.founderMedia}>
                    <PulseMedia item={founderMedia} sizes="280px" />
                  </div>
                ) : null}
                <p className={styles.body}>{about.founderStory}</p>
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

      <section className={styles.band} aria-labelledby="about-team-title">
        {communityMedia ? (
          <div className={styles.communityMedia}>
            <PulseMedia item={communityMedia} sizes="(max-width: 900px) 100vw, 720px" />
          </div>
        ) : null}
        <div className={faqs.length > 0 ? styles.pairGrid : undefined}>
          <div className={styles.teamBlock}>
            <SectionReveal>
              <h2 id="about-team-title" className={styles.sectionTitle}>
                {about.teamTitle}
              </h2>
            </SectionReveal>
            <p className={styles.teamCount}>15+</p>
            <p className={styles.body}>{about.teamBody}</p>
            <p className={styles.provenance}>{about.teamCountProvenance}</p>
          </div>
          {faqs.length > 0 ? (
            <div>
              <SectionReveal>
                <h2 id="about-faq-title" className={styles.sectionTitle}>
                  FAQ
                </h2>
              </SectionReveal>
              <div className="pulse-accordion">
                {faqs.map((item) => (
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
            Next steps
          </h2>
        </SectionReveal>
        <div className={styles.ctaRow}>
          <Link className={styles.ctaSecondary} href="/programs">
            Explore programmes
          </Link>
          <Link className={styles.ctaSecondary} href="/locations">
            Find a studio
          </Link>
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
        </div>
      </section>
    </main>
  );
}
