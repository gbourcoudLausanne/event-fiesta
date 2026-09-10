"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const ARCH_D = "M32 420 C32 200 118 32 220 32 C322 32 408 200 408 420";

const GRADS = ["hd-rose", "hd-blue", "hd-peach", "hd-cream", "hd-rose", "hd-blue", "hd-peach"];
const GRAD_STOPS: Record<string, [string, string, string]> = {
  "hd-rose": ["#FCE2E9", "#F2A6B8", "#DE7C98"],
  "hd-blue": ["#E4F0F5", "#AFD2E1", "#7FB0C6"],
  "hd-peach": ["#FBE7D3", "#F0C29A", "#D89E70"],
  "hd-cream": ["#FFFDFA", "#F3EBDF", "#DFD2BF"],
};

// bruit déterministe [0,1)
const noise = (n: number) => {
  const s = Math.sin(n * 91.3 + 47.1) * 6151.7;
  return s - Math.floor(s);
};

const CONFETTI = [
  { x: 70, c: "#F2A6B8", d: 0 },
  { x: 300, c: "#AFD2E1", d: 3.1 },
  { x: 200, c: "#F0C29A", d: 5.4 },
  { x: 360, c: "#F2A6B8", d: 1.8 },
];

type Balloon = { x: number; y: number; r: number; g: string };

export function HeroDecor() {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const N = 9;
    const arr: Balloon[] = [];
    for (let i = 0; i < N; i++) {
      const p = path.getPointAtLength((i / (N - 1)) * len);
      const side = i % 2 === 0 ? 1 : -1;
      arr.push({
        x: p.x + side * (4 + noise(i) * 8),
        y: p.y + (noise(i + 5) - 0.5) * 6,
        r: 9 + noise(i + 2) * 9,
        g: GRADS[i % GRADS.length],
      });
    }
    setBalloons(arr);
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-[3%] top-1/2 hidden -translate-y-1/2 lg:block"
      style={{ width: "min(34vw, 430px)" }}
      aria-hidden
    >
      <svg viewBox="0 0 440 440" fill="none" style={{ width: "100%", overflow: "visible" }}>
        <defs>
          {Object.entries(GRAD_STOPS).map(([id, [a, b, c]]) => (
            <radialGradient key={id} id={id} cx="34%" cy="28%" r="78%">
              <stop offset="0%" stopColor={a} />
              <stop offset="52%" stopColor={b} />
              <stop offset="100%" stopColor={c} />
            </radialGradient>
          ))}
        </defs>

        {/* Confettis */}
        {!reduce &&
          CONFETTI.map((f, i) => (
            <motion.circle
              key={`c${i}`}
              cx={f.x}
              cy={0}
              r={3}
              fill={f.c}
              animate={{ y: [-20, 460], opacity: [0, 0.6, 0.6, 0], rotate: [0, 220] }}
              transition={{ repeat: Infinity, duration: 10 + i, ease: "linear", delay: f.d }}
              style={{ transformOrigin: `${f.x}px 0px` }}
            />
          ))}

        <motion.g
          animate={reduce ? undefined : { rotate: [-1.5, 1.5, -1.5], y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ transformOrigin: "220px 420px" }}
        >
          {/* Arche */}
          <motion.path
            ref={pathRef}
            d={ARCH_D}
            stroke="rgba(217,98,138,0.22)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.6, ease }}
          />

          {balloons.map((b, i) => (
            <motion.g
              key={i}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 + noise(i) * 0.5 }}
              style={{ transformOrigin: `${b.x}px ${b.y}px` }}
            >
              <motion.g
                animate={reduce ? undefined : { y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4 + i * 0.4, ease: "easeInOut" }}
              >
                <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#${b.g})`} opacity="0.94" />
                <ellipse
                  cx={b.x - b.r * 0.32}
                  cy={b.y - b.r * 0.38}
                  rx={b.r * 0.22}
                  ry={b.r * 0.32}
                  fill="rgba(255,255,255,0.5)"
                  transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.38})`}
                />
              </motion.g>
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
