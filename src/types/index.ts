export type MarketStat = {
  id: string;
  value: number;
  displayValue: string;
  label: string;
  sourceName: string;
  sourceUrl: string;
  asOfDate: string;
  datasetStartDate: string;
  methodology: string;
  isEstimated: boolean;
  limitations?: string;
};

export type PlanId =
  | "secure_50"
  | "secure_75"
  | "secure_100"
  | "backup_50"
  | "backup_75"
  | "backup_100"
  | "essential"
  | "signature"
  | "executive"
  | "runway_25"
  | "runway_50"
  | "runway_100"
  | "runway_250";

export type ProposedPlan = {
  id: PlanId;
  name: string;
  monthlyBenefit: number;
  durationMonths: number;
  maxBenefit: number;
  /** Fixed indicative research price (tier A/B uses experiments instead) */
  indicativePrice?: number;
  usesPriceExperiment: boolean;
  recommendedForResearch?: boolean;
};

export type WillingToPay = "yes" | "maybe" | "no";

export type WaitlistPayload = {
  name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp_consent: boolean;
  city?: string | null;
  company?: string | null;
  role?: string | null;
  employment_type?: string | null;
  company_tenure?: string | null;
  salary_band?: string | null;
  monthly_expenses_band?: string | null;
  emi_band?: string | null;
  savings_runway?: string | null;
  desired_monthly_protection?: number | null;
  desired_duration?: number | null;
  displayed_price?: number | null;
  willing_to_pay?: WillingToPay | null;
  referral_source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  referral_code?: string | null;
  /** Bot protection */
  website?: string;
  formStartedAt?: number;
  turnstileToken?: string;
};

export type WaitlistRecord = WaitlistPayload & {
  id: string;
  created_at: string;
  runway_code: string;
};

export type AnalyticsEvent =
  | "page_view"
  | "hero_cta_clicked"
  | "runway_calculator_started"
  | "runway_calculator_completed"
  | "coverage_selected"
  | "duration_selected"
  | "plan_selected"
  | "estimated_price_displayed"
  | "willingness_to_pay_answered"
  | "early_access_clicked"
  | "price_displayed"
  | "price_response"
  | "waitlist_started"
  | "waitlist_completed"
  | "whatsapp_consent_given"
  | "referral_shared"
  | "source_clicked"
  | "employer_entered"
  | "employer_dataset_match"
  | "employer_questionnaire_started"
  | "employer_questionnaire_completed"
  | "employer_risk_calculated"
  | "risk_adjusted_price_displayed";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referral_code?: string;
};
