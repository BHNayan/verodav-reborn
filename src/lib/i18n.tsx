import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "nl";
export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

type Dict = Record<string, string>;
const DICT: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.account": "My account",
    "nav.orders": "My orders",
    "nav.favorites": "My favorites",
    "nav.signin": "Sign in",
    "nav.signout": "Sign out",
    "nav.admin": "Administration",
    "common.cart": "Cart",
    "common.search": "Search",
    "common.send": "Send message",
    "common.name": "Name",
    "common.email": "Email",
    "common.subject": "Subject",
    "common.message": "Message",
    "contact.title": "Contact",
    "contact.intro": "A question, an order, advice on a spare part? Our team responds quickly.",
    "contact.write": "Write to us",
    "contact.coords": "Contact info",
    "contact.hours": "Hours",
    "contact.shop": "Shop",
    "contact.phone": "Phone",
    "contact.sent": "Message sent. We will get back to you shortly.",
    "contact.error": "Unable to send message.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.shop": "Boutique",
    "nav.categories": "Catégories",
    "nav.about": "À propos",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.account": "Mon compte",
    "nav.orders": "Mes commandes",
    "nav.favorites": "Mes favoris",
    "nav.signin": "Se connecter",
    "nav.signout": "Se déconnecter",
    "nav.admin": "Administration",
    "common.cart": "Panier",
    "common.search": "Rechercher",
    "common.send": "Envoyer le message",
    "common.name": "Nom",
    "common.email": "Email",
    "common.subject": "Sujet",
    "common.message": "Message",
    "contact.title": "Contact",
    "contact.intro": "Une question, une commande, un conseil sur une pièce de rechange ? Notre équipe vous répond rapidement.",
    "contact.write": "Écrivez-nous",
    "contact.coords": "Coordonnées",
    "contact.hours": "Horaires",
    "contact.shop": "Boutique",
    "contact.phone": "Téléphone",
    "contact.sent": "Message envoyé. Nous revenons vers vous rapidement.",
    "contact.error": "Impossible d'envoyer le message.",
  },
  nl: {
    "nav.home": "Home",
    "nav.shop": "Winkel",
    "nav.categories": "Categorieën",
    "nav.about": "Over ons",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.account": "Mijn account",
    "nav.orders": "Mijn bestellingen",
    "nav.favorites": "Mijn favorieten",
    "nav.signin": "Inloggen",
    "nav.signout": "Uitloggen",
    "nav.admin": "Beheer",
    "common.cart": "Winkelwagen",
    "common.search": "Zoeken",
    "common.send": "Bericht versturen",
    "common.name": "Naam",
    "common.email": "E-mail",
    "common.subject": "Onderwerp",
    "common.message": "Bericht",
    "contact.title": "Contact",
    "contact.intro": "Een vraag, een bestelling, advies over een onderdeel? Ons team reageert snel.",
    "contact.write": "Schrijf ons",
    "contact.coords": "Contactgegevens",
    "contact.hours": "Openingstijden",
    "contact.shop": "Winkel",
    "contact.phone": "Telefoon",
    "contact.sent": "Bericht verzonden. We nemen snel contact met u op.",
    "contact.error": "Kan bericht niet verzenden.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved && DICT[saved]) setLangState(saved);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };
  const t = (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
