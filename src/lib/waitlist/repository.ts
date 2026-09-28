import { generateCode, generateSecureId } from "@/lib/format";
import {
  normalizeIndianPhone,
  sanitizeString,
  type WaitlistBody,
} from "@/lib/waitlist/schema";
import { localInsert } from "@/lib/waitlist/local-store";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/waitlist/supabase";
import type { WaitlistRecord } from "@/types";

export type InsertResult = {
  ok: true;
  runwayId: string;
  referralCode: string;
  storage: "supabase" | "local";
};

function toRecord(body: WaitlistBody): WaitlistRecord {
  const email = sanitizeString(body.email || null);
  const phoneRaw = sanitizeString(body.phone || null);
  const phone = phoneRaw ? normalizeIndianPhone(phoneRaw) : null;

  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    runway_code: generateSecureId(),
    name: sanitizeString(body.name) ?? "",
    email,
    phone,
    whatsapp_consent: Boolean(body.whatsapp_consent && phone),
    city: sanitizeString(body.city),
    company: sanitizeString(body.company),
    role: sanitizeString(body.role),
    employment_type: sanitizeString(body.employment_type),
    company_tenure: sanitizeString(body.company_tenure),
    salary_band: sanitizeString(body.salary_band),
    monthly_expenses_band: sanitizeString(body.monthly_expenses_band),
    emi_band: sanitizeString(body.emi_band),
    savings_runway: sanitizeString(body.savings_runway),
    desired_monthly_protection: body.desired_monthly_protection ?? null,
    desired_duration: body.desired_duration ?? null,
    displayed_price: body.displayed_price ?? null,
    willing_to_pay: body.willing_to_pay ?? null,
    referral_source: sanitizeString(body.referral_source),
    utm_source: sanitizeString(body.utm_source),
    utm_medium: sanitizeString(body.utm_medium),
    utm_campaign: sanitizeString(body.utm_campaign),
    utm_content: sanitizeString(body.utm_content),
    referral_code: sanitizeString(body.referral_code) ?? generateCode(6),
  };
}

export async function insertWaitlist(
  body: WaitlistBody,
): Promise<InsertResult> {
  const record = toRecord(body);
  const referralCode = record.referral_code ?? generateCode(6);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Supabase client unavailable");

    const { error } = await supabase.from("waitlist").insert({
      id: record.id,
      created_at: record.created_at,
      name: record.name,
      email: record.email,
      phone: record.phone,
      whatsapp_consent: record.whatsapp_consent,
      city: record.city,
      company: record.company,
      role: record.role,
      employment_type: record.employment_type,
      company_tenure: record.company_tenure,
      salary_band: record.salary_band,
      monthly_expenses_band: record.monthly_expenses_band,
      emi_band: record.emi_band,
      savings_runway: record.savings_runway,
      desired_monthly_protection: record.desired_monthly_protection,
      desired_duration: record.desired_duration,
      displayed_price: record.displayed_price,
      willing_to_pay: record.willing_to_pay,
      referral_source: record.referral_source,
      utm_source: record.utm_source,
      utm_medium: record.utm_medium,
      utm_campaign: record.utm_campaign,
      utm_content: record.utm_content,
      referral_code: referralCode,
      runway_code: record.runway_code,
    });

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return {
      ok: true,
      runwayId: record.runway_code,
      referralCode,
      storage: "supabase",
    };
  }

  await localInsert({ ...record, referral_code: referralCode });
  return {
    ok: true,
    runwayId: record.runway_code,
    referralCode,
    storage: "local",
  };
}
