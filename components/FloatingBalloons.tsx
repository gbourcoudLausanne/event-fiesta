"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const RZ_GRADS: Record<string, [string, string, string]> = {
  rose: ["#FCE2E9", "#F2A6B8", "#DE7C98"],
  roseDeep: ["#F7C9D6", "#E58AA6", "#C65E7F"],
  gold: ["#F6E2CF", "#E3B593", "#C68C63"],
  blue: ["#E4F0F5", "#AFD2E1", "#7FB0C6"],
  cream: ["#FFFDFA", "#F3EBDF", "#DFD2BF"],
};

const KNOT_X = 152;
const KNOT_Y = 388;

// x, y, r, gradient, back = couche arrière (plus douce)
const BQ: { x: number; y: number; r: number; g: string; back?: boolean }[] = [
  { x: 84, y: 116, r: 30, g: "cream", back: true },
  { x: 226, y: 132, r: 28, g: "blue", back: true },
  { x: 158, y: 60, r: 25, g: "rose", back: true },
  { x: 112, y: 148, r: 35, g: "rose" },
  { x: 200, y: 156, r: 32, g: "roseDeep" },
  { x: 152, y: 112, r: 40, g: "gold" },
  { x: 66, y: 190, r: 26, g: "roseDeep" },
  { x: 244, y: 198, r: 24, g: "gold" },
  { x: 124, y: 214, r: 29, g: "blue" },
  { x: 188, y: 218, r: 26, g: "cream" },
  { x: 152, y: 182, r: 31, g: "rose" },
  { x: 96, y: 252, r: 22, g: "gold" },
  { x: 214, y: 258, r: 22, g: "rose" },
];

const CONFETTI = [
  { x: 40, s: "c", c: "#F2A6B8", d: 0 },
  { x: 96, s: "r", c: "#E3B593", d: 1.4 },
  { x: 150, s: "c", c: "#AFD2E1", d: 2.6 },
  { x: 210, s: "r", c: "#E58AA6", d: 0.8 },
  { x: 264, s: "c", c: "#F2A6B8", d: 3.4 },
  { x: 130, s: "r", c: "#AFD2E1", d: 4.2 },
  { x: 236, s: "c", c: "#E3B593", d: 2 },
];

/* ── Bouquet de ballons qui s'élève (motif animé partagé) ─────── */
export function FloatingBalloons({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 304 420"
      fill="none"
      className={className ?? "w-full max-w-[320px] lg:max-w-[400px]"}
      style={{ overflow: "visible" }}
      aria-hidden
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.3 }}
    >
      <defs>
        {Object.entries(RZ_GRADS).map(([k, [a, b, c]]) => (
          <radialGradient key={k} id={`rz-${k}`} cx="34%" cy="28%" r="80%">
            <stop offset="0%" stopColor={a} />
            <stop offset="52%" stopColor={b} />
            <stop offset="100%" stopColor={c} />
          </radialGradient>
        ))}
      </defs>

      {/* Confettis qui tombent en continu */}
      {!reduce &&
        CONFETTI.map((f, i) => (
          <motion.g
            key={`c${i}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{ y: [-30, 380], rotate: [0, 220], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ repeat: Infinity, duration: 7 + i, ease: "linear", delay: f.d }}
            style={{ transformOrigin: `${f.x}px 0px` }}
          >
            {f.s === "c" ? (
              <circle cx={f.x} cy={0} r={2.6} fill={f.c} />
            ) : (
              <rect x={f.x - 1.4} y={-4} width={2.8} height={8} rx={1} fill={f.c} />
            )}
          </motion.g>
        ))}

      {/* Le bouquet — se balance autour du nœud */}
      <motion.g
        animate={reduce ? undefined : { rotate: [-2.2, 2.2, -2.2] }}
        transition={{ repeat: Infinity, duration: 9.5, ease: "easeInOut" }}
        style={{ transformOrigin: `${KNOT_X}px ${KNOT_Y}px` }}
      >
        {/* Ficelles convergentes */}
        <motion.g
          variants={{ hidden: { pathLength: 0, opacity: 0 }, shown: { pathLength: 1, opacity: 1, transition: { duration: 1, ease } } }}
        >
          {BQ.map((b, i) => (
            <motion.path
              key={`s${i}`}
              d={`M${b.x} ${b.y + b.r - 2} Q ${(b.x + KNOT_X) / 2 + (i % 2 ? 10 : -10)} ${(b.y + KNOT_Y) / 2} ${KNOT_X} ${KNOT_Y}`}
              stroke="rgba(120,60,80,0.24)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
            />
          ))}
        </motion.g>

        {/* Nœud + ruban */}
        <motion.g
          variants={{ hidden: { scale: 0, opacity: 0 }, shown: { scale: 1, opacity: 1, transition: { delay: 0.7, type: "spring", stiffness: 260, damping: 16 } } }}
          style={{ transformOrigin: `${KNOT_X}px ${KNOT_Y}px` }}
        >
          <path d={`M${KNOT_X} ${KNOT_Y} q-16 -10 -18 6 q-2 14 18 4 q20 10 18 -4 q-2 -16 -18 -6`} fill="#D9628A" opacity="0.9" />
          <path d={`M${KNOT_X} ${KNOT_Y + 2} q-6 22 -14 34 M${KNOT_X} ${KNOT_Y + 2} q6 22 14 34`} stroke="#D9628A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
          <circle cx={KNOT_X} cy={KNOT_Y} r={4} fill="#C65E7F" />
        </motion.g>

        {/* Ballons */}
        {BQ.map((b, i) => (
          <motion.g
            key={i}
            variants={{
              hidden: { y: 90, scale: 0.4, opacity: 0 },
              shown: {
                y: 0,
                scale: 1,
                opacity: b.back ? 0.42 : 0.98,
                transition: { type: "spring", stiffness: 150, damping: 12, delay: 0.15 + i * 0.05 },
              },
            }}
            style={{ transformOrigin: `${b.x}px ${b.y}px` }}
          >
            <motion.g
              animate={reduce ? undefined : { y: [0, i % 2 ? -7 : -11, 0], rotate: [0, i % 3 ? 1.6 : -1.6, 0] }}
              transition={{ repeat: Infinity, duration: 4.8 + (i % 5) * 0.7, ease: "easeInOut", delay: 1 + i * 0.15 }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
            >
              <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#rz-${b.g})`} style={b.back ? { filter: "blur(2px)" } : undefined} />
              <path d={`M${b.x - 4} ${b.y + b.r - 1} Q${b.x} ${b.y + b.r + 5} ${b.x + 4} ${b.y + b.r - 1} Z`} fill={`url(#rz-${b.g})`} />
              {!b.back && (
                <ellipse
                  cx={b.x - b.r * 0.32}
                  cy={b.y - b.r * 0.36}
                  rx={b.r * 0.2}
                  ry={b.r * 0.32}
                  fill="rgba(255,255,255,0.55)"
                  transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.36})`}
                />
              )}
            </motion.g>
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}
