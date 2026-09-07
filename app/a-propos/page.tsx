"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PageHero } from "@/components/PageHero";
import { WhyUs } from "@/components/WhyUs";
import { CtaBanner } from "@/components/CtaBanner";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const VALUE_DOTS = ["#F4A8B8", "#A8CEE0", "#F0C29A"];

export default function AboutPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} subtitle={t.about.lead} />

      {/* Intro + histoire */}
      <section className="py-20 lg:py-28" style={{ background: "#FAF7F2" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col gap-6"
          >
            {t.about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-sans font-light text-[15px] leading-relaxed"
                style={{ color: "rgba(13,11,8,0.62)" }}
              >
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="rounded-3xl p-8 lg:p-10 self-start"
            style={{
              background: "#F3EDE6",
              border: "1px solid rgba(217,98,138,0.14)",
            }}
          >
            <p
              className="font-sans text-[11px] uppercase tracking-[0.25em] mb-4"
              style={{ color: "#D9628A" }}
            >
              {t.about.storyTitle}
            </p>
            <p
              className="font-serif font-light italic text-lg lg:text-xl leading-relaxed"
              style={{ color: "rgba(13,11,8,0.7)" }}
            >
              {t.about.story}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 lg:py-28" style={{ background: "#F3EDE6" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="font-serif font-light leading-tight mb-14"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0D0B08" }}
          >
            {t.about.valuesTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.about.values.map((v, i) => (
              <motion.div
                key={v.label}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="rounded-2xl p-8"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(217,98,138,0.16)",
                  boxShadow: "0 4px 24px rgba(13,11,8,0.05)",
                }}
              >
                <span
                  className="w-3 h-3 rounded-full block mb-5"
                  style={{ background: VALUE_DOTS[i % VALUE_DOTS.length] }}
                  aria-hidden
                />
                <h3
                  className="font-serif font-light text-xl mb-2"
                  style={{ color: "#0D0B08" }}
                >
                  {v.label}
                </h3>
                <p
                  className="font-sans font-light text-[13px] leading-relaxed"
                  style={{ color: "rgba(13,11,8,0.55)" }}
                >
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-14"
          >
            <Link
              href="/contact"
              className="btn-gold-shimmer inline-block font-sans text-[13px] font-medium px-8 py-3.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#0D0B08" }}
            >
              {t.about.cta}
            </Link>
          </motion.div>
        </div>
      </section>

      <WhyUs />
      <CtaBanner />
    </>
  );
}
