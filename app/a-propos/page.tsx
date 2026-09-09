"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { HeartStraight, Sparkle, Handshake, ArrowRight } from "@phosphor-icons/react";
import { WhyUs } from "@/components/WhyUs";
import { CtaBanner } from "@/components/CtaBanner";
import { FloatingBalloons } from "@/components/FloatingBalloons";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const VALUE_ICONS = [HeartStraight, Sparkle, Handshake];
const VALUE_TINTS = [
  { bg: "#FCEEF1", dot: "#F4A8B8", ink: "#B65572", glow: "244,168,184" },
  { bg: "#F3E7F0", dot: "#BF88B4", ink: "#8B5E85", glow: "191,136,180" },
  { bg: "#FBF0E6", dot: "#EEC79A", ink: "#B98A55", glow: "238,199,154" },
];

// Réserve de 9 photos que l'éventail fait défiler.
const FAN_POOL = [
  { src: "/Galerie/hero-slides/hero-slide-13.webp", alt: "Arche ronde de ballons violet et or Joyeux anniversaire dans un jardin" },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table dressée élégante avec nappe rose vieilli et compositions de fleurs roses" },
  { src: "/Galerie/hero-slides/hero-slide-6.webp", alt: "Sweet table dorée avec gâteau et guirlande de ballons rose et pêche" },
  { src: "/Galerie/hero-slides/hero-slide-8.webp", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-9.webp", alt: "Arche de ballons rose et blanc avec chiffre 6 et gâteau ballerine" },
  { src: "/Galerie/hero-slides/hero-slide-5.webp", alt: "Arche menthe, pêche et rose avec chiffre 1 argenté" },
  { src: "/Galerie/hero-slides/hero-slide-15.webp", alt: "Bouquet de ballons chiffre 10 rose personnalisé avec cœur" },
  { src: "/Galerie/hero-slides/hero-slide-18.webp", alt: "Fête pyjama d'anniversaire enfant avec arche pêche et corail" },
  { src: "/Galerie/hero-slides/hero-slide-14.webp", alt: "Bouquet de ballons chiffre 15 rose gold personnalisé" },
];

const CONFETTI = Array.from({ length: 12 }).map((_, i) => {
  const s = Math.sin(i * 71.3) * 10000;
  const r = s - Math.floor(s);
  return {
    left: `${(8 + r * 84).toFixed(2)}%`,
    c: ["#F4A8B8", "#A8CEE0", "#F0C29A", "#FBD5DE", "#C9B7E0"][i % 5],
    d: (r * 5).toFixed(2),
    dur: (7 + r * 5).toFixed(2),
  };
});

/* ── Pile de 9 photos qui s'empilent une à une (hero) ─────────── */
// {r rotation, x %, y %, s scale} — index 0 = tout au fond, index 8 = photo de devant (centrée).
// Les cartes du fond débordent davantage sur les côtés → pile large et étalée.
const STACK = [
  { r: -13, x: -46, y: -6, s: 0.82 },
  { r: 12, x: 44, y: -10, s: 0.84 },
  { r: -11, x: -34, y: 4, s: 0.87 },
  { r: 10, x: 33, y: 1, s: 0.89 },
  { r: -9, x: -22, y: -8, s: 0.92 },
  { r: 8, x: 21, y: 6, s: 0.94 },
  { r: -6, x: -11, y: -2, s: 0.965 },
  { r: 6, x: 10, y: 3, s: 0.985 },
  { r: 0, x: 0, y: 0, s: 1 },
];

const snatch = [0.3, 1.3, 0.5, 1] as const; // anticipation + léger dépassement
const settle = [0.16, 1, 0.3, 1] as const;

function PhotoFan() {
  const reduce = useReducedMotion();
  const N = FAN_POOL.length;
  const topSlot = N - 1;
  const [rot, setRot] = useState(0);
  // phase 1 = soulevée + poussée sur le côté (au-dessus) ; phase 2 = contourne et se glisse au fond
  const [leaving, setLeaving] = useState<{ i: number; dir: number; phase: 1 | 2 } | null>(null);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const flick = (i: number) => {
    if (busy.current || reduce) {
      if (reduce) setRot((r) => r + 1);
      return;
    }
    busy.current = true;
    const dir = rot % 2 === 0 ? 1 : -1;
    setLeaving({ i, dir, phase: 1 });
    setRot((r) => r + 1); // la carte suivante apparaît dessous
    timers.current.push(
      window.setTimeout(() => setLeaving((l) => (l ? { ...l, phase: 2 } : l)), 260),
      window.setTimeout(() => {
        setLeaving(null);
        busy.current = false;
      }, 260 + 560),
    );
  };

  return (
    <div
      className="relative w-full max-w-[780px] mx-auto lg:mx-auto lg:translate-x-10"
      style={{ perspective: 1300 }}
    >
      <div className="relative" style={{ aspectRatio: "5 / 4" }}>
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: [-1.4, 1.4, -1.4] }}
          transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 92%" }}
        >
          {FAN_POOL.map((p, i) => {
            const slot = (i + rot) % N;
            const s = STACK[slot];
            const isTop = slot === topSlot;
            const isLeaving = leaving?.i === i;
            const from = STACK[topSlot]; // position d'origine (dessus) de la carte qui part
            const dealDelay = rot === 0 ? i * 0.1 : 0;

            // z : au-dessus de tout pendant qu'on la soulève, puis derrière la pile
            const zIndex = isLeaving ? (leaving!.phase === 1 ? 90 : -1) : slot;

            let target: Record<string, number | string>;
            let trans: object;
            let shadow: string;

            if (isLeaving && leaving) {
              const d = leaving.dir;
              if (leaving.phase === 1) {
                target = { x: `${from.x + d * 55}%`, y: `${from.y - 16}%`, rotate: from.r + d * 13, rotateY: d * -18, scale: 1.08 };
                trans = { duration: 0.28, ease: snatch };
                shadow = "0 46px 90px -30px rgba(120,60,80,0.6)";
              } else {
                target = { x: `${s.x}%`, y: `${s.y + 3}%`, rotate: s.r, rotateY: 0, scale: s.s };
                trans = {
                  x: { duration: 0.58, ease: settle },
                  y: { duration: 0.58, ease: [0.5, 0, 0.3, 1] },
                  rotate: { duration: 0.58, ease: settle },
                  rotateY: { duration: 0.4, ease: settle },
                  scale: { type: "spring", stiffness: 260, damping: 20, delay: 0.28 },
                };
                shadow = "0 26px 54px -26px rgba(120,60,80,0.5)";
              }
            } else {
              target = { x: `${s.x}%`, y: `${s.y}%`, rotate: s.r, rotateY: 0, scale: s.s, opacity: 1 };
              trans = {
                opacity: { duration: 0.5, delay: dealDelay, ease },
                x: { type: "spring", stiffness: 200, damping: 22, delay: dealDelay },
                y: { type: "spring", stiffness: 200, damping: 22, delay: dealDelay },
                rotate: { type: "spring", stiffness: 200, damping: 20, delay: dealDelay },
                scale: { duration: 0.5, delay: dealDelay, ease },
              };
              shadow = "0 26px 54px -26px rgba(120,60,80,0.5)";
            }

            return (
              <div
                key={p.src}
                className="absolute left-1/2 top-[3%] w-[54%] -translate-x-1/2"
                style={{ zIndex, aspectRatio: "4 / 5" }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d",
                    cursor: isTop && !leaving ? "pointer" : "default",
                    pointerEvents: isTop ? "auto" : "none",
                    outline: "none",
                  }}
                  initial={reduce ? false : { x: `${s.x}%`, y: "125%", rotate: 0, opacity: 0, scale: s.s * 0.94 }}
                  animate={target}
                  transition={trans}
                  onClick={isTop ? () => flick(i) : undefined}
                  onKeyDown={
                    isTop
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            flick(i);
                          }
                        }
                      : undefined
                  }
                  role={isTop ? "button" : undefined}
                  tabIndex={isTop ? 0 : undefined}
                  aria-label={isTop ? "Photo suivante" : undefined}
                >
                  <motion.div
                    className="relative h-full w-full overflow-hidden"
                    style={{ border: "5px solid #FAF7F2" }}
                    animate={{ boxShadow: shadow }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 55vw, 26vw"
                      priority={i === topSlot}
                    />
                    {/* voile qui s'assombrit quand la carte passe derrière */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "#2A2320" }}
                      animate={{ opacity: isLeaving && leaving?.phase === 2 ? 0.18 : 0 }}
                      transition={{ duration: 0.4, ease }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Citation signature, révélée mot à mot ────────────────────── */
function SignatureQuote({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const parts = text.split(/(?<=\.)\s+/); // 2 phrases si possible
  const lead = parts.length > 1 ? parts[0] : "";
  const punch = parts.length > 1 ? parts.slice(1).join(" ") : text;
  const leadWords = lead ? lead.split(" ") : [];
  const punchWords = punch.split(" ");

  const wordV = {
    hidden: { opacity: 0, y: 14, filter: "blur(7px)" },
    shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
  };

  return (
    <motion.div
      className="relative max-w-lg"
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.5 }}
      variants={{ shown: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } } }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-9 select-none font-serif leading-none"
        style={{ fontSize: "5.5rem", color: "rgba(217,98,138,0.14)" }}
      >
        &ldquo;
      </span>

      {lead && (
        <p className="relative flex flex-wrap gap-x-[0.28em] gap-y-1 font-serif italic leading-snug"
           style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)", color: "rgba(182,85,114,0.75)" }}>
          {leadWords.map((w, i) => (
            <motion.span key={i} className="inline-block" variants={wordV}>{w}</motion.span>
          ))}
        </p>
      )}

      <p className={`relative flex flex-wrap gap-x-[0.3em] gap-y-1 font-serif italic leading-tight ${lead ? "mt-2.5" : ""}`}
         style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", color: "#B65572" }}>
        {punchWords.map((w, i) => (
          <motion.span key={i} className="inline-block" variants={wordV}>{w}</motion.span>
        ))}
      </p>

      <motion.svg
        viewBox="0 0 320 14"
        preserveAspectRatio="none"
        className="mt-3.5 h-3 w-52"
        aria-hidden
        variants={{ shown: {} }}
      >
        <motion.path
          d="M3 9 C 54 2, 104 13, 158 7 S 262 1, 317 8"
          fill="none"
          stroke="#D9628A"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 0.75, transition: { duration: 0.9, delay: 0.55, ease } },
          }}
        />
        <motion.path
          d="M3 12 C 60 7, 120 15, 176 10 S 268 5, 317 11"
          fill="none"
          stroke="#F0C29A"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 0.6, transition: { duration: 0.9, delay: 0.75, ease } },
          }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ── Timeline « Mon histoire » ────────────────────────────────── */
