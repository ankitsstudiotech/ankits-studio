"use server";

import { redirect } from "next/navigation";
import { getLeadAdapter, trialLeadSchema } from "@/lib/leads";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitTrialLead(formData: FormData) {
  const parsed = trialLeadSchema.safeParse({
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    branchSlug: readString(formData, "branchSlug"),
    programmeSlug: readString(formData, "programmeSlug"),
    preferredTiming: readString(formData, "preferredTiming"),
    ageGroup: readString(formData, "ageGroup"),
    message: readString(formData, "message") || undefined,
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  });

  if (!parsed.success) {
    redirect("/trial?status=validation-error");
  }

  const result = await getLeadAdapter().submitTrialLead({
    ...parsed.data,
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
