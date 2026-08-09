import type { NextConfig } from "next";
import {
  assertMockContentSafeForBuild,
  assertProductionReleaseSafe,
} from "./src/content/content-mode";

// Layer 3 of the mock-data launch gate (docs/DECISIONS.md ADR-002/ADR-011).
assertMockContentSafeForBuild();
// Stage 7 — block synthetic / mock flags on real production releases only.
assertProductionReleaseSafe();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/locations/airoli",
        destination: "/locations/airoli-sector-19",
        permanent: true,
      },
      {
        source: "/book-a-free-trial",
        destination: "/trial",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
