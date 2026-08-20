import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { ConceptPreviewIndicator } from "@/components/ConceptPreviewIndicator";
import { MockModeIndicator } from "@/components/MockModeIndicator";
import { GoogleAnalyticsProvider } from "@/components/analytics/GoogleAnalyticsProvider";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { AnalyticsClickTracker } from "@/components/analytics/AnalyticsClickTracker";
import { getBusinessIdentity } from "@/content";
import { baseMetadata } from "@/lib/metadata";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/serialize";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  /** optional: skip a late swap after the block period; preload so lab Slow-4G still often wins. */
  display: "optional",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Impact", "Haettenschweiler", "Arial Narrow", "sans-serif"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = baseMetadata;

/**
 * Must be a true parser-blocking inline script — NOT next/script beforeInteractive.
 * Next queues beforeInteractive onto `self.__next_s` until runtime JS loads, which
 * under Slow-4G applies motion-pending AFTER first paint and re-hides headline
 * lines (LCP regression).
 */
const MOTION_PREFERENCE_SCRIPT = `(function(){try{var d=document.documentElement;var m=window.matchMedia('(prefers-reduced-motion: reduce)');if(m.matches){d.classList.add('prm');}else{d.classList.add('motion-pending');requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('motion-ready');d.classList.remove('motion-pending');});});}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const identity = getBusinessIdentity();
  const organizationJsonLd = buildOrganizationJsonLd(identity);
  const websiteJsonLd = buildWebSiteJsonLd(identity);

  return (
    <html
      lang="en"
      className={`${bebas.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="studio-shell has-sticky-cta bg-field text-ink-inverse">
        <GoogleAnalyticsProvider />
        <script
          id="motion-preference"
          dangerouslySetInnerHTML={{ __html: MOTION_PREFERENCE_SCRIPT }}
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              /* Incomplete #main-content shell + delayed flight payload without JS.
                 Hide the shell and show the payload (must be @layer base to beat
                 Tailwind [hidden]{display:none!important} — important reverses layers). */
              __html: `@layer base{#main-content{display:none!important}div[hidden][id^="S:"],div[hidden][id^="B:"]{display:block!important}}`,
            }}
          />
        </noscript>
        {organizationJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
          />
        ) : null}
        {websiteJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
          />
        ) : null}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-field focus:px-4 focus:py-2 focus:text-ink-inverse focus:outline-2 focus:outline-offset-2 focus:outline-volt"
        >
          Skip to main content
        </a>
        <ConceptPreviewIndicator />
        <MockModeIndicator />
        <div id="main-content">
          {children}
        </div>
        <AnalyticsClickTracker />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
