"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  UploadSimple,
  X,
  Plus,
  Check,
  LinkSimple,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 300, damping: 24 } as const;

const WA_NUMBER = "41779143855";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;
const FORM_ENDPOINT = "https://formsubmit.co/contact@eventfiesta.ch";
const MERCI_URL = "https://eventfiesta.ch/contact/merci";
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

const PALETTE_HEX = [
  "#E8B4C4", "#D9628A", "#C97B63", "#F0C29A", "#B7C4A8",
  "#A8CEE0", "#C9BCE0", "#E8C870", "#FAF3E9", "#2A2320",
];

const fmtMB = (b: number) => (b / 1024 / 1024).toFixed(1);

/* ── petits composants ──────────────────────────────────────────────── */

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  placeholder,
  hint,
  value,
  onChange,
  rows,
  readOnly,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  value?: string;
  onChange?: (v: string) => void;
  rows?: number;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const border = focused ? "#D9628A" : "rgba(42,35,32,0.16)";
  const shared = {
    name,
    id,
    required,
    placeholder: placeholder ?? " ",
    readOnly,
    value,
    onChange: onChange
      ? (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)
      : undefined,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      "w-full rounded-xl bg-white px-4 py-3.5 font-sans text-[14px] outline-none transition-colors duration-200 placeholder:text-[rgba(42,35,32,0.35)]",
    style: {
      border: `1px solid ${border}`,
      color: "#2A2320",
      boxShadow: focused ? "0 0 0 3px rgba(217,98,138,0.09)" : "none",
    } as const,
  };
  return (
    <label htmlFor={id} className="block">
      <span
        className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.16em]"
        style={{ color: "rgba(42,35,32,0.5)" }}
      >
        {label}
        {required && <span style={{ color: "#D9628A" }}> *</span>}
      </span>
      {rows ? (
        <textarea {...shared} rows={rows} className={`${shared.className} resize-none`} />
      ) : (
        <input {...shared} type={type} inputMode={type === "tel" ? "tel" : undefined} />
      )}
      {hint && (
        <span className="mt-1 block font-sans text-[11px]" style={{ color: "rgba(42,35,32,0.4)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className="cursor-pointer rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-colors duration-200"
      style={{
        background: active ? "#D9628A" : "#FFFFFF",
        border: `1px solid ${active ? "#D9628A" : "rgba(42,35,32,0.16)"}`,
        color: active ? "#FAF7F2" : "rgba(42,35,32,0.62)",
      }}
    >
      {children}
    </motion.button>
  );
}

function StepBlock({
  id,
  n,
  title,
  children,
  refEl,
}: {
  id: string;
  n: number;
  title: string;
  children: ReactNode;
  refEl: (el: HTMLElement | null) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      ref={refEl}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease }}
      className="scroll-mt-28"
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-semibold"
          style={{ background: "rgba(217,98,138,0.12)", color: "#B65572" }}
        >
          {n}
        </span>
        <h2
          className="font-serif font-light tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.85rem)", color: "#2A2320" }}
        >
          {title}
        </h2>
      </div>
      <div className="pl-0 sm:pl-10">{children}</div>
    </motion.section>
  );
}

/* ── page ───────────────────────────────────────────────────────────── */

