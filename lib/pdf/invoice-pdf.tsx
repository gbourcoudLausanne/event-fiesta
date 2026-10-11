import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
// Importer devis-pdf enregistre aussi les polices (Montserrat, DM Serif, Cormorant)
import { BalloonIcon } from "@/lib/pdf/devis-pdf";

const PINK = "#D9628A";
const PINK_DEEP = "#C24B72";
const INK = "#0D0B08";
const MUTED = "rgba(13,11,8,0.5)";
const MUTED_LIGHT = "rgba(13,11,8,0.4)";
const BORDER = "rgba(13,11,8,0.1)";
const BLUSH = "#F5E6E0";
const CREME_2 = "#F3EDE6";

const s = StyleSheet.create({
  page: { fontFamily: "Montserrat", fontSize: 9.5, color: INK, padding: 28, paddingBottom: 60 },
  header: { backgroundColor: BLUSH, borderRadius: 18, padding: 22, marginBottom: 20, flexDirection: "row", justifyContent: "space-between" },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoEvent: { fontWeight: 500, fontSize: 13, letterSpacing: 2, marginLeft: 7 },
  logoFiesta: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 19, color: PINK, marginLeft: 5 },
  sender: { fontSize: 8, color: MUTED, marginTop: 8, marginLeft: 25, lineHeight: 1.45 },
  title: { fontFamily: "DM Serif Display", fontSize: 28, textAlign: "right" },
  badge: { alignSelf: "flex-end", marginTop: 7, backgroundColor: "rgba(217,98,138,0.14)", borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  badgeText: { fontSize: 8, color: PINK_DEEP, fontWeight: 600 },
  meta: { fontSize: 8.5, textAlign: "right", color: MUTED, marginTop: 5 },

  infoGrid: { flexDirection: "row", gap: 24, marginBottom: 16 },
  infoBlock: { flex: 1, borderLeftWidth: 2, borderLeftColor: PINK, paddingLeft: 10 },
  infoLabel: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 4 },
  infoValue: { fontSize: 10, lineHeight: 1.4 },

  table: { borderTopWidth: 1, borderTopColor: INK },
  thRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, backgroundColor: CREME_2, borderBottomWidth: 1, borderBottomColor: "rgba(13,11,8,0.15)" },
  row: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 40, textAlign: "right" },
  colUnit: { width: 56, textAlign: "center" },
  colPrice: { width: 70, textAlign: "right" },
  colTotal: { width: 76, textAlign: "right" },
  th: { fontSize: 7, letterSpacing: 0.8, color: MUTED_LIGHT, fontWeight: 600 },
  td: { fontSize: 9.5, lineHeight: 1.35 },

  totals: { marginTop: 12, alignSelf: "flex-end", width: 230 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalLabel: { fontSize: 9.5, color: MUTED },
  totalValue: { fontSize: 9.5 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 7, marginTop: 4, borderTopWidth: 1, borderTopColor: INK },
  grandLabel: { fontSize: 11, fontWeight: 700 },
  grandValue: { fontSize: 11, fontWeight: 700 },
  dueBox: { marginTop: 10, backgroundColor: BLUSH, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dueLabel: { fontFamily: "DM Serif Display", fontSize: 13 },
  dueValue: { fontFamily: "DM Serif Display", fontSize: 15, color: PINK_DEEP },

  payBlock: { marginTop: 22, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: BORDER },
  payTitle: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 7 },
  payRow: { flexDirection: "row", marginBottom: 4 },
  payKey: { width: 92, fontSize: 9, color: MUTED },
  payVal: { flex: 1, fontSize: 9, fontWeight: 600 },
  payHint: { fontSize: 8, color: MUTED, marginTop: 5, lineHeight: 1.4 },

  thanks: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 12, color: PINK, marginTop: 18, textAlign: "center" },
  footer: { position: "absolute", bottom: 20, left: 28, right: 28, borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: MUTED },
});

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Zurich" });
}

export type InvoicePdfProps = {
  reference: string;
  createdAt: string;
  dueDate: string | null;
  client: { full_name: string; email: string | null; phone: string | null; address: string | null };
  quoteReference: string | null;
  items: { description: string; quantity: number; unit: string; unit_price: number }[];
  taxRate: number;
  alreadyPaid: number;
  status: string;
  settings: {
    creditor_name: string | null;
    creditor_address: string | null;
    creditor_zip: string | null;
    creditor_city: string | null;
    iban: string | null;
    twint_phone: string | null;
  } | null;
};

