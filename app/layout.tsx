import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, DM_Serif_Display, Caveat } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SplashScreen } from "@/components/SplashScreen";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eventfiesta.ch"),
  title: "Event Fiesta — Décoration sur mesure · Lausanne",
  description:
    "Décoration d'événements sur mesure à Lausanne et en Suisse romande. Anniversaires, baptêmes, baby showers, gender reveals, soirées à thème et goodies personnalisés.",
  keywords: [
    "décoration événementielle Lausanne",
    "décoration anniversaire Suisse romande",
    "baby shower Lausanne",
    "gender reveal Vaud",
    "arche de ballons",
    "baptême décoration",
    "goodies personnalisés",
    "Event Fiesta",
  ],
  alternates: {
    canonical: "https://eventfiesta.ch",
  },
  openGraph: {
    title: "Event Fiesta — Décoration sur mesure · Lausanne",
    description:
      "Décoration d'événements sur mesure à Lausanne et en Suisse romande. Anniversaires, baptêmes, baby showers, soirées à thème et plus.",
    url: "https://eventfiesta.ch",
    locale: "fr_CH",
    type: "website",
    siteName: "Event Fiesta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Fiesta — Décoration sur mesure · Lausanne",
    description: "Décoration d'événements sur mesure à Lausanne et en Suisse romande.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${montserrat.variable} ${dmSerif.variable} ${caveat.variable} antialiased`}
    >
      <body className="bg-creme text-noir font-sans min-h-screen">
        <I18nProvider>
          <SplashScreen />
          <ScrollProgress />
          <Nav />
          <WhatsAppButton />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
