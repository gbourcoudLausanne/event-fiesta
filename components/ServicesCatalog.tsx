"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PHOTOS: Record<string, string> = {
  // Particuliers
  mariage: "/Galerie/hero-slides/hero-slide-11.webp",
  anniversaire: "/Galerie/hero-slides/hero-slide-9.webp",
  babyshower: "/Galerie/hero-slides/hero-slide-1.webp",
  genderreveal: "/Galerie/Gender-Reveal/GenderReveal_2.webp",
  bapteme: "/Galerie/hero-slides/hero-slide-16.webp",
  piquenique: "/Galerie/hero-slides/hero-slide-17.webp",
  theme: "/Galerie/Hero/Hero_4.webp",
  surmesure: "/Galerie/hero-slides/hero-slide-8.webp",
  goodies: "/Galerie/goodies/Goodies_1.webp",
  // Professionnels
  corporate: "/Galerie/Corporate/Corporate_1.webp",
  yearend: "/Galerie/hero-slides/hero-slide-10.webp",
  launch: "/Galerie/hero-slides/hero-slide-3.webp",
  gala: "/Galerie/hero-slides/hero-slide-12.webp",
  opening: "/Galerie/hero-slides/hero-slide-6.webp",
};

type Row = { key: string; name: string; detail: string; elements: readonly string[] };

function ServiceRow({ row, index }: { row: Row; index: number }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const flip = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  const photo = PHOTOS[row.key];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease }}
      className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      {/* Photo */}
      <div className={`relative ${flip ? "lg:order-2" : ""}`}>
        <div
          className="group relative overflow-hidden rounded-[20px]"
          style={{
            aspectRatio: "4 / 3",
            border: "1px solid rgba(42,35,32,0.08)",
            boxShadow: "0 30px 60px -34px rgba(120,60,80,0.4)",
          }}
        >
          {photo && (
            <Image
              src={photo}
              alt={row.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-3 font-display italic leading-none"
            style={{ fontSize: "2.4rem", color: "rgba(250,247,242,0.9)", textShadow: "0 2px 12px rgba(13,11,8,0.35)" }}
          >
            {num}
          </span>
        </div>
      </div>

      {/* Texte */}
      <div className={flip ? "lg:order-1" : ""}>
        <h3
          className="font-serif font-light leading-[1.12] tracking-tight"
          style={{ fontSize: "clamp(1.7rem, 3.1vw, 2.5rem)", color: "#2A2320" }}
        >
          {row.name}
        </h3>
        <p
          className="mt-4 font-sans font-light leading-relaxed"
          style={{ fontSize: "14.5px", color: "rgba(42,35,32,0.62)" }}
        >
          {row.detail}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {row.elements.map((el) => (
            <li
              key={el}
              className="font-sans text-[10.5px] uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
              style={{ background: "rgba(217,98,138,0.08)", color: "#B0546F" }}
            >
              {el}
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="group mt-6 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "#B65572" }}
        >
          {t.services.discuss}
          <ArrowUpRight
            size={13}
            weight="bold"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.div>
  );
}

function CategoryBlock({
  label,
  title,
  desc,
  rows,
  bg,
  footer,
}: {
  label: string;
  title: string;
  desc: string;
  rows: Row[];
  bg: string;
  footer?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: bg }}>
      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 lg:mb-20 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "#B65572" }}
            >
              {label}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", color: "#2A2320" }}
          >
            {title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {desc}
          </p>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {rows.map((row, i) => (
            <ServiceRow key={row.key} row={row} index={i} />
          ))}
        </div>

        {footer}
      </div>
    </section>
  );
}

export function ServicesCatalog() {
  const { t } = useI18n();

  const particuliers: Row[] = t.services.index
    .filter((i) => i.key !== "entreprise")
    .map((i) => ({ key: i.key, name: i.name, detail: i.detail, elements: i.elements }));

  const professionnels: Row[] = t.services.proItems.map((p) => ({
    key: p.key,
    name: p.title,
    detail: p.detail,
    elements: p.elements,
  }));

  return (
    <>
      <CategoryBlock
        label={t.services.particuliers.label}
        title={t.services.particuliers.title}
        desc={t.services.particuliers.desc}
        rows={particuliers}
        bg="#FAF7F2"
        footer={
          <Link
            href="/galerie"
            className="group mt-16 lg:mt-20 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "#B65572" }}
          >
            {t.realisations.ctaAll}
            <ArrowRight
              size={13}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        }
      />
      <CategoryBlock
        label={t.services.professionnels.label}
        title={t.services.professionnels.title}
        desc={t.services.professionnels.desc}
        rows={professionnels}
        bg="#F3EDE6"
      />
    </>
  );
}
