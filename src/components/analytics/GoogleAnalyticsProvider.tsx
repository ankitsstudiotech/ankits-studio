import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Consent Mode v2 default — deny analytics until user opts in.
 * Must run before gtag loads, so it's an inline script.
 */
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  analytics_storage:'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
`;

export function GoogleAnalyticsProvider() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  if (!gaId || !isProduction) return null;

  return (
    <>
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
      />
      <GoogleAnalytics gaId={gaId} />
    </>
  );
}
