export type DevisLang = "fr" | "es" | "en";

type DevisDict = {
  locale: string;
  tagline: string;
  quoteWord: string;
  ref: string;
  client: string;
  event: string;
  prestation: string;
  qty: string;
  unit: string;
  unitPrice: string;
  total: string;
  subtotal: string;
  service: string;
  description: string;
  vat: (rate: number) => string;
  packageTotalLabel: string;
  paymentConditions: string;
  depositAtOrder: string;
  balance: string;
  payment: string;
  paymentMethodIban: string;
  paymentMethodTwint: string;
  paymentMethodCarte: string;
  coordsOnWhatsapp: string;
  askTwintOnWhatsapp: string;
  referenceImagesTitle: string;
  notesTitle: string;
  notesP1: string;
  notesP2: string;
  thankYou: string;
  ctaQuestion: string;
  validity: string;
  intro: (firstName: string, eventLabel: string, venue: string | null) => string;
  signedTitle: string;
  signedBy: (name: string, date: string) => string;
  bonCommandeTitle: string;
  bonCommandeSubtitle: string;
  yourName: string;
  namePlaceholder: string;
  signatureLabel: string;
  clear: string;
  accept: string;
  sending: string;
  errorName: string;
  errorSignature: string;
  thanksName: (name: string) => string;
  thanksBody: string;
  footerRegion: string;
};

