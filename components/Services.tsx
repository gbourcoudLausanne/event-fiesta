"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "motion/react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PARTICULIERS_KEYS = ["mariage", "anniversaire", "babyshower", "genderreveal", "bapteme", "piquenique"];

const TINTS = [
  { bg: "#FBEDF0", dot: "#F4A8B8" }, // rose clair
  { bg: "#F9E6EC", dot: "#E79BAF" }, // rose poudré
  { bg: "#FCEDE7", dot: "#EDB49E" }, // blush pêche
  { bg: "#F5ECF2", dot: "#CBA5C4" }, // mauve rosé
  { bg: "#FBE7EC", dot: "#DE7E9A" }, // rose profond
  { bg: "#F8EBE8", dot: "#D89C93" }, // vieux rose
  { bg: "#F3EEF6", dot: "#BFA9D8" }, // lilas doux
  { bg: "#FBF0E6", dot: "#EEC79A" }, // rose doré
];

/* ── Arche de ballons ──────────────────────────────────────────────────── */
const ARCH_D = "M28 420 C28 200 108 26 210 26 C312 26 392 200 392 420";
const GRAD_KEYS = ["rose", "roseDeep", "gold", "blue", "cream"] as const;

const BALLOON_GRADS: Record<string, [string, string, string]> = {
  rose:     ["#FCE2E9", "#F2A6B8", "#DE7C98"],
  roseDeep: ["#F7C9D6", "#E58AA6", "#C65E7F"],
  gold:     ["#F6E2CF", "#E3B593", "#C68C63"],
  blue:     ["#E4F0F5", "#AFD2E1", "#7FB0C6"],
  cream:    ["#FFFDFA", "#F3EBDF", "#DFD2BF"],
};

type PlacedBalloon = { x: number; y: number; r: number; g: string };

// bruit déterministe [0,1) par index
const noise = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const ARCH_CONFETTI = [
  { x: 44,  s: "c", c: "#F2A6B8", d: 0 },
  { x: 108, s: "r", c: "#E3B593", d: 1.8 },
  { x: 168, s: "c", c: "#AFD2E1", d: 3.4 },
  { x: 232, s: "r", c: "#E58AA6", d: 0.9 },
  { x: 296, s: "c", c: "#F2A6B8", d: 4.6 },
  { x: 356, s: "r", c: "#AFD2E1", d: 2.4 },
  { x: 138, s: "c", c: "#E3B593", d: 5.2 },
  { x: 320, s: "r", c: "#E58AA6", d: 3.9 },
];

const DECOR_STEPS = ["Décorer l'arche", "Ajouter des ballons", "La touche florale", "Poser le panneau"];

// Accents métallisés rose gold — niveau ≥ 2
const ARCH_ACCENTS = [
  { x: 56, y: 150, r: 24 },
  { x: 140, y: 54, r: 22 },
  { x: 210, y: 24, r: 26 },
  { x: 296, y: 60, r: 22 },
  { x: 366, y: 172, r: 24 },
];

// Touche florale — niveau ≥ 4
// Plumes de pampa — {x, y, angle°, scale}
const ARCH_PAMPA = [
  { x: 40, y: 262, a: 206, s: 1.18 },
  { x: 58, y: 138, a: 236, s: 1 },
  { x: 150, y: 44, a: 288, s: 0.8 },
  { x: 210, y: 12, a: 300, s: 1.14 },
  { x: 270, y: 44, a: 312, s: 0.8 },
  { x: 362, y: 138, a: 124, s: 1 },
  { x: 380, y: 262, a: 154, s: 1.18 },
];

// Brins d'eucalyptus — {x, y, angle°, scale, flip}
// angle = direction vers laquelle file la tige (extérieur de l'arche, léger tombant)
const ARCH_EUCA = [
  { x: 42, y: 322, a: 248, s: 1.05, flip: false },
  { x: 60, y: 196, a: 262, s: 0.95, flip: false },
  { x: 102, y: 96, a: 274, s: 0.92, flip: false },
  { x: 318, y: 96, a: 86, s: 0.92, flip: true },
  { x: 360, y: 196, a: 98, s: 0.95, flip: true },
  { x: 378, y: 322, a: 112, s: 1.05, flip: true },
];

