import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: `Terms — ${brand.shortName}`,
  description: `Terms for the ${brand.shortName} market-validation website.`,
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.14em]"
          >
            {brand.name}
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Back
          </Link>
        </Container>
      </header>

      <Container className="max-w-3xl py-12">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Terms
        </h1>
        <p className="mt-4 text-sm text-muted">
          Last updated: September 28, 2026 · Contact:{" "}
          <a
            href={`mailto:${brand.contactEmail}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            {brand.contactEmail}
          </a>
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Nature of this website
            </h2>
            <p className="mt-2">
              {brand.marketValidationDisclaimer} {brand.regulatoryDisclaimer}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              No offer of insurance
            </h2>
            <p className="mt-2">
              Nothing on this site constitutes an offer, solicitation, or
              commitment to provide insurance or any financial product. Indicative
              prices, proposed benefits, and eligibility criteria are for research
              only and may change.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Waitlist
            </h2>
            <p className="mt-2">
              Joining early access does not create a policy, guarantee coverage,
              or require payment. Early-access codes (e.g. SS #XXXX) are
              reference identifiers and do not represent chronological waitlist
              rank unless we explicitly say otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Statistics
            </h2>
            <p className="mt-2">
              Third-party statistics are cited with sources and dates. See{" "}
              <Link
                href="/methodology"
                className="text-accent underline-offset-2 hover:underline"
              >
                Methodology
              </Link>
              . We are not responsible for third-party data accuracy beyond
              faithful citation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">
              Acceptable use
            </h2>
            <p className="mt-2">
              Do not abuse the waitlist API, attempt unauthorized access, or
              submit false information intending to disrupt research.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              <a
                href={`mailto:${brand.contactEmail}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                {brand.contactEmail}
              </a>
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
