"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PANELS = [
  {
    src: "/Galerie/hero-slides/hero-slide-13.webp",
    alt: "Arche ronde de ballons violet et or dans un jardin",
    grow: "lg:flex-[0.9]",
  },
  {
    src: "/Galerie/hero-slides/hero-slide-8.webp",
    alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table",
    grow: "lg:flex-[1.25]",
  },
  {
    src: "/Galerie/hero-slides/hero-slide-17.webp",
    alt: "Pique-nique au bord de l'eau, table basse en bois et coussins",
    grow: "lg:flex-[0.9]",
  },
];

export function GalleryHero({ worlds, pieces }: { worlds: number; pieces: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden pt-[68px]"
      style={{ background: "#241017" }}
    >
      <div className="relative h-[62vh] min-h-[440px] w-full lg:h-[74vh]">
        {/* Triptyque */}
        <div className="absolute inset-0 flex flex-col gap-[3px] sm:flex-row">
          {PANELS.map((p, i) => (
            <motion.div
              key={p.src}
              className={`relative flex-1 overflow-hidden ${p.grow}`}
              initial={reduce ? false : { opacity: 0, y: "6%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 + i * 0.14, ease }}
            >
              <div
                className="absolute inset-0"
                style={
                  reduce
                    ? undefined
                    : { animation: `kenburns ${15 + i * 3}s ease-in-out ${i * -3}s infinite alternate` }
                }
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  priority={i === 1}
                  className="object-cover"
                  style={{ objectPosition: "center 36%" }}
                  sizes="(max-width: 640px) 100vw, 40vw"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voile */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(20,8,13,0.82) 0%, rgba(20,8,13,0.15) 46%, rgba(20,8,13,0.28) 100%)",
          }}
          aria-hidden
        />

        {/* Texte */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-10 lg:pb-16">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="max-w-2xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10" style={{ background: "rgba(250,247,242,0.6)" }} />
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.34em]"
                  style={{ color: "rgba(250,247,242,0.82)" }}
                >
                  {t.realisations.heroEyebrow}
                </span>
              </div>
              <h1
                className="font-serif font-light leading-[1.06] tracking-tight"
                style={{
                  fontSize: "clamp(2.4rem, 5.4vw, 4.4rem)",
                  color: "#FAF7F2",
                  textShadow: "0 2px 40px rgba(0,0,0,0.5)",
                }}
              >
                {t.realisations.heroTitle}
              </h1>
              <p
                className="mt-5 max-w-lg font-sans font-light text-[14.5px] leading-relaxed"
                style={{ color: "rgba(250,247,242,0.85)", textShadow: "0 1px 20px rgba(0,0,0,0.45)" }}
              >
                {t.realisations.heroText}
              </p>
              <p
                className="mt-7 font-sans text-[11px] uppercase tracking-[0.26em]"
                style={{ color: "rgba(250,247,242,0.6)" }}
              >
                {worlds} univers · {pieces} décors
              </p>
            </motion.div>
          </div>
        </div>

        {/* Indice de scroll */}
        {!reduce && (
          <motion.div
            className="absolute bottom-5 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            aria-hidden
          >
            <span className="block h-8 w-px" style={{ background: "rgba(250,247,242,0.55)" }} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
