"use server";

import { redirect } from "next/navigation";
import { contactInquirySchema, getLeadAdapter } from "@/lib/leads";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitContactInquiry(formData: FormData) {
  const parsed = contactInquirySchema.safeParse({
    name: readString(formData, "name"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email") || undefined,
    message: readString(formData, "message"),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  });

  if (!parsed.success) {
    redirect("/contact?status=validation-error");
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
