"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import {
  motion,
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
    const N = 58;
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
      // alterne intérieur / extérieur de l'arc, serré contre le tracé
      const side = i % 2 === 0 ? 1 : -1;
      const off = side * (2 + noise(i) * 9);
      const jitter = (noise(i + 99) - 0.5) * 3;
      const r = 8 + noise(i + 7) * 14;
      arr.push({
        x: p.x + nx * off + jitter,
        y: p.y + ny * off,
        r,
        g: GRAD_KEYS[i % GRAD_KEYS.length],
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
                    opacity: 0.92,
                    transition: { type: "spring", stiffness: 300, damping: 13 },
                  },
                }}
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
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

/* ── Titre qui « flippe » lettre par lettre au survol de la carte (.group) ── */
function FlipText({ text }: { text: string }) {
  const words = text.split(" ");
  let idx = 0;
  return (
    <span aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block align-bottom">
          {Array.from(word).map((ch) => {
            const d = idx++ * 16;
            return (
              <span
                key={d}
                aria-hidden
                className="relative inline-block overflow-hidden align-bottom"
                style={{ height: "1.05em" }}
              >
                <span
                  className="flex flex-col transition-transform duration-[460ms] group-hover:-translate-y-1/2"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)", transitionDelay: `${d}ms` }}
                >
                  <span className="block" style={{ lineHeight: "1.05em" }}>{ch}</span>
                  <span className="block" style={{ lineHeight: "1.05em", color: "#B65572" }}>{ch}</span>
                </span>
              </span>
            );
          })}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

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
              className="font-serif font-light"
              style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "#2A2320" }}
            >
              <FlipText text={card.name} />
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
    </section>
  );
}
