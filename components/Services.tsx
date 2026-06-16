"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const serviceImages: Record<string, string> = {
  anniversary:
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
  baptism:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=80",
  babyshower:
    "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=700&q=80",
  themed:
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
  communion:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=80",
  genderreveal:
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=700&q=80",
  corporate:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
};

/* Bento config: [colSpan, rowSpan, minH] */
const BENTO: Record<string, { col: string; minH: number }> = {
  anniversary: { col: "md:col-span-2", minH: 340 },
  baptism:     { col: "md:col-span-1", minH: 340 },
  babyshower:  { col: "md:col-span-1", minH: 270 },
  themed:      { col: "md:col-span-1", minH: 270 },
  communion:   { col: "md:col-span-1", minH: 270 },
  genderreveal:{ col: "md:col-span-1", minH: 310 },
  corporate:   { col: "md:col-span-2", minH: 310 },
};

function ServiceCard({
  item,
  index,
  minH,
}: {
  item: { key: string; title: string; desc: string };
  index: number;
  minH: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay: index * 0.07, ease }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        minHeight: minH,
        background: "#0D0B08",
        boxShadow: "0 4px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Image
        src={serviceImages[item.key]}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,11,8,0.08) 0%, rgba(13,11,8,0.45) 55%, rgba(13,11,8,0.92) 100%)",
        }}
      />

      {/* Gold border reveal on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: "1px solid rgba(176,139,58,0.5)" }}
      />

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: "linear-gradient(90deg, #B08B3A, #C9A84C, #B08B3A)" }}
      />

      {/* Numbered tag — top left, always visible */}
      <div className="absolute top-4 left-5 flex items-center gap-2">
        <span
          className="font-sans font-medium"
          style={{ color: "rgba(201,168,76,0.8)", fontSize: 11, letterSpacing: "0.1em" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="w-4 h-px" style={{ background: "rgba(201,168,76,0.35)" }} aria-hidden />
        <span
          className="font-sans uppercase"
          style={{ color: "rgba(201,168,76,0.5)", fontSize: 10, letterSpacing: "0.18em" }}
        >
          {item.title}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
        <h3
          className="font-serif font-light text-xl lg:text-2xl leading-tight"
          style={{ color: "#FAF7F2" }}
        >
          {item.title}
        </h3>
        <p
          className="font-sans text-sm leading-relaxed mt-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 max-w-xs"
          style={{ color: "rgba(250,247,242,0.65)", transitionDelay: "0.04s" }}
        >
          {item.desc}
        </p>
      </div>

      {/* Corner arrow on hover */}
      <div
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
        style={{ background: "rgba(176,139,58,0.25)", border: "1px solid rgba(176,139,58,0.4)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section id="services" className="py-24 lg:py-32" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 lg:mb-16"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#B08B3A" }}>
            {t.services.eyebrow}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#0D0B08" }}
            >
              {t.services.title}
            </h2>
            <p className="font-sans text-sm max-w-xs leading-relaxed" style={{ color: "rgba(13,11,8,0.45)" }}>
              Chaque célébration mérite une décoration unique,<br className="hidden lg:block" /> pensée dans les moindres détails.
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {t.services.items.map((item, i) => {
            const cfg = BENTO[item.key];
            return (
              <div key={item.key} className={`${cfg.col}`}>
                <ServiceCard item={item} index={i} minH={cfg.minH} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
