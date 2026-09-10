"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { ServiceCard, SERVICE_TINTS, type ServiceCardData } from "@/components/ServiceCard";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

function CategoryBlock({
  label,
  title,
  desc,
  items,
  bg,
  tintOffset,
  footer,
}: {
  label: string;
  title: string;
  desc: string;
  items: ServiceCardData[];
  bg: string;
  tintOffset: number;
  footer?: React.ReactNode;
}) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: bg }}>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 lg:mb-14 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "#B65572" }}
            >
              {label}
            </span>
          </div>
          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", color: "#2A2320" }}
          >
            {title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-5"
            style={{ color: "rgba(42,35,32,0.55)" }}
          >
            {desc}
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {items.map((item, i) => (
            <ServiceCard
              key={item.key}
              card={item}
              i={i}
              tint={SERVICE_TINTS[(i + tintOffset) % SERVICE_TINTS.length]}
              href="/contact"
              cta={t.services.discuss}
            />
          ))}
        </ul>

        {footer}
      </div>
    </section>
  );
}

export function ServicesCatalog() {
  const { t } = useI18n();

  const particuliers: ServiceCardData[] = t.services.index.filter(
    (i) => i.key !== "entreprise",
  );
  const professionnels: ServiceCardData[] = t.services.proItems.map((p) => ({
    key: p.key,
    name: p.title,
    desc: p.desc,
  }));

  return (
    <>
      <CategoryBlock
        label={t.services.particuliers.label}
        title={t.services.particuliers.title}
        desc={t.services.particuliers.desc}
        items={particuliers}
        bg="#FAF7F2"
        tintOffset={0}
        footer={
          <Link
            href="/galerie"
            className="group mt-8 lg:mt-10 inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "#B65572" }}
          >
            {t.realisations.ctaAll}
            <ArrowRight
              size={13}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        }
      />
      <CategoryBlock
        label={t.services.professionnels.label}
        title={t.services.professionnels.title}
        desc={t.services.professionnels.desc}
        items={professionnels}
        bg="#F3EDE6"
        tintOffset={3}
      />
    </>
  );
}