export function InvoicePdfDocument(p: InvoicePdfProps) {
  const subtotal = p.items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
  const tax = subtotal * (p.taxRate / 100);
  const total = subtotal + tax;
  const due = Math.max(0, Math.round((total - p.alreadyPaid) * 100) / 100);
  const st = p.settings;
  const senderLines = [st?.creditor_name, st?.creditor_address, [st?.creditor_zip, st?.creditor_city].filter(Boolean).join(" ")].filter(Boolean);
  const paidInFull = p.status === "payee" || due <= 0;

  return (
    <Document title={`Facture ${p.reference}`}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <View style={s.logoRow}>
              <BalloonIcon size={18} gradientId="invBalloon" />
              <Text style={s.logoEvent}>EVENT</Text>
              <Text style={s.logoFiesta}>Fiesta</Text>
            </View>
            {senderLines.length > 0 && <Text style={s.sender}>{senderLines.join("\n")}</Text>}
          </View>
          <View>
            <Text style={s.title}>Facture</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>N° {p.reference}</Text>
            </View>
            <Text style={s.meta}>Date : {fmtDate(p.createdAt)}</Text>
            {p.dueDate && !paidInFull && <Text style={s.meta}>Échéance : {fmtDate(p.dueDate)}</Text>}
          </View>
        </View>

        <View style={s.infoGrid}>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>FACTURÉ À</Text>
            <Text style={s.infoValue}>
              {[p.client.full_name, p.client.address, p.client.email, p.client.phone].filter(Boolean).join("\n")}
            </Text>
          </View>
          {p.quoteReference && (
            <View style={s.infoBlock}>
              <Text style={s.infoLabel}>RÉFÉRENCE</Text>
              <Text style={s.infoValue}>Devis {p.quoteReference}</Text>
            </View>
          )}
        </View>

        <View style={s.table}>
          <View style={s.thRow}>
            <Text style={[s.th, s.colDesc]}>DESCRIPTION</Text>
            <Text style={[s.th, s.colQty]}>QTÉ</Text>
            <Text style={[s.th, s.colUnit]}>UNITÉ</Text>
            <Text style={[s.th, s.colPrice]}>PRIX UNIT.</Text>
            <Text style={[s.th, s.colTotal]}>TOTAL</Text>
          </View>
          {p.items.map((it, i) => (
            <View key={i} style={s.row} wrap={false}>
              <Text style={[s.td, s.colDesc]}>{it.description}</Text>
              <Text style={[s.td, s.colQty]}>{it.quantity}</Text>
              <Text style={[s.td, s.colUnit]}>{it.unit}</Text>
              <Text style={[s.td, s.colPrice]}>{chf(it.unit_price)}</Text>
              <Text style={[s.td, s.colTotal]}>{chf(it.quantity * it.unit_price)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totals} wrap={false}>
          {p.taxRate > 0 && (
            <>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Sous-total</Text>
                <Text style={s.totalValue}>{chf(subtotal)}</Text>
              </View>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>TVA {p.taxRate}%</Text>
                <Text style={s.totalValue}>{chf(tax)}</Text>
              </View>
            </>
          )}
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>Total</Text>
            <Text style={s.grandValue}>{chf(total)}</Text>
          </View>
          {p.alreadyPaid > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Déjà payé</Text>
              <Text style={s.totalValue}>− {chf(p.alreadyPaid)}</Text>
            </View>
          )}
          <View style={s.dueBox}>
            <Text style={s.dueLabel}>{paidInFull ? "Payée" : "Reste à payer"}</Text>
            <Text style={s.dueValue}>{chf(paidInFull ? 0 : due)}</Text>
          </View>
        </View>

        {!paidInFull && (st?.twint_phone || st?.iban) && (
          <View style={s.payBlock} wrap={false}>
            <Text style={s.payTitle}>PAIEMENT</Text>
            {st?.twint_phone && (
              <View style={s.payRow}>
                <Text style={s.payKey}>Twint</Text>
                <Text style={s.payVal}>{st.twint_phone}</Text>
              </View>
            )}
            {st?.iban && (
              <View style={s.payRow}>
                <Text style={s.payKey}>Virement</Text>
                <Text style={s.payVal}>
                  {st.creditor_name ? `${st.creditor_name} — ` : ""}
                  {st.iban}
                </Text>
              </View>
            )}
            <Text style={s.payHint}>Merci d&apos;indiquer « {p.reference} » en communication.</Text>
          </View>
        )}

        <Text style={s.thanks}>Merci pour votre confiance !</Text>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>Event Fiesta · Lausanne et Suisse romande</Text>
          <Text style={s.footerText}>contact@eventfiesta.ch · +41 77 914 38 55</Text>
        </View>
      </Page>
    </Document>
  );
}
