"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 340, damping: 26 } as const;

const FAQS = [
  {
    q: "Dans quelles zones intervenez-vous ?",
    a: "Nous intervenons principalement à Lausanne et dans toute la Suisse romande : Genève, Fribourg, Neuchâtel, Vaud, Valais. Pour les événements hors canton, contactez-nous pour un devis incluant les frais de déplacement.",
  },
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Nous recommandons de réserver au moins 3 à 4 semaines avant votre événement. Pour les grandes occasions (mariages, galas), un minimum de 2 mois est conseillé. Les demandes de dernière minute sont traitées selon les disponibilités.",
  },
  {
    q: "Proposez-vous des devis gratuits ?",
    a: "Oui, absolument. L'estimation est gratuite et sans engagement. Il vous suffit de remplir notre formulaire de contact ou de nous écrire sur WhatsApp avec les détails de votre projet.",
  },
  {
    q: "Est-ce que vous vous occupez de l'installation et du démontage ?",
    a: "Oui. Nous livrons, installons et démontions toute la décoration. Vous n'avez rien à faire : nous arrivons avant vos invités et récupérons le matériel après votre événement.",
  },
  {
    q: "Pouvez-vous vous adapter à tous les budgets ?",
    a: "Nous proposons des formules adaptées à différents budgets. Dites-nous votre enveloppe et nous concevrons la plus belle décoration possible dans ce cadre. La qualité et la créativité restent notre priorité.",
  },
  {
    q: "Peut-on personnaliser les couleurs et le thème ?",
    a: "C'est la base de notre travail ! Chaque décoration est pensée et créée sur mesure selon vos couleurs, votre thème et votre personnalité. Aucune décoration ne ressemble à une autre.",
  },
];

function FAQItem({ item, index, isOpen, onToggle }: {
  item: typeof FAQS[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease }}
      className="relative border-b overflow-hidden"
      style={{ borderColor: "rgba(13,11,8,0.12)" }}
    >
      {/* Bordure gauche animée */}
      <motion.div
        className="absolute left-0 top-0 w-0.5 rounded-full"
        style={{ background: "linear-gradient(to bottom, #F2879E, #C24B72)" }}
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "100%", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease }}
        aria-hidden
      />

      {/* Glow fond actif */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, rgba(217,98,138,0.06) 0%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <button
        onClick={onToggle}
        className="relative w-full flex items-start justify-between gap-4 py-6 pl-4 pr-0 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <motion.span
          className="font-serif font-light text-lg leading-snug flex-1"
          animate={{ color: isOpen ? "#F4A8B8" : "#0D0B08" }}
          transition={{ duration: 0.25 }}
        >
          {item.q}
        </motion.span>

        {/* Bouton + avec rotation spring */}
        <motion.span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
          animate={{
            rotate: isOpen ? 45 : 0,
            background: isOpen ? "#D9628A" : "rgba(13,11,8,0)",
            borderColor: isOpen ? "#D9628A" : "rgba(13,11,8,0.18)",
          }}
          transition={spring}
          style={{ border: "1px solid rgba(13,11,8,0.18)" }}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke="#0D0B08"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.p
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="font-sans font-light text-[14px] leading-relaxed pb-6 pl-4"
              style={{ color: "rgba(13,11,8,0.65)" }}
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ({ preview = false }: { preview?: boolean }) {
  const reduce = useReducedMotion();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = preview ? FAQS.slice(0, 4) : FAQS;

  return (
    <section className="py-24 lg:py-32" style={{ background: "#F3EDE6" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">

          {/* Left */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: "#D9628A" }}>
              Vos questions
            </p>
            <h2
              className="font-serif font-light leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", color: "#0D0B08" }}
            >
              Questions fréquentes
            </h2>
            <p
              className="font-sans font-light text-[14px] leading-relaxed mb-8"
              style={{ color: "rgba(13,11,8,0.55)" }}
            >
              Une question non répondue ? Écrivez-nous directement.
            </p>

            <motion.a
              href="https://wa.me/41779143855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[13px] font-medium px-6 py-3 rounded-full"
              style={{ background: "#25D366", color: "#fff" }}
              whileHover={reduce ? {} : { scale: 1.05 }}
              whileTap={reduce ? {} : { scale: 0.97 }}
              transition={spring}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Poser ma question
            </motion.a>
          </motion.div>

          {/* Right — accordion */}
          <div>
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
