import { Section } from "@/components/ui/Section";
import { Body, Caption } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { ContactAction } from "./types";

export type ContactActionGroupProps = {
  actions: ContactAction[];
  title?: string;
  description?: string;
  disclaimer?: string;
};

/**
 * Phone / WhatsApp / directions actions. Disabled (not linked) when href is
 * null — never invents live tel:/wa.me URLs (ADR-011).
 */
export function ContactActionGroup({
  actions,
  title = "Contact this branch",
  description = "Live call and chat links appear only after branch contact details are verified.",
  disclaimer,
}: ContactActionGroupProps) {
  return (
    <Section id="contact-actions" eyebrow="Contact" title={title} description={description}>
      {actions.length === 0 ? (
        <Body>Contact options to be confirmed.</Body>
      ) : (
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {actions.map((action) => {
            const enabled = Boolean(action.href);
            const className = [
              "inline-flex min-h-12 min-w-[11rem] items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-semibold touch-target",
              "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
              enabled
                ? "bg-accent text-accent-foreground hover:bg-accent-hover"
                : "cursor-not-allowed border border-border bg-surface-sunken text-ink-muted",
            ].join(" ");

            return (
              <li key={action.id}>
                {enabled ? (
                  <a
                    href={action.href!}
                    className={className}
                    {...(action.kind === "whatsapp"
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {action.label}
                  </a>
                ) : (
                  <span className={className} aria-disabled="true" title="To be confirmed">
                    {action.label}
                    <span className="sr-only"> — to be confirmed</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Caption className="mt-4">
        Disabled actions mean the underlying number or map link is not verified for publication.
      </Caption>
      {disclaimer ? <FieldDisclaimer className="mt-2">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
