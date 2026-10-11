// Ajouts après signature : affichés dans le devis, total mis à jour, jamais effacés.

export type Supplement = {
  id: string;
  description: string;
  amount: number;
  added_at: string;
  accepted_at: string | null;
  removed_at: string | null;
  // Étape de paiement ajustée : montant ajouté au solde, ou nouvelle étape créée
  payment_id: string | null;
  payment_mode: "added_to" | "created" | null;
  // Traduction pour le client (langue du devis), générée automatiquement
  translated?: string | null;
  translated_lang?: string | null;
};

// Texte à montrer au client : la traduction si elle correspond à sa langue
export function supplementText(s: Supplement, lang: string) {
  return lang !== "fr" && s.translated_lang === lang && s.translated?.trim() ? s.translated : s.description;
}

export function allSupplements(raw: unknown): Supplement[] {
  return Array.isArray(raw) ? (raw as Supplement[]) : [];
}

export function activeSupplements(raw: unknown): Supplement[] {
  return allSupplements(raw).filter((s) => !s.removed_at);
}

export function supplementsTotal(raw: unknown) {
  return activeSupplements(raw).reduce((sum, s) => sum + Number(s.amount), 0);
}
