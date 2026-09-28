"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  COMPANY_AGE_OPTIONS,
  COMPANY_KIND_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  COMPANY_TYPE_PRESETS,
  EMPLOYER_STABILITY_TOOLTIP,
  FACTOR_LABELS,
  FACTOR_WEIGHTS,
  FUNDING_RECENCY_OPTIONS,
  HIRING_TREND_OPTIONS,
  LAYOFF_HISTORY_OPTIONS,
  PRESET_DEFAULTS,
  type CompanyTypePresetId,
  type EmployerQuestionnaire,
  type FactorKey,
} from "@/data/employerRiskConfig";
import {
  computeEmployerRisk,
  findCuratedEmployer,
  questionnaireComplete,
  type EmployerRiskResult,
} from "@/lib/employerRisk";
import { track } from "@/lib/analytics";
import { InfoTooltip } from "@/components/ui/InfoTooltip";

type Props = {
  onRiskChange: (result: EmployerRiskResult) => void;
  /** Compact styling for mobile */
  variant?: "desktop" | "mobile";
};

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-graphite">{label}</span>
      <select
        className="mt-1.5 min-h-10 w-full rounded-lg border border-border bg-paper px-3 text-sm outline-none focus:ring-2 focus:ring-navy/25"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmployerRiskInputs({
  onRiskChange,
  variant = "desktop",
}: Props) {
  const [companyName, setCompanyName] = useState("");
  const [presetId, setPresetId] = useState<CompanyTypePresetId | null>(null);
  const [answers, setAnswers] = useState<EmployerQuestionnaire>({});
  const [showBreakdown, setShowBreakdown] = useState(false);

  const enteredTracked = useRef(false);
  const matchTracked = useRef<string | null>(null);
  const qStarted = useRef(false);
  const qCompleted = useRef(false);
  const riskTracked = useRef<string | null>(null);

  const datasetHit = useMemo(
    () => findCuratedEmployer(companyName),
    [companyName],
  );

  const questionnaireOpen =
    !datasetHit && (companyName.trim().length >= 2 || presetId != null);

  const risk = useMemo(
    () =>
      computeEmployerRisk({
        companyName,
        presetId,
        answers,
      }),
    [companyName, presetId, answers],
  );

  useEffect(() => {
    onRiskChange(risk);
  }, [risk, onRiskChange]);

  useEffect(() => {
    if (!companyName.trim() || enteredTracked.current) return;
    if (companyName.trim().length < 2) return;
    enteredTracked.current = true;
    track("employer_entered", { company_name: companyName.trim() });
  }, [companyName]);

  useEffect(() => {
    if (!datasetHit) return;
    const key = datasetHit.companyName;
    if (matchTracked.current === key) return;
    matchTracked.current = key;
    track("employer_dataset_match", {
      company_name: key,
      stability_score: datasetHit.stabilityScore,
      risk_label: datasetHit.riskLabel,
    });
  }, [datasetHit]);

  useEffect(() => {
    if (!questionnaireOpen || qStarted.current) return;
    qStarted.current = true;
    track("employer_questionnaire_started", {
      company_name: companyName.trim() || null,
    });
  }, [questionnaireOpen, companyName]);

  useEffect(() => {
    if (!questionnaireComplete(answers) || qCompleted.current) return;
    qCompleted.current = true;
    track("employer_questionnaire_completed", {
      company_name: companyName.trim() || null,
      company_size: answers.companySize,
      company_type: answers.companyKind,
      funding_recency: answers.fundingRecency,
      layoff_history: answers.layoffHistory,
      hiring_trend: answers.hiringTrend,
      company_age: answers.companyAge,
      stability_score: risk.stabilityScore,
      risk_label: risk.riskLabel,
    });
  }, [answers, companyName, risk.stabilityScore, risk.riskLabel]);

  useEffect(() => {
    if (risk.source === "none" && !companyName.trim() && !presetId) return;
    const key = `${risk.stabilityScore}:${risk.riskMultiplier}:${risk.source}`;
    if (riskTracked.current === key) return;
    riskTracked.current = key;
    track("employer_risk_calculated", {
      company_name: risk.companyName || companyName.trim() || null,
      stability_score: risk.stabilityScore,
      risk_label: risk.riskLabel,
      risk_multiplier: risk.riskMultiplier,
      source: risk.source,
    });
  }, [risk, companyName, presetId]);

  function patchAnswer<K extends keyof EmployerQuestionnaire>(
    key: K,
    value: EmployerQuestionnaire[K],
  ) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function onPreset(id: CompanyTypePresetId) {
    setPresetId(id);
    setAnswers((prev) => ({ ...PRESET_DEFAULTS[id], ...prev }));
  }

  const showScore = Boolean(companyName.trim() || presetId);
  const factorKeys = Object.keys(FACTOR_WEIGHTS) as FactorKey[];
  const isMobile = variant === "mobile";

  return (
    <div className="space-y-3.5">
      <label className="block">
        <span className="text-[13px] font-medium text-graphite">
          Where do you work?
        </span>
        <input
          type="text"
          autoComplete="organization"
          placeholder="e.g. Microsoft, Razorpay, Flipkart"
          className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-paper px-3 text-base outline-none focus:ring-2 focus:ring-navy/25"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-graphite">
          Company type
        </span>
        <select
          className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-paper px-3 text-sm outline-none focus:ring-2 focus:ring-navy/25"
          value={presetId ?? ""}
          onChange={(e) => {
            const v = e.target.value as CompanyTypePresetId | "";
            if (!v) {
              setPresetId(null);
              return;
            }
            onPreset(v);
          }}
        >
          <option value="">Select company type</option>
          {COMPANY_TYPE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      {datasetHit ? (
        <p className="text-[12px] text-teal">
          Matched research profile for {datasetHit.companyName}.
        </p>
      ) : null}

      {!datasetHit && questionnaireOpen ? (
        <div className="rounded-xl border border-border bg-ivory/50 p-3.5">
          <p className="text-[12px] font-semibold text-graphite">
            Help us estimate employer stability
          </p>
          <p className="mt-1 text-[11px] text-slate">
            Compact research inputs — used only for indicative pricing.
          </p>
          <div
            className={`mt-3 grid gap-3 ${isMobile ? "grid-cols-1" : "sm:grid-cols-2"}`}
          >
            <SelectField
              label="Company size"
              value={answers.companySize ?? ""}
              options={COMPANY_SIZE_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "companySize",
                  id as EmployerQuestionnaire["companySize"],
                )
              }
            />
            <SelectField
              label="Company type"
              value={answers.companyKind ?? ""}
              options={COMPANY_KIND_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "companyKind",
                  id as EmployerQuestionnaire["companyKind"],
                )
              }
            />
            <SelectField
              label="Last funding"
              value={answers.fundingRecency ?? ""}
              options={FUNDING_RECENCY_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "fundingRecency",
                  id as EmployerQuestionnaire["fundingRecency"],
                )
              }
            />
            <SelectField
              label="Layoff history"
              value={answers.layoffHistory ?? ""}
              options={LAYOFF_HISTORY_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "layoffHistory",
                  id as EmployerQuestionnaire["layoffHistory"],
                )
              }
            />
            <SelectField
              label="Hiring trend"
              value={answers.hiringTrend ?? ""}
              options={HIRING_TREND_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "hiringTrend",
                  id as EmployerQuestionnaire["hiringTrend"],
                )
              }
            />
            <SelectField
              label="Company age"
              value={answers.companyAge ?? ""}
              options={COMPANY_AGE_OPTIONS}
              onChange={(id) =>
                patchAnswer(
                  "companyAge",
                  id as EmployerQuestionnaire["companyAge"],
                )
              }
            />
          </div>
        </div>
      ) : null}

      {showScore ? (
        <div className="rounded-xl border border-border bg-paper p-3.5">
          <div className="flex items-center gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate">
              Estimated employer stability
            </p>
            <InfoTooltip label="About employer stability score">
              {EMPLOYER_STABILITY_TOOLTIP}
            </InfoTooltip>
          </div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="display-num text-3xl font-semibold leading-none text-navy">
              {risk.stabilityScore}
              <span className="text-base font-normal text-slate"> / 100</span>
            </p>
            <p className="text-sm font-medium text-graphite">{risk.riskLabel}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/80">
            <div
              className="h-full rounded-full bg-teal transition-all duration-300"
              style={{ width: `${risk.stabilityScore}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate">
            Based on research inputs and publicly available signals.
          </p>

          <button
            type="button"
            className="mt-3 text-[12px] text-navy-light underline-offset-2 hover:underline"
            aria-expanded={showBreakdown}
            onClick={() => setShowBreakdown((v) => !v)}
          >
            {showBreakdown
              ? "− Hide score breakdown"
              : isMobile
                ? "+ How was this calculated?"
                : "+ Why this employer score?"}
          </button>

          {showBreakdown ? (
            <ul className="mt-3 space-y-2 border-t border-border pt-3">
              {factorKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-center justify-between text-[12px]"
                >
                  <span className="text-slate">{FACTOR_LABELS[key]}</span>
                  <span className="display-num font-medium text-graphite">
                    {risk.factors[key]} / {FACTOR_WEIGHTS[key]}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
