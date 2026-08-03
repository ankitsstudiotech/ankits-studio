"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, TextSelect, TextTextarea } from "@/components/forms/Field";
import { Button } from "@/components/ui/Button";
import type { Branch, Programme } from "@/content";
import {
  WHATSAPP_REVIEW_HELPER,
  buildWhatsAppTrialUrl,
  type WhatsAppTrialFields,
} from "@/lib/conversion";
import { ageGroupValues, preferredTimingValues } from "@/lib/leads/types";

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

/**
 * V1 trial conversion — builds a WhatsApp message the visitor reviews before sending.
 * No backend / CRM. Opening chat is not submission.
 */
export function TrialWhatsAppForm({
  branches,
  programmes,
}: {
  branches: Branch[];
  programmes: Programme[];
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchSlug, setBranchSlug] = useState("");
  const [programmeSlug, setProgrammeSlug] = useState("");
  const [preferredTiming, setPreferredTiming] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [question, setQuestion] = useState("");

  const branchName = branches.find((b) => b.slug === branchSlug)?.name ?? "";
  const programmeName = programmes.find((p) => p.slug === programmeSlug)?.name ?? "";

  const href = useMemo(() => {
    const fields: WhatsAppTrialFields = {
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      preferredBranch: branchName || undefined,
      interestedService: programmeName || undefined,
      preferredTime: preferredTiming
        ? TIMING_LABELS[preferredTiming as (typeof preferredTimingValues)[number]]
        : undefined,
      age: ageGroup ? AGE_LABELS[ageGroup as (typeof ageGroupValues)[number]] : undefined,
      trialDate: trialDate || undefined,
      question: question.trim() || undefined,
    };
    return buildWhatsAppTrialUrl(fields);
  }, [name, phone, branchName, programmeName, preferredTiming, ageGroup, trialDate, question]);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!href) return;
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <Field id="name" label="Name" hint="Optional">
        <TextInput
          id="name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field id="phone" label="Phone" hint="Optional — helps us call you back if needed">
        <TextInput
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <Field id="branchSlug" label="Preferred branch" hint="Optional">
        <TextSelect
          id="branchSlug"
          name="branchSlug"
          value={branchSlug}
          onChange={(e) => setBranchSlug(e.target.value)}
        >
          <option value="">No preference yet</option>
          {branches.map((branch) => (
            <option key={branch.slug} value={branch.slug}>
              {branch.name}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="programmeSlug" label="Interested programme" hint="Optional">
        <TextSelect
          id="programmeSlug"
          name="programmeSlug"
          value={programmeSlug}
          onChange={(e) => setProgrammeSlug(e.target.value)}
        >
          <option value="">No preference yet</option>
          {programmes.map((programme) => (
            <option key={programme.slug} value={programme.slug}>
              {programme.name}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="preferredTiming" label="Preferred time" hint="Optional">
        <TextSelect
          id="preferredTiming"
          name="preferredTiming"
          value={preferredTiming}
          onChange={(e) => setPreferredTiming(e.target.value)}
        >
          <option value="">No preference yet</option>
          {preferredTimingValues.map((value) => (
            <option key={value} value={value}>
              {TIMING_LABELS[value]}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field
        id="ageGroup"
        label="Age group"
        hint="Optional — helpful for kids’ Dance batches"
      >
        <TextSelect
          id="ageGroup"
          name="ageGroup"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
        >
          <option value="">Prefer not to say</option>
          {ageGroupValues.map((value) => (
            <option key={value} value={value}>
              {AGE_LABELS[value]}
            </option>
          ))}
        </TextSelect>
      </Field>

      <Field id="trialDate" label="Preferred trial date" hint="Optional">
        <TextInput
          id="trialDate"
          name="trialDate"
          type="date"
          value={trialDate}
          onChange={(e) => setTrialDate(e.target.value)}
        />
      </Field>

      <Field id="question" label="Question" hint="Optional">
        <TextTextarea
          id="question"
          name="question"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </Field>

      <p className="text-sm text-ink-muted">{WHATSAPP_REVIEW_HELPER}</p>

      <Button type="submit" size="lg" className="self-start" disabled={!href} fullWidth>
        Continue on WhatsApp
      </Button>
    </form>
  );
}
