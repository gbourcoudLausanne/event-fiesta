import { Document, Page, View, Text, Font, StyleSheet, Svg, Path, Ellipse, Defs, LinearGradient, Stop } from "@react-pdf/renderer";
import path from "path";
import { DEVIS_I18N, type DevisLang } from "@/lib/devis-i18n";

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
  page: { fontFamily: "Montserrat", fontSize: 9.5, color: INK, padding: 28 },

  headerCard: {
    backgroundColor: BLUSH,
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoText: { flexDirection: "row", alignItems: "baseline", marginLeft: 7 },
  logoEvent: { fontFamily: "Montserrat", fontWeight: 500, fontSize: 13, letterSpacing: 2 },
  logoFiesta: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 19, color: PINK, marginLeft: 5 },
  tagline: { fontSize: 6.5, letterSpacing: 1.6, color: MUTED_LIGHT, marginTop: 3, marginLeft: 25 },
  logoRule: { width: 64, height: 1.4, backgroundColor: "#B08B3A", marginTop: 10, marginLeft: 25 },

  docTitle: { fontFamily: "DM Serif Display", fontSize: 28, textAlign: "right", color: INK },
  refBadge: {
    alignSelf: "flex-end", marginTop: 7,
    backgroundColor: "rgba(217,98,138,0.14)", borderRadius: 999,
    paddingVertical: 3, paddingHorizontal: 10,
  },
  refBadgeText: { fontSize: 8, letterSpacing: 0.4, color: PINK_DEEP, fontWeight: 600 },
  docMeta: { fontSize: 8.5, textAlign: "right", color: MUTED, marginTop: 6 },

  body: { paddingTop: 6 },

  intro: {
    fontFamily: "Montserrat",
    fontSize: 10,
    color: INK,
    lineHeight: 1.4,
    marginTop: 10,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  infoGrid: { flexDirection: "row", gap: 24, marginBottom: 14 },
  infoBlock: { flex: 1, borderLeftWidth: 2, borderLeftColor: PINK, paddingLeft: 10 },
  infoLabel: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 4 },
  infoValue: { fontSize: 10, lineHeight: 1.4, color: INK },

  table: { borderTopWidth: 1, borderTopColor: INK, marginTop: 2 },
  tableHeaderRow: {
    flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6,
    backgroundColor: CREME_2, borderBottomWidth: 1, borderBottomColor: "rgba(13,11,8,0.15)",
  },
  tableRow: { flexDirection: "row", paddingVertical: 5.5, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 44, textAlign: "right" },
  colUnit: { width: 56, textAlign: "center" },
  colPrice: { width: 68, textAlign: "right" },
  colTotal: { width: 72, textAlign: "right" },
  th: { fontSize: 7, letterSpacing: 0.8, color: MUTED_LIGHT, fontWeight: 600 },
  td: { fontSize: 9.5, color: INK },

  packageHeaderRow: {
    flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6,
    backgroundColor: CREME_2, borderBottomWidth: 1, borderBottomColor: "rgba(13,11,8,0.15)",
  },
  packageRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: BORDER },
  colService: { width: 130, paddingRight: 8 },
  serviceName: { fontSize: 9.5, fontWeight: 600, color: INK },

  packageTotalBanner: {
    marginTop: 12,
    backgroundColor: CREME_2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(217,98,138,0.3)",
    paddingVertical: 11,
    alignItems: "center",
  },
  packageTotalLabel: { fontFamily: "DM Serif Display", fontSize: 14, color: INK, letterSpacing: 0.3 },
  packageTotalValue: { fontFamily: "DM Serif Display", fontSize: 14, color: PINK },

  totalsBox: { marginTop: 10, alignSelf: "flex-end", width: 230, backgroundColor: CREME_2, borderRadius: 8, padding: 10 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsLabel: { fontSize: 9.5, color: MUTED },
  totalsValue: { fontSize: 9.5, color: INK },
  grandTotalRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingTop: 7, marginTop: 4, borderTopWidth: 1, borderTopColor: INK,
  },
  grandTotalLabel: { fontFamily: "DM Serif Display", fontSize: 14, color: INK },
  grandTotalValue: { fontFamily: "DM Serif Display", fontSize: 14, color: PINK },

  ctaBox: {
    marginTop: 12,
    backgroundColor: PINK,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: { fontSize: 9.5, color: "#FAF7F2", fontWeight: 500 },
  ctaContact: { fontSize: 9.5, color: "#FAF7F2", fontWeight: 600 },

  validity: { fontSize: 7.5, color: MUTED_LIGHT, marginTop: 6, textAlign: "center" },

  paymentBlock: { marginTop: 10, paddingTop: 9, borderTopWidth: 0.5, borderTopColor: BORDER },
  paymentTitle: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 5 },
  paymentRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 1.5 },
  paymentLabel: { fontSize: 9.5, color: MUTED },
  paymentValue: { fontSize: 9.5, color: INK, fontWeight: 600 },
  paymentMethods: { marginTop: 5, flexDirection: "row", flexWrap: "wrap", gap: 14 },
  paymentMethodItem: { fontSize: 8.5, color: MUTED, lineHeight: 1.3 },
  paymentMethodBold: { color: INK, fontWeight: 600 },

  notesBlock: { marginTop: 10, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: BORDER },
  notesTitle: { fontSize: 7, letterSpacing: 1.2, color: MUTED_LIGHT, marginBottom: 4 },
  notesText: { fontSize: 7, color: MUTED, lineHeight: 1.3, marginBottom: 3 },

  thankYou: { fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: 12, color: PINK, marginTop: 12, textAlign: "center" },

  footer: {
    position: "absolute", bottom: 20, left: 28, right: 28,
    borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 8,
    flexDirection: "row", justifyContent: "space-between",
  },
  footerText: { fontSize: 7.5, color: MUTED },
});

