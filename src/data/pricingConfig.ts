import type { CoverageTierId } from "@/data/plans";
import { DEFAULT_RISK_MULTIPLIER } from "@/data/employerRiskConfig";

/**
 * Market-research pricing assumptions only.
 * These are NOT actuarially validated insurance rates.
 * Do NOT present outputs as premiums, quotes, or final prices.
 *
 * Indicative Price = Base Protection Cost × Employer Risk Multiplier
 */

export type ProtectionDurationMonths = 3 | 6;

export const PROTECTION_DURATIONS: readonly {
  months: ProtectionDurationMonths;
  label: string;
  descriptor: string;
}[] = [
  { months: 3, label: "3 months", descriptor: "Standard protection" },
  { months: 6, label: "6 months", descriptor: "Extended protection" },
] as const;

export const DEFAULT_PROTECTION_DURATION: ProtectionDurationMonths = 3;

/** ± range around the base research estimate for display credibility */
export const PRICE_RANGE_PCT = 0.1;

/**
 * Research pricing rates as a fraction of maximum proposed benefit.
 * Keyed by duration months.
 */
export const researchPricingRates: Record<
  CoverageTierId,
  Record<ProtectionDurationMonths, number>
> = {
  secure_50: { 3: 0.035, 6: 0.05 },
  secure_75: { 3: 0.04, 6: 0.0575 },
  secure_100: { 3: 0.045, 6: 0.065 },
};

export const PRICE_DISCLAIMER_SHORT =
  "Research estimate only · Not an insurance quote.";

export const PRICE_DISCLAIMER_FULL =
  "Indicative research estimate only. This is not an insurance quote or premium. Salary Secure is currently validating the concept. Final pricing, coverage, exclusions and eligibility would be determined with a licensed insurer and applicable regulatory approvals.";

export const EXTENDED_DURATION_DISCLAIMER =
  "Extended 6-month protection is being explored as part of market research. Final availability may depend on insurer appetite, underwriting, waiting periods and product approval.";

export type ProtectionEstimate = {
  monthlyProtection: number;
  durationMonths: ProtectionDurationMonths;
  maximumBenefit: number;
  researchRate: number;
  /** Base cost before employer risk (exact) */
  baseAnnualCostExact: number;
  /** Base cost before employer risk (rounded) */
  baseAnnualCost: number;
  employerRiskMultiplier: number;
  /** Exact midpoint after risk adjustment, before consumer rounding */
  estimatedAnnualCostExact: number;
  /** Risk-adjusted annual estimate (rounded) */
  estimatedAnnualCost: number;
  monthlyEquivalent: number;
  annualLow: number;
  annualHigh: number;
  monthlyLow: number;
  monthlyHigh: number;
  priceAsSalaryPct: number | null;
  additionalRunwayMonths: number | null;
  protectedRunwayMonths: number | null;
  quoteDisabled: boolean;
  /** Optional employer research context for waitlist / analytics */
  employerCompanyName?: string | null;
  employerStabilityScore?: number | null;
  employerRiskLabel?: string | null;
};

export function getResearchRate(
  tierId: CoverageTierId,
  duration: ProtectionDurationMonths,
): number {
  return researchPricingRates[tierId][duration];
}

/** Round annual cost for consumer display (~₹500 or ~₹1,000). */
export function roundAnnualCost(amount: number): number {
  if (amount <= 0) return 0;
  if (amount < 20000) return Math.round(amount / 500) * 500;
  return Math.round(amount / 1000) * 1000;
}

/** Round monthly equivalent (~₹50 or ~₹100). */
export function roundMonthlyCost(amount: number): number {
  if (amount <= 0) return 0;
  if (amount < 2000) return Math.round(amount / 50) * 50;
  return Math.round(amount / 100) * 100;
}

export function formatApproxINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      const rounded = Math.round(lakhs * 10) / 10;
      return `~₹${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `~₹${Math.round(amount / 1000)}K`;
    }
  }
  return `~₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * monthlyProtection = min(salary × %, planCap)
 * maximumBenefit = monthlyProtection × duration
 * baseAnnualCost = maximumBenefit × researchRate
 * riskAdjustedAnnualCost = baseAnnualCost × employerRiskMultiplier
 * additionalRunway = maximumBenefit / monthlyCommittedExpenses
 */
