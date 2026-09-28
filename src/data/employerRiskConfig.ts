/**
 * Employer risk research model for Salary Secure.
 *
 * Market-research assumptions only — NOT actuarially validated underwriting
 * and NOT an official insurance pricing engine.
 *
 * Future versions may replace the local dataset / questionnaire with verified
 * external company intelligence (funding databases, filings, layoff trackers,
 * hiring trends, exchange disclosures, company news). Do not add live API
 * integrations here until sources are reviewed.
 */

export type RiskLabel =
  | "Low Risk"
  | "Moderate Risk"
  | "Elevated Risk"
  | "High Risk"
  | "Very High Risk";

/** Internal risk class — prefer public RiskLabel in UI. */
export type RiskClass = "A" | "B" | "C" | "D" | "E";

export type FactorKey =
  | "financialStrength"
  | "layoffHistory"
  | "fundingStrength"
  | "companyMaturity"
  | "hiringTrend"
  | "businessStability"
  | "sectorVolatility"
  | "restructuringSignals";

/** Max points per factor (sum = 100). */
export const FACTOR_WEIGHTS: Record<FactorKey, number> = {
  financialStrength: 25,
  layoffHistory: 20,
  fundingStrength: 15,
  companyMaturity: 10,
  hiringTrend: 10,
  businessStability: 10,
  sectorVolatility: 5,
  restructuringSignals: 5,
};

export const FACTOR_LABELS: Record<FactorKey, string> = {
  financialStrength: "Financial strength",
  layoffHistory: "Layoff history",
  fundingStrength: "Funding strength",
  companyMaturity: "Company maturity",
  hiringTrend: "Hiring trend",
  businessStability: "Business stability",
  sectorVolatility: "Sector volatility",
  restructuringSignals: "Restructuring signals",
};

export type RiskBand = {
  min: number;
  max: number;
  riskClass: RiskClass;
  label: RiskLabel;
  multiplier: number;
};

export const RISK_BANDS: readonly RiskBand[] = [
  { min: 80, max: 100, riskClass: "A", label: "Low Risk", multiplier: 0.8 },
  { min: 65, max: 79, riskClass: "B", label: "Moderate Risk", multiplier: 1.0 },
  { min: 50, max: 64, riskClass: "C", label: "Elevated Risk", multiplier: 1.25 },
  { min: 35, max: 49, riskClass: "D", label: "High Risk", multiplier: 1.6 },
  { min: 0, max: 34, riskClass: "E", label: "Very High Risk", multiplier: 2.0 },
] as const;

/**
 * When true, Very High Risk employers show “Coverage may be unavailable”
 * instead of an indicative price. Keep false for market-research mode.
 */
export const DISABLE_QUOTE_FOR_VERY_HIGH_RISK = false;

export const DEFAULT_RISK_MULTIPLIER = 1.0;

export const EMPLOYER_STABILITY_DISCLAIMER =
  "Employer Stability Score is a research estimate based on selected inputs and publicly available information. It is not a credit rating, investment rating or prediction that a company will conduct layoffs.";

export const EMPLOYER_STABILITY_TOOLTIP =
  "This is a research estimate, not a credit rating or prediction of layoffs.";

/** Public company-type presets (not Tier labels). */
export const COMPANY_TYPE_PRESETS = [
  {
    id: "large_global",
    label: "Large global / listed company",
  },
  {
    id: "large_indian",
    label: "Large Indian enterprise",
  },
  {
    id: "late_startup",
    label: "Late-stage startup",
  },
  {
    id: "growth_startup",
    label: "Growth-stage startup",
  },
  {
    id: "early_startup",
    label: "Early-stage startup",
  },
  {
    id: "bootstrapped",
    label: "Very small / bootstrapped company",
  },
] as const;

export type CompanyTypePresetId = (typeof COMPANY_TYPE_PRESETS)[number]["id"];

export const COMPANY_SIZE_OPTIONS = [
  { id: "1_50", label: "1–50 employees" },
  { id: "51_200", label: "51–200" },
  { id: "201_1000", label: "201–1,000" },
  { id: "1001_5000", label: "1,001–5,000" },
  { id: "5000_plus", label: "5,000+" },
] as const;

export const COMPANY_KIND_OPTIONS = [
  { id: "listed", label: "Listed / public company" },
  { id: "profitable_private", label: "Profitable private company" },
  { id: "vc_backed", label: "VC-backed startup" },
  { id: "bootstrapped", label: "Bootstrapped startup" },
] as const;

export const FUNDING_RECENCY_OPTIONS = [
  { id: "lt_6", label: "< 6 months" },
  { id: "6_12", label: "6–12 months" },
  { id: "12_24", label: "12–24 months" },
  { id: "24_plus", label: "24+ months" },
  { id: "na_profitable", label: "Not applicable / profitable" },
] as const;

