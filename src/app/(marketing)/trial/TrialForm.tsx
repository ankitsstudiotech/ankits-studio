"use client";

import { useActionState } from "react";
import { Field, TextInput, TextSelect, TextTextarea } from "@/components/forms/Field";
import { Button } from "@/components/ui/Button";
import { Caption } from "@/components/ui/Typography";
import type { Branch, Programme } from "@/content";
// Import directly from ./types, not the "@/lib/leads" barrel — the barrel
// also re-exports the zod-based trial/contact schemas (./trial-schema),
// which would otherwise be pulled into this client component's bundle for
// no reason (only the server action needs them). See docs/DECISIONS.md
// ADR-013 (Category 7 performance pass).
import { ageGroupValues, preferredTimingValues } from "@/lib/leads/types";
import { submitTrialLead, type TrialFormState } from "./actions";

const TIMING_LABELS: Record<(typeof preferredTimingValues)[number], string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  weekend: "Weekend",
  flexible: "Flexible",
};

const AGE_LABELS: Record<(typeof ageGroupValues)[number], string> = {
  adults: "Adults",
  teens: "Teens",
  kids: "Kids",
  mixed: "Mixed / family",
};

const initialState: TrialFormState = null;

export function TrialForm({ branches, programmes }: { branches: Branch[]; programmes: Programme[] }) {
  const [state, formAction, isPending] = useActionState(submitTrialLead, initialState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field id="name" label="Name" hint="How should we address you?" error={fieldErrors.name}>
        <TextInput
          id="name"
          name="name"
          autoComplete="name"
          required
          invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
      </Field>

      <Field id="phone" label="Phone" hint="We will only use this to arrange your visit." error={fieldErrors.phone}>
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

      <Field id="branchSlug" label="Branch" error={fieldErrors.branchSlug}>
        <TextSelect
          id="branchSlug"
          name="branchSlug"
          required
          defaultValue=""
          invalid={Boolean(fieldErrors.branchSlug)}
          aria-describedby={fieldErrors.branchSlug ? "branchSlug-error" : undefined}
        >
          <option value="" disabled>
            Select a listed branch
          </option>
          {branches.map((branch) => (
            <option key={branch.slug} value={branch.slug}>
              {branch.name}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="programmeSlug" label="Programme" error={fieldErrors.programmeSlug}>
        <TextSelect
          id="programmeSlug"
          name="programmeSlug"
          required
          defaultValue=""
          invalid={Boolean(fieldErrors.programmeSlug)}
          aria-describedby={fieldErrors.programmeSlug ? "programmeSlug-error" : undefined}
        >
          <option value="" disabled>
            Select a programme
          </option>
          {programmes.map((programme) => (
            <option key={programme.slug} value={programme.slug}>
              {programme.name}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="preferredTiming" label="Preferred timing" error={fieldErrors.preferredTiming}>
        <TextSelect
          id="preferredTiming"
          name="preferredTiming"
          required
          defaultValue=""
          invalid={Boolean(fieldErrors.preferredTiming)}
          aria-describedby={fieldErrors.preferredTiming ? "preferredTiming-error" : undefined}
        >
          <option value="" disabled>
            Select a preference
          </option>
          {preferredTimingValues.map((value) => (
            <option key={value} value={value}>
              {TIMING_LABELS[value]}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="ageGroup" label="Age group" error={fieldErrors.ageGroup}>
        <TextSelect
          id="ageGroup"
          name="ageGroup"
          required
          defaultValue=""
          invalid={Boolean(fieldErrors.ageGroup)}
          aria-describedby={fieldErrors.ageGroup ? "ageGroup-error" : undefined}
        >
          <option value="" disabled>
            Select an age group
          </option>
          {ageGroupValues.map((value) => (
            <option key={value} value={value}>
              {AGE_LABELS[value]}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="message" label="Optional message" error={fieldErrors.message}>
        <TextTextarea id="message" name="message" rows={4} invalid={Boolean(fieldErrors.message)} />
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
          I agree to be contacted about this trial request. I understand mock/development
          submissions are not sent to a live studio inbox unless a provider is configured.
        </label>
      </div>
      {fieldErrors.consent ? (
        <p id="consent-error" role="alert" className="-mt-3 text-sm text-accent-strength">
          {fieldErrors.consent}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="self-start" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit trial request"}
      </Button>
      <Caption>
        Canonical booking path is <code>/trial</code>. <code>/book-a-free-trial</code> redirects
        here.
      </Caption>
    </form>
  );
}
