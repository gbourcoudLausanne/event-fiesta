"use client";

import { useState, useTransition } from "react";
import { WhatsappLogo, EnvelopeSimple, CheckCircle, FilePdf, ArrowSquareOut } from "@phosphor-icons/react";
import { whatsappUrl, firstNameOf } from "@/lib/quote-share";
import { sendInvoiceByEmail } from "../actions";
import CopyLinkButton from "../../devis/[id]/copy-link-button";

export default function InvoiceSendControls({
  invoiceId,
  reference,
  link,
  clientName,
  clientEmail,
  clientPhone,
}: {
  invoiceId: string;
  reference: string;
  link: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
}) {
  const [confirm, setConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const message = `Bonjour ${firstNameOf(clientName)},\n\nVoici votre facture ${reference} :\n${link}\n\nLes informations de paiement (Twint ou virement) y figurent.\n\nMerci et belle journée,\nEvent Fiesta`;
  const btn = "flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 font-sans text-[13px] font-medium sm:py-2";

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 md:p-5" style={{ border: "1px solid rgba(13,11,8,0.08)" }}>
      <p className="font-sans text-[13.5px] font-semibold" style={{ color: "var(--noir)" }}>
        Envoyer la facture
      </p>
      <p className="mb-2 font-sans text-[12px]" style={{ color: "rgba(13,11,8,0.5)" }}>
        Lien vers le PDF de la facture, à jour (paiements déjà reçus déduits si l&apos;option est active).
      </p>
      <div className="mb-3 flex items-center gap-2">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl px-3 py-2.5 font-sans text-[12.5px] hover:bg-black/[0.03]"
          style={{ background: "var(--creme-2)", color: "var(--noir)" }}
        >
          <span className="truncate">{link.replace(/^https:\/\//, "")}</span>
          <ArrowSquareOut size={14} className="shrink-0" style={{ color: "rgba(13,11,8,0.45)" }} />
        </a>
        <CopyLinkButton link={link} />
      </div>

      {error && (
        <div className="mb-3 rounded-xl px-4 py-2.5 font-sans text-[13px]" style={{ background: "rgba(217,98,138,0.1)", color: "#B0546F" }}>
          {error}
        </div>
      )}

      {confirm ? (
        <div className="flex flex-col gap-2 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--creme-2)" }}>
          <p className="min-w-0 break-all font-sans text-[13px]" style={{ color: "var(--noir)" }}>
            Envoyer la facture à <strong>{clientEmail}</strong> ?
          </p>
          <div className="grid shrink-0 grid-cols-2 gap-2">
            <button type="button" onClick={() => setConfirm(false)} disabled={isPending} className={btn} style={{ border: "1px solid rgba(13,11,8,0.14)", background: "#fff" }}>
              Annuler
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const res = await sendInvoiceByEmail(invoiceId);
                  setConfirm(false);
                  if (res.error) setError(res.error);
                  else setSent(true);
                });
              }}
              className={btn + " disabled:opacity-60"}
              style={{ background: "var(--rose-deep)", color: "var(--creme)" }}
            >
              {isPending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <a href={whatsappUrl(clientPhone, message)} target="_blank" rel="noreferrer" className={btn} style={{ background: "#25D366", color: "#fff" }}>
            <WhatsappLogo size={17} weight="fill" /> WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            disabled={!clientEmail || sent}
            className={btn + " disabled:opacity-50"}
            style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}
          >
            {sent ? <CheckCircle size={16} weight="fill" style={{ color: "#4C9A6A" }} /> : <EnvelopeSimple size={16} />}
            {sent ? "Envoyé" : "E-mail"}
          </button>
          <a href={`/api/factures/${invoiceId}/pdf`} target="_blank" rel="noreferrer" className={btn} style={{ border: "1px solid rgba(13,11,8,0.14)", color: "var(--noir)" }}>
            <FilePdf size={16} /> PDF
          </a>
        </div>
      )}
    </div>
  );
}
