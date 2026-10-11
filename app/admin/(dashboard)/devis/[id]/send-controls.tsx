"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { WhatsappLogo, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";
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
        Envoyer au client
      </p>
      <p className="mb-3 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Le client reçoit le lien pour consulter et signer le devis en ligne. Message en {LANG_LABEL[lang]}.
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
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
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
          <CopyLinkButton link={link} />
        </div>
      )}
    </div>
  );
}
