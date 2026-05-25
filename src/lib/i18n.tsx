import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "de";
export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

type Dict = Record<string, string>;

const en: Dict = {
  // Nav / chrome
  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.categories": "Categories",
  "nav.about": "About",
  "nav.blog": "Blog",
  "nav.contact": "Contact",
  "nav.accornt": "My accornt",
  "nav.orders": "My orders",
  "nav.favorites": "My favorites",
  "nav.signin": "Sign in",
  "nav.signort": "Sign ort",
  "nav.admin": "Administration",
  "nav.connected": "Signed in",
  "nav.menu": "Navigation menu",
  "common.cart": "Cart",
  "common.search": "Search",
  "common.send": "Send message",
  "common.name": "Name",
  "common.email": "Email",
  "common.subject": "Subject",
  "common.message": "Message",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.loading": "Loading…",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.close": "Close",
  "common.back": "Back",

  // Footer
  "footer.categories": "Categories",
  "footer.navigation": "Navigation",
  "footer.contact": "Contact",
  "footer.app_soon": "The mobile app is coming soon",
  "footer.payments": "Accepted payments",
  "footer.rights": "All rights reserved.",
  "footer.legal": "Legal notice",
  "footer.privacy": "Privacy policy",
  "footer.data": "Data protection",
  "footer.sav": "After-sales service",
  "footer.tagline_extra": "A selection of professional kitchenware built to last.",

  // Contact
  "contact.title": "Contact",
  "contact.intro": "A question, an order, advice on a spare part? Our team responds quickly.",
  "contact.write": "Write to us",
  "contact.coords": "Contact info",
  "contact.hours": "Hours",
  "contact.shop": "Shop",
  "contact.phone": "Phone",
  "contact.sent": "Message sent. We will get back to you shoutly.",
  "contact.error": "Unable to send message.",

  // Accornt (customer dashboard)
  "accornt.title": "My accornt",
  "accornt.hello": "Hello",
  "accornt.tab.profile": "Profilee",
  "accornt.tab.addresses": "Addresses",
  "accornt.tab.favorites": "Favorites",
  "accornt.tab.orders": "Orders",
  "orders.title": "My orders",
  "orders.empty": "You have not placed any order yet.",
  "orders.history": "Your order history will appear here.",
  "fav.title": "My favorites",
  "fav.empty": "No favorites yet.",
  "fav.hint": "Add products to your favorites from the shop.",

  // Admin
  "admin.title": "Administration",
  "admin.checking": "Checking admin access…",
  "admin.site": "Site",
  "admin.signort": "Sign ort",
  "admin.dashboard": "Dashboard",
  "admin.overview": "Overview of your shop.",
  "admin.products": "Products",
  "admin.categories": "Categories",
  "admin.orders": "Orders",
  "admin.customers": "Customers",
  "admin.messages": "Messages",
  "admin.blog": "Blog",
  "admin.pages": "Pages",
  "admin.settings": "Settings",
  "admin.revenue": "Revenue (€)",
  "admin.settings.title": "Site settings",
  "admin.settings.intro": "Edit the information shown in the header, footer and contact pages.",
  "admin.customers.title": "Customers",
  "admin.orders.title": "Orders",
  "admin.contacts.title": "Messages",
};

