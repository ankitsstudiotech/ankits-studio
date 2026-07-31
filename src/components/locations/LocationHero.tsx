import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Body, HeroHeading, Overline } from "@/components/ui/Typography";
import { FieldDisclaimer, PendingValue } from "./PendingValue";
import { isToBeConfirmed, type MediaProps } from "./types";

export type LocationHeroProps = {
  name: string;
  areaLabel: string;
  address: string;
  shortBlurb?: string;
  media?: MediaProps | null;
  primaryCta?: { label: string; href: string };
  disclaimer?: string;
};

export function LocationHero({
  name,
  areaLabel,
  address,
  shortBlurb,
  media,
  primaryCta = { label: "Book a trial", href: "/trial" },
  disclaimer,
}: LocationHeroProps) {
  const addressPending = isToBeConfirmed(address);

  return (
    <section className="border-b border-border">
      <Container className="grid items-center gap-10 py-[var(--spacing-section)] lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <Overline className="mb-3">Location</Overline>
          <Badge accent="neutral" className="mb-4">
            {areaLabel}
          </Badge>
          <HeroHeading className="max-w-2xl break-words">{name}</HeroHeading>
          <PendingValue
            value={address}
            as="address"
            className="mt-5 block max-w-xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] not-italic"
          />
          {shortBlurb && !isToBeConfirmed(shortBlurb) ? (
            <Body size="lg" className="mt-4 max-w-xl">
              {shortBlurb}
            </Body>
          ) : null}
          {addressPending ? (
            <FieldDisclaimer className="mt-3">
              Printable address is not confirmed for publication yet.
            </FieldDisclaimer>
          ) : null}
          {disclaimer ? <FieldDisclaimer className="mt-3">{disclaimer}</FieldDisclaimer> : null}
          <div className="mt-8">
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-accent px-6 text-base font-semibold text-accent-foreground touch-target hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            >
              {primaryCta.label}
            </Link>
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
            placeholderLabel={media.placeholderLabel ?? "Branch media"}
            className="shadow-[var(--shadow-lift)]"
          />
        ) : (
          <div
            className="flex min-h-64 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-sunken px-6 text-center text-ink-muted"
            role="img"
            aria-label="Branch photography placeholder"
          >
            Branch photography to be confirmed
          </div>
        )}
      </Container>
    </section>
  );
}
