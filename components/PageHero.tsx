"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { RisingBalloons } from "@/components/RisingBalloons";

const ease = [0.16, 1, 0.3, 1] as const;

export function PageHero({
  eyebrow,
  title,
  subtitle,
  centered = false,
  cta,
  tone = "cream",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  cta?: { label: string; href: string };
  tone?: "cream" | "rose";
}) {
  const reduce = useReducedMotion();
  const rose = tone === "rose";

  const ink = rose ? "#FAF7F2" : "#2A2320";
  const sub = rose ? "rgba(250,247,242,0.82)" : "rgba(42,35,32,0.55)";
  const eye = rose ? "rgba(250,247,242,0.7)" : "#B65572";
  const line = rose ? "rgba(250,247,242,0.5)" : "#D9628A";

  return (
    <section
      className={`relative overflow-hidden ${
        centered
          ? "pt-[116px] pb-12 text-center lg:pt-[132px] lg:pb-16"
          : "pt-[136px] pb-16 lg:pt-[168px] lg:pb-24"
      }`}
      style={{
        background: rose
          ? "linear-gradient(150deg, #D9628A 0%, #C25E7E 55%, #B0546F 120%)"
          : "#F3EDE6",
      }}
    >
      {rose ? (
        <>
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              top: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(94vw, 940px)",
              aspectRatio: "1",
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16), rgba(255,255,255,0) 62%)",
            }}
            aria-hidden
          />
          {!reduce && <RisingBalloons mode="hero" opacity={0.9} />}
        </>
      ) : (
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
      )}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: rose ? 0.1 : 0, ease }}
          className={centered ? "mx-auto max-w-3xl" : ""}
        >
          <div className={`flex items-center gap-3 mb-5 ${centered ? "justify-center" : ""}`}>
            <div className="w-10 h-px shrink-0" style={{ background: line }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.28em]" style={{ color: eye }}>
              {eyebrow}
            </span>
            {centered && <div className="w-10 h-px shrink-0" style={{ background: line }} />}
          </div>

          <h1
            className="font-serif font-light leading-[1.08] tracking-tight"
            style={{
              fontSize: centered ? "clamp(2.1rem, 4.6vw, 3.6rem)" : "clamp(2.6rem, 5.5vw, 4.6rem)",
              color: ink,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={`font-sans font-light text-[15px] leading-relaxed mt-6 ${
                centered ? "mx-auto max-w-xl" : "max-w-xl"
              }`}
              style={{ color: sub }}
            >
              {subtitle}
            </p>
          )}

          {cta && (
            <div className="mt-7 lg:mt-9">
              <Link
                href={cta.href}
                className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-9 py-4 rounded-full transition-transform duration-200 hover:scale-[1.03]"
                style={{
                  background: rose ? "#FAF7F2" : "#D9628A",
                  color: rose ? "#B0546F" : "#FAF7F2",
                }}
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
