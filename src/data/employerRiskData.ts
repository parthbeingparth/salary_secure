import type { RiskLabel } from "@/data/employerRiskConfig";

/**
 * Sample research data only. Replace with verified company research before
 * production use. Do NOT fabricate detailed financial facts.
 *
 * Future: may be replaced by verified external company intelligence.
 */
export type CuratedEmployer = {
  companyName: string;
  aliases: string[];
  stabilityScore: number;
  riskLabel: RiskLabel;
  lastUpdated: string;
  dataConfidence: "high" | "medium" | "low";
  notes?: string;
};

export const curatedEmployers: CuratedEmployer[] = [
  {
    companyName: "Microsoft",
    aliases: ["Microsoft India", "MSFT"],
    stabilityScore: 88,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "high",
  },
  {
    companyName: "Google",
    aliases: ["Google India", "Alphabet", "Alphabet Inc"],
    stabilityScore: 87,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "high",
  },
  {
    companyName: "Amazon",
    aliases: ["Amazon India", "AWS", "Amazon Web Services"],
    stabilityScore: 84,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "high",
  },
  {
    companyName: "Apple",
    aliases: ["Apple India"],
    stabilityScore: 90,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "high",
  },
  {
    companyName: "TCS",
    aliases: ["Tata Consultancy Services", "Tata Consultancy"],
    stabilityScore: 82,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Infosys",
    aliases: ["Infosys Ltd", "Infosys Limited"],
    stabilityScore: 81,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Wipro",
    aliases: ["Wipro Limited", "Wipro Ltd"],
    stabilityScore: 78,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Accenture",
    aliases: ["Accenture India"],
    stabilityScore: 83,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "IBM",
    aliases: ["IBM India"],
    stabilityScore: 80,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Flipkart",
    aliases: ["Flipkart Internet", "Flipkart India"],
    stabilityScore: 68,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Razorpay",
    aliases: ["Razorpay Software"],
    stabilityScore: 66,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Swiggy",
    aliases: ["Bundl Technologies", "Swiggy India"],
    stabilityScore: 62,
    riskLabel: "Elevated Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Zomato",
    aliases: ["Eternal Limited", "Zomato Ltd"],
    stabilityScore: 64,
    riskLabel: "Elevated Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "PhonePe",
    aliases: ["PhonePe Private"],
    stabilityScore: 70,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Paytm",
    aliases: ["One97 Communications", "Paytm Payments"],
    stabilityScore: 52,
    riskLabel: "Elevated Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Byju's",
    aliases: ["Byjus", "Think & Learn", "BYJU'S"],
    stabilityScore: 28,
    riskLabel: "Very High Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "low",
  },
  {
    companyName: "Ola",
    aliases: ["ANI Technologies", "Ola Cabs"],
    stabilityScore: 48,
    riskLabel: "High Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Freshworks",
    aliases: ["Freshworks Inc"],
    stabilityScore: 72,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Zoho",
    aliases: ["Zoho Corporation"],
    stabilityScore: 79,
    riskLabel: "Moderate Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
  {
    companyName: "Samsung",
    aliases: ["Samsung India", "Samsung Electronics"],
    stabilityScore: 85,
    riskLabel: "Low Risk",
    lastUpdated: "2026-09-01",
    dataConfidence: "medium",
  },
];
