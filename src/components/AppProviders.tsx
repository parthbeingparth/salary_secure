"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics";
import { captureUtmFromUrl } from "@/lib/utm";
import { getOrAssignTierPrice } from "@/lib/price-experiment";
import type { CoverageTierId } from "@/data/plans";
import {
  DEFAULT_PROTECTION_DURATION,
  type ProtectionDurationMonths,
  type ProtectionEstimate,
} from "@/data/pricingConfig";
import type { WillingToPay } from "@/types";

const WTP_STORAGE_KEY = "salary_secure_wtp_response";
const TIER_STORAGE_KEY = "salary_secure_selected_tier_v2";
const DURATION_STORAGE_KEY = "salary_secure_duration";

type AppState = {
  calculatorCompleted: boolean;
  setCalculatorCompleted: (v: boolean) => void;
  waitlistSubmitted: boolean;
  setWaitlistSubmitted: (v: boolean) => void;
  selectedTier: CoverageTierId;
  setSelectedTier: (t: CoverageTierId) => void;
  durationMonths: ProtectionDurationMonths;
  setDurationMonths: (d: ProtectionDurationMonths) => void;
  lastEstimate: ProtectionEstimate | null;
  setLastEstimate: (e: ProtectionEstimate | null) => void;
  researchPrice: number;
  waitlistChannel: "whatsapp" | "email" | null;
  setWaitlistChannel: (c: "whatsapp" | "email" | null) => void;
  willingToPay: WillingToPay | null;
  setWillingToPay: (v: WillingToPay) => void;
  scrollTo: (id: string) => void;
};

const AppContext = createContext<AppState | null>(null);

let tierCache: CoverageTierId | undefined;
const tierListeners = new Set<() => void>();

function readTier(): CoverageTierId {
  if (typeof window === "undefined") return "secure_100";
  try {
    const raw = localStorage.getItem(TIER_STORAGE_KEY);
    if (raw === "secure_50" || raw === "secure_75" || raw === "secure_100") {
      return raw;
    }
    // migrate legacy keys
    if (raw === "backup_50" || raw === "essential") return "secure_50";
    if (raw === "backup_75" || raw === "signature") return "secure_75";
    if (raw === "backup_100" || raw === "executive") return "secure_100";
  } catch {
    /* ignore */
  }
  return "secure_100";
}

function getTierSnapshot(): CoverageTierId {
  if (tierCache) return tierCache;
  tierCache = readTier();
  return tierCache;
}

function subscribeTier(cb: () => void) {
  tierListeners.add(cb);
  return () => {
    tierListeners.delete(cb);
  };
}

