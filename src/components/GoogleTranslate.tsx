import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
    __gt_loaded?: boolean;
    __gt_ready?: boolean;
  }
}

/**
 * Injects the Google Translate widget so the WHOLE DOM (hero, products,
 * footer, admin pages, dynamic content) is translated client-side based on
 * the `googtrans` cookie set by LanguageSwitcher.
 *
 * Key correctness notes:
 *  - The mount element must NOT be `display:none` inline, otherwise Google
 *    Translate's bootstrap bails out and only the cookie-redirect happens
 *    (which leaves most of the page untranslated). We hide it via CSS in
 *    `src/styles.css` using offscreen positioning instead.
 *  - In an SPA, route changes swap large parts of the DOM without a full
 *    reload. Translate's internal MutationObserver usually picks this up,
 *    but to be safe we re-kick it on every route change by re-applying the
 *    cookie + dispatching a synthetic input event the widget listens for.
 *  - Graceful fallback: if the script is blocked / fails to init within 6s,
 *    `data-gt="unavailable"` is set on <html> and the dictionary takes over.
 */
export function GoogleTranslate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__gt_loaded) return;
    window.__gt_loaded = true;

    let timeoutId: number | undefined;

    const markFailed = (reason: string) => {
      if (window.__gt_ready) return;
      console.warn(`[i18n] Google Translate unavailable — falling back to dictionary (${reason}).`);
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
            layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
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
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    s.onerror = () => markFailed("script onerror");
    document.body.appendChild(s);

    timeoutId = window.setTimeout(() => markFailed("init timeout"), 6000);
    return () => { if (timeoutId) window.clearTimeout(timeoutId); };
  }, []);

  // On SPA route changes, nudge the widget to re-scan the new DOM. The
  // hidden Translate <select> emits translations when its `change` event
  // fires — re-dispatching it on the current value forces a fresh pass.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.documentElement.getAttribute("data-gt") === "unavailable") return;
    const tries = [80, 250, 800, 1800];
    const timers = tries.map((t) =>
      window.setTimeout(() => {
        const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
        if (!select) return;
        const target = select.value;
        if (!target) return;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }, t),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [pathname]);

  // No inline display:none — that breaks Translate's bootstrap. CSS in
  // src/styles.css moves this offscreen so it's invisible but functional.
  return <div id="google_translate_element" aria-hidden="true" />;
}
