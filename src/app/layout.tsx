import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { MockModeIndicator } from "@/components/MockModeIndicator";
import { getBusinessIdentity } from "@/content";
import { baseMetadata } from "@/lib/metadata";
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationJsonLd(getBusinessIdentity());

  return (
    <html
      lang="en"
      className={`${syne.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="studio-shell has-sticky-cta flex min-h-full flex-col">
        {organizationJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
          />
        ) : null}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-ink focus:shadow-lg"
        >
          Skip to main content
        </a>
        <MockModeIndicator />
        {/* Wrapper keeps skip-link target stable; each page owns its <main>. */}
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
