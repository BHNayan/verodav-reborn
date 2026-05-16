import { Link } from "@tanstack/react-router";
import { Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/products";
import { SITE } from "@/lib/site";
import logo from "@/assets/verodav-logo.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="hidden md:block border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs tracking-wide">
          <span className="font-sans">{SITE.address}</span>
          <div className="flex items-center gap-5">
            <a href={`mailto:${SITE.email}`} className="hover:text-copper transition">{SITE.email}</a>
            <a href={`tel:${SITE.phoneRaw}`} className="hover:text-copper transition">{SITE.phone}</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10 py-5">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight">Verodav</span>
          <span className="font-display text-2xl italic text-copper">Home</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-copper transition" activeOptions={{ exact: true }} activeProps={{ className: "text-copper" }}>Accueil</Link>
          <Link to="/boutique" className="hover:text-copper transition" activeProps={{ className: "text-copper" }}>Boutique</Link>
          <div className="relative group">
            <button className="hover:text-copper transition">Catégories</button>
            <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-3 group-hover:block">
              <div className="w-72 border border-border bg-card p-2 shadow-xl">
                {categories.map((c) => (
                  <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-secondary">
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/a-propos" className="hover:text-copper transition" activeProps={{ className: "text-copper" }}>À propos</Link>
          <Link to="/contact" className="hover:text-copper transition" activeProps={{ className: "text-copper" }}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/boutique" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors">
            <Search className="h-3.5 w-3.5" /> Boutique
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="py-3 border-b border-border">Accueil</Link>
            <Link to="/boutique" onClick={() => setOpen(false)} className="py-3 border-b border-border">Boutique</Link>
            <details className="py-2 border-b border-border">
              <summary className="py-1 cursor-pointer">Catégories</summary>
              <div className="pl-3 pt-2 flex flex-col">
                {categories.map((c) => (
                  <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)}
                    className="py-2 text-sm text-muted-foreground">{c.name}</Link>
                ))}
              </div>
            </details>
            <Link to="/a-propos" onClick={() => setOpen(false)} className="py-3 border-b border-border">À propos</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="py-3">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
