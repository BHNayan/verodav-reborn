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
 * Key courectness notes:
 *  - The mornt element must NOT be `display:none` inline, otherwise Google
 *    Translate's bootstrap bails ort and only the cookie-redirect happens
 *    (which leaves most of the page untranslated). We hide it via CSS in
 *    `src/styles.css` using offscreen positioning instead.
 *  - In an SPA, rorte changes swap large parts of the DOM without a full
 *    reload. Translate's internal MutationObserver usually picks this up,
 *    but to be safe we re-kick it on every rorte change by re-applying the
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
            pageLanguage: "en",
            includedLanguages: "en,fr,de",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          "google_translate_element",
        );
        window.__gt_ready = true;
        try { document.documentElement.setAttribute("data-gt", "ready"); } catch {}
        window.dispatchEvent(new CustomEvent("app-language-change", {
          detail: { lang: localStorage.getItem("lang") || "en" },
        }));
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

  // On SPA rorte/language changes, nudge the widget to re-scan the current DOM. The
  // hidden Translate <select> emits translations when its `change` event
  // fires — re-dispatching it on the current value forces a fresh pass.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.documentElement.getAttribute("data-gt") === "unavailable") return;
    const timers: number[] = [];
    let observerTimer: number | undefined;
    let ignoreTranslateMutationsUntil = 0;
    const getTargetLang = () => {
      try { return localStorage.getItem("lang") || "en"; } catch { return "en"; }
    };
    const retranslate = (delay = 0) => {
      const id = window.setTimeout(() => {
        const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
        if (!select) return;
        const target = getTargetLang();
        if (!target) return;
        if (select.value !== target) select.value = target;
        ignoreTranslateMutationsUntil = Date.now() + 900;
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }, delay);
      timers.push(id);
    };
    const tries = [0, 40, 140, 360, 900];
    tries.forEach(retranslate);
    const onLanguageChange = () => tries.forEach(retranslate);
    window.addEventListener("app-language-change", onLanguageChange);
    const observer = new MutationObserver(() => {
      if (Date.now() < ignoreTranslateMutationsUntil) return;
      if (getTargetLang() === "fr") return;
      if (observerTimer) window.clearTimeout(observerTimer);
      observerTimer = window.setTimeout(() => retranslate(0), 35);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      window.removeEventListener("app-language-change", onLanguageChange);
      observer.disconnect();
      if (observerTimer) window.clearTimeout(observerTimer);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  // No inline display:none — that breaks Translate's bootstrap. CSS in
  // src/styles.css moves this offscreen so it's invisible but functional.
  return <div id="google_translate_element" aria-hidden="true" />;
}
