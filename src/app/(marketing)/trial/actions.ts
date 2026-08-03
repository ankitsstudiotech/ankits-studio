"use server";

import { redirect } from "next/navigation";
import { getLeadAdapter, trialLeadSchema } from "@/lib/leads";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export type TrialFormFieldErrors = Partial<
  Record<
    | "name"
    | "phone"
    | "branchSlug"
    | "programmeSlug"
    | "preferredTiming"
    | "ageGroup"
    | "trialDate"
    | "message"
    | "consent",
    string
  >
>;

export type TrialFormState = { fieldErrors: TrialFormFieldErrors } | null;

/**
 * `useActionState`-compatible server action (see Next's own documented
 * pattern for field-level form errors — node_modules/next/dist/docs/
 * 01-app/01-getting-started/10-error-handling.md: "avoid try/catch and throw
 * errors, model expected errors as return values"). Validation failures
 * return field-level errors instead of redirecting to a banner-only status
 * page; success/not-configured/provider-error still redirect, since those
 * aren't per-field concerns. See docs/DECISIONS.md ADR-013 (VIS-002).
 */
export async function submitTrialLead(
  _prevState: TrialFormState,
  formData: FormData
): Promise<TrialFormState> {
  const ageRaw = readString(formData, "ageGroup");
  const trialDateRaw = readString(formData, "trialDate");
  const parsed = trialLeadSchema.safeParse({
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    branchSlug: readString(formData, "branchSlug"),
    programmeSlug: readString(formData, "programmeSlug"),
    preferredTiming: readString(formData, "preferredTiming"),
    ageGroup: ageRaw || undefined,
    trialDate: trialDateRaw || undefined,
    message: readString(formData, "message") || undefined,
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  });

  if (!parsed.success) {
    const fieldErrors: TrialFormFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof TrialFormFieldErrors] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const ageGroup =
    parsed.data.ageGroup && parsed.data.ageGroup !== ""
      ? parsed.data.ageGroup
      : undefined;

  const result = await getLeadAdapter().submitTrialLead({
    name: parsed.data.name,
    phone: parsed.data.phone,
    branchSlug: parsed.data.branchSlug,
    programmeSlug: parsed.data.programmeSlug,
    preferredTiming: parsed.data.preferredTiming,
    ageGroup,
    trialDate: parsed.data.trialDate || undefined,
    message: parsed.data.message || undefined,
    consent: true,
  });

  if (result.ok) {
    redirect(
      `/trial?status=received&mode=${result.mode}&ref=${encodeURIComponent(result.referenceId)}`
    );
  }

  if (result.code === "not-configured") {
    redirect("/trial?status=not-configured");
  }

  redirect("/trial?status=provider-error");
}
