"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cake, Drop, Baby, MaskHappy, Sparkle, Balloon, Buildings, PaintBrush, Gift,
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
};

const PASTELS = [
  { bg: "#FBD5DE", ring: "#F4A8B8", iconBg: "#ffffff" }, // rose
  { bg: "#D6EAF2", ring: "#A8CEE0", iconBg: "#ffffff" }, // blue
  { bg: "#FBE6D2", ring: "#F0C29A", iconBg: "#ffffff" }, // peach
];

function IconCard({
  item, index, colorIdx,
}: {
  item: { key: string; title: string; desc: string };
  index: number;
  colorIdx: number;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const Ico = serviceIcons[item.key];
  const c = PASTELS[colorIdx % PASTELS.length];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="relative overflow-hidden rounded-3xl p-7 lg:p-8 flex flex-col"
      style={{ background: c.bg, minHeight: 300 }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: c.iconBg, border: `1px solid ${c.ring}` }}
      >
        {Ico && <Ico size={26} weight="thin" color="#0D0B08" />}
      </div>

      <h3 className="font-serif font-light text-xl lg:text-2xl mb-2" style={{ color: "#0D0B08" }}>
        {item.title}
      </h3>
      <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: "rgba(13,11,8,0.6)" }}>
        {item.desc}
      </p>

      <button
        onClick={() => router.push("/nos-services")}
        className="mt-auto self-start font-sans text-[13px] font-medium px-5 py-2.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
        style={{ background: "#0D0B08", color: c.bg }}
      >
        En savoir plus
      </button>
    </motion.div>
  );
}

function PhotoCard({
  item, index,
}: {
  item: { key: string; title: string; desc: string };
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      style={{ minHeight: 300, boxShadow: "0 4px 24px rgba(13,11,8,0.08)" }}
    >
      <Image
        src={serviceImages[item.key]}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 500px"
      />
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: "linear-gradient(180deg, rgba(13,11,8,0) 45%, rgba(13,11,8,0.6) 100%)" }}
      />
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: "2px solid #F4A8B8" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif font-light text-xl lg:text-2xl" style={{ color: "#FAF7F2" }}>
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}

export function Services({ preview = false }: { preview?: boolean }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  let colorCounter = 0;
  const items = preview ? t.services.items.slice(0, 6) : t.services.items;

  return (
    <section id="services" className="pt-12 pb-24 lg:pt-16 lg:pb-32" style={{ background: "#FAF7F2" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 lg:mb-16"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-3" style={{ color: "#F4A8B8" }}>
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

        {/* Grille alternée icône / photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const img = serviceImages[item.key];
            if (!img) return null;
            const isIconCard = i % 2 === 0;
            if (isIconCard) {
              const c = colorCounter++;
              return <IconCard key={item.key} item={item} index={i} colorIdx={c} />;
            }
            return <PhotoCard key={item.key} item={item} index={i} />;
          })}
        </div>

        {preview && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/nos-services"
              className="btn-gold-shimmer font-sans text-[13px] font-medium px-8 py-3.5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#D9628A", color: "#0D0B08" }}
            >
              {t.services.ctaAll}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
