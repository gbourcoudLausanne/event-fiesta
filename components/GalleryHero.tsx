"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PHOTOS = [
  "/Galerie/hero-slides/hero-slide-8.webp",
  "/Galerie/hero-slides/hero-slide-13.webp",
  "/Galerie/hero-slides/hero-slide-2.webp",
];

export function GalleryHero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % PHOTOS.length), 5600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="relative overflow-hidden pt-[68px]" style={{ background: "#2A1A20" }}>
      <div className="relative h-[74vh] min-h-[500px] lg:h-[84vh]">
        {PHOTOS.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === idx ? 1 : 0 }}
            transition={{ duration: 1.4, ease }}
          >
            <div
              className="absolute inset-0"
              style={
                reduce
                  ? undefined
                  : { animation: `kenburns ${11 + i * 2}s ease-in-out infinite alternate` }
              }
            >
              <Image
                src={src}
                alt=""
                fill
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: "center 36%" }}
                sizes="100vw"
              />
            </div>
          </motion.div>
        ))}

        {/* Voile */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(24,12,18,0.8) 0%, rgba(24,12,18,0.12) 44%, rgba(24,12,18,0.34) 100%)",
          }}
          aria-hidden
        />

        {/* Contenu */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-12 lg:pb-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-px" style={{ background: "rgba(250,247,242,0.6)" }} />
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.34em]"
                  style={{ color: "rgba(250,247,242,0.82)" }}
                >
                  {t.realisations.heroEyebrow}
                </span>
              </div>
              <h1
                className="font-serif font-normal uppercase leading-[1.12] tracking-[0.015em]"
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 3.6rem)",
                  color: "#FAF7F2",
                  textShadow: "0 2px 34px rgba(0,0,0,0.45)",
                }}
              >
                {t.realisations.heroTitle}
              </h1>
              <p
                className="mt-5 max-w-lg font-sans font-light text-[14.5px] leading-relaxed"
                style={{ color: "rgba(250,247,242,0.86)", textShadow: "0 1px 18px rgba(0,0,0,0.4)" }}
              >
                {t.realisations.heroText}
              </p>
              <Link
                href="/contact"
                className="btn-gold-shimmer mt-8 inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: "#FAF7F2", color: "#B0546F" }}
              >
                {t.realisations.heroCta}
                <ArrowRight size={14} weight="bold" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Indicateurs */}
        <div className="absolute bottom-6 right-6 lg:right-10 flex gap-2">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Photo ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 22 : 7,
                height: 7,
                background: i === idx ? "#FAF7F2" : "rgba(250,247,242,0.42)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
