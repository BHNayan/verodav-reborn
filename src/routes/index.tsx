import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Wrench } from "lucide-react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { name: "description", content: "Découvrez nos ustensiles de cuisine professionnels : cuisson, pâtes, ventilateurs, accessoires. Livraison Strasbourg & France." },
    ],
  }),
  component: HomePage,
});

const HERO_IMG = "https://www.verodav-home.com/wp-content/uploads/2025/11/Aide-de-Cuisine.jpg";
const SLIDE_IMGS = [
  "https://www.verodav-home.com/wp-content/uploads/2025/11/shop27.jpg",
  "https://www.verodav-home.com/wp-content/uploads/2025/11/Pieces-de-rechange.jpg",
  "https://www.verodav-home.com/wp-content/uploads/2025/11/shop17.jpg",
];

function HomePage() {
  const featured = products.slice(0, 8);
  const fanCat = products.filter(p => p.categories.includes("ventilateurs")).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-10 py-16 lg:py-28 items-center">
          <div className="lg:col-span-6 z-10">
            <span className="text-xs uppercase tracking-[0.3em] text-copper">— Maison & cuisine</span>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] text-balance">
              Cuisine moderne, <em className="not-italic text-copper">ustensiles</em> innovants.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
              Une sélection rigoureuse d'outils professionnels pour les amateurs exigeants.
              Pièces de rechange, cuisson, pâtes, ventilateurs — pensés pour durer.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/boutique" className="inline-flex items-center gap-2 bg-primary px-7 py-4 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors">
                Notre boutique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/categorie/$slug" params={{ slug: "cuisson" }} className="inline-flex items-center gap-2 border border-primary px-7 py-4 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors">
                Cuisson
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              <div><div className="font-display text-3xl text-copper">257</div><div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Produits</div></div>
              <div><div className="font-display text-3xl text-copper">10</div><div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Catégories</div></div>
              <div><div className="font-display text-3xl text-copper">FR</div><div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Strasbourg</div></div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                <img src={HERO_IMG} alt="Aide de Cuisine" className="h-full w-full object-cover" />
              </div>
              <div className="grid grid-rows-2 gap-3">
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img src={SLIDE_IMGS[0]} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img src={SLIDE_IMGS[2]} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden lg:flex items-center gap-3 bg-card border border-border px-5 py-3 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-copper animate-pulse" />
              <span className="text-xs uppercase tracking-widest">Nouveautés en stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Livraison France", text: "Expédition rapide depuis Strasbourg" },
            { icon: ShieldCheck, title: "Qualité garantie", text: "Outils sélectionnés pour leur durabilité" },
            { icon: Wrench, title: "Pièces de rechange", text: "Service après-vente et compatibilité" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 items-start">
              <Icon className="h-6 w-6 text-copper shrink-0 mt-1" />
              <div>
                <div className="font-display text-lg">{title}</div>
                <div className="text-sm text-muted-foreground">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-copper">— Notre catégorie</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Explorez par usage</h2>
          </div>
          <Link to="/boutique" className="hidden md:inline-flex items-center gap-2 text-sm hover:text-copper transition">
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
              className="group relative aspect-[3/4] overflow-hidden bg-secondary hover-lift">
              <img src={c.image} alt={c.name} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
                <div className="font-display text-lg leading-tight">{c.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-primary-foreground/70 mt-1">{c.count} produits</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-copper">— Sélection</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Nos coups de cœur</h2>
            </div>
            <Link to="/boutique" className="hidden md:inline-flex items-center gap-2 text-sm hover:text-copper transition">
              Voir la boutique <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/5] overflow-hidden bg-secondary">
          <img src={SLIDE_IMGS[1]} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— Notre approche</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
            Des outils faits pour <em className="text-copper not-italic">durer</em>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Chaque ustensile est choisi pour sa qualité, sa fiabilité et son ergonomie.
            Nous travaillons avec des fabricants reconnus afin de proposer des produits
            qui s'inscrivent dans la durée — du moulin manuel au ventilateur silencieux,
            en passant par les pièces de rechange compatibles.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            {fanCat.slice(0,2).map(p => (
              <Link key={p.id} to="/produit/$slug" params={{ slug: p.slug }} className="group">
                <div className="aspect-square bg-secondary overflow-hidden">
                  {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition" />}
                </div>
                <div className="font-display text-sm mt-3 line-clamp-2 group-hover:text-copper transition">{p.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-copper">— Service client</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Une question sur un produit ?</h2>
            <p className="mt-5 text-primary-foreground/70 max-w-md">
              Notre équipe vous répond rapidement. Conseils, compatibilité de pièces, livraison —
              n'hésitez pas à nous contacter.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <a href={`tel:${SITE.phoneRaw}`} className="font-display text-3xl hover:text-copper transition">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="text-primary-foreground/80 hover:text-copper transition">{SITE.email}</a>
            <Link to="/contact" className="mt-3 inline-flex items-center gap-2 border border-primary-foreground/40 px-6 py-3 text-xs uppercase tracking-widest hover:bg-copper hover:border-copper transition">
              Page contact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
