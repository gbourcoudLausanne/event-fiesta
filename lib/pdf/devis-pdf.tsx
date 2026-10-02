import { Document, Page, View, Text, Font, StyleSheet, Svg, Path, Ellipse, Defs, LinearGradient, Stop } from "@react-pdf/renderer";
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
const PINK_DEEP = "#C24B72";
const INK = "#0D0B08";
const MUTED = "rgba(13,11,8,0.5)";
const MUTED_LIGHT = "rgba(13,11,8,0.4)";
const BORDER = "rgba(13,11,8,0.1)";
const BLUSH = "#F5E6E0";
const CREME_2 = "#F3EDE6";

const styles = StyleSheet.create({
  page: { fontFamily: "Montserrat", fontSize: 9.5, color: INK },

  headerBand: {
    backgroundColor: BLUSH,
    paddingTop: 36,
    paddingBottom: 26,
    paddingHorizontal: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: { flexDirection: "row", alignItems: "baseline", marginLeft: 7 },
  logoEvent: { fontFamily: "Montserrat", fontWeight: 500, fontSize: 13, letterSpacing: 2 },
  logoFiesta: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 19, color: PINK, marginLeft: 5 },
  tagline: { fontSize: 6.5, letterSpacing: 1.6, color: MUTED_LIGHT, marginTop: 3, marginLeft: 25 },

  docTitle: { fontFamily: "DM Serif Display", fontSize: 26, textAlign: "right", color: INK },
  docMeta: { fontSize: 8.5, textAlign: "right", color: MUTED, marginTop: 5, lineHeight: 1.5 },

  body: { padding: 44, paddingTop: 30 },

  intro: {
    fontFamily: "Cormorant Garamond",
    fontStyle: "italic",
    fontSize: 13,
    color: INK,
    lineHeight: 1.5,
    marginBottom: 24,
    paddingBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  infoGrid: { flexDirection: "row", gap: 24, marginBottom: 26 },
  infoBlock: { flex: 1, borderLeftWidth: 2, borderLeftColor: PINK, paddingLeft: 10 },
  infoLabel: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 5 },
  infoValue: { fontSize: 10, lineHeight: 1.55, color: INK },

  table: { borderTopWidth: 1, borderTopColor: INK, marginTop: 4 },
  tableHeaderRow: {
    flexDirection: "row", paddingVertical: 7, paddingHorizontal: 6,
    backgroundColor: CREME_2, borderBottomWidth: 1, borderBottomColor: "rgba(13,11,8,0.15)",
  },
  tableRow: { flexDirection: "row", paddingVertical: 9, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 44, textAlign: "right" },
  colUnit: { width: 56, textAlign: "center" },
  colPrice: { width: 68, textAlign: "right" },
  colTotal: { width: 72, textAlign: "right" },
  th: { fontSize: 7, letterSpacing: 0.8, color: MUTED_LIGHT, fontWeight: 600 },
  td: { fontSize: 9.5, color: INK },

  totalsBox: { marginTop: 18, alignSelf: "flex-end", width: 230, backgroundColor: CREME_2, borderRadius: 8, padding: 14 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3.5 },
  totalsLabel: { fontSize: 9.5, color: MUTED },
  totalsValue: { fontSize: 9.5, color: INK },
  grandTotalRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingTop: 9, marginTop: 5, borderTopWidth: 1, borderTopColor: INK,
  },
  grandTotalLabel: { fontFamily: "DM Serif Display", fontSize: 14, color: INK },
  grandTotalValue: { fontFamily: "DM Serif Display", fontSize: 14, color: PINK },

  ctaBox: {
    marginTop: 28,
    backgroundColor: PINK,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: { fontSize: 9.5, color: "#FAF7F2", fontWeight: 500 },
  ctaContact: { fontSize: 9.5, color: "#FAF7F2", fontWeight: 600 },

  validity: { fontSize: 7.5, color: MUTED_LIGHT, marginTop: 10, textAlign: "center" },

  thankYou: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 12, color: PINK, marginTop: 20, textAlign: "center" },

  footer: {
    position: "absolute", bottom: 28, left: 44, right: 44,
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

function BalloonIcon() {
  return (
    <Svg width="16" height="27" viewBox="0 0 18 30">
      <Defs>
        <LinearGradient id="ballonGold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#F2879E" />
          <Stop offset="100%" stopColor={PINK_DEEP} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="9" cy="9" rx="7.8" ry="8.6" fill="url(#ballonGold)" />
      <Ellipse cx="5.8" cy="5.5" rx="2" ry="2.8" fill="#FFFFFF" fillOpacity={0.3} />
      <Path d="M7.4 17.6 Q9 20.2 10.6 17.6" stroke="url(#ballonGold)" strokeWidth={1.1} fill="url(#ballonGold)" />
      <Path d="M9 20.5 Q7.5 24 9 27.5 Q10 29.5 9 30" stroke={PINK_DEEP} strokeWidth={0.65} fill="none" />
    </Svg>
  );
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
  const firstName = client.full_name.split(" ")[0];
  const eventLabel = title || eventType || "votre événement";
  const introText =
    `Bonjour ${firstName}, c'est avec plaisir que je vous propose cette offre sur mesure pour ${eventLabel.toLowerCase()}` +
    `${venue ? ` à ${venue}` : ""} — pensée pour vous, selon tout ce que vous m'avez partagé.`;

  return (
    <Document title={`Devis ${reference} — Event Fiesta`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand}>
          <View>
            <View style={styles.logoRow}>
              <BalloonIcon />
              <View style={styles.logoText}>
                <Text style={styles.logoEvent}>EVENT</Text>
                <Text style={styles.logoFiesta}>Fiesta</Text>
              </View>
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

        <View style={styles.body}>
          <Text style={styles.intro}>{introText}</Text>

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

          <View style={styles.ctaBox}>
            <Text style={styles.ctaText}>Une question sur ce devis ?</Text>
            <Text style={styles.ctaContact}>WhatsApp +41 77 914 38 55</Text>
          </View>
          <Text style={styles.validity}>Devis valable 30 jours à compter de la date d&apos;émission.</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Event Fiesta · Lausanne & Suisse romande</Text>
          <Text style={styles.footerText}>contact@eventfiesta.ch · +41 77 914 38 55</Text>
        </View>
      </Page>
    </Document>
  );
}
