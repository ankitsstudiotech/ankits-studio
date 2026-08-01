import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getBlogPosts } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/blog";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Sample blog route architecture for Ankit's Studio. Sample articles are labelled and noindex.",
  path: PATH,
  forceNoIndex: true,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Blog", path: PATH },
];

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Blog"
        title="Studio notes"
        description="Route architecture only. Sample articles are clearly labelled mock content and forced to noindex."
      >
        <Badge accent="neutral" className="mb-6">
          Sample articles · noindex
        </Badge>

        {posts.length === 0 ? (
          <Body>Blog posts are coming soon.</Body>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Card href={`/blog/${post.slug}`} interactive className="h-full">
                  <Badge accent="neutral" className="mb-3">
                    Sample
                  </Badge>
                  <Heading as="h2" className="mb-2 break-words">
                    {post.title}
                  </Heading>
                  <Caption className="mb-3">{post.publishedAt}</Caption>
                  <Body className="mb-3 line-clamp-3">{post.excerpt}</Body>
                  {post.dataStatus !== "verified" ? (
                    <Caption className="text-ink-subtle">{post.mockDisclaimer}</Caption>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Body className="mt-8">
          Looking for classes instead? <Link href="/programs" className="text-accent underline-offset-4 hover:underline">Browse programmes</Link>.
        </Body>
      </Section>
    </main>
  );
}
