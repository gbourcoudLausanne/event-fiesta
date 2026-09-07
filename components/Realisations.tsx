"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight, MagnifyingGlassPlus } from "@phosphor-icons/react";
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

/* ── Carousel d'aperçu (accueil) : rolodex de types + pile photo ──────── */
type Shot = { src: string; alt: string; name: string };
type CarouselType = { label: string; photos: Shot[] };

const CAROUSEL: CarouselType[] = [
  {
    label: "Anniversaire",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-13.PNG", alt: "Arche ronde de ballons violet, lilas et or dans un jardin avec salon lounge", name: "Arche jardin · violet & or" },
      { src: "/Galerie/hero-slides/hero-slide-12.JPG", alt: "Chiffre 30 lumineux et arche de ballons blanc et or en extérieur", name: "30 ans · blanc & or" },
      { src: "/Galerie/hero-slides/hero-slide-8.PNG", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table", name: "Dégradé fuchsia & corail" },
      { src: "/Galerie/hero-slides/hero-slide-9.PNG", alt: "Arche de ballons rose et blanc avec chiffre 6 et gâteau ballerine", name: "Anniversaire ballerine" },
      { src: "/Galerie/hero-slides/hero-slide-6.PNG", alt: "Sweet table dorée avec gâteau et guirlande de ballons rose et pêche", name: "Sweet table rosée" },
      { src: "/Galerie/hero-slides/hero-slide-4.PNG", alt: "Arche de ballons fleurs et rideau de franges terracotta avec chiffre 3", name: "Fleurs & franges · 3 ans" },
      { src: "/Galerie/hero-slides/hero-slide-15.PNG", alt: "Bouquet de ballons chiffre 10 rose personnalisé avec cœur", name: "Bouquet · 10 ans" },
      { src: "/Galerie/hero-slides/hero-slide-14.JPG", alt: "Bouquet de ballons chiffre 15 rose gold personnalisé", name: "Bouquet · 15 ans" },
      { src: "/Galerie/hero-slides/hero-slide-18.webp", alt: "Fête pyjama d'anniversaire enfant avec arche pêche et corail", name: "Fête pyjama" },
      { src: "/Galerie/hero-slides/hero-slide-1.PNG", alt: "Arche de ballons rose et blanc au-dessus d'une table nappée de tulle rose", name: "Arche rose & blanc" },
    ],
  },
  {
    label: "Baby shower",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-2.PNG", alt: "Arche organique de ballons rose poudré, crème et rose gold", name: "Arche rose poudré & rose gold" },
      { src: "/Galerie/hero-slides/hero-slide-5.PNG", alt: "Arche de ballons menthe, pêche et rose avec chiffre argenté", name: "Menthe & pêche" },
      { src: "/Galerie/Baptemes/122219_01.jpg", alt: "Arche ronde de ballons rose avec guirlande et pampa", name: "Arche ronde & pampa" },
    ],
  },
  {
    label: "Gender reveal",
    photos: [
      { src: "/Galerie/Gender-Reveal/GenderReveal_2.jpg", alt: "Gender reveal Boy or Girl, arche de ballons rose et bleu sur backdrop blanc", name: "Boy or Girl ?" },
      { src: "/Galerie/Gender-Reveal/GenderReveal_1.webp", alt: "Gender reveal Oh Baby, arche dorée et fleurs", name: "Oh Baby !" },
    ],
  },
  {
    label: "Baptême",
    photos: [
      { src: "/Galerie/Baptemes/Bapteme.jpg", alt: "Arche dorée avec guirlande de ballons rose gold et pampa", name: "Arche dorée & pampa" },
      { src: "/Galerie/Baptemes/Bapteme_1.jpeg", alt: "Décoration de baptême beige et or avec arche de ballons", name: "Beige & or" },
      { src: "/Galerie/Hero/Hero_3.jpg", alt: "Installation boho en extérieur avec arche de ballons et panneaux", name: "Boho garden" },
    ],
  },
  {
    label: "Mariage civil",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-7.jpeg", alt: "Arche de cérémonie en bois avec voile ivoire et compositions de fleurs séchées", name: "Cérémonie · fleurs séchées" },
      { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table de réception avec nappe vieux rose et compositions d'anémones", name: "Table · anémones & vieux rose" },
      { src: "/Galerie/hero-slides/hero-slide-11.JPG", alt: "Table dressée en extérieur avec chemin de table blanc et centre floral", name: "Table dressée extérieur" },
    ],
  },
  {
    label: "Pique-nique",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-17.webp", alt: "Pique-nique de luxe au bord de l'eau, table basse en bois et coussins", name: "Pique-nique de luxe · au bord de l'eau" },
    ],
  },
  {
    label: "Entreprise",
    photos: [
      { src: "/Galerie/hero-slides/hero-slide-3.PNG", alt: "Guirlande de ballons multicolore au-dessus d'une grazing table", name: "Soirée d'entreprise · grazing table" },
      { src: "/Galerie/hero-slides/hero-slide-10.PNG", alt: "Chiffres 50 noirs et bouquets de ballons or, argent et noir", name: "50 ans · noir & or" },
      { src: "/Galerie/Corporate/Corporate_1.jpg", alt: "Arche de ballons colorée pour un événement d'entreprise", name: "Arche colorée" },
    ],
  },
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* ── Bouquet de ballons qui s'élève (motif animé de la section) ────────── */
const RZ_GRADS: Record<string, [string, string, string]> = {
  rose:     ["#FCE2E9", "#F2A6B8", "#DE7C98"],
  roseDeep: ["#F7C9D6", "#E58AA6", "#C65E7F"],
  gold:     ["#F6E2CF", "#E3B593", "#C68C63"],
  blue:     ["#E4F0F5", "#AFD2E1", "#7FB0C6"],
  cream:    ["#FFFDFA", "#F3EBDF", "#DFD2BF"],
};
const RZ_BALLOONS = [
  { x: 96,  y: 96,  r: 30, g: "rose",     s: "M96 126 C90 150 104 168 96 196 C92 210 98 220 96 232", d: 0.10, sw: 3.5 },
  { x: 150, y: 66,  r: 24, g: "gold",     s: "M150 90 C144 116 156 132 150 162 C147 178 152 188 150 200", d: 0.22, sw: 4.5 },
  { x: 58,  y: 150, r: 22, g: "blue",     s: "M58 172 C52 196 66 212 58 240 C55 254 60 262 58 272", d: 0.34, sw: 5 },
  { x: 128, y: 148, r: 27, g: "roseDeep", s: "M128 175 C122 200 136 216 128 246 C125 262 130 270 128 282", d: 0.16, sw: 3 },
  { x: 188, y: 128, r: 20, g: "cream",    s: "M188 148 C182 172 196 186 188 214 C185 228 190 236 188 246", d: 0.42, sw: 5.5 },
  { x: 80,  y: 40,  r: 18, g: "roseDeep", s: "M80 58 C76 82 88 96 80 122 C78 136 82 144 80 154", d: 0.50, sw: 6 },
  { x: 168, y: 190, r: 17, g: "blue",     s: "M168 207 C164 228 176 242 168 268 C166 282 170 288 168 298", d: 0.30, sw: 6 },
];

