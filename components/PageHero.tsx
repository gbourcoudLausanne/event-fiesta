"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

const ease = [0.16, 1, 0.3, 1] as const;

export function PageHero({
  eyebrow,
  title,
  subtitle,
  centered = false,
  cta,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  cta?: { label: string; href: string };
}) {
  const reduce = useReducedMotion();

  return (
    <section
      className={`relative overflow-hidden ${
        centered
          ? "pt-[140px] pb-20 text-center lg:pt-[184px] lg:pb-28"
          : "pt-[136px] pb-16 lg:pt-[168px] lg:pb-24"
      }`}
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
          className={centered ? "mx-auto max-w-3xl" : ""}
        >
          <div className={`flex items-center gap-3 mb-5 ${centered ? "justify-center" : ""}`}>
            <div className="w-10 h-px shrink-0" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "#B65572" }}
            >
              {eyebrow}
            </span>
            {centered && <div className="w-10 h-px shrink-0" style={{ background: "#D9628A" }} />}
          </div>

          <h1
            className={
              centered
                ? "font-serif font-normal uppercase leading-[1.08] tracking-[0.015em]"
                : "font-serif font-light leading-[1.05] tracking-tight"
            }
            style={{
              fontSize: centered ? "clamp(2.1rem, 5vw, 4.2rem)" : "clamp(2.6rem, 5.5vw, 4.6rem)",
              color: "#2A2320",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`font-sans font-light text-[15px] leading-relaxed mt-6 ${
                centered ? "mx-auto max-w-xl" : "max-w-xl"
              }`}
              style={{ color: "rgba(42,35,32,0.55)" }}
            >
              {subtitle}
            </p>
          )}

          {cta && (
            <div className={`mt-9 lg:mt-11 ${centered ? "" : ""}`}>
              <Link
                href={cta.href}
                className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-9 py-4 rounded-full transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: "#D9628A", color: "#FAF7F2" }}
              >
                {cta.label}
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
