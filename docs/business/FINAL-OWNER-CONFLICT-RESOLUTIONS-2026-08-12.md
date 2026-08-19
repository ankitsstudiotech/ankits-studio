# Final owner conflict resolutions — 12 August 2026

Resolutions for contradictions between the 12-Aug-2026 requirements form, earlier owner data, and current site behaviour.

---

## 1. Exact schedule public YES vs no schedule data

**Conflict:** Owner selected that exact branch-wise batch schedules should be public, but the form contains no schedule table.

**Resolution:** `PUBLIC_INTENT_DATA_MISSING`. Public behaviour today: operating hours 6 AM–10 PM daily; batch timings vary; customers confirm current availability on WhatsApp. No fabricated weekly rows. No “schedule is being updated” language.

**Internal note:** Owner wants exact schedules public once real schedule data is supplied.

---

## 2. Missed classes public NO vs prose contains missed-class policy

**Conflict:** Explicit field = **No** for publishing missed-class policy; free-text answer included missed-class wording.

**Resolution:** Explicit field wins. Missed-class policy is **not** published in V1.

---

## 3. Corporate Fitness enquiry-only vs Corporate Wellness growth priority

**Conflict:** ADR-020 kept Corporate Fitness enquiry-only without a route. The 12-Aug form provides substantive Corporate Wellness content and names it a top growth area.

**Resolution:** Superseded by ADR-022. Public route `/programs/corporate-wellness` is indexable with full programme content. Enquiry-only footnote removed from `/programs`.

---

## 4. TTEA growth priority vs not a current confirmed service

**Conflict:** Owner names TTEA as future growth priority but did not include it in confirmed services and supplied no launch-ready programme detail.

**Resolution:** Internal backlog only — no public route, sitemap entry, or homepage promotion.

---

## 5. Certification data previously discussed vs final “do not publish”

**Conflict:** Earlier intake discussed founder Yoga / Ministry of Ayush credentials. Final form: do not publish individual qualifications on the website.

**Resolution:** Final privacy choice wins. No credential copy, no “government approved”, no credential JSON-LD.

---

## 6. Member stories desired vs no real consented stories supplied

**Conflict:** Owner wants member stories and transformations publicly; no consented identities, wording, or evidence supplied in this intake.

**Resolution:** Owner approval recorded; `/transformations` and member-story surfaces remain withheld/noindex until publishable records exist. No invented quotes.

---

## 7. Form media uploads vs owner says media is outdated

**Conflict:** Form includes Drive links for branch photos/videos. Owner separately told Aniket existing media is outdated and must not be used.

**Resolution:** Do not download, optimise, or publish form-upload media in this migration. Interim production art direction continues with approved illustrative/synthetic media until a new photoshoot (later prompt).

---

## 8. “Results oriented” vs safe fitness claims

**Conflict:** Owner describes the studio as results-oriented while also requiring honest fitness marketing.

**Resolution:** Public copy uses goals, progress, consistency, and coach-guided language. No guaranteed weight loss, fat loss, cures, or universal measurable outcomes.

---

## 9. Response time &lt;1 minute

**Conflict:** Owner described sub-minute WhatsApp response operationally.

**Resolution:** Not published as a customer SLA. Contact copy remains “during studio operating hours” without guaranteed response times.

---

## 10. Many desired homepage sections vs avoid clutter

**Conflict:** Owner wants programmes, reviews, branches, founder, FAQ, trial, member stories — but also wants to avoid too many sections.

**Resolution:** Homepage intent config records top-three hierarchy (Programmes, Google Reviews, Branches). No homepage visual restructure in this migration. Practical-information and team sections remain absent; machine-free stays supporting copy, not a mandatory homepage block.

---

_Checkpoint tag: `studio-pulse-before-final-owner-form-2026-08-12` @ `9ea1b5b`._