export const LAYOFF_HISTORY_OPTIONS = [
  { id: "none", label: "No known layoffs in last 24 months" },
  { id: "one", label: "One layoff round" },
  { id: "multiple", label: "Multiple layoff rounds" },
  { id: "major", label: "Major recent workforce reduction" },
] as const;

export const HIRING_TREND_OPTIONS = [
  { id: "active", label: "Hiring actively" },
  { id: "stable", label: "Stable" },
  { id: "slowed", label: "Hiring slowed" },
  { id: "freeze", label: "Hiring freeze / shrinking" },
] as const;

export const COMPANY_AGE_OPTIONS = [
  { id: "lt_2", label: "<2 years" },
  { id: "2_5", label: "2–5 years" },
  { id: "5_10", label: "5–10 years" },
  { id: "10_plus", label: "10+ years" },
] as const;

export type EmployerQuestionnaire = {
  companySize?: (typeof COMPANY_SIZE_OPTIONS)[number]["id"];
  companyKind?: (typeof COMPANY_KIND_OPTIONS)[number]["id"];
  fundingRecency?: (typeof FUNDING_RECENCY_OPTIONS)[number]["id"];
  layoffHistory?: (typeof LAYOFF_HISTORY_OPTIONS)[number]["id"];
  hiringTrend?: (typeof HIRING_TREND_OPTIONS)[number]["id"];
  companyAge?: (typeof COMPANY_AGE_OPTIONS)[number]["id"];
};

/**
 * Configurable answer → factor point maps.
 * Values are absolute points toward each factor’s max weight.
 */
export const ANSWER_SCORES = {
  companySize: {
    "5000_plus": { financialStrength: 10, businessStability: 10 },
    "1001_5000": { financialStrength: 8, businessStability: 8 },
    "201_1000": { financialStrength: 6, businessStability: 6 },
    "51_200": { financialStrength: 4, businessStability: 4 },
    "1_50": { financialStrength: 2, businessStability: 2 },
  },
  companyKind: {
    listed: { financialStrength: 15, fundingStrength: 12, sectorVolatility: 4 },
    profitable_private: {
      financialStrength: 12,
      fundingStrength: 10,
      sectorVolatility: 3,
    },
    vc_backed: {
      financialStrength: 8,
      fundingStrength: 9,
      sectorVolatility: 2,
    },
    bootstrapped: {
      financialStrength: 5,
      fundingStrength: 4,
      sectorVolatility: 2,
    },
  },
  fundingRecency: {
    lt_6: { fundingStrength: 15 },
    "6_12": { fundingStrength: 12 },
    "12_24": { fundingStrength: 8 },
    "24_plus": { fundingStrength: 4 },
    na_profitable: { fundingStrength: 14 },
  },
  layoffHistory: {
    none: { layoffHistory: 20, restructuringSignals: 5 },
    one: { layoffHistory: 13, restructuringSignals: 3 },
    multiple: { layoffHistory: 7, restructuringSignals: 2 },
    major: { layoffHistory: 2, restructuringSignals: 1 },
  },
  hiringTrend: {
    active: { hiringTrend: 10 },
    stable: { hiringTrend: 8 },
    slowed: { hiringTrend: 5 },
    freeze: { hiringTrend: 2 },
  },
  companyAge: {
    "10_plus": { companyMaturity: 10 },
    "5_10": { companyMaturity: 8 },
    "2_5": { companyMaturity: 5 },
    lt_2: { companyMaturity: 2 },
  },
} as const;

/** Seed questionnaire defaults from public company-type preset. */
export const PRESET_DEFAULTS: Record<
  CompanyTypePresetId,
  EmployerQuestionnaire
> = {
  large_global: {
    companySize: "5000_plus",
    companyKind: "listed",
    fundingRecency: "na_profitable",
    layoffHistory: "none",
    hiringTrend: "stable",
    companyAge: "10_plus",
  },
  large_indian: {
    companySize: "5000_plus",
    companyKind: "listed",
    fundingRecency: "na_profitable",
    layoffHistory: "none",
    hiringTrend: "stable",
    companyAge: "10_plus",
  },
  late_startup: {
    companySize: "201_1000",
    companyKind: "vc_backed",
    fundingRecency: "6_12",
    layoffHistory: "none",
    hiringTrend: "active",
    companyAge: "5_10",
  },
  growth_startup: {
    companySize: "51_200",
    companyKind: "vc_backed",
    fundingRecency: "12_24",
    layoffHistory: "one",
    hiringTrend: "slowed",
    companyAge: "2_5",
  },
  early_startup: {
    companySize: "1_50",
    companyKind: "vc_backed",
    fundingRecency: "lt_6",
    layoffHistory: "none",
    hiringTrend: "active",
    companyAge: "lt_2",
  },
  bootstrapped: {
    companySize: "1_50",
    companyKind: "bootstrapped",
    fundingRecency: "na_profitable",
    layoffHistory: "none",
    hiringTrend: "stable",
    companyAge: "2_5",
  },
};
