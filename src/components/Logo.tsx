import React from "react";

type LogoProps = {
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: string;
  className?: string;
  wordmarkClassName?: string;
};

export default function Logo({
  size: _size,
  showWordmark = true,
  wordmarkSize = "1.25rem",
  className = "",
  wordmarkClassName = "",
}: LogoProps) {
  const sansStack =
    "var(--font-geist), 'Geist', system-ui, -apple-system, sans-serif";

  const wordWrapStyle: React.CSSProperties = {
    fontFamily: sansStack,
    fontSize: wordmarkSize,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    display: "inline-flex",
    color: "currentColor",
  };

  return (
    <div className={"flex items-center gap-2.5 " + className}>
      {showWordmark ? (
        <span className={wordmarkClassName} style={wordWrapStyle}>
          KANDELLA
        </span>
      ) : null}
    </div>
  );
}
