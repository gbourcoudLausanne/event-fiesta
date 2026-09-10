"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight, MagnifyingGlassPlus } from "@phosphor-icons/react";
import { FloatingBalloons } from "@/components/FloatingBalloons";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Carousel d'aperçu (accueil) : rolodex de types + pile photo ──────── */
type Shot = { src: string; alt: string; name: string };
type CarouselType = { label: string; photos: Shot[] };

const CAROUSEL: CarouselType[] = [
  {
    label: "Anniversaire",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-13.webp", alt: "Arche ronde de ballons violet, lilas et or dans un jardin avec salon lounge", name: "Arche jardin · violet & or" },
      { src: "/Galerie/hero-slides/hero-slide-12.webp", alt: "Chiffre 30 lumineux et arche de ballons blanc et or en extérieur", name: "30 ans · blanc & or" },
      { src: "/Galerie/hero-slides/hero-slide-8.webp", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table", name: "Dégradé fuchsia & corail" },
      { src: "/Galerie/hero-slides/hero-slide-9.webp", alt: "Arche de ballons rose et blanc avec chiffre 6 et gâteau ballerine", name: "Anniversaire ballerine" },
      { src: "/Galerie/hero-slides/hero-slide-6.webp", alt: "Sweet table dorée avec gâteau et guirlande de ballons rose et pêche", name: "Sweet table rosée" },
      { src: "/Galerie/hero-slides/hero-slide-4.webp", alt: "Arche de ballons fleurs et rideau de franges terracotta avec chiffre 3", name: "Fleurs & franges · 3 ans" },
      { src: "/Galerie/hero-slides/hero-slide-15.webp", alt: "Bouquet de ballons chiffre 10 rose personnalisé avec cœur", name: "Bouquet · 10 ans" },
      { src: "/Galerie/hero-slides/hero-slide-14.webp", alt: "Bouquet de ballons chiffre 15 rose gold personnalisé", name: "Bouquet · 15 ans" },
      { src: "/Galerie/hero-slides/hero-slide-18.webp", alt: "Fête pyjama d'anniversaire enfant avec arche pêche et corail", name: "Fête pyjama" },
      { src: "/Galerie/hero-slides/hero-slide-1.webp", alt: "Arche de ballons rose et blanc au-dessus d'une table nappée de tulle rose", name: "Arche rose & blanc" },
    ],
  },
  {
    label: "Baby shower",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-2.webp", alt: "Arche organique de ballons rose poudré, crème et rose gold", name: "Arche rose poudré & rose gold" },
      { src: "/Galerie/hero-slides/hero-slide-5.webp", alt: "Arche de ballons menthe, pêche et rose avec chiffre argenté", name: "Menthe & pêche" },
      { src: "/Galerie/Baptemes/122219_01.webp", alt: "Arche ronde de ballons rose avec guirlande et pampa", name: "Arche ronde & pampa" },
    ],
  },
  {
    label: "Gender reveal",
    photos: [
      { src: "/Galerie/Gender-Reveal/GenderReveal_2.webp", alt: "Gender reveal Boy or Girl, arche de ballons rose et bleu sur backdrop blanc", name: "Boy or Girl ?" },
      { src: "/Galerie/Gender-Reveal/GenderReveal_1.webp", alt: "Gender reveal Oh Baby, arche dorée et fleurs", name: "Oh Baby !" },
    ],
  },
  {
    label: "Baptême",
    photos: [
      { src: "/Galerie/Baptemes/Bapteme.webp", alt: "Arche dorée avec guirlande de ballons rose gold et pampa", name: "Arche dorée & pampa" },
      { src: "/Galerie/Baptemes/Bapteme_1.webp", alt: "Décoration de baptême beige et or avec arche de ballons", name: "Beige & or" },
      { src: "/Galerie/Hero/Hero_3.webp", alt: "Installation boho en extérieur avec arche de ballons et panneaux", name: "Boho garden" },
    ],
  },
  {
    label: "Mariage civil",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-7.webp", alt: "Arche de cérémonie en bois avec voile ivoire et compositions de fleurs séchées", name: "Cérémonie · fleurs séchées" },
      { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table de réception avec nappe vieux rose et compositions d'anémones", name: "Table · anémones & vieux rose" },
      { src: "/Galerie/hero-slides/hero-slide-11.webp", alt: "Table dressée en extérieur avec chemin de table blanc et centre floral", name: "Table dressée extérieur" },
    ],
  },
  {
    label: "Pique-nique",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-17.webp", alt: "Pique-nique au bord de l'eau, table basse en bois et coussins", name: "Pique-nique · au bord de l'eau" },
    ],
  },
  {
    label: "Entreprise",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-3.webp", alt: "Guirlande de ballons multicolore au-dessus d'une grazing table", name: "Soirée d'entreprise · grazing table" },
      { src: "/Galerie/hero-slides/hero-slide-10.webp", alt: "Chiffres 50 noirs et bouquets de ballons or, argent et noir", name: "50 ans · noir & or" },
      { src: "/Galerie/Corporate/Corporate_1.webp", alt: "Arche de ballons colorée pour un événement d'entreprise", name: "Arche colorée" },
    ],
  },
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const ITEM_H = 80;