function chf(n: number) {
  const [intPart, decPart] = n.toFixed(2).split(".");
  return `CHF ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'")},${decPart}`;
}

function fmtDate(d: string | null, locale: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function BalloonIcon({
  size = 16,
  gradientId = "ballonGold",
  opacity = 1,
}: {
  size?: number;
  gradientId?: string;
  opacity?: number;
}) {
  const h = size * (27 / 16);
  return (
    <Svg width={size} height={h} viewBox="0 0 18 30">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#F2879E" />
          <Stop offset="100%" stopColor={PINK_DEEP} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="9" cy="9" rx="7.8" ry="8.6" fill={`url(#${gradientId})`} fillOpacity={opacity} />
      <Ellipse cx="5.8" cy="5.5" rx="2" ry="2.8" fill="#FFFFFF" fillOpacity={0.3 * opacity} />
      <Path
        d="M7.4 17.6 Q9 20.2 10.6 17.6"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.1}
        strokeOpacity={opacity}
        fill={`url(#${gradientId})`}
        fillOpacity={opacity}
      />
      <Path
        d="M9 20.5 Q7.5 24 9 27.5 Q10 29.5 9 30"
        stroke={PINK_DEEP}
        strokeWidth={0.65}
        strokeOpacity={opacity}
        fill="none"
      />
    </Svg>
  );
}

export type DevisPdfItem = { title?: string; description: string; quantity: number; unit: string; unit_price: number };

export type DevisPdfSettings = { creditor_name: string | null; iban: string | null; twint_phone: string | null };

export type DevisPdfTranslatedContent = {
  title?: string | null;
  event_type?: string | null;
  venue?: string | null;
  balance_due_terms?: string | null;
  items?: { title?: string | null; description?: string | null; unit?: string | null }[];
};

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
  depositPercent?: number | null;
  depositAmountFixed?: number | null;
  balanceDueTerms?: string | null;
  paymentMethods?: string[];
  settings?: DevisPdfSettings | null;
  pricingMode?: "detaille" | "forfait";
  packageTotal?: number | null;
  lang?: DevisLang;
  translatedContent?: DevisPdfTranslatedContent | null;
};

