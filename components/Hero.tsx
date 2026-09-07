"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const PHOTOS = [
  { src: "/Galerie/hero-slides/hero-slide-1.PNG", alt: "Arche de ballons rose et blanc au-dessus d'une table nappée de tulle" },
  { src: "/Galerie/hero-slides/hero-slide-2.PNG", alt: "Arche organique rose poudré, crème et rose gold" },
  { src: "/Galerie/hero-slides/hero-slide-3.PNG", alt: "Guirlande de ballons multicolore au-dessus d'une grazing table" },
  { src: "/Galerie/hero-slides/hero-slide-4.PNG", alt: "Arche de ballons fleurs et rideau de franges terracotta, chiffre 3" },
  { src: "/Galerie/hero-slides/hero-slide-5.PNG", alt: "Arche menthe, pêche et rose avec chiffre 1 argenté" },
  { src: "/Galerie/hero-slides/hero-slide-6.PNG", alt: "Sweet table dorée avec gâteau et guirlande de ballons rose et pêche" },
  { src: "/Galerie/hero-slides/hero-slide-7.jpeg", alt: "Arche de cérémonie en bois avec voile ivoire drapé et compositions de fleurs séchées orangées" },
  { src: "/Galerie/hero-slides/hero-slide-8.PNG", alt: "Arche de ballons dégradée fuchsia, corail et crème avec sweet table" },
  { src: "/Galerie/hero-slides/hero-slide-9.PNG", alt: "Arche de ballons rose et blanc avec chiffre 6 et gâteau ballerine" },
  { src: "/Galerie/hero-slides/hero-slide-10.PNG", alt: "Chiffres 50 noirs et bouquets de ballons or, argent et noir" },
  { src: "/Galerie/hero-slides/hero-slide-11.JPG", alt: "Table dressée en extérieur, chemin de table blanc, sous-assiettes dorées et centre floral" },
  { src: "/Galerie/hero-slides/hero-slide-12.JPG", alt: "Chiffre 30 lumineux et arche de ballons blanc et or en extérieur" },
  { src: "/Galerie/hero-slides/hero-slide-13.PNG", alt: "Arche ronde de ballons violet et or Joyeux anniversaire dans un jardin" },
  { src: "/Galerie/hero-slides/hero-slide-14.JPG", alt: "Bouquet de ballons chiffre 15 rose gold personnalisé" },
  { src: "/Galerie/hero-slides/hero-slide-15.PNG", alt: "Bouquet de ballons chiffre 10 rose personnalisé avec cœur" },
  { src: "/Galerie/hero-slides/hero-slide-16.webp", alt: "Table dressée élégante avec nappe rose vieilli et compositions de fleurs roses" },
  { src: "/Galerie/hero-slides/hero-slide-17.webp", alt: "Pique-nique de luxe au bord de l'eau, table basse en bois, coussins de sol et chemin de table d'eucalyptus" },
  { src: "/Galerie/hero-slides/hero-slide-18.webp", alt: "Fête pyjama d'anniversaire enfant avec arche pêche et corail, coussins et portant de peignoirs roses" },
];

// Vitesse de défilement identique pour toutes les colonnes.
// Durée = nb de photos × ce facteur (sinon une colonne plus courte défilerait plus vite).
const SECONDS_PER_PHOTO = 16;
// Sens alterné d'une colonne à l'autre.
const COLUMN_REVERSED = [false, true, false, true];

const HERO_SERVICES = [
  "Mariage civil",
  "Anniversaires",
  "Baby shower",
  "Gender reveal",
  "Baptêmes",
  "Pique-niques",
  "Événement sur mesure",
  "Événement d'entreprise",
];

