/**
 * Lightweight UX-level math friction for forms.
 *
 * This is NOT primary bot security. Real spam protection comes from:
 * Netlify spam filtering + honeypot + normal validation.
 * Do not introduce a client-side secret for the math problem.
 */

export type MathChallenge = {
  a: number;
  b: number;
  prompt: string;
  answer: number;
};

function randOperand(): number {
  // Inclusive 2–9
  return 2 + Math.floor(Math.random() * 8);
}

export function createMathChallenge(): MathChallenge {
  const a = randOperand();
  const b = randOperand();
  return {
    a,
    b,
    prompt: `What is ${a} + ${b}?`,
    answer: a + b,
  };
}

export function checkMathAnswer(
  challenge: MathChallenge | null,
  raw: string,
): boolean {
  if (!challenge) return false;
  const n = Number(String(raw).trim());
  if (!Number.isFinite(n)) return false;
  return n === challenge.answer;
}
