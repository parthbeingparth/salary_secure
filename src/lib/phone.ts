/** Accept 10-digit Indian mobiles (optionally prefixed with +91 / 91 / 0). */
export function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let local = digits;
  if (local.length === 12 && local.startsWith("91")) {
    local = local.slice(2);
  } else if (local.length === 11 && local.startsWith("0")) {
    local = local.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return `+91${local}`;
}

export function isValidIndianMobile(raw: string): boolean {
  return normalizeIndianMobile(raw) != null;
}
