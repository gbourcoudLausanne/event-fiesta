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
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
};

const WALL = [
  { src: "/Galerie/hero-slides/hero-slide-8.webp", name: "Dégradé fuchsia" },
  { src: "/Galerie/hero-slides/hero-slide-13.webp", name: "Arche jardin" },
  { src: "/Galerie/hero-slides/hero-slide-2.webp", name: "Rose poudré" },
  { src: "/Galerie/hero-slides/hero-slide-9.webp", name: "Ballerine" },
  { src: "/Galerie/hero-slides/hero-slide-6.webp", name: "Sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", name: "Table anémones" },
  { src: "/Galerie/hero-slides/hero-slide-17.webp", name: "Pique-nique" },
  { src: "/Galerie/hero-slides/hero-slide-12.webp", name: "30 ans" },
  { src: "/Galerie/hero-slides/hero-slide-4.webp", name: "Fleurs & franges" },
];

export function GalleryHero({ worlds, pieces }: { worlds: number; pieces: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden pt-[68px]"
      style={{ background: "#FAF7F2" }}
    >
      <div className="mx-auto grid max-w-[1480px] grid-cols-1 items-stretch lg:min-h-[620px] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        {/* Texte */}
        <div className="flex items-center px-6 py-14 sm:px-10 lg:py-20 lg:pl-10 xl:pl-16">
          <motion.div
            className="relative max-w-[420px] pl-6"
            variants={reduce ? undefined : stack}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "visible"}
          >
            {/* Accent rose */}
            <motion.span
              className="absolute left-0 top-1 bottom-1 w-[3px] origin-top"
              style={{ background: "linear-gradient(#F2879E, #C24B72)" }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
              aria-hidden
            />

            <motion.div variants={reduce ? undefined : rise} className="mb-6">
              <svg width="48" height="30" viewBox="0 0 48 30" fill="none" aria-hidden>
                <motion.path
                  d="M4 28 C 4 6 44 6 44 28"
                  stroke="#D9628A"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  initial={reduce ? undefined : { pathLength: 0 }}
                  animate={reduce ? undefined : { pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease }}
                />
                <circle cx="4" cy="28" r="3" fill="#D9628A" />
                <circle cx="24" cy="5" r="3" fill="#D9628A" />
                <circle cx="44" cy="28" r="3" fill="#D9628A" />
              </svg>
            </motion.div>

            <motion.div variants={reduce ? undefined : rise} className="mb-5 flex items-center gap-3">
              <span className="h-px w-10" style={{ background: "#D9628A" }} />
              <span
                className="font-sans text-[10px] uppercase tracking-[0.32em]"
                style={{ color: "#B65572" }}
              >
                {t.realisations.heroEyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={reduce ? undefined : rise}
              className="font-serif font-light leading-[1.07] tracking-tight"
              style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)", color: "#2A2320" }}
            >
              {t.realisations.heroTitle}
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : rise}
              className="mt-5 font-sans font-light text-[14px] leading-relaxed"
              style={{ color: "rgba(42,35,32,0.6)" }}
            >
              {t.realisations.heroText}
            </motion.p>

            <motion.div
              variants={reduce ? undefined : rise}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3"
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
        </div>

        {/* Mur de tuiles */}
        <div
          className="relative grid h-[46vh] min-h-[300px] grid-cols-2 lg:h-auto lg:grid-cols-3"
          style={{ gap: "2px", gridTemplateRows: "repeat(3, minmax(0, 1fr))" }}
          onMouseLeave={() => setHovered(null)}
        >
          {WALL.map((tile, i) => (
            <motion.a
              key={tile.src}
              href="#realisations"
              onMouseEnter={() => setHovered(i)}
              className={`group relative block overflow-hidden ${i >= 6 ? "hidden lg:block" : ""}`}
              initial={reduce ? false : { opacity: 0, scale: 1.05 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      scale: hovered === i ? 1.05 : hovered !== null ? 0.985 : 1,
                      filter:
                        hovered === i
                          ? "brightness(1.06)"
                          : hovered !== null
                            ? "brightness(0.5)"
                            : "brightness(1)",
                      zIndex: hovered === i ? 10 : 1,
                    }
              }
              transition={{
                opacity: { duration: 0.6, delay: 0.15 + i * 0.05, ease },
                scale: { duration: 0.4, ease },
                filter: { duration: 0.4, ease },
              }}
            >
              <Image
                src={tile.src}
                alt=""
                fill
                priority={i < 3}
                className="object-cover"
                style={{ objectPosition: "center 38%" }}
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <span
                className="absolute bottom-2.5 left-3 font-serif font-light italic opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ fontSize: "0.95rem", color: "#FAF7F2", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                {tile.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