export function DevisPdfDocument({
  reference,
  title,
  createdAt,
  eventType,
  eventDate,
  venue,
  client,
  items,
  taxRate,
  depositPercent,
  depositAmountFixed,
  balanceDueTerms,
  paymentMethods = [],
  settings,
  pricingMode = "detaille",
  packageTotal,
  lang = "fr",
  translatedContent,
}: DevisPdfProps) {
  const t = DEVIS_I18N[lang];
  const tc = translatedContent ?? null;
  const displayTitle = tc?.title ?? title;
  const displayEventType = tc?.event_type ?? eventType;
  const displayVenue = tc?.venue ?? venue;
  const displayBalanceDueTerms = tc?.balance_due_terms ?? balanceDueTerms;
  const displayItems = items.map((it, i) => ({
    ...it,
    title: tc?.items?.[i]?.title ?? it.title,
    description: tc?.items?.[i]?.description ?? it.description,
    unit: tc?.items?.[i]?.unit ?? it.unit,
  }));

  const isPackageMode = pricingMode === "forfait";
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const tax = isPackageMode ? 0 : subtotal * (taxRate / 100);
  const total = isPackageMode ? packageTotal ?? 0 : subtotal + tax;
  const hasFixedDeposit = !!depositAmountFixed && depositAmountFixed > 0;
  const hasPercentDeposit = !hasFixedDeposit && !!depositPercent && depositPercent > 0;
  const hasDeposit = hasFixedDeposit || hasPercentDeposit;
  const depositAmount = hasFixedDeposit ? (depositAmountFixed as number) : hasPercentDeposit ? total * ((depositPercent as number) / 100) : 0;
  const balanceAmount = total - depositAmount;
  const showPaymentBlock = hasDeposit || !!displayBalanceDueTerms || paymentMethods.length > 0;
  const firstName = client.full_name.split(" ")[0];
  const eventLabel = displayTitle || displayEventType || t.event;
  const introText = t.intro(firstName, eventLabel, displayVenue ?? null);

  return (
    <Document title={`Devis ${reference} — Event Fiesta`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View>
              <View style={styles.logoRow}>
                <BalloonIcon />
                <View style={styles.logoText}>
                  <Text style={styles.logoEvent}>EVENT</Text>
                  <Text style={styles.logoFiesta}>Fiesta</Text>
                </View>
              </View>
              <Text style={styles.tagline}>{t.tagline.toUpperCase()}</Text>
              <View style={styles.logoRule} />
            </View>
            <View>
              <Text style={styles.docTitle}>{t.quoteWord}</Text>
              <View style={styles.refBadge}>
                <Text style={styles.refBadgeText}>{t.ref.toUpperCase()} {reference}</Text>
              </View>
              <Text style={styles.docMeta}>{fmtDate(createdAt, t.locale)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>{t.client.toUpperCase()}</Text>
              <Text style={styles.infoValue}>
                {client.full_name}
                {client.address ? `\n${client.address}` : ""}
                {client.email ? `\n${client.email}` : ""}
                {client.phone ? `\n${client.phone}` : ""}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>{t.event.toUpperCase()}</Text>
              <Text style={styles.infoValue}>
                {displayTitle || displayEventType || "—"}
                {displayEventType && displayTitle ? `\n${displayEventType}` : ""}
                {eventDate ? `\n${fmtDate(eventDate, t.locale)}` : ""}
                {displayVenue ? `\n${displayVenue}` : ""}
              </Text>
            </View>
          </View>

          <Text style={styles.intro}>{introText}</Text>

          {isPackageMode ? (
            <>
              <View style={styles.table}>
                <View style={styles.packageHeaderRow}>
                  <Text style={[styles.th, styles.colService]}>{t.service.toUpperCase()}</Text>
                  <Text style={[styles.th, styles.colDesc]}>{t.description.toUpperCase()}</Text>
                </View>
                {displayItems.map((item, i) => (
                  <View key={i} style={styles.packageRow}>
                    <Text style={[styles.serviceName, styles.colService]}>{item.title || "—"}</Text>
                    <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.packageTotalBanner}>
                <Text>
                  <Text style={styles.packageTotalLabel}>{t.packageTotalLabel} </Text>
                  <Text style={styles.packageTotalValue}>{chf(total)}</Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, styles.colDesc]}>{t.prestation.toUpperCase()}</Text>
                  <Text style={[styles.th, styles.colQty]}>{t.qty.toUpperCase()}</Text>
                  <Text style={[styles.th, styles.colUnit]}>{t.unit.toUpperCase()}</Text>
                  <Text style={[styles.th, styles.colPrice]}>{t.unitPrice.toUpperCase()}</Text>
                  <Text style={[styles.th, styles.colTotal]}>{t.total.toUpperCase()}</Text>
                </View>
                {displayItems.map((item, i) => (
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
                  <Text style={styles.totalsLabel}>{t.subtotal}</Text>
                  <Text style={styles.totalsValue}>{chf(subtotal)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>{t.vat(taxRate)}</Text>
                  <Text style={styles.totalsValue}>{chf(tax)}</Text>
                </View>
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>{t.total}</Text>
                  <Text style={styles.grandTotalValue}>{chf(total)}</Text>
                </View>
              </View>
            </>
          )}

          {showPaymentBlock && (
            <View style={styles.paymentBlock}>
              <Text style={styles.paymentTitle}>{t.paymentConditions.toUpperCase()}</Text>

              {hasDeposit ? (
                <>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>
                      {t.depositAtOrder}{hasPercentDeposit ? ` (${depositPercent}%)` : ""}
                    </Text>
                    <Text style={styles.paymentValue}>{chf(depositAmount)}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>
                      {t.balance}{displayBalanceDueTerms ? ` — ${displayBalanceDueTerms}` : ""}
                    </Text>
                    <Text style={styles.paymentValue}>{chf(balanceAmount)}</Text>
                  </View>
                </>
              ) : displayBalanceDueTerms ? (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{t.payment} — {displayBalanceDueTerms}</Text>
                  <Text style={styles.paymentValue}>{chf(total)}</Text>
                </View>
              ) : null}

              {paymentMethods.length > 0 && (
                <View style={styles.paymentMethods}>
                  {paymentMethods.includes("iban") && (
                    <Text style={styles.paymentMethodItem}>
                      <Text style={styles.paymentMethodBold}>{t.paymentMethodIban} : </Text>
                      {settings?.creditor_name ? `${settings.creditor_name} — ` : ""}
                      {settings?.iban || "—"}
                    </Text>
                  )}
                  {paymentMethods.includes("twint") && (
                    <Text style={styles.paymentMethodItem}>
                      <Text style={styles.paymentMethodBold}>{t.paymentMethodTwint} : </Text>
                      {settings?.twint_phone || "—"}
                    </Text>
                  )}
                  {paymentMethods.includes("carte") && (
                    <Text style={styles.paymentMethodItem}>
                      <Text style={styles.paymentMethodBold}>{t.paymentMethodCarte}</Text>
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.notesBlock}>
            <Text style={styles.notesTitle}>{t.notesTitle.toUpperCase()}</Text>
            <Text style={styles.notesText}>{t.notesP1}</Text>
            <Text style={styles.notesText}>{t.notesP2}</Text>
          </View>

          <Text style={styles.thankYou}>{t.thankYou}</Text>

          <View style={styles.ctaBox}>
            <Text style={styles.ctaText}>{t.ctaQuestion}</Text>
            <Text style={styles.ctaContact}>WhatsApp +41 77 914 38 55</Text>
          </View>
          <Text style={styles.validity}>{t.validity}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Event Fiesta · {t.footerRegion}</Text>
          <Text style={styles.footerText}>contact@eventfiesta.ch · +41 77 914 38 55</Text>
        </View>
      </Page>
    </Document>
  );
}
