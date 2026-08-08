import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ConsentDisclosure } from "@/components/member-stories/pulse/ConsentDisclosure";
import { MemberStoriesCta } from "@/components/member-stories/pulse/MemberStoriesCta";
import { MemberStoryEditorial } from "@/components/member-stories/pulse/MemberStoryEditorial";
import { TransformationCaseStudy } from "@/components/member-stories/pulse/TransformationCaseStudy";
import styles from "@/components/member-stories/pulse/member-stories.module.css";
import { RouteOpening, SectionReveal } from "@/components/motion";
import {
  getConfirmedProgrammes,
  getPublishableMemberStories,
  getPublishableTransformations,
  getPubliclyListedBranches,
  getStudioMemberStoriesPage,
  shouldIndexMemberStoriesRoute,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
  SECONDARY_TRIAL_FORM_HREF,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

const PATH = "/transformations";

export function generateMetadata(): Metadata {
  const page = getStudioMemberStoriesPage();
  return buildPageMetadata({
    title: page.pageTitle,
    description: page.seoDescription,
    path: PATH,
    forceNoIndex: !shouldIndexMemberStoriesRoute(),
  });
}

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Member Stories", path: PATH },
];

function deliveryLabel(mode: string | undefined): string {
  if (mode === "home") return "Home";
  if (mode === "online") return "Online";
  return "In studio";
}

/**
 * Honest Member Stories route — URL remains /transformations.
 * Renders publishable evidence only; never mock fixtures (ADR-022).
 */
export default function MemberStoriesPage() {
  const page = getStudioMemberStoriesPage();
  const stories = getPublishableMemberStories();
  const transformations = getPublishableTransformations();
  const programmes = getConfirmedProgrammes();
  const branches = getPubliclyListedBranches();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: page.seoTitle,
    description: page.seoDescription,
    path: PATH,
  });

  const hasPublishable = stories.length > 0 || transformations.length > 0;

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

      <section className={styles.band} aria-labelledby="stories-title">
        <RouteOpening>
          <div className={styles.openGrid}>
            <div className={styles.openMeasure}>
              <p className={styles.kicker}>Member Stories</p>
              <h1 id="stories-title" className={styles.title}>
                {page.headline}
              </h1>
              <p className={styles.lede}>{page.lede}</p>
            </div>
          </div>
        </RouteOpening>
      </section>

      <section className={styles.band} aria-labelledby="consent-title">
        <SectionReveal>
          <h2 id="consent-title" className={styles.sectionTitle}>
            {page.consentTitle}
          </h2>
          <p className={styles.body}>{page.consentBody}</p>
          <ConsentDisclosure>
            Individual experiences vary. We do not promise specific results.
          </ConsentDisclosure>
        </SectionReveal>
      </section>

      {hasPublishable ? (
        <section className={styles.band} aria-labelledby="published-stories-title">
          <SectionReveal>
            <h2 id="published-stories-title" className={styles.sectionTitle}>
              Published stories
            </h2>
            <ul className={styles.storyList}>
              {stories.map((story) => (
                <li key={story.id}>
                  <MemberStoryEditorial story={story} />
                </li>
              ))}
              {transformations.map((item) => (
                <li key={item.id}>
                  <TransformationCaseStudy item={item} />
                </li>
              ))}
            </ul>
          </SectionReveal>
        </section>
      ) : (
        <section className={styles.band} aria-label="Stories update">
          <p className={styles.readinessNote}>{page.readinessBody}</p>
        </section>
      )}

      <section className={styles.band} aria-labelledby="stories-discover-title">
        <SectionReveal>
          <h2 id="stories-discover-title" className={styles.sectionTitle}>
            What you can explore today
          </h2>
          <div className={styles.pairGrid}>
            <div>
              <h3 className={styles.kicker}>{page.programmesTitle}</h3>
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
            </div>
            <div>
              <h3 className={styles.kicker}>{page.branchesTitle}</h3>
              <p className={styles.body}>{page.branchesBody}</p>
              <ul className={styles.linkList}>
                {branches.map((branch) => (
                  <li key={branch.slug}>
                    <Link href={`/locations/${branch.slug}`}>{branch.locality}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section className={styles.band} aria-labelledby="stories-cta-title">
        <SectionReveal>
          <h2 id="stories-cta-title" className={styles.sectionTitle}>
            {page.ctaTitle}
          </h2>
          <p className={styles.body}>{page.ctaBody}</p>
          <div className={styles.ctaRow}>
            <MemberStoriesCta href={trialHref}>{trialLabel}</MemberStoriesCta>
            <Link href={SECONDARY_TRIAL_FORM_HREF} className={styles.ctaSecondary}>
              Prefer the trial form
            </Link>
          </div>
          <p className={styles.ctaNote}>
            Opening WhatsApp starts a chat — it does not mean your enquiry was submitted.
          </p>
        </SectionReveal>
      </section>
    </main>
  );
}
