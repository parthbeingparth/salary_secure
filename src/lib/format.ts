export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${Math.round(amount / 1000)}K`;
    }
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return "—";
  if (months === Infinity) return "∞";
  const rounded = Math.round(months * 10) / 10;
  return `${rounded} month${rounded === 1 ? "" : "s"}`;
}

export function formatAsOfDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Generate a short alphanumeric code (e.g. ABC123). */
export function generateCode(length = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
  }
  return out;
}

export function generateSecureId(): string {
  return `SS #${generateCode(4)}`;
}

/** @deprecated use generateSecureId */
export function generateBackupId(): string {
  return generateSecureId();
}

/** @deprecated use generateSecureId */
export function generateRunwayId(): string {
  return generateSecureId();
}
