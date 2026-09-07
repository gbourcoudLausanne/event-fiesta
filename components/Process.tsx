"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  ChatCircleDots,
  PaintBrush,
  ClipboardText,
  Truck,
  ArrowRight,
  PushPin,
  type Icon,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const ICONS: Icon[] = [ChatCircleDots, PaintBrush, ClipboardText, Truck];

const TINTS = [
  { bg: "#FBEDF0", ink: "#B65572", pin: "#D9628A" },
  { bg: "#ECF3F6", ink: "#5E86A0", pin: "#A8CEE0" },
  { bg: "#FBF1E7", ink: "#B98A55", pin: "#F0C29A" },
  { bg: "#F3EEF7", ink: "#8B76A8", pin: "#C9B7E0" },
];

const TILT = [-2.5, 1.5, -1.5, 2.5];

export function Process() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "#F3EDE6" }}
    >
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-12%",
          right: "-8%",
          width: "min(46vw, 560px)",
          aspectRatio: "1",
          background:
            "radial-gradient(circle at 50% 50%, rgba(244,168,184,0.18), rgba(244,168,184,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        {/* En-tête */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.process.eyebrow}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.4vw, 3.4rem)", color: "#2A2320" }}
          >
            {t.process.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.process.intro}
          </p>
        </motion.div>

        {/* Cartes */}
        <div className="relative">
          {/* Fil pointillé animé — desktop */}
          <svg
            className="absolute inset-x-0 top-1/2 hidden lg:block pointer-events-none"
            style={{ transform: "translateY(-50%)" }}
            height="2"
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.line
              x1="30"
              y1="1"
              x2="970"
              y2="1"
              stroke="#D9628A"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="7 6"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 0 }}
              animate={reduce ? undefined : { strokeDashoffset: -130 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-6 lg:gap-5">
            {t.process.steps.map((s, i) => {
              const Ico = ICONS[i];
              const tint = TINTS[i % TINTS.length];
              const tilt = TILT[i % TILT.length];
              return (
                <motion.li
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
                  className="relative"
                >
                  <motion.div
                    animate={reduce ? undefined : { rotate: tilt }}
                    whileHover={reduce ? undefined : { rotate: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-full rounded-2xl bg-white p-2.5"
                    style={{ boxShadow: "0 18px 44px -22px rgba(120,60,80,0.28)" }}
                  >
                    <span
                      className="absolute left-1/2 -top-3 z-10"
                      style={{ transform: "translateX(-50%)" }}
                    >
                      <PushPin size={22} weight="fill" color={tint.pin} />
                    </span>
                    <div
                      className="rounded-xl p-5 h-full flex flex-col"
                      style={{ background: tint.bg }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="font-display italic leading-none"
                          style={{ fontSize: "2.4rem", color: tint.ink }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {Ico && <Ico size={22} weight="light" color={tint.ink} />}
                      </div>
                      <h3
                        className="font-serif font-light text-xl leading-tight mb-2"
                        style={{ color: "#2A2320" }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="font-sans font-light text-[13px] leading-relaxed"
                        style={{ color: "rgba(42,35,32,0.6)" }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 lg:mt-14">
          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
          >
            {t.process.cta}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
