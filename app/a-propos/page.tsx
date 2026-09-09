"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { HeartStraight, Sparkle, Handshake, ArrowRight } from "@phosphor-icons/react";
import { PageHero } from "@/components/PageHero";
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

const BALLOONS = [
  { x: 60, y: 66, r: 26, c: "#F4A8B8" },
  { x: 104, y: 52, r: 22, c: "#F0C29A" },
  { x: 40, y: 108, r: 18, c: "#A8CEE0" },
  { x: 92, y: 104, r: 20, c: "#FBD5DE" },
];

function BalloonTuft() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 150 190"
      className="w-full"
      aria-hidden
      initial={reduce ? undefined : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
    >
      <motion.g
        style={{ transformOrigin: "72px 174px" }}
        animate={reduce ? undefined : { rotate: [-2.4, 2.4, -2.4] }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
      >
        {BALLOONS.map((b, i) => (
          <g key={i}>
            <line x1={b.x} y1={b.y + b.r} x2="72" y2="174" stroke="rgba(120,90,70,0.22)" strokeWidth="0.7" />
            <circle cx={b.x} cy={b.y} r={b.r} fill={b.c} opacity="0.9" />
            <ellipse
              cx={b.x - b.r * 0.32}
              cy={b.y - b.r * 0.36}
              rx={b.r * 0.22}
              ry={b.r * 0.3}
              fill="rgba(255,255,255,0.5)"
              transform={`rotate(-24 ${b.x - b.r * 0.32} ${b.y - b.r * 0.36})`}
            />
          </g>
        ))}
        <circle cx="72" cy="174" r="4" fill="#D9628A" />
      </motion.g>
    </motion.svg>
  );
}

export default function AboutPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} subtitle={t.about.lead} />

      {/* ── Éditorial : texte + photo ─────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-14 lg:gap-20 items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px" style={{ background: "#D9628A" }} />
              <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
                {t.about.storyTitle}
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

          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
            className="relative"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "4 / 5", boxShadow: "0 40px 90px -38px rgba(120,60,80,0.4)" }}
            >
              <Image
                src="/Galerie/hero-slides/hero-slide-16.webp"
                alt="Table dressée élégante avec nappe rose vieilli et compositions de fleurs roses"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
              <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(250,247,242,0.5)" }} />
            </div>
            <figcaption
              className="absolute -bottom-5 left-5 right-8 px-5 py-3 font-sans text-[11px] leading-snug"
              style={{ background: "#FAF7F2", color: "rgba(42,35,32,0.6)", boxShadow: "0 14px 40px -18px rgba(120,60,80,0.35)" }}
            >
              {t.about.imageCaption}
            </figcaption>
            <span
              className="absolute -top-4 -left-4 flex flex-col items-center justify-center rounded-full"
              style={{ width: 84, height: 84, background: "#D9628A", color: "#FAF7F2" }}
            >
              <span className="font-serif italic text-xl leading-none">2020</span>
              <span className="font-sans text-[8px] uppercase tracking-[0.18em] mt-1">Depuis</span>
            </span>
          </motion.figure>
        </div>
      </section>

      {/* ── Notre histoire : jalons ───────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "#F3EDE6" }}>
        <div className="absolute hidden lg:block pointer-events-none" style={{ top: "1.5rem", right: "3%", width: 150 }}>
          <BalloonTuft />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="max-w-xl mb-14 lg:mb-16"
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

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {/* fil de liaison */}
            <span
              className="hidden md:block absolute left-0 right-0 pointer-events-none"
              style={{
                top: 12,
                height: 1,
                background: "repeating-linear-gradient(to right, rgba(217,98,138,0.4) 0 6px, transparent 6px 12px)",
              }}
              aria-hidden
            />
            {t.about.milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease }}
                className="relative md:pt-9"
              >
                <span
                  className="hidden md:block absolute left-0 rounded-full"
                  style={{ top: 6, width: 13, height: 13, background: "#D9628A", boxShadow: "0 0 0 5px #F3EDE6" }}
                  aria-hidden
                />
                <span className="font-display italic block leading-none" style={{ fontSize: "2.6rem", color: "#B65572" }}>
                  {m.year}
                </span>
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

      {/* ── Valeurs : cartes premium ──────────────────────────────── */}
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
            {t.about.values.map((v, i) => {
              const Ico = VALUE_ICONS[i % VALUE_ICONS.length];
              const tint = VALUE_TINTS[i % VALUE_TINTS.length];
              return (
                <motion.li
                  key={v.label}
                  initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease }}
                >
                  <motion.div
                    whileHover={reduce ? undefined : { y: -6, boxShadow: `0 34px 66px -30px ${tint.dot}99` }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="group relative flex h-full flex-col overflow-hidden p-7 lg:p-8"
                    style={{
                      background: `linear-gradient(158deg, ${tint.bg} 0%, #FAF7F2 140%)`,
                      border: `1px solid ${tint.dot}3d`,
                      minHeight: 220,
                      boxShadow: "0 2px 10px rgba(13,11,8,0.04)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-3 -top-6 select-none font-serif font-light leading-none"
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
                    <p
                      className="relative z-10 mt-2.5 font-sans text-[13px] leading-relaxed"
                      style={{ color: "rgba(40,34,30,0.58)" }}
                    >
                      {v.desc}
                    </p>
                  </motion.div>
                </motion.li>
              );
            })}
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
