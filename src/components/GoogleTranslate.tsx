import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
    __gt_loaded?: boolean;
  }
}

/**
 * Injects the Google Translate widget (hidden) so the whole DOM can be
 * translated client-side. The source language is French (site content is
 * primarily authored in French); target languages are en / fr / de.
 *
 * Language switching is driven by the `googtrans` cookie set in
 * LanguageSwitcher, followed by a reload.
 */
export function GoogleTranslate() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__gt_loaded) return;
    window.__gt_loaded = true;

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "fr",
            includedLanguages: "en,fr,de",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      } catch (e) {
        console.error("Google Translate init failed", e);
      }
    };

    const s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />;
}
