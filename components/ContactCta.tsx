"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const ANCHORS = [
  { cx: 40, cy: 208 },
  { cx: 360, cy: 40 },
  { cx: 680, cy: 208 },
];

export function ContactCta() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-36"
      style={{
        background:
          "linear-gradient(150deg, #D9628A 0%, #C25E7E 55%, #B0546F 120%)",
      }}
    >
      {/* Halo */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-34%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(94vw, 940px)",
          aspectRatio: "1",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16), rgba(255,255,255,0) 62%)",
        }}
        aria-hidden
      />

      {/* Arche qui se dessine */}
      <motion.svg
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: "9%", width: "min(82vw, 720px)" }}
        viewBox="0 0 720 220"
        fill="none"
        aria-hidden
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "shown"}
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.path
          d="M40 208 C 66 30 654 30 680 208"
          stroke="rgba(250,247,242,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            shown: { pathLength: 1, transition: { duration: 1.7, ease } },
          }}
        />
        {ANCHORS.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="7"
            fill="rgba(250,247,242,0.92)"
            style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              shown: {
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 260, damping: 14, delay: 0.7 + i * 0.16 },
              },
            }}
          />
        ))}
      </motion.svg>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
      >
        <p
          className="font-sans text-[11px] uppercase tracking-[0.34em] mb-6"
          style={{ color: "rgba(250,247,242,0.72)" }}
        >
          {t.cta.eyebrow}
        </p>
        <h2
          className="font-serif font-light italic leading-[1.12]"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.9rem)", color: "#FAF7F2" }}
        >
          {t.cta.title}
        </h2>
        <p
          className="mt-6 mx-auto max-w-md font-sans font-light text-[14.5px] leading-relaxed"
          style={{ color: "rgba(250,247,242,0.82)" }}
        >
          {t.cta.text}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-sm font-medium px-9 py-4 rounded-full transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#FAF7F2", color: "#B0546F" }}
          >
            {t.cta.button}
            <ArrowRight size={15} weight="bold" />
          </Link>
          <a
            href="tel:0779143855"
            className="font-sans text-sm font-light transition-colors duration-200"
            style={{ color: "rgba(250,247,242,0.72)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#FAF7F2")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(250,247,242,0.72)")
            }
          >
            {t.cta.phone}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
