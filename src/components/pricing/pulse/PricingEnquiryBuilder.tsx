"use client";

import { useId, useMemo, useState, useTransition, type MouseEvent } from "react";
import type { PricingDeliveryMode } from "@/lib/conversion/pricing-whatsapp";
import {
  buildWhatsAppPricingUrl,
  pricingBranchPromptNeeded,
  resolvePricingDeliveryMode,
} from "@/lib/conversion/pricing-whatsapp";
import { SECONDARY_TRIAL_FORM_HREF } from "@/lib/conversion/whatsapp";
import styles from "./pricing.module.css";

export type PricingServiceOption = {
  slug: string;
  name: string;
  deliveryMode: "in-studio" | "home" | "online";
};

export type PricingBranchOption = {
  slug: string;
  locality: string;
};

export type PricingEnquiryBuilderProps = {
  services: PricingServiceOption[];
  branches: PricingBranchOption[];
  fallbackHref?: string;
};

/**
 * Client island — prepares a WhatsApp pricing enquiry.
 * Field swaps are instant; no animation required to expose essential inputs.
 */
export function PricingEnquiryBuilder({
  services,
  branches,
  fallbackHref = SECONDARY_TRIAL_FORM_HREF,
}: PricingEnquiryBuilderProps) {
  const baseId = useId();
  const [, startTransition] = useTransition();

  const defaultService = services.find((s) => s.slug === "functional-training") ?? services[0];
  const [serviceSlug, setServiceSlug] = useState(defaultService?.slug ?? "");
  const [branchSlug, setBranchSlug] = useState("");
  const [locality, setLocality] = useState("");
  const [name, setName] = useState("");
  const [preferredFormat, setPreferredFormat] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [songs, setSongs] = useState("");
  const [question, setQuestion] = useState("");
  const [showBranchHint, setShowBranchHint] = useState(false);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug) ?? defaultService,
    [services, serviceSlug, defaultService],
  );

  const mode: PricingDeliveryMode = resolvePricingDeliveryMode(
    selectedService?.slug ?? "",
    selectedService?.deliveryMode,
  );
  const selectedBranch = branches.find((b) => b.slug === branchSlug);

  const href = useMemo(() => {
    return (
      buildWhatsAppPricingUrl({
        deliveryMode: mode,
        name: name.trim() || undefined,
        interestedService: selectedService?.name,
        preferredBranch: selectedBranch?.locality,
        locality: locality.trim() || undefined,
        preferredFormat: preferredFormat.trim() || undefined,
        eventDate: eventDate.trim() || undefined,
        participants: participants.trim() || undefined,
        songs: songs.trim() || undefined,
        question: question.trim() || undefined,
      }) ?? fallbackHref
    );
  }, [
    mode,
    name,
    selectedService,
    selectedBranch,
    locality,
    preferredFormat,
    eventDate,
    participants,
    songs,
    question,
    fallbackHref,
  ]);

  function onServiceChange(nextSlug: string) {
    startTransition(() => {
      setServiceSlug(nextSlug);
      setShowBranchHint(false);
      const next = services.find((s) => s.slug === nextSlug);
      const nextMode = resolvePricingDeliveryMode(nextSlug, next?.deliveryMode);
      if (nextMode !== "in-studio") {
        setBranchSlug("");
        setPreferredFormat("");
      }
      if (nextMode !== "home") setLocality("");
      if (nextMode !== "wedding") {
        setEventDate("");
        setParticipants("");
        setSongs("");
      }
    });
  }

  function onOpenWhatsApp(event: MouseEvent<HTMLAnchorElement>) {
    if (pricingBranchPromptNeeded(mode, selectedBranch?.locality)) {
      setShowBranchHint(true);
    }
    if (!href.startsWith("http")) {
      event.preventDefault();
      window.location.href = href;
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => event.preventDefault()}
      aria-describedby={`${baseId}-note`}
    >
      <div className={styles.field}>
        <label htmlFor={`${baseId}-service`}>Interested service</label>
        <select
          id={`${baseId}-service`}
          className={styles.control}
          value={serviceSlug}
          onChange={(event) => onServiceChange(event.target.value)}
        >
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        {mode === "home" ? (
          <p className={styles.deliveryNote}>
            Home Personal Training fees are confirmed on enquiry — we do not publish a coverage map.
          </p>
        ) : null}
        {mode === "online" ? (
          <p className={styles.deliveryNote}>
            Online Training fees and platform details are confirmed when you enquire.
          </p>
        ) : null}
      </div>

      {mode === "in-studio" ? (
        <div className={styles.field}>
          <label htmlFor={`${baseId}-branch`}>Preferred branch</label>
          <select
            id={`${baseId}-branch`}
            className={styles.control}
            value={branchSlug}
            aria-required="true"
            aria-invalid={showBranchHint || undefined}
            aria-describedby={showBranchHint ? `${baseId}-branch-hint` : `${baseId}-branch-help`}
            onChange={(event) => {
              setBranchSlug(event.target.value);
              if (event.target.value) setShowBranchHint(false);
            }}
          >
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.slug} value={branch.slug}>
                {branch.locality}
              </option>
            ))}
          </select>
          <p id={`${baseId}-branch-help`} className={styles.hint}>
            Helpful for studio services — you can still open WhatsApp without one.
          </p>
          {showBranchHint ? (
            <p id={`${baseId}-branch-hint`} className={styles.warn} role="status">
              Choosing a branch helps us quote accurately. You can still continue without one.
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === "home" ? (
        <div className={styles.field}>
          <label htmlFor={`${baseId}-locality`}>Locality / area</label>
          <input
            id={`${baseId}-locality`}
            className={styles.control}
            value={locality}
            onChange={(event) => setLocality(event.target.value)}
            autoComplete="address-level2"
            placeholder="e.g. Airoli, Ghansoli"
          />
        </div>
      ) : null}

      {mode === "in-studio" ? (
        <div className={styles.field}>
          <label htmlFor={`${baseId}-format`}>Preferred training format</label>
          <input
            id={`${baseId}-format`}
            className={styles.control}
            value={preferredFormat}
            onChange={(event) => setPreferredFormat(event.target.value)}
            placeholder="Optional — e.g. group batch"
          />
          <p className={styles.hint}>Optional — helps us share the right fee band.</p>
        </div>
      ) : null}

      {mode === "wedding" ? (
        <>
          <div className={styles.field}>
            <label htmlFor={`${baseId}-event`}>Event date</label>
            <input
              id={`${baseId}-event`}
              className={styles.control}
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${baseId}-participants`}>Number of participants</label>
            <input
              id={`${baseId}-participants`}
              className={styles.control}
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
              inputMode="numeric"
              placeholder="Optional"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${baseId}-songs`}>Number of songs</label>
            <input
              id={`${baseId}-songs`}
              className={styles.control}
              value={songs}
              onChange={(event) => setSongs(event.target.value)}
              inputMode="numeric"
              placeholder="Optional"
            />
          </div>
        </>
      ) : null}

      <div className={styles.field}>
        <label htmlFor={`${baseId}-name`}>Name</label>
        <input
          id={`${baseId}-name`}
          className={styles.control}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-question`}>Question</label>
        <textarea
          id={`${baseId}-question`}
          className={`${styles.control} ${styles.textarea}`}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </div>

      <div className={styles.ctaRow}>
        <a
          href={href}
          className={styles.cta}
          onClick={onOpenWhatsApp}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          Ask for current fees on WhatsApp
        </a>
        <p id={`${baseId}-note`} className={styles.ctaNote}>
          Opening WhatsApp starts a chat — it does not mean your enquiry was submitted. Fields are
          optional.
        </p>
      </div>
    </form>
  );
}
