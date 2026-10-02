/**
 * Central brand config — change values here to rename the product globally.
 */
export const brand = {
  /** Display wordmark (two words). Prefer stacked in tight nav if needed. */
  name: "SALARY SECURE",
  brandName: "Salary Secure",
  shortName: "Salary Secure",
  /** Line 1 / line 2 for stacked wordmarks */
  nameLines: ["SALARY", "SECURE"] as const,
  tagline: "Your salary stops. Your backup starts.",
  descriptor: "Salary insurance for India's tech workforce.",
  supportingProposition:
    "Salary Secure is exploring salary insurance — income protection that could replace part or all of your take-home pay after an unexpected layoff.",
  contextualLine: "Time to find the right job — not just the next one.",
  secondaryLine: "Salary insurance designed for the period between jobs.",
  alternativeSupporting: "Financial breathing room between jobs.",
  eyebrow: "Salary insurance for India's tech workforce",
  contactEmail: "parth@nivvesh.com",
  legalEntityPlaceholder: "[Legal entity name]",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://salarysecure.example.com",
  seo: {
    title: "Salary Secure — Salary Insurance for India's Tech Workforce",
    description:
      "Salary Secure is exploring salary insurance for technology professionals — proposed income protection after an eligible involuntary layoff.",
  },
  ogHeadline: "Your salary stops.\nYour backup starts.",
  ogSubtext: "Salary insurance for India's tech workforce.",
  regulatoryDisclaimer:
    "Salary Secure will only be offered as a live product after receiving the required approvals from applicable government and regulatory authorities, and through an appropriate licensed structure. Until then, this site is solely for market validation.",
  marketValidationDisclaimer:
    "Salary Secure is currently a market-validation initiative and does not presently offer an insurance policy. Illustrations, proposed benefits, eligibility criteria and pricing research shown on this website may change. Any future insurance product would be subject to applicable regulatory requirements and insurer approval.",
} as const;

export type Brand = typeof brand;
