"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

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
          style={{ display: "inline-block", overflow: "hidden", marginRight: "0.26em" }}
        >
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + i * 0.11, ease }}
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

function StatBadge({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease }}
      className="flex flex-col items-center gap-0.5 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(176,139,58,0.18)",
        boxShadow: "0 8px 32px rgba(45,42,38,0.11)",
      }}
    >
      <span className="font-serif font-light text-xl" style={{ color: "#B08B3A" }}>
        {value}
      </span>
      <span
        className="font-sans text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "rgba(45,42,38,0.48)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

const FEATURE_ICONS = ["✦", "⬡", "♡"];

export function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  // Split headline2: last word stays dark, rest is gold italic
  // e.g. "plus beaux moments" → goldPart="plus beaux", lastWord="moments"
  const h2Words = t.hero.headline2.split(" ");
  const lastH2Word = h2Words.pop() ?? "";
  const goldH2 = h2Words.join(" ");

  return (
    <section
      id="hero"
      className="min-h-[100dvh] flex flex-col relative"
      style={{ background: "#FEFDF8" }}
    >
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh]">

        {/* ── LEFT : text ── */}
        <div className="flex flex-col justify-center px-8 lg:px-14 xl:px-20 pt-28 pb-16 lg:pt-36 lg:pb-24 relative">

          {/* Top gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease }}
            className="absolute top-0 left-0 w-3/4 h-px origin-left"
            style={{
              background:
                "linear-gradient(90deg, #B08B3A 0%, rgba(201,168,76,0.35) 65%, transparent)",
            }}
            aria-hidden
          />

          {/* Eyebrow */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px shrink-0" style={{ background: "#B08B3A" }} />
            <span
              className="font-sans text-[11px] uppercase tracking-[0.25em]"
              style={{ color: "#B08B3A" }}
            >
              {t.hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-serif font-light leading-[1.08] mb-7"
            style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", color: "#1A1714" }}
          >
            <WordReveal text={t.hero.headline1} delay={0.42} />
            <br />
            {goldH2 && (
              <span style={{ color: "#B08B3A" }}>
                <WordReveal text={goldH2} delay={0.62} className="font-serif italic" />
              </span>
            )}
            {goldH2 && " "}
            <WordReveal text={lastH2Word} delay={goldH2 ? 0.83 : 0.62} />
          </h1>

          {/* Description */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease }}
            className="font-sans text-base leading-relaxed mb-10 max-w-sm"
            style={{ color: "rgba(45,42,38,0.5)" }}
          >
            {t.hero.subtext}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <button
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-gold-shimmer font-sans text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300 active:scale-[0.97] whitespace-nowrap"
              style={{ background: "#B08B3A", color: "#fff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#C9A84C")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "#B08B3A")
              }
            >
              {t.hero.cta1}
            </button>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-sans text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer transition-all duration-300 active:scale-[0.97] whitespace-nowrap"
              style={{
                border: "1.5px solid rgba(176,139,58,0.45)",
                color: "#B08B3A",
                background: "transparent",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(176,139,58,0.07)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
              }
            >
              {t.hero.cta2}
            </button>
          </motion.div>

          {/* Feature icons */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.38, ease }}
            className="flex flex-wrap gap-8"
          >
            {t.hero.features.map((f, i) => (
              <div key={i} className="flex flex-col items-start gap-1.5">
                <span className="font-serif text-base" style={{ color: "#B08B3A" }}>
                  {FEATURE_ICONS[i]}
                </span>
                <span
                  className="font-sans text-[11px] uppercase tracking-[0.11em] leading-snug"
                  style={{ color: "rgba(45,42,38,0.38)" }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT : photo ── */}
        <div className="relative hidden lg:block overflow-hidden">
          <motion.div
            initial={{ scale: 1.07, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.05, ease }}
            className="absolute inset-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1400&q=85"
              alt="Décoration d'événement élégante par Event Fiesta"
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />
            {/* Left-edge fade to white */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, #FEFDF8 0%, rgba(254,253,248,0.55) 18%, transparent 42%)",
              }}
              aria-hidden
            />
            {/* Bottom vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(254,253,248,0.4) 0%, transparent 28%)",
              }}
              aria-hidden
            />
          </motion.div>

          {/* Floating stat badges */}
          <div className="absolute bottom-12 left-10 flex gap-3 z-10">
            <StatBadge value="200+" label="événements" delay={1.25} />
            <StatBadge value="5★" label="satisfaction" delay={1.4} />
          </div>

          {/* Decorative concentric gold circles */}
          {[84, 50].map((size, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.85 + i * 0.15, ease }}
              className="absolute pointer-events-none rounded-full"
              style={{
                width: size,
                height: size,
                top: 48 - i * 14,
                right: 44 - i * 14,
                border: `1px solid rgba(176,139,58,${0.22 - i * 0.06})`,
              }}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.65 }}
          className="absolute bottom-8 left-8 lg:left-16 flex flex-col items-center gap-2"
          aria-hidden
        >
          <span
            className="font-sans text-[9px] uppercase tracking-[0.24em]"
            style={{ color: "rgba(45,42,38,0.26)" }}
          >
            Défiler
          </span>
          <div
            className="w-px h-10 overflow-hidden relative"
            style={{ background: "rgba(176,139,58,0.12)" }}
          >
            <div
              className="w-full scroll-indicator-line"
              style={{ background: "#B08B3A", height: "100%" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
