import { describe, expect, it } from "vitest";
import {
  getGuidesForProgramme,
  getPublishedGuideBySlug,
  getPublishedGuides,
} from "@/content";
import { buildGuideArticleJsonLd } from "@/lib/seo/structured-data";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildWhatsAppGuideEnquiryMessage } from "@/lib/conversion";

describe("SEO guides Batch 1", () => {
  it("publishes exactly the five Batch 1 guide slugs", () => {
    const slugs = getPublishedGuides().map((guide) => guide.slug).sort();
    expect(slugs).toEqual(
      [
        "functional-training-vs-gym",
        "home-personal-training-vs-gym",
        "how-sangeet-choreography-works",
        "zumba-for-beginners",
        "zumba-vs-gym",
      ].sort(),
    );
  });

  it("emits Article JSON-LD with studio team authorship for verified guides", () => {
    const guide = getPublishedGuideBySlug("zumba-for-beginners");
    expect(guide).toBeTruthy();
    const jsonLd = buildGuideArticleJsonLd(guide!);
    expect(jsonLd?.["@type"]).toBe("Article");
    expect(jsonLd?.author?.name).toBe("Ankit's Studio Team");
    expect(jsonLd?.url).toBe(buildCanonicalUrl("/guides/zumba-for-beginners"));
    expect(jsonLd?.mainEntityOfPage?.["@id"]).toBe(
      buildCanonicalUrl("/guides/zumba-for-beginners"),
    );
  });

  it("maps helpful guides only to the primary programme", () => {
    const zumba = getGuidesForProgramme("zumba").map((g) => g.slug).sort();
    expect(zumba).toEqual(["zumba-for-beginners", "zumba-vs-gym"].sort());
    expect(getGuidesForProgramme("yoga")).toEqual([]);
    expect(getGuidesForProgramme("wedding-choreography").map((g) => g.slug)).toEqual([
      "how-sangeet-choreography-works",
    ]);
  });

  it("keeps wedding and Home PT enquiry copy free of free-trial wording", () => {
    expect(buildWhatsAppGuideEnquiryMessage("wedding-enquiry")).not.toMatch(/free trial/i);
    expect(buildWhatsAppGuideEnquiryMessage("home-pt-enquiry")).not.toMatch(/free trial/i);
    expect(buildWhatsAppGuideEnquiryMessage("wedding-enquiry")).toMatch(/sangeet/i);
  });
});

describe("sitemap includes guides without indexing /blog hub", () => {
  it("lists /guides hub and five guide URLs when indexable", async () => {
    // Uses current process env — production indexable builds include guides.
    const urls = buildSitemapEntries().map((entry) => entry.url);
    if (urls.length === 0) {
      // Preview/dev noindex gate — skip assertion of presence.
      expect(urls).toEqual([]);
      return;
    }
    expect(urls).toContain(buildCanonicalUrl("/guides"));
    expect(urls).toContain(buildCanonicalUrl("/guides/zumba-for-beginners"));
    expect(urls).toContain(buildCanonicalUrl("/guides/functional-training-vs-gym"));
    expect(urls).toContain(buildCanonicalUrl("/guides/how-sangeet-choreography-works"));
    expect(urls).toContain(buildCanonicalUrl("/guides/zumba-vs-gym"));
    expect(urls).toContain(buildCanonicalUrl("/guides/home-personal-training-vs-gym"));
    expect(urls).not.toContain(buildCanonicalUrl("/blog"));
  });
});
