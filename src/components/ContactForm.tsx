"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HoneypotField } from "@/components/HoneypotField";
import { MathVerification } from "@/components/MathVerification";
import {
  checkMathAnswer,
  createMathChallenge,
  type MathChallenge,
} from "@/lib/math-challenge";
import {
  NETLIFY_FORM_CONTACT,
  submitNetlifyForm,
} from "@/lib/netlify-forms";

type Phase =
  | "idle"
  | "verification_required"
  | "submitting"
  | "success"
  | "error";

/**
 * Contact form via Netlify Forms (AJAX).
 * Math challenge is UX friction only — honeypot + Netlify spam filtering are primary.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [mathError, setMathError] = useState<string | null>(null);
  const [mathAnswer, setMathAnswer] = useState("");
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [failCount, setFailCount] = useState(0);
  const submittingLock = useRef(false);

  function validate(): string | null {
    if (!name.trim()) return "Please enter your name";
    const e = email.trim();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return "Please enter a valid email";
    }
    if (message.trim().length < 10) {
      return "Please enter a slightly longer message";
    }
    if (honeypot) return "Something went wrong. Please try again.";
    return null;
  }

  function onPrimaryClick() {
    if (phase === "submitting" || submittingLock.current) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setPhase("error");
      return;
    }
    setError(null);

    if (phase !== "verification_required") {
      setChallenge(createMathChallenge());
      setMathAnswer("");
      setMathError(null);
      setFailCount(0);
      setPhase("verification_required");
      return;
    }

    if (!checkMathAnswer(challenge, mathAnswer)) {
      const nextFails = failCount + 1;
      setFailCount(nextFails);
      setMathError("That doesn't look right. Try again.");
      if (nextFails >= 2) {
        setChallenge(createMathChallenge());
        setMathAnswer("");
        setFailCount(0);
      }
      return;
    }

    void submit();
  }

  async function submit() {
    if (submittingLock.current) return;
    submittingLock.current = true;
    setPhase("submitting");
    setError(null);

    const result = await submitNetlifyForm(NETLIFY_FORM_CONTACT, {
      "bot-field": honeypot,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    submittingLock.current = false;

    if (!result.ok) {
      setError(result.error);
      setPhase("verification_required");
      return;
    }

    setPhase("success");
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setChallenge(null);
    setMathAnswer("");
    setMathError(null);
    setError(null);
    setFailCount(0);
    setPhase("idle");
    submittingLock.current = false;
  }

  if (phase === "success") {
    return (
      <div className="card p-6 text-center md:p-8">
        <p className="text-lg font-semibold text-foreground">Message sent.</p>
        <p className="mt-2 text-sm text-muted">
          Thanks — we&apos;ll get back to you.
        </p>
        <Button className="mt-6" variant="outline" onClick={reset}>
          Send another message
        </Button>
      </div>
    );
  }

  const busy = phase === "submitting";
  const showMath = phase === "verification_required" || phase === "submitting";

  return (
    <form
      name={NETLIFY_FORM_CONTACT}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={(e) => {
        e.preventDefault();
        onPrimaryClick();
      }}
      className="card space-y-4 p-5 md:p-6"
    >
      <input type="hidden" name="form-name" value={NETLIFY_FORM_CONTACT} />

      <label className="block">
        <span className="text-sm font-medium">Your name</span>
        <input
          name="name"
          required
          disabled={busy}
          autoComplete="name"
          className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Your email</span>
        <input
          name="email"
          required
          type="email"
          inputMode="email"
          disabled={busy}
          autoComplete="email"
          className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Your message</span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={10}
          disabled={busy}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
        />
      </label>

      <HoneypotField value={honeypot} onChange={setHoneypot} />

      {showMath && challenge ? (
        <MathVerification
          challenge={challenge}
          answer={mathAnswer}
          onAnswerChange={(v) => {
            setMathAnswer(v);
            setMathError(null);
          }}
          error={mathError}
          disabled={busy}
        />
      ) : null}

      {error ? (
        <p className="text-sm text-danger-muted" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
        {busy
          ? "Submitting…"
          : showMath
            ? "Verify & Send"
            : "Send Message"}
      </Button>

      <p className="text-xs text-muted">
        We don&apos;t sell your information. Research and contact notes are used
        only to respond and improve Salary Secure.
      </p>
    </form>
  );
}
