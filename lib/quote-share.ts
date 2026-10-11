// Textes et liens pour envoyer un devis au client (WhatsApp / e-mail),
// dans la langue choisie pour le client.

export type ShareLang = "fr" | "es" | "en";

const COPY: Record<ShareLang, {
  greeting: (firstName: string) => string;
  body: (title: string) => string;
  cta: string;
  closing: string;
  subject: (title: string) => string;
  button: string;
}> = {
  fr: {
    greeting: (n) => `Bonjour ${n},`,
    body: (t) => `Voici votre devis « ${t} ». Vous pouvez le consulter et le signer en ligne :`,
    cta: "N'hésitez pas si vous avez des questions.",
    closing: "Belle journée,\nEvent Fiesta",
    subject: (t) => `Votre devis Event Fiesta — ${t}`,
    button: "Voir et signer le devis",
  },
  es: {
    greeting: (n) => `Hola ${n},`,
    body: (t) => `Aquí está tu presupuesto « ${t} ». Puedes consultarlo y firmarlo en línea:`,
    cta: "No dudes en escribirnos si tienes alguna pregunta.",
    closing: "¡Un abrazo!\nEvent Fiesta",
    subject: (t) => `Tu presupuesto Event Fiesta — ${t}`,
    button: "Ver y firmar el presupuesto",
  },
  en: {
    greeting: (n) => `Hello ${n},`,
    body: (t) => `Here is your quote "${t}". You can view and sign it online:`,
    cta: "Feel free to reach out if you have any questions.",
    closing: "Best regards,\nEvent Fiesta",
    subject: (t) => `Your Event Fiesta quote — ${t}`,
    button: "View and sign the quote",
  },
};

export function shareCopy(lang: ShareLang) {
  return COPY[lang] ?? COPY.fr;
}

export function firstNameOf(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export function quoteMessage(lang: ShareLang, clientName: string, title: string, link: string) {
  const c = shareCopy(lang);
  return `${c.greeting(firstNameOf(clientName))}\n\n${c.body(title)}\n${link}\n\n${c.cta}\n\n${c.closing}`;
}

// wa.me veut le numéro international en chiffres seuls (ex: 41791234567).
// Les numéros suisses saisis en "079…" sont convertis en 41…
export function whatsappUrl(phone: string | null, text: string) {
  let digits = (phone ?? "").replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = "41" + digits.slice(1);
  const base = digits.length >= 8 ? `https://wa.me/${digits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}
