"use client";

import { useReducedMotion } from "motion/react";
import { useId, useMemo, useState, useTransition, type MouseEvent } from "react";
import type { AvailabilityDeliveryMode } from "@/lib/conversion/availability-whatsapp";
import {
  availabilityBranchPromptNeeded,
  buildWhatsAppAvailabilityUrl,
} from "@/lib/conversion/availability-whatsapp";
import { SECONDARY_TRIAL_FORM_HREF, WHATSAPP_REVIEW_HELPER } from "@/lib/conversion/whatsapp";
import styles from "./batch-availability.module.css";

export type AvailabilityServiceOption = {
  slug: string;
  name: string;
  deliveryMode: AvailabilityDeliveryMode;
};

export type AvailabilityBranchOption = {
  slug: string;
  locality: string;
};

export type AvailabilityEnquiryBuilderProps = {
  services: AvailabilityServiceOption[];
  branches: AvailabilityBranchOption[];
  fallbackHref?: string;
};

const BATCH_PREFERENCES = [
  { value: "", label: "No preference" },
  { value: "Mixed", label: "Mixed" },
  { value: "Ladies-only", label: "Ladies-only" },
  { value: "Kids-only", label: "Kids-only" },
] as const;

/**
 * Client island — prepares a WhatsApp availability enquiry.
 * Essential fields stay visible without animation; home/online swap fields instantly.
 */
export function AvailabilityEnquiryBuilder({
  services,
  branches,
  fallbackHref = SECONDARY_TRIAL_FORM_HREF,
}: AvailabilityEnquiryBuilderProps) {
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  const defaultService = services.find((s) => s.slug === "functional-training") ?? services[0];
  const [serviceSlug, setServiceSlug] = useState(defaultService?.slug ?? "");
  const [branchSlug, setBranchSlug] = useState("");
  const [locality, setLocality] = useState("");
  const [name, setName] = useState("");
  const [preferredDayTime, setPreferredDayTime] = useState("");
  const [batchPreference, setBatchPreference] = useState("");
  const [question, setQuestion] = useState("");
  const [showBranchHint, setShowBranchHint] = useState(false);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === serviceSlug) ?? defaultService,
    [services, serviceSlug, defaultService],
  );
  const deliveryMode: AvailabilityDeliveryMode = selectedService?.deliveryMode ?? "in-studio";
  const selectedBranch = branches.find((b) => b.slug === branchSlug);

  const href = useMemo(() => {
    return (
      buildWhatsAppAvailabilityUrl({
        deliveryMode,
        name: name.trim() || undefined,
        preferredBranch: selectedBranch?.locality,
        locality: locality.trim() || undefined,
        interestedService: selectedService?.name,
        preferredDayTime: preferredDayTime.trim() || undefined,
        batchPreference: deliveryMode === "in-studio" ? batchPreference || undefined : undefined,
        question: question.trim() || undefined,
      }) ?? fallbackHref
    );
  }, [
    deliveryMode,
    name,
    selectedBranch,
    locality,
    selectedService,
    preferredDayTime,
    batchPreference,
    question,
    fallbackHref,
  ]);

  function onServiceChange(nextSlug: string) {
    startTransition(() => {
      setServiceSlug(nextSlug);
      setShowBranchHint(false);
      const next = services.find((s) => s.slug === nextSlug);
      if (next && next.deliveryMode !== "in-studio") {
        setBranchSlug("");
        setBatchPreference("");
      }
      if (next && next.deliveryMode !== "home") {
        setLocality("");
      }
    });
  }

  function onOpenWhatsApp(event: MouseEvent<HTMLAnchorElement>) {
    if (availabilityBranchPromptNeeded(deliveryMode, selectedBranch?.locality)) {
      setShowBranchHint(true);
      // Soft prompt only — still allow opening WhatsApp without a branch.
    }
    if (!href.startsWith("http")) {
      event.preventDefault();
      window.location.href = href;
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
      }}
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
        {deliveryMode === "home" ? (
          <p className={styles.deliveryNote}>
            Training is delivered at your location — share your locality instead of a studio branch.
          </p>
        ) : null}
        {deliveryMode === "online" ? (
          <p className={styles.deliveryNote}>
            Remote sessions via Zoom — enquire for timing and format.
          </p>
        ) : null}
      </div>

      {deliveryMode === "in-studio" ? (
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
            Strongly recommended for studio services — you can still open WhatsApp without one.
          </p>
          {showBranchHint ? (
            <p id={`${baseId}-branch-hint`} className={styles.warn} role="status">
              Choosing a branch helps us confirm the right batches. You can still continue without one.
            </p>
          ) : null}
        </div>
      ) : null}

      {deliveryMode === "home" ? (
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
          <p className={styles.hint}>We do not publish a fixed coverage map — confirm on WhatsApp.</p>
        </div>
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
        <label htmlFor={`${baseId}-time`}>Preferred day / time</label>
        <input
          id={`${baseId}-time`}
          className={styles.control}
          value={preferredDayTime}
          onChange={(event) => setPreferredDayTime(event.target.value)}
          placeholder="e.g. Weekday evenings"
        />
        <p className={styles.hint}>Optional — we confirm what is available when you enquire.</p>
      </div>

      {deliveryMode === "in-studio" ? (
        <fieldset className={styles.field}>
          <legend>Batch preference</legend>
          <div className={styles.radioGroup} role="radiogroup" aria-label="Batch preference">
            {BATCH_PREFERENCES.map((option) => (
              <label key={option.value || "none"} className={styles.radioOption}>
                <input
                  type="radio"
                  name={`${baseId}-batch-pref`}
                  value={option.value}
                  checked={batchPreference === option.value}
                  onChange={() => setBatchPreference(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
          <p className={styles.hint}>
            Ladies-only and kids-only batches are available as options — exact fit is confirmed on
            enquiry.
          </p>
        </fieldset>
      ) : null}

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
          data-reduce-motion={reduceMotion ? "true" : "false"}
        >
          Check availability on WhatsApp
        </a>
        <p id={`${baseId}-note`} className={styles.ctaNote}>
          {WHATSAPP_REVIEW_HELPER} Fields are optional.
        </p>
      </div>
    </form>
  );
}
