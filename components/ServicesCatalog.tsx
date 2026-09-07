"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Cake, Drop, Baby, MaskHappy, Sparkle, Balloon, Buildings, PaintBrush, Gift,
  Confetti, Rocket, Trophy, Storefront,
  type Icon,
} from "@phosphor-icons/react";
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

const serviceIcons: Record<string, Icon> = {
  anniversary: Cake,
  baptism: Drop,
  babyshower: Baby,
  themed: MaskHappy,
  communion: Sparkle,
  genderreveal: Balloon,
  corporate: Buildings,
  creation: PaintBrush,
  goodies: Gift,
  yearend: Confetti,
  launch: Rocket,
  gala: Trophy,
  opening: Storefront,
};

const PASTELS = [
  { bg: "#FBD5DE", ring: "#F4A8B8" },
  { bg: "#D6EAF2", ring: "#A8CEE0" },
  { bg: "#FBE6D2", ring: "#F0C29A" },
];

type Item = { key: string; title: string; desc: string };

function IconCard({ item, index, colorIdx }: { item: Item; index: number; colorIdx: number }) {
  const reduce = useReducedMotion();
  const Ico = serviceIcons[item.key];
  const c = PASTELS[colorIdx % PASTELS.length];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      className="relative overflow-hidden rounded-3xl p-7 lg:p-8 flex flex-col"
      style={{ background: c.bg, minHeight: 260 }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#ffffff", border: `1px solid ${c.ring}` }}
      >
        {Ico && <Ico size={26} weight="thin" color="#0D0B08" />}
      </div>
      <h3 className="font-serif font-light text-xl lg:text-2xl mb-2" style={{ color: "#0D0B08" }}>
        {item.title}
      </h3>
      <p className="font-sans text-sm leading-relaxed" style={{ color: "rgba(13,11,8,0.6)" }}>
        {item.desc}
      </p>
    </motion.div>
  );
}

function PhotoCard({ item, index }: { item: Item; index: number }) {
  const reduce = useReducedMotion();
  const img = serviceImages[item.key];
  if (!img) return null;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      className="group relative overflow-hidden rounded-3xl"
      style={{ minHeight: 260, boxShadow: "0 4px 24px rgba(13,11,8,0.08)" }}
    >
      <Image
        src={img}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 500px"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 40%, rgba(13,11,8,0.72) 100%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif font-light text-xl lg:text-2xl mb-1" style={{ color: "#FAF7F2" }}>
          {item.title}
        </h3>
        <p className="font-sans text-[13px] leading-relaxed" style={{ color: "rgba(250,247,242,0.75)" }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

function CategoryBlock({
  label, title, desc, items, bg, offset,
}: {
  label: string;
  title: string;
  desc: string;
  items: Item[];
  bg: string;
  offset: number;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="py-20 lg:py-28" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 lg:mb-16 max-w-2xl"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#D9628A" }}>
            {label}
          </p>
          <h2
            className="font-serif font-light leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#0D0B08" }}
          >
            {title}
          </h2>
          <p className="font-sans font-light text-[15px] leading-relaxed" style={{ color: "rgba(13,11,8,0.55)" }}>
            {desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const isPhoto = i % 2 === 1 && serviceImages[item.key];
            return isPhoto ? (
              <PhotoCard key={item.key} item={item} index={i} />
            ) : (
              <IconCard key={item.key} item={item} index={i} colorIdx={offset + i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServicesCatalog() {
  const { t } = useI18n();

  const particuliers = t.services.items.filter((i) => i.key !== "corporate");
  const professionnels = t.services.proItems;

  return (
    <>
      <CategoryBlock
        label={t.services.particuliers.label}
        title={t.services.particuliers.title}
        desc={t.services.particuliers.desc}
        items={particuliers}
        bg="#FAF7F2"
        offset={0}
      />
      <CategoryBlock
        label={t.services.professionnels.label}
        title={t.services.professionnels.title}
        desc={t.services.professionnels.desc}
        items={professionnels}
        bg="#F3EDE6"
        offset={1}
      />

      <section className="pb-24" style={{ background: "#F3EDE6" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <p className="font-serif font-light italic text-xl lg:text-2xl" style={{ color: "rgba(13,11,8,0.6)" }}>
            {t.services.intro}
          </p>
          <Link
            href="/contact"
            className="btn-gold-shimmer shrink-0 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#0D0B08" }}
          >
            {t.about.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