export function Contact() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [venue, setVenue] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [palette, setPalette] = useState<string[]>([]);
  const [dateTbd, setDateTbd] = useState(false);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState(false);
  const [missingType, setMissingType] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const stepEls = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const charMax = 800;

  const previews = useMemo(
    () => files.map((f) => ({ key: f.name + f.size, url: URL.createObjectURL(f) })),
    [files],
  );
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) {
          const i = stepEls.current.indexOf(vis.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    stepEls.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const totalBytes = files.reduce((s, f) => s + f.size, 0);

  const syncFiles = (next: File[]) => {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (fileRef.current) fileRef.current.files = dt.files;
    setFiles(next);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const merged = [...files];
    let rejected = false;
    for (const f of Array.from(incoming)) {
      if (!f.type.startsWith("image/")) { rejected = true; continue; }
      if (merged.length >= MAX_FILES) { rejected = true; break; }
      if (merged.some((m) => m.name === f.name && m.size === f.size)) continue;
      if (merged.reduce((s, x) => s + x.size, 0) + f.size > MAX_BYTES) { rejected = true; continue; }
      merged.push(f);
    }
    setFileError(rejected);
    syncFiles(merged);
  };

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!eventType) {
      e.preventDefault();
      setMissingType(true);
      stepEls.current[1]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
  };

  const [dragOver, setDragOver] = useState(false);

  const infoItems = [
    { icon: Phone, label: t.contact.info.phone, href: `tel:+${WA_NUMBER}` },
    { icon: EnvelopeSimple, label: t.contact.info.email, href: `mailto:${t.contact.info.email}` },
    { icon: MapPin, label: t.contact.info.address, href: undefined },
    { icon: Clock, label: t.contact.info.hours, href: undefined },
  ];

  return (
    <>
      {/* ── Bandeau d'intro ── */}
      <section className="relative overflow-hidden pt-16 pb-14 lg:pt-24 lg:pb-20" style={{ background: "#F3EDE6" }}>
        <div
          className="pointer-events-none absolute -right-32 -top-40 hidden rounded-full lg:block"
          style={{ width: 520, height: 520, background: "radial-gradient(circle, rgba(217,98,138,0.09) 0%, transparent 70%)" }}
          aria-hidden
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10" style={{ background: "#D9628A" }} />
            <span className="font-sans text-[10px] uppercase tracking-[0.32em]" style={{ color: "#B65572" }}>
              {t.contact.eyebrow}
            </span>
            <span className="h-px w-10" style={{ background: "#D9628A" }} />
          </div>
          <h1
            className="font-serif font-light leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#2A2320" }}
          >
            {t.contact.title}
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl font-sans font-light text-[15px] leading-relaxed"
            style={{ color: "rgba(42,35,32,0.6)" }}
          >
            {t.contact.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <WhatsappLogo size={17} weight="fill" />
              {t.contact.quick.whatsapp}
            </a>
            <a
              href={`tel:+${WA_NUMBER}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#FFFFFF", color: "#2A2320", border: "1px solid rgba(42,35,32,0.14)" }}
            >
              <Phone size={15} weight="bold" />
              {t.contact.quick.call}
            </a>
            <a
              href={`mailto:${t.contact.info.email}`}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-[13px] font-medium transition-transform duration-200 hover:scale-[1.03]"
              style={{ background: "#FFFFFF", color: "#2A2320", border: "1px solid rgba(42,35,32,0.14)" }}
            >
              <EnvelopeSimple size={15} weight="bold" />
              {t.contact.quick.email}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Corps ── */}
      <section className="relative py-16 lg:py-24" style={{ background: "#FAF7F2" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[220px_1fr] lg:gap-16 lg:px-10">
          {/* Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-1">
              {t.contact.steps.map((s, i) => (
                <a
                  key={s}
                  href={`#step-${i}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-[13px] transition-colors duration-200"
                  style={{
                    color: active === i ? "#B65572" : "rgba(42,35,32,0.45)",
                    background: active === i ? "rgba(217,98,138,0.08)" : "transparent",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: active === i ? "#D9628A" : "rgba(42,35,32,0.25)" }}
                  />
                  {s}
                </a>
              ))}

              <div className="mt-6 flex flex-col gap-3 border-t pt-6" style={{ borderColor: "rgba(42,35,32,0.1)" }}>
                {infoItems.map(({ icon: Icon, label, href }) =>
                  href ? (
                    <a
                      key={label}
                      href={href}
                      className="group flex items-center gap-2.5 font-sans text-[12px] transition-colors duration-200"
                      style={{ color: "rgba(42,35,32,0.55)" }}
                    >
                      <Icon size={14} weight="light" style={{ color: "#B65572" }} />
                      {label}
                      <ArrowUpRight size={10} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    <p key={label} className="flex items-center gap-2.5 font-sans text-[12px]" style={{ color: "rgba(42,35,32,0.55)" }}>
                      <Icon size={14} weight="light" style={{ color: "#B65572" }} />
                      {label}
                    </p>
                  ),
                )}
              </div>
            </div>
          </aside>

          {/* Formulaire */}
          <form
            action={FORM_ENDPOINT}
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="flex flex-col gap-14"
          >
            <input
              type="hidden"
              name="_subject"
              value={`Nouvelle demande — ${eventType || "événement"}${venue ? ` · ${venue}` : ""}`}
            />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />
            <input type="hidden" name="_next" value={MERCI_URL} />
            {email && <input type="hidden" name="_replyto" value={email} />}
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

            {/* Champs transmis — ordre maîtrisé pour l'e-mail */}
            <input type="hidden" name="Type d'événement" value={eventType} />
            <input type="hidden" name="Nom" value={fullName} />
            <input type="hidden" name="Email" value={email} />
            {phone && <input type="hidden" name="Téléphone" value={phone} />}
            {(dateTbd || date) && (
              <input type="hidden" name="Date souhaitée" value={dateTbd ? t.contact.event.dateTbd : date} />
            )}
            {venue && <input type="hidden" name="Lieu" value={venue} />}
            {guests && <input type="hidden" name="Nombre d'invités" value={guests} />}
            {budget && <input type="hidden" name="Budget indicatif" value={budget} />}
            {message && <input type="hidden" name="Message" value={message} />}
            {moods.length > 0 && <input type="hidden" name="Ambiance souhaitée" value={moods.join(" · ")} />}
            {palette.length > 0 && <input type="hidden" name="Couleurs" value={palette.join(" · ")} />}
            {links
              .map((l) => l.trim())
              .filter(Boolean)
              .map((l, i) => (
                <input key={l + i} type="hidden" name={`Inspiration ${i + 1}`} value={l} />
              ))}

            {/* 1 — Vous */}
            <StepBlock id="step-0" n={1} title={t.contact.you.heading} refEl={(el) => { stepEls.current[0] = el; }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="nom" label={t.contact.you.name} required value={fullName} onChange={setFullName} />
                <Field id="email" label={t.contact.you.email} type="email" required value={email} onChange={setEmail} />
              </div>
              <div className="mt-4">
                <Field
                  id="tel"
                  label={t.contact.you.phone}
                  type="tel"
                  hint={t.contact.you.phoneHint}
                  value={phone}
                  onChange={setPhone}
                />
              </div>
            </StepBlock>

            {/* 2 — L'événement */}
            <StepBlock id="step-1" n={2} title={t.contact.event.heading} refEl={(el) => { stepEls.current[1] = el; }}>
              <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(42,35,32,0.5)" }}>
                {t.contact.event.type} <span style={{ color: "#D9628A" }}>*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {t.contact.event.typeOptions.map((o) => (
                  <Choice
                    key={o}
                    active={eventType === o}
                    onClick={() => { setEventType(o); setMissingType(false); }}
                  >
                    {o}
                  </Choice>
                ))}
              </div>
              {missingType && (
                <p className="mt-2 font-sans text-[12px]" style={{ color: "#B0546F" }}>
                  {t.contact.event.type}
                </p>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Field
                    id="date"
                    label={t.contact.event.date}
                    type={dateTbd ? "text" : "date"}
                    value={dateTbd ? t.contact.event.dateTbd : date}
                    onChange={setDate}
                    readOnly={dateTbd}
                  />
                  <button
                    type="button"
                    onClick={() => setDateTbd((v) => !v)}
                    className="mt-2 inline-flex items-center gap-1.5 font-sans text-[12px] transition-colors"
                    style={{ color: dateTbd ? "#B65572" : "rgba(42,35,32,0.45)" }}
                  >
                    <span
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px]"
                      style={{ border: `1px solid ${dateTbd ? "#D9628A" : "rgba(42,35,32,0.3)"}`, background: dateTbd ? "#D9628A" : "transparent" }}
                    >
                      {dateTbd && <Check size={9} weight="bold" style={{ color: "#fff" }} />}
                    </span>
                    {t.contact.event.dateTbd}
                  </button>
                </div>
                <Field
                  id="lieu"
                  label={t.contact.event.venue}
                  placeholder={t.contact.event.venuePlaceholder}
                  value={venue}
                  onChange={setVenue}
                />
              </div>

              <p className="mb-3 mt-6 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(42,35,32,0.5)" }}>
                {t.contact.event.guests}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.contact.event.guestsOptions.map((o) => (
                  <Choice key={o} active={guests === o} onClick={() => setGuests(guests === o ? "" : o)}>
                    {o}
                  </Choice>
                ))}
              </div>
            </StepBlock>

            {/* 3 — Budget */}
            <StepBlock id="step-2" n={3} title={t.contact.budget.heading} refEl={(el) => { stepEls.current[2] = el; }}>
              <p className="mb-4 max-w-lg font-sans font-light text-[13.5px] leading-relaxed" style={{ color: "rgba(42,35,32,0.55)" }}>
                {t.contact.budget.note}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {t.contact.budget.options.map((o) => {
                  const on = budget === o.range;
                  return (
                    <button
                      key={o.range}
                      type="button"
                      onClick={() => setBudget(on ? "" : o.range)}
                      className="rounded-2xl p-4 text-left transition-colors duration-200"
                      style={{
                        background: on ? "rgba(217,98,138,0.07)" : "#FFFFFF",
                        border: `1px solid ${on ? "#D9628A" : "rgba(42,35,32,0.14)"}`,
                      }}
                    >
                      <span className="flex items-center justify-between font-sans text-[14px] font-semibold" style={{ color: "#2A2320" }}>
                        {o.range}
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded-full"
                          style={{ border: `1px solid ${on ? "#D9628A" : "rgba(42,35,32,0.25)"}`, background: on ? "#D9628A" : "transparent" }}
                        >
                          {on && <Check size={10} weight="bold" style={{ color: "#fff" }} />}
                        </span>
                      </span>
                      <span className="mt-1.5 block font-sans font-light text-[12.5px] leading-snug" style={{ color: "rgba(42,35,32,0.55)" }}>
                        {o.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3">
                <Choice active={budget === t.contact.budget.unsure} onClick={() => setBudget(budget === t.contact.budget.unsure ? "" : t.contact.budget.unsure)}>
                  {t.contact.budget.unsure}
                </Choice>
              </div>
            </StepBlock>

            {/* 4 — Vision */}
            <StepBlock id="step-3" n={4} title={t.contact.vision.heading} refEl={(el) => { stepEls.current[3] = el; }}>
              <div className="relative">
                <Field
                  id="message"
                  label={t.contact.vision.message}
                  placeholder={t.contact.vision.messagePlaceholder}
                  rows={5}
                  value={message}
                  onChange={(v) => setMessage(v.slice(0, charMax))}
                />
                <span className="absolute bottom-2.5 right-3 font-sans text-[10px]" style={{ color: "rgba(42,35,32,0.3)" }}>
                  {message.length}/{charMax}
                </span>
              </div>

              <p className="mb-3 mt-6 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(42,35,32,0.5)" }}>
                {t.contact.vision.mood}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.contact.vision.moodOptions.map((o) => (
                  <Choice key={o} active={moods.includes(o)} onClick={() => toggle(moods, o, setMoods)}>
                    {o}
                  </Choice>
                ))}
              </div>

              <p className="mb-1 mt-6 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(42,35,32,0.5)" }}>
                {t.contact.vision.palette}
              </p>
              <p className="mb-3 font-sans text-[11px]" style={{ color: "rgba(42,35,32,0.4)" }}>
                {t.contact.vision.paletteNote}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {t.contact.vision.paletteOptions.map((name, i) => {
                  const on = palette.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggle(palette, name, setPalette)}
                      title={name}
                      aria-pressed={on}
                      aria-label={name}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
                      style={{
                        background: PALETTE_HEX[i],
                        border: "1px solid rgba(42,35,32,0.12)",
                        outline: on ? "2px solid #D9628A" : "none",
                        outlineOffset: 2,
                      }}
                    >
                      {on && (
                        <Check size={13} weight="bold" style={{ color: i === 9 ? "#fff" : "#2A2320" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </StepBlock>

            {/* 5 — Inspirations */}
            <StepBlock id="step-4" n={5} title={t.contact.inspiration.heading} refEl={(el) => { stepEls.current[4] = el; }}>
              <p className="mb-4 max-w-lg font-sans font-light text-[13.5px] leading-relaxed" style={{ color: "rgba(42,35,32,0.55)" }}>
                {t.contact.inspiration.note}
              </p>

              {/* Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                className="rounded-2xl px-6 py-8 text-center transition-colors duration-200"
                style={{
                  border: `1.5px dashed ${dragOver ? "#D9628A" : "rgba(42,35,32,0.22)"}`,
                  background: dragOver ? "rgba(217,98,138,0.05)" : "#FFFFFF",
                }}
              >
                <UploadSimple size={22} weight="light" style={{ color: "#B65572" }} className="mx-auto" />
                <p className="mt-2 font-sans text-[13.5px]" style={{ color: "rgba(42,35,32,0.6)" }}>
                  {t.contact.inspiration.upload}
                </p>
                <p className="mt-1 font-sans text-[11px]" style={{ color: "rgba(42,35,32,0.4)" }}>
                  {t.contact.inspiration.uploadHint}
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2 font-sans text-[12px] font-medium"
                  style={{ background: "#2A2320", color: "#FAF7F2" }}
                >
                  {t.contact.inspiration.uploadCta}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  name="attachment"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {fileError && (
                <p className="mt-2 font-sans text-[12px]" style={{ color: "#B0546F" }}>
                  {t.contact.inspiration.tooLarge}
                </p>
              )}

              {previews.length > 0 && (
                <>
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {previews.map((p, i) => (
                      <div key={p.key} className="group relative overflow-hidden rounded-xl" style={{ aspectRatio: "1", background: "#EBE2D8" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={files[i]?.name ?? ""} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => syncFiles(files.filter((_, j) => j !== i))}
                          aria-label="Retirer"
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full"
                          style={{ background: "rgba(42,35,32,0.7)", color: "#fff" }}
                        >
                          <X size={11} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 font-sans text-[11px]" style={{ color: "rgba(42,35,32,0.4)" }}>
                    {files.length}/{MAX_FILES} · {fmtMB(totalBytes)}/5 Mo
                  </p>
                </>
              )}

              {/* Liens */}
              <p className="mb-2 mt-7 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: "rgba(42,35,32,0.5)" }}>
                {t.contact.inspiration.links}
              </p>
              <div className="flex flex-col gap-2">
                {links.map((v, i) => (
                  <div key={i} className="relative">
                    <LinkSimple
                      size={14}
                      weight="bold"
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(42,35,32,0.35)" }}
                    />
                    <input
                      type="url"
                      value={v}
                      onChange={(e) => setLinks(links.map((x, j) => (j === i ? e.target.value : x)))}
                      placeholder={t.contact.inspiration.linksPlaceholder}
                      className="w-full rounded-xl bg-white py-3 pl-9 pr-3 font-sans text-[13.5px] outline-none placeholder:text-[rgba(42,35,32,0.35)]"
                      style={{ border: "1px solid rgba(42,35,32,0.16)", color: "#2A2320" }}
                    />
                  </div>
                ))}
              </div>
              {links.length < 3 && (
                <button
                  type="button"
                  onClick={() => setLinks([...links, ""])}
                  className="mt-2 inline-flex items-center gap-1.5 font-sans text-[12px] font-medium"
                  style={{ color: "#B65572" }}
                >
                  <Plus size={12} weight="bold" />
                  {t.contact.inspiration.addLink}
                </button>
              )}
            </StepBlock>

            {/* Envoi */}
            <div className="sm:pl-10">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={reduce ? {} : { scale: 1.015 }}
                whileTap={reduce ? {} : { scale: 0.985 }}
                transition={spring}
                className="btn-gold-shimmer flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-sans text-[14px] font-medium disabled:opacity-60"
                style={{ background: "#D9628A", color: "#FAF7F2" }}
              >
                {submitting ? t.contact.submitting : t.contact.submit}
                {!submitting && <ArrowRight size={16} weight="bold" />}
              </motion.button>
              <p className="mt-3 text-center font-sans text-[11px]" style={{ color: "rgba(42,35,32,0.4)" }}>
                {t.contact.disclaimer}
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 font-sans text-[12.5px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "#25D366" }}
              >
                <WhatsappLogo size={15} weight="fill" />
                {t.contact.altWhatsapp}
              </a>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
