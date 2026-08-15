import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {translations} from "../translations";
import {Language} from "./types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: Language;
}> = ({children, initialLanguage}) => {
  // Helper to access cookies
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    if (match) return match[2];
    return null;
  };

  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage) return initialLanguage;
    if (typeof window === "undefined") return "ar";
    const saved = getCookie("dp_lang");
    return saved === "ar" || saved === "en" ? (saved as Language) : "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `dp_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in ${language}`);
        return path;
      }
      current = current[key];
    }
    return typeof current === "string" ? current : path;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{language, setLanguage, t, dir}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
