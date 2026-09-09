"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { HeartStraight, Sparkle, Handshake, ArrowRight } from "@phosphor-icons/react";
import { WhyUs } from "@/components/WhyUs";
import { CtaBanner } from "@/components/CtaBanner";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const VALUE_ICONS = [HeartStraight, Sparkle, Handshake];
const VALUE_TINTS = [
  { bg: "#FCEEF1", dot: "#F4A8B8", ink: "#B65572" },
  { bg: "#F3E7F0", dot: "#BF88B4", ink: "#8B5E85" },
  { bg: "#FBF0E6", dot: "#EEC79A", ink: "#B98A55" },
];

const FAN = [
  { src: "/Galerie/hero-slides/hero-slide-13.webp", alt: "Arche ronde de ballons violet et or Joyeux anniversaire dans un jardin", rot: -6, x: -15, y: 20, z: 1 },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table dressée élégante avec nappe rose vieilli et compositions de fleurs roses", rot: 0, x: 0, y: 0, z: 3 },
  { src: "/Galerie/hero-slides/hero-slide-6.webp", alt: "Sweet table dorée avec gâteau et guirlande de ballons rose et pêche", rot: 6, x: 15, y: 20, z: 1 },
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

const BALLOONS = [
  { x: 66, y: 60, r: 30, c: "#F4A8B8" },
  { x: 116, y: 46, r: 24, c: "#F0C29A" },
  { x: 40, y: 104, r: 20, c: "#A8CEE0" },
  { x: 98, y: 108, r: 23, c: "#FBD5DE" },
  { x: 150, y: 96, r: 18, c: "#C9B7E0" },
];

/* ── Éventail de photos animé (hero) ──────────────────────────── */
function PhotoFan() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full max-w-[440px] mx-auto lg:mx-auto lg:translate-x-4" style={{ perspective: 1400 }}>
      <div className="relative" style={{ aspectRatio: "1 / 1" }}>
        {FAN.map((p, i) => (
          <motion.div
            key={p.src}
            className="absolute inset-0"
            style={{ zIndex: p.z }}
            initial={reduce ? false : { opacity: 0, rotate: 0, x: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, rotate: p.rot, x: p.x, y: p.y, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.13, ease }}
          >
            <motion.div
              className="relative h-full w-full overflow-hidden"
              style={{ boxShadow: "0 40px 80px -34px rgba(120,60,80,0.45)", border: "6px solid #FAF7F2" }}
              animate={reduce ? undefined : { y: [0, i === 1 ? -10 : -6, 0] }}
              transition={{ repeat: Infinity, duration: 6 + i, ease: "easeInOut" }}
            >
              <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="(max-width: 1024px) 90vw, 40vw" priority={i === 1} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Citation signature, révélée mot à mot ────────────────────── */
function SignatureQuote({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <div className="relative max-w-md">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-3 -top-8 select-none font-serif leading-none"
        style={{ fontSize: "5rem", color: "rgba(217,98,138,0.16)" }}
      >
        &ldquo;
      </span>
      <motion.p
        className="relative font-serif italic leading-snug"
        style={{ fontSize: "clamp(1.3rem, 2.1vw, 1.7rem)", color: "#B65572" }}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.6 }}
        variants={{ shown: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
      >
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ marginRight: "0.28em" }}
            variants={{
              hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
              shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
            }}
          >
            {w}
          </motion.span>
        ))}
      </motion.p>
      <motion.svg
        viewBox="0 0 300 12"
        preserveAspectRatio="none"
        className="mt-3 h-2.5 w-44"
        aria-hidden
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.path
          d="M4 7 C 60 1, 120 12, 176 6 S 264 2, 296 7"
          fill="none"
          stroke="#D9628A"
          strokeWidth="2.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 0.7, transition: { duration: 0.9, delay: 0.5, ease } },
          }}
        />
      </motion.svg>
    </div>
  );
}

