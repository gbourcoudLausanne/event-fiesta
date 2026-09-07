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

/* ── Séparateur en festons (silhouette de guirlande de ballons) ────────── */
const SCALLOP_BACK =
  "M0,120 L0,64 C35,34 80,30 120,58 C160,84 205,86 250,58 C292,32 345,28 392,62 C430,90 480,92 528,62 C570,36 625,32 675,66 C715,94 770,96 822,64 C866,38 925,34 978,68 C1022,96 1078,98 1132,66 C1180,40 1240,36 1298,70 C1345,96 1395,98 1440,72 L1440,120 Z";
const SCALLOP_FRONT =
  "M0,120 L0,80 C20,50 55,44 88,72 C118,98 150,100 185,76 C220,52 262,46 300,80 C332,108 368,110 405,82 C440,56 486,50 525,84 C560,112 598,114 638,84 C675,56 720,50 762,86 C800,116 840,118 882,86 C920,58 968,52 1008,88 C1045,118 1088,120 1130,88 C1168,60 1215,54 1258,90 C1295,118 1338,120 1382,90 C1405,72 1425,68 1440,82 L1440,120 Z";

export function SoftDivider({
  from,
  to,
  back = "#FBEFF2",
  front = "#F5DEE3",
  height = 90,
}: {
  from: string;
  to: string;
  back?: string;
  front?: string;
  height?: number;
}) {
  return (
    <div
      style={{ background: from, lineHeight: 0, display: "block" } as CSSProperties}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height }}
      >
        <defs>
          <linearGradient id="softdiv-blend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={front} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path d={SCALLOP_BACK} fill={back} />
        <path d={SCALLOP_FRONT} fill="url(#softdiv-blend)" />
        <rect x="0" y="112" width="1440" height="8" fill={to} />
      </svg>
    </div>
  );
}
