"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const stack: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
};

const STRIP = [
  { src: "/Galerie/hero-slides/hero-slide-8.webp", name: "Dégradé fuchsia" },
  { src: "/Galerie/hero-slides/hero-slide-13.webp", name: "Arche jardin" },
  { src: "/Galerie/hero-slides/hero-slide-2.webp", name: "Rose poudré" },
  { src: "/Galerie/hero-slides/hero-slide-9.webp", name: "Ballerine" },
  { src: "/Galerie/hero-slides/hero-slide-6.webp", name: "Sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", name: "Table anémones" },
  { src: "/Galerie/hero-slides/hero-slide-4.webp", name: "Fleurs & franges" },
  { src: "/Galerie/hero-slides/hero-slide-17.webp", name: "Pique-nique" },
  { src: "/Galerie/hero-slides/hero-slide-5.webp", name: "Menthe & pêche" },
  { src: "/Galerie/hero-slides/hero-slide-12.webp", name: "30 ans" },
  { src: "/Galerie/hero-slides/hero-slide-1.webp", name: "Rose & blanc" },
  { src: "/Galerie/hero-slides/hero-slide-18.webp", name: "Fête pyjama" },
];

export function GalleryHero({ worlds, pieces }: { worlds: number; pieces: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const loop = [...STRIP, ...STRIP];

  return (
    <section className="relative z-10 w-full pt-[68px]" style={{ background: "#FAF7F2" }}>
      <div className="relative h-[46vh] min-h-[380px] lg:h-[56vh]">
        {/* Bande photo qui défile */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="absolute inset-0 flex items-center overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex h-full items-stretch gap-2.5"
            style={{
              width: "max-content",
              animation: reduce ? undefined : "gallery-marquee 62s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {loop.map((p, i) => (
              <a
                key={i}
                href="#realisations"
                className="group relative block h-full shrink-0 overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
                aria-label={p.name}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  priority={i < 3}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ objectPosition: "center 36%" }}
                  sizes="60vw"
                />
                <div
                  className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top, rgba(13,11,8,0.6), transparent 55%)" }}
                >
                  <span className="font-serif font-light italic" style={{ fontSize: "1rem", color: "#FAF7F2" }}>
                    {p.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Halo crème doux derrière la carte */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 46% 62% at 50% 50%, rgba(250,247,242,0.4) 0%, transparent 65%)",
          }}
          aria-hidden
        />

        {/* Carte texte — rectangulaire, centrée, dépasse en bas */}
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-4 pt-[13vh] sm:px-6 lg:pt-[15vh]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="pointer-events-auto w-full max-w-[820px] rounded-[6px] bg-[#FAF7F2] px-8 py-9 text-center sm:px-16 sm:py-11 lg:px-24 lg:py-12"
            style={{
              boxShadow: "0 18px 44px -34px rgba(90,50,60,0.18)",
              border: "1px solid rgba(217,98,138,0.14)",
            }}
          >
            <motion.div
              variants={reduce ? undefined : stack}
              initial={reduce ? false : "hidden"}
              animate={reduce ? undefined : "visible"}
            >
              <motion.div
                variants={reduce ? undefined : rise}
                className="mb-5 flex items-center justify-center gap-3"
              >
                <span className="h-px w-10" style={{ background: "#D9628A" }} />
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.34em]"
                  style={{ color: "#B65572" }}
                >
                  {t.realisations.heroEyebrow}
                </span>
                <span className="h-px w-10" style={{ background: "#D9628A" }} />
              </motion.div>

              <motion.h1
                variants={reduce ? undefined : rise}
                className="font-serif font-light leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.3rem)", color: "#2A2320" }}
              >
                {t.realisations.heroTitle}
              </motion.h1>

              <motion.p
                variants={reduce ? undefined : rise}
                className="mx-auto mt-5 max-w-2xl font-sans font-light text-[14.5px] leading-relaxed"
                style={{ color: "rgba(42,35,32,0.6)" }}
              >
                {t.realisations.heroText}
              </motion.p>

              <motion.div
                variants={reduce ? undefined : rise}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
              >
                <Link
                  href="/contact"
                  className="btn-gold-shimmer inline-flex items-center gap-2 rounded-full px-7 py-3 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
                  style={{ background: "#D9628A", color: "#FAF7F2" }}
                >
                  {t.realisations.heroCta}
                  <ArrowRight size={14} weight="bold" />
                </Link>
                <span
                  className="font-sans text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(42,35,32,0.4)" }}
                >
                  {worlds} univers · {pieces} décors
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
