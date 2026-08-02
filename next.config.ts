import type { NextConfig } from "next";
import { assertMockContentSafeForBuild } from "./src/content/content-mode";

// Layer 3 of the mock-data launch gate (docs/DECISIONS.md ADR-002/ADR-011).
// Runs whenever this config is loaded; only throws when NODE_ENV is
// "production" (i.e. `next build`/`next start`, not `next dev`) and
// unverified content is present without ALLOW_MOCK_PUBLISH=true.
assertMockContentSafeForBuild();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/locations/airoli",
        destination: "/locations/airoli-sector-19",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
