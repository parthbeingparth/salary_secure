import { z } from "zod";

const indianPhoneRegex = /^(?:\+?91[\-\s]?)?[6-9]\d{9}$/;

export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91${digits.slice(2)}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return phone.trim();
}

export const waitlistBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .optional()
      .nullable()
      .or(z.literal("")),
    phone: z.string().trim().max(20).optional().nullable().or(z.literal("")),
    whatsapp_consent: z.boolean().default(false),
    city: z.string().trim().max(100).optional().nullable(),
    company: z.string().trim().max(150).optional().nullable(),
    role: z.string().trim().max(150).optional().nullable(),
    employment_type: z.string().trim().max(80).optional().nullable(),
    company_tenure: z.string().trim().max(80).optional().nullable(),
    salary_band: z.string().trim().max(40).optional().nullable(),
    monthly_expenses_band: z.string().trim().max(40).optional().nullable(),
    emi_band: z.string().trim().max(40).optional().nullable(),
    savings_runway: z.string().trim().max(40).optional().nullable(),
    desired_monthly_protection: z.number().int().positive().optional().nullable(),
    desired_duration: z.number().int().positive().optional().nullable(),
    displayed_price: z.number().int().positive().optional().nullable(),
    willing_to_pay: z.enum(["yes", "maybe", "no"]).optional().nullable(),
    referral_source: z.string().trim().max(80).optional().nullable(),
    utm_source: z.string().trim().max(120).optional().nullable(),
    utm_medium: z.string().trim().max(120).optional().nullable(),
    utm_campaign: z.string().trim().max(120).optional().nullable(),
    utm_content: z.string().trim().max(120).optional().nullable(),
    referral_code: z.string().trim().max(40).optional().nullable(),
    website: z.string().max(0).optional().or(z.literal("")),
    formStartedAt: z.number().optional(),
    turnstileToken: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const email = data.email?.trim() || null;
    const phoneRaw = data.phone?.trim() || null;

    if (!email && !phoneRaw) {
      ctx.addIssue({
        code: "custom",
        message: "Email or phone is required",
        path: ["email"],
      });
    }

    if (phoneRaw && !indianPhoneRegex.test(phoneRaw)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid Indian mobile number",
        path: ["phone"],
      });
    }

    if (phoneRaw && !data.whatsapp_consent) {
      ctx.addIssue({
        code: "custom",
        message: "WhatsApp consent is required when providing a phone number",
        path: ["whatsapp_consent"],
      });
    }
  });

export type WaitlistBody = z.infer<typeof waitlistBodySchema>;

export function sanitizeString(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/[<>]/g, "");
}
