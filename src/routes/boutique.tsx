import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, categories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — Verodav Home" },
      { name: "description", content: "Découvrez les 257 produits Verodav Home : cuisson, pâtes, ventilateurs, pièces de rechange, accessoires." },
    ],
  }),
  component: BoutiquePage,
});

function BoutiquePage() {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const list = useMemo(() => {
    let out = products;
    if (cat !== "all") out = out.filter((p) => p.categories.includes(cat));
    if (q.trim()) {
      const k = q.toLowerCase();
      out = out.filter((p) => p.name.toLowerCase().includes(k) || p.short.toLowerCase().includes(k));
    }
    if (sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    return out;
  }, [cat, q, sort]);

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— Boutique</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Tous les produits</h1>
          <p className="mt-3 text-muted-foreground">{products.length} références sélectionnées avec soin.</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-32 self-start">
          <div className="mb-6">
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper"
            />
          </div>
          <div className="mb-6">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Trier par</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as "default" | "price-asc" | "price-desc")}
              className="mt-2 w-full bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-copper">
              <option value="default">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Catégories</div>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setCat("all")} className={`w-full text-left text-sm py-1.5 px-2 transition ${cat === "all" ? "bg-primary text-primary-foreground" : "hover:text-copper"}`}>
                  Toutes ({products.length})
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button onClick={() => setCat(c.slug)} className={`w-full text-left text-sm py-1.5 px-2 transition ${cat === c.slug ? "bg-primary text-primary-foreground" : "hover:text-copper"}`}>
                    {c.name} <span className="text-xs opacity-60">({c.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <p className="text-sm text-muted-foreground mb-6">{list.length} produits</p>
          {list.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              Aucun produit ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
          <div className="mt-12 flex flex-wrap gap-2">
            {categories.map(c => (
              <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
                className="text-xs uppercase tracking-widest border border-border px-3 py-2 hover:bg-primary hover:text-primary-foreground transition">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
