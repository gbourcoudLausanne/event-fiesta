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
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
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
    <section className="relative w-full overflow-hidden pt-[68px]" style={{ background: "#FAF7F2" }}>
      {/* Bande photo qui défile */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease }}
        className="relative overflow-hidden pt-6"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-2.5"
          style={{
            width: "max-content",
            animation: reduce ? undefined : "gallery-marquee 55s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((p, i) => (
            <a
              key={i}
              href="#realisations"
              className="group relative block h-[32vh] min-h-[230px] shrink-0 overflow-hidden rounded-[10px] lg:h-[42vh]"
              style={{ aspectRatio: "3 / 4" }}
              aria-label={p.name}
            >
              <Image
                src={p.src}
                alt=""
                fill
                priority={i < 4}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                style={{ objectPosition: "center 38%" }}
                sizes="30vw"
              />
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(to top, rgba(13,11,8,0.6), transparent 55%)" }}
              >
                <span className="font-serif font-light italic" style={{ fontSize: "0.95rem", color: "#FAF7F2" }}>
                  {p.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Texte centré */}
      <motion.div
        className="mx-auto max-w-2xl px-6 pt-12 pb-16 text-center lg:pt-16 lg:pb-20"
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
            className="font-sans text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "#B65572" }}
          >
            {t.realisations.heroEyebrow}
          </span>
          <span className="h-px w-10" style={{ background: "#D9628A" }} />
        </motion.div>

        <motion.h1
          variants={reduce ? undefined : rise}
          className="font-serif font-light leading-[1.07] tracking-tight"
          style={{ fontSize: "clamp(2.2rem, 4.4vw, 3.6rem)", color: "#2A2320" }}
        >
          {t.realisations.heroTitle}
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : rise}
          className="mx-auto mt-5 max-w-lg font-sans font-light text-[14.5px] leading-relaxed"
          style={{ color: "rgba(42,35,32,0.6)" }}
        >
          {t.realisations.heroText}
        </motion.p>

        <motion.div
          variants={reduce ? undefined : rise}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
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
    </section>
  );
}