function writeTier(t: CoverageTierId) {
  tierCache = t;
  try {
    localStorage.setItem(TIER_STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
  tierListeners.forEach((l) => l());
}

let wtpCache: WillingToPay | null | undefined;
const wtpListeners = new Set<() => void>();

function readStoredWtp(): WillingToPay | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WTP_STORAGE_KEY);
    if (raw === "yes" || raw === "maybe" || raw === "no") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

function getWtpSnapshot(): WillingToPay | null {
  if (wtpCache !== undefined) return wtpCache;
  wtpCache = readStoredWtp();
  return wtpCache;
}

function subscribeWtp(onStoreChange: () => void) {
  wtpListeners.add(onStoreChange);
  return () => {
    wtpListeners.delete(onStoreChange);
  };
}

function writeWtp(v: WillingToPay) {
  wtpCache = v;
  try {
    localStorage.setItem(WTP_STORAGE_KEY, v);
  } catch {
    /* ignore */
  }
  wtpListeners.forEach((l) => l());
}

let durationCache: ProtectionDurationMonths | undefined;
const durationListeners = new Set<() => void>();

function readDuration(): ProtectionDurationMonths {
  if (typeof window === "undefined") return DEFAULT_PROTECTION_DURATION;
  try {
    const raw = localStorage.getItem(DURATION_STORAGE_KEY);
    if (raw === "3" || raw === "6") return Number(raw) as ProtectionDurationMonths;
  } catch {
    /* ignore */
  }
  return DEFAULT_PROTECTION_DURATION;
}

function getDurationSnapshot(): ProtectionDurationMonths {
  if (durationCache) return durationCache;
  durationCache = readDuration();
  return durationCache;
}

function subscribeDuration(cb: () => void) {
  durationListeners.add(cb);
  return () => {
    durationListeners.delete(cb);
  };
}

function writeDuration(d: ProtectionDurationMonths) {
  durationCache = d;
  try {
    localStorage.setItem(DURATION_STORAGE_KEY, String(d));
  } catch {
    /* ignore */
  }
  durationListeners.forEach((l) => l());
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [calculatorCompleted, setCalculatorCompleted] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [lastEstimate, setLastEstimate] = useState<ProtectionEstimate | null>(
    null,
  );
  const selectedTier = useSyncExternalStore(
    subscribeTier,
    getTierSnapshot,
    () => "secure_100" as CoverageTierId,
  );
  const durationMonths = useSyncExternalStore(
    subscribeDuration,
    getDurationSnapshot,
    () => DEFAULT_PROTECTION_DURATION,
  );
  const willingToPay = useSyncExternalStore(
    subscribeWtp,
    getWtpSnapshot,
    () => null,
  );
  const [waitlistChannel, setWaitlistChannel] = useState<
    "whatsapp" | "email" | null
  >(null);
  const pageTracked = useRef(false);
  const lastPricedTier = useRef<string | null>(null);

  const researchPrice = useMemo(
    () => getOrAssignTierPrice(selectedTier),
    [selectedTier],
  );

  useEffect(() => {
    if (!pageTracked.current) {
      pageTracked.current = true;
      captureUtmFromUrl();
      track("page_view", { path: window.location.pathname });
    }
    const key = `${selectedTier}:${researchPrice}`;
    if (lastPricedTier.current !== key) {
      lastPricedTier.current = key;
      track("price_displayed", {
        tier: selectedTier,
        displayed_price: researchPrice,
      });
    }
  }, [selectedTier, researchPrice]);

  const setSelectedTier = useCallback((t: CoverageTierId) => {
    writeTier(t);
    track("coverage_selected", { tier: t });
    track("plan_selected", { plan: t });
  }, []);

  const setDurationMonths = useCallback((d: ProtectionDurationMonths) => {
    writeDuration(d);
    track("duration_selected", { duration_months: d });
  }, []);

  const setWillingToPay = useCallback(
    (v: WillingToPay) => {
      writeWtp(v);
      track("price_response", {
        tier: selectedTier,
        displayed_price: researchPrice,
        response: v,
      });
      track("willingness_to_pay_answered", {
        willingness_response: v,
        plan: selectedTier,
        duration_months: durationMonths,
        estimated_annual_cost: lastEstimate?.estimatedAnnualCost,
      });
    },
    [selectedTier, researchPrice, durationMonths, lastEstimate],
  );

  const scrollTo = useCallback((id: string) => {
    const aliases: Record<string, string[]> = {
      coverage: ["coverage", "plans"],
      faq: ["faq", "waitlist"],
      calculator: ["calculator"],
      waitlist: ["waitlist", "waitlist-success"],
      "why-salary-secure": ["why-salary-secure"],
    };
    const candidates = aliases[id] ?? [id];
    for (const candidate of candidates) {
      const el = document.getElementById(candidate);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.location.hash = id;
  }, []);

  const value = useMemo(
    () => ({
      calculatorCompleted,
      setCalculatorCompleted,
      waitlistSubmitted,
      setWaitlistSubmitted,
      selectedTier,
      setSelectedTier,
      durationMonths,
      setDurationMonths,
      lastEstimate,
      setLastEstimate,
      researchPrice,
      waitlistChannel,
      setWaitlistChannel,
      willingToPay,
      setWillingToPay,
      scrollTo,
    }),
    [
      calculatorCompleted,
      waitlistSubmitted,
      selectedTier,
      setSelectedTier,
      durationMonths,
      setDurationMonths,
      lastEstimate,
      researchPrice,
      waitlistChannel,
      willingToPay,
      setWillingToPay,
      scrollTo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}
