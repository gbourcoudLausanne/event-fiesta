"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";

const ease = [0.16, 1, 0.3, 1] as const;

export function CtaBanner() {
  const reduce = useReducedMotion();
  const router = useRouter();

  return (
    <section
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: "#F3EDE6" }}
    >
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 90% at 50% 50%, rgba(217,98,138,0.1) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Decorative rings */}
      {[500, 350, 200].map((size, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: size,
            height: size,
            border: `1px solid rgba(217,98,138,${0.06 + i * 0.02})`,
          }}
          aria-hidden
        />
      ))}

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="font-sans text-[11px] uppercase tracking-[0.3em] mb-6"
          style={{ color: "#D9628A" }}
        >
          Commençons ensemble
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-serif font-light italic leading-[1.2] mb-10"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            color: "#0D0B08",
          }}
        >
          Votre prochaine célébration
          <br />
          mérite l'excellence.
        </motion.h2>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <button
            onClick={() => router.push("/contact")}
            className="btn-gold-shimmer font-sans text-sm font-medium px-10 py-4 rounded-full cursor-pointer active:scale-[0.97] transition-all duration-300"
            style={{ background: "#D9628A", color: "#0D0B08" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#F4A8B8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "#D9628A")
            }
          >
            Demander un devis gratuit
          </button>

          <a
            href="tel:0779143855"
            className="font-sans text-sm font-light transition-colors duration-200"
            style={{ color: "rgba(13,11,8,0.5)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#0D0B08")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(13,11,8,0.5)")
            }
          >
            ou appelez-nous · 077 914 38 55
          </a>
        </motion.div>

        {/* Mini stats */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45, ease }}
          className="flex items-center justify-center gap-8 mt-14"
        >
          {[
            { value: "200+", label: "événements" },
            { value: "5★", label: "satisfaction" },
            { value: "100%", label: "sur mesure" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="font-serif font-light"
                style={{ fontSize: "1.5rem", color: "#D9628A" }}
              >
                {value}
              </span>
              <span
                className="font-sans text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "rgba(13,11,8,0.4)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
