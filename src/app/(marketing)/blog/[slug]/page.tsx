import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption, HeroHeading } from "@/components/ui/Typography";
import { getBlogPostBySlug, getBlogPosts } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

type BlogPostParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: "Article not found",
      description: "This sample article could not be found.",
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

export default async function BlogPostPage({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  // Article JSON-LD only emits for verified posts — sample/mock stays omitted.
  const articleJsonLd = buildArticleJsonLd(post);

  return (
    <main className="flex flex-1 flex-col">
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

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section eyebrow="Sample article" title={post.title} narrow>
        <Badge accent="neutral" className="mb-4">
          Sample · noindex
        </Badge>
        <HeroHeading as="h1" className="mb-3 break-words">
          {post.title}
        </HeroHeading>
        <Caption className="mb-6">{post.publishedAt}</Caption>
        {post.dataStatus !== "verified" ? (
          <Caption className="mb-6 block rounded-[var(--radius-sm)] bg-accent-soft/70 px-3 py-2 text-ink">
            {post.mockDisclaimer}
          </Caption>
        ) : null}
        <Body size="lg" className="mb-6">
          {post.excerpt}
        </Body>
        <div className="flex flex-col gap-4 whitespace-pre-line">
          {post.body.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <Body key={`${post.slug}-${index}`}>{paragraph}</Body>
            ) : (
              <span key={`${post.slug}-break-${index}`} className="block h-2" aria-hidden />
            )
          )}
        </div>
      </Section>
    </main>
  );
}
