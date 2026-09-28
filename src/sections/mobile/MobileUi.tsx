"use client";

import { type ReactNode, useId, useState } from "react";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-border">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-[15px] font-medium text-graphite">{title}</span>
          <span className="text-slate" aria-hidden>
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className={open ? "block pb-4" : "hidden"}
      >
        {children}
      </div>
    </div>
  );
}

export function ChapterLabel({
  n,
  label,
  dark = false,
}: {
  n: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <p
      className={`mb-3 flex items-baseline gap-2 text-[11px] font-semibold tracking-[0.16em] ${
        dark ? "text-paper/45" : "text-slate"
      }`}
    >
      <span className="display-num">{n}</span>
      <span>{label}</span>
    </p>
  );
}
