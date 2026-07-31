import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Body, Heading } from "@/components/ui/Typography";

export default function ProgrammeNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Container narrow>
        <Heading as="h1" className="mb-3">
          Programme not found
        </Heading>
        <Body className="mb-6">This programme doesn&apos;t exist or may have moved.</Body>
        <Link href="/programs" className="text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent">
          Browse all programmes
        </Link>
      </Container>
    </main>
  );
}
