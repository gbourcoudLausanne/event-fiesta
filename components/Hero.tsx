"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { ParticleCanvas } from "./ParticleCanvas";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const FLOATING_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80",
    alt: "Ballons colorés pour événement",
    pos: { top: "8%", left: "2%" },
    width: 220, height: 280,
    depth: 0.03,
    rotate: -6,
    delay: 0.4,
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80",
    alt: "Décoration florale élégante",
    pos: { top: "12%", right: "2%" },
    width: 200, height: 260,
    depth: 0.045,
    rotate: 5,
    delay: 0.55,
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80",
    alt: "Table décorée pour réception",
    pos: { bottom: "14%", left: "3%" },
    width: 240, height: 180,
    depth: 0.025,
    rotate: 4,
    delay: 0.65,
  },
  {
    src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=500&q=80",
    alt: "Décoration de fête",
    pos: { bottom: "18%", right: "2%" },
    width: 210, height: 240,
    depth: 0.04,
    rotate: -4,
    delay: 0.75,
  },
];

function FloatingImg({
  src, alt, pos, width, height, depth, rotate, delay, mouseX, mouseY,
}: typeof FLOATING_IMAGES[number] & { mouseX: ReturnType<typeof useMotionValue<number>>; mouseY: ReturnType<typeof useMotionValue<number>> }) {
  const x = useTransform(mouseX, [-600, 600], [-depth * 600, depth * 600]);
  const y = useTransform(mouseY, [-400, 400], [-depth * 400, depth * 400]);
  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ ...pos, width, height, x, y, rotate }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay, ease }}
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.55)" }}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="240px" />
        <div className="absolute inset-0" style={{ background: "rgba(13,11,8,0.28)" }} />
        <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid rgba(176,139,58,0.2)" }} />
      </motion.div>
    </motion.div>
  );
}

function useTypewriter(text: string, speed = 55, startDelay = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setDisplayed(text); setDone(true); return; }
    let timeout: ReturnType<typeof setTimeout>;
    let index = 0;
    timeout = setTimeout(() => {
      const iv = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, reduce]);

  return { displayed, done };
}

function WordReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.28em" }}>
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

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { displayed, done } = useTypewriter(t.hero.subtext, 48, 1400);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: "#0D0B08" }}
    >
      {/* Canvas particles */}
      <ParticleCanvas />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(176,139,58,0.07) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Floating parallax images */}
      {!reduce && FLOATING_IMAGES.map((img, i) => (
        <FloatingImg key={i} {...img} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Main centered content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-20 pb-28">

        {/* Eyebrow */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="font-sans text-[11px] tracking-[0.28em] uppercase mb-8"
          style={{ color: "#B08B3A" }}
        >
          {t.hero.eyebrow}
        </motion.p>

        {/* Headline */}
        <h1 className="font-serif font-light leading-[1.05] tracking-tight mb-6"
          style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)", color: "#FAF7F2" }}>
          <WordReveal text={t.hero.headline1} delay={0.5} />
          <br />
          <span style={{ color: "#C9A84C" }}>
            <WordReveal text={t.hero.headline2} delay={0.85} className="italic" />
          </span>
        </h1>

        {/* Typewriter subtitle */}
        <div className="mb-10 min-h-[2rem]">
          <p
            className={`font-sans font-light text-base md:text-lg leading-relaxed max-w-lg mx-auto ${!done ? "typewriter-cursor" : ""}`}
            style={{ color: "rgba(250,247,242,0.55)" }}
          >
            {displayed}
          </p>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.9, ease }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            className="font-sans text-sm font-medium px-8 py-3.5 rounded-full border transition-all duration-300 cursor-pointer active:scale-[0.97] whitespace-nowrap"
            style={{
              borderColor: "rgba(250,247,242,0.3)",
              color: "#FAF7F2",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#B08B3A";
              (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(250,247,242,0.3)";
              (e.currentTarget as HTMLButtonElement).style.color = "#FAF7F2";
            }}
          >
            {t.hero.cta1}
          </button>

          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-gold-shimmer font-sans text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer active:scale-[0.97] whitespace-nowrap transition-all duration-300"
            style={{ background: "#B08B3A", color: "#0D0B08" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#B08B3A";
            }}
          >
            {t.hero.cta2}
          </button>
        </motion.div>

        {/* Rotating badge */}
        {!reduce && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 hidden md:block"
            aria-hidden
          >
            <motion.svg
              viewBox="0 0 120 120"
              className="w-[100px] h-[100px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id="badge-circ"
                  d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0"
                />
              </defs>
              <circle cx="60" cy="60" r="5" fill="#B08B3A" opacity="0.9" />
              <text fontSize="10" fontFamily="Montserrat, sans-serif" letterSpacing="2.6" fill="#B08B3A">
                <textPath href="#badge-circ">
                  Lausanne · Suisse Romande · Since 2020 ·
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(176,139,58,0.6)" }}>
            Défiler
          </span>
          <div className="w-px h-12 overflow-hidden relative" style={{ background: "rgba(176,139,58,0.15)" }}>
            <div className="w-full scroll-indicator-line" style={{ background: "#B08B3A", height: "100%" }} />
          </div>
        </motion.div>
      )}

      {/* Bottom gradient to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0D0B08 80%)" }}
        aria-hidden
      />
    </section>
  );
}
