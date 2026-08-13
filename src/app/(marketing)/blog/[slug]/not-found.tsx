import Link from "next/link";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { Container } from "@/components/ui/Container";
import { Body, Heading } from "@/components/ui/Typography";

export default function BlogNotFound() {
  return (
    <PageWithFooter>
    <main className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Container narrow>
        <Heading as="h1" className="mb-3">
          Article not found
        </Heading>
        <Body className="mb-6">This sample article doesn&apos;t exist or may have moved.</Body>
        <Link
          href="/blog"
          className="text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent"
        >
          Back to blog
        </Link>
      </Container>
    </main>
    </PageWithFooter>
  );
}