const DUR = 4600;

function RealisationsCarousel() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lb, setLb] = useState<{ t: number; i: number } | null>(null);

  const N = CAROUSEL.length;
  const cur = ((step % N) + N) % N;
  const frozen = expanded !== null || lb !== null;

  useEffect(() => {
    if (paused || reduce || frozen) return;
    const id = setInterval(() => setStep((s) => s + 1), DUR);
    return () => clearInterval(id);
  }, [paused, reduce, frozen]);

  useEffect(() => {
    if (expanded === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const jump = (i: number) => {
    const diff = (i - cur + N) % N;
    if (diff) setStep((s) => s + diff);
  };

  const status = (i: number) => {
    let d = i - cur;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    if (d === 0) return "active";
    if (d === -1) return "prev";
    if (d === 1) return "next";
    return "hidden";
  };

  return (
    <section id="realisations" className="relative overflow-hidden pt-8 pb-16 lg:pt-10 lg:pb-24" style={{ background: "#F3EDE6" }}>
      {/* Motif animé — bouquet de ballons. 1er plan par défaut ; passe en
          arrière-plan quand une grille est déployée pour ne pas la gêner. */}
      <div
        className={`absolute pointer-events-none hidden lg:block transition-opacity duration-300 ${
          expanded !== null ? "z-0 opacity-40" : "z-30 opacity-100"
        }`}
        style={{ top: "0.25rem", left: "1%", width: "min(24vw, 320px)" }}
      >
        <FloatingBalloons />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* En-tête : texte à droite */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease }}
          className="lg:ml-auto lg:max-w-xl lg:text-right mb-10 lg:mb-20"
        >
          <div className="flex items-center gap-3 mb-5 lg:justify-end">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.realisations.eyebrow}
            </span>
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.8rem)", color: "#2A2320" }}
          >
            {t.realisations.previewTitle}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5 lg:ml-auto max-w-md"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {t.realisations.subtitle}
          </p>
        </motion.div>

        {/* Motif ballons — version mobile */}
        <div className="lg:hidden flex justify-center mb-8">
          <FloatingBalloons />
        </div>

        {/* Carousel — remonte pour empiéter sur le bouquet */}
        <div
          className="relative z-10 flex flex-col lg:flex-row overflow-hidden lg:-mt-10"
          style={{
            boxShadow: "0 26px 60px -30px rgba(120,60,80,0.22)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Rolodex de types ── */}
          <div
            className="relative flex items-center justify-center overflow-hidden px-6 min-h-[360px] lg:min-h-[560px] lg:w-[42%]"
            style={{ background: "#F2D4D9" }}
          >
            <div className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none" style={{ background: "linear-gradient(#F2D4D9, rgba(242,212,217,0))" }} />
            <div className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none" style={{ background: "linear-gradient(rgba(242,212,217,0), #F2D4D9)" }} />
            <div className="relative flex h-full w-full items-center justify-center">
              {CAROUSEL.map((it, i) => {
                const wd = wrap(-(N / 2), N / 2, i - cur);
                const on = i === cur;
                return (
                  <motion.div
                    key={i}
                    className="absolute inset-x-0 flex items-center justify-center"
                    style={{ height: ITEM_H }}
                    animate={{
                      y: wd * ITEM_H,
                      opacity: reduce ? (on ? 1 : 0) : Math.max(0, 1 - Math.abs(wd) * 0.34),
                    }}
                    transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 88, damping: 22 }}
                  >
                    <button
                      onClick={() => jump(i)}
                      className="flex items-center gap-4 cursor-pointer"
                      aria-current={on ? "true" : undefined}
                    >
                      {on ? (
                        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                          <svg viewBox="0 0 28 28" className="absolute inset-0 h-full w-full -rotate-90">
                            <circle cx="14" cy="14" r="12.5" fill="none" stroke="rgba(42,35,32,0.16)" strokeWidth="1.4" />
                            <circle
                              key={cur}
                              cx="14"
                              cy="14"
                              r="12.5"
                              fill="none"
                              stroke="#D9628A"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              pathLength={1}
                              style={{
                                strokeDasharray: 1,
                                strokeDashoffset: 1,
                                animation: reduce ? "none" : `rc-ring ${DUR}ms linear forwards`,
                                animationPlayState: paused ? "paused" : "running",
                              }}
                            />
                          </svg>
                          <span className="h-2 w-2 rounded-full" style={{ background: "#D9628A" }} />
                        </span>
                      ) : (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "rgba(42,35,32,0.28)" }} />
                      )}
                      <span
                        className="font-serif font-light whitespace-nowrap transition-colors duration-300"
                        style={{
                          fontSize: on ? "clamp(1.9rem, 3.2vw, 2.9rem)" : "clamp(1.15rem, 1.8vw, 1.45rem)",
                          color: on ? "#B65572" : "rgba(42,35,32,0.42)",
                          fontStyle: on ? "italic" : "normal",
                        }}
                      >
                        {it.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA galerie — au pied de la liste des thèmes */}
            <Link
              href="/galerie"
              className="group absolute inset-x-0 bottom-7 lg:bottom-9 z-20 mx-auto flex w-max max-w-[88%] items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] shadow-lg transition-transform duration-200 hover:scale-[1.04]"
              style={{ background: "#D9628A", color: "#FAF7F2" }}
            >
              {t.realisations.ctaAll}
              <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ── Pile photo ── */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden p-8 lg:p-14 min-h-[440px] lg:min-h-[560px]"
            style={{ background: "#FAF7F2" }}
          >
            <div className="relative w-full max-w-[420px]" style={{ aspectRatio: "4 / 5" }}>
              {CAROUSEL.map((it, i) => {
                const st = status(i);
                const on = st === "active";
                const cover = it.photos[0];
                const many = it.photos.length > 1;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => (on ? setExpanded(cur) : jump(i))}
                    initial={false}
                    animate={{
                      x: on ? 0 : st === "prev" ? -84 : st === "next" ? 84 : 0,
                      scale: on ? 1 : st === "prev" || st === "next" ? 0.87 : 0.72,
                      opacity: on ? 1 : st === "prev" || st === "next" ? 0.4 : 0,
                      rotate: reduce ? 0 : st === "prev" ? -2.5 : st === "next" ? 2.5 : 0,
                      zIndex: on ? 20 : st === "prev" || st === "next" ? 10 : 0,
                    }}
                    transition={reduce ? { duration: 0.25 } : { type: "spring", stiffness: 250, damping: 26, mass: 0.85 }}
                    className="group/ph absolute inset-0 overflow-hidden"
                    style={{
                      pointerEvents: st === "hidden" ? "none" : "auto",
                      cursor: "pointer",
                      boxShadow: "0 30px 60px -24px rgba(120,60,80,0.5)",
                    }}
                    aria-label={on ? `Voir les photos — ${it.label}` : `Aller à ${it.label}`}
                  >
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      className="object-cover transition-[filter] duration-700"
                      style={{ filter: on ? "none" : "sepia(0.32) saturate(0.75) brightness(0.86)" }}
                      sizes="460px"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(180deg, rgba(42,35,32,0) 42%, rgba(42,35,32,0.78) 100%)" }}
                    />
                    {on && (
                      <div
                        className="absolute inset-4 pointer-events-none"
                        style={{ border: "1px solid rgba(250,247,242,0.28)" }}
                        aria-hidden
                      />
                    )}

                    <AnimatePresence>
                      {on && (
                        <motion.div
                          initial={reduce ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="absolute inset-x-0 bottom-0 p-6 text-left"
                        >
                          <p className="font-sans text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: "rgba(250,247,242,0.62)" }}>
                            {String(cur + 1).padStart(2, "0")} · {String(N).padStart(2, "0")} — {it.label}
                          </p>
                          <p className="font-serif font-light italic text-xl" style={{ color: "#FAF7F2" }}>
                            {cover.name}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {on && (
                      <span
                        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] opacity-0 transition-opacity duration-300 group-hover/ph:opacity-100"
                        style={{ background: "rgba(250,247,242,0.94)", color: "#B65572" }}
                      >
                        <MagnifyingGlassPlus size={12} weight="bold" />
                        {many ? `${it.photos.length} photos` : "Agrandir"}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Puces (utile sur mobile) */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
              {CAROUSEL.map((c, i) => (
                <button
                  key={i}
                  onClick={() => jump(i)}
                  aria-label={c.label}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === cur ? 20 : 6, height: 6, background: i === cur ? "#D9628A" : "rgba(217,98,138,0.32)" }}
                />
              ))}
            </div>
          </div>

          {/* ── Grille déployée d'un type ── */}
          <AnimatePresence>
            {expanded !== null && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-30 flex flex-col p-6 lg:p-9"
                style={{ background: "rgba(250,247,242,0.98)" }}
              >
                <div className="flex items-center justify-between mb-5 shrink-0">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em]" style={{ color: "#B65572" }}>
                      {t.realisations.eyebrow}
                    </p>
                    <p className="font-serif font-light italic mt-0.5" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2rem)", color: "#2A2320" }}>
                      {CAROUSEL[expanded].label}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(null)}
                    aria-label="Fermer"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer"
                    style={{ background: "rgba(42,35,32,0.06)", color: "#2A2320" }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="no-scrollbar flex-1 overflow-y-auto">
                  <div className="columns-2 lg:columns-3 gap-3">
                    {CAROUSEL[expanded].photos.map((p, gi) => (
                      <motion.button
                        key={p.src}
                        type="button"
                        onClick={() => setLb({ t: expanded, i: gi })}
                        initial={reduce ? false : { opacity: 0, scale: 0.92, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: gi * 0.06, ease }}
                        className="group/g relative mb-3 block w-full break-inside-avoid overflow-hidden"
                        aria-label={`Agrandir ${p.name}`}
                      >
                        <div className="relative w-full" style={{ aspectRatio: gi % 3 === 1 ? "4 / 5" : "3 / 4" }}>
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover/g:scale-[1.05]"
                            sizes="(max-width: 1024px) 45vw, 30vw"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover/g:opacity-100"
                            style={{ background: "linear-gradient(180deg, rgba(42,35,32,0) 55%, rgba(42,35,32,0.6) 100%)" }}
                          />
                          <p
                            className="absolute inset-x-0 bottom-0 p-3 text-left font-serif font-light italic text-[13px] opacity-0 transition-opacity duration-300 group-hover/g:opacity-100"
                            style={{ color: "#FAF7F2" }}
                          >
                            {p.name}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Link
                  href="/galerie"
                  className="group mt-4 inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium uppercase tracking-[0.16em] shrink-0"
                  style={{ color: "#B65572" }}
                >
                  {t.realisations.ctaAll}
                  <ArrowRight size={12} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <AnimatePresence>
        {lb !== null && (
          <Lightbox
            photos={CAROUSEL[lb.t].photos}
            activeIndex={lb.i}
            onClose={() => setLb(null)}
            onNext={() => setLb((v) => (v === null ? null : { ...v, i: (v.i + 1) % CAROUSEL[v.t].photos.length }))}
            onPrev={() => setLb((v) => (v === null ? null : { ...v, i: (v.i - 1 + CAROUSEL[v.t].photos.length) % CAROUSEL[v.t].photos.length }))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  photos: allPhotos,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  onJump,
}: {
  photos: readonly { src: string; alt: string; name: string }[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump?: (i: number) => void;
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
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(28,18,24,0.97)" }}
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={photo.name}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer"
        style={{ background: "rgba(250,247,242,0.1)", color: "#FAF7F2" }}
        aria-label="Fermer"
      >
        <X size={17} />
      </button>

      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-2 pt-14 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          key={activeIndex}
          className="relative h-full w-full max-w-5xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) onNext();
            else if (info.offset.x > 70) onPrev();
          }}
        >
          <Image src={photo.src} alt={photo.alt} fill className="object-contain" priority sizes="92vw" />
        </motion.div>

        {[
          { fn: onPrev, icon: <ArrowLeft size={18} />, label: "Précédente", pos: "left-2 md:left-6" },
          { fn: onNext, icon: <ArrowRight size={18} />, label: "Suivante", pos: "right-2 md:right-6" },
        ].map(({ fn, icon, label, pos }) => (
          <button
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              fn();
            }}
            aria-label={label}
            className={`absolute ${pos} top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors cursor-pointer sm:flex`}
            style={{ background: "rgba(250,247,242,0.1)", color: "#FAF7F2" }}
          >
            {icon}
          </button>
        ))}
      </div>

      <div className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-serif font-light text-lg" style={{ color: "#FAF7F2" }}>
          {photo.name}
        </p>
        <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(250,247,242,0.4)" }}>
          {activeIndex + 1} / {allPhotos.length}
        </p>
      </div>

      {onJump && (
        <div
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-5 pt-3 md:justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {allPhotos.map((p, i) => (
            <button
              key={p.src + i}
              onClick={() => onJump(i)}
              aria-label={p.name}
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md transition-all duration-200 cursor-pointer sm:h-14 sm:w-14"
              style={{
                opacity: i === activeIndex ? 1 : 0.42,
                outline: i === activeIndex ? "2px solid #FAF7F2" : "1px solid rgba(250,247,242,0.14)",
                outlineOffset: 2,
              }}
            >
              <Image src={p.src} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Galerie premium : filtres collants + mosaïque filtrable ───────────── */
const COLLECTIONS = CAROUSEL.map((c) => ({ key: c.label, count: c.photos.length }));
const ALL_PHOTOS = CAROUSEL.flatMap((c) =>
  c.photos.map((p) => ({ ...p, collection: c.label })),
);

export const GALLERY_WORLDS = CAROUSEL.length;
export const GALLERY_PIECES = ALL_PHOTOS.length;
const TILE_AR = ["3 / 4", "4 / 5", "1 / 1", "4 / 3", "3 / 4", "5 / 6"];

function TabItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative shrink-0 whitespace-nowrap py-4 font-serif font-light transition-colors duration-200 cursor-pointer"
      style={{
        fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
        color: active ? "#B65572" : "rgba(42,35,32,0.55)",
        fontStyle: active ? "italic" : "normal",
      }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="gal-tab-underline"
          className="absolute inset-x-0 -bottom-px h-[2px]"
          style={{ background: "#D9628A" }}
        />
      )}
    </button>
  );
}

export function Realisations({ preview = false }: { preview?: boolean }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string>("all");
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  if (preview) return <RealisationsCarousel />;

  const list =
    filter === "all" ? ALL_PHOTOS : ALL_PHOTOS.filter((p) => p.collection === filter);

  return (
    <section id="realisations" className="pb-24 lg:pb-32" style={{ background: "#FAF7F2" }}>
      <div className="pt-28 lg:pt-32" />

      {/* Barre de filtres — collante, intitulé intégré */}
      <div
        className="sticky top-[68px] z-30"
        style={{
          background: "rgba(250,247,242,0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          className="mx-auto max-w-7xl px-6 lg:px-10"
          style={{ borderBottom: "1px solid rgba(42,35,32,0.1)" }}
        >
          <div className="flex flex-col gap-2 py-1 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex shrink-0 items-center gap-3 pt-3 lg:pt-0">
              <span className="h-px w-8" style={{ background: "#D9628A" }} />
              <span
                className="font-serif font-light italic leading-none"
                style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", color: "#B65572" }}
              >
                Explorez par collection
              </span>
            </div>
            <div className="no-scrollbar -mr-6 flex gap-7 overflow-x-auto pr-6 lg:mr-0 lg:pr-0">
              <TabItem label="Tout voir" active={filter === "all"} onClick={() => setFilter("all")} />
              {COLLECTIONS.map((c) => (
                <TabItem
                  key={c.key}
                  label={c.key}
                  active={filter === c.key}
                  onClick={() => setFilter(c.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mosaïque justifiée — rangées de hauteur égale, bord inférieur aligné */}
      <div className="mx-auto max-w-7xl px-6 pt-9 lg:px-10 lg:pt-12">
        <motion.div key={filter} className="flex flex-wrap gap-3">
          {list.map((p, i) => {
            const [rw, rh] = TILE_AR[i % TILE_AR.length].split("/").map(Number);
            const ratio = rw / rh;
            return (
              <motion.button
                key={`${filter}-${p.src}-${i}`}
                type="button"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, 14) * 0.035, ease }}
                onClick={() => setLbIndex(i)}
                className="group relative block h-[52vw] overflow-hidden rounded-[14px] text-left sm:h-[280px] lg:h-[330px]"
                style={{
                  flexGrow: ratio,
                  flexBasis: `${ratio * 300}px`,
                  background: "#EBE2D8",
                }}
                aria-label={p.name}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
                />
                <div
                  className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "#FAF7F2" }}
                >
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em]" style={{ color: "#B65572" }}>
                    {p.collection}
                  </span>
                  <span className="font-serif font-light text-[15px] leading-snug" style={{ color: "#2A2320" }}>
                    {p.name}
                  </span>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ border: "1px solid rgba(217,98,138,0.45)" }}
                />
              </motion.button>
            );
          })}
          {/* Cales invisibles : empêchent la dernière rangée de trop s'étirer */}
          {[0, 1, 2].map((s) => (
            <i key={s} aria-hidden style={{ flexGrow: 10, flexBasis: "300px", height: 0 }} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lbIndex !== null && (
          <Lightbox
            photos={list}
            activeIndex={lbIndex}
            onClose={() => setLbIndex(null)}
            onNext={() => setLbIndex((i) => (i === null ? 0 : (i + 1) % list.length))}
            onPrev={() => setLbIndex((i) => (i === null ? 0 : (i - 1 + list.length) % list.length))}
            onJump={(i) => setLbIndex(i)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
