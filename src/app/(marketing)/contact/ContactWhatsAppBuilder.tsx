"use client";

import { useId, useMemo, useState } from "react";
import {
  buildWhatsAppTrialUrl,
  WHATSAPP_REVIEW_HELPER,
} from "@/lib/conversion/whatsapp";

export type ContactBranchOption = {
  slug: string;
  locality: string;
};

export type ContactWhatsAppBuilderProps = {
  branches: ContactBranchOption[];
  fallbackHref: string;
};

const controlClass =
  "w-full min-h-11 border border-black/15 bg-white px-3 text-[var(--color-ink)] placeholder:text-black/45";

/**
 * WhatsApp-only general enquiry — no server form, no pretend delivery.
 * Light controls match pricing/timetable builders for contrast.
 */
export function ContactWhatsAppBuilder({
  branches,
  fallbackHref,
}: ContactWhatsAppBuilderProps) {
  const baseId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchSlug, setBranchSlug] = useState("");
  const [question, setQuestion] = useState("");

  const selectedBranch = branches.find((b) => b.slug === branchSlug);

  const href = useMemo(() => {
    return (
      buildWhatsAppTrialUrl({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        preferredBranch: selectedBranch?.locality,
        question: question.trim()
          ? question.trim()
          : "I have a general enquiry.",
      }) ?? fallbackHref
    );
  }, [name, phone, selectedBranch, question, fallbackHref]);

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor={`${baseId}-name`}
          className="mb-1.5 block text-sm font-medium text-ink-inverse"
        >
          Name
        </label>
        <input
          id={`${baseId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={controlClass}
        />
      </div>
      <div>
        <label
          htmlFor={`${baseId}-phone`}
          className="mb-1.5 block text-sm font-medium text-ink-inverse"
        >
          Phone
        </label>
        <input
          id={`${baseId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={controlClass}
        />
      </div>
      <div>
        <label
          htmlFor={`${baseId}-branch`}
          className="mb-1.5 block text-sm font-medium text-ink-inverse"
        >
          Preferred branch (optional)
        </label>
        <select
          id={`${baseId}-branch`}
          name="branch"
          value={branchSlug}
          onChange={(e) => setBranchSlug(e.target.value)}
          className={controlClass}
        >
          <option value="">Any / not sure</option>
          {branches.map((branch) => (
            <option key={branch.slug} value={branch.slug}>
              {branch.locality}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor={`${baseId}-question`}
          className="mb-1.5 block text-sm font-medium text-ink-inverse"
        >
          Message
        </label>
        <textarea
          id={`${baseId}-question`}
          name="question"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={`${controlClass} py-2`}
        />
      </div>
      <p className="text-sm text-[var(--color-muted-on-field)]">
        {WHATSAPP_REVIEW_HELPER}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="pulse-cta inline-flex"
      >
        Continue on WhatsApp
      </a>
    </div>
  );
}
