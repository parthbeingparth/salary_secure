"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({
  value,
  durationMs = 1400,
  format = (n: number) => n.toLocaleString("en-IN"),
}: {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    // If already on screen (or observer fails), still animate
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) run();
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    const fallback = window.setTimeout(run, 400);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [value, durationMs]);

  return <span ref={ref}>{format(display)}</span>;
}
