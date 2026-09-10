"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden pt-[136px] pb-16 lg:pt-[168px] lg:pb-24"
      style={{ background: "#F3EDE6" }}
    >
      {/* Orb décoratif */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-30%",
          right: "-8%",
          width: 560,
          height: 560,
          background: "radial-gradient(circle, rgba(217,98,138,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-px shrink-0" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "#B65572" }}
            >
              {eyebrow}
            </span>
          </div>
          <h1
            className="font-serif font-light leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)", color: "#2A2320" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="font-sans font-light text-[15px] leading-relaxed mt-6 max-w-xl"
              style={{ color: "rgba(42,35,32,0.55)" }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
