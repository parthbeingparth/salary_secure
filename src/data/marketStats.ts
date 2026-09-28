import type { MarketStat } from "@/types";

/**
 * Update statistics here — never hardcode display numbers inside components.
 * Counter pace = value / elapsed days between datasetStartDate and asOfDate.
 */
export const globalTechLayoffs2026: MarketStat = {
  id: "global_tech_layoffs_2026",
  value: 128000,
  displayValue: "128,000+",
  label: "reported global tech layoffs in 2026",
  sourceName: "Layoffs.fyi",
  sourceUrl: "https://layoffs.fyi",
  asOfDate: "2026-09-10",
  datasetStartDate: "2026-01-01",
  methodology:
    "Community-tracked count of publicly reported technology company layoff events worldwide. Floor figure based on disclosed headcounts; some announcements omit exact headcount.",
  isEstimated: true,
  limitations:
    "Trackers may miss unreported exits, phased reductions, and events without disclosed headcount. This is not a real-time feed.",
};

export const indiaTechLayoffs2026: MarketStat = {
  id: "india_tech_layoffs_2026",
  value: 4725,
  displayValue: "4,725",
  label: "people across 25 tracked Indian-tech layoff events",
  sourceName: "OnJob India Layoff Tracker",
  sourceUrl: "https://onjob.io/trends/layoffs/",
  asOfDate: "2026-09-14",
  datasetStartDate: "2026-01-01",
  methodology:
    "India-located events derived from Layoffs.fyi-style public reporting via OnJob's India tech layoff tracker. Counts reported, sizable events with company, date, location, and headcount where disclosed.",
  isEstimated: true,
  limitations:
    "Layoff trackers may not capture every job loss. Treat as a floor, not a complete census of Indian tech exits.",
};

export const emiBurdenStat: MarketStat = {
  id: "emi_burden_pwc_perfios",
  value: 33,
  displayValue: "33%+",
  label:
    "of monthly income goes toward loan EMIs among surveyed Indian earning individuals",
  sourceName: "PwC India + Perfios — How India Spends",
  sourceUrl:
    "https://perfios.ai/resources/blogs/earning-individuals-in-india-spend-over-33-salary-on-emis-reveals-perfios-pwc-report/",
  asOfDate: "2025-02-19",
  datasetStartDate: "2024-01-01",
  methodology:
    "Analysis of spending behaviour of more than 3 million tech-savvy consumers. Individuals across city tiers allocate more than 33% of income toward loan EMIs.",
  isEstimated: false,
  limitations:
    "Sample is tech-savvy consumers in the Perfios dataset — not a census of all Indian households. Do not equate with a 50% 'average EMI' claim.",
};

export const obligatorySpendStat: MarketStat = {
  id: "obligatory_spend_pwc_perfios",
  value: 39,
  displayValue: "39%",
  label: "of spending went toward obligatory expenses in the same study",
  sourceName: "PwC India + Perfios — How India Spends",
  sourceUrl:
    "https://www.pwc.in/assets/pdfs/how-india-spends-a-deep-dive-into-consumers-pending-behaviour.pdf",
  asOfDate: "2025-02-19",
  datasetStartDate: "2024-01-01",
  methodology:
    "Obligatory expenditures (loan repayments and insurance premiums) accounted for 39% of total spending in the study, ahead of necessities (32%) and discretionary (29%).",
  isEstimated: false,
  limitations:
    "Obligatory share includes EMIs and insurance premiums. Composition varies by salary bracket.",
};

export const rbiStressReferenceStat: MarketStat = {
  id: "rbi_microfinance_50_percent",
  value: 50,
  displayValue: "50%",
  label: "When debt becomes especially restrictive",
  sourceName: "Reserve Bank of India — Microfinance framework",
  sourceUrl:
    "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12256",
  asOfDate: "2022-07-25",
  datasetStartDate: "2022-07-25",
  methodology:
    "Under RBI's Regulatory Framework for Microfinance Loans, regulated entities must ensure household monthly loan repayment obligations do not exceed 50% of monthly household income. This is a lending stress reference — NOT India's average EMI burden, and NOT a general rule applying to every salaried technology employee.",
  isEstimated: false,
  limitations:
    "Applies to household repayment obligations under the microfinance framework for low-income households as defined by RBI. Must not be presented as the average EMI burden for Indian tech employees.",
};

export const marketStats = [
  globalTechLayoffs2026,
  indiaTechLayoffs2026,
  emiBurdenStat,
  obligatorySpendStat,
  rbiStressReferenceStat,
] as const;

/** Elapsed days represented by a dataset (inclusive calendar span). */
export function elapsedDaysInDataset(stat: MarketStat): number {
  const start = new Date(stat.datasetStartDate + "T00:00:00Z");
  const end = new Date(stat.asOfDate + "T00:00:00Z");
  const ms = end.getTime() - start.getTime();
  const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  return days;
}

/** Reported layoffs per day based on dataset window — not real-time. */
export function reportedLayoffsPerDay(stat: MarketStat): number {
  return Math.round(stat.value / elapsedDaysInDataset(stat));
}
