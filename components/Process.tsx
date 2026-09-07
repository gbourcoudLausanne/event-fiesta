"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  ChatCircleDots,
  PaintBrush,
  ClipboardText,
  Truck,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

const ICONS: Icon[] = [ChatCircleDots, PaintBrush, ClipboardText, Truck];

export function Process() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Fond photo */}
      <Image
        src="/Galerie/hero-slides/hero-slide-2.PNG"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(58,32,42,0.6) 0%, rgba(58,32,42,0.32) 52%, rgba(58,32,42,0.12) 100%)",
        }}
        aria-hidden
      />
      {/* Fondu depuis la guirlande : la couleur crème continue puis révèle la photo */}
      <div
        className="absolute inset-x-0 top-0 h-48 lg:h-64"
        style={{ background: "linear-gradient(#F3EDE6 0%, #F3EDE6 12%, rgba(243,237,230,0) 100%)" }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-[620px] p-8 sm:p-10 lg:p-12"
          style={{
            background: "#FAF7F2",
            boxShadow: "0 44px 100px -34px rgba(13,11,8,0.4)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B65572" }}>
              {t.process.eyebrow}
            </span>
          </div>

          <h2
            className="font-serif font-light leading-tight tracking-tight"
            style={{ fontSize: "clamp(1.95rem, 3.6vw, 2.9rem)", color: "#2A2320" }}
          >
            {t.process.title}
          </h2>
          <p
            className="font-sans font-light text-[14.5px] leading-relaxed mt-4 mb-9"
            style={{ color: "rgba(42,35,32,0.6)" }}
          >
            {t.process.intro}
          </p>

          <ul className="flex flex-col gap-7">
            {t.process.steps.map((s, i) => {
              const Ico = ICONS[i];
              return (
                <motion.li
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.09, ease }}
                  className="flex gap-5"
                >
                  <span
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center mt-0.5"
                    style={{ border: "1px solid rgba(217,98,138,0.38)" }}
                  >
                    {Ico && <Ico size={18} weight="light" color="#B65572" />}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-sans text-[11px] tabular-nums" style={{ color: "#D9628A" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif font-light text-lg leading-tight" style={{ color: "#2A2320" }}>
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className="font-sans font-light text-[13px] leading-relaxed mt-1.5"
                      style={{ color: "rgba(42,35,32,0.58)" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <Link
            href="/contact"
            className="btn-gold-shimmer inline-flex items-center gap-2 mt-10 font-sans text-[13px] font-medium px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-[1.03]"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
          >
            {t.process.cta}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
