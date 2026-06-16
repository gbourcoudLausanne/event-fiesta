"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Phone,
  Envelope,
  MapPin,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

type FormState = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  venue: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  date: "",
  venue: "",
  message: "",
};

export function Contact() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSuccess(true);
  };

  const inputBase =
    "w-full font-sans text-sm text-noir bg-white border border-noir/20 rounded-xl px-4 py-3 focus:outline-none focus:border-or focus:ring-1 focus:ring-or/30 transition-colors placeholder:text-noir/30 disabled:opacity-50";

  const labelBase = "block font-sans text-xs font-medium text-noir/70 mb-1.5";

  const contactItems = [
    {
      icon: Phone,
      label: t.contact.info.phone,
      href: `tel:${t.contact.info.phone.replace(/\s/g, "")}`,
    },
    {
      icon: Envelope,
      label: t.contact.info.email,
      href: `mailto:${t.contact.info.email}`,
    },
    { icon: MapPin, label: t.contact.info.address, href: undefined },
    { icon: Clock, label: t.contact.info.hours, href: undefined },
  ];

  return (
    <section id="contact" className="bg-blush py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24">
          {/* Form column */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-noir leading-tight mb-3">
              {t.contact.title}
            </h2>
            <p className="font-sans text-sm text-noir/50 mb-10 leading-relaxed max-w-md">
              {t.contact.subtitle}
            </p>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="flex flex-col items-center gap-4 py-16 text-center"
              >
                <CheckCircle size={48} weight="light" className="text-or" />
                <p className="font-serif text-xl text-noir font-light">
                  {t.contact.success}
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelBase}>
                      {t.contact.fields.name}{" "}
                      <span className="text-[#8B4513]" aria-label={t.contact.required}>
                        *
                      </span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelBase}>
                      {t.contact.fields.phone}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelBase}>
                    {t.contact.fields.email}{" "}
                    <span className="text-[#8B4513]" aria-label={t.contact.required}>
                      *
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={submitting}
                  />
                </div>

                {/* Event type + Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="eventType" className={labelBase}>
                      {t.contact.fields.eventType}{" "}
                      <span className="text-[#8B4513]" aria-label={t.contact.required}>
                        *
                      </span>
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      value={form.eventType}
                      onChange={handleChange}
                      className={`${inputBase} cursor-pointer`}
                      disabled={submitting}
                    >
                      <option value="" disabled>
                        ...
                      </option>
                      {t.contact.fields.eventTypeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className={labelBase}>
                      {t.contact.fields.date}
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className={inputBase}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label htmlFor="venue" className={labelBase}>
                    {t.contact.fields.venue}
                  </label>
                  <input
                    id="venue"
                    name="venue"
                    type="text"
                    value={form.venue}
                    onChange={handleChange}
                    className={inputBase}
                    disabled={submitting}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelBase}>
                    {t.contact.fields.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t.contact.fields.messagePlaceholder}
                    className={`${inputBase} resize-none`}
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold-shimmer mt-2 self-start font-sans text-sm font-medium bg-or text-noir px-8 py-3.5 rounded-full hover:bg-[#9a7830] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {submitting ? "..." : t.contact.submit}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact info column */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col justify-start gap-8"
          >
            {/* Decorative serif quote */}
            <blockquote className="font-serif text-2xl lg:text-3xl font-light text-noir/70 italic leading-snug border-l-2 border-or pl-6 pb-1">
              Chaque détail compte. Chaque fête mérite notre attention.
            </blockquote>

            <div className="flex flex-col gap-5 mt-4">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-or/10 flex items-center justify-center mt-0.5">
                    <Icon size={16} weight="light" className="text-or" />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="font-sans text-sm text-noir/70 hover:text-noir transition-colors leading-relaxed"
                    >
                      {label}
                    </a>
                  ) : (
                    <p className="font-sans text-sm text-noir/70 leading-relaxed">
                      {label}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
