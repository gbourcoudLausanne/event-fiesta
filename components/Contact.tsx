"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Phone, Envelope, MapPin, Clock, CheckCircle } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  venue: string;
  budget: string;
  message: string;
};

const initial: FormState = {
  name: "", phone: "", email: "", eventType: "",
  date: "", venue: "", budget: "", message: "",
};

function FloatField({
  id, label, type = "text", value, onChange, required, children,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; required?: boolean; children?: React.ReactNode;
}) {
  const hasValue = value.length > 0;
  return (
    <div className={`field-float ${hasValue ? "has-value" : ""}`}>
      {children ?? (
        <input
          id={id} name={id} type={type}
          placeholder=" " required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "off"}
        />
      )}
      <label htmlFor={id}>
        {label}{required && <span style={{ color: "#B08B3A" }}> *</span>}
      </label>
      <div
        className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300"
        style={{ background: "#B08B3A" }}
      />
    </div>
  );
}

export function Contact() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormState) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSuccess(true);
  };

  const contactItems = [
    { icon: Phone, label: t.contact.info.phone, href: `tel:${t.contact.info.phone.replace(/\s/g, "")}` },
    { icon: Envelope, label: t.contact.info.email, href: `mailto:${t.contact.info.email}` },
    { icon: MapPin, label: t.contact.info.address, href: undefined },
    { icon: Clock, label: t.contact.info.hours, href: undefined },
  ];

  return (
    <section id="contact" className="py-24 lg:py-36 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6E0 50%, #FAF7F2 100%)" }}
        aria-hidden
      />

      {/* Decorative gold circle */}
      <div
        className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(176,139,58,0.1)" }}
        aria-hidden
      />
      <div
        className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(176,139,58,0.08)" }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Info */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col justify-start"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] mb-4" style={{ color: "#B08B3A" }}>
              Nous contacter
            </p>
            <h2
              className="font-serif font-light leading-tight mb-4"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", color: "#0D0B08" }}
            >
              {t.contact.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed mb-12 max-w-md" style={{ color: "rgba(13,11,8,0.5)" }}>
              {t.contact.subtitle}
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-6 mb-12">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(176,139,58,0.1)", border: "1px solid rgba(176,139,58,0.2)" }}
                  >
                    <Icon size={16} weight="light" style={{ color: "#B08B3A" }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="font-sans text-sm transition-colors duration-200"
                      style={{ color: "rgba(13,11,8,0.65)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#B08B3A")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(13,11,8,0.65)")}
                    >
                      {label}
                    </a>
                  ) : (
                    <p className="font-sans text-sm" style={{ color: "rgba(13,11,8,0.65)" }}>{label}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote
              className="font-display font-light italic text-xl lg:text-2xl leading-snug pl-5 relative"
              style={{
                color: "rgba(13,11,8,0.55)",
                borderLeft: "2px solid #B08B3A",
              }}
            >
              Chaque détail compte.<br />Chaque fête mérite notre attention.
            </blockquote>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease }}
                  className="flex flex-col items-center justify-center gap-6 py-20 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <CheckCircle size={56} weight="light" style={{ color: "#B08B3A" }} />
                  </motion.div>
                  <p className="font-serif text-2xl font-light" style={{ color: "#0D0B08" }}>
                    {t.contact.success}
                  </p>
                  <p className="font-sans text-sm" style={{ color: "rgba(13,11,8,0.45)" }}>
                    Nous vous répondrons dans les 24 heures.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatField id="name" label={t.contact.fields.name} value={form.name} onChange={set("name")} required />
                    <FloatField id="phone" label={t.contact.fields.phone} type="tel" value={form.phone} onChange={set("phone")} />
                  </div>

                  <FloatField id="email" label={t.contact.fields.email} type="email" value={form.email} onChange={set("email")} required />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {/* Event type select */}
                    <div className={`field-float ${form.eventType ? "has-value" : ""}`}>
                      <select
                        id="eventType" name="eventType"
                        value={form.eventType}
                        onChange={(e) => set("eventType")(e.target.value)}
                        className="bg-transparent"
                        style={{ appearance: "none" }}
                        required
                      >
                        <option value="" disabled> </option>
                        {t.contact.fields.eventTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <label htmlFor="eventType">
                        {t.contact.fields.eventType}<span style={{ color: "#B08B3A" }}> *</span>
                      </label>
                    </div>
                    <FloatField id="date" label={t.contact.fields.date} type="date" value={form.date} onChange={set("date")} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FloatField id="venue" label={t.contact.fields.venue} value={form.venue} onChange={set("venue")} />
                    <FloatField id="budget" label={t.contact.fields.budget} value={form.budget} onChange={set("budget")} />
                  </div>

                  {/* Message textarea */}
                  <div className={`field-float ${form.message ? "has-value" : ""}`}>
                    <textarea
                      id="message" name="message" rows={4}
                      placeholder=" "
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      className="resize-none"
                      style={{ paddingTop: 24 }}
                    />
                    <label htmlFor="message">{t.contact.fields.message}</label>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold-shimmer font-sans text-sm font-medium px-10 py-4 rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden"
                      style={{ background: "#B08B3A", color: "#0D0B08" }}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Envoi en cours…
                        </span>
                      ) : t.contact.submit}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
