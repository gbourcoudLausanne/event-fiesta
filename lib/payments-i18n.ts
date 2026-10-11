// Textes du suivi des paiements (page client + e-mails), FR / ES / EN.

export type PayLang = "fr" | "es" | "en";

type PayDict = {
  trackTitle: string;
  trackSubtitle: string;
  stepAccepted: string;
  deposit: string;
  balance: string;
  payment: string;
  dueNow: string;
  paidOn: (date: string) => string;
  toPay: string;
  paid: string;
  payTwint: string;
  twintHint: (amount: string, ref: string) => string;
  copy: string;
  copied: string;
  orTransfer: string;
  eventDay: string;
  allPaid: string;
  remaining: (amount: string) => string;
  // e-mails
  depositMailTitle: string;
  depositMailBody: (amount: string, phone: string, ref: string) => string;
  receivedSubject: (label: string) => string;
  receivedTitle: string;
  receivedBody: (label: string, amount: string) => string;
  nextStep: (label: string, amount: string, due: string) => string;
  allPaidMail: string;
  viewTracking: string;
};

export const PAY_I18N: Record<PayLang, PayDict> = {
  fr: {
    trackTitle: "Suivi de votre événement",
    trackSubtitle: "Les étapes et les paiements, au même endroit.",
    stepAccepted: "Devis accepté",
    deposit: "Acompte",
    balance: "Solde",
    payment: "Paiement",
    dueNow: "À régler dès maintenant",
    paidOn: (d) => `Reçu le ${d} — merci !`,
    toPay: "À payer",
    paid: "Payé",
    payTwint: "Payer par Twint",
    twintHint: (a, r) => `Envoyez ${a} par Twint au numéro ci-dessous, avec le message « ${r} ».`,
    copy: "Copier",
    copied: "Copié !",
    orTransfer: "ou par virement",
    eventDay: "Jour de l'événement",
    allPaid: "Tout est réglé, merci !",
    remaining: (a) => `Reste à payer : ${a}`,
    depositMailTitle: "Prochaine étape : l'acompte",
    depositMailBody: (a, p, r) =>
      `Pour lancer la préparation (achat du matériel), merci de régler l'acompte de ${a} par Twint au ${p}, avec le message « ${r} ».`,
    receivedSubject: (l) => `Paiement reçu — ${l}`,
    receivedTitle: "Paiement bien reçu, merci !",
    receivedBody: (l, a) => `Nous avons bien reçu votre ${l.toLowerCase()} de ${a}.`,
    nextStep: (l, a, d) => `Prochaine étape : ${l.toLowerCase()} de ${a} — ${d}.`,
    allPaidMail: "Tout est réglé. Il ne reste plus qu'à profiter de votre événement !",
    viewTracking: "Voir le suivi en ligne",
  },
  es: {
    trackTitle: "Seguimiento de tu evento",
    trackSubtitle: "Las etapas y los pagos, en un solo lugar.",
    stepAccepted: "Presupuesto aceptado",
    deposit: "Anticipo",
    balance: "Saldo",
    payment: "Pago",
    dueNow: "A pagar desde ahora",
    paidOn: (d) => `Recibido el ${d} — ¡gracias!`,
    toPay: "Por pagar",
    paid: "Pagado",
    payTwint: "Pagar con Twint",
    twintHint: (a, r) => `Envía ${a} por Twint al número de abajo, con el mensaje « ${r} ».`,
    copy: "Copiar",
    copied: "¡Copiado!",
    orTransfer: "o por transferencia",
    eventDay: "Día del evento",
    allPaid: "¡Todo está pagado, gracias!",
    remaining: (a) => `Queda por pagar: ${a}`,
    depositMailTitle: "Siguiente paso: el anticipo",
    depositMailBody: (a, p, r) =>
      `Para empezar la preparación (compra del material), por favor paga el anticipo de ${a} por Twint al ${p}, con el mensaje « ${r} ».`,
    receivedSubject: (l) => `Pago recibido — ${l}`,
    receivedTitle: "¡Pago recibido, gracias!",
    receivedBody: (l, a) => `Hemos recibido tu ${l.toLowerCase()} de ${a}.`,
    nextStep: (l, a, d) => `Siguiente paso: ${l.toLowerCase()} de ${a} — ${d}.`,
    allPaidMail: "Todo está pagado. ¡Solo queda disfrutar de tu evento!",
    viewTracking: "Ver el seguimiento en línea",
  },
  en: {
    trackTitle: "Your event tracker",
    trackSubtitle: "Steps and payments, all in one place.",
    stepAccepted: "Quote accepted",
    deposit: "Deposit",
    balance: "Balance",
    payment: "Payment",
    dueNow: "Due now",
    paidOn: (d) => `Received on ${d} — thank you!`,
    toPay: "To pay",
    paid: "Paid",
    payTwint: "Pay with Twint",
    twintHint: (a, r) => `Send ${a} via Twint to the number below, with the message "${r}".`,
    copy: "Copy",
    copied: "Copied!",
    orTransfer: "or by bank transfer",
    eventDay: "Event day",
    allPaid: "Everything is paid, thank you!",
    remaining: (a) => `Remaining: ${a}`,
    depositMailTitle: "Next step: the deposit",
    depositMailBody: (a, p, r) =>
      `To start the preparation (buying the materials), please pay the ${a} deposit via Twint to ${p}, with the message "${r}".`,
    receivedSubject: (l) => `Payment received — ${l}`,
    receivedTitle: "Payment received, thank you!",
    receivedBody: (l, a) => `We have received your ${l.toLowerCase()} of ${a}.`,
    nextStep: (l, a, d) => `Next step: ${l.toLowerCase()} of ${a} — ${d}.`,
    allPaidMail: "Everything is paid. All that's left is to enjoy your event!",
    viewTracking: "View the tracker online",
  },
};

export function paymentLabel(p: { kind: string; label: string | null }, t: PayDict) {
  if (p.label?.trim()) return p.label;
  return p.kind === "acompte" ? t.deposit : p.kind === "solde" ? t.balance : t.payment;
}

// Échéance affichée : texte saisi par l'admin, sinon "dès maintenant" pour l'acompte
// et l'échéance du solde du devis (traduite si disponible) pour le solde.
export function paymentDue(
  p: { kind: string; due_label: string | null },
  t: PayDict,
  balanceTerms: string | null | undefined,
) {
  if (p.due_label?.trim()) return p.due_label;
  if (p.kind === "acompte") return t.dueNow;
  return balanceTerms?.trim() || "";
}

// Message Twint à indiquer : la référence du devis + l'étape (ex: "D-2026-7126 acompte").
export function twintReference(reference: string, label: string) {
  return `${reference} ${label.toLowerCase()}`;
}
