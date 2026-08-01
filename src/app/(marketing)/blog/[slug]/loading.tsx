import { Container } from "@/components/ui/Container";

export default function BlogPostLoading() {
  return (
    <main className="flex flex-1 flex-col" aria-busy="true" aria-live="polite">
      <Container className="pt-8">
        <div className="h-4 w-48 animate-pulse rounded-[var(--radius-sm)] bg-surface-sunken" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded-[var(--radius-sm)] bg-surface-sunken" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-[var(--radius-sm)] bg-surface-sunken" />
      </Container>
    </main>
  );
}
