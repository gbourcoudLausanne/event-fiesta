"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
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

type PlacedBalloon = { x: number; y: number; r: number; g: string; blur: boolean };

// bruit déterministe [0,1) par index
const noise = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function BalloonArch() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [balloons, setBalloons] = useState<PlacedBalloon[]>([]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -70]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const N = 44;
    const arr: PlacedBalloon[] = [];
    for (let i = 0; i < N; i++) {
      const l = (i / (N - 1)) * len;
      const p = path.getPointAtLength(l);
      const p2 = path.getPointAtLength(Math.min(len, l + 2));
      let nx = -(p2.y - p.y);
      let ny = p2.x - p.x;
      const m = Math.hypot(nx, ny) || 1;
      nx /= m;
      ny /= m;
      // alterne intérieur / extérieur de l'arc + petite dispersion
      const side = i % 2 === 0 ? 1 : -1;
      const off = side * (3 + noise(i) * 15);
      const jitter = (noise(i + 99) - 0.5) * 6;
      const r = 8 + noise(i + 7) * 15;
      arr.push({
        x: p.x + nx * off + jitter,
        y: p.y + ny * off,
        r,
        g: GRAD_KEYS[i % GRAD_KEYS.length],
        blur: i % 6 === 4,
      });
    }
    setBalloons(arr);
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      className="absolute pointer-events-none hidden lg:block"
      style={{ top: "2%", right: "-7%", width: "min(42vw, 640px)", y }}
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 420 420"
        fill="none"
        style={{ overflow: "visible", width: "100%" }}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.3 }}
      >
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
          <filter id="ba-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        <motion.path
          ref={pathRef}
          d={ARCH_D}
          stroke="rgba(217,98,138,0.16)"
          strokeWidth="1.4"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
          transition={{ duration: 1.5, ease }}
        />

        <motion.g
          animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 2.4 }}
          style={{ transformOrigin: "210px 26px" }}
        >
          <motion.g variants={{ shown: { transition: { staggerChildren: 0.026, delayChildren: 0.3 } } }}>
            {balloons.map((b, i) => (
              <motion.g
                key={i}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  shown: {
                    scale: 1,
                    opacity: b.blur ? 0.3 : 0.9,
                    transition: { type: "spring", stiffness: 300, damping: 13 },
                  },
                }}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                filter={b.blur ? "url(#ba-blur)" : undefined}
              >
                <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#ba-${b.g})`} />
                <ellipse
                  cx={b.x - b.r * 0.32}
                  cy={b.y - b.r * 0.38}
                  rx={b.r * 0.24}
                  ry={b.r * 0.34}
                  fill="rgba(255,255,255,0.5)"
                  transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.38})`}
                />
              </motion.g>
            ))}
          </motion.g>
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}

type Card = { key: string; name: string; desc: string };

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"part" | "pro">("part");

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
      <BalloonArch />

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
        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
          >
            {cards.map((it, i) => {
              const tint = TINTS[i % TINTS.length];
              return (
                <motion.li
                  key={it.key}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease }}
                >
                  <Link
                    href="/nos-services"
                    className="group relative flex h-full flex-col p-6 lg:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: tint.bg, minHeight: 196, boxShadow: "0 1px 2px rgba(13,11,8,0.03)" }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-sans text-[11px] tabular-nums" style={{ color: "rgba(13,11,8,0.35)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ background: tint.dot }} aria-hidden />
                    </div>
                    <h3
                      className="font-serif font-light text-xl lg:text-2xl leading-tight"
                      style={{ color: "#2A2320" }}
                    >
                      {it.name}
                    </h3>
                    <p
                      className="font-sans font-light text-[13px] leading-relaxed mt-2 flex-1"
                      style={{ color: "rgba(42,35,32,0.55)" }}
                    >
                      {it.desc}
                    </p>
                    <ArrowUpRight
                      size={15}
                      weight="bold"
                      className="mt-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ color: "#B65572" }}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>

        <Link
          href="/nos-services"
          className="group mt-10 lg:mt-12 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "#B65572" }}
        >
          {t.services.ctaAll}
          <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
