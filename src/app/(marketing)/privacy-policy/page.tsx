import type { Metadata } from "next";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { LegalPage } from "@/components/legal/pulse/LegalPage";
import styles from "@/components/legal/pulse/legal.module.css";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/privacy-policy";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description:
    "How Ankit’s Studio handles information on this website — WhatsApp enquiries, contact links, and hosting.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Privacy policy", path: PATH },
];

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <PageWithFooter>
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <LegalPage title="Privacy policy" breadcrumbTrail={breadcrumbTrail}>
        <h2 className={styles.sectionTitle}>What this website does</h2>
        <p className={styles.body}>
          This website provides studio information for Ankit’s Studio and links that help you enquire
          about programmes, branches, fees and free trials. It is not a medical service and does not
          provide diagnosis or treatment.
        </p>

        <h2 className={styles.sectionTitle}>WhatsApp enquiry builders</h2>
        <p className={styles.body}>
          Trial, pricing and availability builders on this site prepare a message on your device. The
          message is not sent until you choose to open WhatsApp and send it yourself. WhatsApp is an
          external service operated by Meta; its own privacy practices apply once you use that app or
          website.
        </p>

        <h2 className={styles.sectionTitle}>Phone, email and Maps links</h2>
        <p className={styles.body}>
          Phone, email and Google Maps links open external applications or services. Those providers
          process information according to their own policies when you use them.
        </p>

        <h2 className={styles.sectionTitle}>Google reviews on this website</h2>
        <p className={styles.body}>
          The homepage may link to Google Maps so you can read public reviews on Google. If live
          Google reviews are shown here, reviewer names, ratings, review text and photos come from
          Google and are fetched on our server using the Google Places API. Reviewer photos may then
          load from Google’s servers in your browser. This site does not store those reviews, does
          not run Google advertising or analytics, and does not load a client-side Google Maps
          script for that chapter. Google’s{" "}
          <a href="https://policies.google.com/privacy" className={styles.link}>
            Privacy Policy
          </a>{" "}
          applies to Google Maps content.
        </p>

        <h2 className={styles.sectionTitle}>Forms and storage</h2>
        <p className={styles.body}>
          The enquiry builders prepare messages on your device. The website does not send or store
          those WhatsApp messages itself.
        </p>

        <h2 className={styles.sectionTitle}>Hosting and technical information</h2>
        <p className={styles.body}>
          Like most websites, hosting infrastructure may process ordinary technical request
          information such as IP address, browser type and pages requested, as needed to serve and
          secure the site. This site does not currently ship a separate marketing analytics or
          advertising pixel integration.
        </p>

        <h2 className={styles.sectionTitle}>Contact</h2>
        <p className={styles.body}>
          For privacy questions about this website, email{" "}
          <a href="mailto:ankitsstudio5@gmail.com" className={styles.link}>
            ankitsstudio5@gmail.com
          </a>
          .
        </p>
      </LegalPage>
    </>
    </PageWithFooter>
  );
}
