"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const KNOT = { x: 180, y: 436 };

type G = "pink" | "cream" | "blush" | "tan" | "blue" | "heart";

// Ballons flottants sur ficelle
const FLOAT: { x: number; y: number; r: number; g: G }[] = [
  { x: 74, y: 80, r: 33, g: "tan" },
  { x: 44, y: 158, r: 25, g: "blue" },
  { x: 38, y: 222, r: 23, g: "tan" },
  { x: 300, y: 66, r: 31, g: "cream" },
  { x: 322, y: 206, r: 29, g: "pink" },
];

// Grappe de petits ballons à la base
const CLUSTER: { x: number; y: number; r: number; g: G }[] = [
  { x: 96, y: 340, r: 24, g: "cream" },
  { x: 140, y: 330, r: 27, g: "pink" },
  { x: 185, y: 326, r: 28, g: "blush" },
  { x: 230, y: 330, r: 27, g: "cream" },
  { x: 272, y: 340, r: 24, g: "pink" },
  { x: 70, y: 372, r: 26, g: "pink" },
  { x: 112, y: 366, r: 28, g: "cream" },
  { x: 158, y: 364, r: 30, g: "pink" },
  { x: 206, y: 364, r: 29, g: "blush" },
  { x: 250, y: 366, r: 28, g: "cream" },
  { x: 292, y: 372, r: 26, g: "pink" },
  { x: 88, y: 404, r: 24, g: "cream" },
  { x: 130, y: 400, r: 27, g: "blush" },
  { x: 176, y: 400, r: 28, g: "cream" },
  { x: 222, y: 400, r: 27, g: "pink" },
  { x: 266, y: 404, r: 24, g: "blush" },
  { x: 118, y: 388, r: 12, g: "cream" },
  { x: 202, y: 388, r: 12, g: "pink" },
  { x: 250, y: 388, r: 11, g: "cream" },
  { x: 150, y: 346, r: 11, g: "cream" },
  { x: 224, y: 346, r: 11, g: "blush" },
];

function Balloon({ x, y, r, g }: { x: number; y: number; r: number; g: G }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.06} fill={`url(#hd-${g})`} />
      <path d={`M${x - r * 0.16} ${y + r} q ${r * 0.16} ${r * 0.22} ${r * 0.32} 0 Z`} fill={`url(#hd-${g})`} />
      <ellipse
        cx={x - r * 0.34}
        cy={y - r * 0.4}
        rx={r * 0.2}
        ry={r * 0.3}
        fill="rgba(255,255,255,0.55)"
        transform={`rotate(-22 ${x - r * 0.34} ${y - r * 0.4})`}
      />
    </g>
  );
}

