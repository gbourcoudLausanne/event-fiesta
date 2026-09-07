"use client";

import { useRef, useState } from "react";
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
// g = clé de dégradé · b = arrière-plan flou (profondeur)
type Balloon = { x: number; y: number; r: number; g: string; b?: boolean };

const BALLOON_GRADS: Record<string, [string, string, string]> = {
  rose:     ["#FCE2E9", "#F2A6B8", "#DE7C98"],
  roseDeep: ["#F7C9D6", "#E58AA6", "#C65E7F"],
  gold:     ["#F6E2CF", "#E3B593", "#C68C63"],
  blue:     ["#E4F0F5", "#AFD2E1", "#7FB0C6"],
  cream:    ["#FFFDFA", "#F3EBDF", "#DFD2BF"],
};

// Garland le long de l'arche (viewBox 420×420), du bas-gauche au bas-droite.
const BALLOONS: Balloon[] = [
  { x: 34, y: 402, r: 20, g: "rose" }, { x: 16, y: 380, r: 13, g: "cream", b: true },
  { x: 44, y: 372, r: 15, g: "gold" }, { x: 24, y: 350, r: 22, g: "roseDeep" },
  { x: 50, y: 336, r: 12, g: "blue" }, { x: 30, y: 316, r: 17, g: "rose" },
  { x: 15, y: 300, r: 11, g: "cream", b: true }, { x: 48, y: 296, r: 21, g: "gold" },
  { x: 33, y: 272, r: 14, g: "blue" }, { x: 52, y: 254, r: 18, g: "roseDeep" },
  { x: 37, y: 232, r: 12, g: "cream" }, { x: 58, y: 218, r: 22, g: "rose" },
  { x: 44, y: 196, r: 15, g: "gold" }, { x: 66, y: 180, r: 12, g: "blue", b: true },
  { x: 55, y: 160, r: 20, g: "roseDeep" }, { x: 78, y: 146, r: 14, g: "cream" },
  { x: 70, y: 122, r: 21, g: "rose" }, { x: 96, y: 108, r: 13, g: "gold" },
  { x: 92, y: 84, r: 18, g: "blue" }, { x: 122, y: 74, r: 22, g: "roseDeep" },
  { x: 118, y: 50, r: 14, g: "cream", b: true }, { x: 152, y: 46, r: 20, g: "rose" },
  { x: 150, y: 24, r: 12, g: "gold" }, { x: 188, y: 30, r: 23, g: "roseDeep" },
  { x: 214, y: 20, r: 13, g: "blue" }, { x: 224, y: 40, r: 19, g: "cream" },
  { x: 252, y: 26, r: 15, g: "rose" }, { x: 262, y: 48, r: 22, g: "gold" },
  { x: 290, y: 40, r: 13, g: "roseDeep", b: true }, { x: 300, y: 66, r: 20, g: "blue" },
  { x: 326, y: 62, r: 15, g: "rose" }, { x: 334, y: 90, r: 22, g: "roseDeep" },
  { x: 356, y: 88, r: 12, g: "cream" }, { x: 352, y: 116, r: 19, g: "gold" },
  { x: 374, y: 118, r: 13, g: "blue", b: true }, { x: 366, y: 146, r: 21, g: "rose" },
  { x: 388, y: 152, r: 12, g: "cream" }, { x: 378, y: 180, r: 18, g: "roseDeep" },
  { x: 396, y: 190, r: 13, g: "gold" }, { x: 384, y: 218, r: 22, g: "blue" },
  { x: 402, y: 236, r: 12, g: "cream", b: true }, { x: 390, y: 258, r: 19, g: "rose" },
  { x: 406, y: 276, r: 14, g: "roseDeep" }, { x: 392, y: 300, r: 21, g: "gold" },
  { x: 408, y: 322, r: 12, g: "blue" }, { x: 394, y: 344, r: 18, g: "rose" },
  { x: 410, y: 366, r: 14, g: "cream" }, { x: 398, y: 390, r: 21, g: "roseDeep" },
  { x: 384, y: 406, r: 13, g: "gold" },
];

function BalloonArch() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -90]);

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none hidden lg:block"
      style={{ top: "-6%", right: "-8%", width: "min(44vw, 680px)", y }}
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
          {Object.entries(BALLOON_GRADS).map(([k, [a, b, c]]) => (
            <radialGradient key={k} id={`ba-${k}`} cx="34%" cy="28%" r="78%">
              <stop offset="0%" stopColor={a} />
              <stop offset="52%" stopColor={b} />
              <stop offset="100%" stopColor={c} />
            </radialGradient>
          ))}
          <filter id="ba-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <motion.path
          d="M28 420 C28 200 108 26 210 26 C312 26 392 200 392 420"
          stroke="rgba(217,98,138,0.16)"
          strokeWidth="1.4"
          strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
          transition={{ duration: 1.5, ease }}
        />

        {/* Balancement lent de toute la guirlande */}
        <motion.g
          animate={reduce ? undefined : { y: [0, -6, 0], rotate: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut", delay: 2.4 }}
          style={{ transformOrigin: "210px 26px" }}
        >
          <motion.g variants={{ shown: { transition: { staggerChildren: 0.028, delayChildren: 0.3 } } }}>
            {BALLOONS.map((b, i) => (
              <motion.g
                key={i}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  shown: {
                    scale: 1,
                    opacity: b.b ? 0.32 : 0.9,
                    transition: { type: "spring", stiffness: 300, damping: 13 },
                  },
                }}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                filter={b.b ? "url(#ba-blur)" : undefined}
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
