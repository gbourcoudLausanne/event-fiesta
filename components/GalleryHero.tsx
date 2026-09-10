"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export function GalleryHero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-[68px]"
      style={{ background: "#F3EDE6" }}
    >
      {/* Photo — bande en haut sur mobile, pleine hauteur à droite sur desktop */}
      <div className="relative h-[42vh] min-h-[300px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[60%]">
        <motion.div
          className="absolute inset-x-0 -top-[8%] -bottom-[8%]"
          style={{ y: imgY }}
        >
          <motion.div
            className="relative h-full w-full"
            initial={reduce ? false : { scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease }}
          >
            <Image
              src="/Galerie/hero-slides/hero-slide-8.webp"
              alt=""
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 34%" }}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </motion.div>
        {/* Fondu vers le crème à gauche (desktop) pour lier la carte à la photo */}
        <div
          className="absolute inset-0 hidden lg:block pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #F3EDE6 0%, rgba(243,237,230,0.4) 14%, rgba(243,237,230,0) 30%)",
          }}
          aria-hidden
        />
      </div>

      {/* Carte texte */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative -mt-16 mx-1 sm:mx-6 rounded-[3px] bg-[#FAF7F2] p-8 sm:p-12 lg:mx-0 lg:my-24 lg:max-w-[560px] lg:p-16"
          style={{
            boxShadow: "0 60px 120px -55px rgba(120,60,80,0.45)",
            border: "1px solid rgba(217,98,138,0.14)",
          }}
        >
          {/* Motif arche */}
          <svg width="52" height="32" viewBox="0 0 52 32" className="mb-7" aria-hidden>
            <path d="M4 30 C 4 6 48 6 48 30" stroke="#D9628A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="4" cy="30" r="3.2" fill="#D9628A" />
            <circle cx="26" cy="5" r="3.2" fill="#D9628A" />
            <circle cx="48" cy="30" r="3.2" fill="#D9628A" />
          </svg>

          <p className="font-sans text-[10px] uppercase tracking-[0.34em] mb-5" style={{ color: "#B65572" }}>
            {t.realisations.heroEyebrow}
          </p>
          <h1
            className="font-serif font-normal uppercase leading-[1.14] tracking-[0.015em] mb-6"
            style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.9rem)", color: "#2A2320" }}
          >
            {t.realisations.heroTitle}
          </h1>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed max-w-md mb-8"
            style={{ color: "rgba(42,35,32,0.6)" }}
          >
            {t.realisations.heroText}
          </p>
          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
          >
            {t.realisations.heroCta}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
