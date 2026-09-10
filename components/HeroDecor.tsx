"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

const noise = (n: number) => {
  const s = Math.sin(n * 91.3 + 47.1) * 6151.7;
  return s - Math.floor(s);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CX = 150;
const NEAR_Y = 424;
const FAR_Y = 28;
const NEAR_HW = 92; // demi-largeur table près
const FAR_HW = 34; // demi-largeur table loin

const CUSHIONS = ["#D8A7A2", "#E4CBA6", "#D6A374", "#EFE5D6", "#CDA9B2"];
const GARLAND_D = `M${CX} ${FAR_Y - 6} C ${CX - 10} ${lerp(FAR_Y, NEAR_Y, 0.3)} ${CX + 12} ${lerp(FAR_Y, NEAR_Y, 0.55)} ${CX} ${lerp(FAR_Y, NEAR_Y, 0.78)} C ${CX - 8} ${lerp(FAR_Y, NEAR_Y, 0.92)} ${CX} ${NEAR_Y - 30} ${CX} ${NEAR_Y + 6}`;

// 5 rangées de couverts, de la plus proche (t=0) à la plus lointaine (t=1)
const ROWS = [0, 1, 2, 3, 4].map((i) => {
  const t = i / 4;
  return {
    y: lerp(NEAR_Y - 40, FAR_Y + 46, t),
    s: lerp(1, 0.42, t),
    hw: lerp(NEAR_HW, FAR_HW, t),
  };
});

function PlaceSetting({ x, y, s, flip }: { x: number; y: number; s: number; flip: boolean }) {
  const d = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="25" fill="url(#hd-mat)" />
      <circle r="20" fill="none" stroke="rgba(120,88,52,0.28)" strokeWidth="0.9" />
      <circle r="14" fill="none" stroke="rgba(120,88,52,0.22)" strokeWidth="0.9" />
      <circle r="16.5" fill="#FBF9F5" stroke="rgba(42,35,32,0.08)" strokeWidth="0.9" />
      <circle r="11.5" fill="none" stroke="rgba(42,35,32,0.07)" strokeWidth="0.9" />
      <g transform={`rotate(${-15 * d})`}>
        <ellipse cy="1" rx="8.5" ry="12" fill="#FEFDFB" stroke="rgba(42,35,32,0.06)" strokeWidth="0.7" />
        <circle cy="1" r="2.4" fill="#F3EEE5" />
      </g>
      <g transform={`translate(${19 * d} -15)`}>
        <path d="M-3.6 -7 Q -4.4 2 0 5.4 Q 4.4 2 3.6 -7 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(42,35,32,0.16)" strokeWidth="0.8" />
        <line x1="0" y1="5.4" x2="0" y2="12" stroke="rgba(42,35,32,0.16)" strokeWidth="0.8" />
        <line x1="-2.8" y1="12" x2="2.8" y2="12" stroke="rgba(42,35,32,0.16)" strokeWidth="0.8" strokeLinecap="round" />
      </g>
      <line x1={-22 * d} y1="-8" x2={-22 * d} y2="8" stroke="rgba(42,35,32,0.22)" strokeWidth="1" strokeLinecap="round" />
      <line x1={-25 * d} y1="-8" x2={-25 * d} y2="8" stroke="rgba(42,35,32,0.16)" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

export function HeroDecor() {
  const reduce = useReducedMotion();
  const garlandRef = useRef<SVGPathElement>(null);
  const [leaves, setLeaves] = useState<{ x: number; y: number; s: number }[]>([]);

  useEffect(() => {
    const path = garlandRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const N = 24;
    const arr: { x: number; y: number; s: number }[] = [];
    for (let i = 1; i < N; i++) {
      const p = path.getPointAtLength((i / N) * len);
      const t = (p.y - FAR_Y) / (NEAR_Y - FAR_Y);
      arr.push({ x: p.x, y: p.y, s: lerp(0.55, 1.15, t) });
    }
    setLeaves(arr);
  }, []);

  return (
    <div
      className="pointer-events-none absolute right-0 top-[58px] z-20 hidden lg:block xl:right-[2%]"
      style={{
        width: "min(34vw, 415px)",
        maskImage: "linear-gradient(#000 86%, transparent)",
        WebkitMaskImage: "linear-gradient(#000 86%, transparent)",
      }}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 300 470"
        fill="none"
        style={{ width: "100%", overflow: "visible" }}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
      >
        <defs>
          <linearGradient id="hd-wood" x1="0" y1="1" x2="0.1" y2="0">
            <stop offset="0%" stopColor="#E9CCA4" />
            <stop offset="55%" stopColor="#D9B285" />
            <stop offset="100%" stopColor="#BE9666" />
          </linearGradient>
          <radialGradient id="hd-mat" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#DCBB8A" />
            <stop offset="100%" stopColor="#B58C5A" />
          </radialGradient>
          <linearGradient id="hd-euca" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8CA679" />
            <stop offset="100%" stopColor="#BBCDA5" />
          </linearGradient>
          <radialGradient id="hd-sun" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#FBE6C6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FBE6C6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hd-warm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6C98C" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#F6C98C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lueur de coucher de soleil */}
        <ellipse cx={CX} cy="20" rx="190" ry="110" fill="url(#hd-sun)" />

        {/* Pétales / poussière lumineuse */}
        {!reduce &&
          [0, 1, 2, 3].map((i) => {
            const x = 30 + noise(i) * 240;
            return (
              <motion.ellipse
                key={`p${i}`}
                cx={x}
                cy={0}
                rx="2.4"
                ry="1.4"
                fill={i % 2 ? "#EAB6C4" : "#F0CDA0"}
                style={{ transformOrigin: `${x}px 0px` }}
                animate={{ y: [-20, 470], x: [0, 16, -10, 8], opacity: [0, 0.5, 0.5, 0], rotate: [0, 300] }}
                transition={{ repeat: Infinity, duration: 14 + i * 2, ease: "linear", delay: i * 3 }}
              />
            );
          })}

        <motion.g
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
        >
          {/* Nappe / plaid au sol */}
          <ellipse cx={CX} cy={NEAR_Y - 6} rx={NEAR_HW + 78} ry="54" fill="#F1E8DB" opacity="0.55" />

          {/* Coussins de sol, en perspective */}
          {ROWS.map((r, i) => {
            const cw = 46 * r.s + 14;
            const ch = 52 * r.s + 12;
            const off = r.hw + cw * 0.6;
            return (
              <g key={`c${i}`}>
                <ellipse cx={CX - off + 4} cy={r.y + ch / 2 + 6} rx={cw * 0.6} ry="7" fill="rgba(90,60,50,0.12)" />
                <rect
                  x={CX - off - cw / 2}
                  y={r.y - ch / 2}
                  width={cw}
                  height={ch}
                  rx={cw * 0.24}
                  fill={CUSHIONS[i % CUSHIONS.length]}
                  opacity="0.92"
                  transform={`rotate(${(noise(i) - 0.5) * 8} ${CX - off} ${r.y})`}
                />
                <ellipse cx={CX + off - 4} cy={r.y + ch / 2 + 6} rx={cw * 0.6} ry="7" fill="rgba(90,60,50,0.12)" />
                <rect
                  x={CX + off - cw / 2}
                  y={r.y - ch / 2}
                  width={cw}
                  height={ch}
                  rx={cw * 0.24}
                  fill={CUSHIONS[(i + 2) % CUSHIONS.length]}
                  opacity="0.92"
                  transform={`rotate(${(noise(i + 9) - 0.5) * 8} ${CX + off} ${r.y})`}
                />
              </g>
            );
          })}

          {/* Table bois en perspective */}
          <path
            d={`M${CX - NEAR_HW} ${NEAR_Y} L${CX - FAR_HW} ${FAR_Y} Q ${CX} ${FAR_Y - 8} ${CX + FAR_HW} ${FAR_Y} L${CX + NEAR_HW} ${NEAR_Y} Q ${CX} ${NEAR_Y + 12} ${CX - NEAR_HW} ${NEAR_Y} Z`}
            fill="url(#hd-wood)"
          />
          {/* planches qui fuient */}
          {[-0.5, 0, 0.5].map((k, i) => (
            <line
              key={i}
              x1={CX + k * NEAR_HW}
              y1={NEAR_Y}
              x2={CX + k * FAR_HW}
              y2={FAR_Y}
              stroke="rgba(120,84,44,0.16)"
              strokeWidth="1"
            />
          ))}
          {/* tranche avant (proche) */}
          <path
            d={`M${CX - NEAR_HW} ${NEAR_Y} Q ${CX} ${NEAR_Y + 12} ${CX + NEAR_HW} ${NEAR_Y} L${CX + NEAR_HW} ${NEAR_Y + 16} Q ${CX} ${NEAR_Y + 28} ${CX - NEAR_HW} ${NEAR_Y + 16} Z`}
            fill="#A9814F"
          />

          {/* Guirlande d'eucalyptus */}
          <motion.path
            ref={garlandRef}
            d={GARLAND_D}
            stroke="#8CA679"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            initial={reduce ? undefined : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease }}
          />
          {leaves.map((l, i) => {
            const side = i % 2 === 0 ? 1 : -1;
            const rot = side * 24;
            return (
              <motion.ellipse
                key={`lf${i}`}
                cx={l.x + side * 6 * l.s}
                cy={l.y}
                rx={6 * l.s}
                ry={2.9 * l.s}
                fill="url(#hd-euca)"
                opacity="0.92"
                style={{ transformOrigin: `${l.x}px ${l.y}px` }}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={
                  reduce
                    ? { rotate: rot }
                    : { scale: 1, opacity: 0.92, rotate: [rot - 4, rot + 4, rot - 4] }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        scale: { type: "spring", stiffness: 240, damping: 16, delay: 0.5 + i * 0.03 },
                        opacity: { duration: 0.3, delay: 0.5 + i * 0.03 },
                        rotate: { repeat: Infinity, duration: 5 + (i % 5), ease: "easeInOut" },
                      }
                }
              />
            );
          })}

          {/* Bougeoirs géométriques dorés */}
          {[0.28, 0.62].map((t, i) => {
            const y = lerp(NEAR_Y - 40, FAR_Y + 46, t);
            const s = lerp(1, 0.42, t);
            return (
              <g key={`b${i}`} transform={`translate(${CX + (i ? 16 : -14) * s} ${y}) scale(${s})`}>
                <path d="M0 -9 L8 -4.5 L8 4.5 L0 9 L-8 4.5 L-8 -4.5 Z" fill="none" stroke="#C79A5B" strokeWidth="1.3" />
                <rect x="-2" y="-3.5" width="4" height="7" rx="1" fill="#FBF6EC" />
                <circle cx="0" cy="-5" r="1.6" fill="#F1C58F" />
              </g>
            );
          })}

          {/* Couverts */}
          {ROWS.map((r, i) => (
            <g key={`s${i}`}>
              <PlaceSetting x={CX - r.hw * 0.52} y={r.y} s={r.s} flip={false} />
              <PlaceSetting x={CX + r.hw * 0.52} y={r.y - 8 * r.s} s={r.s} flip />
            </g>
          ))}

          {/* Éclats lumineux sur les verres */}
          {!reduce &&
            [0.12, 0.4, 0.7].map((t, i) => {
              const y = lerp(NEAR_Y - 52, FAR_Y + 40, t);
              const s = lerp(1, 0.5, t);
              return (
                <motion.g
                  key={`sp${i}`}
                  transform={`translate(${CX + (i % 2 ? 30 : -26) * s} ${y}) scale(${s})`}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 1.4, ease: "easeInOut" }}
                >
                  <path d="M0 -5 L1.1 -1.1 L5 0 L1.1 1.1 L0 5 L-1.1 1.1 L-5 0 L-1.1 -1.1 Z" fill="#FFF6E4" />
                </motion.g>
              );
            })}
        </motion.g>

        {/* Voile chaud du coucher de soleil */}
        <rect x="0" y="0" width="300" height="470" fill="url(#hd-warm)" style={{ mixBlendMode: "soft-light" }} />
      </motion.svg>
    </div>
  );
}