const HISTORY_SHOTS = [
  { src: "/Galerie/hero-slides/hero-slide-5.webp", alt: "Arche menthe, pêche et rose avec chiffre 1 argenté" },
  { src: "/Galerie/hero-slides/hero-slide-8.webp", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table dressée élégante avec nappe rose vieilli et compositions de fleurs roses" },
];

function Milestone({
  m,
  shot,
  i,
}: {
  m: { year: string; label: string; text: string };
  shot: { src: string; alt: string };
  i: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const tilt = i === 1 ? 0 : i === 0 ? -3 : 3;

  return (
    <li ref={ref} className="relative flex flex-col items-center text-center">
      {/* vignette photo */}
      <motion.div
        className="relative overflow-hidden w-[300px] max-w-[92%] h-[224px]"
        style={{
          border: "7px solid #FAF7F2",
          boxShadow: "0 30px 58px -24px rgba(120,60,80,0.45)",
        }}
        initial={reduce ? false : { opacity: 0, y: 26, rotate: 0, scale: 0.94 }}
        animate={inView ? { opacity: 1, y: 0, rotate: tilt, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.05, ease }}
      >
        <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="340px" />
      </motion.div>

      {/* pastille année, posée sur la ligne */}
      <motion.div
        className="relative z-10 mt-7 flex items-center justify-center rounded-full font-display italic"
        style={{
          minWidth: 92,
          height: 48,
          padding: "0 18px",
          fontSize: "1.5rem",
          color: "#FAF7F2",
          background: "#D9628A",
          boxShadow: "0 0 0 6px #F3EDE6, 0 12px 28px -12px rgba(217,98,138,0.6)",
        }}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={inView ? { scale: [0, 1.12, 1], opacity: 1 } : {}}
        transition={{ duration: 0.55, delay: 0.18, ease }}
      >
        {m.year}
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.3, ease }}
        className="mt-5 max-w-[30ch]"
      >
        <h3 className="font-serif font-light text-xl" style={{ color: "#2A2320" }}>
          {m.label}
        </h3>
        <p className="mt-2.5 font-sans font-light text-[13.5px] leading-relaxed" style={{ color: "rgba(42,35,32,0.6)" }}>
          {m.text}
        </p>
      </motion.div>
    </li>
  );
}

