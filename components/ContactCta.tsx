"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, WhatsappLogo, Phone } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export function ContactCta() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden" style={{ background: "#F3EDE6" }}>
      <div
        className="pointer-events-none absolute -right-32 -top-32 hidden rounded-full lg:block"
        style={{
          width: 460,
          height: 460,
          background: "radial-gradient(circle, rgba(217,98,138,0.1) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[0.85fr_1fr] lg:gap-20 lg:px-10 lg:py-28">
        {/* Photo */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto w-full max-w-sm lg:mx-0"
        >
          <div
            className="relative overflow-hidden rounded-[24px]"
            style={{
              aspectRatio: "4 / 5",
              boxShadow: "0 40px 90px -50px rgba(120,60,80,0.5)",
            }}
          >
            <Image
              src="/Galerie/hero-slides/hero-slide-2.webp"
              alt="Arche de ballons rose poudré et rose gold sur backdrop crème"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 380px"
            />
          </div>
          <div
            className="absolute -bottom-4 left-5 rounded-full px-5 py-2.5 font-sans text-[11px] tracking-wide"
            style={{
              background: "#FAF7F2",
              color: "#B0546F",
              boxShadow: "0 20px 40px -22px rgba(120,60,80,0.4)",
            }}
          >
            {t.cta.note}
          </div>
        </motion.div>

        {/* Texte + actions */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.32em]"
              style={{ color: "#B65572" }}
            >
              {t.cta.eyebrow}
            </span>
          </div>

          <h2
            className="mt-5 font-serif font-light leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.5rem)", color: "#2A2320" }}
          >
            {t.cta.title}
          </h2>

          <p
            className="mt-5 max-w-md font-sans font-light text-[14.5px] leading-relaxed"
            style={{ color: "rgba(42,35,32,0.6)" }}
          >
            {t.cta.text}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="btn-gold-shimmer inline-flex items-center gap-2 rounded-full px-8 py-4 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#FAF7F2" }}
            >
              {t.cta.button}
              <ArrowRight size={15} weight="bold" />
            </Link>

            <a
              href="https://wa.me/41779143855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: "#FAF7F2",
                color: "#2A2320",
                border: "1px solid rgba(42,35,32,0.14)",
              }}
            >
              <WhatsappLogo size={16} weight="fill" style={{ color: "#25D366" }} />
              {t.cta.whatsapp}
            </a>
          </div>

          <a
            href="tel:+41779143855"
            className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] font-light transition-colors duration-200 hover:opacity-70"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            <Phone size={14} weight="bold" />
            {t.cta.phone}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
