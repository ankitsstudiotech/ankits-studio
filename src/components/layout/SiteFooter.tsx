import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterLinkGroup } from "./types";

export type SiteFooterProps = {
  brandName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  groups: FooterLinkGroup[];
  copyright?: string;
};

const SYMBOL_SRC = "/brand/ankits-studio-symbol-transparent.png";

/**
 * Dark Pulse footer — brand column + explore/branches.
 * Mobile (≤640px): brand block, then Explore + Branches in a compact two-column grid.
 * Desktop: approved three-column layout unchanged in spirit.
 */
export function SiteFooter({
  brandName = "Ankit's Studio",
  tagline = "Strength, yoga, dance — one neighbourhood studio across Navi Mumbai.",
  phone,
  email,
  groups,
  copyright = `© ${new Date().getFullYear()} Ankit's Studio`,
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-field text-ink-inverse">
      <Container className="py-[var(--spacing-section)] max-[640px]:py-10">
        <div className="grid gap-10 max-[640px]:gap-8 md:grid-cols-[minmax(0,1.35fr)_repeat(2,minmax(0,1fr))]">
          <div className="max-w-sm max-[640px]:max-w-none">
            <p className="mb-3 flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[length:var(--text-title)] uppercase leading-[var(--text-title--line-height)] tracking-[var(--text-title--letter-spacing)] max-[640px]:mb-2">
              <Image
                src={SYMBOL_SRC}
                alt=""
                width={32}
                height={32}
                className="block h-8 w-8 shrink-0 object-contain"
              />
              {brandName}
            </p>
            <p className="mb-4 text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-[var(--color-muted-on-field)] max-[640px]:mb-3 max-[640px]:max-w-[36ch]">
              {tagline}
            </p>
            {phone ? (
              <p className="mb-1">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-11 items-center text-sm text-ink-inverse underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                >
                  {phone}
                </a>
              </p>
            ) : null}
            {email ? (
              <p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center text-sm text-[var(--color-muted-on-field)] underline-offset-4 hover:text-ink-inverse hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                >
                  {email}
                </a>
              </p>
            ) : null}
          </div>

          <div className="contents max-[640px]:grid max-[640px]:grid-cols-2 max-[640px]:gap-x-6 max-[640px]:gap-y-1 max-[640px]:col-span-full">
            {groups.map((group) => (
              <div key={group.title} className="max-[640px]:min-w-0">
                <p className="mb-3 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-[var(--color-muted-on-field)] max-[640px]:mb-2">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-1 max-[640px]:gap-0">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="-mx-2 inline-flex min-h-11 min-w-11 items-center px-2 text-sm text-[var(--color-muted-on-field)] transition-colors hover:text-ink-inverse focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-volt)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border-on-field)] pt-6 max-[640px]:mt-8 max-[640px]:pt-5">
          <p className="text-xs text-[var(--color-muted-on-field)]">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