function Timeline({
  milestones,
}: {
  milestones: { year: string; label: string; text: string }[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.7"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      {/* ligne horizontale reliant les pastilles (desktop) — alignée sur le centre des pastilles */}
      <div
        className="hidden md:block absolute left-[16.66%] right-[16.66%] pointer-events-none"
        style={{ top: 276, height: 2, background: "rgba(217,98,138,0.2)" }}
        aria-hidden
      >
        <motion.div
          className="h-full origin-left"
          style={{ width: "100%", background: "#D9628A", scaleX: reduce ? 1 : fill }}
        />
      </div>

      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8">
        {milestones.map((m, i) => (
          <Milestone key={m.year} m={m} shot={HISTORY_SHOTS[i % HISTORY_SHOTS.length]} i={i} />
        ))}
      </ol>
    </div>
  );
}

/* ── Carte valeur : tilt 3D, spotlight curseur, motif qui s'anime ── */
function ValueCard({
  v,
  i,
}: {
  v: { label: string; desc: string };
  i: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 16 });
  const sry = useSpring(ry, { stiffness: 180, damping: 16 });
  const spot = useMotionValue(0);
  const sSpot = useSpring(spot, { stiffness: 200, damping: 24 });
  const Ico = VALUE_ICONS[i % VALUE_ICONS.length];
  const tint = VALUE_TINTS[i % VALUE_TINTS.length];

  const glow = useTransform(
    [mx, my, sSpot],
    ([x, y, o]: number[]) =>
      `radial-gradient(240px circle at ${x}% ${y}%, rgba(${tint.glow},${(0.5 * o).toFixed(3)}), transparent 70%)`,
  );

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 11);
    rx.set(-(py - 0.5) * 11);
    mx.set(px * 100);
    my.set(py * 100);
    spot.set(1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    spot.set(0);
  };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28, rotateX: -14, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, delay: i * 0.12, ease }}
      style={{ perspective: 1100 }}
      className={i === 1 ? "md:mt-10" : ""}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduce ? undefined : { y: -6 }}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          boxShadow: "0 10px 34px -18px rgba(13,11,8,0.12)",
        }}
        className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[3px] p-8 lg:p-9"
      >
        {/* fond dégradé + bord */}
        <div
          className="absolute inset-0 -z-20"
          style={{
            background: `linear-gradient(158deg, ${tint.bg} 0%, #FAF7F2 145%)`,
            border: `1px solid ${tint.dot}3d`,
          }}
        />
        {/* spotlight curseur */}
        <motion.div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: glow }} aria-hidden />
        {/* liseré lumineux au survol */}
        <div
          className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
          style={{ border: `1px solid ${tint.dot}` }}
          aria-hidden
        />

        {/* chiffre filigrane */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-8 select-none font-serif font-light leading-none transition-all duration-500 group-hover:-translate-y-1"
          style={{ fontSize: "7rem", color: `${tint.dot}22`, transform: "translateZ(10px)" }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        {/* icône dans un anneau qui tourne lentement */}
        <div className="relative z-10 mb-6 h-14 w-14" style={{ transform: "translateZ(45px)" }}>
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `1.5px dashed ${tint.dot}` }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          />
          <motion.span
            className="absolute inset-[5px] flex items-center justify-center rounded-full"
            style={{ background: "#FAF7F2", boxShadow: `0 8px 22px -12px ${tint.dot}` }}
            animate={reduce ? undefined : { y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }}
          >
            {Ico && <Ico size={22} weight="light" color={tint.ink} />}
          </motion.span>
        </div>

        <h3
          className="relative z-10 font-serif leading-tight"
          style={{ fontSize: "clamp(1.4rem, 1.9vw, 1.7rem)", color: "#2A2320", transform: "translateZ(30px)" }}
        >
          {v.label}
        </h3>

        {/* soulignage qui se trace */}
        <motion.svg
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          className="relative z-10 mt-2 h-1.5 w-20"
          aria-hidden
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "shown"}
          viewport={{ once: true }}
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.path
            d="M2 5 C 30 1, 60 8, 90 4 S 116 3, 118 5"
            fill="none"
            stroke={tint.dot}
            strokeWidth="2.5"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              shown: { pathLength: 1, opacity: 0.85, transition: { duration: 0.8, delay: 0.3 + i * 0.12, ease } },
            }}
          />
        </motion.svg>

        <p
          className="relative z-10 mt-4 flex-1 font-sans text-[13.5px] leading-relaxed"
          style={{ color: "rgba(40,34,30,0.62)", transform: "translateZ(15px)" }}
        >
          {v.desc}
        </p>
      </motion.div>
    </motion.li>
  );
}

