import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Search, ShoppingBag, User, ChevronDown, LogOut, Package, Heart, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/products";
import { SITE } from "@/lib/site";
import { useCartCount } from "@/lib/cart";
import { useAuth, displayNameOf, signOut } from "@/lib/auth";
import logo from "@/assets/verodav-logo.png";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartCount();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!userMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenu]);

  const close = () => setOpen(false);
  const handleSignOut = async () => {
    await signOut();
    setUserMenu(false);
    setOpen(false);
    navigate({ to: "/" });
  };

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

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 lg:px-10 py-4 md:py-5">
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-primary" aria-label="Ouvrir le menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <Link to="/" className="flex items-center lg:flex-none" aria-label="Verodav Home">
          <img src={logo} alt="Verodav Home — Better home, think us" className="h-8 md:h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-copper transition" activeOptions={{ exact: true }} activeProps={{ className: "text-copper" }}>Accueil</Link>
          <Link to="/boutique" className="hover:text-copper transition" activeProps={{ className: "text-copper" }}>Boutique</Link>
          <div className="relative group">
            <button className="hover:text-copper transition inline-flex items-center gap-1">
              Catégories <ChevronDown className="h-3.5 w-3.5" />
            </button>
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

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/boutique" aria-label="Boutique" className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[11px] uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors">
            <Search className="h-3.5 w-3.5" /> Boutique
          </Link>
          <Link to="/boutique" aria-label="Boutique" className="md:hidden p-2 text-primary hover:text-copper transition">
            <Search className="h-5 w-5" />
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenu((v) => !v)}
                aria-label="Mon compte"
                aria-expanded={userMenu}
                className="flex items-center gap-2 p-2 text-primary hover:text-copper transition"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline max-w-[140px] truncate text-xs uppercase tracking-widest">
                  {displayNameOf(user)}
                </span>
                <ChevronDown className={`hidden md:inline h-3 w-3 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full mt-2 w-60 border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Connecté</div>
                    <div className="truncate text-sm font-medium">{user.email}</div>
                  </div>
                  <Link to="/compte" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary">
                    <User className="h-4 w-4" /> Mon compte
                  </Link>
                  <Link to="/commandes" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary">
                    <Package className="h-4 w-4" /> Mes commandes
                  </Link>
                  <Link to="/favoris" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary">
                    <Heart className="h-4 w-4" /> Mes favoris
                  </Link>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-3 border-t border-border px-4 py-2.5 text-sm text-destructive hover:bg-secondary">
                    <LogOut className="h-4 w-4" /> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              search={{ redirect: "/", mode: "signin" }}
              aria-label="Se connecter"
              className="p-2 text-primary hover:text-copper transition"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <Link to="/boutique" aria-label="Panier" className="relative p-2 text-primary hover:text-copper transition">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-copper px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Off-canvas overlay + drawer (mobile/tablet) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!open}
      />
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Link to="/" onClick={close} aria-label="Verodav Home">
              <img src={logo} alt="Verodav Home" className="h-9 w-auto" />
            </Link>
            <button onClick={close} aria-label="Fermer le menu" className="p-2 text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>

          {user && (
            <div className="border-b border-border bg-secondary/40 px-5 py-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Connecté</div>
              <div className="mt-1 truncate text-sm font-medium">{displayNameOf(user)}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-5 py-4 text-sm">
            <Link to="/" onClick={close} className="block border-b border-border py-3 font-medium">Accueil</Link>
            <Link to="/boutique" onClick={close} className="block border-b border-border py-3 font-medium">Boutique</Link>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-border py-3 font-medium"
              aria-expanded={catOpen}
            >
              <span>Catégories</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="border-b border-border py-2 pl-3">
                {categories.map((c) => (
                  <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }} onClick={close}
                    className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-copper">
                    <span>{c.name}</span>
                    <span className="text-xs">{c.count}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link to="/a-propos" onClick={close} className="block border-b border-border py-3 font-medium">À propos</Link>
            <Link to="/contact" onClick={close} className="block border-b border-border py-3 font-medium">Contact</Link>

            {user ? (
              <div className="mt-4 space-y-1">
                <Link to="/compte" onClick={close} className="flex items-center gap-3 px-1 py-2.5 text-sm hover:text-copper">
                  <User className="h-4 w-4" /> Mon compte
                </Link>
                <Link to="/commandes" onClick={close} className="flex items-center gap-3 px-1 py-2.5 text-sm hover:text-copper">
                  <Package className="h-4 w-4" /> Mes commandes
                </Link>
                <Link to="/favoris" onClick={close} className="flex items-center gap-3 px-1 py-2.5 text-sm hover:text-copper">
                  <Heart className="h-4 w-4" /> Mes favoris
                </Link>
                <button onClick={handleSignOut} className="mt-2 flex w-full items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest text-destructive hover:bg-secondary transition">
                  <LogOut className="h-4 w-4" /> Se déconnecter
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/auth" search={{ redirect: "/", mode: "signin" }} onClick={close}
                  className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest hover:bg-secondary transition">
                  <User className="h-4 w-4" /> Se connecter
                </Link>
                <Link to="/boutique" onClick={close}
                  className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition">
                  <ShoppingBag className="h-4 w-4" /> Panier ({cartCount})
                </Link>
              </div>
            )}
          </nav>

          <div className="border-t border-border bg-secondary/50 px-5 py-4 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">{SITE.address}</div>
            <a href={`mailto:${SITE.email}`} className="mt-1 block hover:text-copper">{SITE.email}</a>
            <a href={`tel:${SITE.phoneRaw}`} className="block hover:text-copper">{SITE.phone}</a>
          </div>
        </div>
      </aside>
    </header>
  );
}
