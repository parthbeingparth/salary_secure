export const proposedCoveredEvents = [
  "Company-wide layoff",
  "Role redundancy",
  "Department shutdown",
  "Company closure",
  "Cost-cutting restructuring",
  "Eligible involuntary termination unrelated to misconduct/performance",
] as const;

export const proposedExclusions = [
  "Voluntary resignation",
  "Termination for misconduct",
  "Performance-related termination",
  "Contract expiry",
  "Already serving notice when joining",
  "Known upcoming termination",
  "Fraudulent employment information",
] as const;

export const potentialEligibility = [
  "Full-time salaried technology employee",
  "Minimum employment tenure",
  "Not currently on probation",
  "Waiting period after enrollment",
  "Employment and salary verification",
] as const;

export const TERMS_SUBJECT_TO_APPROVAL =
  "Proposed terms — subject to insurer and regulatory approval.";

export const expenseChips = [
  "Home loan",
  "Rent",
  "Car EMI",
  "Education loan",
  "Parents",
  "Credit cards",
  "SIPs",
  "Insurance",
  "Groceries",
  "School fees",
] as const;
