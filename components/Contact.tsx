"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Phone, Envelope, MapPin, Clock, CheckCircle, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 300, damping: 24 } as const;

type FormState = {
  name: string; phone: string; email: string;
  eventType: string; budget: string; date: string; venue: string; message: string;
};
const initial: FormState = { name:"", phone:"", email:"", eventType:"", budget:"", date:"", venue:"", message:"" };

const EVENT_TYPES = [
  { value:"Anniversaire",    label:"Anniversaire",  icon:"🎂" },
  { value:"Baptême",         label:"Baptême",       icon:"✨" },
  { value:"Baby Shower",     label:"Baby Shower",   icon:"🍼" },
  { value:"Gender Reveal",   label:"Gender Reveal", icon:"💝" },
  { value:"Soirée à thème",  label:"Soirée thème",  icon:"🎭" },
  { value:"Communion",       label:"Communion",     icon:"🌸" },
  { value:"Corporate",       label:"Corporate",     icon:"🏢" },
  { value:"Autre",           label:"Autre",         icon:"✦" },
];

const BUDGETS = [
  { value:"< 500 CHF",        label:"< 500 CHF"    },
  { value:"500 – 1000 CHF",   label:"500 – 1000"   },
  { value:"1000 – 2000 CHF",  label:"1000 – 2000"  },
  { value:"2000+ CHF",        label:"2000+ CHF"    },
];