export default function AboutPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const editorialRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: editorialRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[120px] pb-14 lg:pt-[140px] lg:pb-16" style={{ background: "#F3EDE6" }}>
        {/* confettis */}
        {!reduce &&
          CONFETTI.map((f, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute top-0 block h-2.5 w-1.5 rounded-full"
              style={{
                left: f.left,
                background: f.c,
                opacity: 0.7,
                animation: `about-fall ${f.dur}s linear ${f.d}s infinite`,
              }}
            />
          ))}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: "-24%",
            left: "-10%",
            width: "min(46vw, 560px)",
            aspectRatio: "1",
            background: "radial-gradient(circle at 60% 60%, rgba(244,168,184,0.2), rgba(244,168,184,0) 70%)",
          }}
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-16 lg:gap-8 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px" style={{ background: "#D9628A" }} />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em]" style={{ color: "#D9628A" }}>
                {t.about.eyebrow}
              </span>
            </div>
            <h1
              className="font-serif font-light leading-[1.03] tracking-tight"
              style={{ fontSize: "clamp(2.9rem, 6vw, 5rem)", color: "#0D0B08" }}
            >
              {t.about.title}
            </h1>
            <p
              className="font-sans font-light text-[15px] leading-relaxed mt-6 max-w-lg"
              style={{ color: "rgba(13,11,8,0.55)" }}
            >
              {t.about.lead}
            </p>

            <div className="mt-10">
              <SignatureQuote text={t.whyus.quote} />
            </div>
          </motion.div>

          <PhotoFan />
        </div>
      </section>

      {/* ── Éditorial : photo parallax + texte ───────────────────── */}
      <section ref={editorialRef} className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.8fr_1fr] gap-14 lg:gap-20 items-center">
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
            className="relative order-1"
          >
            {/* photo arrière */}
            <div
              className="absolute -right-6 -top-8 hidden sm:block w-2/3 overflow-hidden"
              style={{ aspectRatio: "4 / 5", boxShadow: "0 30px 60px -34px rgba(120,60,80,0.35)" }}
            >
              <motion.div className="relative h-full w-full" style={{ y: imgY }}>
                <Image
                  src="/Galerie/hero-slides/hero-slide-17.webp"
                  alt="Pique-nique de luxe au bord de l'eau, table basse en bois et chemin de table d'eucalyptus"
                  fill
                  className="object-cover"
                  style={{ filter: "sepia(0.2) saturate(0.85)" }}
                  sizes="30vw"
                />
              </motion.div>
            </div>
            {/* photo avant */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5", boxShadow: "0 44px 100px -38px rgba(120,60,80,0.42)" }}
            >
              <Image
                src="/Galerie/hero-slides/hero-slide-11.webp"
                alt="Table dressée en extérieur, chemin de table blanc, sous-assiettes dorées et centre floral"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 38vw"
              />
              <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(250,247,242,0.5)" }} />
            </div>
            <figcaption
              className="absolute -bottom-5 right-6 left-10 px-5 py-3 font-sans text-[11px] leading-snug"
              style={{ background: "#FAF7F2", color: "rgba(42,35,32,0.6)", boxShadow: "0 14px 40px -18px rgba(120,60,80,0.35)" }}
            >
              {t.about.imageCaption}
            </figcaption>
            <span
              className="absolute -top-5 -left-5 flex flex-col items-center justify-center rounded-full"
              style={{ width: 88, height: 88, background: "#D9628A", color: "#FAF7F2" }}
            >
              <span className="font-serif italic text-xl leading-none">2018</span>
              <span className="font-sans text-[8px] uppercase tracking-[0.18em] mt-1">Depuis</span>
            </span>
          </motion.figure>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="order-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px" style={{ background: "#D9628A" }} />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
                L&rsquo;atelier
              </span>
            </div>
            <p
              className="font-serif font-light leading-snug"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", color: "#2A2320" }}
            >
              {t.about.paragraphs[0]}
            </p>
            <p
              className="mt-6 font-sans font-light text-[15px] leading-relaxed"
              style={{ color: "rgba(42,35,32,0.6)" }}
            >
              {t.about.paragraphs[1]}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mon histoire : jalons ────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#F3EDE6" }}>
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: "-1rem", right: "1%", width: "min(22vw, 300px)" }}>
          <FloatingBalloons className="w-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="max-w-xl mb-14 lg:mb-20"
          >
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#2A2320" }}
            >
              {t.about.storyTitle}
            </h2>
            <p className="mt-4 font-sans font-light text-[14.5px] leading-relaxed" style={{ color: "rgba(42,35,32,0.58)" }}>
              {t.about.story}
            </p>
          </motion.div>

          <Timeline milestones={t.about.milestones} />
        </div>
      </section>

      {/* ── Valeurs : cartes premium avec tilt ───────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            bottom: "-18%",
            right: "-10%",
            width: "min(44vw, 540px)",
            aspectRatio: "1",
            background: "radial-gradient(circle at 50% 50%, rgba(191,136,180,0.12), rgba(191,136,180,0) 70%)",
          }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="mb-14 lg:mb-16 max-w-xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-px" style={{ background: "#D9628A" }} />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
                Ce qui me guide
              </span>
            </div>
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#2A2320" }}
            >
              {t.about.valuesTitle}
            </h2>
          </motion.div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
            {t.about.values.map((v, i) => (
              <ValueCard key={v.label} v={v} i={i} />
            ))}
          </ul>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-12 lg:mt-14"
          >
            <Link
              href="/contact"
              className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#FAF7F2" }}
            >
              {t.about.cta}
              <ArrowRight size={14} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </section>

      <WhyUs />
      <CtaBanner />
    </>
  );
}
