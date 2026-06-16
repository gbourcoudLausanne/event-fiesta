"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { ParticleCanvas } from "./ParticleCanvas";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

// Animated word reveal with blur
function WordReveal({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}
        >
          <motion.span
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: delay + i * 0.14, ease }}
            style={{ display: "inline-block" }}
            aria-hidden
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Single decoration photo card with hover and parallax
function PhotoCard({
  src,
  alt,
  category,
  delay,
  className,
  mouseX,
  mouseY,
  depth = 0.02,
  rotate = 0,
}: {
  src: string;
  alt: string;
  category: string;
  delay: number;
  className?: string;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  depth?: number;
  rotate?: number;
}) {
  const x = useTransform(mouseX, [-700, 700], [-depth * 700, depth * 700]);
  const y = useTransform(mouseY, [-500, 500], [-depth * 500, depth * 500]);

  return (
    <motion.div
      style={{ x, y, rotate }}
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay, ease }}
    >
      <div
        className="relative w-full h-full overflow-hidden group"
        style={{
          borderRadius: 20,
          border: "1px solid rgba(176,139,58,0.22)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 1024px) 0px, 30vw"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,6,5,0.82) 0%, rgba(8,6,5,0.18) 45%, transparent 70%)",
          }}
          aria-hidden
        />
        {/* Category label */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <span
            className="font-sans text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "#C9A84C" }}
          >
            {category}
          </span>
          {/* Gold corner accent */}
          <div
            className="w-5 h-5 shrink-0"
            style={{
              borderRight: "1px solid rgba(176,139,58,0.5)",
              borderBottom: "1px solid rgba(176,139,58,0.5)",
            }}
            aria-hidden
          />
        </div>
        {/* Hover border glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            borderRadius: 20,
            border: "1px solid rgba(176,139,58,0.55)",
          }}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, mouseX, mouseY]);

  // headline2 = "notre oeuvre." → last word = gold italic, rest = cream
  const h2Words = t.hero.headline2.split(" ");
  const goldWord = h2Words.pop() ?? "";
  const restH2 = h2Words.join(" ");

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "#080605" }}
    >
      {/* Canvas particles — subtle ambient */}
      <ParticleCanvas />

      {/* Deep radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 32% 52%, rgba(176,139,58,0.055) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[48%_52%] min-h-[100dvh]">

        {/* ── LEFT : text ── */}
        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-14 xl:px-20 pt-28 pb-20 lg:pt-36">

          {/* Eyebrow */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-8 h-px shrink-0" style={{ background: "#B08B3A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "#B08B3A" }}
            >
              {t.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-serif font-light leading-[1.06] tracking-tight mb-7"
            style={{ fontSize: "clamp(3rem, 6vw, 5.8rem)", color: "#FAF7F2" }}
          >
            <WordReveal text={t.hero.headline1} delay={0.4} />
            <br />
            {restH2 && (
              <WordReveal text={restH2} delay={0.65} />
            )}
            {restH2 && " "}
            <span style={{ color: "#C9A84C" }}>
              <WordReveal
                text={goldWord}
                delay={restH2 ? 0.88 : 0.65}
                className="font-serif italic"
              />
            </span>
          </h1>

          {/* Description */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
            className="font-sans font-light text-base leading-relaxed mb-10 max-w-sm"
            style={{ color: "rgba(250,247,242,0.48)" }}
          >
            {t.hero.subtext}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.25, ease }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <button
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-sans text-sm font-medium px-8 py-3.5 rounded-full border cursor-pointer transition-all duration-300 active:scale-[0.97] whitespace-nowrap"
              style={{
                borderColor: "rgba(250,247,242,0.25)",
                color: "#FAF7F2",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#B08B3A";
                (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(250,247,242,0.25)";
                (e.currentTarget as HTMLButtonElement).style.color = "#FAF7F2";
              }}
            >
              {t.hero.cta1}
            </button>

            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-gold-shimmer font-sans text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer active:scale-[0.97] whitespace-nowrap transition-all duration-300"
              style={{ background: "#B08B3A", color: "#080605" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#C9A84C")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#B08B3A")
              }
            >
              {t.hero.cta2}
            </button>
          </motion.div>

          {/* Feature row */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.45, ease }}
            className="flex flex-wrap gap-8"
          >
            {t.hero.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: "#B08B3A" }}
                  aria-hidden
                />
                <span
                  className="font-sans text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "rgba(250,247,242,0.36)" }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Rotating badge */}
          {!reduce && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.4 }}
              className="absolute bottom-16 right-0 hidden xl:block"
              aria-hidden
            >
              <motion.svg
                viewBox="0 0 120 120"
                className="w-[90px] h-[90px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <path
                    id="badge-ring"
                    d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
                  />
                </defs>
                <circle cx="60" cy="60" r="4.5" fill="#B08B3A" opacity="0.9" />
                <text
                  fontSize="9.5"
                  fontFamily="Montserrat, sans-serif"
                  letterSpacing="2.5"
                  fill="#B08B3A"
                >
                  <textPath href="#badge-ring">
                    Lausanne · Suisse Romande · Since 2020 ·
                  </textPath>
                </text>
              </motion.svg>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT : photo collage ── */}
        <div className="relative hidden lg:block">

          {/* Subtle left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #080605 0%, transparent 100%)",
            }}
            aria-hidden
          />

          {/* Photo grid — asymmetric 3-photo layout */}
          <div className="absolute inset-6 xl:inset-8 grid gap-3.5 xl:gap-4"
            style={{
              gridTemplateColumns: "1.15fr 0.85fr",
              gridTemplateRows: "1fr 1fr",
            }}
          >
            {/* Photo 1 — big left, spans 2 rows */}
            <PhotoCard
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85"
              alt="Décoration florale romantique"
              category="Baptême & célébration"
              delay={0.5}
              depth={0.018}
              rotate={-1.5}
              className="row-span-2 relative"
              mouseX={mouseX}
              mouseY={mouseY}
            />

            {/* Photo 2 — top right */}
            <PhotoCard
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=85"
              alt="Ballons colorés pour anniversaire"
              category="Anniversaire"
              delay={0.7}
              depth={0.025}
              rotate={1.2}
              className="relative"
              mouseX={mouseX}
              mouseY={mouseY}
            />

            {/* Photo 3 — bottom right */}
            <PhotoCard
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=85"
              alt="Table décorée pour réception dorée"
              category="Corporate & gala"
              delay={0.88}
              depth={0.015}
              rotate={-0.8}
              className="relative"
              mouseX={mouseX}
              mouseY={mouseY}
            />
          </div>

          {/* Floating event count badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease }}
            className="absolute bottom-10 left-14 z-20 glass-card rounded-2xl px-5 py-3.5 flex gap-4 items-center"
          >
            <div className="flex flex-col">
              <span
                className="font-serif font-light text-2xl leading-none"
                style={{ color: "#C9A84C" }}
              >
                200+
              </span>
              <span
                className="font-sans text-[10px] uppercase tracking-[0.18em] mt-0.5"
                style={{ color: "rgba(250,247,242,0.4)" }}
              >
                événements
              </span>
            </div>
            <div
              className="w-px h-8 shrink-0"
              style={{ background: "rgba(176,139,58,0.2)" }}
              aria-hidden
            />
            <div className="flex flex-col">
              <span
                className="font-serif font-light text-2xl leading-none"
                style={{ color: "#C9A84C" }}
              >
                5★
              </span>
              <span
                className="font-sans text-[10px] uppercase tracking-[0.18em] mt-0.5"
                style={{ color: "rgba(250,247,242,0.4)" }}
              >
                satisfaction
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="absolute bottom-8 left-8 lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span
            className="font-sans text-[9px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(176,139,58,0.55)" }}
          >
            Défiler
          </span>
          <div
            className="w-px h-12 overflow-hidden relative"
            style={{ background: "rgba(176,139,58,0.15)" }}
          >
            <div
              className="w-full scroll-indicator-line"
              style={{ background: "#B08B3A", height: "100%" }}
            />
          </div>
        </motion.div>
      )}

      {/* Bottom bleed gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #080605 85%)" }}
        aria-hidden
      />
    </section>
  );
}
