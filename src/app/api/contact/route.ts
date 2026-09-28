import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";
import {
  contactBodySchema,
  sendContactEmail,
} from "@/lib/contact/send";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_288;
const MIN_SUBMIT_MS = 2_000;

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

  const parsed = contactBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;

  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (body.formStartedAt && Date.now() - body.formStartedAt < MIN_SUBMIT_MS) {
    return NextResponse.json({ error: "Please try again" }, { status: 429 });
  }

  const ip = clientIp(req);
  const rl = await checkRateLimit(hashIdentifier(`contact:${ip}:${body.email}`));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds || 60) },
      },
    );
  }

  try {
    const result = await sendContactEmail(body);
    return NextResponse.json({
      ok: true,
      delivered: result.mode === "resend",
    });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again or email us directly." },
      { status: 500 },
    );
  }
}
