"use client";

import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Layout";
import { useApp } from "@/components/AppProviders";

export function FinalCta() {
  const { scrollTo, setWaitlistChannel } = useApp();

  function join() {
    setWaitlistChannel("email");
    track("waitlist_started", { channel: "email", source: "final_cta" });
    scrollTo("waitlist");
  }

  return (
    <Section dark className="!py-20 md:!py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="headline-lg text-paper">
          Your employer has a contingency plan.
          <br />
          You should too.
        </h2>
        <p className="mt-4 text-paper/65">
          Help shape salary insurance for India&apos;s tech workforce — get
          early access.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="onDark" onClick={join}>
            Get Early Access
          </Button>
        </div>
        <p className="mt-4 text-sm text-paper/45">No payment required.</p>
      </div>
    </Section>
  );
}
