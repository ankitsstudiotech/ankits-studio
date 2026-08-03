import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

/**
 * Shared breadcrumb for the dark `.pulse-crumb-bar` strip.
 * Parent routes must wrap this in `div.pulse-crumb-bar` so ink-inverse /
 * muted-on-field colours read correctly on field (not utility white).
 */
export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Container className="py-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-sans)] text-[length:var(--text-caption)] text-[var(--color-muted-on-field)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden className="text-[var(--color-muted-on-field)] opacity-60">
                    /
                  </span>
                ) : null}
                {isLast || !item.path ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="break-words text-ink-inverse"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="text-[var(--color-muted-on-field)] underline-offset-4 hover:text-ink-inverse hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-volt)]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
