"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
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

const HTML_LANG: Record<Lang, string> = { fr: "fr", es: "es", en: "en" };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  // Restaure le choix de langue.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ef-lang");
      if (saved === "fr" || saved === "es" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // Garde <html lang> synchronisé pour les lecteurs d'écran / SEO.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("ef-lang", next);
    } catch {}
  }, []);

  return (
    <I18nContext.Provider value={{ t: translations[lang], lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
