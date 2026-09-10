"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const STRIP = [
  { src: "/Galerie/hero-slides/hero-slide-8.webp", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-13.webp", alt: "Arche ronde de ballons violet et or dans un jardin" },
  { src: "/Galerie/hero-slides/hero-slide-17.webp", alt: "Pique-nique au bord de l'eau, table basse en bois et coussins" },
];

export function GalleryHero({ worlds, pieces }: { worlds: number; pieces: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-[68px]" style={{ background: "#F3EDE6" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-10 lg:pt-24 lg:pb-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.32em]" style={{ color: "#B65572" }}>
              {t.realisations.heroEyebrow}
            </span>
          </div>
          <h1
            className="font-serif font-light leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 6.4vw, 5rem)", color: "#2A2320" }}
          >
            {t.realisations.heroTitle}
          </h1>
          <p
            className="mt-6 max-w-lg font-sans font-light text-[15px] leading-relaxed"
            style={{ color: "rgba(42,35,32,0.58)" }}
          >
            {t.realisations.heroText}
          </p>
          <p className="mt-7 font-sans text-[11px] uppercase tracking-[0.24em]" style={{ color: "rgba(42,35,32,0.4)" }}>
            {worlds} univers · {pieces} décors
          </p>
        </motion.div>
      </div>

      {/* Bandeau photo pleine largeur */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        className="flex h-[38vh] min-h-[240px] w-full gap-1.5 lg:h-[52vh]"
      >
        {STRIP.map((p, i) => (
          <div key={p.src} className="relative flex-1 overflow-hidden">
            <div
              className="absolute inset-0"
              style={
                reduce
                  ? undefined
                  : { animation: `kenburns ${13 + i * 3}s ease-in-out ${i * -2}s infinite alternate` }
              }
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: "center 38%" }}
                sizes="34vw"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(13,11,8,0.22), transparent 40%)" }}
              aria-hidden
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
