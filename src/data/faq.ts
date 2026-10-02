import { brand } from "@/lib/brand";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "What is Salary Secure?",
    answer:
      "Salary Secure is exploring salary insurance for salaried technology professionals — proposed insurer-backed income that could replace part or all of your take-home pay after an eligible involuntary layoff. It is currently a market-validation initiative, not a live policy.",
  },
  {
    question: "Is Salary Secure an insurance policy?",
    answer:
      "Not currently. Any future insurance product would be offered only through an appropriate regulated structure and licensed insurance partner.",
  },
  {
    question: "What does proposed backup income mean?",
    answer:
      "Under Salary Secure, 'backup' refers to the proposed monthly income-protection benefit that could be payable following an eligible involuntary layoff — not a separate product brand.",
  },
  {
    question: "What does 100% salary protection mean?",
    answer:
      "The concept being explored is protection of up to 100% of eligible monthly take-home salary, subject to a maximum of ₹2.5 lakh/month and final insurer terms.",
  },
  {
    question: "What counts as a layoff?",
    answer:
      "Under proposed terms, covered events would include company-wide layoffs, role redundancy, department shutdown, company closure, cost-cutting restructuring, and eligible involuntary termination unrelated to misconduct or performance. Final definitions are subject to insurer and regulatory approval.",
  },
  {
    question: "Would resignation be covered?",
    answer:
      "No. The concept is specifically designed around eligible involuntary layoffs.",
  },
  {
    question: "Would performance termination be covered?",
    answer:
      "Proposed terms would exclude performance-related termination and termination for misconduct. Eligibility details would be confirmed only after insurer and regulatory approval.",
  },
  {
    question: "What if I already know layoffs are coming?",
    answer:
      "Known or expected termination would likely be excluded under the proposed model. Waiting periods after enrollment are also being explored.",
  },
  {
    question: "Why would there be a waiting period?",
    answer:
      "A waiting period after enrollment is a common design for income-protection style products. It helps reduce adverse selection so the proposed plan can remain priced fairly if it advances past validation.",
  },
  {
    question: "What happens if I receive severance?",
    answer:
      "Severance interactions are still being researched. Any eventual product would define how severance, notice pay, and benefit timing interact — after verification and applicable waiting periods.",
  },
  {
    question: "Can I choose my protection amount?",
    answer:
      "Yes — the concept explores Secure 50 / 75 / 100 tiers covering up to 50%, 75%, or 100% of monthly take-home salary, capped at up to ₹2.5 lakh/month for up to 3 months. Final options depend on insurer and regulatory approval.",
  },
  {
    question: "Would Salary Secure replace my full salary?",
    answer:
      "Depending on the selected concept plan, Salary Secure is exploring protection of up to 100% of eligible monthly take-home salary, subject to a proposed maximum of ₹2.5 lakh/month and final insurer terms.",
  },
  {
    question: "Is pricing final?",
    answer:
      "No. Pricing shown during research is for willingness-to-pay validation only — never actual insurance premiums. Final pricing would be set only after product design, insurer partnership, and required approvals.",
  },
  {
    question: "When will Salary Secure launch?",
    answer: `${brand.shortName} will only be offered as a live product after receiving the required approvals from applicable government and regulatory authorities, and through an appropriate licensed structure. Until then, this site is solely for market validation. Timing depends on demand validation and those approvals.`,
  },
  {
    question: "Who can join early access?",
    answer:
      "Anyone interested in income protection for India's tech workforce can join — especially salaried technology professionals. Joining does not enroll you in a policy and does not require payment.",
  },
  {
    question: "Will you sell my information?",
    answer:
      "No. Early-access data is collected to validate demand and communicate launch updates you consent to. We do not sell your information. See our Privacy page for details.",
  },
];
