import {
  ANSWER_SCORES,
  DISABLE_QUOTE_FOR_VERY_HIGH_RISK,
  FACTOR_WEIGHTS,
  PRESET_DEFAULTS,
  RISK_BANDS,
  type CompanyTypePresetId,
  type EmployerQuestionnaire,
  type FactorKey,
  type RiskBand,
  type RiskLabel,
} from "@/data/employerRiskConfig";
import {
  curatedEmployers,
  type CuratedEmployer,
} from "@/data/employerRiskData";

export type FactorBreakdown = Record<FactorKey, number>;

export type EmployerRiskResult = {
  companyName: string;
  source: "dataset" | "questionnaire" | "preset" | "none";
  datasetMatch: CuratedEmployer | null;
  stabilityScore: number;
  riskClass: RiskBand["riskClass"];
  riskLabel: RiskLabel;
  riskMultiplier: number;
  factors: FactorBreakdown;
  quoteDisabled: boolean;
};

function emptyFactors(): FactorBreakdown {
  return {
    financialStrength: 0,
    layoffHistory: 0,
    fundingStrength: 0,
    companyMaturity: 0,
    hiringTrend: 0,
    businessStability: 0,
    sectorVolatility: 0,
    restructuringSignals: 0,
  };
}

function clampFactor(key: FactorKey, value: number): number {
  return Math.max(0, Math.min(FACTOR_WEIGHTS[key], Math.round(value)));
}

export function normalizeCompanyKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findCuratedEmployer(name: string): CuratedEmployer | null {
  const key = normalizeCompanyKey(name);
  if (!key || key.length < 2) return null;

  for (const employer of curatedEmployers) {
    const candidates = [employer.companyName, ...employer.aliases];
    for (const candidate of candidates) {
      const c = normalizeCompanyKey(candidate);
      if (c === key || key.includes(c) || c.includes(key)) {
        return employer;
      }
    }
  }
  return null;
}

export function bandForScore(score: number): RiskBand {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const band of RISK_BANDS) {
    if (clamped >= band.min && clamped <= band.max) return band;
  }
  return RISK_BANDS[RISK_BANDS.length - 1]!;
}

/** Spread a total score across factors proportional to weights (for dataset matches). */
export function synthesizeFactorsFromScore(score: number): FactorBreakdown {
  const factors = emptyFactors();
  const ratio = Math.max(0, Math.min(100, score)) / 100;
  (Object.keys(FACTOR_WEIGHTS) as FactorKey[]).forEach((key) => {
    factors[key] = clampFactor(key, FACTOR_WEIGHTS[key] * ratio);
  });
  return factors;
}

export function scoreFromQuestionnaire(
  answers: EmployerQuestionnaire,
): { score: number; factors: FactorBreakdown } {
  const factors = emptyFactors();

  const apply = (partial?: Partial<Record<FactorKey, number>>) => {
    if (!partial) return;
    (Object.keys(partial) as FactorKey[]).forEach((key) => {
      const add = partial[key] ?? 0;
      factors[key] = clampFactor(key, factors[key] + add);
    });
  };

  if (answers.companySize) {
    apply(ANSWER_SCORES.companySize[answers.companySize]);
  }
  if (answers.companyKind) {
    apply(ANSWER_SCORES.companyKind[answers.companyKind]);
  }
  if (answers.fundingRecency) {
    apply(ANSWER_SCORES.fundingRecency[answers.fundingRecency]);
  }
  if (answers.layoffHistory) {
    apply(ANSWER_SCORES.layoffHistory[answers.layoffHistory]);
  }
  if (answers.hiringTrend) {
    apply(ANSWER_SCORES.hiringTrend[answers.hiringTrend]);
  }
  if (answers.companyAge) {
    apply(ANSWER_SCORES.companyAge[answers.companyAge]);
  }

  const score = (Object.keys(factors) as FactorKey[]).reduce(
    (sum, key) => sum + factors[key],
    0,
  );

  return { score: Math.max(0, Math.min(100, score)), factors };
}

export function questionnaireComplete(answers: EmployerQuestionnaire): boolean {
  return Boolean(
    answers.companySize &&
      answers.companyKind &&
      answers.fundingRecency &&
      answers.layoffHistory &&
      answers.hiringTrend &&
      answers.companyAge,
  );
}

export function computeEmployerRisk(input: {
  companyName: string;
  presetId?: CompanyTypePresetId | null;
  answers?: EmployerQuestionnaire;
}): EmployerRiskResult {
  const companyName = input.companyName.trim();
  const datasetMatch = findCuratedEmployer(companyName);

  if (datasetMatch) {
    const band = bandForScore(datasetMatch.stabilityScore);
    return {
      companyName: datasetMatch.companyName,
      source: "dataset",
      datasetMatch,
      stabilityScore: datasetMatch.stabilityScore,
      riskClass: band.riskClass,
      riskLabel: band.label,
      riskMultiplier: band.multiplier,
      factors: synthesizeFactorsFromScore(datasetMatch.stabilityScore),
      quoteDisabled:
        DISABLE_QUOTE_FOR_VERY_HIGH_RISK && band.label === "Very High Risk",
    };
  }

  const answers: EmployerQuestionnaire = {
    ...(input.presetId ? PRESET_DEFAULTS[input.presetId] : {}),
    ...input.answers,
  };

  const hasAnyAnswer = Object.values(answers).some(Boolean);
  if (!hasAnyAnswer) {
    const band = bandForScore(65);
    return {
      companyName,
      source: "none",
      datasetMatch: null,
      stabilityScore: 65,
      riskClass: band.riskClass,
      riskLabel: band.label,
      riskMultiplier: band.multiplier,
      factors: synthesizeFactorsFromScore(65),
      quoteDisabled: false,
    };
  }

  const { score, factors } = scoreFromQuestionnaire(answers);
  const band = bandForScore(score);
  return {
    companyName,
    source: questionnaireComplete(answers)
      ? "questionnaire"
      : input.presetId
        ? "preset"
        : "questionnaire",
    datasetMatch: null,
    stabilityScore: score,
    riskClass: band.riskClass,
    riskLabel: band.label,
    riskMultiplier: band.multiplier,
    factors,
    quoteDisabled:
      DISABLE_QUOTE_FOR_VERY_HIGH_RISK && band.label === "Very High Risk",
  };
}

export function formatRiskAdjustment(multiplier: number): string {
  const pct = Math.round((multiplier - 1) * 100);
  if (pct === 0) return "No adjustment";
  if (pct > 0) return `+${pct}%`;
  return `${pct}%`;
}
