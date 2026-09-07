"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

type Category = "all" | "anniversary" | "baptism" | "babyshower" | "themed" | "corporate" | "creation" | "goodies";

const photos = [
  // ── Anniversaires ──────────────────────────────────────────────────────────
  {
    src: "/Galerie/anniversaires/80BA940E-3E31-4C3E-BD09-5C497C0F78FF.PNG",
    thumb: "/Galerie/anniversaires/80BA940E-3E31-4C3E-BD09-5C497C0F78FF.PNG",
    alt: "Arche ballons violet et or en extérieur",
    name: "Arche Violette Extérieur",
    category: "anniversary" as Category,
    aspectClass: "aspect-[3/4]",
  },
  {
    src: "/Galerie/anniversaires/Anniv_1.webp",
    thumb: "/Galerie/anniversaires/Anniv_1.webp",
    alt: "Arche rose gold Happy Birthday 50",
    name: "Happy Birthday 50",
    category: "anniversary" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "/Galerie/anniversaires/photo-1562967005-a3c85514d3e9.avif",
    thumb: "/Galerie/anniversaires/photo-1562967005-a3c85514d3e9.avif",
    alt: "Sweet table avec ballons bleus et candy bar",
    name: "Sweet Table Candy",
    category: "anniversary" as Category,
    aspectClass: "aspect-[3/2]",
  },
  {
    src: "/Galerie/anniversaires/photo-1741969494307-55394e3e4071.avif",
    thumb: "/Galerie/anniversaires/photo-1741969494307-55394e3e4071.avif",
    alt: "Arche ballons rose avec néon Happy Birthday",
    name: "Arche Rose Néon",
    category: "anniversary" as Category,
    aspectClass: "aspect-[3/2]",
  },
  // ── Baptêmes ───────────────────────────────────────────────────────────────
  {
    src: "/Galerie/Baptemes/Bapteme_1.jpeg",
    thumb: "/Galerie/Baptemes/Bapteme_1.jpeg",
    alt: "Décoration baptême beige et or avec arche ballons",
    name: "Baptême Élégance",
    category: "baptism" as Category,
    aspectClass: "aspect-[3/4]",
  },
  {
    src: "/Galerie/Baptemes/122219_01.jpg",
    thumb: "/Galerie/Baptemes/122219_01.jpg",
    alt: "Arche ronde rose avec guirlande ballons et pampas",
    name: "Arche Ronde Pampas",
    category: "baptism" as Category,
    aspectClass: "aspect-[1/1]",
  },
  {
    src: "/Galerie/Baptemes/Bapteme.jpg",
    thumb: "/Galerie/Baptemes/Bapteme.jpg",
    alt: "Arche dorée avec guirlande ballons rose gold et pampas",
    name: "Arche Dorée Luxe",
    category: "baptism" as Category,
    aspectClass: "aspect-[1/1]",
  },
  {
    src: "/Galerie/Hero/Hero_3.jpg",
    thumb: "/Galerie/Hero/Hero_3.jpg",
    alt: "Installation boho extérieure avec panneaux et ballons",
    name: "Boho Garden",
    category: "baptism" as Category,
    aspectClass: "aspect-[4/3]",
  },
  // ── Baby Shower / Gender Reveal ────────────────────────────────────────────
  {
    src: "/Galerie/Gender-Reveal/GenderReveal_1.webp",
    thumb: "/Galerie/Gender-Reveal/GenderReveal_1.webp",
    alt: "Gender reveal Oh Baby! arche or et beige avec fleurs",
    name: "Oh Baby! Reveal",
    category: "babyshower" as Category,
    aspectClass: "aspect-[1/1]",
  },
  // ── Soirées à thème ────────────────────────────────────────────────────────
  {
    src: "/Galerie/Soiree-a-theme/Soiree_1.avif",
    thumb: "/Galerie/Soiree-a-theme/Soiree_1.avif",
    alt: "Décoration romantique chambre rose gold I Love You",
    name: "Soirée Romantique",
    category: "themed" as Category,
    aspectClass: "aspect-[2/3]",
  },
  {
    src: "/Galerie/Soiree-a-theme/photo-1769038932067-6183daa327ad.avif",
    thumb: "/Galerie/Soiree-a-theme/photo-1769038932067-6183daa327ad.avif",
    alt: "Décoration bride party rose et or",
    name: "Bride Party",
    category: "themed" as Category,
    aspectClass: "aspect-[2/3]",
  },
  {
    src: "/Galerie/Hero/Hero_4.jpg",
    thumb: "/Galerie/Hero/Hero_4.jpg",
    alt: "Bride to Be néon avec guirlande ballons rose",
    name: "Bride to Be",
    category: "themed" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "/Galerie/Hero/Hero_1.avif",
    thumb: "/Galerie/Hero/Hero_1.avif",
    alt: "Décor de fête avec arche de ballons",
    name: "Décor Signature",
    category: "themed" as Category,
    aspectClass: "aspect-[1/1]",
  },
  // ── Corporate ──────────────────────────────────────────────────────────────
  {
    src: "/Galerie/Corporate/Corporate_1.jpg",
    thumb: "/Galerie/Corporate/Corporate_1.jpg",
    alt: "Arche ballons colorée pour événement Disney Crowned",
    name: "Disney Crowned Event",
    category: "corporate" as Category,
    aspectClass: "aspect-[3/4]",
  },
  // ── Créations sur mesure ───────────────────────────────────────────────────
  {
    src: "/Galerie/Creation-sur-mesure/IMG_6343.JPG",
    thumb: "/Galerie/Creation-sur-mesure/IMG_6343.JPG",
    alt: "Composition ballons chiffre 15 rose gold sur mesure",
    name: "Bouquet Chiffre 15",
    category: "creation" as Category,
    aspectClass: "aspect-[2/3]",
  },
  {
    src: "/Galerie/Creation-sur-mesure/IMG_6345.WEBP",
    thumb: "/Galerie/Creation-sur-mesure/IMG_6345.WEBP",
    alt: "Composition ballons chiffre 30 rose gold",
    name: "Bouquet Chiffre 30",
    category: "creation" as Category,
    aspectClass: "aspect-[2/3]",
  },
  {
    src: "/Galerie/Hero/Hero_2.jpg",
    thumb: "/Galerie/Hero/Hero_2.jpg",
    alt: "Guirlande ballons or et noir dans un restaurant",
    name: "Déco Restaurant Or",
    category: "creation" as Category,
    aspectClass: "aspect-[4/3]",
  },
  // ── Goodies ────────────────────────────────────────────────────────────────
  {
    src: "/Galerie/goodies/Goodies_1.jpg",
    thumb: "/Galerie/goodies/Goodies_1.jpg",
    alt: "Porte-clés personnalisés avec croix et perles",
    name: "Porte-clés Baptême",
    category: "goodies" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "/Galerie/goodies/Goodies_3.PNG",
    thumb: "/Galerie/goodies/Goodies_3.PNG",
    alt: "Pochette souvenir personnalisée avec ballon bulle",
    name: "Pochette Souvenir",
    category: "goodies" as Category,
    aspectClass: "aspect-[2/3]",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function Lightbox({
  photos: allPhotos,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  photos: typeof photos;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = allPhotos[activeIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
      style={{ background: "rgba(13,11,8,0.95)" }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={photo.name}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.28, ease }}
        className="relative max-w-4xl w-full"
        style={{ height: "min(80dvh, 660px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={photo.src} alt={photo.alt} fill className="object-contain" priority sizes="90vw" />
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-5 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(13,11,8,0.9), transparent)" }}
        >
          <p className="font-serif text-xl" style={{ color: "#FAF7F2" }}>{photo.name}</p>
          <p className="font-sans text-xs mt-0.5" style={{ color: "rgba(250,247,242,0.4)" }}>
            {activeIndex + 1} / {allPhotos.length}
          </p>
        </div>
      </motion.div>

      {[
        { onClick: (e: React.MouseEvent) => { e.stopPropagation(); onPrev(); }, icon: <ArrowLeft size={18} />, label: "Photo précédente", pos: "left-3 md:left-6" },
        { onClick: (e: React.MouseEvent) => { e.stopPropagation(); onNext(); }, icon: <ArrowRight size={18} />, label: "Photo suivante", pos: "right-3 md:right-6" },
      ].map(({ onClick, icon, label, pos }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer`}
          style={{ background: "rgba(250,247,242,0.08)", color: "#FAF7F2" }}
        >
          {icon}
        </button>
      ))}

      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        style={{ background: "rgba(250,247,242,0.08)", color: "#FAF7F2" }}
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

const FILTERS: { key: Category; labelKey: keyof ReturnType<typeof useI18n>["t"]["realisations"]["filters"] }[] = [
  { key: "all", labelKey: "all" },
  { key: "anniversary", labelKey: "anniversary" },
  { key: "baptism", labelKey: "baptism" },
  { key: "babyshower", labelKey: "babyshower" },
  { key: "themed", labelKey: "themed" },
  { key: "corporate", labelKey: "corporate" },
  { key: "creation", labelKey: "creation" },
  { key: "goodies", labelKey: "goodies" },
];

export function Realisations({ preview = false }: { preview?: boolean }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Category>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = preview
    ? photos.slice(0, 6)
    : active === "all"
      ? photos
      : photos.filter((p) => p.category === active);

  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => setLightboxIndex((i) => i === null ? 0 : (i + 1) % filtered.length);
  const goPrev = () => setLightboxIndex((i) => i === null ? 0 : (i - 1 + filtered.length) % filtered.length);

  return (
    <section id="realisations" className="py-20 lg:py-24" style={{ background: "#F3EDE6" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#D9628A" }}>
            {t.realisations.eyebrow}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#0D0B08" }}
            >
              {t.realisations.title}
            </h2>
            <p className="font-sans text-sm max-w-xs leading-relaxed lg:text-right" style={{ color: "rgba(13,11,8,0.55)" }}>
              {t.realisations.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Category filters */}
        {!preview && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTERS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="font-sans text-sm px-4 py-2 rounded-full transition-all duration-250 cursor-pointer"
              style={{
                background: active === key ? "#D9628A" : "transparent",
                color: active === key ? "#0D0B08" : "rgba(13,11,8,0.55)",
                border: active === key ? "1px solid #D9628A" : "1px solid rgba(13,11,8,0.18)",
                fontWeight: active === key ? 500 : 300,
              }}
            >
              {t.realisations.filters[labelKey]}
            </button>
          ))}
        </motion.div>
        )}

        {/* Masonry grid */}
        <AnimatePresence mode="popLayout">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
            {filtered.map((photo, i) => (
              <motion.button
                key={photo.src}
                layout
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease }}
                onClick={() => setLightboxIndex(i)}
                className="break-inside-avoid mb-3 group relative overflow-hidden cursor-pointer block w-full text-left focus-visible:outline-2"
                style={{ borderRadius: 14 }}
                aria-label={`Voir ${photo.name}`}
              >
                <div className={`relative w-full ${photo.aspectClass}`} style={{ background: "#C8B4A8" }}>
                  <Image
                    src={photo.thumb}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-350 flex flex-col justify-end p-4 md:p-5"
                    style={{ background: "linear-gradient(to top, rgba(13,11,8,0.78) 0%, rgba(13,11,8,0.1) 60%, transparent 100%)" }}
                  >
                    <p
                      className="font-sans text-[10px] uppercase tracking-[0.18em] mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                      style={{ color: "#F4A8B8", transitionDelay: "0.04s" }}
                    >
                      {photo.category}
                    </p>
                    <p
                      className="font-serif text-lg translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                      style={{ color: "#FAF7F2", transitionDelay: "0.06s" }}
                    >
                      {photo.name}
                    </p>
                  </div>
                  {/* Border reveal */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ border: "1px solid rgba(217,98,138,0.4)", borderRadius: 14 }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </AnimatePresence>

        {preview && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/galerie"
              className="btn-gold-shimmer font-sans text-[13px] font-medium px-8 py-3.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#0D0B08" }}
            >
              {t.realisations.ctaAll}
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filtered}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