// Roses poudrées — posées PAR-DESSUS les ballons — {x, y, scale}
const ARCH_BLOOMS = [
  { x: 96, y: 132, s: 1.1 },
  { x: 324, y: 132, s: 1.1 },
  { x: 158, y: 52, s: 0.9 },
  { x: 262, y: 52, s: 0.9 },
  { x: 62, y: 236, s: 0.95 },
  { x: 360, y: 236, s: 0.95 },
];

// Gypsophile (brume) — {x, y, scale}
const ARCH_GYP = [
  { x: 122, y: 108, s: 1 },
  { x: 300, y: 108, s: 1 },
  { x: 186, y: 34, s: 0.85 },
  { x: 236, y: 34, s: 0.85 },
  { x: 80, y: 210, s: 0.9 },
  { x: 342, y: 210, s: 0.9 },
];

function Pampa({ x, y, a, s = 1 }: { x: number; y: number; a: number; s?: number }) {
  const barbs = 27;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {/* Silhouette floue pour le volume */}
      <path
        d="M0 8 C 17 -22 23 -54 12 -90 C 3 -54 -13 -24 0 8 Z"
        fill="url(#ba-pampa)"
        opacity="0.14"
      />
      <g stroke="url(#ba-pampa)" strokeLinecap="round" fill="none">
        <path d="M0 0 C 4 -22 6 -50 5 -80" strokeWidth="1.2" opacity="0.75" />
        {Array.from({ length: barbs }).map((_, k) => {
          const t = k / (barbs - 1);
          const yy = -3 - t * 80;
          const env = Math.sin(t * Math.PI);
          const spread = 3 + env * 10.5 * (1 - t * 0.22);
          const droop = 4 + t * 8;
          const cx = 0.7 + env * 1.3;
          return (
            <g key={k} opacity={0.26 + 0.42 * env}>
              <path
                d={`M${cx} ${yy} q ${spread * 0.55} ${-droop * 0.28} ${spread} ${-droop}`}
                strokeWidth="0.5"
              />
              <path
                d={`M${-cx} ${yy} q ${-spread * 0.55} ${-droop * 0.28} ${-spread} ${-droop}`}
                strokeWidth="0.5"
              />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Eucalyptus({
  x,
  y,
  a,
  s = 1,
  flip = false,
}: {
  x: number;
  y: number;
  a: number;
  s?: number;
  flip?: boolean;
}) {
  const leaves = 12;
  const dir = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {/* tige : bout coupé à l'ancrage (0,0), file vers l'extérieur */}
      <path
        d={`M0 0 Q ${8 * dir} -24 ${3 * dir} -62`}
        stroke="#9DB18C"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: leaves }).map((_, k) => {
        const t = (k + 1) / leaves; // rien pile sur le bout coupé
        const ly = -6 - t * 56;
        const stemX = t * 3 * dir;
        const side = k % 2 === 0 ? 1 : -1;
        const env = Math.sin(t * Math.PI); // feuillage plein au milieu, fin à la pointe
        const lr = 3 + env * 3.8;
        const anchorX = stemX + side * dir * lr * 0.8;
        return (
          <ellipse
            key={k}
            cx={anchorX}
            cy={ly}
            rx={lr}
            ry={lr * 0.62}
            fill="url(#ba-euca)"
            opacity={0.52 + 0.32 * env}
            transform={`rotate(${-side * 40 * dir} ${anchorX} ${ly})`}
          />
        );
      })}
    </g>
  );
}

function Bloom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* feuilles */}
      <ellipse cx="-10" cy="4" rx="5.6" ry="2.7" fill="url(#ba-euca)" opacity="0.92" transform="rotate(-24 -10 4)" />
      <ellipse cx="10" cy="4" rx="5.6" ry="2.7" fill="url(#ba-euca)" opacity="0.92" transform="rotate(24 10 4)" />
      {/* pétales externes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-6.5"
          rx="4"
          ry="6"
          fill="url(#ba-bloom)"
          opacity="0.5"
          transform={`rotate(${i * 60} 0 0)`}
        />
      ))}
      {/* cœur */}
      <circle r="7" fill="url(#ba-bloom)" />
      <path d="M-4.6 -3.6 A 6.5 6.5 0 0 1 4.6 -4.6" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle r="2.6" fill="#C4788F" />
    </g>
  );
}

