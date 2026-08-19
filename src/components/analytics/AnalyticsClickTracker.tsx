"use client";

import { useEffect } from "react";
import {
  trackWhatsApp,
  trackFreeTrial,
  trackPhone,
  trackMaps,
  trackSocial,
  trackCta,
  trackProgrammeSelect,
  trackBranchSelect,
  trackLead,
  trackFaq,
} from "@/lib/analytics";

function getPageType(): string {
  const path = window.location.pathname;
  if (path === "/") return "home";
  if (path === "/programs") return "programmes_index";
  if (path.startsWith("/programs/")) return "programme_detail";
  if (path === "/locations") return "locations_index";
  if (path.startsWith("/locations/")) return "branch_detail";
  if (path === "/pricing") return "pricing";
  if (path === "/timetable") return "batch_availability";
  if (path === "/about") return "about";
  if (path === "/trial" || path === "/book-a-free-trial") return "trial";
  if (path === "/contact") return "contact";
  if (path === "/privacy-policy") return "privacy";
  if (path === "/terms") return "terms";
  return "other";
}

function getCtaLocation(el: HTMLElement): string {
  const header = el.closest("header");
  if (header) return "header";
  const footer = el.closest("footer");
  if (footer) return "footer";
  const section = el.closest("[data-analytics-section]");
  if (section) return section.getAttribute("data-analytics-section") || "page_body";
  if (el.closest('[id="trial"]') || el.closest('[data-closing-band]')) return "closing_band";
  return "page_body";
}

function getProgrammeFromPath(): string | undefined {
  const match = window.location.pathname.match(/^\/programs\/([^/]+)/);
  return match?.[1]?.replace(/-/g, " ") ?? undefined;
}

function getBranchFromPath(): string | undefined {
  const match = window.location.pathname.match(/^\/locations\/([^/]+)/);
  return match?.[1]?.replace(/-/g, " ") ?? undefined;
}

export function AnalyticsClickTracker() {
  useEffect(() => {
    function handler(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const pageType = getPageType();
      const ctaLocation = getCtaLocation(anchor);

      // WhatsApp clicks
      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        const isTrial =
          anchor.textContent?.toLowerCase().includes("trial") ||
          anchor.closest('[id="trial"]') !== null;

        const enquiryType = isTrial
          ? "free_trial"
          : pageType === "pricing"
            ? "pricing"
            : pageType === "batch_availability"
              ? "batch_availability"
              : pageType === "contact"
                ? "contact"
                : "programme_enquiry";

        trackWhatsApp({
          cta_location: ctaLocation,
          enquiry_type: enquiryType,
          programme_name: getProgrammeFromPath(),
          branch_name: getBranchFromPath(),
          page_type: pageType,
        });

        if (isTrial) {
          trackFreeTrial({
            cta_location: ctaLocation,
            programme_name: getProgrammeFromPath(),
            branch_name: getBranchFromPath(),
            page_type: pageType,
          });
        }

        // generate_lead for form handoffs
        const form = anchor.closest("form") || anchor.closest("[data-form-builder]");
        if (form) {
          trackLead({
            enquiry_type: enquiryType,
            form_name: form.getAttribute("data-form-name") || enquiryType,
            programme_name: getProgrammeFromPath(),
            branch_name: getBranchFromPath(),
          });
        }
        return;
      }

      // Tel clicks
      if (href.startsWith("tel:")) {
        trackPhone({ cta_location: ctaLocation, branch_name: getBranchFromPath(), page_type: pageType });
        return;
      }

      // Mailto clicks
      if (href.startsWith("mailto:")) {
        trackCta({
          cta_name: "email",
          cta_location: ctaLocation,
          destination_type: "email",
          page_type: pageType,
        });
        return;
      }

      // Maps clicks
      if (href.includes("google.com/maps") || href.includes("maps.google") || href.includes("goo.gl/maps")) {
        trackMaps({ cta_location: ctaLocation, branch_name: getBranchFromPath(), page_type: pageType });
        return;
      }

      // Social clicks
      if (href.includes("instagram.com")) {
        trackSocial({ destination_type: "instagram", cta_location: ctaLocation, page_type: pageType });
        return;
      }
      if (href.includes("youtube.com") || href.includes("youtu.be")) {
        trackSocial({ destination_type: "youtube", cta_location: ctaLocation, page_type: pageType });
        return;
      }

      // Programme select (internal links to /programs/*)
      if (href.startsWith("/programs/") && !window.location.pathname.startsWith("/programs/")) {
        const slug = href.replace("/programs/", "").replace(/-/g, " ");
        trackProgrammeSelect({ programme_name: slug, cta_location: ctaLocation, page_type: pageType });
        return;
      }

      // Branch select (internal links to /locations/*)
      if (href.startsWith("/locations/") && !window.location.pathname.startsWith("/locations/")) {
        const slug = href.replace("/locations/", "").replace(/-/g, " ");
        trackBranchSelect({ branch_name: slug, cta_location: ctaLocation, page_type: pageType });
        return;
      }

      // Free trial CTA (non-WhatsApp links with trial text)
      const text = anchor.textContent?.toLowerCase() || "";
      if (text.includes("free trial") || text.includes("book a trial")) {
        trackFreeTrial({
          cta_location: ctaLocation,
          programme_name: getProgrammeFromPath(),
          branch_name: getBranchFromPath(),
          page_type: pageType,
        });
        trackCta({
          cta_name: "free_trial",
          cta_location: ctaLocation,
          destination_type: href.startsWith("/") ? "internal" : "whatsapp",
          page_type: pageType,
          programme_name: getProgrammeFromPath(),
          branch_name: getBranchFromPath(),
        });
      }
    }

    function toggleHandler(e: Event) {
      const details = e.target as HTMLDetailsElement;
      if (details.tagName !== "DETAILS" || !details.open) return;
      const summary = details.querySelector("summary");
      if (!summary) return;
      const faqId = details.getAttribute("key") || 
        summary.textContent?.slice(0, 40).replace(/\s+/g, "-").toLowerCase() || "unknown";
      trackFaq({ faq_id: faqId, page_type: getPageType() });
    }

    document.addEventListener("click", handler, { capture: true });
    document.addEventListener("toggle", toggleHandler, true);
    return () => {
      document.removeEventListener("click", handler, { capture: true });
      document.removeEventListener("toggle", toggleHandler, true);
    };
  }, []);

  return null;
}
