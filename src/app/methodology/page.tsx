import type { Metadata } from "next";
import Link from "next/link";
import { methodologyEntries, sourceDirectory } from "@/data/sources";
import { brand } from "@/lib/brand";
import { formatAsOfDate } from "@/lib/format";
import { Container } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: `Methodology & Sources — ${brand.shortName}`,
  description:
    "Sourced, date-stamped statistics used on the Salary Secure market-validation site.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-border bg-background">
        <Container className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.14em] text-foreground"
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
          Methodology & Sources
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          Statistics on this site are sourced and date-stamped. We do not invent
          figures, turn correlation into causation, or claim AI caused a layoff
          unless a cited source explicitly attributes it. Layoff trackers are
          incomplete by nature.
        </p>

        <div className="mt-10 space-y-6">
          {methodologyEntries.map((entry) => (
            <article
              key={entry.statistic}
              className="card p-5 md:p-6"
            >
              <h2 className="text-lg font-semibold">{entry.statistic}</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-foreground">Source</dt>
                  <dd className="text-muted">
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline-offset-2 hover:underline"
                    >
                      {entry.source}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">
                    Publication / as-of date
                  </dt>
                  <dd className="text-muted">
                    {formatAsOfDate(entry.publicationDate)}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Dataset period</dt>
                  <dd className="text-muted">{entry.datasetPeriod}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Explanation</dt>
                  <dd className="text-muted leading-relaxed">
                    {entry.explanation}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Limitations</dt>
                  <dd className="text-muted leading-relaxed">
                    {entry.limitations}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <section id="sources" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">Sources</h2>
          <ul className="mt-6 space-y-4">
            {sourceDirectory.map((s) => (
              <li key={s.name} className="card p-5">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  {s.name}
                </a>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-muted">
          {brand.marketValidationDisclaimer} {brand.regulatoryDisclaimer}
        </p>
      </Container>
    </main>
  );
}