function Gyp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pts: [number, number][] = [
    [0, 0],
    [4.5, -5],
    [-4, -4.5],
    [6.5, 2],
    [-6, 1.5],
    [2, -9.5],
    [-2.5, 4.5],
    [8, -3],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {pts.map(([px, py], i) => (
        <g key={i}>
          <line x1="0" y1="0" x2={px} y2={py} stroke="#CAD4BD" strokeWidth="0.45" />
          <circle cx={px} cy={py} r="1.5" fill="#FBF8F1" stroke="rgba(190,168,180,0.45)" strokeWidth="0.35" />
        </g>
      ))}
    </g>
  );
}

function BalloonArch({ level }: { level: number }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [balloons, setBalloons] = useState<(PlacedBalloon & { tier: number })[]>([]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -70]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const N = 58;
    const arr: (PlacedBalloon & { tier: number })[] = [];
    for (let i = 0; i < N; i++) {
      const l = (i / (N - 1)) * len;
      const p = path.getPointAtLength(l);
      const p2 = path.getPointAtLength(Math.min(len, l + 2));
      let nx = -(p2.y - p.y);
      let ny = p2.x - p.x;
      const m = Math.hypot(nx, ny) || 1;
      nx /= m;
      ny /= m;
      const side = i % 2 === 0 ? 1 : -1;
      const off = side * (2 + noise(i) * 9);
      const jitter = (noise(i + 99) - 0.5) * 3;
      const r = 8 + noise(i + 7) * 14;
      arr.push({
        x: p.x + nx * off + jitter,
        y: p.y + ny * off,
        r,
        g: GRAD_KEYS[i % GRAD_KEYS.length],
        tier: noise(i + 3) < 0.45 ? 1 : 2,
      });
    }
    setBalloons(arr);
  }, []);

  const pop = {
    initial: reduce ? false : { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  return (
    <motion.div
      ref={wrapRef}
      className="absolute pointer-events-none hidden lg:block"
      style={{ top: "8%", right: "-7%", width: "min(42vw, 640px)", y }}
    >
      <motion.svg viewBox="0 0 420 420" fill="none" style={{ overflow: "visible", width: "100%" }} aria-hidden>
        <defs>
          {GRAD_KEYS.map((k) => {
            const [a, b, c] = BALLOON_GRADS[k];
            return (
              <radialGradient key={k} id={`ba-${k}`} cx="34%" cy="28%" r="78%">
                <stop offset="0%" stopColor={a} />
                <stop offset="52%" stopColor={b} />
                <stop offset="100%" stopColor={c} />
              </radialGradient>
            );
          })}
          <linearGradient id="ba-pampa" x1="0" y1="1" x2="0.15" y2="0">
            <stop offset="0%" stopColor="#C6AD86" />
            <stop offset="55%" stopColor="#DECBAA" />
            <stop offset="100%" stopColor="#F3E7D2" />
          </linearGradient>
          <linearGradient id="ba-euca" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93A985" />
            <stop offset="100%" stopColor="#BFD0AC" />
          </linearGradient>
          <radialGradient id="ba-bloom" cx="40%" cy="36%" r="66%">
            <stop offset="0%" stopColor="#F7CED7" />
            <stop offset="66%" stopColor="#E4A2B2" />
            <stop offset="100%" stopColor="#CB7E96" />
          </radialGradient>
        </defs>

        {/* Confettis qui tombent en continu */}
        {!reduce &&
          ARCH_CONFETTI.map((f, i) => (
            <motion.g
              key={`ac${i}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              animate={{ y: [-30, 460], rotate: [0, 240], opacity: [0, 0.6, 0.6, 0] }}
              transition={{ repeat: Infinity, duration: 9 + i, ease: "linear", delay: f.d }}
              style={{ transformOrigin: `${f.x}px 0px` }}
            >
              {f.s === "c" ? (
                <circle cx={f.x} cy={0} r={3} fill={f.c} />
              ) : (
                <rect x={f.x - 1.6} y={-5} width={3.2} height={10} rx={1.2} fill={f.c} />
              )}
            </motion.g>
          ))}

        <motion.path
          ref={pathRef}
          d={ARCH_D}
          stroke="rgba(217,98,138,0.16)"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={reduce ? undefined : { pathLength: 0 }}
          whileInView={reduce ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, ease }}
        />

        <motion.g
          animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 2.4 }}
          style={{ transformOrigin: "210px 26px" }}
        >
          {/* Touche florale — niveau 4 : eucalyptus + pampa en fond */}
          <AnimatePresence>
            {level >= 4 &&
              ARCH_EUCA.map((e, i) => (
                <motion.g
                  key={`e${i}`}
                  {...pop}
                  transition={{ type: "spring", stiffness: 220, damping: 17, delay: 0.04 + i * 0.06 }}
                  style={{ transformOrigin: `${e.x}px ${e.y}px` }}
                >
                  <motion.g
                    animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
                    transition={{ repeat: Infinity, duration: 6 + i * 0.7, ease: "easeInOut" }}
                    style={{ transformOrigin: `${e.x}px ${e.y}px` }}
                  >
                    <Eucalyptus {...e} />
                  </motion.g>
                </motion.g>
              ))}
            {level >= 4 &&
              ARCH_PAMPA.map((pp, i) => (
                <motion.g
                  key={`p${i}`}
                  {...pop}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.12 + i * 0.07 }}
                  style={{ transformOrigin: `${pp.x}px ${pp.y}px` }}
                >
                  <motion.g
                    animate={reduce ? undefined : { rotate: [-2.2, 2.2, -2.2] }}
                    transition={{ repeat: Infinity, duration: 7 + i * 0.5, ease: "easeInOut" }}
                    style={{ transformOrigin: `${pp.x}px ${pp.y}px` }}
                  >
                    <Pampa {...pp} />
                  </motion.g>
                </motion.g>
              ))}
          </AnimatePresence>

          {/* Arche nue au niveau 1 ; ballons tier 1 dès le niveau 2, tier 2 dès le niveau 3 */}
          <AnimatePresence>
            {balloons.map((b, i) =>
              level >= b.tier + 1 ? (
                <motion.g
                  key={i}
                  {...pop}
                  transition={{ type: "spring", stiffness: 300, damping: 13, delay: noise(i) * 0.35 }}
                  style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                >
                  <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#ba-${b.g})`} opacity="0.92" />
                  <ellipse
                    cx={b.x - b.r * 0.32}
                    cy={b.y - b.r * 0.38}
                    rx={b.r * 0.24}
                    ry={b.r * 0.34}
                    fill="rgba(255,255,255,0.5)"
                    transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.38})`}
                  />
                </motion.g>
              ) : null,
            )}
          </AnimatePresence>

          {/* Accents rose gold — niveau 3 */}
          <AnimatePresence>
            {level >= 3 &&
              ARCH_ACCENTS.map((b, i) => (
                <motion.g
                  key={`g${i}`}
                  {...pop}
                  transition={{ type: "spring", stiffness: 300, damping: 13, delay: i * 0.06 }}
                  style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                >
                  <circle cx={b.x} cy={b.y} r={b.r} fill="url(#ba-gold)" stroke="rgba(198,140,99,0.5)" strokeWidth="0.6" />
                  <ellipse cx={b.x - b.r * 0.34} cy={b.y - b.r * 0.4} rx={b.r * 0.2} ry={b.r * 0.3} fill="rgba(255,255,255,0.7)" transform={`rotate(-22 ${b.x - b.r * 0.34} ${b.y - b.r * 0.4})`} />
                </motion.g>
              ))}
          </AnimatePresence>

          {/* Touche florale — niveau 4 : roses + gypsophile posées par-dessus */}
          <AnimatePresence>
            {level >= 4 &&
              ARCH_GYP.map((g, i) => (
                <motion.g
                  key={`gy${i}`}
                  {...pop}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.34 + i * 0.05 }}
                  style={{ transformOrigin: `${g.x}px ${g.y}px` }}
                >
                  <motion.g
                    animate={reduce ? undefined : { rotate: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 5 + i * 0.6, ease: "easeInOut" }}
                    style={{ transformOrigin: `${g.x}px ${g.y}px` }}
                  >
                    <Gyp {...g} />
                  </motion.g>
                </motion.g>
              ))}
            {level >= 4 &&
              ARCH_BLOOMS.map((bl, i) => (
                <motion.g
                  key={`bl${i}`}
                  initial={reduce ? false : { scale: 0, opacity: 0, rotate: -28 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.42 + i * 0.09 }}
                  style={{ transformOrigin: `${bl.x}px ${bl.y}px` }}
                >
                  <motion.g
                    animate={reduce ? undefined : { rotate: [-2, 2, -2], y: [0, -1.5, 0] }}
                    transition={{ repeat: Infinity, duration: 6.5 + i * 0.5, ease: "easeInOut" }}
                    style={{ transformOrigin: `${bl.x}px ${bl.y}px` }}
                  >
                    <Bloom {...bl} />
                  </motion.g>
                </motion.g>
              ))}
          </AnimatePresence>

          {/* Panneau « Bienvenue » — niveau 5 */}
          <AnimatePresence>
            {level >= 5 && (
              <motion.g
                key="sign"
                initial={reduce ? false : { y: -14, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -14, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                style={{ transformOrigin: "210px 40px" }}
              >
                <path d="M188 44 L184 76 M232 44 L236 76" stroke="rgba(120,60,80,0.35)" strokeWidth="1.2" strokeLinecap="round" />
                <rect x="150" y="74" width="120" height="42" rx="4" fill="#FAF7F2" stroke="rgba(217,98,138,0.3)" strokeWidth="1" />
                <text
                  x="210"
                  y="101"
                  textAnchor="middle"
                  fill="#B65572"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: "italic", fontSize: 20, fontWeight: 300 }}
                >
                  Bienvenue
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}

// Bouton interactif superposé au centre de l'arche (rendu après le contenu → cliquable)
function ArchDecorButton({
  level,
  onStep,
  onReset,
}: {
  level: number;
  onStep: () => void;
  onReset: () => void;
}) {
  return (
    <div
      className="absolute z-30 hidden lg:block pointer-events-none"
      style={{
        top: "8%",
        right: "-7%",
        width: "min(42vw, 640px)",
        height: "min(42vw, 640px)",
      }}
    >
      <div
        className="absolute flex flex-col items-center gap-1.5 pointer-events-auto"
        style={{ left: "50%", top: "44%", transform: "translate(-50%, -50%)" }}
      >
        {level < 5 ? (
          <button
            type="button"
            onClick={onStep}
            className="inline-flex items-center gap-1.5 font-sans text-[10.5px] font-medium tracking-wide px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors duration-200 cursor-pointer"
            style={{
              background: "rgba(250,247,242,0.72)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              border: "1px solid rgba(217,98,138,0.35)",
              color: "#B65572",
            }}
          >
            {DECOR_STEPS[level - 1]}
            <span aria-hidden style={{ opacity: 0.6 }}>✨</span>
          </button>
        ) : (
          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[11px] font-medium px-5 py-2.5 rounded-full whitespace-nowrap transition-transform duration-200 hover:scale-[1.04] shadow-md"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
          >
            Et la vôtre ? Demander un devis
            <ArrowUpRight size={12} weight="bold" />
          </Link>
        )}
        {level > 1 && (
          <button
            type="button"
            onClick={onReset}
            className="font-sans text-[9px] uppercase tracking-[0.16em] cursor-pointer transition-colors hover:text-[rgba(42,35,32,0.7)]"
            style={{ color: "rgba(42,35,32,0.38)" }}
          >
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}

type Card = { key: string; name: string; desc: string };

function ServiceCard({
  card,
  i,
  tint,
}: {
  card: Card;
  i: number;
  tint: { bg: string; dot: string };
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, delay: i * 0.07, ease }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduce ? undefined : { boxShadow: `0 36px 70px -28px ${tint.dot}88` }}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          boxShadow: "0 2px 10px rgba(13,11,8,0.04)",
        }}
        className="group relative h-full"
      >
        <Link
          href="/nos-services"
          className="relative flex h-full flex-col overflow-hidden p-6 lg:p-8"
          style={{
            background: `linear-gradient(158deg, ${tint.bg} 0%, #FAF7F2 135%)`,
            border: `1px solid ${tint.dot}3d`,
            minHeight: 232,
          }}
        >
          {/* Numéro fantôme */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-6 select-none font-serif font-light leading-none transition-transform duration-500 group-hover:scale-110"
            style={{ fontSize: "6rem", color: `${tint.dot}24` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="relative z-10 flex h-full flex-col">
            <span className="mb-6 h-2.5 w-2.5 rounded-full" style={{ background: tint.dot }} aria-hidden />
            <h3
              className="font-serif leading-tight"
              style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "#2A2320" }}
            >
              {card.name}
            </h3>
            <p
              className="mt-2.5 flex-1 font-sans text-[13.5px] leading-relaxed"
              style={{ color: "rgba(40,34,30,0.56)" }}
            >
              {card.desc}
            </p>
            <span
              className="mt-5 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] opacity-75 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: "#B0546F" }}
            >
              En savoir plus
              <ArrowUpRight
                size={13}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"part" | "pro">("part");
  const [decor, setDecor] = useState(1);

  // Intro au scroll : l'arche apparaît finie (5), tient un instant, puis se vide
  // pour intriguer et inviter à cliquer.
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.12 });
  useEffect(() => {
    if (!inView || reduce) return; // reduce : l'arche reste vide (état initial)
    const t0 = setTimeout(() => setDecor(5), 350);
    const t1 = setTimeout(() => setDecor(1), 7350);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [inView, reduce]);

  const particuliers: Card[] = t.services.index.filter((x) =>
    PARTICULIERS_KEYS.includes(x.key),
  );
  const pro: Card[] = t.services.proItems.map((p) => ({
    key: p.key,
    name: p.title,
    desc: p.desc,
  }));
  const cards = tab === "part" ? particuliers : pro;

  const tabs = [
    { id: "part" as const, label: t.services.particuliers.label },
    { id: "pro" as const, label: t.services.professionnels.label },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden pt-20 lg:pt-28 pb-12 lg:pb-14"
      style={{ background: "#FAF7F2" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.32,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <BalloonArch level={decor} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* En-tête */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mb-10 lg:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.services.eyebrow}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)", color: "#2A2320" }}
          >
            {t.services.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.services.intro}
          </p>
        </motion.div>

        {/* Onglets */}
        <div
          className="flex items-center gap-8 mb-8 lg:mb-10 border-b"
          style={{ borderColor: "rgba(42,35,32,0.12)" }}
        >
          {tabs.map((tb) => {
            const on = tab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(tb.id)}
                className="relative pb-4 font-serif font-light transition-colors duration-300 cursor-pointer"
                style={{
                  fontSize: "clamp(1.1rem, 1.9vw, 1.55rem)",
                  color: on ? "#B65572" : "rgba(42,35,32,0.4)",
                  fontStyle: on ? "italic" : "normal",
                }}
              >
                {tb.label}
                {on && (
                  <motion.span
                    layoutId="svc-tab-underline"
                    className="absolute left-0 right-0 -bottom-px h-[2px]"
                    style={{ background: "#D9628A" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grille dynamique */}
        <ul
          key={tab}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
        >
          {cards.map((it, i) => (
            <ServiceCard key={it.key} card={it} i={i} tint={TINTS[i % TINTS.length]} />
          ))}
        </ul>

        <Link
          href="/nos-services"
          className="group mt-8 lg:mt-10 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "#B65572" }}
        >
          {t.services.ctaAll}
          <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <ArchDecorButton
        level={decor}
        onStep={() => setDecor((d) => Math.min(5, d + 1))}
        onReset={() => setDecor(1)}
      />
    </section>
  );
}
