"use client";

import type { UtmParams } from "@/types";

const UTM_STORAGE_KEY = "salary_secure_utm";

export function captureUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    referral_code: params.get("ref") ?? undefined,
  };

  const hasAny = Object.values(utm).some(Boolean);
  if (hasAny) {
    const existing = getStoredUtm();
    const merged = { ...existing, ...Object.fromEntries(
      Object.entries(utm).filter(([, v]) => Boolean(v)),
    ) };
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  }

  return getStoredUtm();
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
