import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

/**
 * Shared breadcrumb — utility surface chrome, sentence-case labels.
 */
export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Container className="py-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-sans)] text-[length:var(--text-caption)] text-ink-muted">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {isLast || !item.path ? (
                  <span aria-current={isLast ? "page" : undefined} className="text-ink break-words">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
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
