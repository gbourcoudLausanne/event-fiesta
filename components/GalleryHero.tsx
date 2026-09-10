"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const cardStack: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease } },
};

const WALL = [
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
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative w-full overflow-hidden pt-[68px]" style={{ background: "#231017" }}>
      <div className="relative">
        {/* Mur de tuiles */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: "2px" }}
          onMouseLeave={() => setHovered(null)}
        >
          {WALL.map((tile, i) => (
            <motion.a
              key={tile.src}
              href="#realisations"
              onMouseEnter={() => setHovered(i)}
              className={`group relative block overflow-hidden ${
                i >= 9 ? "hidden lg:block" : i >= 6 ? "hidden sm:block" : ""
              }`}
              style={{ aspectRatio: "4 / 3" }}
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      scale: hovered === i ? 1.05 : hovered !== null ? 0.985 : 1,
                      filter:
                        hovered === i
                          ? "brightness(1.08)"
                          : hovered !== null
                            ? "brightness(0.42)"
                            : "brightness(0.92)",
                      zIndex: hovered === i ? 10 : 1,
                    }
              }
              transition={{
                opacity: { duration: 0.6, delay: 0.05 + i * 0.04, ease },
                scale: { duration: 0.4, ease },
                filter: { duration: 0.4, ease },
              }}
            >
              <Image
                src={tile.src}
                alt=""
                fill
                priority={i < 4}
                className="object-cover"
                style={{ objectPosition: "center 38%" }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

        {/* Voile pour lier le panneau */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(100deg, rgba(35,16,23,0.55) 0%, rgba(35,16,23,0.15) 38%, transparent 60%)",
          }}
          aria-hidden
        />

        {/* Panneau texte */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -28, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.2, ease }}
              whileHover={reduce ? undefined : { y: -5 }}
              className="group pointer-events-auto relative max-w-[440px] overflow-hidden rounded-[6px] p-8 sm:p-11 lg:p-14"
              style={{
                background: "rgba(250,247,242,0.86)",
                backdropFilter: "blur(26px)",
                WebkitBackdropFilter: "blur(26px)",
                boxShadow: "0 60px 130px -48px rgba(0,0,0,0.58)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {/* Accent rose qui grandit */}
              <motion.span
                className="absolute left-0 top-10 bottom-10 w-[3px] origin-top"
                style={{ background: "linear-gradient(#F2879E, #C24B72)" }}
                initial={reduce ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, delay: 0.55, ease }}
                aria-hidden
              />
              {/* Halo qui suit au survol */}
              <div
                className="pointer-events-none absolute -inset-px rounded-[6px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: "inset 0 0 0 1px rgba(217,98,138,0.4)" }}
                aria-hidden
              />

              <motion.div
                variants={reduce ? undefined : cardStack}
                initial={reduce ? false : "hidden"}
                animate={reduce ? undefined : "visible"}
              >
                <motion.div variants={reduce ? undefined : cardItem} className="mb-6">
                  <svg width="48" height="30" viewBox="0 0 48 30" fill="none" aria-hidden>
                    <motion.path
                      d="M4 28 C 4 6 44 6 44 28"
                      stroke="#D9628A"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      initial={reduce ? undefined : { pathLength: 0 }}
                      animate={reduce ? undefined : { pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.7, ease }}
                    />
                    <circle cx="4" cy="28" r="3" fill="#D9628A" />
                    <circle cx="24" cy="5" r="3" fill="#D9628A" />
                    <circle cx="44" cy="28" r="3" fill="#D9628A" />
                  </svg>
                </motion.div>

                <motion.div
                  variants={reduce ? undefined : cardItem}
                  className="mb-5 flex items-center gap-3"
                >
                  <span className="h-px w-10" style={{ background: "#D9628A" }} />
                  <span
                    className="font-sans text-[10px] uppercase tracking-[0.32em]"
                    style={{ color: "#B65572" }}
                  >
                    {t.realisations.heroEyebrow}
                  </span>
                </motion.div>

                <motion.h1
                  variants={reduce ? undefined : cardItem}
                  className="font-serif font-light leading-[1.07] tracking-tight"
                  style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", color: "#2A2320" }}
                >
                  {t.realisations.heroTitle}
                </motion.h1>

                <motion.p
                  variants={reduce ? undefined : cardItem}
                  className="mt-5 font-sans font-light text-[14px] leading-relaxed"
                  style={{ color: "rgba(42,35,32,0.6)" }}
                >
                  {t.realisations.heroText}
                </motion.p>

                <motion.div
                  variants={reduce ? undefined : cardItem}
                  className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
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
      </div>
    </section>
  );
}
