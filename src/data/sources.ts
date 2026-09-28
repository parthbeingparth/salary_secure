import {
  emiBurdenStat,
  globalTechLayoffs2026,
  indiaTechLayoffs2026,
  obligatorySpendStat,
  rbiStressReferenceStat,
} from "@/data/marketStats";
import type { MarketStat } from "@/types";

export type MethodologyEntry = {
  statistic: string;
  source: string;
  sourceUrl: string;
  publicationDate: string;
  datasetPeriod: string;
  explanation: string;
  limitations: string;
  stat: MarketStat;
};

export const methodologyEntries: MethodologyEntry[] = [
  {
    statistic: `${globalTechLayoffs2026.displayValue} ${globalTechLayoffs2026.label}`,
    source: globalTechLayoffs2026.sourceName,
    sourceUrl: globalTechLayoffs2026.sourceUrl,
    publicationDate: globalTechLayoffs2026.asOfDate,
    datasetPeriod: `${globalTechLayoffs2026.datasetStartDate} → ${globalTechLayoffs2026.asOfDate}`,
    explanation: globalTechLayoffs2026.methodology,
    limitations: globalTechLayoffs2026.limitations ?? "",
    stat: globalTechLayoffs2026,
  },
  {
    statistic: `${indiaTechLayoffs2026.displayValue} ${indiaTechLayoffs2026.label} (as of ${indiaTechLayoffs2026.asOfDate})`,
    source: indiaTechLayoffs2026.sourceName,
    sourceUrl: indiaTechLayoffs2026.sourceUrl,
    publicationDate: indiaTechLayoffs2026.asOfDate,
    datasetPeriod: `${indiaTechLayoffs2026.datasetStartDate} → ${indiaTechLayoffs2026.asOfDate}`,
    explanation: indiaTechLayoffs2026.methodology,
    limitations: indiaTechLayoffs2026.limitations ?? "",
    stat: indiaTechLayoffs2026,
  },
  {
    statistic: `${emiBurdenStat.displayValue} ${emiBurdenStat.label}`,
    source: emiBurdenStat.sourceName,
    sourceUrl: emiBurdenStat.sourceUrl,
    publicationDate: emiBurdenStat.asOfDate,
    datasetPeriod: "Study published February 2025 (3M+ tech-savvy consumers)",
    explanation: emiBurdenStat.methodology,
    limitations: emiBurdenStat.limitations ?? "",
    stat: emiBurdenStat,
  },
  {
    statistic: `${obligatorySpendStat.displayValue} ${obligatorySpendStat.label}`,
    source: obligatorySpendStat.sourceName,
    sourceUrl: obligatorySpendStat.sourceUrl,
    publicationDate: obligatorySpendStat.asOfDate,
    datasetPeriod: "Study published February 2025",
    explanation: obligatorySpendStat.methodology,
    limitations: obligatorySpendStat.limitations ?? "",
    stat: obligatorySpendStat,
  },
  {
    statistic: `${rbiStressReferenceStat.displayValue} — ${rbiStressReferenceStat.label} (microfinance repayment cap)`,
    source: rbiStressReferenceStat.sourceName,
    sourceUrl: rbiStressReferenceStat.sourceUrl,
    publicationDate: rbiStressReferenceStat.asOfDate,
    datasetPeriod: "RBI Master Direction (microfinance framework)",
    explanation: rbiStressReferenceStat.methodology,
    limitations: rbiStressReferenceStat.limitations ?? "",
    stat: rbiStressReferenceStat,
  },
];

export const sourceDirectory = [
  {
    name: "Layoffs.fyi",
    url: "https://layoffs.fyi",
    description: "Global technology layoff tracking based on public reports.",
  },
  {
    name: "OnJob India Layoff Tracker",
    url: "https://onjob.io/trends/layoffs/",
    description:
      "India-focused technology layoff events derived from public reporting.",
  },
  {
    name: "PwC India + Perfios — How India Spends",
    url: "https://perfios.ai/resources/blogs/earning-individuals-in-india-spend-over-33-salary-on-emis-reveals-perfios-pwc-report/",
    description:
      "Study covering 3M+ tech-savvy consumers; EMI and obligatory spending shares.",
  },
  {
    name: "Reserve Bank of India",
    url: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12256",
    description:
      "Microfinance lending framework — used only as a carefully contextualized stress reference.",
  },
] as const;
