import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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
      <body className="studio-shell has-sticky-cta flex min-h-full flex-col bg-field text-ink-inverse">
        <Script
          id="motion-preference"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var m=window.matchMedia('(prefers-reduced-motion: reduce)');if(m.matches){d.classList.add('prm');}else{d.classList.add('motion-pending');requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('motion-ready');d.classList.remove('motion-pending');});});}}catch(e){}})();`,
          }}
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
