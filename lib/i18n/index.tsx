"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { fr } from "./fr";
import { es } from "./es";
import { en } from "./en";

export type Lang = "fr" | "es" | "en";
export type Translations = typeof fr;

const translations = { fr, es, en };

type I18nContextType = {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextType>({
  t: fr,
  lang: "fr",
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  return (
    <I18nContext.Provider value={{ t: translations[lang], lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
