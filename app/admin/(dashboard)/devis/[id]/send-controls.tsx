"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { WhatsappLogo, EnvelopeSimple, CheckCircle, ArrowSquareOut } from "@phosphor-icons/react";
import { quoteMessage, whatsappUrl, type ShareLang } from "@/lib/quote-share";
import { markQuoteSent, sendQuoteByEmail } from "../send-actions";
import CopyLinkButton from "./copy-link-button";

const LANG_LABEL: Record<ShareLang, string> = { fr: "français", es: "espagnol", en: "anglais" };

export default function SendControls({
  quoteId,
  link,
  title,
  lang,
  clientName,
  clientEmail,
  clientPhone,
}: {
  quoteId: string;
  link: string;
  title: string;
  lang: ShareLang;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
}) {
  const router = useRouter();
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const waHref = whatsappUrl(clientPhone, quoteMessage(lang, clientName, title, link));

  function onWhatsapp() {
    // On ne peut pas savoir si le message part vraiment : on marque "Envoyé" à l'ouverture.
    markQuoteSent(quoteId).then(() => router.refresh());
  }

  function sendEmail() {
    setError(null);
    startTransition(async () => {
      const res = await sendQuoteByEmail(quoteId);
      setConfirmEmail(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      setEmailSent(true);
      router.refresh();
    });
  }

  const btn = "flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 font-sans text-[13px] font-medium sm:py-2";

  return (
    <div>
      <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
        Lien de signature client
      </p>
      <p className="mb-2 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Le client consulte et signe le devis en ligne via ce lien.
      </p>
      <div className="mb-4 flex items-center gap-2">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl px-3 py-2.5 font-sans text-[12.5px] transition-colors hover:bg-black/[0.03]"
          style={{ background: "var(--creme-2)", color: "var(--noir)" }}
          title="Ouvrir la page client"
        >
          <span className="truncate">{link.replace(/^https:\/\//, "")}</span>
          <ArrowSquareOut size={14} className="shrink-0" style={{ color: "rgba(13,11,8,0.45)" }} />
        </a>
        <CopyLinkButton link={link} />
      </div>

      <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(13,11,8,0.45)" }}>
        Envoyer au client · message en {LANG_LABEL[lang]}
      </p>

      {error && (
        <div className="mb-3 rounded-xl px-4 py-2.5 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {error}
        </div>
      )}

      {confirmEmail ? (
        <div className="flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--creme-2)" }}>
          <p className="min-w-0 break-all font-sans text-[13px]" style={{ color: "var(--noir)" }}>
            Envoyer le devis à <strong>{clientEmail}</strong> ?
          </p>
          <div className="grid shrink-0 grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConfirmEmail(false)}
              disabled={isPending}
              className={btn}
              style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)", background: "#fff" }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={sendEmail}
              disabled={isPending}
              className={btn + " disabled:opacity-60"}
              style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
            >
              {isPending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={onWhatsapp}
            className={btn}
            style={{ background: "#25D366", color: "#fff" }}
          >
            <WhatsappLogo size={17} weight="fill" /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => (emailSent ? null : setConfirmEmail(true))}
            disabled={!clientEmail || emailSent}
            title={clientEmail ? undefined : "Ajoute une adresse e-mail sur la fiche client"}
            className={btn + " disabled:opacity-50"}
            style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
          >
            {emailSent ? <CheckCircle size={16} weight="fill" style={{ color: "#4C9A6A" }} /> : <EnvelopeSimple size={16} />}
            {emailSent ? "E-mail envoyé" : clientEmail ? "E-mail" : "E-mail (pas d'adresse)"}
          </button>
        </div>
      )}
    </div>
  );
}