export function computeProtectionEstimate(input: {
  monthlyTakeHome: number;
  monthlyCommittedExpenses: number;
  liquidSavings: number;
  severance?: number;
  salaryPercent: number;
  monthlyCap: number;
  tierId: CoverageTierId;
  durationMonths: ProtectionDurationMonths;
  employerRiskMultiplier?: number;
  quoteDisabled?: boolean;
  employerCompanyName?: string | null;
  employerStabilityScore?: number | null;
  employerRiskLabel?: string | null;
}): ProtectionEstimate {
  const {
    monthlyTakeHome,
    monthlyCommittedExpenses,
    liquidSavings,
    severance = 0,
    salaryPercent,
    monthlyCap,
    tierId,
    durationMonths,
    employerRiskMultiplier = DEFAULT_RISK_MULTIPLIER,
    quoteDisabled = false,
    employerCompanyName = null,
    employerStabilityScore = null,
    employerRiskLabel = null,
  } = input;

  const byPercent = Math.round(monthlyTakeHome * (salaryPercent / 100));
  const monthlyProtection =
    monthlyTakeHome <= 0 ? 0 : Math.min(byPercent, monthlyCap);

  const maximumBenefit = monthlyProtection * durationMonths;
  const researchRate = getResearchRate(tierId, durationMonths);
  const baseAnnualCostExact = maximumBenefit * researchRate;
  const baseAnnualCost = roundAnnualCost(baseAnnualCostExact);

  const estimatedAnnualCostExact =
    baseAnnualCostExact * employerRiskMultiplier;
  const estimatedAnnualCost = roundAnnualCost(estimatedAnnualCostExact);
  const monthlyEquivalent = roundMonthlyCost(estimatedAnnualCost / 12);

  const annualLow = roundAnnualCost(
    estimatedAnnualCostExact * (1 - PRICE_RANGE_PCT),
  );
  const annualHigh = roundAnnualCost(
    estimatedAnnualCostExact * (1 + PRICE_RANGE_PCT),
  );
  const monthlyLow = roundMonthlyCost(annualLow / 12);
  const monthlyHigh = roundMonthlyCost(annualHigh / 12);

  const priceAsSalaryPct =
    monthlyTakeHome > 0
      ? Math.round((monthlyEquivalent / monthlyTakeHome) * 1000) / 10
      : null;

  const currentRunway =
    monthlyCommittedExpenses > 0
      ? (liquidSavings + severance) / monthlyCommittedExpenses
      : null;

  const additionalRunwayMonths =
    monthlyCommittedExpenses > 0
      ? maximumBenefit / monthlyCommittedExpenses
      : null;

  const protectedRunwayMonths =
    currentRunway != null && additionalRunwayMonths != null
      ? currentRunway + additionalRunwayMonths
      : null;

  return {
    monthlyProtection,
    durationMonths,
    maximumBenefit,
    researchRate,
    baseAnnualCostExact,
    baseAnnualCost,
    employerRiskMultiplier,
    estimatedAnnualCostExact,
    estimatedAnnualCost,
    monthlyEquivalent,
    annualLow,
    annualHigh,
    monthlyLow,
    monthlyHigh,
    priceAsSalaryPct,
    additionalRunwayMonths,
    protectedRunwayMonths,
    quoteDisabled,
    employerCompanyName,
    employerStabilityScore,
    employerRiskLabel,
  };
}

export function estimateAnalyticsProps(
  estimate: ProtectionEstimate,
  extras: {
    plan: CoverageTierId;
    coverage_percentage: number;
    salary: number;
    duration_months: ProtectionDurationMonths;
  },
) {
  return {
    ...extras,
    monthly_protection: estimate.monthlyProtection,
    maximum_benefit: estimate.maximumBenefit,
    research_rate: estimate.researchRate,
    base_annual_cost: estimate.baseAnnualCost,
    risk_multiplier: estimate.employerRiskMultiplier,
    estimated_annual_cost: estimate.estimatedAnnualCost,
    risk_adjusted_annual_cost: estimate.estimatedAnnualCost,
    monthly_equivalent: estimate.monthlyEquivalent,
    price_as_salary_percentage: estimate.priceAsSalaryPct,
  };
}
