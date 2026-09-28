"use client";

import { useEffect, useRef, useState } from "react";
import { coverageTiers } from "@/data/plans";
import { brand } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import {
  checkMathAnswer,
  createMathChallenge,
  type MathChallenge,
} from "@/lib/math-challenge";
import {
  NETLIFY_FORM_WAITLIST,
  submitNetlifyForm,
} from "@/lib/netlify-forms";
import { normalizeIndianMobile } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { HoneypotField } from "@/components/HoneypotField";
import { MathVerification } from "@/components/MathVerification";
import { useApp } from "@/components/AppProviders";
import type { WillingToPay } from "@/types";

type Phase =
  | "idle"
  | "verification_required"
  | "submitting"
  | "wtp"
  | "success"
  | "error";

/**
 * Early access signup via Netlify Forms (AJAX).
 * Email required; WhatsApp number optional for future outreach (no business deep-link).
 * Math challenge is UX friction only — honeypot + Netlify spam filtering are primary.
 */
export function EarlyAccessCard() {
  const {
    researchPrice,
    selectedTier,
    durationMonths,
    lastEstimate,
    setWaitlistChannel,
    setWillingToPay,
    setWaitlistSubmitted,
    willingToPay,
  } = useApp();
  const activeTier = coverageTiers.find((t) => t.id === selectedTier)!;
  const monthlyAsk = lastEstimate?.monthlyEquivalent ?? researchPrice;
  const monthlyAskLabel = `₹${monthlyAsk.toLocaleString("en-IN")}`;

  const [phase, setPhase] = useState<Phase>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mathError, setMathError] = useState<string | null>(null);
  const [mathAnswer, setMathAnswer] = useState("");
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [wtp, setWtp] = useState<WillingToPay | "">(willingToPay ?? "");
  const submittingLock = useRef(false);
  const startedTracked = useRef(false);

  useEffect(() => {
    setWaitlistChannel("email");
  }, [setWaitlistChannel]);

  function markStarted() {
    if (startedTracked.current) return;
    startedTracked.current = true;
    track("waitlist_started", {
      channel: "email",
      source: "early_access_card",
    });
  }

  function validateContact(): string | null {
    if (!name.trim()) return "Please enter your name";
    const e = email.trim();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return "Please enter a valid email";
    }
    if (whatsapp.trim()) {
      if (!normalizeIndianMobile(whatsapp)) {
        return "Enter a valid 10-digit WhatsApp number, or leave it blank";
      }
      if (!whatsappConsent) {
        return "Please confirm WhatsApp consent if you share a number";
      }
    }
    if (honeypot) return "Something went wrong. Please try again.";
    return null;
  }

  function onPrimaryClick() {
    if (phase === "submitting" || submittingLock.current) return;

    const validationError = validateContact();
    if (validationError) {
      setError(validationError);
      setPhase("error");
      return;
    }
    setError(null);

    if (phase !== "verification_required") {
      setChallenge(createMathChallenge());
      setMathAnswer("");
      setMathError(null);
      setFailCount(0);
      setPhase("verification_required");
      return;
    }

    if (!checkMathAnswer(challenge, mathAnswer)) {
      const nextFails = failCount + 1;
      setFailCount(nextFails);
      setMathError("That doesn't look right. Try again.");
      if (nextFails >= 2) {
        setChallenge(createMathChallenge());
        setMathAnswer("");
        setFailCount(0);
      }
      return;
    }

    setPhase("wtp");
  }

  async function submitForm(finalWtp: WillingToPay | "" = wtp) {
    if (submittingLock.current) return;
    submittingLock.current = true;
    setPhase("submitting");
    setError(null);
    setMathError(null);

    const utm = getStoredUtm();
    const normalizedPhone = whatsapp.trim()
      ? normalizeIndianMobile(whatsapp)
      : null;

    const result = await submitNetlifyForm(NETLIFY_FORM_WAITLIST, {
      "bot-field": honeypot,
      name: name.trim(),
      email: email.trim(),
      phone: normalizedPhone ?? "",
      contact_method: "email",
      whatsapp_consent: normalizedPhone && whatsappConsent ? "true" : "false",
      source: "early_access_card",
      utm_source: utm.utm_source ?? "",
      utm_medium: utm.utm_medium ?? "",
      utm_campaign: utm.utm_campaign ?? "",
      selected_plan: selectedTier,
      selected_duration: durationMonths,
      estimated_annual_cost: lastEstimate?.estimatedAnnualCost ?? "",
      monthly_protection:
        lastEstimate?.monthlyProtection ?? activeTier.monthlyCap,
      willing_to_pay: finalWtp || "",
      company_name: lastEstimate?.employerCompanyName ?? "",
      employer_stability_score: lastEstimate?.employerStabilityScore ?? "",
      employer_risk_label: lastEstimate?.employerRiskLabel ?? "",
      risk_multiplier: lastEstimate?.employerRiskMultiplier ?? "",
    });

    if (!result.ok) {
      setError(result.error);
      setPhase("wtp");
      submittingLock.current = false;
      return;
    }

    if (normalizedPhone && whatsappConsent) {
      track("whatsapp_consent_given", { source: "early_access_card" });
    }

    track("waitlist_completed", {
      channel: "email",
      has_whatsapp: Boolean(normalizedPhone),
      displayed_price: monthlyAsk,
      willing_to_pay: finalWtp || null,
      duration_months: durationMonths,
      plan: selectedTier,
      estimated_annual_cost: lastEstimate?.estimatedAnnualCost,
      monthly_equivalent: lastEstimate?.monthlyEquivalent,
      monthly_protection: lastEstimate?.monthlyProtection,
      maximum_benefit: lastEstimate?.maximumBenefit,
    });

    if (finalWtp) setWillingToPay(finalWtp);
    setWaitlistSubmitted(true);
    submittingLock.current = false;
    setPhase("success");
  }

  function answerWtp(value: WillingToPay | "") {
    setWtp(value);
    void submitForm(value);
  }

  if (phase === "success") {
    return (
      <div
        id="waitlist-success"
        className="rounded-[var(--radius)] border border-border bg-paper p-6 text-center md:p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-navy-light">
          You&apos;re in.
        </p>
        <h3 className="mt-3 text-xl font-semibold text-graphite">
          You&apos;re now on the Salary Secure early-access list.
        </h3>
        <p className="mt-2 text-sm text-slate">
          We&apos;ll email you with research updates as Salary Secure moves
          forward
          {whatsapp.trim()
            ? ", and may reach out on WhatsApp if you opted in"
            : ""}
          .
        </p>
      </div>
    );
  }

  if (phase === "wtp" || phase === "submitting") {
    const busy = phase === "submitting";
    return (
      <div className="rounded-[var(--radius)] border border-border bg-paper p-6 md:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
          Quick research · {activeTier.name}
        </p>
        <h3 className="mt-3 text-lg font-semibold text-graphite">
          Would you seriously consider Salary Secure at approximately{" "}
          {monthlyAskLabel}/month?
        </h3>
        <p className="mt-2 text-xs text-slate">
          Indicative research estimate · Not an insurance quote or premium.
        </p>
        <div className="mt-5 flex gap-2">
          {(
            [
              ["yes", "Yes"],
              ["maybe", "Maybe"],
              ["no", "No"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              variant={wtp === value ? "primary" : "outline"}
              className="flex-1"
              disabled={busy}
              onClick={() => answerWtp(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 text-sm text-slate underline-offset-2 hover:underline"
          disabled={busy}
          onClick={() => answerWtp("")}
        >
          {busy ? "Submitting…" : "Skip for now"}
        </button>
        {error ? (
          <p className="mt-3 text-sm text-danger-muted" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const busy = false;
  const showMath = phase === "verification_required";

  return (
    <div className="rounded-[var(--radius)] border border-border bg-paper p-6 md:p-7">
      <h3 className="text-xl font-semibold text-graphite">Get Early Access</h3>
      <p className="mt-1.5 text-sm text-slate">
        Be among the first to hear when {brand.shortName} moves forward.
      </p>

      <form
        name={NETLIFY_FORM_WAITLIST}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={(e) => {
          e.preventDefault();
          onPrimaryClick();
        }}
        className="mt-5 space-y-3.5"
      >
        <input type="hidden" name="form-name" value={NETLIFY_FORM_WAITLIST} />

        <label className="block">
          <span className="text-[13px] font-medium text-graphite">Name</span>
          <input
            name="name"
            required
            disabled={busy}
            className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-ivory/40 px-3 outline-none focus:ring-2 focus:ring-navy/25 disabled:opacity-60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={markStarted}
            autoComplete="name"
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-graphite">Email</span>
          <input
            type="email"
            name="email"
            inputMode="email"
            required
            disabled={busy}
            className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-ivory/40 px-3 outline-none focus:ring-2 focus:ring-navy/25 disabled:opacity-60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={markStarted}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="text-[13px] font-medium text-graphite">
            WhatsApp number{" "}
            <span className="font-normal text-slate">(optional)</span>
          </span>
          <div className="mt-1.5 flex items-center rounded-lg border border-border bg-ivory/40 focus-within:ring-2 focus-within:ring-navy/25">
            <span className="pl-3 text-sm text-slate">+91</span>
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              disabled={busy}
              className="min-h-11 w-full bg-transparent px-2 outline-none disabled:opacity-60"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10));
                if (!e.target.value) setWhatsappConsent(false);
              }}
              onFocus={markStarted}
              placeholder="10-digit mobile"
              autoComplete="tel-national"
            />
          </div>
        </label>

        {whatsapp.trim() ? (
          <label className="flex items-start gap-3 text-sm text-graphite">
            <input
              type="checkbox"
              name="whatsapp_consent"
              className="mt-1 h-4 w-4 rounded border-border"
              checked={whatsappConsent}
              disabled={busy}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
            />
            <span>
              I agree to receive {brand.shortName} research and launch updates
              on WhatsApp.
              <span className="mt-1 block text-xs text-slate">
                Optional. Never pre-checked. Opt out anytime.
              </span>
            </span>
          </label>
        ) : null}

        <HoneypotField value={honeypot} onChange={setHoneypot} />

        {showMath && challenge ? (
          <MathVerification
            challenge={challenge}
            answer={mathAnswer}
            onAnswerChange={(v) => {
              setMathAnswer(v);
              setMathError(null);
            }}
            error={mathError}
            disabled={busy}
          />
        ) : null}

        {error ? (
          <p className="text-sm text-danger-muted" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy
            ? "Submitting…"
            : showMath
              ? "Verify & Send"
              : "Get Early Access"}
        </Button>
      </form>
    </div>
  );
}
