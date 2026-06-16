"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  animate,
} from "motion/react";
import { Star } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const STAT_CONFIG = [
  { numeric: 200, suffix: "+", sizeCls: "text-7xl lg:text-8xl", showStar: false },
  { numeric: 5, suffix: "", sizeCls: "text-6xl lg:text-7xl", showStar: true },
  { numeric: 3, suffix: "", sizeCls: "text-8xl lg:text-9xl", showStar: false },
] as const;

function AnimatedCounter({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (reduce) {
      setDisplay(to.toString());
      return;
    }
    if (!inView) return;

    const controls = animate(count, to, { duration: 2.2, ease: "easeOut" });
    const unsub = count.on("change", (v) =>
      setDisplay(Math.round(v).toString())
    );
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, reduce, count, to]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function WhyUs() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="bg-noir py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="font-serif text-2xl md:text-3xl font-light text-creme/50 mb-16 lg:mb-24 max-w-sm"
        >
          {t.whyus.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-creme/10">
          {t.whyus.stats.map((stat, i) => {
            const cfg = STAT_CONFIG[i];
            return (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease }}
                className={`flex flex-col gap-3 py-8 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 border-creme/10 last:border-b-0 ${
                  i === 0 ? "md:pr-12" : i === 1 ? "md:px-12" : "md:pl-12"
                }`}
              >
                <div
                  className={`font-serif font-light text-or leading-none flex items-end gap-2 ${cfg.sizeCls}`}
                >
                  <AnimatedCounter to={cfg.numeric} suffix={cfg.suffix} />
                  {cfg.showStar && (
                    <Star
                      weight="fill"
                      size={24}
                      className="text-or mb-2 shrink-0"
                      aria-label="étoiles"
                    />
                  )}
                </div>
                <p className="font-sans text-sm text-creme/50 tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="mt-16 lg:mt-24 h-px bg-gradient-to-r from-or/60 via-or/30 to-transparent origin-left"
          aria-hidden
        />
      </div>
    </section>
  );
}
