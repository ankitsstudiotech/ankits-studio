import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "@/components/blog/pulse/studio-notes.module.css";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RouteOpening, SectionReveal } from "@/components/motion";
import { getBlogPostBySlug, getBlogPosts } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

type BlogPostParams = { params: Promise<{ slug: string }> };

/** Unknown/mock slugs must hard-404 — no soft 200 not-found shell (ADR-023). */
export const dynamicParams = false;

/** Only verified posts are statically generated (none today). */
export function generateStaticParams() {
  return getBlogPosts()
    .filter((post) => post.dataStatus === "verified")
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || post.dataStatus !== "verified") {
    return buildPageMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
      forceNoIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    forceNoIndex: true,
  });
}

/**
 * Verified editorial only. Mock/sample fixtures always 404 (ADR-023).
 * Fixtures remain in content for unit tests — they are never rendered.
 */
export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.dataStatus !== "verified") {
    notFound();
  }

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Studio Notes", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  // Article JSON-LD only emits for verified posts (builder already gates).
  const articleJsonLd = buildArticleJsonLd(post);

  return (
    <main className={`${styles.page} flex flex-1 flex-col`}>
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

      <section className={styles.band} aria-labelledby="article-title">
        <RouteOpening>
          <div className={styles.openMeasure}>
            <p className={styles.kicker}>Studio Notes</p>
            <h1 id="article-title" className={styles.title}>
              {post.title}
            </h1>
            <p className={styles.lede}>{post.publishedAt}</p>
          </div>
        </RouteOpening>
      </section>

      <section className={styles.band}>
        <SectionReveal>
          <p className={styles.body}>{post.excerpt}</p>
          <div className="mt-6 flex flex-col gap-4 whitespace-pre-line">
            {post.body.split("\n").map((paragraph, index) =>
              paragraph.trim() ? (
                <p key={`${post.slug}-${index}`} className={styles.body}>
                  {paragraph}
                </p>
              ) : (
                <span key={`${post.slug}-break-${index}`} className="block h-2" aria-hidden />
              ),
            )}
          </div>
        </SectionReveal>
      </section>
    </main>
  );
}
