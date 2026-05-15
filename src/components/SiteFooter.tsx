import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { categories } from "@/lib/products";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-3xl">
            Verodav <span className="italic text-copper">Home</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
            {SITE.tagline} Une sélection d'ustensiles de cuisine professionnels conçus pour durer.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={SITE.socials.facebook} aria-label="Facebook" className="p-2 border border-primary-foreground/20 hover:bg-copper hover:border-copper transition"><Facebook className="h-4 w-4" /></a>
            <a href={SITE.socials.instagram} aria-label="Instagram" className="p-2 border border-primary-foreground/20 hover:bg-copper hover:border-copper transition"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Catégories</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/categorie/$slug" params={{ slug: c.slug }} className="hover:text-copper transition">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/boutique" className="hover:text-copper transition">Boutique</Link></li>
            <li><Link to="/a-propos" className="hover:text-copper transition">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-copper transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><span>{SITE.address}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><a href={`tel:${SITE.phoneRaw}`} className="hover:text-copper">{SITE.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-copper" /><a href={`mailto:${SITE.email}`} className="hover:text-copper">{SITE.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-primary-foreground/50 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Verodav Home — Tous droits réservés.</span>
          <span>Strasbourg, France</span>
        </div>
      </div>
    </footer>
  );
}
