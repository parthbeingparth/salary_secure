/**
 * Public site configuration safe for the browser.
 * Only non-secret values may live here or in NEXT_PUBLIC_* vars.
 */
export const siteConfig = {
  /**
   * Salary Secure business WhatsApp number (digits only, country code included).
   * Example: 919876543210
   * Not a secret — deep links only. Never put WhatsApp API tokens here.
   */
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "",
  whatsappPrefillMessage:
    "Hi, I've joined the Salary Secure early-access list and would like to receive WhatsApp updates.",
} as const;

export function getWhatsAppDeepLink(message?: string): string | null {
  const number = siteConfig.whatsappNumber;
  if (!number) return null;
  const text = encodeURIComponent(
    message ?? siteConfig.whatsappPrefillMessage,
  );
  return `https://wa.me/${number}?text=${text}`;
}
