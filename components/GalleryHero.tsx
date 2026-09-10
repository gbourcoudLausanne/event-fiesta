"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease } },
};
const media: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease } },
};

const WASH = "/Galerie/hero-slides/hero-slide-13.webp";
const PRIMARY = "/Galerie/hero-slides/hero-slide-8.webp";
const SECONDARY = "/Galerie/hero-slides/hero-slide-2.webp";

// Paillettes — positions déterministes (%), taille, couleur, délai
const SPARKLES = [
  { x: 6, y: 30, s: 8, c: "#E8C870", d: 0 },
  { x: 15, y: 72, s: 5, c: "rgba(255,255,255,0.95)", d: 1.6 },
  { x: 26, y: 18, s: 10, c: "#F0D9A0", d: 2.9 },
  { x: 33, y: 88, s: 6, c: "#F4A8B8", d: 0.8 },
  { x: 44, y: 40, s: 5, c: "#E8C870", d: 3.6 },
  { x: 52, y: 76, s: 9, c: "rgba(255,255,255,0.9)", d: 1.1 },
  { x: 58, y: 14, s: 7, c: "#F0D9A0", d: 4.2 },
  { x: 64, y: 55, s: 11, c: "#E8C870", d: 2.2 },
  { x: 70, y: 84, s: 6, c: "#F4A8B8", d: 3.1 },
  { x: 76, y: 26, s: 9, c: "rgba(255,255,255,0.95)", d: 0.5 },
  { x: 82, y: 62, s: 7, c: "#F0D9A0", d: 4.8 },
  { x: 88, y: 12, s: 6, c: "#E8C870", d: 1.9 },
  { x: 91, y: 46, s: 10, c: "#F4C99A", d: 3.4 },
  { x: 95, y: 78, s: 5, c: "rgba(255,255,255,0.9)", d: 2.6 },
  { x: 48, y: 8, s: 6, c: "#E8C870", d: 5.1 },
  { x: 20, y: 48, s: 7, c: "#F0D9A0", d: 4.0 },
];

function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      {SPARKLES.map((sp, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={sp.s}
          height={sp.s}
          className="absolute"
          style={{ left: `${sp.x}%`, top: `${sp.y}%` }}
          animate={{ opacity: [0, 0.95, 0], scale: [0.3, 1, 0.3], rotate: [0, 60] }}
          transition={{ repeat: Infinity, duration: 3.4 + (i % 4) * 0.6, delay: sp.d, ease: "easeInOut" }}
        >
          <path
            d="M12 0 L13.6 8.4 L24 12 L13.6 15.6 L12 24 L10.4 15.6 L0 12 L10.4 8.4 Z"
            fill={sp.c}
          />
        </motion.svg>
      ))}
    </div>
  );
}

export function GalleryHero({ worlds, pieces }: { worlds: number; pieces: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      className="relative isolate w-full overflow-hidden pt-[68px]"
      style={{
        background: "linear-gradient(158deg, #F4E5E0 0%, #EBD4CF 55%, #E1C4C3 120%)",
      }}
    >
      {!reduce && <Sparkles />}

      {/* Wash flou en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.5]"
        style={{
          maskImage: "radial-gradient(78% 92% at 72% 12%, #000 28%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(78% 92% at 72% 12%, #000 28%, transparent 72%)",
        }}
      >
        <Image
          src={WASH}
          alt=""
          fill
          priority
          className="object-cover"
          style={{ filter: "blur(30px) saturate(1.1)", transform: "scale(1.12)" }}
          sizes="100vw"
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-24"
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
      >
        {/* Texte */}
        <div className="flex flex-col items-start">
          <motion.div variants={reduce ? undefined : item} className="mb-5 flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "#B65572" }}
            >
              {t.realisations.heroEyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={reduce ? undefined : item}
            className="font-serif font-light leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5.6vw, 4.6rem)", color: "#2A2320" }}
          >
            {t.realisations.heroTitle}
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : item}
            className="mt-6 max-w-md font-sans font-light text-[14.5px] leading-relaxed"
            style={{ color: "rgba(42,35,32,0.6)" }}
          >
            {t.realisations.heroText}
          </motion.p>

          <motion.div
            variants={reduce ? undefined : item}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <Link
              href="/contact"
              className="btn-gold-shimmer inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#FAF7F2" }}
            >
              {t.realisations.heroCta}
              <ArrowRight size={14} weight="bold" />
            </Link>
            <span
              className="font-sans text-[11px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(42,35,32,0.42)" }}
            >
              {worlds} univers · {pieces} décors
            </span>
          </motion.div>
        </div>

        {/* Collage */}
        <motion.div variants={reduce ? undefined : media} className="relative">
          <div className="relative ml-auto w-[80%] sm:w-[64%] lg:w-[74%]">
            <div
              className="relative overflow-hidden rounded-[16px]"
              style={{
                aspectRatio: "4 / 5",
                boxShadow: "0 54px 110px -52px rgba(120,60,80,0.5)",
                border: "1px solid rgba(42,35,32,0.06)",
              }}
            >
              <Image src={PRIMARY} alt="" fill priority className="object-cover" sizes="45vw" />
            </div>

            <div
              className="absolute -bottom-8 -left-6 hidden w-[46%] overflow-hidden rounded-[14px] sm:block"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 40px 80px -44px rgba(120,60,80,0.5)",
                border: "4px solid #FAF7F2",
                transform: "rotate(-4deg)",
              }}
            >
              <Image src={SECONDARY} alt="" fill className="object-cover" sizes="24vw" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