export const DEVIS_I18N: Record<DevisLang, DevisDict> = {
  fr: {
    locale: "fr-CH",
    tagline: "Décoration sur mesure · Lausanne",
    quoteWord: "Devis",
    ref: "Réf.",
    client: "Client",
    event: "Événement",
    prestation: "Prestation",
    qty: "Qté",
    unit: "Unité",
    unitPrice: "P.U.",
    total: "Total",
    subtotal: "Sous-total",
    service: "Service",
    description: "Description",
    vat: (rate) => `TVA (${rate}%)`,
    packageTotalLabel: "Prix total du forfait :",
    paymentConditions: "Conditions de paiement",
    depositAtOrder: "Acompte à la commande",
    balance: "Solde",
    payment: "Paiement",
    paymentMethodIban: "Virement bancaire",
    paymentMethodTwint: "Twint",
    paymentMethodCarte: "Carte bancaire sur place",
    coordsOnWhatsapp: "coordonnées sur",
    askTwintOnWhatsapp: "demander le numéro sur WhatsApp",
    referenceImagesTitle: "Images de référence",
    notesTitle: "Conditions et observations",
    notesP1:
      "Le prix comprend la décoration et le montage des éléments décrits ci-dessus. La nourriture, les boissons, le gâteau et les amuse-bouches visibles sur les images de référence ne sont pas inclus, sauf accord exprès.",
    notesP2:
      "Les images sont des références visuelles créées avec l'IA pour représenter le style, les couleurs et la proposition générale. La décoration finale suivra cette inspiration et pourra présenter de légères variations selon l'espace et les matériaux disponibles.",
    thankYou: "Merci de votre confiance — j'ai hâte de donner vie à votre événement.",
    ctaQuestion: "Une question sur ce devis ?",
    validity: "Devis valable 30 jours à compter de la date d'émission.",
    intro: (firstName, eventLabel, venue) =>
      `Bonjour ${firstName}, c'est avec plaisir que je vous propose cette offre sur mesure pour ${eventLabel.toLowerCase()}` +
      `${venue ? ` à ${venue}` : ""} — pensée pour vous, selon tout ce que vous m'avez partagé.`,
    signedTitle: "✓ Devis accepté",
    signedBy: (name, date) => `Signé par ${name} le ${date}`,
    bonCommandeTitle: "Bon pour commande",
    bonCommandeSubtitle: "En signant ci-dessous, vous confirmez accepter ce devis tel que décrit.",
    yourName: "Votre nom",
    namePlaceholder: "Prénom Nom",
    signatureLabel: "Signature",
    clear: "Effacer",
    accept: "J'accepte ce devis",
    sending: "Envoi…",
    errorName: "Merci d'indiquer votre nom.",
    errorSignature: "Merci de signer dans le cadre ci-dessus.",
    thanksName: (name) => `Merci ${name} !`,
    thanksBody: "Votre devis a bien été accepté — je reviens vers vous très vite pour la suite.",
    footerRegion: "Lausanne & Suisse romande",
  },
  es: {
    locale: "es-ES",
    tagline: "Decoración a medida · Lausana",
    quoteWord: "Presupuesto",
    ref: "Ref.",
    client: "Cliente",
    event: "Evento",
    prestation: "Prestación",
    qty: "Cant.",
    unit: "Unidad",
    unitPrice: "P.U.",
    total: "Total",
    subtotal: "Subtotal",
    service: "Servicio",
    description: "Descripción",
    vat: (rate) => `IVA (${rate}%)`,
    packageTotalLabel: "Precio total del paquete:",
    paymentConditions: "Condiciones de pago",
    depositAtOrder: "Anticipo al confirmar",
    balance: "Saldo",
    payment: "Pago",
    paymentMethodIban: "Transferencia bancaria",
    paymentMethodTwint: "Twint",
    paymentMethodCarte: "Tarjeta en el lugar",
    coordsOnWhatsapp: "datos por",
    askTwintOnWhatsapp: "pedir el número por WhatsApp",
    referenceImagesTitle: "Imágenes de referencia",
    notesTitle: "Condiciones y observaciones",
    notesP1:
      "El precio incluye la decoración y el montaje de los elementos descritos anteriormente. Los alimentos, bebidas, pastel y pasabocas que aparecen en las imágenes de referencia no están incluidos, salvo acuerdo expreso.",
    notesP2:
      "Las imágenes son referencias visuales creadas con IA para representar el estilo, los colores y la propuesta general. La decoración final seguirá esta inspiración y podrá presentar pequeñas variaciones según el espacio y los materiales disponibles.",
    thankYou: "Gracias por tu confianza — tengo muchas ganas de darle vida a tu evento.",
    ctaQuestion: "¿Alguna pregunta sobre este presupuesto?",
    validity: "Presupuesto válido durante 30 días desde la fecha de emisión.",
    intro: (firstName, eventLabel, venue) =>
      `Hola ${firstName}, es un placer presentarte esta propuesta a medida para ${eventLabel.toLowerCase()}` +
      `${venue ? ` en ${venue}` : ""} — pensada para ti, según todo lo que me has compartido.`,
    signedTitle: "✓ Presupuesto aceptado",
    signedBy: (name, date) => `Firmado por ${name} el ${date}`,
    bonCommandeTitle: "Visto bueno para confirmar",
    bonCommandeSubtitle: "Al firmar a continuación, confirmas que aceptas este presupuesto tal como se describe.",
    yourName: "Tu nombre",
    namePlaceholder: "Nombre Apellido",
    signatureLabel: "Firma",
    clear: "Borrar",
    accept: "Acepto este presupuesto",
    sending: "Enviando…",
    errorName: "Por favor indica tu nombre.",
    errorSignature: "Por favor firma en el recuadro de arriba.",
    thanksName: (name) => `¡Gracias ${name}!`,
    thanksBody: "Tu presupuesto ha sido aceptado — te contactaré muy pronto para seguir adelante.",
    footerRegion: "Lausana y Suiza romanda",
  },
  en: {
    locale: "en-GB",
    tagline: "Custom decor · Lausanne",
    quoteWord: "Quote",
    ref: "Ref.",
    client: "Client",
    event: "Event",
    prestation: "Service",
    qty: "Qty",
    unit: "Unit",
    unitPrice: "Unit price",
    total: "Total",
    subtotal: "Subtotal",
    service: "Service",
    description: "Description",
    vat: (rate) => `VAT (${rate}%)`,
    packageTotalLabel: "Total package price:",
    paymentConditions: "Payment terms",
    depositAtOrder: "Deposit on booking",
    balance: "Balance",
    payment: "Payment",
    paymentMethodIban: "Bank transfer",
    paymentMethodTwint: "Twint",
    paymentMethodCarte: "Card on site",
    coordsOnWhatsapp: "details on",
    askTwintOnWhatsapp: "ask for the number on WhatsApp",
    referenceImagesTitle: "Reference images",
    notesTitle: "Terms and notes",
    notesP1:
      "The price includes the decoration and setup of the items described above. Food, drinks, cake, and snacks shown in the reference images are not included unless explicitly agreed.",
    notesP2:
      "The images are AI-generated visual references representing the style, colours, and overall concept. The final decoration will follow this inspiration and may show slight variations depending on the venue and available materials.",
    thankYou: "Thank you for your trust — I can't wait to bring your event to life.",
    ctaQuestion: "Any questions about this quote?",
    validity: "Quote valid for 30 days from the issue date.",
    intro: (firstName, eventLabel, venue) =>
      `Hi ${firstName}, I'm delighted to offer you this tailor-made proposal for ${eventLabel.toLowerCase()}` +
      `${venue ? ` at ${venue}` : ""} — designed just for you, based on everything you've shared with me.`,
    signedTitle: "✓ Quote accepted",
    signedBy: (name, date) => `Signed by ${name} on ${date}`,
    bonCommandeTitle: "Approval to proceed",
    bonCommandeSubtitle: "By signing below, you confirm you accept this quote as described.",
    yourName: "Your name",
    namePlaceholder: "First Last",
    signatureLabel: "Signature",
    clear: "Clear",
    accept: "I accept this quote",
    sending: "Sending…",
    errorName: "Please enter your name.",
    errorSignature: "Please sign in the box above.",
    thanksName: (name) => `Thank you ${name}!`,
    thanksBody: "Your quote has been accepted — I'll be in touch very soon to move forward.",
    footerRegion: "Lausanne & French-speaking Switzerland",
  },
};
