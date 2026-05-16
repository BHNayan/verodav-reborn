import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Truck, ShieldCheck, Wrench, Sparkles, Quote } from "lucide-react";
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
  const editorialCats = categories.slice(0, 6);

  return (
    <>
      {/* HERO — editorial split with oversized type */}
      <section className="relative overflow-hidden">
        {/* decorative copper line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-copper/40 to-transparent" />

        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-12 items-end">
            <div className="lg:col-span-7 z-10">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-copper">
                <span className="h-px w-10 bg-copper" /> Maison · Cuisine · Strasbourg
              </div>

              <h1 className="mt-6 font-display font-light text-[clamp(3rem,8.4vw,8.5rem)] leading-[0.92] tracking-[-0.025em] text-balance">
                Cuisine
                <br />
                <span className="italic text-copper">moderne</span>,
                <br />
                ustensiles
                <br />
                innovants.
              </h1>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/boutique"
                  className="group inline-flex items-center gap-3 bg-primary px-8 py-5 text-[11px] uppercase tracking-[0.25em] text-primary-foreground hover:bg-copper transition-colors">
                  Découvrir la boutique
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/a-propos" className="text-[11px] uppercase tracking-[0.25em] underline underline-offset-8 decoration-copper/60 hover:decoration-copper hover:text-copper transition">
                  Notre histoire
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={HERO_IMG} alt="Aide de cuisine Verodav" className="h-full w-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5" />
              </div>
              {/* floating thumbnails */}
              <div className="absolute -left-6 bottom-10 hidden md:block w-32 aspect-square overflow-hidden shadow-2xl border-4 border-background">
                <img src={SLIDE_IMGS[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -right-4 -top-6 hidden md:block w-28 aspect-square overflow-hidden shadow-2xl border-4 border-background">
                <img src={SLIDE_IMGS[2]} alt="" className="h-full w-full object-cover" />
              </div>
              {/* pill */}
              <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 inline-flex items-center gap-2 bg-background border border-border px-5 py-3 shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-copper" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em]">Nouveautés en stock</span>
              </div>
            </div>
          </div>

          {/* hero stats row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
            {[
              { k: "257", v: "Références" },
              { k: "10", v: "Catégories" },
              { k: "20+", v: "Marques partenaires" },
              { k: "FR", v: "Expédition Strasbourg" },
            ].map((s) => (
              <div key={s.v} className="bg-background px-6 py-7">
                <div className="font-display text-4xl text-copper tabular-nums">{s.k}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE — brand promise band */}
      <section className="border-y border-border bg-primary text-primary-foreground overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-5 text-xs uppercase tracking-[0.4em]">
          {Array.from({ length: 2 }).flatMap((_, i) => (
            ["Sélection rigoureuse", "Pièces de rechange", "Livraison France", "Conseils experts", "Strasbourg · 1967", "Fait pour durer"]
              .map((t, j) => (
                <span key={`${i}-${j}`} className="mx-10 flex items-center gap-10">
                  {t} <Sparkles className="h-3 w-3 text-copper" />
                </span>
              ))
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="bg-card">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { icon: Truck, title: "Livraison France", text: "Expédition rapide depuis Strasbourg en 48–72h." },
            { icon: ShieldCheck, title: "Qualité garantie", text: "Outils sélectionnés pour leur fiabilité et durabilité." },
            { icon: Wrench, title: "Pièces de rechange", text: "Service après-vente et compatibilité long terme." },
          ].map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="px-6 py-6 md:py-2 flex gap-5 items-start">
              <span className="font-display text-xs text-copper mt-1">0{i+1}</span>
              <Icon className="h-6 w-6 text-copper shrink-0 mt-0.5" />
              <div>
                <div className="font-display text-lg">{title}</div>
                <div className="text-sm text-muted-foreground mt-1">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES — magazine grid */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-copper">— Univers</span>
            <h2 className="mt-3 font-display font-light text-5xl md:text-6xl tracking-tight text-balance">
              Explorez par <em className="not-italic italic text-copper">usage</em>.
            </h2>
          </div>
          <Link to="/boutique" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:text-copper transition group">
            Tout voir <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* large featured + grid */}
        <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
          {/* spotlight */}
          {editorialCats[0] && (
            <Link to="/categorie/$slug" params={{ slug: editorialCats[0].slug }}
              className="group relative lg:col-span-7 lg:row-span-2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-secondary min-h-[420px]">
              <img src={editorialCats[0].image} alt={editorialCats[0].name}
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-primary-foreground">
                <span className="text-[10px] uppercase tracking-[0.3em] text-copper">Catégorie phare</span>
                <h3 className="font-display text-4xl md:text-5xl mt-3">{editorialCats[0].name}</h3>
                <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.25em]">
                  <span>{editorialCats[0].count} produits</span>
                  <span className="h-px w-8 bg-copper" />
                  <span className="inline-flex items-center gap-1">Découvrir <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
              </div>
            </Link>
          )}

          {editorialCats.slice(1, 5).map((c) => (
            <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
              className="group relative lg:col-span-5 lg:[&:nth-child(2)]:col-span-5 [&:nth-child(2)]:lg:col-start-8 aspect-[5/3] overflow-hidden bg-secondary"
              style={{}}>
              <img src={c.image} alt={c.name} loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground flex items-end justify-between">
                <div>
                  <h3 className="font-display text-2xl leading-tight">{c.name}</h3>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground/70 mt-1">{c.count} produits</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-copper translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition" />
              </div>
            </Link>
          ))}
        </div>

        {/* secondary chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.slice(5).map((c) => (
            <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
              className="text-[11px] uppercase tracking-[0.25em] border border-border px-4 py-2.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
              {c.name} <span className="opacity-60 ml-1">· {c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <div className="flex items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-copper">— Sélection du moment</span>
              <h2 className="mt-3 font-display font-light text-5xl md:text-6xl tracking-tight text-balance">
                Nos coups de <em className="not-italic italic text-copper">cœur</em>.
              </h2>
            </div>
            <Link to="/boutique" className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:text-copper transition group">
              Voir la boutique <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14">
            {featured.map((p, i) => <ProductCard key={p.id} p={p} eager={i < 4} />)}
          </div>
        </div>
      </section>

      {/* EDITORIAL — quote + image */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-10 py-28 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] overflow-hidden bg-secondary">
            <img src={SLIDE_IMGS[1]} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden md:block bg-background border border-border p-6 max-w-xs shadow-2xl">
            <Quote className="h-5 w-5 text-copper" />
            <p className="mt-3 font-display italic text-lg leading-snug">
              « Le bon outil transforme le geste — et la cuisine devient un plaisir. »
            </p>
          </div>
        </div>
        <div className="lg:col-span-6 lg:pl-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-copper">— Notre approche</span>
          <h2 className="mt-4 font-display font-light text-5xl md:text-6xl tracking-tight text-balance">
            Des outils faits pour <em className="italic text-copper not-italic">durer</em>.
          </h2>
          <p className="mt-7 text-muted-foreground leading-[1.8] text-[15px] max-w-xl">
            Chaque ustensile est choisi pour sa qualité, sa fiabilité et son ergonomie.
            Nous travaillons avec des fabricants reconnus afin de proposer des produits
            qui s'inscrivent dans la durée — du moulin manuel au ventilateur silencieux,
            en passant par les pièces de rechange compatibles.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {fanCat.slice(0,2).map(p => (
              <Link key={p.id} to="/produit/$slug" params={{ slug: p.slug }} className="group">
                <div className="aspect-square bg-secondary overflow-hidden">
                  {p.image && <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                </div>
                <div className="font-display text-sm mt-3 line-clamp-2 group-hover:text-copper transition">{p.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials variant="light" />

      {/* CONTACT CTA — full bleed */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--copper) 0, transparent 40%), radial-gradient(circle at 80% 80%, var(--copper) 0, transparent 50%)" }} />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <span className="text-[11px] uppercase tracking-[0.3em] text-copper">— Service client</span>
            <h2 className="mt-3 font-display font-light text-5xl md:text-6xl tracking-tight text-balance">
              Une question sur un <em className="italic text-copper not-italic">produit</em> ?
            </h2>
            <p className="mt-6 text-primary-foreground/70 max-w-xl leading-relaxed">
              Notre équipe vous répond rapidement. Conseils d'usage, compatibilité de pièces, suivi de livraison —
              parlons-en.
            </p>
          </div>
          <div className="md:col-span-5 flex flex-col gap-5 md:items-end">
            <a href={`tel:${SITE.phoneRaw}`} className="font-display text-4xl md:text-5xl hover:text-copper transition tracking-tight">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="text-primary-foreground/80 hover:text-copper transition text-sm">{SITE.email}</a>
            <Link to="/contact" className="mt-2 inline-flex items-center gap-3 border border-primary-foreground/40 px-7 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-copper hover:border-copper transition">
              Page contact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
