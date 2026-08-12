import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { GoogleReviewProof } from "@/components/home/GoogleReviewProof";
import { BranchExplorer } from "@/components/home/BranchExplorer";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

const FIXTURE_REVIEWS = [
  {
    id: "review-fixture-1",
    authorDisplayName: "Fixture Author",
    excerpt: "Helpful coach-led sessions in a welcoming studio.",
    sourceUrl: "https://www.google.com/maps/reviews/example",
  },
] as const;

function readHomePageSource() {
  return readFileSync(
    join(process.cwd(), "src", "app", "(marketing)", "page.tsx"),
    "utf8",
  );
}

describe("homepage section order — final owner priority", () => {
  it("places BranchExplorer before GoogleReviewProof in the component tree", () => {
    const home = readHomePageSource();
    const branchIdx = home.indexOf("<BranchExplorer");
    const reviewIdx = home.indexOf("<GoogleReviewProof");
    expect(branchIdx).toBeGreaterThan(-1);
    expect(reviewIdx).toBeGreaterThan(-1);
    expect(branchIdx).toBeLessThan(reviewIdx);
  });

  it("renders nothing for Google Reviews when the list is empty", () => {
    const { container } = render(<GoogleReviewProof reviews={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Branches before Google Reviews when fixture reviews are present", () => {
    const { container } = render(
      <>
        <BranchExplorer
          locations={[
            {
              name: "Airoli Sector 19",
              href: "/locations/airoli-sector-19",
              locality: "Airoli Sector 19",
              openingYear: 2019,
              mapsUrl: "https://maps.example/airoli",
            },
          ]}
        />
        <GoogleReviewProof reviews={FIXTURE_REVIEWS} />
      </>,
    );

    const branchSection = container.querySelector("#locations");
    const reviewSection = container.querySelector("#google-reviews");
    expect(branchSection).toBeTruthy();
    expect(reviewSection).toBeTruthy();

    const position = branchSection!.compareDocumentPosition(reviewSection!);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