/* ── Ligne de services qui défile un par un ────────────────────────────── */
function RotatingServices() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % HERO_SERVICES.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="text-center">
      <p
        className="font-sans text-[10px] uppercase tracking-[0.3em] mb-4"
        style={{ color: "rgba(42,35,32,0.4)" }}
      >
        Ce que nous créons
      </p>
      <div
        className="relative overflow-hidden"
        style={{ height: "1.9em", fontSize: "clamp(1.7rem, 6.5vw, 2.8rem)" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={reduce ? false : { y: "115%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-115%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 flex items-center justify-center h-full font-serif italic font-light whitespace-nowrap"
            style={{ color: "#B65572", lineHeight: 1 }}
          >
            {HERO_SERVICES[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Répartit les photos en `count` colonnes SANS aucune répétition d'une colonne à l'autre.
function splitColumns<T>(items: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

/* ── Colonne de photos : défile seule, se fige au survol, scrollable à la main ── */
function MarqueeColumn({
  photos,
  duration,
  reverse,
  priority,
}: {
  photos: { src: string; alt: string }[];
  duration: number;
  reverse: boolean;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const hovering = useRef(false);
  const loop = [...photos, ...photos];

  useEffect(() => {
    const box = boxRef.current;
    const track = trackRef.current;
    if (!box || !track) return;

    const half = () => track.offsetHeight / 2 || 1;
    const wrap = () => {
      const h = half();
      if (pos.current >= h) pos.current -= h;
      else if (pos.current < 0) pos.current += h;
    };
    const apply = () => {
      track.style.transform = `translate3d(0, ${-pos.current}px, 0)`;
    };
    apply();

    let raf = 0;
    let last = performance.now();
    let manualUntil = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce && !hovering.current && now > manualUntil) {
        pos.current += (reverse ? -1 : 1) * (half() / duration) * dt;
        wrap();
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Molette : fait défiler la colonne à la main (et non la page) quand on est dessus.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pos.current += e.deltaY;
      wrap();
      apply();
    };
    // Tactile : glisser du doigt fait défiler la colonne.
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      manualUntil = performance.now() + 2500;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      pos.current += touchY - y;
      touchY = y;
      manualUntil = performance.now() + 2500;
      wrap();
      apply();
      e.preventDefault();
    };

    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchstart", onTouchStart);
      box.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduce, reverse, duration]);

  return (
    <div
      ref={boxRef}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      className="relative shrink-0 w-[46%] sm:w-[42%] lg:w-1/3 px-1.5 overflow-hidden"
    >
      <div ref={trackRef} className="flex flex-col gap-3 py-1 will-change-transform">
        {loop.map((p, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "3 / 4",
              boxShadow: "0 10px 30px -12px rgba(120,60,80,0.4)",
            }}
          >
            <Image
              src={p.src}
              alt={i < photos.length ? p.alt : ""}
              fill
              priority={priority && i === 0}
              className="object-cover"
              sizes="(max-width: 1024px) 45vw, 20vw"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 70%, rgba(74,40,52,0.22) 100%)" }}
              aria-hidden
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Fenêtre : plusieurs colonnes qui défilent ─────────────────────────── */
function PhotoWall({ columns = 3 }: { columns?: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ boxShadow: "0 40px 90px -35px rgba(120,60,80,0.5), 0 10px 30px rgba(13,11,8,0.08)" }}
    >
      <div className="absolute inset-0 flex justify-center py-3">
        {splitColumns(PHOTOS, columns).map((photos, i) => (
          <MarqueeColumn
            key={i}
            photos={photos}
            duration={photos.length * SECONDS_PER_PHOTO}
            reverse={COLUMN_REVERSED[i % COLUMN_REVERSED.length]}
            priority={i === 0}
          />
        ))}
      </div>

      {/* Fondu haut / bas */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(#FAF7F2, rgba(250,247,242,0))" }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(rgba(250,247,242,0), #FAF7F2)" }}
        aria-hidden
      />
      {/* Filet intérieur */}
      <div
        className="absolute inset-3 lg:inset-4 pointer-events-none"
        style={{ border: "1px solid rgba(217,98,138,0.14)" }}
        aria-hidden
      />
    </div>
  );
}

/* ── Une rangée de photos qui défile à l'horizontale ───────────────────── */
function RibbonRow({
  photos,
  reverse,
  speed,
  priority,
}: {
  photos: { src: string; alt: string }[];
  reverse: boolean;
  speed: number;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const loop = [...photos, ...photos, ...photos];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;
    const half = () => track.scrollWidth / 3 || 1;
    pos.current = reverse ? half() : 0;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      pos.current += (reverse ? -1 : 1) * speed * dt;
      const h = half();
      if (pos.current >= h) pos.current -= h;
      else if (pos.current < 0) pos.current += h;
      track.style.transform = `translate3d(${-pos.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, reverse, speed]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <div ref={trackRef} className="flex gap-2.5 h-full will-change-transform">
        {loop.map((p, i) => (
          <div
            key={i}
            className="relative h-full shrink-0 overflow-hidden"
            style={{ aspectRatio: "3 / 4", boxShadow: "0 16px 36px -16px rgba(120,60,80,0.5)" }}
          >
            <div
              className="absolute inset-0"
              style={
                reduce
                  ? undefined
                  : {
                      animation: `kenburns ${9 + (i % 4) * 2}s ease-in-out ${(i % 5) * -1.4}s infinite alternate`,
                    }
              }
            >
              <Image
                src={p.src}
                alt={i < photos.length ? p.alt : ""}
                fill
                priority={priority && i === 0}
                className="object-cover"
                sizes="60vw"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 68%, rgba(74,40,52,0.28) 100%)" }}
              aria-hidden
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Ruban photos plein cadre, 2 rangées opposées (mobile) ─────────────── */
function PhotoRibbon() {
  const even = PHOTOS.filter((_, i) => i % 2 === 0);
  const odd = PHOTOS.filter((_, i) => i % 2 === 1);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "clamp(320px, 48vh, 500px)" }}
    >
      <div className="flex flex-col gap-2.5 h-full">
        <RibbonRow photos={even} reverse={false} speed={24} priority />
        <RibbonRow photos={odd} reverse speed={21} />
      </div>

      {/* Fondus latéraux */}
      <div
        className="absolute inset-y-0 left-0 w-10 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #FAF7F2, rgba(250,247,242,0))" }}
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-10 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #FAF7F2, rgba(250,247,242,0))" }}
        aria-hidden
      />
    </div>
  );
}

/* ── Colonne texte ─────────────────────────────────────────────────────── */
// part: "intro" = filet + titre + sous-titre · "actions" = CTA + services · undefined = tout
function HeroText({ part }: { part?: "intro" | "actions" }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const item = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  const showIntro = part !== "actions";
  const showActions = part !== "intro";

  const centered = part === "intro" || part === "actions";

  return (
    <div className={`max-w-[34rem] ${centered ? "mx-auto text-center" : ""}`}>
      {showIntro && (
      <>
      <motion.div {...item(0)} className={`flex items-center gap-3 mb-5 sm:mb-7 ${centered ? "justify-center" : ""}`}>
        <span className="w-8 sm:w-12 h-px shrink-0" style={{ background: "#D9628A" }} />
        <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.3em]" style={{ color: "#B65572" }}>
          <span className="sm:hidden">Décoration d&apos;événements</span>
          <span className="hidden sm:inline">Décoration d&apos;événements · Suisse romande</span>
        </span>
      </motion.div>

      <motion.h1
        {...item(0.12)}
        className="font-serif font-light tracking-tight"
        style={{
          fontSize: centered ? "clamp(2.55rem, 9vw, 3.9rem)" : "clamp(2.5rem, 4.4vw, 4.6rem)",
          lineHeight: 1.06,
          color: "#2A2320",
        }}
      >
        {t.hero.headline1}{" "}
        <span className="font-serif italic" style={{ color: "#B65572" }}>
          {t.hero.headline2}
        </span>
      </motion.h1>

      <motion.p
        {...item(0.26)}
        className="font-sans font-light mt-5 sm:mt-7 text-[14px] sm:text-[15px] leading-relaxed"
        style={{ color: "rgba(42,35,32,0.6)" }}
      >
        {t.hero.subtext}
      </motion.p>
      </>
      )}

      {showActions && (() => {
        const cta = (
          <motion.div
            key="cta"
            {...item(0.4)}
            className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-5"
          >
            <Link
              href="/contact"
              className="btn-gold-shimmer inline-flex items-center justify-center gap-2 font-sans text-[13px] font-medium px-8 py-4 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#D9628A", color: "#FAF7F2" }}
            >
              {t.hero.cta1}
              <ArrowRight size={15} weight="bold" />
            </Link>
            <Link
              href="/galerie"
              className="group inline-flex items-center justify-center sm:justify-start gap-1.5 font-sans text-[13px] font-medium tracking-wide transition-colors duration-200 py-2"
              style={{ color: "rgba(42,35,32,0.7)" }}
            >
              {t.hero.cta2}
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        );
        const services = (
          <motion.div
            key="services"
            {...item(0.55)}
            className="pt-6 sm:pt-7"
            style={{ borderTop: "1px solid rgba(42,35,32,0.12)" }}
          >
            <RotatingServices />
          </motion.div>
        );
        // Mobile ("actions") : services puis CTA · Desktop (tout) : CTA puis services
        return (
          <div className={`flex flex-col ${part === "actions" ? "gap-9" : "gap-10 mt-9"}`}>
            {part === "actions" ? [services, cta] : [cta, services]}
          </div>
        );
      })()}
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden" style={{ background: "#FAF7F2" }}>
      {/* Halo décoratif */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "-22%", left: "-12%", width: "min(48vw, 640px)", aspectRatio: "1",
          background: "radial-gradient(circle at 60% 60%, rgba(244,168,184,0.2), rgba(244,168,184,0) 70%)",
        }}
        aria-hidden
      />
      {/* Grain subtil */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          opacity: 0.4,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative max-w-[1440px] mx-auto">
        {/* ── Desktop ── */}
        <div className="hidden lg:grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch min-h-[calc(100svh-68px)] pt-[68px]">
          <div className="flex items-center pl-10 xl:pl-16 pr-12 py-16">
            <HeroText />
          </div>
          <div className="relative pr-6 xl:pr-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="h-full w-full"
            >
              <PhotoWall columns={3} />
            </motion.div>
          </div>
        </div>

        {/* ── Mobile / tablette : intro → ruban photos plein cadre → services + CTA ── */}
        <div className="lg:hidden pt-[92px] pb-14">
          <div className="px-6 sm:px-8">
            <HeroText part="intro" />
          </div>
          <div className="mt-9 mb-10">
            <PhotoRibbon />
          </div>
          <div className="px-6 sm:px-8">
            <HeroText part="actions" />
          </div>
        </div>
      </div>
    </section>
  );
}
