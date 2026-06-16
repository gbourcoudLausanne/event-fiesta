"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

type Category = "all" | "anniversary" | "baptism" | "babyshower" | "themed" | "corporate";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=75",
    alt: "Ballons colorés pour anniversaire",
    name: "Anniversaire Coloré",
    category: "anniversary" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75",
    alt: "Table décorée pour réception élégante",
    name: "Réception Dorée",
    category: "corporate" as Category,
    aspectClass: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=700&q=75",
    alt: "Baby shower décoration pastel",
    name: "Baby Shower Doux",
    category: "babyshower" as Category,
    aspectClass: "aspect-[7/5]",
  },
  {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=75",
    alt: "Ambiance de fête festive",
    name: "Soirée Festive",
    category: "themed" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=75",
    alt: "Décoration florale élégante",
    name: "Florale Romantique",
    category: "baptism" as Category,
    aspectClass: "aspect-[6/7]",
  },
  {
    src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=700&q=75",
    alt: "Ballons colorés pour événement",
    name: "Sweet 16",
    category: "anniversary" as Category,
    aspectClass: "aspect-[16/10]",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=75",
    alt: "Gala d'entreprise élégant",
    name: "Gala Prestige",
    category: "corporate" as Category,
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1471967183320-ee018f6e114a?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1471967183320-ee018f6e114a?auto=format&fit=crop&w=700&q=75",
    alt: "Décoration de fête d'anniversaire",
    name: "Garden Party",
    category: "anniversary" as Category,
    aspectClass: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=75",
    alt: "Décoration baptême élégante",
    name: "Baptême Lumière",
    category: "baptism" as Category,
    aspectClass: "aspect-[4/3]",
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
];

export function Realisations() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Category>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active === "all" ? photos : photos.filter((p) => p.category === active);

  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => setLightboxIndex((i) => i === null ? 0 : (i + 1) % filtered.length);
  const goPrev = () => setLightboxIndex((i) => i === null ? 0 : (i - 1 + filtered.length) % filtered.length);

  return (
    <section id="realisations" className="py-24 lg:py-32" style={{ background: "#080605" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#B08B3A" }}>
            {t.realisations.eyebrow}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#FAF7F2" }}
            >
              {t.realisations.title}
            </h2>
            <p className="font-sans text-sm max-w-xs leading-relaxed lg:text-right" style={{ color: "rgba(250,247,242,0.38)" }}>
              {t.realisations.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Category filters */}
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
                background: active === key ? "#B08B3A" : "transparent",
                color: active === key ? "#080605" : "rgba(250,247,242,0.45)",
                border: active === key ? "1px solid #B08B3A" : "1px solid rgba(250,247,242,0.15)",
                fontWeight: active === key ? 500 : 300,
              }}
            >
              {t.realisations.filters[labelKey]}
            </button>
          ))}
        </motion.div>

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
                      style={{ color: "#C9A84C", transitionDelay: "0.04s" }}
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
                    style={{ border: "1px solid rgba(176,139,58,0.4)", borderRadius: 14 }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </AnimatePresence>
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
