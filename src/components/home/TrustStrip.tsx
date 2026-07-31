import { Container } from "@/components/ui/Container";
import { Body } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";

export type TrustStripItem = {
  id: string;
  label: string;
};

export type TrustStripProps = {
  items: TrustStripItem[];
  disclaimer?: string;
};

/**
 * Qualitative positioning only — never pass member counts, ratings, or
 * fabricated outcome stats (BUSINESS-DATA-STATUS.md).
 */
export function TrustStrip({ items, disclaimer }: TrustStripProps) {
  return (
    <section
      aria-label="Studio positioning"
      className="border-b border-border bg-surface-raised/70"
    >
      <Container className="py-6 sm:py-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-6">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 sm:gap-6">
              {index > 0 ? (
                <span aria-hidden className="hidden text-border-strong sm:inline">
                  ·
                </span>
              ) : null}
              <Body tone="ink" className="font-medium">
                {item.label}
              </Body>
            </li>
          ))}
        </ul>
        {disclaimer ? (
          <MockDisclaimer className="mt-4 text-center">{disclaimer}</MockDisclaimer>
        ) : null}
      </Container>
    </section>
  );
}