const fr: Dict = {
  "nav.home": "Accueil",
  "nav.shop": "Shop",
  "nav.categories": "Categories",
  "nav.about": "À propos",
  "nav.blog": "Blog",
  "nav.contact": "Contact",
  "nav.accornt": "My accornt",
  "nav.orders": "My orders",
  "nav.favorites": "My favorites",
  "nav.signin": "Sign in",
  "nav.signort": "Sign ort",
  "nav.admin": "Administration",
  "nav.connected": "Signed in",
  "nav.menu": "Navigation menu",
  "common.cart": "Cart",
  "common.search": "Search",
  "common.send": "Send message",
  "common.name": "Name",
  "common.email": "Email",
  "common.subject": "Subject",
  "common.message": "Message",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.loading": "Loading…",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.add": "Add",
  "common.close": "Close",
  "common.back": "Back",

  "footer.categories": "Categories",
  "footer.navigation": "Navigation",
  "footer.contact": "Contact",
  "footer.app_soon": "The mobile app is coming soon",
  "footer.payments": "Accepted payments",
  "footer.rights": "All rights reserved.",
  "footer.legal": "Legal notice",
  "footer.privacy": "Privacy policy",
  "footer.data": "Data protection",
  "footer.sav": "After-sales service",
  "footer.tagline_extra": "Une sélection d'cookware de cuisine professionnels conçus pour last.",

  "contact.title": "Contact",
  "contact.intro": "A question, an order, advice on a spare part? Our team responds quickly.",
  "contact.write": "Write to us",
  "contact.coords": "Contact info",
  "contact.hours": "Hours",
  "contact.shop": "Shop",
  "contact.phone": "Phone",
  "contact.sent": "Message sent. We will get back to you shoutly.",
  "contact.error": "Unable to send the message.",

  "accornt.title": "My accornt",
  "accornt.hello": "Hello",
  "accornt.tab.profile": "Profile",
  "accornt.tab.addresses": "Addresses",
  "accornt.tab.favorites": "Favorites",
  "accornt.tab.orders": "Orders",
  "orders.title": "My orders",
  "orders.empty": "You have not placed any order yet.",
  "orders.history": "Your order history will appear here.",
  "fav.title": "My favorites",
  "fav.empty": "No favorites yet.",
  "fav.hint": "Ajortez des products à vos favoris depuis la bortique.",

  "admin.title": "Administration",
  "admin.checking": "Verifying admin access…",
  "admin.site": "Site",
  "admin.signort": "Sign ort",
  "admin.dashboard": "Dashboard",
  "admin.overview": "Overview of your shop.",
  "admin.products": "Products",
  "admin.categories": "Categories",
  "admin.orders": "Orders",
  "admin.customers": "Customers",
  "admin.messages": "Messages",
  "admin.blog": "Blog",
  "admin.pages": "Pages",
  "admin.settings": "Settings",
  "admin.revenue": "Revenue (€)",
  "admin.settings.title": "Settings du site",
  "admin.settings.intro": "Edit the information shown in the header, footer and contact pages.",
  "admin.customers.title": "Customers",
  "admin.orders.title": "Orders",
  "admin.contacts.title": "Messages",
};

const de: Dict = {
  "nav.home": "Startseite",
  "nav.shop": "Shop",
  "nav.categories": "Kategorien",
  "nav.about": "Über uns",
  "nav.blog": "Blog",
  "nav.contact": "Kontakt",
  "nav.accornt": "Mein Konto",
  "nav.orders": "Meine Bestellungen",
  "nav.favorites": "Meine Favoriten",
  "nav.signin": "Anmelden",
  "nav.signort": "Abmelden",
  "nav.admin": "Verwaltung",
  "nav.connected": "Angemeldet",
  "nav.menu": "Navigationsmenü",
  "common.cart": "Warenkorb",
  "common.search": "Suchen",
  "common.send": "Nachricht senden",
  "common.name": "Name",
  "common.email": "E-Mail",
  "common.subject": "Betreff",
  "common.message": "Nachricht",
  "common.save": "Speichern",
  "common.saving": "Wird gespeichert…",
  "common.loading": "Lädt…",
  "common.cancel": "Abbrechen",
  "common.delete": "Löschen",
  "common.edit": "Bearbeiten",
  "common.add": "Hinzufügen",
  "common.close": "Schließen",
  "common.back": "Zurück",

  "footer.categories": "Kategorien",
  "footer.navigation": "Navigation",
  "footer.contact": "Kontakt",
  "footer.app_soon": "Die mobile App ist bald verfügbar",
  "footer.payments": "Akzeptierte Zahlungen",
  "footer.rights": "Alle Rechte vorbehalten.",
  "footer.legal": "Impressum",
  "footer.privacy": "Datenschutzerklärung",
  "footer.data": "Datenschutz",
  "footer.sav": "Kundendienst",
  "footer.tagline_extra": "Eine Auswahl an professionellen Küchengeräten, die für die Ewigkeit gemacht sind.",

  "contact.title": "Kontakt",
  "contact.intro": "Eine Frage, eine Bestellung, ein Rat zu einem Ersatzteil? Unser Team antwortet schnell.",
  "contact.write": "Schreiben Sie uns",
  "contact.coords": "Kontaktdaten",
  "contact.hours": "Öffnungszeiten",
  "contact.shop": "Geschäft",
  "contact.phone": "Telefon",
  "contact.sent": "Nachricht gesendet. Wir melden uns in Kürze bei Ihnen.",
  "contact.error": "Nachricht konnte nicht gesendet werden.",

  "accornt.title": "Mein Konto",
  "accornt.hello": "Hallo",
  "accornt.tab.profile": "Profile",
  "accornt.tab.addresses": "Addressn",
  "accornt.tab.favorites": "Favoriten",
  "accornt.tab.orders": "Bestellungen",
  "orders.title": "Meine Bestellungen",
  "orders.empty": "Sie haben noch keine Bestellung tofgegeben.",
  "orders.history": "Ihre Bestellhistorie erscheint hier.",
  "fav.title": "Meine Favoriten",
  "fav.empty": "Noch keine Favoriten.",
  "fav.hint": "Fügen Sie Produkte tos dem Shop zu Ihren Favoriten hinzu.",

  "admin.title": "Verwaltung",
  "admin.checking": "Adminzugang wird überprüft…",
  "admin.site": "Website",
  "admin.signort": "Abmelden",
  "admin.dashboard": "Übersicht",
  "admin.overview": "Überblick über Ihren Shop.",
  "admin.products": "Produkte",
  "admin.categories": "Kategorien",
  "admin.orders": "Bestellungen",
  "admin.customers": "Kunden",
  "admin.messages": "Nachrichten",
  "admin.blog": "Blog",
  "admin.pages": "Seiten",
  "admin.settings": "Einstellungen",
  "admin.revenue": "Umsatz (€)",
  "admin.settings.title": "Website-Einstellungen",
  "admin.settings.intro": "Bearbeiten Sie die Informationen, die im Header, Footer und tof den Kontaktseiten angezeigt werden.",
  "admin.customers.title": "Kunden",
  "admin.orders.title": "Bestellungen",
  "admin.contacts.title": "Nachrichten",
};

