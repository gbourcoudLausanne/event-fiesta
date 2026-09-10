"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { PageHero } from "@/components/PageHero";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LegalPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <div className="pt-[68px]">
      <PageHero eyebrow={t.legal.eyebrow} title={t.legal.title} subtitle={t.legal.updated} />

      <section className="py-16 lg:py-24" style={{ background: "#FAF7F2" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col gap-10 lg:gap-12">
            {t.legal.sections.map((s, i) => (
              <motion.div
                key={s.heading}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease }}
              >
                <h2
                  className="font-serif font-light mb-3"
                  style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.7rem)", color: "#2A2320" }}
                >
                  {s.heading}
                </h2>
                <p
                  className="font-sans font-light text-[14.5px] leading-relaxed"
                  style={{ color: "rgba(42,35,32,0.62)", whiteSpace: "pre-line" }}
                >
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 pt-8" style={{ borderTop: "1px solid rgba(42,35,32,0.12)" }}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
              style={{ color: "#B65572" }}
            >
              {t.contact.title}
              <ArrowRight
                size={13}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
