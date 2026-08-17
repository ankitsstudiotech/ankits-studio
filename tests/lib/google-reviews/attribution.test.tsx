import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoogleReviewProof } from "@/components/home/GoogleReviewProof";
import type { GoogleSocialProof } from "@/lib/google-reviews";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

const LIVE: GoogleSocialProof = {
  mode: "live-google-reviews",
  disclosure:
    "Reviews supplied by Google Maps. Text reviews are shown in Google relevance order, up to two per studio.",
  branchRatings: [],
  fallbackBranches: [],
  reviews: [
    {
      id: "places/ChIJ/reviews/abc",
      branchSlug: "airoli-sector-19",
      branchLocality: "Airoli Sector 19",
      author: {
        displayName: "Alex M",
        profileUri: "https://www.google.com/maps/contrib/1",
        photoUri: "https://lh3.googleusercontent.com/a/example",
      },
      rating: 5,
      relativePublishTime: "2 weeks ago",
      text: "Coach-led sessions in a welcoming studio.",
      googleMapsReviewUri: "https://maps.google.com/?cid=review-abc",
    },
  ],
};

describe("Google review attribution and source links", () => {
  it("keeps Google author identity, rating text, and Maps source access", () => {
    render(<GoogleReviewProof proof={LIVE} />);
    expect(screen.getByText("Alex M")).toBeTruthy();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://lh3.googleusercontent.com/a/example");
    expect(screen.getByText("5 out of 5 stars")).toBeTruthy();
    const source = screen.getByRole("link", { name: /view review on google maps/i });
    expect(source.getAttribute("href")).toBe("https://maps.google.com/?cid=review-abc");
    expect(source.getAttribute("rel")).toMatch(/noopener/);
    expect(screen.getByText("Google Maps")).toHaveAttribute("translate", "no");
    expect(screen.getByText(/relevance order/i)).toBeTruthy();
    expect(screen.getByText(/Airoli Sector 19/)).toBeTruthy();
  });

  it("labels fallback Maps actions as View on Google, not Read reviews", () => {
    render(
      <GoogleReviewProof
        proof={{
          mode: "external-links",
          branches: [
            {
              slug: "airoli-sector-19",
              locality: "Airoli Sector 19",
              mapsUrl: "https://maps.app.goo.gl/75pmKFuezsCSd5JP8",
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole("link", { name: /view on google/i })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /read reviews/i })).toBeNull();
    expect(screen.queryByText(/failed/i)).toBeNull();
  });
});