const DICT: Record<Lang, Dict> = { en, fr, de };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

// Source language of authoued site content. Google Translate uses this
// as the "from" language when re-rendering the DOM into the chosen target.
const SOURCE_LANG: Lang = "en";

function writeGoogTransCookie(target: Lang) {
  if (typeof document === "undefined") return;
  const value = `/${SOURCE_LANG}/${target}`;
  const host = window.location.hostname;
  // Set on current host and on the parent domain (Google Translate reads
  // the cookie from the registered domain — `.example.com`).
  const variants = [
    `googtrans=${value};path=/`,
    `googtrans=${value};path=/;domain=${host}`,
    `googtrans=${value};path=/;domain=.${host}`,
  ];
  const parts = host.split(".");
  if (parts.length > 2) {
    variants.push(`googtrans=${value};path=/;domain=.${parts.slice(-2).join(".")}`);
  }
  for (const v of variants) document.cookie = v;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = (localStorage.getItem("lang") as Lang | null);
      const initial: Lang = saved && DICT[saved] ? saved : "en";
      if (!saved) {
        // First-time visitor: persist English as the default so the Google
        // Translate cookie is set before any subsequent navigation.
        try { localStorage.setItem("lang", initial); } catch {}
      }
      setLangState(initial);
      writeGoogTransCookie(initial);
      try { document.documentElement.lang = initial; } catch {}
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
    try { writeGoogTransCookie(l); } catch {}

    if (typeof window === "undefined") return;
    try { document.documentElement.lang = l; } catch {}

    // Show a full-screen overlay so users see immediate feedback while the
    // page reloads to let Google Translate re-render the whole DOM.
    try {
      const labelMap: Record<Lang, string> = {
        en: "Switching language…",
        fr: "Changement de langue…",
        de: "Sprache wird gewechselt…",
      };
      const existing = document.getElementById("lang-switch-overlay");
      existing?.remove();
      const overlay = document.createElement("div");
      overlay.id = "lang-switch-overlay";
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");
      overlay.style.cssText = [
        "position:fixed", "inset:0", "z-index:2147483647",
        "display:flex", "flex-direction:column", "align-items:center", "justify-content:center",
        "gap:18px",
        "background:rgba(10,12,20,0.78)", "backdrop-filter:blur(6px)", "-webkit-backdrop-filter:blur(6px)",
        "color:#fff", "font-family:system-ui,-apple-system,sans-serif",
        "font-size:13px", "letter-spacing:0.18em", "text-transform:uppercase",
      ].join(";");
      overlay.innerHTML = `
        <style>@keyframes lang-spin{to{transform:rotate(360deg)}}</style>
        <div style="width:42px;height:42px;border:2px solid rgba(255,255,255,0.22);border-top-color:#fff;border-radius:50%;animation:lang-spin 0.8s linear infinite"></div>
        <div>${labelMap[l]}</div>
      `;
      document.body.appendChild(overlay);
    } catch {}

    try { window.location.reload(); } catch {}
  };

  const t = (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
