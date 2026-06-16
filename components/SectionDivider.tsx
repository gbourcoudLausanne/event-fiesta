import type { CSSProperties } from "react";

type Variant = "wave" | "wave-inv" | "diagonal" | "diagonal-inv";

const PATHS: Record<Variant, string> = {
  "wave":         "M0,48 C360,80 1080,0 1440,48 L1440,80 L0,80 Z",
  "wave-inv":     "M0,32 C360,0  1080,80 1440,32 L1440,80 L0,80 Z",
  "diagonal":     "M0,0  L1440,80 L1440,80 L0,80 Z",
  "diagonal-inv": "M0,80 L1440,0  L1440,80 Z",
};

export function SectionDivider({
  from,
  to,
  variant = "wave",
  height = 80,
}: {
  from: string;
  to: string;
  variant?: Variant;
  height?: number;
}) {
  return (
    <div
      style={{ background: from, lineHeight: 0, display: "block" } as CSSProperties}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height }}
      >
        <path d={PATHS[variant]} fill={to} />
      </svg>
    </div>
  );
}
