import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

// Funzione di esempio per inizializzare Google Analytics.
// Questa verrà chiamata solo dopo il consenso.
const initializeAnalytics = () => {
    // Sostituisci G-XXXXXXXXXX con il tuo ID di misurazione di Google Analytics 4
    const measurementId = "G-XXXXXXXXXX";

    // Controlla se lo script è già stato aggiunto per evitare duplicati
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-inline-script';
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
    `;
    document.head.appendChild(inlineScript);

    console.log("Google Analytics Inizializzato.");
};


const CookieConsentBanner = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [isConsentGiven, setIsConsentGiven] = useState(false);

    // Controlla al caricamento se il consenso è già stato dato
    useEffect(() => {
        const consent = getCookieConsentValue("flowvio-cookie-consent");
        if (consent === "true") {
            setIsConsentGiven(true);
            initializeAnalytics();
        }
    }, []);

    const handleAccept = () => {
        if (!isConsentGiven) {
            initializeAnalytics();
            setIsConsentGiven(true);
        }
    };

    return (
        <CookieConsent
            location="bottom"
            buttonText={t('cookie_banner.accept_button')}
            declineButtonText={t('cookie_banner.decline_button')}
            cookieName="flowvio-cookie-consent"
            style={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderTop: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }}
            buttonStyle={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontSize: "14px",
                borderRadius: '6px',
                padding: '10px 20px'
            }}
            declineButtonStyle={{
                backgroundColor: 'transparent',
                color: theme.palette.text.primary,
                fontSize: "14px",
                borderRadius: '6px',
                padding: '10px 20px',
                border: `1px solid ${theme.palette.divider}`
            }}
            expires={150}
            enableDeclineButton
            onAccept={handleAccept}
        >
            {t('cookie_banner.text')}{" "}
            <Link to="/legal" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
                {t('cookie_banner.policy_link')}
            </Link>
        </CookieConsent>
    );
};

export default CookieConsentBanner;