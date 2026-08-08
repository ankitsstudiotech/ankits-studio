import type { Metadata } from "next";
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

        <h2 className={styles.sectionTitle}>Forms and storage</h2>
        <p className={styles.body}>
          The enquiry builders prepare messages on your device. The website does not send or store
          those WhatsApp messages itself. If you use a contact form and message delivery is not
          available, the site will tell you and you can reach us by WhatsApp, phone or email instead.
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
  );
}
