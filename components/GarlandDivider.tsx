"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const GRADS: Record<string, [string, string, string]> = {
  rose: ["#FDE7EC", "#F4A8B8", "#DE7E9A"],
  roseDeep: ["#F6D0DC", "#E58AA6", "#C25E7E"],
  blue: ["#E7F1F6", "#A8CEE0", "#7FB0C6"],
  peach: ["#FBEEDF", "#F0C29A", "#D59D6E"],
  cream: ["#FFFDF9", "#F3E7D6", "#DCC7AC"],
  gold: ["#F6E7C9", "#E3C179", "#C39A4A"],
};
const GKEYS = ["rose", "blue", "peach", "roseDeep", "cream", "gold"] as const;

function noise(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Point + normale le long de la guirlande (bézier quadratique P0-P1-P2).
function swag(t: number) {
  const P0 = { x: -20, y: 40 };
  const P1 = { x: 720, y: 232 };
  const P2 = { x: 1460, y: 40 };
  const mt = 1 - t;
  const x = mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x;
  const y = mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y;
  const tx = 2 * mt * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
  const ty = 2 * mt * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
  const m = Math.hypot(tx, ty) || 1;
  return { x, y, nx: -ty / m, ny: tx / m };
}

const N_BALLOONS = 34;
const BALLOONS = Array.from({ length: N_BALLOONS }).map((_, i) => {
  const t = i / (N_BALLOONS - 1);
  const p = swag(t);
  const side = i % 2 === 0 ? 1 : -1;
  const bump = 0.55 + 0.75 * Math.sin(t * Math.PI); // plus gros au centre
  const r = (11 + noise(i + 5) * 15) * bump;
  const off = side * (4 + noise(i) * 12) - r * 0.35;
  return {
    x: p.x + p.nx * off,
    y: p.y + p.ny * off + r * 0.42,
    r,
    g: GKEYS[Math.floor(noise(i + 2) * GKEYS.length)],
    back: noise(i + 9) < 0.22,
  };
});

const STRING_D = "M-20 40 Q 720 232 1460 40";

const PAMPA_AT = [0.12, 0.34, 0.5, 0.68, 0.88];
const EUCA_AT = [0.2, 0.44, 0.62, 0.82];

const CONFETTI = Array.from({ length: 16 }).map((_, i) => ({
  x: 60 + noise(i * 3.3) * 1320,
  c: ["#F4A8B8", "#A8CEE0", "#F0C29A", "#E3C179", "#FBD5DE"][i % 5],
  shape: i % 3 === 0 ? "r" : "c",
  d: noise(i + 20) * 6,
}));

function Pampa({ x, y, a }: { x: number; y: number; a: number }) {
  const barbs = 15;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`} stroke="#D6C4A2" strokeLinecap="round" fill="none">
      <path d="M0 0 C 4 -14 6 -32 5 -48" strokeWidth="1.1" opacity="0.8" />
      {Array.from({ length: barbs }).map((_, k) => {
        const tt = k / (barbs - 1);
        const yy = -3 - tt * 46;
        const env = Math.sin(tt * Math.PI);
        const sp = 3 + env * 7;
        const dr = 3 + tt * 5;
        return (
          <g key={k} opacity={0.3 + 0.4 * env}>
            <path d={`M0 ${yy} q ${sp * 0.6} ${-dr * 0.3} ${sp} ${-dr}`} strokeWidth="0.6" />
            <path d={`M0 ${yy} q ${-sp * 0.6} ${-dr * 0.3} ${-sp} ${-dr}`} strokeWidth="0.6" />
          </g>
        );
      })}
    </g>
  );
}

function Euca({ x, y, a, flip }: { x: number; y: number; a: number; flip: boolean }) {
  const dir = flip ? -1 : 1;
  const leaves = 9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d={`M0 0 Q ${9 * dir} -18 ${4 * dir} -44`} stroke="#9DB18C" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {Array.from({ length: leaves }).map((_, k) => {
        const tt = (k + 1) / leaves;
        const ly = -4 - tt * 38;
        const sx = tt * 3 * dir;
        const s = k % 2 === 0 ? 1 : -1;
        const lr = 3 + Math.sin(tt * Math.PI) * 2.6;
        const ax = sx + s * dir * lr * 0.8;
        return (
          <ellipse
            key={k}
            cx={ax}
            cy={ly}
            rx={lr}
            ry={lr * 0.62}
            fill="#B6C7A6"
            opacity={0.55 + 0.3 * Math.sin(tt * Math.PI)}
            transform={`rotate(${-s * 38 * dir} ${ax} ${ly})`}
          />
        );
      })}
    </g>
  );
}

export function GarlandDivider({ bg = "#FAF7F2" }: { bg?: string }) {
  const reduce = useReducedMotion();

  return (
    <div style={{ background: bg, lineHeight: 0 }} aria-hidden>
      <motion.svg
        viewBox="0 0 1440 210"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.3 }}
      >
        <defs>
          {GKEYS.map((k) => {
            const [a, b, c] = GRADS[k];
            return (
              <radialGradient key={k} id={`gd-${k}`} cx="34%" cy="26%" r="80%">
                <stop offset="0%" stopColor={a} />
                <stop offset="52%" stopColor={b} />
                <stop offset="100%" stopColor={c} />
              </radialGradient>
            );
          })}
        </defs>

        {/* Confettis qui tombent */}
        {!reduce &&
          CONFETTI.map((f, i) => (
            <motion.g
              key={`c${i}`}
              initial={{ opacity: 0 }}
              animate={{ y: [-40, 250], rotate: [0, 220], opacity: [0, 0.7, 0.7, 0] }}
              transition={{ repeat: Infinity, duration: 6 + i * 0.5, ease: "linear", delay: f.d }}
            >
              {f.shape === "c" ? (
                <circle cx={f.x} cy={0} r={3} fill={f.c} />
              ) : (
                <rect x={f.x - 1.6} y={-5} width={3.2} height={10} rx={1.2} fill={f.c} />
              )}
            </motion.g>
          ))}

        <g
          style={
            reduce
              ? { transformOrigin: "720px 30px" }
              : { transformOrigin: "720px 30px", animation: "gd-sway 9s ease-in-out infinite" }
          }
        >
          {/* Fil de la guirlande */}
          <motion.path
            d={STRING_D}
            fill="none"
            stroke="rgba(120,90,70,0.35)"
            strokeWidth="1.6"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0 },
              shown: { pathLength: 1, transition: { duration: 0.9, ease } },
            }}
          />

          {/* Verdure */}
          {PAMPA_AT.map((t, i) => {
            const p = swag(t);
            return (
              <motion.g
                key={`p${i}`}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  shown: {
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 220, damping: 16, delay: 0.3 + i * 0.06 },
                  },
                }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <Pampa x={p.x} y={p.y + 6} a={(t - 0.5) * 90 + (i % 2 ? 6 : -6)} />
              </motion.g>
            );
          })}
          {EUCA_AT.map((t, i) => {
            const p = swag(t);
            return (
              <motion.g
                key={`e${i}`}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  shown: {
                    scale: 1,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 220, damping: 16, delay: 0.34 + i * 0.06 },
                  },
                }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              >
                <Euca x={p.x} y={p.y + 8} a={(t - 0.5) * 120} flip={t > 0.5} />
              </motion.g>
            );
          })}

          {/* Ballons */}
          {BALLOONS.map((b, i) => (
            <motion.g
              key={i}
              custom={i}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                shown: (idx: number) => ({
                  scale: 1,
                  opacity: b.back ? 0.5 : 0.97,
                  transition: { type: "spring", stiffness: 250, damping: 14, delay: 0.18 + idx * 0.028 },
                }),
              }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
            >
              <line
                x1={b.x}
                y1={b.y - b.r}
                x2={swag((i / (N_BALLOONS - 1)) * 0.999 + 0.0005).x}
                y2={swag((i / (N_BALLOONS - 1)) * 0.999 + 0.0005).y}
                stroke="rgba(120,90,70,0.22)"
                strokeWidth="0.7"
              />
              <circle
                cx={b.x}
                cy={b.y}
                r={b.r}
                fill={`url(#gd-${b.g})`}
                style={b.back ? { filter: "blur(1.4px)" } : undefined}
              />
              {!b.back && (
                <ellipse
                  cx={b.x - b.r * 0.32}
                  cy={b.y - b.r * 0.4}
                  rx={b.r * 0.22}
                  ry={b.r * 0.32}
                  fill="rgba(255,255,255,0.55)"
                  transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.4})`}
                />
              )}
            </motion.g>
          ))}
        </g>
      </motion.svg>
    </div>
  );
}
