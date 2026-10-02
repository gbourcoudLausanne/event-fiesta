import { Document, Page, View, Text, Font, StyleSheet } from "@react-pdf/renderer";
import path from "path";

const FONTS = path.join(process.cwd(), "lib/pdf/fonts");

Font.register({
  family: "DM Serif Display",
  fonts: [
    { src: path.join(FONTS, "DMSerifDisplay-Regular.ttf") },
    { src: path.join(FONTS, "DMSerifDisplay-Italic.ttf"), fontStyle: "italic" },
  ],
});

Font.register({
  family: "Cormorant Garamond",
  fonts: [{ src: path.join(FONTS, "CormorantGaramond-Italic.ttf"), fontStyle: "italic" }],
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FONTS, "Montserrat-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS, "Montserrat-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS, "Montserrat-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS, "Montserrat-Bold.ttf"), fontWeight: 700 },
  ],
});

const PINK = "#D9628A";
const INK = "#0D0B08";
const MUTED = "rgba(13,11,8,0.5)";
const MUTED_LIGHT = "rgba(13,11,8,0.4)";
const BORDER = "rgba(13,11,8,0.1)";

const styles = StyleSheet.create({
  page: { padding: 44, fontFamily: "Montserrat", fontSize: 9.5, color: INK },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  logoRow: { flexDirection: "row", alignItems: "baseline" },
  logoEvent: { fontFamily: "Montserrat", fontWeight: 500, fontSize: 13, letterSpacing: 2 },
  logoFiesta: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 19, color: PINK, marginLeft: 5 },
  tagline: { fontSize: 6.5, letterSpacing: 1.6, color: MUTED_LIGHT, marginTop: 3 },

  docTitle: { fontFamily: "DM Serif Display", fontSize: 25, textAlign: "right", color: INK },
  docMeta: { fontSize: 8.5, textAlign: "right", color: MUTED, marginTop: 5, lineHeight: 1.5 },

  infoGrid: { flexDirection: "row", gap: 24, marginBottom: 26 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 5 },
  infoValue: { fontSize: 10, lineHeight: 1.55, color: INK },

  table: { borderTopWidth: 1, borderTopColor: INK, marginTop: 4 },
  tableHeaderRow: { flexDirection: "row", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "rgba(13,11,8,0.2)" },
  tableRow: { flexDirection: "row", paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 44, textAlign: "right" },
  colUnit: { width: 56, textAlign: "center" },
  colPrice: { width: 68, textAlign: "right" },
  colTotal: { width: 72, textAlign: "right" },
  th: { fontSize: 7, letterSpacing: 0.8, color: MUTED_LIGHT, fontWeight: 600 },
  td: { fontSize: 9.5, color: INK },

  totalsBox: { marginTop: 18, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3.5 },
  totalsLabel: { fontSize: 9.5, color: MUTED },
  totalsValue: { fontSize: 9.5, color: INK },
  grandTotalRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingTop: 9, marginTop: 5, borderTopWidth: 1, borderTopColor: INK,
  },
  grandTotalLabel: { fontFamily: "DM Serif Display", fontSize: 14, color: INK },
  grandTotalValue: { fontFamily: "DM Serif Display", fontSize: 14, color: PINK },

  thankYou: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 12, color: PINK, marginTop: 36, textAlign: "center" },

  footer: {
    position: "absolute", bottom: 36, left: 44, right: 44,
    borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 10,
    flexDirection: "row", justifyContent: "space-between",
  },
  footerText: { fontSize: 7.5, color: MUTED },
});

function chf(n: number) {
  return "CHF " + n.toLocaleString("fr-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
}

export type DevisPdfItem = { description: string; quantity: number; unit: string; unit_price: number };

export type DevisPdfProps = {
  reference: string;
  title: string | null;
  createdAt: string;
  eventType: string | null;
  eventDate: string | null;
  venue: string | null;
  client: { full_name: string; email: string | null; phone: string | null; address: string | null };
  items: DevisPdfItem[];
  taxRate: number;
};

export function DevisPdfDocument({ reference, title, createdAt, eventType, eventDate, venue, client, items, taxRate }: DevisPdfProps) {
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <Document title={`Devis ${reference} — Event Fiesta`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.logoRow}>
              <Text style={styles.logoEvent}>EVENT</Text>
              <Text style={styles.logoFiesta}>Fiesta</Text>
            </View>
            <Text style={styles.tagline}>DÉCORATION SUR MESURE · LAUSANNE</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>Devis</Text>
            <Text style={styles.docMeta}>
              Réf. {reference}{"\n"}
              {fmtDate(createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>CLIENT</Text>
            <Text style={styles.infoValue}>
              {client.full_name}
              {client.address ? `\n${client.address}` : ""}
              {client.email ? `\n${client.email}` : ""}
              {client.phone ? `\n${client.phone}` : ""}
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>ÉVÉNEMENT</Text>
            <Text style={styles.infoValue}>
              {title || eventType || "—"}
              {eventType && title ? `\n${eventType}` : ""}
              {eventDate ? `\nLe ${fmtDate(eventDate)}` : ""}
              {venue ? `\n${venue}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colDesc]}>PRESTATION</Text>
            <Text style={[styles.th, styles.colQty]}>QTÉ</Text>
            <Text style={[styles.th, styles.colUnit]}>UNITÉ</Text>
            <Text style={[styles.th, styles.colPrice]}>P.U.</Text>
            <Text style={[styles.th, styles.colTotal]}>TOTAL</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.td, styles.colUnit]}>{item.unit}</Text>
              <Text style={[styles.td, styles.colPrice]}>{chf(item.unit_price)}</Text>
              <Text style={[styles.td, styles.colTotal]}>{chf(item.quantity * item.unit_price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Sous-total</Text>
            <Text style={styles.totalsValue}>{chf(subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>TVA ({taxRate}%)</Text>
            <Text style={styles.totalsValue}>{chf(tax)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{chf(total)}</Text>
          </View>
        </View>

        <Text style={styles.thankYou}>Merci de votre confiance — j&apos;ai hâte de donner vie à votre événement.</Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Event Fiesta · Lausanne & Suisse romande</Text>
          <Text style={styles.footerText}>contact@eventfiesta.ch · +41 77 914 38 55</Text>
        </View>
      </Page>
    </Document>
  );
}
