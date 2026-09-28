import { z } from "zod";
import { brand } from "@/lib/brand";

export const contactBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  query: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().or(z.literal("")),
  formStartedAt: z.number().optional(),
});

export type ContactBody = z.infer<typeof contactBodySchema>;

export async function sendContactEmail(body: ContactBody): Promise<{
  ok: true;
  mode: "resend" | "logged";
}> {
  const to = brand.contactEmail;
  const subject = `[${brand.shortName} Contact] Message from ${body.name}`;
  const text = [
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    "",
    "Query:",
    body.query,
    "",
    `— Sent from ${brand.name} contact form`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    `Salary Secure <onboarding@resend.dev>`;

  if (apiKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: body.email,
      subject,
      text,
    });
    if (error) {
      throw new Error(error.message || "Failed to send email");
    }
    return { ok: true, mode: "resend" };
  }

  // Local / unset env: log so the form still works in development
  console.info("[contact-email]", { to, subject, text });
  return { ok: true, mode: "logged" };
}
