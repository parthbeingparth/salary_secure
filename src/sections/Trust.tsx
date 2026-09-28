import { Card, Section } from "@/components/ui/Layout";

const principles = [
  {
    title: "Source-backed data",
    body: "Every major figure exposes source, date, and methodology.",
  },
  {
    title: "Transparent methodology",
    body: "We publish how statistics are calculated — and their limits.",
  },
  {
    title: "Privacy-first research",
    body: "No payment, Aadhaar/PAN, or salary documents required today.",
  },
];

const trustStrip = [
  "Source-backed data",
  "Transparent methodology",
  "No payment required",
  "No Aadhaar/PAN for research",
  "No salary documents required today",
  "Privacy-first",
];

export function Trust() {
  return (
    <Section className="bg-ivory">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Trust architecture</p>
        <h2 className="headline-lg mt-3 text-graphite">
          Built on transparency.
        </h2>
        <p className="mt-3 text-slate">
          We&apos;re testing this idea publicly before building it.
        </p>
      </div>

      <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-2 text-center text-[12px] text-slate">
        {trustStrip.map((item) => (
          <li key={item} className="after:ml-4 after:text-border after:content-['·'] last:after:content-none">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {principles.map((p) => (
          <Card key={p.title} className="bg-paper">
            <h3 className="font-semibold text-graphite">{p.title}</h3>
            <p className="mt-2 text-sm text-slate">{p.body}</p>
          </Card>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate">
        Statistics shown on this site are sourced and date-stamped.{" "}
        <a
          href="/methodology"
          className="text-navy-light underline-offset-2 hover:underline"
        >
          View methodology
        </a>
        .
      </p>
    </Section>
  );
}
