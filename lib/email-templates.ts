// Gabarits HTML pour les e-mails envoyés depuis le formulaire de contact.
// Tout en styles inline (tableaux) — c'est la seule façon fiable de rendre
// correctement dans Gmail/Outlook/Apple Mail, qui ignorent les <style> et
// une bonne partie du CSS moderne.

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

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
