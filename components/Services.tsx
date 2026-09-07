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
} from "motion/react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PARTICULIERS_KEYS = ["mariage", "anniversaire", "babyshower", "genderreveal", "bapteme", "piquenique"];

const TINTS = [
  { bg: "#FBEDF0", dot: "#F4A8B8" },
  { bg: "#ECF3F6", dot: "#A8CEE0" },
  { bg: "#FBF1E7", dot: "#F0C29A" },
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

// Plumes de pampa — niveau ≥ 3 — {x, y, angle°}
const ARCH_PAMPA = [
  { x: 46, y: 366, a: 205 },
  { x: 58, y: 150, a: 250 },
  { x: 210, y: 18, a: 300 },
  { x: 362, y: 150, a: 110 },
  { x: 380, y: 366, a: 335 },
];

function Pampa({ x, y, a }: { x: number; y: number; a: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`} stroke="#CBB994" strokeLinecap="round" fill="none">
      <path d="M0 0 C 8 -14 12 -34 11 -52" strokeWidth="1.4" />
      {Array.from({ length: 9 }).map((_, k) => {
        const tt = (k / 8) * 46 + 4;
        const sp = 4 + tt * 0.16;
        return (
          <g key={k} opacity="0.85">
            <path d={`M${1 + tt * 0.2} ${-tt} q ${sp} -3 ${sp + 3} -9`} strokeWidth="1" />
            <path d={`M${1 + tt * 0.2} ${-tt} q -${sp} -3 -${sp + 1} -9`} strokeWidth="1" />
          </g>
        );
      })}
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
      style={{ top: "2%", right: "-7%", width: "min(42vw, 640px)", y }}
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
          {/* Pampa — niveau 4 */}
          <AnimatePresence>
            {level >= 4 &&
              ARCH_PAMPA.map((pp, i) => (
                <motion.g
                  key={`p${i}`}
                  {...pop}
                  transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.07 }}
                  style={{ transformOrigin: `${pp.x}px ${pp.y}px` }}
                >
                  <Pampa {...pp} />
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
        top: "2%",
        right: "-7%",
        width: "min(42vw, 640px)",
        height: "min(42vw, 640px)",
      }}
    >
      <div
        className="absolute flex flex-col items-center gap-1.5 pointer-events-auto"
        style={{ left: "50%", top: "54%", transform: "translate(-50%, -50%)" }}
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
            className="pointer-events-none absolute -right-2 -top-5 select-none font-serif font-light leading-none transition-transform duration-500 group-hover:scale-110"
            style={{ fontSize: "6.5rem", color: `${tint.dot}30` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="relative z-10 flex h-full flex-col">
            <span className="mb-6 h-2.5 w-2.5 rounded-full" style={{ background: tint.dot }} aria-hidden />
            <h3
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "#2A2320" }}
            >
              {card.name}
            </h3>
            <p
              className="mt-2.5 flex-1 font-sans font-light text-[13px] leading-relaxed"
              style={{ color: "rgba(42,35,32,0.58)" }}
            >
              {card.desc}
            </p>
            <span
              className="mt-5 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] opacity-55 transition-opacity duration-300 group-hover:opacity-100"
              style={{ color: "#B65572" }}
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
      id="services"
      className="relative overflow-hidden py-20 lg:py-28"
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
          className="group mt-10 lg:mt-12 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
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
