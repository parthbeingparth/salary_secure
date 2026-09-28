"use client";

import type { AnalyticsEvent } from "@/types";

type Props = Record<string, unknown>;

/**
 * Analytics abstraction — swap console for PostHog/GA4 when env is configured.
 *
 * Funnel metrics this enables:
 * - Visitor → calculator completion %
 * - Calculator → plan selection %
 * - Plan → Yes/Maybe/No willingness-to-pay %
 * - Price elasticity by ₹399/₹499/₹699
 * - Waitlist conversion %, WhatsApp consent %
 * - Salary/EMI band, coverage & duration preference %
 * - Referral + UTM/LinkedIn conversion %
 */
export function track(event: AnalyticsEvent, props?: Props): void {
  const payload = {
    event,
    props: props ?? {},
    ts: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const w = window as Window & {
      posthog?: { capture: (e: string, p?: Props) => void };
      gtag?: (...args: unknown[]) => void;
    };

    if (w.posthog?.capture) {
      w.posthog.capture(event, props);
    }

    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", payload);
    }
  }
}
