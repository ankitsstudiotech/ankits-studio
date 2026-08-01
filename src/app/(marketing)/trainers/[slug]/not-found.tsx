import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Body, Heading } from "@/components/ui/Typography";

export default function TrainerNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Container narrow>
        <Heading as="h1" className="mb-3">
          Trainer not found
        </Heading>
        <Body className="mb-6">This trainer profile doesn&apos;t exist or may have moved.</Body>
        <Link
          href="/trainers"
          className="text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent"
        >
          Browse all trainers
        </Link>
      </Container>
    </main>
  );
}
