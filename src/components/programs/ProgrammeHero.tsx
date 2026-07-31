import Link from "next/link";
import { Badge, type BadgeAccent } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Body, HeroHeading, Overline } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { MediaProps, ProgrammeAccent } from "./types";

export type ProgrammeHeroProps = {
  name: string;
  eyebrow?: string;
  shortDescription: string;
  longDescription?: string;
  accent: ProgrammeAccent;
  audienceTags?: string[];
  media?: MediaProps | null;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  disclaimer?: string;
};

const accentBadge: Record<ProgrammeAccent, BadgeAccent> = {
  strength: "strength",
  calm: "calm",
  "high-energy": "high-energy",
};

const accentRail: Record<ProgrammeAccent, string> = {
  strength: "border-accent-strength",
  calm: "border-accent-calm",
  "high-energy": "border-accent-high-energy",
};

/**
 * Server-rendered programme hero. Headline and copy never depend on JS.
 */
export function ProgrammeHero({
  name,
  eyebrow = "Programme",
  shortDescription,
  longDescription,
  accent,
  audienceTags = [],
  media,
  primaryCta = { label: "Book a trial", href: "/trial" },
  secondaryCta,
  disclaimer,
}: ProgrammeHeroProps) {
  return (
    <section className={["border-b border-border border-l-4", accentRail[accent]].join(" ")}>
      <Container className="grid items-center gap-10 py-[var(--spacing-section)] lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <Overline className="mb-3">{eyebrow}</Overline>
          <Badge accent={accentBadge[accent]} className="mb-4">
            {accent.replace("-", " ")}
          </Badge>
          <HeroHeading className="max-w-2xl break-words">{name}</HeroHeading>
          <Body size="lg" className="mt-5 max-w-xl">
            {shortDescription}
          </Body>
          {longDescription ? (
            <Body className="mt-4 max-w-xl">{longDescription}</Body>
          ) : null}
          {audienceTags.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {audienceTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-[var(--radius-sm)] bg-surface-sunken px-2.5 py-1 text-[length:var(--text-caption)] text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {disclaimer ? <FieldDisclaimer className="mt-4">{disclaimer}</FieldDisclaimer> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-accent px-6 text-base font-semibold text-accent-foreground touch-target hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-raised px-6 text-base font-medium text-ink touch-target hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        {media ? (
          <MediaFrame
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            priority
            sizes="(max-width: 1024px) 100vw, 44vw"
            placeholderLabel={media.placeholderLabel ?? "Replace later"}
            className="shadow-[var(--shadow-lift)]"
          />
        ) : (
          <div
            className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-sunken px-6 text-center text-ink-muted"
            role="img"
            aria-label="Programme media placeholder"
          >
            Media to be confirmed
          </div>
        )}
      </Container>
    </section>
  );
}
