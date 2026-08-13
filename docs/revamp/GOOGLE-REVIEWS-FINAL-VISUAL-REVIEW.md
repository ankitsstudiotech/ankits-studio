# Google Reviews final visual review — 2026-08-13

Evidence: `docs/revamp/screenshots/google-reviews-final/`.  
Mode in this pass: **external-links** (Places key and Place IDs missing). Sticky CTA evidence: Corporate Wellness 390×844.

## Answers

1. **Are Reviews after Branches?**  
   Yes. DOM order is `#locations` then `#google-reviews` then `#founder`. Source order on the homepage matches.

2. **Does the section feel premium?**  
   The fallback is an editorial PAPER continuation: kicker, display title, short lede, four named studio rows with a single action. It is meant to look like a chapter, not a plugin. Final judgement is against the screenshots in this folder.

3. **Does it avoid SaaS testimonial-card styling?**  
   Yes in this mode: no quote cards, no avatars, no star rows, no equal card grid. Live mode (when credentials exist) is also a ruled editorial list, not four identical cards.

4. **Is Google attribution clear but not visually dominant?**  
   Fallback does not display Places content, so the Google Maps lockup is omitted on purpose. Live mode uses official “Google Maps” text attribution in `#5E5E5E`, small, near the chapter intro.

5. **Does each review retain genuine author identity?**  
   No on-page review authors in this launch mode. Live path keeps Google `displayName`, profile URI, and `photoUri` without renaming.

6. **Is individual Google Maps source access obvious?**  
   Each studio row has **View on Google**. That is truthful for a generic Maps URL. It does not pretend to open a dedicated review tab.

7. **Is ordering/filtering disclosure present?**  
   Not in fallback, correctly: we are not displaying a filtered review sample. Live mode adds the relevance-sorted notice.

8. **Is any review manually rewritten?**  
   No. No review text is stored or authored in the repo.

9. **Is any brand-wide rating fabricated?**  
   No. No “Ankit’s Studio 4.9” and no combined average.

10. **Are branch identities understandable?**  
    Yes: Airoli Sector 19, Airoli Sector 8, Ghansoli, Thane — the same public names as the Branches chapter.

11. **Does PAPER/dark rhythm still work?**  
    Reviews continue PAPER after Branches, then Founder returns to FIELD. That avoids a leftover white-card slab between two dark chapters.

12. **Is mobile review length reasonable?**  
    Fallback rows are one line of name plus action. Live quotes clamp to six lines with the Maps source link for the full text.

13. **Does review content overwhelm Founder?**  
    Fallback is compact (four rows). Founder remains its own FIELD chapter.

14. **Is reduced-motion correct?**  
    Section/group reveal uses the existing Pulse primitives; reduced motion stays on the final state (`state-reduced-motion.png`).

15. **Does fallback mode look intentional?**  
    It is titled “What members say” with a clear invitation to Google — not “reviews failed to load” and not an empty card shell.

16. **Any AI evidence confusion?**  
    No reviewer portraits. No generated member faces beside Google copy. Programme AI media is unrelated and not used here.

17. **Does Corporate Wellness sticky CTA now say enquiry, not trial?**  
    Yes: supporting “For teams”, button “Enquire on WhatsApp”, WhatsApp prefill is the Corporate Wellness service-enquiry message. Header remains “Book a free trial on WhatsApp”.

18. **Is this ready for the final deploy gate?**  
    Ready as a **launch-safe fallback**. Live Google review quotes still require a server Places key and verified Place IDs. That is an owner/platform action, not a scrape gap. Corporate Wellness sticky e2e (enquiry copy, seven trial programmes, soft-hide, legal-route exclusion) passed against `localhost`. Visual acceptance of this folder is the remaining human check before the next prompt (final audit + deploy).

## P0 / P1

| Gate | Count | Notes |
|---|---|---|
| P0 | 0 | No fake/scraped reviews, no key in `NEXT_PUBLIC_*`, homepage does not 500 without Google, Corporate Wellness sticky is enquiry. |
| P1 | 0 | Reviews after Branches; fallback is intentional; no fabricated aggregate; Maps actions are truthfully labelled. |
