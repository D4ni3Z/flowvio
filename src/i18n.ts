// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend) // Carica le traduzioni da /public/locales
    .use(LanguageDetector) // Rileva la lingua del browser
    .use(initReactI18next) // Passa l'istanza di i18n a react-i18next
    .init({
        fallbackLng: 'en', // Lingua di fallback
        debug: true, // Attiva i log in console (utile per lo sviluppo)
        interpolation: {
            escapeValue: false, // React già protegge da XSS
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
    });

export default i18n;