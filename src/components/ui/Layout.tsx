import { type ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`container-page ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
  as: Tag = "section",
  dark = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "footer" | "header";
  dark?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={`section-pad ${dark ? "section-dark" : ""} ${className}`}
    >
      <Container>{children}</Container>
    </Tag>
  );
}

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`card p-4 md:p-6 ${hover ? "card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}