// ── Floating label field ──────────────────────────────────────────────────────
function FloatField({ id, label, type="text", value, onChange, required, rows }: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; required?: boolean; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0 || type === "date";
  return (
    <div className="relative">
      {rows ? (
        <textarea
          id={id} name={id} rows={rows} placeholder=" " required={required}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="peer w-full resize-none rounded-xl px-4 pt-6 pb-3 text-[14px] outline-none transition-all duration-200"
          style={{
            background: "rgba(250,247,242,0.8)",
            border: `1px solid ${focused ? "#D9628A" : "rgba(13,11,8,0.1)"}`,
            color: "#0D0B08",
            fontFamily: "var(--font-montserrat), sans-serif",
            boxShadow: focused ? "0 0 0 3px rgba(217,98,138,0.08)" : "none",
          }}
        />
      ) : (
        <input
          id={id} name={id} type={type} placeholder=" " required={required}
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "off"}
          className="peer w-full rounded-xl px-4 pt-6 pb-3 text-[14px] outline-none transition-all duration-200"
          style={{
            background: "rgba(250,247,242,0.8)",
            border: `1px solid ${focused ? "#D9628A" : "rgba(13,11,8,0.1)"}`,
            color: "#0D0B08",
            fontFamily: "var(--font-montserrat), sans-serif",
            boxShadow: focused ? "0 0 0 3px rgba(217,98,138,0.08)" : "none",
          }}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 transition-all duration-200"
        style={{
          top: lifted ? "8px" : "50%",
          transform: lifted || rows ? "translateY(0)" : "translateY(-50%)",
          fontSize: lifted ? "10px" : "13px",
          color: lifted ? "#D9628A" : "rgba(13,11,8,0.4)",
          letterSpacing: lifted ? "0.08em" : "0",
          textTransform: lifted ? "uppercase" : "none",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        {label}{required && <span style={{ color: "#D9628A" }}> *</span>}
      </label>
    </div>
  );
}

// ── Pill selector ─────────────────────────────────────────────────────────────
function PillGroup<T extends string>({ options, value, onChange, cols = 4 }: {
  options: { value: T; label: string; icon?: string }[];
  value: T | "";
  onChange: (v: T) => void;
  cols?: number;
}) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl text-center cursor-pointer transition-colors duration-200"
            style={{
              background: active ? "#D9628A" : "rgba(250,247,242,0.8)",
              border: `1px solid ${active ? "#D9628A" : "rgba(13,11,8,0.1)"}`,
              color: active ? "#FAF7F2" : "rgba(13,11,8,0.55)",
              boxShadow: active ? "0 4px 16px rgba(217,98,138,0.2)" : "none",
            }}
          >
            {opt.icon && <span className="text-lg leading-none">{opt.icon}</span>}
            <span className="font-sans text-[11px] font-medium leading-tight">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function Contact() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const charMax = 500;

  const set = (k: keyof FormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("https://formsubmit.co/ajax/contact@eventfiesta.ch", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `Nouvelle demande — ${form.eventType || "Événement"}`,
          Nom: form.name,
          Téléphone: form.phone,
          Email: form.email,
          "Type d'événement": form.eventType,
          Budget: form.budget,
          "Date souhaitée": form.date,
          Lieu: form.venue,
          Message: form.message,
        }),
      });
      if (res.ok) { setSuccess(true); }
      else { setError(true); }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Phone,   label: t.contact.info.phone,   href: `tel:${t.contact.info.phone.replace(/\s/g,"")}` },
    { icon: Envelope,label: t.contact.info.email,   href: `mailto:${t.contact.info.email}` },
    { icon: MapPin,  label: t.contact.info.address, href: undefined },
    { icon: Clock,   label: t.contact.info.hours,   href: undefined },
  ];

  return (
    <section id="contact" className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background:"linear-gradient(135deg,#FAF7F2 0%,#F5EDE6 55%,#FAF7F2 100%)" }} aria-hidden />
      <div className="absolute -right-40 top-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ border:"1px solid rgba(217,98,138,0.07)" }} aria-hidden />
      <div className="absolute -right-20 top-20 w-[360px] h-[360px] rounded-full pointer-events-none" style={{ border:"1px solid rgba(217,98,138,0.05)" }} aria-hidden />
      <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background:"radial-gradient(circle,rgba(217,98,138,0.04) 0%,transparent 70%)" }} aria-hidden />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-14 lg:gap-20 items-start">

          {/* ── Left: info ── */}
          <motion.div
            initial={reduce ? false : { opacity:0, x:-24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, amount:0.2 }}
            transition={{ duration:0.7, ease }}
            className="lg:sticky lg:top-28 flex flex-col"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] mb-4" style={{ color:"#D9628A" }}>
              Nous contacter
            </p>
            <h2
              className="font-serif font-light leading-tight mb-4"
              style={{ fontSize:"clamp(2.2rem,4.5vw,3.5rem)", color:"#0D0B08" }}
            >
              {t.contact.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed mb-10 max-w-sm" style={{ color:"rgba(13,11,8,0.5)" }}>
              {t.contact.subtitle}
            </p>

            {/* Contact items */}
            <div className="flex flex-col gap-4 mb-8">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <motion.div
                  key={label}
                  whileHover={reduce ? {} : { x: 4 }}
                  transition={spring}
                  className="flex items-center gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background:"rgba(217,98,138,0.1)", border:"1px solid rgba(217,98,138,0.18)" }}>
                    <Icon size={16} weight="light" style={{ color:"#D9628A" }} />
                  </div>
                  {href ? (
                    <a href={href} className="font-sans text-sm group flex items-center gap-1.5 transition-colors duration-200" style={{ color:"rgba(13,11,8,0.62)" }}
                      onMouseEnter={e => (e.currentTarget.style.color="#D9628A")}
                      onMouseLeave={e => (e.currentTarget.style.color="rgba(13,11,8,0.62)")}
                    >
                      {label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <p className="font-sans text-sm" style={{ color:"rgba(13,11,8,0.62)" }}>{label}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* WhatsApp card */}
            <motion.a
              href="https://wa.me/41779143855?text=Bonjour%20Event%20Fiesta%20!%20Je%20souhaite%20un%20devis%20pour%20mon%20événement."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduce ? {} : { scale:1.02, y:-2 }}
              whileTap={reduce ? {} : { scale:0.98 }}
              transition={spring}
              className="flex items-center gap-4 p-5 rounded-2xl mb-10 group"
              style={{ background:"#25D366", boxShadow:"0 8px 24px rgba(37,211,102,0.25)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background:"rgba(255,255,255,0.18)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-sans text-[13px] font-semibold text-white">Écrire sur WhatsApp</p>
                <p className="font-sans text-[11px] text-white/70">Réponse garantie en moins de 30 min</p>
              </div>
              <ArrowRight size={18} className="text-white/60 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>

            {/* Quote */}
            <blockquote
              className="font-serif font-light italic text-xl leading-snug pl-5"
              style={{ color:"rgba(13,11,8,0.45)", borderLeft:"2px solid #D9628A" }}
            >
              Chaque détail compte.<br />Chaque fête mérite notre attention.
            </blockquote>
          </motion.div>

          {/* ── Right: form card ── */}
          <motion.div
            initial={reduce ? false : { opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.15 }}
            transition={{ duration:0.7, delay:0.12, ease }}
          >
            <div
              className="rounded-3xl p-8 lg:p-10"
              style={{
                background:"rgba(255,255,255,0.75)",
                backdropFilter:"blur(12px)",
                border:"1px solid rgba(217,98,138,0.1)",
                boxShadow:"0 8px 48px rgba(13,11,8,0.08), 0 1px 2px rgba(13,11,8,0.04)",
              }}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity:0, scale:0.95 }}
                    animate={{ opacity:1, scale:1 }}
                    transition={{ duration:0.4, ease }}
                    className="flex flex-col items-center justify-center gap-5 py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale:0 }}
                      animate={{ scale:1 }}
                      transition={{ type:"spring", stiffness:200, damping:14, delay:0.1 }}
                    >
                      <CheckCircle size={60} weight="light" style={{ color:"#D9628A" }} />
                    </motion.div>
                    <h3 className="font-serif text-2xl font-light" style={{ color:"#0D0B08" }}>
                      Demande envoyée !
                    </h3>
                    <p className="font-sans text-sm max-w-xs" style={{ color:"rgba(13,11,8,0.45)" }}>
                      Nous vous recontactons dans les 24 heures. En attendant, retrouvez-nous sur WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/41779143855"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 font-sans text-[13px] font-medium px-6 py-3 rounded-full"
                      style={{ background:"#25D366", color:"#fff" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Nous écrire
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-7"
                  >
                    {/* Header formulaire */}
                    <div className="flex items-center justify-between pb-5 border-b" style={{ borderColor:"rgba(13,11,8,0.07)" }}>
                      <div>
                        <h3 className="font-serif text-xl font-light" style={{ color:"#0D0B08" }}>Votre demande</h3>
                        <p className="font-sans text-[12px] mt-0.5" style={{ color:"rgba(13,11,8,0.38)" }}>Gratuit · Sans engagement</p>
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full" style={{ background:"rgba(217,98,138,0.1)", color:"#D9628A" }}>
                        Devis gratuit
                      </span>
                    </div>

                    {/* Nom + Téléphone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatField id="name"  label="Nom complet" value={form.name}  onChange={set("name")}  required />
                      <FloatField id="phone" label="Téléphone"   type="tel" value={form.phone} onChange={set("phone")} />
                    </div>

                    {/* Email */}
                    <FloatField id="email" label="Adresse email" type="email" value={form.email} onChange={set("email")} required />

                    {/* Type d'événement — pills */}
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color:"rgba(13,11,8,0.4)" }}>
                        Type d'événement <span style={{ color:"#D9628A" }}>*</span>
                      </p>
                      <PillGroup
                        options={EVENT_TYPES}
                        value={form.eventType as typeof EVENT_TYPES[0]["value"] | ""}
                        onChange={v => set("eventType")(v)}
                        cols={4}
                      />
                    </div>

                    {/* Budget — pills */}
                    <div>
                      <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color:"rgba(13,11,8,0.4)" }}>
                        Budget estimé
                      </p>
                      <PillGroup
                        options={BUDGETS}
                        value={form.budget as typeof BUDGETS[0]["value"] | ""}
                        onChange={v => set("budget")(v)}
                        cols={4}
                      />
                    </div>

                    {/* Date + Lieu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatField id="date"  label="Date de l'événement" type="date"  value={form.date}  onChange={set("date")} />
                      <FloatField id="venue" label="Lieu / Ville"                     value={form.venue} onChange={set("venue")} />
                    </div>

                    {/* Message + compteur */}
                    <div className="relative">
                      <FloatField id="message" label="Décrivez votre événement…" value={form.message} onChange={v => set("message")(v.slice(0, charMax))} rows={4} />
                      <span
                        className="absolute bottom-3 right-4 font-sans text-[10px]"
                        style={{ color: form.message.length > charMax * 0.85 ? "#D9628A" : "rgba(13,11,8,0.3)" }}
                      >
                        {form.message.length}/{charMax}
                      </span>
                    </div>

                    {/* Erreur */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                          className="font-sans text-[12px] text-center"
                          style={{ color:"#c0392b" }}
                        >
                          Une erreur est survenue. Essayez par WhatsApp ou email directement.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={submitting || !form.name || !form.email || !form.eventType}
                      whileHover={reduce ? {} : { scale: 1.015 }}
                      whileTap={reduce ? {} : { scale: 0.985 }}
                      transition={spring}
                      className="btn-gold-shimmer w-full flex items-center justify-center gap-3 font-sans text-[14px] font-medium py-4 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background:"#D9628A", color:"#FAF7F2" }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity=".25"/>
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".75"/>
                          </svg>
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          Envoyer ma demande
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>

                    <p className="font-sans text-center text-[11px]" style={{ color:"rgba(13,11,8,0.3)" }}>
                      Réponse sous 24h · Devis gratuit · Sans engagement
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
