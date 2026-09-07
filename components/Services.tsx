"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;
const EXPAND = "cubic-bezier(0.16, 1, 0.3, 1)";

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

type Item = { key: string; name: string; desc: string };

function ExpandedContent({ it, i, total }: { it: Item; i: number; total: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
      <p
        className="font-sans text-[11px] uppercase tracking-[0.22em] mb-2"
        style={{ color: "rgba(250,247,242,0.6)" }}
      >
        {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h3
        className="font-serif font-light italic leading-[1.05]"
        style={{ fontSize: "clamp(1.9rem, 3.3vw, 3.1rem)", color: "#FAF7F2" }}
      >
        {it.name}
      </h3>
      <p
        className="font-sans font-light text-[13.5px] leading-relaxed mt-2.5 max-w-md"
        style={{ color: "rgba(250,247,242,0.82)" }}
      >
        {it.desc}
      </p>
      <span
        className="mt-4 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em]"
        style={{ color: "#FAF7F2" }}
      >
        Découvrir
        <ArrowUpRight
          size={13}
          weight="bold"
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </div>
  );
}

function SectionHeader() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease }}
      className="max-w-2xl"
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
        className="font-sans font-light text-[14.5px] leading-relaxed mt-4"
        style={{ color: "rgba(13,11,8,0.55)" }}
      >
        {t.services.intro}
      </p>
    </motion.div>
  );
}

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const items = t.services.index as Item[];
  const total = items.length;
  const [active, setActive] = useState(0);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 lg:py-20"
      style={{ background: "#FAF7F2" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8 lg:mb-12">
        <SectionHeader />
      </div>

      {/* ── Lamelles horizontales (desktop) ── */}
      <div className="hidden lg:flex h-[82vh] w-full gap-[3px] px-3">
        {items.map((it, i) => {
          const on = active === i;
          return (
            <Link
              key={it.key}
              href="/nos-services"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={it.name}
              className="group relative block min-w-0 overflow-hidden"
              style={{
                flexGrow: on ? 9 : 1,
                flexBasis: 0,
                transition: `flex-grow 0.65s ${EXPAND}`,
              }}
            >
              <Image
                src={INDEX_IMAGES[it.key]}
                alt={it.name}
                fill
                priority={i < 2}
                className="object-cover"
                style={{
                  transform: reduce ? undefined : on ? "scale(1)" : "scale(1.22)",
                  transition: `transform 0.9s ${EXPAND}`,
                }}
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(13,11,8,0.12) 0%, rgba(13,11,8,0) 34%, rgba(13,11,8,0.82) 100%)" }}
              />

              {/* Numéro (haut) */}
              <span
                className="absolute top-0 left-0 p-4 lg:p-6 font-serif font-light leading-none"
                style={{
                  fontSize: on ? "clamp(2.4rem, 3.6vw, 4.2rem)" : "1.2rem",
                  color: "rgba(250,247,242,0.9)",
                  transition: `font-size 0.5s ${EXPAND}`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Nom vertical (compressé) */}
              <span
                className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif font-light text-[15px] tracking-wide transition-opacity duration-300"
                style={{
                  writingMode: "vertical-rl",
                  color: "rgba(250,247,242,0.92)",
                  opacity: on ? 0 : 1,
                }}
              >
                {it.name}
              </span>

              {/* Contenu déployé */}
              <div
                className="transition-opacity duration-300"
                style={{ opacity: on ? 1 : 0, transitionDelay: on ? "0.18s" : "0s" }}
              >
                <ExpandedContent it={it} i={i} total={total} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Accordéon vertical (mobile) ── */}
      <div className="lg:hidden flex flex-col gap-[3px] px-3">
        {items.map((it, i) => {
          const on = active === i;
          return (
            <Link
              key={it.key}
              href="/nos-services"
              onClick={(e) => {
                if (!on) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              aria-label={it.name}
              className="group relative block overflow-hidden"
              style={{
                height: on ? "56vh" : "72px",
                transition: `height 0.5s ${EXPAND}`,
              }}
            >
              <Image
                src={INDEX_IMAGES[it.key]}
                alt={it.name}
                fill
                className="object-cover"
                style={{ transform: reduce ? undefined : on ? "scale(1)" : "scale(1.08)" }}
                sizes="100vw"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(13,11,8,0.3) 0%, rgba(13,11,8,0) 40%, rgba(13,11,8,0.8) 100%)" }}
              />

              {on ? (
                <ExpandedContent it={it} i={i} total={total} />
              ) : (
                <div className="absolute inset-0 flex items-center gap-4 px-5">
                  <span
                    className="font-sans text-[11px] tabular-nums"
                    style={{ color: "rgba(250,247,242,0.6)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-serif font-light italic text-lg"
                    style={{ color: "#FAF7F2" }}
                  >
                    {it.name}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 lg:mt-12">
        <Link
          href="/nos-services"
          className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
          style={{ background: "#D9628A", color: "#0D0B08" }}
        >
          {t.services.ctaAll}
          <ArrowUpRight size={14} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
