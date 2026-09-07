"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
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

type Item = { key: string; name: string; desc: string };

// Ballons le long de l'arche (viewBox 400×400), du bas-gauche au bas-droite
const ARCH_BALLOONS: { cx: number; cy: number; r: number; c: string }[] = [
  { cx: 27, cy: 388, r: 14, c: "#F4A8B8" }, { cx: 17, cy: 356, r: 9, c: "#FBD5DE" },
  { cx: 34, cy: 338, r: 16, c: "#A8CEE0" }, { cx: 23, cy: 308, r: 11, c: "#FAF7F2" },
  { cx: 40, cy: 286, r: 17, c: "#F0C29A" }, { cx: 29, cy: 260, r: 10, c: "#F4A8B8" },
  { cx: 45, cy: 236, r: 15, c: "#FBD5DE" }, { cx: 37, cy: 210, r: 12, c: "#A8CEE0" },
  { cx: 55, cy: 186, r: 17, c: "#F4A8B8" }, { cx: 47, cy: 160, r: 10, c: "#FAF7F2" },
  { cx: 66, cy: 138, r: 14, c: "#F0C29A" }, { cx: 60, cy: 114, r: 11, c: "#F4A8B8" },
  { cx: 83, cy: 94, r: 16, c: "#FBD5DE" },  { cx: 110, cy: 66, r: 12, c: "#A8CEE0" },
  { cx: 140, cy: 46, r: 18, c: "#F4A8B8" }, { cx: 172, cy: 35, r: 11, c: "#FAF7F2" },
  { cx: 200, cy: 31, r: 16, c: "#F0C29A" }, { cx: 228, cy: 37, r: 13, c: "#F4A8B8" },
  { cx: 258, cy: 49, r: 17, c: "#FBD5DE" }, { cx: 288, cy: 70, r: 12, c: "#A8CEE0" },
  { cx: 312, cy: 98, r: 15, c: "#F4A8B8" }, { cx: 326, cy: 126, r: 12, c: "#F0C29A" },
  { cx: 341, cy: 154, r: 17, c: "#FBD5DE" },{ cx: 332, cy: 182, r: 10, c: "#FAF7F2" },
  { cx: 349, cy: 210, r: 16, c: "#F4A8B8" },{ cx: 340, cy: 238, r: 11, c: "#A8CEE0" },
  { cx: 357, cy: 266, r: 17, c: "#F0C29A" },{ cx: 347, cy: 294, r: 12, c: "#F4A8B8" },
  { cx: 363, cy: 322, r: 14, c: "#FBD5DE" },{ cx: 353, cy: 350, r: 10, c: "#FAF7F2" },
  { cx: 369, cy: 380, r: 15, c: "#F4A8B8" },
];

/* ── Arche — motif signature qui se monte en ballons au scroll ─────────── */
function ArchLine() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      className="absolute pointer-events-none hidden lg:block"
      style={{ top: "6%", right: "-4%", width: "min(34vw, 460px)", overflow: "visible" }}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.path
        d="M20 400 C20 190 100 30 200 30 C300 30 380 190 380 400"
        stroke="rgba(217,98,138,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
        variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
        transition={{ duration: 1.5, ease }}
      />
      <motion.g variants={{ shown: { transition: { staggerChildren: 0.03, delayChildren: 0.35 } } }}>
        {ARCH_BALLOONS.map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={b.c}
            stroke="rgba(13,11,8,0.04)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            variants={{ hidden: { scale: 0, opacity: 0 }, shown: { scale: 1, opacity: 0.42 } }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const items = t.services.index as Item[];
  const total = items.length;
  const [active, setActive] = useState(0);
  const a = items[active];

  return (
    <section
      id="services"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: "#FAF7F2" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.35,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <ArchLine />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* En-tête */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.services.eyebrow}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)", color: "#2A2320" }}
          >
            {t.services.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.services.intro}
          </p>
        </motion.div>

        {/* ── Desktop : liste + photo ── */}
        <div className="hidden lg:grid lg:grid-cols-[0.92fr_1.08fr] gap-16 xl:gap-24 items-center">
          <div>
            <ul>
              {items.map((it, i) => {
                const on = active === i;
                return (
                  <li key={it.key} className="border-t last:border-b" style={{ borderColor: "rgba(42,35,32,0.12)" }}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-center gap-4 py-[1.15rem] text-left cursor-pointer"
                    >
                      <span
                        className="h-px transition-all duration-300"
                        style={{ width: on ? 28 : 12, background: on ? "#D9628A" : "rgba(42,35,32,0.25)" }}
                        aria-hidden
                      />
                      <span
                        className="flex-1 font-serif font-light leading-tight transition-all duration-300"
                        style={{
                          fontSize: "clamp(1.4rem, 2.3vw, 2rem)",
                          color: on ? "#B65572" : "#2A2320",
                          fontStyle: on ? "italic" : "normal",
                        }}
                      >
                        {it.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/nos-services"
              className="group mt-9 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
              style={{ color: "#B65572" }}
            >
              {t.services.ctaAll}
              <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Photo */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "4 / 5",
              boxShadow: "0 40px 80px -34px rgba(120,60,80,0.42), 0 8px 24px rgba(13,11,8,0.06)",
            }}
          >
            <AnimatePresence>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <Image
                  src={INDEX_IMAGES[a.key]}
                  alt={a.name}
                  fill
                  priority={active === 0}
                  className="object-cover"
                  sizes="640px"
                />
              </motion.div>
            </AnimatePresence>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 52%, rgba(13,11,8,0.62) 100%)" }}
            />
            <div className="absolute inset-5 pointer-events-none" style={{ border: "1px solid rgba(250,247,242,0.28)" }} aria-hidden />

            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "rgba(250,247,242,0.6)" }}>
                {String(active + 1).padStart(2, "0")} · {String(total).padStart(2, "0")}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <p className="font-serif font-light italic text-2xl" style={{ color: "#FAF7F2" }}>
                    {a.name}
                  </p>
                  <p className="font-sans font-light text-[13px] leading-relaxed mt-2 max-w-sm" style={{ color: "rgba(250,247,242,0.8)" }}>
                    {a.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Mobile : liste avec vignettes ── */}
        <div className="lg:hidden">
          <ul>
            {items.map((it, i) => (
              <li key={it.key} className="border-t last:border-b" style={{ borderColor: "rgba(42,35,32,0.12)" }}>
                <Link href="/nos-services" className="flex items-center gap-4 py-4">
                  <span className="font-sans text-[11px] tabular-nums" style={{ color: "rgba(42,35,32,0.35)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex-1 font-serif font-light text-[1.35rem] leading-tight"
                    style={{ color: "#2A2320" }}
                  >
                    {it.name}
                  </span>
                  <span className="relative shrink-0 w-14 h-16 overflow-hidden" style={{ background: "#EAD9D3" }}>
                    <Image src={INDEX_IMAGES[it.key]} alt="" fill className="object-cover" sizes="56px" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/nos-services"
            className="group mt-8 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "#B65572" }}
          >
            {t.services.ctaAll}
            <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
