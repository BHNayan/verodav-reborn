import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { categories } from "@/lib/products";
import logo from "@/assets/verodav-logo.png";

const PAYMENTS = ["PayPal", "VISA", "Pay", "JCB", "amazon pay", "MC", "AMEX"];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left">
          <Link to="/" aria-label="Verodav Home" className="inline-flex items-center justify-center bg-white rounded-lg px-5 py-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
            <img src={logo} alt="Verodav Home" className="h-11 md:h-12 w-auto" />
          </Link>
          <p className="mt-5 text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
            {SITE.tagline} Une sélection d'ustensiles de cuisine professionnels conçus pour durer.
          </p>
          <div className="mt-6 flex gap-3 justify-center md:justify-start">
            <a href={SITE.socials.facebook} aria-label="Facebook" className="p-2 border border-primary-foreground/20 hover:bg-copper hover:border-copper transition"><Facebook className="h-4 w-4" /></a>
            <a href={SITE.socials.instagram} aria-label="Instagram" className="p-2 border border-primary-foreground/20 hover:bg-copper hover:border-copper transition"><Instagram className="h-4 w-4" /></a>
          </div>

          <div className="mt-8 w-full">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-3">L'application mobile sera bientôt disponible</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a href="#" aria-label="Google Play" className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l9.2-9.7L3.6 2.3zm10.2 10.4l2.7 2.8-11 6.3c-.4.2-.8.2-1.1.1l9.4-9.2zm0-1.4L4.4 2c.3-.1.7 0 1.1.2l11 6.3-2.7 2.8zm6.4-1.6c.9.5 1.3 1.2 1.3 1.9s-.5 1.4-1.3 1.9l-3.1 1.8-3.1-3.2 3.1-3.2 3.1.8z"/></svg>
                <span className="text-left leading-tight"><span className="block text-[9px] uppercase opacity-80">Get it on</span><span className="block text-sm font-semibold">Google Play</span></span>
              </a>
              <a href="#" aria-label="App Store" className="inline-flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md hover:opacity-90 transition">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M17.05 12.5c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.9zM14.6 5.3c.7-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.6 2.9-1.4z"/></svg>
                <span className="text-left leading-tight"><span className="block text-[9px] uppercase opacity-80">Download on the</span><span className="block text-sm font-semibold">App Store</span></span>
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-4">Catégories</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/categorie/$slug" params={{ slug: c.slug }} className="hover:text-copper transition">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display text-lg mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/boutique" className="hover:text-copper transition">Boutique</Link></li>
            <li><Link to="/a-propos" className="hover:text-copper transition">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-copper transition">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-display text-lg mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><span>{SITE.address}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><a href={`tel:${SITE.phoneRaw}`} className="hover:text-copper">{SITE.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><a href={`mailto:${SITE.email}`} className="hover:text-copper">{SITE.email}</a></li>
          </ul>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60 mb-3">Paiements acceptés</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span key={p} className="inline-flex items-center justify-center min-w-[52px] h-7 px-2 bg-white text-primary text-[10px] font-bold tracking-wider rounded-sm uppercase">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-primary-foreground/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Verodav Home — Tous droits réservés.</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <Link to="/mentions-legales" className="hover:text-copper transition">Mentions légales</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-copper transition">Politique de confidentialité</Link>
            <Link to="/protection-des-donnees-personnelles" className="hover:text-copper transition">Protection des données</Link>
            <Link to="/service-apres-vente" className="hover:text-copper transition">Service Après-Vente</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
