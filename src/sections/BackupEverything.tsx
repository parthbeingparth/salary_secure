import { brand } from "@/lib/brand";
import { Section } from "@/components/ui/Layout";

const backed = [
  "Your photos",
  "Your files",
  "Your phone",
  "Your internet",
  "Your power",
];

export function BackupEverything() {
  return (
    <Section className="bg-ivory">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="headline-lg text-graphite">
          You back up everything important.
        </h2>
        <ul className="mt-10 space-y-3">
          {backed.map((item) => (
            <li
              key={item}
              className="border-b border-border pb-3 text-lg text-slate last:border-0 md:text-xl"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-12 text-xl font-medium text-graphite md:text-2xl">
          What about your salary?
        </p>
        <p className="mt-8 text-[11px] font-semibold tracking-[0.22em] text-navy-light">
          {brand.nameLines[0]}
        </p>
        <p className="text-[clamp(2rem,6vw,3.25rem)] font-semibold tracking-[0.08em] text-graphite">
          {brand.nameLines[1]}
        </p>
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-slate">
          {brand.shortName} is exploring income protection designed to give tech
          professionals financial breathing room after an eligible involuntary
          layoff.
        </p>
        <p className="mt-4 text-xs text-slate">
          Concept currently being validated · Proposed coverage
        </p>
      </div>
    </Section>
  );
}