export function HeroDecor() {
  const reduce = useReducedMotion();

  const parent: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.03, delayChildren: 0.15 } },
  };
  const pop: Variants = {
    hidden: reduce ? {} : { scale: 0, opacity: 0 },
    shown: reduce
      ? { scale: 1, opacity: 1 }
      : { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 15 } },
  };

  return (
    <div
      className="pointer-events-none absolute right-0 top-[44px] z-20 hidden lg:block xl:right-[3%]"
      style={{
        width: "min(31vw, 400px)",
        maskImage: "linear-gradient(#000 90%, transparent)",
        WebkitMaskImage: "linear-gradient(#000 90%, transparent)",
      }}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 360 486"
        fill="none"
        style={{ width: "100%", overflow: "visible" }}
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
      >
        <defs>
          <linearGradient id="hd-foil" gradientUnits="userSpaceOnUse" x1="110" y1="80" x2="250" y2="330">
            <stop offset="0%" stopColor="#F9CEDA" />
            <stop offset="38%" stopColor="#EC9FB6" />
            <stop offset="72%" stopColor="#DA7E9B" />
            <stop offset="100%" stopColor="#C86C89" />
          </linearGradient>
          <radialGradient id="hd-pink" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FBE0E9" />
            <stop offset="55%" stopColor="#E7A9C0" />
            <stop offset="100%" stopColor="#CE86A2" />
          </radialGradient>
          <radialGradient id="hd-cream" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFDF8" />
            <stop offset="60%" stopColor="#F5EEDF" />
            <stop offset="100%" stopColor="#E4D8C2" />
          </radialGradient>
          <radialGradient id="hd-blush" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FBEDEF" />
            <stop offset="58%" stopColor="#F0CFD8" />
            <stop offset="100%" stopColor="#DBAFBC" />
          </radialGradient>
          <radialGradient id="hd-tan" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#F1E1CE" />
            <stop offset="55%" stopColor="#D8B89A" />
            <stop offset="100%" stopColor="#BE9A78" />
          </radialGradient>
          <radialGradient id="hd-blue" cx="36%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#E7F1F5" />
            <stop offset="55%" stopColor="#AFC9D6" />
            <stop offset="100%" stopColor="#8AAAB9" />
          </radialGradient>
          <radialGradient id="hd-heart" cx="40%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#E5D2CE" />
            <stop offset="70%" stopColor="#CBB2AE" />
            <stop offset="100%" stopColor="#AF958F" />
          </radialGradient>
        </defs>

        <motion.g
          variants={parent}
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "shown"}
          style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
        >
          {/* Oscillation lente de tout le bouquet */}
          <motion.g
            animate={reduce ? undefined : { rotate: [-1.4, 1.4, -1.4] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
          >
            {/* Ficelles */}
            <g stroke="rgba(176,132,144,0.45)" strokeWidth="1" fill="none" strokeLinecap="round">
              {FLOAT.map((b, i) => (
                <path
                  key={`fs${i}`}
                  d={`M${b.x} ${b.y + b.r} Q ${(b.x + KNOT.x) / 2 + (i % 2 ? 14 : -14)} ${(b.y + KNOT.y) / 2} ${KNOT.x} ${KNOT.y}`}
                />
              ))}
              <path d={`M120 420 Q 150 432 ${KNOT.x} ${KNOT.y}`} />
              <path d={`M240 420 Q 210 432 ${KNOT.x} ${KNOT.y}`} />
              <path d={`M${KNOT.x} 410 L ${KNOT.x} ${KNOT.y}`} />
            </g>

            {/* Ballons flottants */}
            {FLOAT.map((b, i) => (
              <motion.g
                key={`fb${i}`}
                variants={pop}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              >
                <motion.g
                  animate={reduce ? undefined : { y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5 + i * 0.6, ease: "easeInOut" }}
                >
                  <Balloon {...b} />
                </motion.g>
              </motion.g>
            ))}

            {/* Chiffre 8 — ballons mylar */}
            <motion.g
              variants={{
                hidden: reduce ? {} : { opacity: 0, y: 30 },
                shown: reduce
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
              }}
            >
              {/* liseré */}
              <g stroke="#C06985" strokeLinecap="round" fill="none" opacity="0.45">
                <ellipse cx="180" cy="152" rx="40" ry="49" strokeWidth="50" />
                <ellipse cx="180" cy="266" rx="49" ry="62" strokeWidth="54" />
              </g>
              {/* corps */}
              <g stroke="url(#hd-foil)" strokeLinecap="round" fill="none">
                <ellipse cx="180" cy="152" rx="40" ry="49" strokeWidth="42" />
                <ellipse cx="180" cy="266" rx="49" ry="62" strokeWidth="46" />
              </g>
              {/* brillance */}
              <path d="M150 116 Q 138 150 150 186" stroke="rgba(255,255,255,0.5)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M150 216 Q 134 262 150 314" stroke="rgba(255,255,255,0.5)" strokeWidth="7" strokeLinecap="round" fill="none" />
              <ellipse cx="160" cy="120" rx="9" ry="16" fill="rgba(255,255,255,0.4)" transform="rotate(-18 160 120)" />
            </motion.g>

            {/* Nœud ruban sur le 8 */}
            <motion.g
              variants={{
                hidden: reduce ? {} : { scale: 0, opacity: 0, y: -8 },
                shown: reduce
                  ? { scale: 1, opacity: 1, y: 0 }
                  : { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 15, delay: 0.9 } },
              }}
              style={{ transformOrigin: "224px 116px" }}
            >
              <g transform="translate(224 112)">
                <path d="M0 0 Q -26 -18 -28 8 Q -24 22 0 8 Z" fill="#F6CDD9" />
                <path d="M0 0 Q 26 -18 28 8 Q 24 22 0 8 Z" fill="#EFBED0" />
                <path d="M-3 8 Q -10 32 -7 54 L0 48 L7 54 Q 10 32 3 8 Z" fill="#F6CDD9" />
                <circle cx="0" cy="4" r="7" fill="#E9B2C6" />
              </g>
            </motion.g>

            {/* Grappe de ballons */}
            {CLUSTER.map((b, i) => (
              <motion.g key={`cl${i}`} variants={pop} style={{ transformOrigin: `${b.x}px ${b.y}px` }}>
                <Balloon {...b} />
              </motion.g>
            ))}

            {/* Cœur */}
            <motion.g
              variants={{
                hidden: reduce ? {} : { scale: 0, opacity: 0 },
                shown: reduce
                  ? { scale: 1, opacity: 1 }
                  : { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 240, damping: 14, delay: 0.8 } },
              }}
              style={{ transformOrigin: "180px 378px" }}
            >
              <path
                d="M180 400 C 170 384 144 386 144 408 C 144 432 180 456 180 456 C 180 456 216 432 216 408 C 216 386 190 384 180 400 Z"
                fill="url(#hd-heart)"
              />
              <ellipse cx="162" cy="400" rx="6" ry="9" fill="rgba(255,255,255,0.4)" transform="rotate(-20 162 400)" />
            </motion.g>

            {/* Nœud du bouquet */}
            <motion.g
              variants={{
                hidden: reduce ? {} : { scale: 0 },
                shown: reduce ? { scale: 1 } : { scale: 1, transition: { delay: 1 } },
              }}
              style={{ transformOrigin: `${KNOT.x}px ${KNOT.y}px` }}
            >
              <path d={`M${KNOT.x} ${KNOT.y} Q ${KNOT.x - 20} ${KNOT.y - 6} ${KNOT.x - 16} ${KNOT.y + 14} Q ${KNOT.x - 4} ${KNOT.y + 8} ${KNOT.x} ${KNOT.y} Z`} fill="#E9B2C6" />
              <path d={`M${KNOT.x} ${KNOT.y} Q ${KNOT.x + 20} ${KNOT.y - 6} ${KNOT.x + 16} ${KNOT.y + 14} Q ${KNOT.x + 4} ${KNOT.y + 8} ${KNOT.x} ${KNOT.y} Z`} fill="#F1C4D2" />
              <circle cx={KNOT.x} cy={KNOT.y} r="5" fill="#DDA0B7" />
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
