"use client";

import { brand } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/AppProviders";

export function MobileStickyCta() {
  const { calculatorCompleted, waitlistSubmitted, scrollTo } = useApp();

  let label = "Check My Protection";
  let target = "calculator";
  let onClick: (() => void) | undefined;

  if (waitlistSubmitted) {
    label = "Share Salary Secure";
    target = "waitlist-success";
    onClick = () => {
      const shareUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/`
          : brand.siteUrl;
      const text = `${brand.tagline} — ${brand.descriptor} `;
      track("referral_shared", { channel: "sticky_share" });
      if (navigator.share) {
        void navigator.share({ title: brand.brandName, text, url: shareUrl });
      } else {
        scrollTo(target);
      }
    };
  } else if (calculatorCompleted) {
    label = "Get Early Access";
    target = "waitlist";
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Button
        className="w-full"
        onClick={() => {
          if (onClick) {
            onClick();
            return;
          }
          scrollTo(target);
        }}
      >
        {label}
      </Button>
    </div>
  );
}
