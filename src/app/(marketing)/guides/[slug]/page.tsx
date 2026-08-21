import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticleView } from "@/components/guides/GuideArticleView";
import styles from "@/components/guides/guides.module.css";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { RouteOpening } from "@/components/motion";
import {
  getGuideBySlug,
  getProgrammeBySlug,
  getPublishedGuideBySlug,
  getPublishedGuides,
} from "@/content";
import {
  buildWhatsAppGuideEnquiryUrl,
  buildWhatsAppProgrammeEnquiryUrl,
  getPrimaryConversionHref,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildGuideArticleJsonLd } from "@/lib/seo/structured-data";

type GuideParams = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuideParams): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuideBySlug(slug);
  if (!guide) {
    return buildPageMetadata({
      title: "Guide not found",
      description: "This guide could not be found.",
      path: `/guides/${slug}`,
      forceNoIndex: true,
    });
  }

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
  });
}

function resolveGuideCtaHref(guide: NonNullable<ReturnType<typeof getPublishedGuideBySlug>>): string {
  if (guide.ctaKind === "wedding-enquiry" || guide.ctaKind === "home-pt-enquiry") {
    return buildWhatsAppGuideEnquiryUrl(guide.ctaKind) ?? "/contact";
  }
  const programme = getProgrammeBySlug(guide.primaryProgrammeSlug);
  if (programme) {
    return buildWhatsAppProgrammeEnquiryUrl(programme.name) ?? getPrimaryConversionHref();
  }
  return getPrimaryConversionHref();
}

export default async function GuideDetailPage({ params }: GuideParams) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide || guide.dataStatus !== "verified") {
    notFound();
  }

  const programme = getProgrammeBySlug(guide.primaryProgrammeSlug);
  const related = guide.relatedGuideSlugs
    .map((relatedSlug) => getPublishedGuideBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const articleJsonLd = buildGuideArticleJsonLd(guide);
  const ctaHref = resolveGuideCtaHref(guide);

  return (
    <PageWithFooter>
      <main className={`${styles.page} flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        />
        {articleJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
          />
        ) : null}

        <div className="pulse-crumb-bar">
          <PageBreadcrumb items={breadcrumbTrail} />
        </div>

        <RouteOpening>
          <GuideArticleView
            guide={guide}
            related={related}
            programmeName={programme?.name ?? "Programme"}
            programmeHref={`/programs/${guide.primaryProgrammeSlug}`}
            ctaHref={ctaHref}
          />
        </RouteOpening>
      </main>
    </PageWithFooter>
  );
}
