import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, DM_Serif_Display } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://event-fiesta.ch"),
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
    canonical: "https://event-fiesta.ch",
  },
  openGraph: {
    title: "Event Fiesta — Décoration sur mesure · Lausanne",
    description:
      "Décoration d'événements sur mesure à Lausanne et en Suisse romande. Anniversaires, baptêmes, baby showers, soirées à thème et plus.",
    locale: "fr_CH",
    type: "website",
    siteName: "Event Fiesta",
    images: [
      {
        url: "/Galerie/Hero/Hero_3.jpg",
        width: 1200,
        height: 630,
        alt: "Event Fiesta — Décoration événementielle Lausanne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Fiesta — Décoration sur mesure · Lausanne",
    description: "Décoration d'événements sur mesure à Lausanne et en Suisse romande.",
    images: ["/Galerie/Hero/Hero_3.jpg"],
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
      className={`${cormorant.variable} ${montserrat.variable} ${dmSerif.variable} antialiased`}
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
