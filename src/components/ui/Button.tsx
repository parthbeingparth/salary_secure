"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "onDark";

const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-paper hover:bg-navy-light shadow-sm focus-visible:ring-navy",
  secondary:
    "bg-accent-soft text-navy hover:bg-[#dce7ec] focus-visible:ring-navy",
  ghost:
    "bg-transparent text-foreground hover:bg-black/[0.04] focus-visible:ring-navy",
  outline:
    "bg-paper text-foreground border border-border hover:border-navy/30 focus-visible:ring-navy",
  onDark:
    "bg-paper text-navy hover:bg-white focus-visible:ring-paper",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type={props.type ?? "button"}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium tracking-[-0.01em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
