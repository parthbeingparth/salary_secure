"use client";

import type { MathChallenge } from "@/lib/math-challenge";

type Props = {
  challenge: MathChallenge;
  answer: string;
  onAnswerChange: (v: string) => void;
  error?: string | null;
  disabled?: boolean;
};

export function MathVerification({
  challenge,
  answer,
  onAnswerChange,
  error,
  disabled,
}: Props) {
  return (
    <div className="rounded-lg border border-border bg-ivory/50 p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
        Quick verification
      </p>
      <p className="mt-1.5 text-sm text-graphite">{challenge.prompt}</p>
      <label className="mt-2 block">
        <span className="sr-only">Your answer</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          disabled={disabled}
          placeholder="Your answer"
          className="min-h-11 w-full rounded-lg border border-border bg-paper px-3 text-base outline-none focus:ring-2 focus:ring-navy/25 disabled:opacity-60"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value.replace(/[^\d]/g, ""))}
        />
      </label>
      {error ? (
        <p className="mt-2 text-sm text-danger-muted" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
