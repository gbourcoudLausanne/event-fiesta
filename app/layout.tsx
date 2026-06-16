import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

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

export const metadata: Metadata = {
  title: "Event Fiesta - Décoration sur mesure · Lausanne",
  description:
    "Décoration d'événements sur mesure à Lausanne et en Suisse romande. Anniversaires, baptêmes, baby showers, soirées à thème et plus.",
  openGraph: {
    title: "Event Fiesta - Décoration sur mesure",
    description:
      "Décoration d'événements sur mesure à Lausanne et en Suisse romande.",
    locale: "fr_CH",
    type: "website",
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
      className={`${cormorant.variable} ${montserrat.variable} antialiased`}
    >
      <body className="bg-creme text-noir font-sans min-h-screen">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
