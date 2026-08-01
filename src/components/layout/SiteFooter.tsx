import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import type { FooterLinkGroup } from "./types";

export type SiteFooterProps = {
  brandName?: string;
  tagline?: string;
  groups: FooterLinkGroup[];
  disclaimer?: string;
};

export function SiteFooter({
  brandName = "Ankit's Studio",
  tagline = "Strength, yoga, dance — one studio community across Navi Mumbai.",
  groups,
  disclaimer = "Design-lab presentation only. Business facts shown here are illustrative placeholders, not verified studio details.",
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-surface-sunken">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Heading as="p" className="mb-3">
              {brandName}
            </Heading>
            <Body>{tagline}</Body>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-subtle">
                {group.title}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="-mx-2 inline-flex min-h-11 min-w-11 items-center px-2 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Caption className="mt-10 max-w-3xl border-t border-border pt-6">{disclaimer}</Caption>
      </Container>
    </footer>
  );
}
