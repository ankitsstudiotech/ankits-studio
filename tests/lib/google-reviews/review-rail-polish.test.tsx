import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoogleReviewsRail } from "@/components/home/GoogleReviewsRail";
import { GOOGLE_REVIEW_DISCLOSURE } from "@/lib/google-reviews";
import type { GoogleLiveReview } from "@/lib/google-reviews";

function read(rel: string) {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

const REVIEWS: GoogleLiveReview[] = [
  {
    id: "r1",
    branchSlug: "airoli-sector-19",
    branchLocality: "Airoli Sector 19",
    author: { displayName: "Alex M" },
    rating: 5,
    text: "First review.",
    googleMapsReviewUri: "https://maps.google.com/?cid=1",
  },
  {
    id: "r2",
    branchSlug: "ghansoli",
    branchLocality: "Ghansoli",
    author: { displayName: "Priya K" },
    rating: 5,
    text: "Second review.",
    googleMapsReviewUri: "https://maps.google.com/?cid=2",
  },
  {
    id: "r3",
    branchSlug: "thane",
    branchLocality: "Thane",
    author: { displayName: "Rahul S" },
    rating: 4,
    text: "Third review.",
    googleMapsReviewUri: "https://maps.google.com/?cid=3",
  },
];

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "scrollBy", {
    configurable: true,
    value: vi.fn(function (this: HTMLElement, opts?: ScrollToOptions | number) {
      const left = typeof opts === "number" ? opts : Number(opts?.left ?? 0);
      this.scrollLeft += left;
      this.dispatchEvent(new Event("scroll"));
    }),
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("review rail polish — CSS contracts", () => {
  it("hides the native horizontal scrollbar while keeping overflow-x scrollable", () => {
    const css = read("src/components/home/pulse/pulse-home.module.css");
    const rail = css.slice(css.indexOf(".googleProofRail {"), css.indexOf(".googleProofLiveItem {"));
    expect(rail).toMatch(/overflow-x:\s*auto/);
    expect(rail).toMatch(/scrollbar-width:\s*none/);
    expect(rail).toMatch(/-ms-overflow-style:\s*none/);
    expect(rail).toMatch(/::-webkit-scrollbar/);
    expect(rail).toMatch(/display:\s*none/);
    expect(rail).not.toMatch(/overflow-x:\s*hidden/);
    expect(rail).not.toMatch(/scrollbar-width:\s*thin/);
  });

  it("gives review cells a shared content-rule inset and a between-item separator", () => {
    const tokens = read("src/styles/tokens.css");
    const css = read("src/components/home/pulse/pulse-home.module.css");
    expect(tokens).toMatch(/--spacing-rule-content:\s*1\.5rem/);
    expect(css).toMatch(/\.googleProofLiveItem\s*\{[\s\S]*padding-inline:\s*var\(--spacing-rule-content\)/);
    expect(css).toMatch(
      /\.googleProofLiveItem\s*\+\s*\.googleProofLiveItem\s*\{[\s\S]*border-inline-start:\s*var\(--rule-structural-width\)/,
    );
    expect(css).not.toMatch(/\.googleProofLiveItem:last-child\s*\{[\s\S]*padding-right:\s*0/);
  });

  it("keeps the compact disclosure string and removes the verification sentence from live UI", () => {
    expect(GOOGLE_REVIEW_DISCLOSURE).toBe("Shown in Google relevance order · up to 2 per studio");
    const proof = read("src/components/home/GoogleReviewProof.tsx");
    expect(proof).toMatch(/data-review-disclosure/);
    expect(proof).toMatch(/googleProofDisclosure/);
    expect(proof).not.toMatch(/Reviews supplied by Google Maps/);
    expect(proof).not.toMatch(/verified by Google/);
    expect(proof).not.toMatch(/removes fake content/);
  });

  it("gives wide location directory columns inset after the first cell", () => {
    const css = read("src/components/locations/pulse/location-pulse.module.css");
    expect(css).toMatch(
      /\.studioColumn:not\(:first-child\)\s*\{[\s\S]*padding-left:\s*var\(--spacing-rule-content\)/,
    );
  });
});

describe("review rail polish — navigation", () => {
  it("keeps Previous disabled until Next advances the rail", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        return 900;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        return 300;
      },
    });

    render(<GoogleReviewsRail reviews={REVIEWS} />);
    const prev = screen.getByRole("button", { name: /previous reviews/i });
    const next = screen.getByRole("button", { name: /next reviews/i });
    const rail = screen.getByRole("list", { name: /google reviews/i });
    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
    fireEvent.click(next);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalled();
    Object.defineProperty(rail, "scrollLeft", { configurable: true, value: 300, writable: true });
    fireEvent.scroll(rail);
    expect(prev).not.toBeDisabled();
    expect(next).not.toBeDisabled();
    Object.defineProperty(rail, "scrollLeft", { configurable: true, value: 596, writable: true });
    fireEvent.scroll(rail);
    expect(next).toBeDisabled();
  });
});
