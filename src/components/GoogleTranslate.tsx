import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
    __gt_loaded?: boolean;
    __gt_ready?: boolean;
  }
}

/**
 * Injects the Google Translate widget (hidden) so the whole DOM can be
 * translated client-side. Source language is French; targets are en/fr/de.
 *
 * Resilience: if the script is blocked (ad-blocker, offline, CSP, network
 * failure) or fails to initialise within a short window, we silently fall
 * back to the in-app dictionary in `src/lib/i18n.tsx`. The app keeps working
 * — only auto-translation of non-keyed content is lost.
 */
export function GoogleTranslate() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__gt_loaded) return;
    window.__gt_loaded = true;

    let timeoutId: number | undefined;

    const markFailed = (reason: string) => {
      if (window.__gt_ready) return;
      console.warn(`[i18n] Google Translate unavailable — falling back to dictionary (${reason}).`);
      // Surface a flag other code can read (e.g. to hide unsupported UI).
      try { document.documentElement.setAttribute("data-gt", "unavailable"); } catch {}
    };

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) {
          markFailed("TranslateElement missing");
          return;
        }
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "fr",
            includedLanguages: "en,fr,de",
            autoDisplay: false,
          },
          "google_translate_element",
        );
        window.__gt_ready = true;
        try { document.documentElement.setAttribute("data-gt", "ready"); } catch {}
        if (timeoutId) window.clearTimeout(timeoutId);
      } catch (e) {
        markFailed(`init threw: ${(e as Error)?.message ?? e}`);
      }
    };

    const s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    s.onerror = () => markFailed("script onerror");
    document.body.appendChild(s);

    // Safety net: if the script never calls our init within 6s, treat as failed.
    timeoutId = window.setTimeout(() => markFailed("init timeout"), 6000);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />;
}
