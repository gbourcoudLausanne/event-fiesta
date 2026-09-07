"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const INDEX_IMAGES: Record<string, string> = {
  mariage:      "/Galerie/hero-slides/hero-slide-7.jpeg",
  anniversaire: "/Galerie/anniversaires/Anniv_1.webp",
  babyshower:   "/Galerie/hero-slides/hero-slide-2.PNG",
  genderreveal: "/Galerie/Gender-Reveal/GenderReveal_1.webp",
  bapteme:      "/Galerie/Baptemes/Bapteme.jpg",
  piquenique:   "/Galerie/hero-slides/hero-slide-17.webp",
  surmesure:    "/Galerie/Creation-sur-mesure/IMG_6343.JPG",
  entreprise:   "/Galerie/Corporate/Corporate_1.jpg",
};

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const items = t.services.index;
  const [active, setActive] = useState(0);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-20 lg:py-24"
      style={{ background: "#FAF7F2" }}
    >
      {/* Arche — motif signature en filet */}
      <svg
        className="absolute pointer-events-none hidden lg:block"
        style={{ top: "12%", right: "-6%", width: "min(46vw, 620px)" }}
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
      >
        <path
          d="M20 400 C20 190 100 30 200 30 C300 30 380 190 380 400"
          stroke="rgba(217,98,138,0.14)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 lg:mb-16 max-w-2xl"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#D9628A" }}>
            {t.services.eyebrow}
          </p>
          <h2
            className="font-serif font-light leading-tight"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: "#0D0B08" }}
          >
            {t.services.title}
          </h2>
          <p
            className="font-sans font-light text-[15px] leading-relaxed mt-5"
            style={{ color: "rgba(13,11,8,0.55)" }}
          >
            {t.services.intro}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-16 items-start">
          {/* ── Index ── */}
          <ul>
            {items.map((it, i) => {
              const on = active === i;
              return (
                <li
                  key={it.key}
                  onMouseEnter={() => setActive(i)}
                  className="border-t last:border-b"
                  style={{ borderColor: "rgba(13,11,8,0.12)" }}
                >
                  <Link
                    href="/nos-services"
                    className="group flex items-start gap-4 lg:gap-7 py-6 lg:py-7"
                    onFocus={() => setActive(i)}
                  >
                    <span
                      className="font-sans text-[12px] tabular-nums pt-1.5 transition-colors duration-300"
                      style={{ color: on ? "#D9628A" : "rgba(13,11,8,0.32)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-serif font-light leading-tight transition-all duration-300"
                        style={{
                          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                          color: on ? "#B65572" : "#0D0B08",
                          fontStyle: on ? "italic" : "normal",
                        }}
                      >
                        {it.name}
                      </h3>
                      <p
                        className="font-sans font-light text-[13.5px] leading-relaxed mt-2.5 max-w-md"
                        style={{ color: "rgba(13,11,8,0.55)" }}
                      >
                        {it.desc}
                      </p>
                    </div>

                    {/* Vignette mobile */}
                    <div
                      className="lg:hidden relative shrink-0 w-16 h-20 overflow-hidden"
                      style={{ background: "#EAD9D3" }}
                    >
                      <Image
                        src={INDEX_IMAGES[it.key]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="hidden lg:block shrink-0 mt-2 transition-all duration-300"
                      style={{
                        color: "#B65572",
                        opacity: on ? 1 : 0,
                        transform: on ? "translate(0,0)" : "translate(-4px,4px)",
                      }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Aperçu sticky (desktop) ── */}
          <div className="hidden lg:block lg:sticky lg:top-28">
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 40px 80px -30px rgba(120,60,80,0.5), 0 10px 30px rgba(13,11,8,0.08)",
              }}
            >
              <AnimatePresence>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <Image
                    src={INDEX_IMAGES[items[active].key]}
                    alt={items[active].name}
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                </motion.div>
              </AnimatePresence>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 55%, rgba(13,11,8,0.6) 100%)" }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.22em] mb-1"
                  style={{ color: "rgba(250,247,242,0.7)" }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>
                <p className="font-serif italic text-xl" style={{ color: "#FAF7F2" }}>
                  {items[active].name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mt-12 lg:mt-14"
        >
          <Link
            href="/nos-services"
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#0D0B08" }}
          >
            {t.services.ctaAll}
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
