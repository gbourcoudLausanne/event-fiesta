// Gabarits HTML pour les e-mails envoyés depuis le formulaire de contact.
// Tout en styles inline (tableaux) — c'est la seule façon fiable de rendre
// correctement dans Gmail/Outlook/Apple Mail, qui ignorent les <style> et
// une bonne partie du CSS moderne.

import { shareCopy } from "./quote-share";
import { PAY_I18N } from "./payments-i18n";

const BRAND = {
  pink: "#D9628A",
  pinkDark: "#B0546F",
  cream: "#FAF7F2",
  ink: "#2A2320",
  muted: "rgba(42,35,32,0.55)",
};

const SANS = "Arial, Helvetica, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function wrapper(inner: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light">
    <style>:root { color-scheme: light only; }</style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.cream};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;">
            ${inner}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function header(title: string, subtitle?: string): string {
  return `
  <tr>
    <td style="background:${BRAND.pink};padding:32px 32px 28px;">
      <p style="margin:0;color:#ffffff;font-size:12.5px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.85;font-family:${SANS};">Event Fiesta</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:21px;font-weight:600;font-family:${SERIF};">${title}</h1>
      ${subtitle ? `<p style="margin:6px 0 0;color:rgba(255,255,255,0.92);font-size:13.5px;font-family:${SANS};">${subtitle}</p>` : ""}
    </td>
  </tr>`;
}

function footer(ref: string): string {
  return `
  <tr>
    <td style="padding:18px 32px 26px;border-top:1px solid rgba(42,35,32,0.08);">
      <p style="margin:0;color:${BRAND.muted};font-size:11px;font-family:${SANS};">Référence ${esc(ref)} · eventfiesta.ch</p>
    </td>
  </tr>`;
}

// Échappe le HTML et pose les espaces insécables de la typographie française
// (« merci ! » ne laisse plus le point d'exclamation seul en début de ligne).
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ ([!?:;»])/g, "&nbsp;$1")
    .replace(/« /g, "«&nbsp;");
}

// ─── E-mail interne (reçu par Event Fiesta) ──────────────────────────────

