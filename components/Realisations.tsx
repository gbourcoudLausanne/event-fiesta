"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const photos = [
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=75",
    alt: "Ballons colorés pour anniversaire",
    name: "Anniversaire Coloré",
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=75",
    alt: "Table décorée pour réception élégante",
    name: "Réception Dorée",
    aspectClass: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=700&q=75",
    alt: "Baby shower décoration pastel",
    name: "Baby Shower Doux",
    aspectClass: "aspect-[7/5]",
  },
  {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=75",
    alt: "Ambiance de fête festive",
    name: "Soirée Festive",
    aspectClass: "aspect-[4/3]",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=700&q=75",
    alt: "Décoration florale élégante",
    name: "Florale Romantique",
    aspectClass: "aspect-[6/7]",
  },
  {
    src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1200&q=85",
    thumb:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=700&q=75",
    alt: "Ballons colorés pour événement",
    name: "Gala Prestige",
    aspectClass: "aspect-[16/10]",
  },
];

const lb_ease = [0.16, 1, 0.3, 1] as const;

function Lightbox({
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[activeIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 bg-noir/93 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal={true}
      aria-label={photo.name}
    >
      {/* Image panel */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: lb_ease }}
        className="relative max-w-4xl w-full"
        style={{ height: "min(78dvh, 640px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-noir/80 to-transparent px-5 py-4 pointer-events-none">
          <p className="font-serif text-xl text-creme">{photo.name}</p>
          <p className="font-sans text-xs text-creme/50 mt-0.5">
            {activeIndex + 1} / {photos.length}
          </p>
        </div>
      </motion.div>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-creme/10 hover:bg-creme/20 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Photo précédente"
      >
        <ArrowLeft size={18} className="text-creme" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-creme/10 hover:bg-creme/20 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Photo suivante"
      >
        <ArrowRight size={18} className="text-creme" />
      </button>

      {/* Close */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 md:top-5 md:right-6 w-9 h-9 rounded-full bg-creme/10 hover:bg-creme/20 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Fermer"
      >
        <X size={16} className="text-creme" />
      </button>
    </motion.div>
  );
}

export function Realisations() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : (i + 1) % photos.length
    );
  const goPrev = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + photos.length) % photos.length
    );

  return (
    <section id="realisations" className="bg-creme py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-4"
        >
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-[#7a6025] mb-4">
            {t.realisations.eyebrow}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-noir leading-tight">
              {t.realisations.title}
            </h2>
            <p className="font-sans text-sm text-noir/50 max-w-xs leading-relaxed lg:text-right">
              {t.realisations.subtitle}
            </p>
          </div>
        </motion.div>

        <div className="mt-12 lg:mt-16 columns-1 sm:columns-2 lg:columns-3 gap-3">
          {photos.map((photo, i) => (
            <motion.button
              key={i}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: i * 0.07,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              onClick={() => openLightbox(i)}
              className="break-inside-avoid mb-3 group relative rounded-xl overflow-hidden cursor-pointer block w-full text-left focus-visible:outline-2 focus-visible:outline-or"
              aria-label={`Voir ${photo.name} en grand`}
            >
              <div className={`relative w-full ${photo.aspectClass}`}>
                <Image
                  src={photo.thumb}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay with realization name */}
                <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/58 transition-colors duration-300 flex items-end p-4 md:p-5">
                  <p className="font-serif text-lg text-creme translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    {photo.name}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
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
