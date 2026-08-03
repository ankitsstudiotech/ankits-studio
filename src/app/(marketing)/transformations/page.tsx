import type { Metadata } from "next";
import Link from "next/link";
import { PulseMediaPlate } from "@/components/home/pulse/PulseMotion";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { ConsentDisclosure } from "@/components/member-stories/pulse/ConsentDisclosure";
import { MemberStoriesCta } from "@/components/member-stories/pulse/MemberStoriesCta";
import { MemberStoryEditorial } from "@/components/member-stories/pulse/MemberStoryEditorial";
import { TransformationCaseStudy } from "@/components/member-stories/pulse/TransformationCaseStudy";
import styles from "@/components/member-stories/pulse/member-stories.module.css";
import {
  getConfirmedProgrammes,
  getPublishableMemberStories,
  getPublishableTransformations,
  getPubliclyListedBranches,
  getStudioMemberStoriesPage,
  shouldIndexMemberStoriesRoute,
  siteHasUnverifiedContent,
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
  const showDevPending = siteHasUnverifiedContent;

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

      <div className={styles.crumbBar}>
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="stories-title">
        <p className={styles.kicker}>Member Stories</p>
        <h1 id="stories-title" className={styles.title}>
          {page.headline}
        </h1>
        <p className={styles.lede}>{page.lede}</p>
        <div className={styles.mediaWrap}>
          <PulseMediaPlate
            slotKey="community.group"
            family="warm"
            label="Community photograph placeholder — consented member photography pending"
            aspect="16/9"
          />
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="consent-title">
        <h2 id="consent-title" className={styles.sectionTitle}>
          {page.consentTitle}
        </h2>
        <p className={styles.body}>{page.consentBody}</p>
        <ConsentDisclosure>
          Individual experiences vary. We do not promise specific results.
        </ConsentDisclosure>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="readiness-title">
        <h2 id="readiness-title" className={styles.sectionTitle}>
          {hasPublishable ? "Published stories" : page.readinessTitle}
        </h2>
        {hasPublishable ? (
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
        ) : (
          <div className={styles.readinessBlock}>
            <p className={styles.body}>{page.readinessBody}</p>
            {page.readinessSupporting ? (
              <p className={styles.supporting}>{page.readinessSupporting}</p>
            ) : null}
          </div>
        )}
        {showDevPending && !hasPublishable ? (
          <p className={styles.devPending} data-member-stories-pending="true">
            Development note: no publishable member stories or transformations exist yet. Fictional
            fixtures are isolated and never shown on this route.
          </p>
        ) : null}
      </section>

      <section className={styles.band} aria-labelledby="stories-discover-title">
        <h2 id="stories-discover-title" className={styles.sectionTitle}>
          Explore programmes and branches
        </h2>
        <div className={styles.linkColumns}>
          <div>
            <h3 className={styles.kicker}>{page.programmesTitle}</h3>
            <p className={styles.body}>{page.programmesBody}</p>
            <ul className={styles.linkList}>
              {physical.map((programme) => (
                <li key={programme.slug}>
                  <Link href={`/programs/${programme.slug}`}>
                    <span>{programme.name}</span>
                    <span className={styles.linkMeta}>{deliveryLabel(programme.deliveryMode)}</span>
                  </Link>
                </li>
              ))}
              {delivery.map((programme) => (
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
                  <Link href={`/locations/${branch.slug}`}>
                    <span>{branch.locality}</span>
                    <span className={styles.linkMeta} aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandNarrow}`} aria-labelledby="stories-cta-title">
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
      </section>
    </main>
  );
}