export function renderLeadEmail(opts: {
  fields: { label: string; value: string }[];
  ref: string;
  urgent: boolean;
}): string {
  const rows = opts.fields
    .map(
      (f) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(42,35,32,0.07);width:36%;vertical-align:top;">
        <span style="font-size:10.5px;letter-spacing:0.07em;text-transform:uppercase;color:${BRAND.muted};font-family:${SANS};">${esc(f.label)}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(42,35,32,0.07);vertical-align:top;">
        <span style="font-size:14px;color:${BRAND.ink};font-family:${SANS};">${esc(f.value)}</span>
      </td>
    </tr>`,
    )
    .join("");

  return wrapper(`
    ${header(opts.urgent ? "⚡ Demande urgente" : "Nouvelle demande", "Quelqu'un vient de remplir le formulaire de contact")}
    <tr>
      <td style="padding:26px 32px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>
    ${footer(opts.ref)}
  `);
}

// ─── E-mail de confirmation (reçu par le client) ─────────────────────────

type Lang = "fr" | "en" | "es";

const CLIENT_COPY: Record<
  Lang,
  {
    heading: string;
    intro: (name: string) => string;
    body: string;
    recapTitle: string;
    whatsapp: string;
    signature: string;
  }
> = {
  fr: {
    heading: "Merci pour votre message !",
    intro: (name) => `Bonjour ${name},`,
    body: "Votre demande a bien été reçue. Je reviens vers vous sous 24 h avec une première idée et une estimation pour votre événement.",
    recapTitle: "Récapitulatif de votre demande",
    whatsapp: "Une question en attendant ? Écrivez-moi sur WhatsApp",
    signature: "À très vite,<br/>Event Fiesta",
  },
  en: {
    heading: "Thank you for reaching out!",
    intro: (name) => `Hi ${name},`,
    body: "Your request has been received. I'll get back to you within 24 hours with a first idea and an estimate for your event.",
    recapTitle: "Summary of your request",
    whatsapp: "Got a question in the meantime? Message me on WhatsApp",
    signature: "Talk soon,<br/>Event Fiesta",
  },
  es: {
    heading: "¡Gracias por tu mensaje!",
    intro: (name) => `Hola ${name},`,
    body: "Hemos recibido tu solicitud. Te responderé en menos de 24 h con una primera idea y un presupuesto para tu evento.",
    recapTitle: "Resumen de tu solicitud",
    whatsapp: "¿Alguna pregunta mientras tanto? Escríbeme por WhatsApp",
    signature: "Hasta pronto,<br/>Event Fiesta",
  },
};

export function renderClientConfirmationEmail(opts: {
  lang: string;
  name: string;
  recap: { label: string; value: string }[];
  ref: string;
  waLink: string;
}): string {
  const c = CLIENT_COPY[opts.lang as Lang] ?? CLIENT_COPY.fr;

  const recapRows = opts.recap
    .map(
      (r) => `
    <tr>
      <td style="padding:5px 0;font-size:13.5px;color:${BRAND.ink};font-family:${SANS};">
        <strong>${esc(r.label)} :</strong> ${esc(r.value)}
      </td>
    </tr>`,
    )
    .join("");

  return wrapper(`
    ${header(c.heading)}
    <tr>
      <td style="padding:26px 32px 4px;font-family:${SANS};color:${BRAND.ink};font-size:14.5px;line-height:1.6;">
        <p style="margin:0 0 14px;">${esc(c.intro(opts.name))}</p>
        <p style="margin:0 0 20px;">${esc(c.body)}</p>
        ${
          opts.recap.length > 0
            ? `<p style="margin:0 0 8px;font-size:11px;letter-spacing:0.07em;text-transform:uppercase;color:${BRAND.muted};">${esc(c.recapTitle)}</p>
               <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:12px;padding:4px 14px;">${recapRows}</table>`
            : ""
        }
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 8px;">
        <a href="${opts.waLink}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:14px;font-size:13.5px;font-weight:600;font-family:${SANS};">
          ${esc(c.whatsapp)}
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 32px 4px;font-family:${SANS};color:${BRAND.ink};font-size:13.5px;">
        ${c.signature}
      </td>
    </tr>
    ${footer(opts.ref)}
  `);
}

// ─── E-mail interne : un client vient de signer un devis ─────────────────

export function renderQuoteSignedEmail(opts: {
  reference: string;
  title: string;
  clientName: string;
  signerName: string;
  eventDate: string | null;
  total: string;
  adminUrl: string;
}): string {
  const rows = [
    { label: "Client", value: opts.clientName },
    { label: "Signé par", value: opts.signerName },
    { label: "Devis", value: `${opts.title} (${opts.reference})` },
    opts.eventDate && { label: "Événement", value: opts.eventDate },
    { label: "Montant", value: opts.total },
  ]
    .filter((r): r is { label: string; value: string } => Boolean(r))
    .map(
      (f) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(42,35,32,0.07);width:36%;vertical-align:top;">
        <span style="font-size:10.5px;letter-spacing:0.07em;text-transform:uppercase;color:${BRAND.muted};font-family:${SANS};">${esc(f.label)}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(42,35,32,0.07);vertical-align:top;">
        <span style="font-size:14px;color:${BRAND.ink};font-family:${SANS};">${esc(f.value)}</span>
      </td>
    </tr>`,
    )
    .join("");

  return wrapper(`
    ${header("✓ Devis signé", `${esc(opts.clientName)} vient d'accepter et de signer le devis`)}
    <tr>
      <td style="padding:26px 32px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 28px;">
        <a href="${opts.adminUrl}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 24px;border-radius:12px;font-family:${SANS};">Ouvrir le devis</a>
      </td>
    </tr>
    ${footer(opts.reference)}
  `);
}

// ─── E-mail au client : lien vers son devis ──────────────────────────────

export function renderQuoteToClientEmail(opts: {
  lang: "fr" | "es" | "en";
  firstName: string;
  title: string;
  link: string;
}): string {
  const c = shareCopy(opts.lang);
  const p = (t: string) =>
    `<p style="margin:0 0 14px;color:${BRAND.ink};font-size:14.5px;line-height:1.6;font-family:${SANS};">${t}</p>`;

  return wrapper(`
    ${header(esc(opts.title))}
    <tr>
      <td style="padding:28px 32px 4px;">
        ${p(esc(c.greeting(opts.firstName)))}
        ${p(esc(c.body(opts.title)))}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 32px 22px;">
        <a href="${opts.link}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:14px 26px;border-radius:12px;font-family:${SANS};">${esc(c.button)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 26px;">
        ${p(esc(c.pdfNote))}
        ${p(esc(c.cta))}
        ${p(esc(c.closing).replace(/\n/g, "<br/>"))}
      </td>
    </tr>
  `);
}

// ─── E-mail au client : confirmation après signature (PDF signé joint) ────

export function renderQuoteConfirmedClientEmail(opts: {
  lang: "fr" | "es" | "en";
  firstName: string;
  title: string;
  date: string;
  time: string;
  link: string;
  depositNote?: { title: string; body: string } | null;
}): string {
  const c = shareCopy(opts.lang);
  const p = (t: string) =>
    `<p style="margin:0 0 14px;color:${BRAND.ink};font-size:14.5px;line-height:1.6;font-family:${SANS};">${t}</p>`;

  return wrapper(`
    ${header(esc(c.confirmTitle), esc(opts.title))}
    <tr>
      <td style="padding:28px 32px 4px;">
        ${p(esc(c.greeting(opts.firstName)))}
        ${p(`<strong>${esc(c.confirmIntro(opts.date, opts.time))}</strong>`)}
        ${
          opts.depositNote
            ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;background:#FBEFF2;border-radius:12px;"><tr><td style="padding:14px 16px;">
                <p style="margin:0 0 6px;color:${BRAND.pinkDark};font-size:13px;font-weight:700;font-family:${SANS};">${esc(opts.depositNote.title)}</p>
                <p style="margin:0;color:${BRAND.ink};font-size:14px;line-height:1.55;font-family:${SANS};">${esc(opts.depositNote.body)}</p>
              </td></tr></table>`
            : ""
        }
        ${p(esc(c.confirmBody))}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 32px 22px;">
        <a href="${opts.link}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:14px 26px;border-radius:12px;font-family:${SANS};">${esc(c.confirmButton)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 26px;">
        ${p(esc(c.cta))}
        ${p(esc(c.closing).replace(/\n/g, "<br/>"))}
      </td>
    </tr>
  `);
}

// ─── E-mail au client : paiement reçu (+ prochaine étape) ────────────────

export function renderPaymentReceivedEmail(opts: {
  lang: "fr" | "es" | "en";
  firstName: string;
  title: string;
  receivedLine: string;
  nextLine: string | null;
  allPaidLine: string | null;
  buttonLabel: string;
  link: string;
}): string {
  const c = shareCopy(opts.lang);
  const p = (t: string) =>
    `<p style="margin:0 0 14px;color:${BRAND.ink};font-size:14.5px;line-height:1.6;font-family:${SANS};">${t}</p>`;

  return wrapper(`
    ${header(esc(PAY_I18N[opts.lang].receivedTitle), esc(opts.title))}
    <tr>
      <td style="padding:28px 32px 4px;">
        ${p(esc(c.greeting(opts.firstName)))}
        ${p(`<strong>${esc(opts.receivedLine)}</strong>`)}
        ${opts.nextLine ? p(esc(opts.nextLine)) : ""}
        ${opts.allPaidLine ? p(esc(opts.allPaidLine)) : ""}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 32px 22px;">
        <a href="${opts.link}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:14px 26px;border-radius:12px;font-family:${SANS};">${esc(opts.buttonLabel)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 26px;">
        ${p(esc(c.closing).replace(/\n/g, "<br/>"))}
      </td>
    </tr>
  `);
}

// ─── E-mail au client : relance (devis sans réponse, acompte, solde) ─────

export function renderReminderEmail(opts: {
  lang: "fr" | "es" | "en";
  firstName: string;
  title: string;
  heading: string;
  body: string;
  footnote: string | null;
  buttonLabel: string;
  link: string;
}): string {
  const c = shareCopy(opts.lang);
  const p = (t: string) =>
    `<p style="margin:0 0 14px;color:${BRAND.ink};font-size:14.5px;line-height:1.6;font-family:${SANS};">${t}</p>`;

  return wrapper(`
    ${header(esc(opts.heading), esc(opts.title))}
    <tr>
      <td style="padding:28px 32px 4px;">
        ${p(esc(c.greeting(opts.firstName)))}
        ${p(esc(opts.body))}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 32px 22px;">
        <a href="${opts.link}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:14px 26px;border-radius:12px;font-family:${SANS};">${esc(opts.buttonLabel)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 26px;">
        ${opts.footnote ? `<p style="margin:0 0 14px;color:${BRAND.muted};font-size:12.5px;line-height:1.5;font-family:${SANS};">${esc(opts.footnote)}</p>` : ""}
        ${p(esc(c.closing).replace(/\n/g, "<br/>"))}
      </td>
    </tr>
  `);
}

// ─── E-mail interne : récap des relances envoyées ────────────────────────

export function renderRemindersDigestEmail(lines: { label: string; value: string; url: string }[]): string {
  const rows = lines
    .map(
      (l) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(42,35,32,0.07);vertical-align:top;">
        <a href="${l.url}" style="font-size:14px;color:${BRAND.ink};font-family:${SANS};text-decoration:none;font-weight:600;">${esc(l.label)}</a><br/>
        <span style="font-size:12.5px;color:${BRAND.muted};font-family:${SANS};">${esc(l.value)}</span>
      </td>
    </tr>`,
    )
    .join("");
  return wrapper(`
    ${header("Relances envoyées", "Récapitulatif automatique du jour")}
    <tr>
      <td style="padding:22px 32px 26px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>
  `);
}

// ─── E-mail au client : facture (PDF joint) ──────────────────────────────

export function renderInvoiceEmail(opts: { firstName: string; reference: string; amountDue: string; dueDate: string | null; link: string }): string {
  const p = (t: string) =>
    `<p style="margin:0 0 14px;color:${BRAND.ink};font-size:14.5px;line-height:1.6;font-family:${SANS};">${t}</p>`;
  return wrapper(`
    ${header(`Facture ${esc(opts.reference)}`)}
    <tr>
      <td style="padding:28px 32px 4px;">
        ${p(`Bonjour ${esc(opts.firstName)},`)}
        ${p(`Vous trouverez ci-joint votre facture <strong>${esc(opts.reference)}</strong>. Montant à régler : <strong>${esc(opts.amountDue)}</strong>${opts.dueDate ? `, d'ici au ${esc(opts.dueDate)}` : ""}.`)}
        ${p("Les informations de paiement (Twint ou virement) figurent sur la facture.")}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 32px 22px;">
        <a href="${opts.link}" style="display:inline-block;background:${BRAND.pink};color:#ffffff;text-decoration:none;font-size:14.5px;font-weight:600;padding:14px 26px;border-radius:12px;font-family:${SANS};">Voir la facture</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 26px;">
        ${p("Merci pour votre confiance !<br/>Event Fiesta")}
      </td>
    </tr>
  `);
}
