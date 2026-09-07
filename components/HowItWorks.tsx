"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 280, damping: 22 } as const;

const STEPS = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Consultation",
    desc: "On échange sur votre vision, votre thème, vos couleurs et votre budget. Chaque projet commence par une écoute attentive.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: "Création",
    desc: "On conçoit et prépare votre décoration sur mesure : arches, colonnes, murs de ballons, goodies… Tout est pensé dans les moindres détails.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
      </svg>
    ),
    title: "Votre événement",
    desc: "On installe tout sur place avant votre arrivée. Il ne vous reste plus qu'à profiter pleinement de votre fête.",
  },
];

function Step({ step, index, inView, reduce }: {
  step: typeof STEPS[0];
  index: number;
  inView: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.18, ease }}
      className="flex flex-col items-center text-center lg:items-start lg:text-left gap-6"
    >
      {/* Icône cercle */}
      <motion.div
        className="relative cursor-default"
        whileHover={reduce ? {} : { scale: 1.1, rotate: -5 }}
        transition={spring}
      >
        {/* Halo pulsant */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 1, opacity: 0.18 }}
          animate={{ scale: [1, 1.45, 1], opacity: [0.18, 0, 0.18] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.7, ease: "easeInOut" }}
          style={{ background: "rgba(217,98,138,0.3)" }}
          aria-hidden
        />
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center z-10"
          style={{
            background: "linear-gradient(135deg, #FAF7F2 60%, rgba(217,98,138,0.07))",
            border: "1px solid rgba(217,98,138,0.22)",
            boxShadow: "0 6px 28px rgba(217,98,138,0.1)",
            color: "#D9628A",
          }}
        >
          {step.icon}
        </div>

        {/* Badge numéro — bounce */}
        <motion.span
          initial={reduce ? false : { scale: 0, rotate: -20 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ ...spring, delay: index * 0.18 + 0.4 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-sans text-[10px] font-bold z-20"
          style={{ background: "#D9628A", color: "#FAF7F2" }}
        >
          {index + 1}
        </motion.span>
      </motion.div>

      <div className="flex flex-col gap-2">
        <h3 className="font-serif font-light text-2xl" style={{ color: "#0D0B08" }}>
          {step.title}
        </h3>
        <p className="font-sans font-light text-[14px] leading-relaxed max-w-xs" style={{ color: "rgba(13,11,8,0.5)" }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <section className="py-24 lg:py-32" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-16 lg:mb-20"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#D9628A" }}>
            Simple &amp; transparent
          </p>
          <h2
            className="font-serif font-light leading-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#0D0B08" }}
          >
            Comment ça marche
          </h2>
        </motion.div>

        {/* Steps grid */}
        <div ref={ref} className="relative grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">

          {/* Ligne animée desktop */}
          <div className="absolute hidden lg:block" style={{ top: "40px", left: "calc(16.67% + 44px)", right: "calc(16.67% + 44px)", height: "1px" }}>
            {/* Track */}
            <div className="absolute inset-0" style={{ background: "rgba(217,98,138,0.1)" }} />
            {/* Fill animé */}
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ background: "linear-gradient(90deg, #D9628A, rgba(217,98,138,0.4))", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />
            {/* Point glissant */}
            {!reduce && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background: "#D9628A", left: 0 }}
                initial={{ x: 0, opacity: 1 }}
                animate={inView ? { x: "calc(100vw * 0.28)", opacity: [1, 1, 0] } : {}}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
              />
            )}
          </div>

          {STEPS.map((step, i) => (
            <Step key={step.title} step={step} index={i} inView={inView} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
