"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  animate,
} from "motion/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (reduce) { setDisplay(to.toString()); return; }
    if (!inView) return;
    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    const unsub = count.on("change", (v) => setDisplay(Math.round(v).toString()));
    return () => { controls.stop(); unsub(); };
  }, [inView, reduce, count, to]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export function WhyUs() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const statConfigs = [
    { numeric: 200, suffix: "+", isCounter: true },
    { numeric: 5,   suffix: "★", isCounter: false, display: "5★" },
    { numeric: 3,   suffix: "",  isCounter: true },
    { numeric: 100, suffix: "%", isCounter: false, display: "100%" },
  ];

  return (
    <section
      id="whyus"
      className="py-24 lg:py-36 relative overflow-hidden"
      style={{ background: "#0D0B08" }}
    >
      {/* Subtle gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(176,139,58,0.05) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">

        {/* Section header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-20 lg:mb-24"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] mb-3" style={{ color: "#B08B3A" }}>
            {t.whyus.eyebrow}
          </p>
          <h2
            className="font-serif font-light italic"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "rgba(250,247,242,0.4)" }}
          >
            {t.whyus.title}
          </h2>
        </motion.div>

        {/* Stats grid — 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x mb-20 lg:mb-28"
          style={{ borderColor: "rgba(176,139,58,0.1)" }}
        >
          {t.whyus.stats.map((stat, i) => {
            const cfg = statConfigs[i];
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
                className="flex flex-col gap-3 md:px-10 first:md:pl-0 last:md:pr-0"
                style={{ borderColor: "rgba(176,139,58,0.1)" }}
              >
                <div
                  className="font-serif font-light leading-none"
                  style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)", color: "#B08B3A" }}
                >
                  {cfg.isCounter ? (
                    <AnimatedCounter to={cfg.numeric} suffix={cfg.suffix} />
                  ) : (
                    cfg.display
                  )}
                </div>
                <p className="font-sans text-sm" style={{ color: "rgba(250,247,242,0.38)", letterSpacing: "0.04em" }}>
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quote */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          className="relative max-w-4xl"
        >
          {/* Giant quotation mark */}
          <span
            className="absolute -top-10 -left-4 font-serif leading-none pointer-events-none select-none"
            style={{ fontSize: "12rem", color: "rgba(176,139,58,0.08)", lineHeight: 1 }}
            aria-hidden
          >
            "
          </span>

          <blockquote
            className="font-display font-light italic leading-[1.35] relative z-10"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              color: "rgba(250,247,242,0.82)",
            }}
          >
            {t.whyus.quote}
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "#B08B3A" }} />
            <span className="font-sans text-xs tracking-[0.2em] uppercase" style={{ color: "#B08B3A" }}>
              Event Fiesta · Lausanne
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