function FloatingBalloons() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 260 330"
      fill="none"
      className="w-full max-w-[300px] lg:max-w-[360px]"
      style={{ overflow: "visible" }}
      aria-hidden
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "shown"}
      viewport={{ once: true, amount: 0.4 }}
    >
      <defs>
        {Object.entries(RZ_GRADS).map(([k, [a, b, c]]) => (
          <radialGradient key={k} id={`rz-${k}`} cx="34%" cy="28%" r="80%">
            <stop offset="0%" stopColor={a} />
            <stop offset="52%" stopColor={b} />
            <stop offset="100%" stopColor={c} />
          </radialGradient>
        ))}
      </defs>
      {RZ_BALLOONS.map((b, i) => (
        <motion.g
          key={i}
          variants={{
            hidden: { y: 70, opacity: 0 },
            shown: {
              y: 0,
              opacity: 0.95,
              transition: { type: "spring", stiffness: 120, damping: 16, delay: b.d },
            },
          }}
        >
          <motion.g
            animate={reduce ? undefined : { y: [0, -9, 0], rotate: [0, i % 2 ? 1.4 : -1.4, 0] }}
            transition={{ repeat: Infinity, duration: 5.5 + i * 0.5, ease: "easeInOut", delay: 1 + b.d }}
            style={{ transformOrigin: `${b.x}px ${b.y}px` }}
          >
            <path d={b.s} stroke="rgba(120,60,80,0.28)" strokeWidth={b.sw * 0.16} fill="none" strokeLinecap="round" />
            <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#rz-${b.g})`} />
            <path
              d={`M${b.x - 4} ${b.y + b.r - 1} Q${b.x} ${b.y + b.r + 5} ${b.x + 4} ${b.y + b.r - 1} Z`}
              fill={`url(#rz-${b.g})`}
            />
            <ellipse
              cx={b.x - b.r * 0.32}
              cy={b.y - b.r * 0.36}
              rx={b.r * 0.22}
              ry={b.r * 0.32}
              fill="rgba(255,255,255,0.5)"
              transform={`rotate(-22 ${b.x - b.r * 0.32} ${b.y - b.r * 0.36})`}
            />
          </motion.g>
        </motion.g>
      ))}
    </motion.svg>
  );
}

const ITEM_H = 66;

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
    <section id="realisations" className="relative overflow-hidden py-16 lg:py-24" style={{ background: "#F3EDE6" }}>
      {/* Motif animé — bouquet de ballons, au premier plan haut-gauche (desktop) */}
      <div
        className="absolute pointer-events-none z-30 hidden lg:block"
        style={{ top: "3rem", left: "1%", width: "min(24vw, 320px)" }}
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
          className="lg:ml-auto lg:max-w-xl lg:text-right mb-8 lg:mb-10"
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
            {t.realisations.title}
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
            boxShadow: "0 44px 100px -36px rgba(120,60,80,0.4)",
            border: "1px solid rgba(42,35,32,0.07)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Rolodex de types ── */}
          <div
            className="relative flex items-center justify-center overflow-hidden px-6 min-h-[300px] lg:min-h-[560px] lg:w-[42%]"
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
                          fontSize: on ? "clamp(1.5rem, 2.4vw, 2.15rem)" : "clamp(1rem, 1.5vw, 1.2rem)",
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
                      style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 42%, rgba(13,11,8,0.78) 100%)" }}
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
                            style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 55%, rgba(13,11,8,0.6) 100%)" }}
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

        <Link
          href="/galerie"
          className="group mt-10 lg:mt-12 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "#B65572" }}
        >
          {t.realisations.ctaAll}
          <ArrowRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <AnimatePresence>
        {lb !== null && (
          <Lightbox
            photos={CAROUSEL[lb.t].photos as unknown as typeof photos}
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

  if (preview) return <RealisationsCarousel />;

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

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
