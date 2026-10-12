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

const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

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
    nextStep: (l, a, d) => `Prochaine étape : ${l.toLowerCase()} de ${a} — ${lowerFirst(d)}.`,
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
    nextStep: (l, a, d) => `Siguiente paso: ${l.toLowerCase()} de ${a} — ${lowerFirst(d)}.`,
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
    nextStep: (l, a, d) => `Next step: ${l.toLowerCase()} of ${a} — ${lowerFirst(d)}.`,
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

// ─── Relances automatiques ───────────────────────────────────────────────

export const REMINDER_I18N: Record<PayLang, {
  quoteSubject: (title: string) => string;
  quoteTitle: string;
  quoteBody: (title: string) => string;
  quoteButton: string;
  depositSubject: string;
  depositTitle: string;
  depositBody: (amount: string, phone: string, ref: string) => string;
  balanceSubject: string;
  balanceTitle: string;
  balanceBody: (amount: string, phone: string, ref: string) => string;
  trackButton: string;
  ignoreIfPaid: string;
}> = {
  fr: {
    quoteSubject: (t) => `Votre devis vous attend — ${t}`,
    quoteTitle: "Votre devis vous attend",
    quoteBody: (t) =>
      `Je me permets de revenir vers vous au sujet du devis « ${t} ». Avez-vous pu le consulter ? Il reste disponible en ligne, et je suis à votre disposition pour toute question ou adaptation.`,
    quoteButton: "Voir le devis",
    depositSubject: "Petit rappel : l'acompte de votre événement",
    depositTitle: "Rappel : acompte",
    depositBody: (a, p, r) =>
      `Petit rappel : l'acompte de ${a} n'est pas encore arrivé. Pour bloquer la date et lancer la préparation, merci de le régler par Twint au ${p}, avec le message « ${r} ».`,
    balanceSubject: "C'est bientôt le jour J !",
    balanceTitle: "Le jour J approche",
    balanceBody: (a, p, r) =>
      `Tout est prêt pour votre événement ! Petit rappel : le solde de ${a} reste à régler. Par Twint au ${p}, avec le message « ${r} ».`,
    trackButton: "Voir le suivi",
    ignoreIfPaid: "Si vous avez déjà payé, merci de ne pas tenir compte de ce message.",
  },
  es: {
    quoteSubject: (t) => `Tu presupuesto te espera — ${t}`,
    quoteTitle: "Tu presupuesto te espera",
    quoteBody: (t) =>
      `Te escribo de nuevo sobre el presupuesto « ${t} ». ¿Pudiste revisarlo? Sigue disponible en línea, y quedo a tu disposición para cualquier pregunta o ajuste.`,
    quoteButton: "Ver el presupuesto",
    depositSubject: "Pequeño recordatorio: el anticipo de tu evento",
    depositTitle: "Recordatorio: anticipo",
    depositBody: (a, p, r) =>
      `Pequeño recordatorio: el anticipo de ${a} aún no ha llegado. Para reservar la fecha y empezar la preparación, por favor págalo por Twint al ${p}, con el mensaje « ${r} ».`,
    balanceSubject: "¡Ya casi es el gran día!",
    balanceTitle: "Se acerca el gran día",
    balanceBody: (a, p, r) =>
      `¡Todo está listo para tu evento! Pequeño recordatorio: queda por pagar el saldo de ${a}. Por Twint al ${p}, con el mensaje « ${r} ».`,
    trackButton: "Ver el seguimiento",
    ignoreIfPaid: "Si ya pagaste, por favor ignora este mensaje.",
  },
  en: {
    quoteSubject: (t) => `Your quote is waiting — ${t}`,
    quoteTitle: "Your quote is waiting",
    quoteBody: (t) =>
      `I'm following up on the quote "${t}". Have you had a chance to look at it? It's still available online, and I'm happy to answer any questions or make adjustments.`,
    quoteButton: "View the quote",
    depositSubject: "Friendly reminder: your event deposit",
    depositTitle: "Reminder: deposit",
    depositBody: (a, p, r) =>
      `Friendly reminder: the ${a} deposit hasn't arrived yet. To secure the date and start the preparation, please pay it via Twint to ${p}, with the message "${r}".`,
    balanceSubject: "The big day is almost here!",
    balanceTitle: "The big day is coming",
    balanceBody: (a, p, r) =>
      `Everything is ready for your event! Friendly reminder: the ${a} balance is still due. Via Twint to ${p}, with the message "${r}".`,
    trackButton: "View the tracker",
    ignoreIfPaid: "If you've already paid, please disregard this message.",
  },
};

// ─── Ajouts après signature ──────────────────────────────────────────────

export const SUPP_I18N: Record<PayLang, {
  title: string;
  subtitle: string;
  addedOn: (date: string) => string;
  confirmedOn: (date: string) => string;
  pending: string;
  signedTotal: string;
  extras: string;
  newTotal: string;
  confirmButton: string;
  confirming: string;
  thanks: string;
}> = {
  fr: {
    title: "Ajouts après signature",
    subtitle: "Éléments ajoutés à votre demande, en plus du devis signé.",
    addedOn: (d) => `Ajouté le ${d}`,
    confirmedOn: (d) => `Confirmé le ${d}`,
    pending: "À confirmer",
    signedTotal: "Devis signé",
    extras: "Ajouts",
    newTotal: "Nouveau total",
    confirmButton: "Je confirme ces ajouts",
    confirming: "Confirmation…",
    thanks: "Merci, c'est confirmé !",
  },
  es: {
    title: "Añadidos después de la firma",
    subtitle: "Elementos añadidos a tu pedido, además del presupuesto firmado.",
    addedOn: (d) => `Añadido el ${d}`,
    confirmedOn: (d) => `Confirmado el ${d}`,
    pending: "Por confirmar",
    signedTotal: "Presupuesto firmado",
    extras: "Añadidos",
    newTotal: "Nuevo total",
    confirmButton: "Confirmo estos añadidos",
    confirming: "Confirmando…",
    thanks: "¡Gracias, está confirmado!",
  },
  en: {
    title: "Additions after signing",
    subtitle: "Items added at your request, on top of the signed quote.",
    addedOn: (d) => `Added on ${d}`,
    confirmedOn: (d) => `Confirmed on ${d}`,
    pending: "To confirm",
    signedTotal: "Signed quote",
    extras: "Additions",
    newTotal: "New total",
    confirmButton: "I confirm these additions",
    confirming: "Confirming…",
    thanks: "Thank you, it's confirmed!",
  },
};
