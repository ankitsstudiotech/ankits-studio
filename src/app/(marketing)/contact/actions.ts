"use server";

import { redirect } from "next/navigation";
import { contactInquirySchema, getLeadAdapter } from "@/lib/leads";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export type ContactFormFieldErrors = Partial<
  Record<"name" | "phone" | "email" | "message" | "consent", string>
>;

export type ContactFormState = { fieldErrors: ContactFormFieldErrors } | null;

/**
 * `useActionState`-compatible server action — same pattern as
 * `trial/actions.ts`'s `submitTrialLead`. See docs/DECISIONS.md ADR-013
 * (VIS-002).
 */
export async function submitContactInquiry(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactInquirySchema.safeParse({
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email") || undefined,
    message: readString(formData, "message"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof ContactFormFieldErrors] = issue.message;
      }
    }
    return { fieldErrors };
  }

  const result = await getLeadAdapter().submitContactInquiry({
    ...parsed.data,
    email: parsed.data.email || undefined,
    consent: true,
  });

  if (result.ok) {
    redirect(
      `/contact?status=received&mode=${result.mode}&ref=${encodeURIComponent(result.referenceId)}`
    );
  }

  if (result.code === "not-configured") {
    redirect("/contact?status=not-configured");
  }

  redirect("/contact?status=provider-error");
}
