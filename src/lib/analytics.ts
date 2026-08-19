/**
 * Central GA4 analytics abstraction.
 * Components call typed helpers; gtag calls are isolated here.
 * No PII (name, email, phone, free-text) is ever sent.
 */

type GtagCommand = "event" | "consent" | "config" | "set";

function gtag(command: GtagCommand, ...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.(command, ...args);
}

/* ─── Consent Mode v2 ─── */

export type ConsentState = "granted" | "denied";

export function updateConsent(analyticsStorage: ConsentState) {
  gtag("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

/* ─── Core event helper ─── */

export type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params?: EventParams) {
  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleaned[k] = v;
    }
  }
  gtag("event", eventName, cleaned);
}

/* ─── Typed domain helpers ─── */

export function trackCta(params: {
  cta_name: string;
  cta_location: string;
  destination_type?: string;
  page_type?: string;
  programme_name?: string;
  branch_name?: string;
}) {
  trackEvent("cta_click", params);
}

export function trackWhatsApp(params: {
  cta_name?: string;
  cta_location: string;
  enquiry_type?: string;
  programme_name?: string;
  branch_name?: string;
  selected_service?: string;
  selected_branch?: string;
  training_format?: string;
  batch_preference?: string;
  page_type?: string;
}) {
  trackEvent("whatsapp_click", params);
}

export function trackFreeTrial(params: {
  cta_location: string;
  programme_name?: string;
  branch_name?: string;
  page_type?: string;
}) {
  trackEvent("free_trial_click", params);
}

export function trackLead(params: {
  enquiry_type: string;
  form_name?: string;
  selected_service?: string;
  selected_branch?: string;
  training_format?: string;
  batch_preference?: string;
  programme_name?: string;
  branch_name?: string;
}) {
  trackEvent("generate_lead", { method: "whatsapp", ...params });
}

export function trackProgrammeSelect(params: {
  programme_name: string;
  cta_location: string;
  page_type?: string;
}) {
  trackEvent("programme_select", params);
}

export function trackBranchSelect(params: {
  branch_name: string;
  cta_location: string;
  page_type?: string;
}) {
  trackEvent("branch_select", params);
}

export function trackProgrammeView(programmeName: string) {
  trackEvent("programme_view", {
    programme_name: programmeName,
    page_type: "programme_detail",
  });
}

export function trackBranchView(branchName: string) {
  trackEvent("branch_view", {
    branch_name: branchName,
    page_type: "branch_detail",
  });
}

export function trackContact(params: {
  destination_type: string;
  cta_location: string;
  branch_name?: string;
  page_type?: string;
}) {
  trackEvent("cta_click", { cta_name: "contact", ...params });
}

export function trackPhone(params: {
  cta_location: string;
  branch_name?: string;
  page_type?: string;
}) {
  trackEvent("phone_click", params);
}

export function trackMaps(params: {
  cta_location: string;
  branch_name?: string;
  page_type?: string;
}) {
  trackEvent("maps_click", params);
}

export function trackSocial(params: {
  destination_type: string;
  cta_location: string;
  page_type?: string;
}) {
  trackEvent("social_click", params);
}

export function trackFaq(params: {
  faq_id: string;
  faq_section?: string;
  page_type?: string;
  programme_name?: string;
}) {
  trackEvent("faq_expand", params);
}

export function trackBatchPreference(params: {
  batch_preference: string;
  selected_service?: string;
  selected_branch?: string;
}) {
  trackEvent("batch_preference_select", params);
}
