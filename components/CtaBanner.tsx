"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

export function CtaBanner() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const router = useRouter();

  return (
    <section
      className="relative py-14 lg:py-16 overflow-hidden"
      style={{ background: "#F3EDE6" }}
    >
      {/* Halo léger */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(217,98,138,0.08) 0%, transparent 62%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col items-center text-center gap-6"
      >
        <h2
          className="font-serif font-light italic leading-[1.15]"
          style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)", color: "#2A2320" }}
        >
          {t.ctaBanner.title}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => router.push("/contact")}
            className="btn-gold-shimmer inline-flex items-center gap-2 font-sans text-sm font-medium px-8 py-3.5 rounded-full cursor-pointer active:scale-[0.97] transition-all duration-300"
            style={{ background: "#D9628A", color: "#FAF7F2" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#C25E7E")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#D9628A")
            }
          >
            {t.ctaBanner.cta}
            <ArrowRight size={14} weight="bold" />
          </button>

          <a
            href="tel:0779143855"
            className="font-sans text-sm font-light transition-colors duration-200"
            style={{ color: "rgba(42,35,32,0.5)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#2A2320")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(42,35,32,0.5)")
            }
          >
            {t.ctaBanner.phoneLabel} · {t.contact.info.phone}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
