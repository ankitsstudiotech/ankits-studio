"use client";

import { useActionState } from "react";
import { Field, TextInput, TextTextarea } from "@/components/forms/Field";
import { Button } from "@/components/ui/Button";
import { submitContactInquiry, type ContactFormState } from "./actions";

const initialState: ContactFormState = null;

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactInquiry, initialState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field id="name" label="Name" error={fieldErrors.name}>
        <TextInput
          id="name"
          name="name"
          autoComplete="name"
          required
          invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
      </Field>
      <Field id="phone" label="Phone" error={fieldErrors.phone}>
        <TextInput
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
        />
      </Field>
      <Field id="email" label="Email (optional)" error={fieldErrors.email}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
      </Field>
      <Field id="message" label="Message" error={fieldErrors.message}>
        <TextTextarea
          id="message"
          name="message"
          rows={5}
          required
          invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
      </Field>
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(fieldErrors.consent) || undefined}
          aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
          className="mt-1 size-5 rounded border-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <label htmlFor="consent" className="text-sm text-ink">
          I agree to be contacted about this inquiry. I understand messages are not delivered
          live unless a provider is configured.
        </label>
      </div>
      {fieldErrors.consent ? (
        <p id="consent-error" role="alert" className="-mt-3 text-sm text-accent-strength">
          {fieldErrors.consent}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
