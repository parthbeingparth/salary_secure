import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";
import { insertWaitlist } from "@/lib/waitlist/repository";
import { waitlistBodySchema } from "@/lib/waitlist/schema";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const MIN_SUBMIT_MS = 3_000;

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  form.set("remoteip", ip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = waitlistBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;

  // Honeypot — bots fill hidden "website" field
  if (body.website && body.website.length > 0) {
    return NextResponse.json({
      ok: true,
      runwayId: "SS #0000",
      referralCode: "XXXXXX",
    });
  }

  if (body.formStartedAt) {
    const elapsed = Date.now() - body.formStartedAt;
    if (elapsed < MIN_SUBMIT_MS) {
      return NextResponse.json({ error: "Please try again" }, { status: 429 });
    }
  }

  const ip = clientIp(req);
  const contactKey = body.email || body.phone || ip;
  const rlKey = hashIdentifier(`${ip}:${contactKey}`);
  const rl = await checkRateLimit(rlKey);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds || 60) },
      },
    );
  }

  const turnstileOk = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Bot verification failed" },
      { status: 403 },
    );
  }

  try {
    const result = await insertWaitlist(body);
    return NextResponse.json({
      ok: true,
      runwayId: result.runwayId,
      referralCode: result.referralCode,
    });
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json(
      { error: "Unable to save your details. Please try again." },
      { status: 500 },
    );
  }
}
