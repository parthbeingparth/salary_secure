import type { ProposedPlan } from "@/types";

export type CoverageTierId = "secure_50" | "secure_75" | "secure_100";

export type CoverageTier = {
  id: CoverageTierId;
  name: string;
  tagline: string;
  salaryPercent: number;
  monthlyCap: number;
  durationMonths: number;
  researchHighlight?: boolean;
  flagship?: boolean;
  /** Research-only willingness-to-pay price variants */
  priceVariants: readonly number[];
};

export const PRICE_EXPERIMENT_KEY_PREFIX = "salary_secure_price_variant_";

export const coverageTiers: CoverageTier[] = [
  {
    id: "secure_50",
    name: "SECURE 50",
    tagline: "Cover the essentials.",
    salaryPercent: 50,
    monthlyCap: 50000,
    durationMonths: 3,
    priceVariants: [499, 749, 999],
  },
  {
    id: "secure_75",
    name: "SECURE 75",
    tagline: "Protect more of your monthly income.",
    salaryPercent: 75,
    monthlyCap: 125000,
    durationMonths: 3,
    researchHighlight: true,
    priceVariants: [999, 1499, 1999],
  },
  {
    id: "secure_100",
    name: "SECURE 100",
    tagline: "Full salary protection concept.",
    salaryPercent: 100,
    monthlyCap: 250000,
    durationMonths: 3,
    flagship: true,
    priceVariants: [1999, 2999, 3999],
  },
];

export const proposedPlans: ProposedPlan[] = coverageTiers.map((tier) => ({
  id: tier.id as ProposedPlan["id"],
  name: tier.name,
  monthlyBenefit: tier.monthlyCap,
  durationMonths: tier.durationMonths,
  maxBenefit: tier.monthlyCap * tier.durationMonths,
  usesPriceExperiment: true,
  recommendedForResearch: tier.researchHighlight,
}));

export const salaryExampleOptions = [
  75000, 100000, 150000, 200000, 250000, 300000,
] as const;

export const coverageDurationOptions = [3, 6] as const;

/** Default illustrative salary for hero dashboard */
export const HERO_EXAMPLE_SALARY = 180000;

export const salaryBands = [
  "<₹10L",
  "₹10–20L",
  "₹20–30L",
  "₹30–50L",
  "₹50L+",
] as const;

export const emiBands = [
  "None",
  "<₹25K",
  "₹25–50K",
  "₹50K–₹1L",
  "₹1L+",
] as const;

export const savingsRunwayBands = [
  "<1 month",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
] as const;

/**
 * eligibleMonthlyProtection =
 *   min(monthlyTakeHome * selectedCoveragePercentage, selectedPlanMonthlyCap)
 */
export function eligibleMonthlyProtection(
  monthlyTakeHome: number,
  tier: CoverageTier,
): number {
  if (monthlyTakeHome <= 0) return 0;
  const byPercent = Math.round(
    monthlyTakeHome * (tier.salaryPercent / 100),
  );
  return Math.min(byPercent, tier.monthlyCap);
}

export function potentialMaxBenefit(
  monthlyTakeHome: number,
  tier: CoverageTier,
  durationMonths: number = tier.durationMonths,
): number {
  return eligibleMonthlyProtection(monthlyTakeHome, tier) * durationMonths;
}

export function isAtMonthlyCap(
  monthlyTakeHome: number,
  tier: CoverageTier,
): boolean {
  const byPercent = monthlyTakeHome * (tier.salaryPercent / 100);
  return byPercent > tier.monthlyCap;
}