/* ── Bouquet de ballons animé (motif histoire) ────────────────── */
function BalloonTuft() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 190 210"
      className="w-full"
      aria-hidden
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
    >
      <motion.g
        style={{ transformOrigin: "92px 190px" }}
        animate={reduce ? undefined : { rotate: [-2.6, 2.6, -2.6] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
      >
        {BALLOONS.map((b, i) => (
          <motion.g
            key={i}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 + i * 0.09 }}
            style={{ transformOrigin: `${b.x}px ${b.y}px` }}
          >
            <line x1={b.x} y1={b.y + b.r} x2="92" y2="190" stroke="rgba(120,90,70,0.22)" strokeWidth="0.7" />
            <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity="0.92" />
            <ellipse
              cx={b.x - b.r * 0.32}
              cy={b.y - b.r * 0.36}
              rx={b.r * 0.22}
              ry={b.r * 0.3}
              fill="rgba(255,255,255,0.55)"
              transform={`rotate(-24 ${b.x - b.r * 0.32} ${b.y - b.r * 0.36})`}
            />
          </motion.g>
        ))}
        <circle cx="92" cy="190" r="4" fill="#D9628A" />
      </motion.g>
    </motion.svg>
  );
}

/* ── Carte valeur avec tilt 3D ────────────────────────────────── */
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
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const Ico = VALUE_ICONS[i % VALUE_ICONS.length];
  const tint = VALUE_TINTS[i % VALUE_TINTS.length];

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
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: i * 0.1, ease }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduce ? undefined : { boxShadow: `0 36px 70px -28px ${tint.dot}99` }}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          boxShadow: "0 2px 10px rgba(13,11,8,0.04)",
        }}
        className="group relative flex h-full flex-col overflow-hidden p-7 lg:p-8"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(158deg, ${tint.bg} 0%, #FAF7F2 140%)`,
            border: `1px solid ${tint.dot}3d`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-6 select-none font-serif font-light leading-none transition-transform duration-500 group-hover:scale-110"
          style={{ fontSize: "6rem", color: `${tint.dot}24` }}
        >
          {String(i + 1).padStart(2, "0")}
        </span>
        <span
          className="relative z-10 mb-5 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ border: `1px solid ${tint.dot}` }}
        >
          {Ico && <Ico size={20} weight="light" color={tint.ink} />}
        </span>
        <h3 className="relative z-10 font-serif leading-tight" style={{ fontSize: "1.4rem", color: "#2A2320" }}>
          {v.label}
        </h3>
        <p className="relative z-10 mt-2.5 min-h-[64px] font-sans text-[13px] leading-relaxed" style={{ color: "rgba(40,34,30,0.58)" }}>
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
      <section className="relative overflow-hidden pt-[132px] pb-20 lg:pt-[164px] lg:pb-28" style={{ background: "#F3EDE6" }}>
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

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-10 items-center">
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
              <span className="font-serif italic text-xl leading-none">2020</span>
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

      {/* ── Notre histoire : jalons ──────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#F3EDE6" }}>
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: "1rem", right: "2%", width: 190 }}>
          <BalloonTuft />
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

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            <motion.span
              className="hidden md:block absolute left-0 right-0 origin-left pointer-events-none"
              style={{
                top: 13,
                height: 1,
                background: "repeating-linear-gradient(to right, rgba(217,98,138,0.45) 0 6px, transparent 6px 12px)",
              }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease }}
              aria-hidden
            />
            {t.about.milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.35 + i * 0.14, ease }}
                className="relative md:pt-11"
              >
                <motion.span
                  className="hidden md:block absolute left-0 rounded-full"
                  style={{ top: 7, width: 14, height: 14, background: "#D9628A", boxShadow: "0 0 0 5px #F3EDE6" }}
                  initial={reduce ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 + i * 0.14 }}
                  aria-hidden
                />
                <motion.span
                  className="font-display italic block leading-none"
                  style={{ fontSize: "clamp(2.4rem, 3.4vw, 3.1rem)", color: "#B65572" }}
                  initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.14, ease }}
                >
                  {m.year}
                </motion.span>
                <h3 className="mt-3 font-serif font-light text-lg" style={{ color: "#2A2320" }}>
                  {m.label}
                </h3>
                <p className="mt-2 font-sans font-light text-[13px] leading-relaxed" style={{ color: "rgba(42,35,32,0.56)" }}>
                  {m.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Valeurs : cartes premium avec tilt ───────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="font-serif font-light leading-tight mb-12 lg:mb-14"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#2A2320" }}
          >
            {t.about.valuesTitle}
          </motion.h2>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
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
