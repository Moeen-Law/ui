import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import UI Translation dictionaries
import arTranslation from "../locales/ar/translation.json";
import enTranslation from "../locales/en/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],
    debug: false,
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
  });

// Sync document dir and lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir();
  document.documentElement.lang = lng;
});

// Run once on init
document.documentElement.dir = i18n.dir();
document.documentElement.lang = i18n.language || "ar";

export default i18n;
