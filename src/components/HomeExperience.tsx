"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { MobileStory } from "@/sections/mobile/MobileStory";
import { Hero } from "@/sections/Hero";
import { HeroProofStrip } from "@/sections/desktop/HeroProofStrip";
import { DesktopReality } from "@/sections/desktop/DesktopReality";
import { DesktopProductStudio } from "@/sections/desktop/DesktopProductStudio";
import { DesktopHowItWorks } from "@/sections/desktop/DesktopHowItWorks";
import { DesktopAccess } from "@/sections/desktop/DesktopAccess";

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

/** Prefer mobile story on SSR — LinkedIn traffic is predominantly handheld. */
function getServerSnapshot() {
  return true;
}

export function useIsMobileViewport() {
  return useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerSnapshot,
  );
}

function DesktopExperience() {
  return (
    <>
      <main className="flex-1">
        {/* 1. Hero + product summary */}
        <Hero />
        <HeroProofStrip />

        {/* 2. Problem + financial reality */}
        <DesktopReality />

        {/* 3. Calculator + coverage options */}
        <DesktopProductStudio />

        {/* 4. How it works + eligibility */}
        <DesktopHowItWorks />

        {/* 5–6. Why it matters + early access + FAQ */}
        <DesktopAccess />
      </main>
      <Footer />
    </>
  );
}

export function HomeExperience() {
  const isMobile = useIsMobileViewport();

  if (isMobile) {
    return (
      <>
        <MobileStory />
        <Footer />
      </>
    );
  }

  return <DesktopExperience />;
}

/** Optional shell when a parent needs a stable wrapper */
export function ExperienceGate({
  mobile,
  desktop,
}: {
  mobile: ReactNode;
  desktop: ReactNode;
}) {
  const isMobile = useIsMobileViewport();
  return <>{isMobile ? mobile : desktop}</>;
}
