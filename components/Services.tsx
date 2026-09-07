"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

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

/* ── Un panneau du lookbook ────────────────────────────────────────────── */
function Panel({
  it,
  i,
  total,
  className = "",
}: {
  it: Item;
  i: number;
  total: number;
  className?: string;
}) {
  return (
    <Link
      href="/nos-services"
      className={`group relative block shrink-0 overflow-hidden ${className}`}
    >
      <Image
        src={INDEX_IMAGES[it.key]}
        alt={it.name}
        fill
        priority={i === 0}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 1024px) 82vw, 60vw"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(13,11,8,0.15) 0%, rgba(13,11,8,0) 38%, rgba(13,11,8,0.82) 100%)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-7 lg:p-11">
        <span
          className="font-serif font-light leading-none"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", color: "rgba(250,247,242,0.9)" }}
        >
          {String(i + 1).padStart(2, "0")}
          <span className="font-sans text-[11px] align-top ml-2" style={{ color: "rgba(250,247,242,0.5)" }}>
            /{String(total).padStart(2, "0")}
          </span>
        </span>

        <div className="max-w-md">
          <h3
            className="font-serif font-light italic leading-[1.05]"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)", color: "#FAF7F2" }}
          >
            {it.name}
          </h3>
          <p
            className="font-sans font-light text-[13.5px] lg:text-[14px] leading-relaxed mt-3"
            style={{ color: "rgba(250,247,242,0.82)" }}
          >
            {it.desc}
          </p>
          <span
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "#FAF7F2" }}
          >
            Découvrir
            <ArrowUpRight
              size={13}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── En-tête de section ────────────────────────────────────────────────── */
function SectionHeader({
  eyebrow,
  title,
  intro,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3"
        style={{ color: dark ? "#F4A8B8" : "#D9628A" }}
      >
        {eyebrow}
      </p>
      <h2
        className="font-serif font-light leading-tight"
        style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)", color: dark ? "#FAF7F2" : "#0D0B08" }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className="font-sans font-light text-[14.5px] leading-relaxed mt-4 hidden lg:block"
          style={{ color: dark ? "rgba(250,247,242,0.7)" : "rgba(13,11,8,0.55)" }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function Services() {
  const { t } = useI18n();
  const items = t.services.index as Item[];
  const total = items.length;

  // Choix du mode : scroll piloté (desktop, sans reduced-motion) ou natif (swipe)
  const [driven, setDriven] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    const apply = () => setDriven(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (!driven) return;
    const measure = () => {
      if (stripRef.current) {
        setTravel(Math.max(0, stripRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [driven, total]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStep(Math.min(total - 1, Math.max(0, Math.round(p * (total - 1)))));
  });

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const frac = total > 1 ? i / (total - 1) : 0;
    const target = el.offsetTop + frac * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  /* ── Version pilotée au scroll (desktop) ── */
  if (driven) {
    return (
      <section
        ref={sectionRef}
        id="services"
        className="relative"
        style={{ height: `${total * 82}vh`, background: "#FAF7F2" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none z-10 mix-blend-multiply"
            style={{
              opacity: 0.4,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          {/* En-tête */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-[6.5rem] px-[6vw]">
            <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} />
          </div>

          {/* Filmstrip */}
          <motion.div
            ref={stripRef}
            style={{ x }}
            className="flex h-full items-center gap-6 lg:gap-8 pl-[6vw] pr-[10vw] will-change-transform"
          >
            {items.map((it, i) => (
              <Panel
                key={it.key}
                it={it}
                i={i}
                total={total}
                className="h-[72vh] w-[58vw] max-w-[860px]"
              />
            ))}
          </motion.div>

          {/* Progression + navigation */}
          <div className="absolute bottom-9 left-0 right-0 z-20 px-[6vw] flex items-center gap-6">
            <span className="font-sans text-[12px] tabular-nums" style={{ color: "rgba(13,11,8,0.5)" }}>
              {String(step + 1).padStart(2, "0")}
              <span className="mx-1.5" style={{ color: "rgba(13,11,8,0.25)" }}>—</span>
              {String(total).padStart(2, "0")}
            </span>
            <div className="relative flex-1 h-px" style={{ background: "rgba(13,11,8,0.14)" }}>
              <motion.div
                className="absolute left-0 top-0 h-px origin-left"
                style={{ scaleX: scrollYProgress, width: "100%", background: "#D9628A" }}
              />
            </div>
            <div className="flex items-center gap-2">
              {items.map((it, i) => (
                <button
                  key={it.key}
                  onClick={() => goTo(i)}
                  aria-label={it.name}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: i === step ? 22 : 7,
                    height: 7,
                    background: i === step ? "#D9628A" : "rgba(217,98,138,0.28)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Version native (mobile / reduced-motion) : filmstrip swipe ── */
  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 lg:py-20"
      style={{ background: "#FAF7F2" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
        <SectionHeader eyebrow={t.services.eyebrow} title={t.services.title} intro={t.services.intro} />
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 lg:px-10 pb-4">
        {items.map((it, i) => (
          <div key={it.key} className="snap-center shrink-0">
            <Panel
              it={it}
              i={i}
              total={total}
              className="w-[84vw] max-w-[440px] h-[62vh] min-h-[420px] rounded-[2px]"
            />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8">
        <Link
          href="/nos-services"
          className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full"
          style={{ background: "#D9628A", color: "#0D0B08" }}
        >
          {t.services.ctaAll}
          <ArrowUpRight size={14} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
