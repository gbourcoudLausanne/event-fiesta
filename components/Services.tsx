"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const serviceImages: Record<string, string> = {
  anniversary:  "/Galerie/anniversaires/80BA940E-3E31-4C3E-BD09-5C497C0F78FF.PNG",
  baptism:      "/Galerie/Baptemes/Bapteme_1.jpeg",
  babyshower:   "/Galerie/anniversaires/Anniv_1.webp",
  themed:       "/Galerie/Soiree-a-theme/Soiree_1.avif",
  communion:    "/Galerie/Baptemes/122219_01.jpg",
  genderreveal: "/Galerie/Gender-Reveal/GenderReveal_1.webp",
  corporate:    "/Galerie/Corporate/Corporate_1.jpg",
  creation:     "/Galerie/Creation-sur-mesure/IMG_6343.JPG",
  goodies:      "/Galerie/goodies/Goodies_1.jpg",
};

function ServiceCard({
  item,
  index,
}: {
  item: { key: string; title: string; desc: string };
  index: number;
}) {
  const reduce = useReducedMotion();
  const img = serviceImages[item.key];
  if (!img) return null;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease }}
    >
      <Link
        href="/nos-services"
        className="group relative block overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4 / 5", boxShadow: "0 6px 24px rgba(13,11,8,0.08)" }}
      >
        <Image
          src={img}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 42%, rgba(13,11,8,0.72) 100%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <h3
            className="font-serif font-light leading-tight text-xl lg:text-2xl"
            style={{ color: "#FAF7F2" }}
          >
            {item.title}
          </h3>
          <span
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
            style={{ background: "rgba(250,247,242,0.16)", border: "1px solid rgba(250,247,242,0.3)" }}
            aria-hidden
          >
            <ArrowUpRight size={14} color="#FAF7F2" weight="bold" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function Services({ preview = false }: { preview?: boolean }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const items = preview ? t.services.items.slice(0, 6) : t.services.items;

  return (
    <section id="services" className="py-20 lg:py-24" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 lg:mb-14 max-w-2xl"
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

        {/* Grille uniforme de cartes photo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <ServiceCard key={item.key} item={item} index={i} />
          ))}
        </div>

        {preview && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mt-12 flex justify-center"
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
        )}
      </div>
    </section>
  );
}
