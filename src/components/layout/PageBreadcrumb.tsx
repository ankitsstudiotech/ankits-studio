import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

export function PageBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <Container className="pt-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
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
                  <Link href={item.path} className="hover:text-ink">
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
