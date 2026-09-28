"use client";

import {
  PRICE_EXPERIMENT_KEY_PREFIX,
  coverageTiers,
  type CoverageTierId,
} from "@/data/plans";

export function getOrAssignTierPrice(tierId: CoverageTierId): number {
  const tier = coverageTiers.find((t) => t.id === tierId);
  const variants = tier?.priceVariants ?? [999];
  const fallback = variants[Math.floor(variants.length / 2)] ?? 999;

  if (typeof window === "undefined") return fallback;

  const key = `${PRICE_EXPERIMENT_KEY_PREFIX}${tierId}`;
  try {
    const existing = localStorage.getItem(key);
    if (existing) {
      const n = Number(existing);
      if ((variants as readonly number[]).includes(n)) return n;
    }
  } catch {
    /* ignore */
  }

  const idx = Math.floor(Math.random() * variants.length);
  const price = variants[idx]!;
  try {
    localStorage.setItem(key, String(price));
  } catch {
    /* ignore */
  }
  return price;
}
