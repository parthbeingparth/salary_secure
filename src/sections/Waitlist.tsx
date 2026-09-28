"use client";

import { useState } from "react";
import {
  coverageDurationOptions,
  coverageTiers,
  emiBands,
  salaryBands,
  savingsRunwayBands,
} from "@/data/plans";
import { brand } from "@/lib/brand";
import { formatINR } from "@/lib/format";
import { track } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";
import { Button } from "@/components/ui/Button";
import { Card, Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";
import type { WillingToPay } from "@/types";

type Channel = "whatsapp" | "email";

type FormState = {
  name: string;
  email: string;
  phone: string;
  whatsapp_consent: boolean;
  company: string;
  role: string;
  city: string;
  salary_band: string;
  emi_band: string;
  savings_runway: string;
  desired_monthly_protection: number;
  desired_duration: number;
  willing_to_pay: WillingToPay | "";
  website: string;
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  whatsapp_consent: false,
  company: "",
  role: "",
  city: "",
  salary_band: "",
  emi_band: "",
  savings_runway: "",
  desired_monthly_protection: 50000,
  desired_duration: 3,
  willing_to_pay: "",
  website: "",
};

export function Waitlist({
  embedded = false,
  hideMarketing = false,
}: {
  embedded?: boolean;
  hideMarketing?: boolean;
}) {
  const {
    researchPrice,
    waitlistChannel,
    setWaitlistChannel,
    willingToPay,
    setWillingToPay,
    selectedTier,
    setWaitlistSubmitted,
  } = useApp();
  const activeTier = coverageTiers.find((t) => t.id === selectedTier)!;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    ...initial,
    willing_to_pay: willingToPay ?? "",
  });
  const [formStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    runwayId: string;
    referralCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeStep = step === 0 && waitlistChannel ? 1 : step;

  function chooseChannel(channel: Channel) {
    setWaitlistChannel(channel);
    setStep(1);
    track("waitlist_started", { channel });
  }

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "whatsapp_consent" && value === true) {
      track("whatsapp_consent_given");
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    const utm = getStoredUtm();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: waitlistChannel === "email" ? form.email : null,
          phone: waitlistChannel === "whatsapp" ? form.phone : null,
          whatsapp_consent:
            waitlistChannel === "whatsapp" ? form.whatsapp_consent : false,
          company: form.company || null,
          role: form.role || null,
          city: form.city || null,
          salary_band: form.salary_band || null,
          emi_band: form.emi_band || null,
          savings_runway: form.savings_runway || null,
          desired_duration: form.desired_duration,
          displayed_price: researchPrice,
          willing_to_pay: form.willing_to_pay || willingToPay || null,
          referral_source: `tier:${selectedTier}`,
          desired_monthly_protection:
            form.desired_monthly_protection || activeTier.monthlyCap,
          website: form.website,
          formStartedAt,
          ...utm,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        runwayId?: string;
        referralCode?: string;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.runwayId || !data.referralCode) {
        throw new Error(data.error || "Something went wrong");
      }

      track("waitlist_completed", {
        channel: waitlistChannel,
        displayed_price: researchPrice,
        willing_to_pay: form.willing_to_pay,
        salary_band: form.salary_band,
        emi_band: form.emi_band,
      });
      if (form.willing_to_pay) {
        track("price_response", {
          tier: selectedTier,
          displayed_price: researchPrice,
          response: form.willing_to_pay,
          source: "waitlist",
        });
      }

      setSuccess({
        runwayId: data.runwayId,
        referralCode: data.referralCode,
      });
      setWaitlistSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to submit");
    } finally {
      setSubmitting(false);
    }
  }

  const shareUrl =
    typeof window !== "undefined" && success
      ? `${window.location.origin}/?ref=${success.referralCode}`
      : "";

  const shareText = `${brand.tagline} — ${brand.supportingProposition} Get Early Access: `;

  if (success) {
    const successInner = (
      <Card className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-navy-light">
          You&apos;re in.
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-graphite md:text-3xl">
          You&apos;re helping shape Salary Secure.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          We&apos;re learning what protection India&apos;s tech workforce
          actually wants.
        </p>
        <p className="mt-6 display-num text-sm font-medium tracking-[0.08em] text-slate">
          {success.runwayId}
        </p>
        <p className="mt-1 text-xs text-slate">
          Early-access reference — not a waitlist rank.
        </p>

        <p className="mt-8 text-base font-medium">
          Know someone whose salary is their biggest financial asset?
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={() => {
              track("referral_shared", { channel: "whatsapp" });
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              track("referral_shared", { channel: "linkedin" });
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            Share on LinkedIn
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              track("referral_shared", { channel: "copy" });
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          Your referral link uses ?ref={success.referralCode}
        </p>
      </Card>
    );

    if (embedded) {
      return <div id="waitlist-success">{successInner}</div>;
    }
    return <Section id="waitlist">{successInner}</Section>;
  }

  const formCard = (
      <Card className={`mx-auto max-w-xl ${embedded ? "!p-4" : ""}`}>
        {activeStep === 0 ? (
          <div>
            <p className="text-lg font-semibold">Get Early Access</p>
            <div className="mt-5 space-y-3">
              <Button className="w-full" onClick={() => chooseChannel("whatsapp")}>
                Continue with WhatsApp
              </Button>
              <p className="text-center text-xs text-accent">
                Get launch updates on WhatsApp
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => chooseChannel("email")}
              >
                Continue with Email
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">
              We will not add you to a public WhatsApp group. Phone numbers in
              groups are visible to other members. Opt-in is for Business /
              broadcast / future Community-style updates only.
            </p>
          </div>
        ) : null}

        {activeStep === 1 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted">Step 1 of 6 · Contact</p>
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent"
                value={form.name}
                onChange={(e) => patch("name", e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            {waitlistChannel === "whatsapp" ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium">Phone</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent"
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                    placeholder="10-digit Indian mobile"
                    autoComplete="tel"
                  />
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border"
                    checked={form.whatsapp_consent}
                    onChange={(e) =>
                      patch("whatsapp_consent", e.target.checked)
                    }
                  />
                  <span>
                    I agree to receive {brand.shortName} product research and
                    launch updates on WhatsApp.
                    <span className="mt-1 block text-xs text-muted">
                      No spam. Opt out anytime.
                    </span>
                  </span>
                </label>
              </>
            ) : (
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  inputMode="email"
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent"
                  value={form.email}
                  onChange={(e) => patch("email", e.target.value)}
                  autoComplete="email"
                />
              </label>
            )}
            {/* honeypot */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => patch("website", e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <Button
              className="w-full"
              disabled={
                !form.name ||
                (waitlistChannel === "email" && !form.email) ||
                (waitlistChannel === "whatsapp" &&
                  (!form.phone || !form.whatsapp_consent))
              }
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
            <p className="text-xs text-muted">
              Optional research questions next — you can skip fields.
            </p>
          </div>
        ) : null}

        {activeStep === 2 ? (
          <StepShell title="Company · Role · City" step={2} onBack={() => setStep(1)} onNext={() => setStep(3)}>
            {(
              [
                ["company", "Company"],
                ["role", "Role"],
                ["city", "City"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm font-medium">{label}</span>
                <input
                  className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent"
                  value={form[key]}
                  onChange={(e) => patch(key, e.target.value)}
                />
              </label>
            ))}
          </StepShell>
        ) : null}

        {activeStep === 3 ? (
          <StepShell title="Salary band" step={3} onBack={() => setStep(2)} onNext={() => setStep(4)}>
            <ChipGroup
              options={[...salaryBands]}
              value={form.salary_band}
              onChange={(v) => patch("salary_band", v)}
            />
          </StepShell>
        ) : null}

        {activeStep === 4 ? (
          <StepShell
            title="Current total EMI / month"
            step={4}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          >
            <ChipGroup
              options={[...emiBands]}
              value={form.emi_band}
              onChange={(v) => patch("emi_band", v)}
            />
          </StepShell>
        ) : null}

        {activeStep === 5 ? (
          <StepShell
            title="If you lost your salary tomorrow, how long could your savings cover your essential expenses?"
            step={5}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
          >
            <ChipGroup
              options={[...savingsRunwayBands]}
              value={form.savings_runway}
              onChange={(v) => patch("savings_runway", v)}
            />
          </StepShell>
        ) : null}

        {activeStep === 6 ? (
          <StepShell
            title="Desired protection tier"
            step={6}
            onBack={() => setStep(5)}
            onNext={() => setStep(7)}
          >
            <ChipGroup
              options={coverageTiers.map((t) => t.name)}
              value={activeTier.name}
              onChange={(label) => {
                const tier = coverageTiers.find((t) => t.name === label);
                if (!tier) return;
                patch("desired_monthly_protection", tier.monthlyCap);
                patch("desired_duration", tier.durationMonths);
                track("coverage_selected", {
                  tier: tier.id,
                  monthly_cap: tier.monthlyCap,
                  source: "waitlist",
                });
              }}
            />
            <p className="mt-3 text-xs text-slate">
              Proposed: up to {activeTier.salaryPercent}% of monthly take-home,
              capped at {formatINR(activeTier.monthlyCap)}/month for up to{" "}
              {activeTier.durationMonths} months.
            </p>
            <p className="mt-4 text-sm text-muted">Duration preference</p>
            <ChipGroup
              options={coverageDurationOptions.map((n) => `${n} months`)}
              value={`${form.desired_duration} months`}
              onChange={(label) => {
                const n = Number(label.split(" ")[0]);
                patch("desired_duration", n);
              }}
            />
          </StepShell>
        ) : null}

        {activeStep === 7 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted">Final step</p>
            <p className="text-base font-medium text-graphite">
              If protection like {activeTier.name} were available at ₹
              {researchPrice.toLocaleString("en-IN")}/month, would you seriously
              consider purchasing it?
            </p>
            <p className="text-sm text-slate">
              Research price only — not a premium. Cap{" "}
              {formatINR(activeTier.monthlyCap)}/month · up to{" "}
              {activeTier.durationMonths} months.
            </p>
            <ChipGroup
              options={["Yes", "Maybe", "No"]}
              value={
                (form.willing_to_pay || willingToPay) === "yes"
                  ? "Yes"
                  : (form.willing_to_pay || willingToPay) === "maybe"
                    ? "Maybe"
                    : (form.willing_to_pay || willingToPay) === "no"
                      ? "No"
                      : ""
              }
              onChange={(v) => {
                const mapped =
                  v === "Yes" ? "yes" : v === "Maybe" ? "maybe" : "no";
                patch("willing_to_pay", mapped);
                setWillingToPay(mapped);
              }}
            />
            {error ? (
              <p className="text-sm text-danger-muted" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(6)}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={submitting}
                onClick={() => void submit()}
              >
                {submitting ? "Submitting…" : "Join Early Access"}
              </Button>
            </div>
            <p className="text-xs text-muted">
              No payment required. Email or phone alone is enough to join.
            </p>
          </div>
        ) : null}
      </Card>
  );

  if (embedded || hideMarketing) {
    return <div id={embedded ? undefined : "waitlist"}>{formCard}</div>;
  }

  return (
    <Section id="waitlist">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Early access</p>
        <h2 className="headline-lg mt-3 text-graphite">
          Help shape Salary Secure.
        </h2>
        <p className="mt-3 text-slate">
          We&apos;re validating what meaningful income protection should look
          like before taking the product to insurers.
        </p>
      </div>
      <div className="mt-8">{formCard}</div>
    </Section>
  );
}

function StepShell({
  title,
  step,
  children,
  onBack,
  onNext,
}: {
  title: string;
  step: number;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-muted">
        Step {step} of 6 · Optional
      </p>
      <p className="text-base font-medium">{title}</p>
      {children}
      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={onNext}>
          Continue
        </Button>
        <Button variant="outline" onClick={onNext}>
          Skip
        </Button>
      </div>
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`min-h-11 rounded-xl border px-3 py-2 text-sm transition ${
            value === opt
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-card text-muted hover:border-accent/40"
          }`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
