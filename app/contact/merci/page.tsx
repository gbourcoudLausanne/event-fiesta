"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { WhatsappLogo, ArrowLeft, Check } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export default function MerciPage() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <div className="pt-[68px]">
      <section
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24"
        style={{ background: "linear-gradient(150deg, #D9628A 0%, #C25E7E 55%, #B0546F 120%)" }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[-30%] -translate-x-1/2 rounded-full"
          style={{
            width: "min(92vw, 880px)",
            aspectRatio: "1",
            background: "radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 62%)",
          }}
          aria-hidden
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative z-10 max-w-lg text-center"
        >
          <motion.span
            initial={reduce ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(250,247,242,0.16)", border: "1px solid rgba(250,247,242,0.4)" }}
          >
            <Check size={28} weight="bold" style={{ color: "#FAF7F2" }} />
          </motion.span>

          <p className="font-sans text-[11px] uppercase tracking-[0.34em]" style={{ color: "rgba(250,247,242,0.72)" }}>
            {t.contact.merci.eyebrow}
          </p>
          <h1
            className="mt-4 font-serif font-light italic leading-[1.15]"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", color: "#FAF7F2" }}
          >
            {t.contact.merci.title}
          </h1>
          <p
            className="mx-auto mt-5 max-w-md font-sans font-light text-[14.5px] leading-relaxed"
            style={{ color: "rgba(250,247,242,0.85)" }}
          >
            {t.contact.merci.text}
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/41779143855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#FAF7F2", color: "#B0546F" }}
            >
              <WhatsappLogo size={16} weight="fill" style={{ color: "#25D366" }} />
              {t.contact.merci.whatsapp}
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-[13px] font-light transition-opacity hover:opacity-70"
              style={{ color: "rgba(250,247,242,0.8)" }}
            >
              <ArrowLeft size={14} weight="bold" />
              {t.contact.merci.back}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
