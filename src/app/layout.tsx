import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { MockModeIndicator } from "@/components/MockModeIndicator";
import { getBusinessIdentity } from "@/content";
import { baseMetadata } from "@/lib/metadata";
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
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
      className={`${bebas.variable} ${spaceGrotesk.variable} h-full antialiased`}
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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-field focus:px-4 focus:py-2 focus:text-ink-inverse focus:outline-2 focus:outline-offset-2 focus:outline-volt"
        >
          Skip to main content
        </a>
        <MockModeIndicator />
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
