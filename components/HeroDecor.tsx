"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

// bruit déterministe [0,1)
const noise = (n: number) => {
  const s = Math.sin(n * 91.3 + 47.1) * 6151.7;
  return s - Math.floor(s);
};

const CUSHIONS = ["#D8A7A2", "#E4CBA6", "#D6A374", "#EEE4D5", "#CDA9B2"];
const GARLAND_D =
  "M150 8 C 138 70 162 130 150 196 C 138 262 162 322 150 388 C 144 432 150 456 150 476";
const SETTINGS_Y = [78, 178, 278, 378];

function PlaceSetting({ cx, cy, flip }: { cx: number; cy: number; flip: boolean }) {
  const d = flip ? -1 : 1;
  return (
    <g>
      {/* set de table tressé */}
      <circle cx={cx} cy={cy} r="25" fill="url(#hd-mat)" />
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="rgba(120,88,52,0.28)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="14" fill="none" stroke="rgba(120,88,52,0.22)" strokeWidth="0.8" />
      {/* assiette */}
      <circle cx={cx} cy={cy} r="16.5" fill="#FBF9F5" stroke="rgba(42,35,32,0.08)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="11.5" fill="none" stroke="rgba(42,35,32,0.07)" strokeWidth="0.8" />
      {/* serviette nouée */}
      <g transform={`rotate(${-14 * d} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy + 1} rx="8.5" ry="12" fill="#FEFDFB" stroke="rgba(42,35,32,0.06)" strokeWidth="0.6" />
        <circle cx={cx} cy={cy + 1} r="2.4" fill="#F4EFE7" />
      </g>
      {/* verre */}
      <g transform={`translate(${cx + 19 * d} ${cy - 15})`}>
        <path
          d="M-3.6 -7 Q -4.4 2 0 5.4 Q 4.4 2 3.6 -7 Z"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(42,35,32,0.16)"
          strokeWidth="0.7"
        />
        <line x1="0" y1="5.4" x2="0" y2="12" stroke="rgba(42,35,32,0.16)" strokeWidth="0.7" />
        <line x1="-2.8" y1="12" x2="2.8" y2="12" stroke="rgba(42,35,32,0.16)" strokeWidth="0.7" strokeLinecap="round" />
      </g>
      {/* couverts */}
      <line x1={cx - 22 * d} y1={cy - 8} x2={cx - 22 * d} y2={cy + 8} stroke="rgba(42,35,32,0.2)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1={cx - 25 * d} y1={cy - 8} x2={cx - 25 * d} y2={cy + 8} stroke="rgba(42,35,32,0.15)" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

export function HeroDecor() {
  const reduce = useReducedMotion();
  const garlandRef = useRef<SVGPathElement>(null);
  const [leaves, setLeaves] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const path = garlandRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const N = 22;
    const arr: { x: number; y: number }[] = [];
    for (let i = 1; i < N; i++) {
      const p = path.getPointAtLength((i / N) * len);
      arr.push({ x: p.x, y: p.y });
    }
    setLeaves(arr);
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-[1%] top-1/2 hidden -translate-y-1/2 lg:block xl:right-[3%]"
      style={{ width: "min(29vw, 350px)" }}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 300 484"
        fill="none"
        style={{ width: "100%", overflow: "visible" }}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
      >
        <defs>
          <linearGradient id="hd-wood" x1="0" y1="0" x2="1" y2="0.15">
            <stop offset="0%" stopColor="#E9CCA4" />
            <stop offset="50%" stopColor="#DCB88C" />
            <stop offset="100%" stopColor="#C8A06E" />
          </linearGradient>
          <radialGradient id="hd-mat" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#DAB988" />
            <stop offset="100%" stopColor="#B78E5C" />
          </radialGradient>
          <linearGradient id="hd-euca" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8FA87C" />
            <stop offset="100%" stopColor="#B9CBA3" />
          </linearGradient>
        </defs>

        {/* Pétales qui tombent */}
        {!reduce &&
          [0, 1, 2].map((i) => {
            const x = 40 + noise(i) * 220;
            return (
              <motion.ellipse
                key={`p${i}`}
                cx={x}
                cy={0}
                rx="2.6"
                ry="1.5"
                fill="#EAB6C4"
                style={{ transformOrigin: `${x}px 0px` }}
                animate={{ y: [-20, 500], x: [0, 14, -8, 10], opacity: [0, 0.55, 0.55, 0], rotate: [0, 260] }}
                transition={{ repeat: Infinity, duration: 13 + i * 2, ease: "linear", delay: i * 3.5 }}
              />
            );
          })}

        <motion.g
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
          {/* Coussins de sol */}
          {[40, 132, 224, 316, 408].map((y, i) => (
            <g key={`cl${i}`}>
              <rect
                x="4"
                y={y}
                width="52"
                height="62"
                rx="13"
                fill={CUSHIONS[i % CUSHIONS.length]}
                opacity="0.9"
                transform={`rotate(${(noise(i) - 0.5) * 8} 30 ${y + 31})`}
              />
              <rect
                x={244}
                y={y + 42}
                width="52"
                height="62"
                rx="13"
                fill={CUSHIONS[(i + 2) % CUSHIONS.length]}
                opacity="0.9"
                transform={`rotate(${(noise(i + 9) - 0.5) * 8} 270 ${y + 73})`}
              />
            </g>
          ))}

          {/* Table bois */}
          <rect x="78" y="10" width="144" height="466" rx="9" fill="url(#hd-wood)" />
          {[112, 150, 188].map((x) => (
            <line key={x} x1={x} y1="14" x2={x} y2="472" stroke="rgba(120,84,44,0.16)" strokeWidth="1" />
          ))}
          <rect x="82" y="14" width="136" height="458" rx="7" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {/* Bougeoirs géométriques */}
          {[130, 330].map((cy, i) => (
            <g key={`b${i}`} transform={`translate(150 ${cy})`}>
              <path
                d="M0 -9 L8 -4.5 L8 4.5 L0 9 L-8 4.5 L-8 -4.5 Z"
                fill="none"
                stroke="#C79A5B"
                strokeWidth="1.2"
              />
              <rect x="-2" y="-3.5" width="4" height="7" rx="1" fill="#FBF6EC" />
              <circle cx="0" cy="-5" r="1.5" fill="#F0C29A" />
            </g>
          ))}

          {/* Guirlande d'eucalyptus */}
          <motion.path
            ref={garlandRef}
            d={GARLAND_D}
            stroke="#8FA87C"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease }}
          />
          {leaves.map((l, i) => {
            const side = i % 2 === 0 ? 1 : -1;
            return (
              <motion.g
                key={`lf${i}`}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.5 + i * 0.03 }}
                style={{ transformOrigin: `${l.x}px ${l.y}px` }}
              >
                <motion.ellipse
                  cx={l.x + side * 6}
                  cy={l.y}
                  rx="6"
                  ry="2.9"
                  fill="url(#hd-euca)"
                  opacity="0.9"
                  transform={`rotate(${side * 24} ${l.x + side * 6} ${l.y})`}
                  animate={reduce ? undefined : { rotate: [side * 24 - 4, side * 24 + 4, side * 24 - 4] }}
                  transition={{ repeat: Infinity, duration: 5 + (i % 5), ease: "easeInOut" }}
                  style={{ transformOrigin: `${l.x}px ${l.y}px` }}
                />
              </motion.g>
            );
          })}

          {/* Couverts / assiettes */}
          {SETTINGS_Y.map((y, i) => (
            <g key={`s${i}`}>
              <PlaceSetting cx={116} cy={y} flip={false} />
              <PlaceSetting cx={184} cy={y + 46} flip />
            </g>
          ))}
        </motion.g>
      </motion.svg>
    </div>
  );
}
