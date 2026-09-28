# Salary Secure

Market-validation landing page for proposed layoff income protection for India's tech workforce.

This is **not** a live insurance product. Launch only proceeds after required government / regulatory approvals and an appropriate licensed structure.

**Brand:** Salary Secure — “Your salary stops. Your backup starts.”

Central config: [`src/lib/brand.ts`](src/lib/brand.ts)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Netlify Forms (waitlist + contact storage for V1)

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Local Netlify Form AJAX posts will not persist submissions unless you use
> Netlify Dev (`netlify dev`) or test against a deployed Netlify URL.

## Environment variables

See [`.env.example`](.env.example).

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata/OG |

**No private API credentials are required for the V1 form implementation.**

### Security rules

- Never put service-role keys, SMTP keys, WhatsApp Cloud API tokens, Meta app secrets, or Resend/SendGrid keys in `NEXT_PUBLIC_*` / `VITE_*` variables, `netlify.toml`, Git, or browser JavaScript.
- Future secrets must live only in the Netlify UI (runtime / Functions environment variables).
- Do not print secrets to the console or return them from API responses.

## PRODUCTION / NETLIFY SETUP

1. Deploy the site to Netlify (connect the Git repo or drag-and-drop a build).
2. In the Netlify dashboard: **Forms →** ensure form detection is enabled for the site.
3. Submit one realistic test entry to each form on the **production URL** (not only localhost).
4. Confirm these forms appear under Forms:
   - `salary-secure-waitlist`
   - `salary-secure-contact`
5. Configure email notifications:
   - **Forms →** select the form → **Submission notifications → Add notification → Email notification**
   - Suggested subjects:
     - Contact: `Salary Secure — New Contact Query`
     - Waitlist (optional): `Salary Secure — New Early Access Signup`
   - Destination email is set in the Netlify UI — **not** in source code.
   - Contact form field `email` supports Reply-To when Netlify provides it.
6. Verify spam / honeypot behavior (a filled `bot-field` must not create a useful submission).
7. Re-test waitlist (email) and contact on desktop and mobile viewports.

Early access is **email-only** for V1 (no WhatsApp business number required).

### Form architecture (V1)

- Submissions use **Netlify Forms** with AJAX (`application/x-www-form-urlencoded`).
- Static blueprints: [`public/__forms.html`](public/__forms.html) + [`NetlifyFormsBlueprints`](src/components/NetlifyFormsBlueprints.tsx).
- Anti-spam: Netlify filtering + `bot-field` honeypot + field validation.
- Math verification (`7 + 4` style) is **UX-level bot friction only** — it is not primary security and does not use a client-side secret.

### Optional legacy APIs

`POST /api/waitlist` and `POST /api/contact` remain in the repo for local experiments but are **not** used by the production UI. Prefer Netlify Forms for V1.

## Analytics

Events in `src/lib/analytics.ts` (keys retained for funnel continuity):

`page_view`, `hero_cta_clicked`, `runway_calculator_started`, `runway_calculator_completed`, `coverage_selected`, `duration_selected`, `plan_selected`, `estimated_price_displayed`, `willingness_to_pay_answered`, `early_access_clicked`, `price_displayed`, `price_response`, `waitlist_started`, `waitlist_completed`, `whatsapp_consent_given`, `referral_shared`, `source_clicked`

Note: `runway_*` event names refer to the **financial runway calculator**, not a product brand.

## Pricing research

Secure 50 / 75 / 100 use configurable research rates in [`src/data/pricingConfig.ts`](src/data/pricingConfig.ts). Outputs are **estimated / indicative** only — never insurance premiums or quotes.

### Employer risk model (research)

Indicative price = base protection cost × employer risk multiplier.

Config lives in:
- [`src/data/employerRiskConfig.ts`](src/data/employerRiskConfig.ts) — factors, bands, multipliers, questionnaire scoring
- [`src/data/employerRiskData.ts`](src/data/employerRiskData.ts) — curated sample company scores (placeholder research data)
- [`src/lib/employerRisk.ts`](src/lib/employerRisk.ts) — lookup + scoring engine

This is **not** actuarially approved underwriting. Future versions may replace the local dataset with verified external company intelligence (funding databases, public filings, layoff trackers, hiring trends, exchange disclosures, company news). Do **not** add live API integrations until sources are reviewed.

## Updating statistics

Edit `src/data/marketStats.ts` (and `src/data/sources.ts`).

## Changing the brand globally

Edit `src/lib/brand.ts`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```
