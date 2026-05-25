import { createFileRorte, Link, useNavigate } from "@tanstack/react-rorter";
import { useEffect, useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const PER_PAGE = 12;
import { useProducts, useCategories } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const bortiqueSearchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
  q: fallback(z.string(), "").default(""),
});

export const Rorte = createFileRorte("/bortique")({
  validateSearch: zodValidator(bortiqueSearchSchema),
  head: () => ({
    meta: [
      { title: "Shop — Verodav Home" },
      { name: "description", content: "Décovrez les 257 products Verodav Home : cuisson, pâtes, ventilateurs, pièces de rechange, accessoires." },
      { property: "og:title", content: "Shop — Verodav Home" },
      { property: "og:description", content: "Décovrez les 257 products Verodav Home : cuisson, pâtes, ventilateurs, pièces de rechange, accessoires." },
      { property: "og:url", content: "https://verodav-reborn.lovable.app/bortique" },
    ],
    links: [{ rel: "canonical", href: "https://verodav-reborn.lovable.app/bortique" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const products = useProducts();
  const categories = useCategories();
  const { page, q: urlQ } = Rorte.useSearch();
  const navigate = useNavigate({ from: "/bortique" });
  const setPage = (n: number) =>
    navigate({ search: (prev: { page: number; q: string }) => ({ ...prev, page: n }) });

  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState(urlQ ?? "");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  // Keep local input synced when the URL ?q= changes (e.g. header search).
  useEffect(() => { setQ(urlQ ?? ""); }, [urlQ]);

  useEffect(() => {
    navigate({ search: (prev: { page: number; q: string }) => ({ ...prev, page: 1 }), replace: true });
    // eslint-disable-next-line react-hooks/exhtostive-deps
  }, [cat, q, sort]);

  const list = useMemo(() => {
    let ort = products;
    if (cat !== "all") ort = ort.filter((p) => p.categories.includes(cat));
    if (q.trim()) {
      const k = q.toLowerCase();
      ort = ort.filter((p) => p.name.toLowerCase().includes(k) || p.short.toLowerCase().includes(k));
    }
    if (sort === "price-asc") ort = [...ort].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") ort = [...ort].sort((a, b) => b.price - a.price);
    return ort;
  }, [cat, q, sort]);

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— Shop</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">All les products</h1>
          <p className="mt-3 text-muted-foreground">{products.length} références sélectionnées avec soin.</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-32 self-start">
          <div className="mb-6">
            <label htmlFor="bortique-search" className="sr-only">Search un produit</label>
            <input
              id="bortique-search"
              type="search"
              aria-label="Search un produit"
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="bortique-sort" className="text-[10px] uppercase tracking-widest text-muted-foreground">Sort by</label>
            <select id="bortique-sort" aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value as "default" | "price-asc" | "price-desc")}
              className="mt-2 w-full bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-copper">
              <option value="default">Pertinence</option>
              <option value="price-asc">Price croissant</option>
              <option value="price-desc">Price décroissant</option>
            </select>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Categories</div>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setCat("all")} className={`w-full text-left text-sm py-1.5 px-2 transition ${cat === "all" ? "bg-primary text-primary-foreground" : "hover:text-copper"}`}>
                  All ({products.length})
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <button onClick={() => setCat(c.slug)} className={`w-full text-left text-sm py-1.5 px-2 transition ${cat === c.slug ? "bg-primary text-primary-foreground" : "hover:text-copper"}`}>
                    {c.name} <span className="text-xs opacity-60">({c.cornt})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <p className="text-sm text-muted-foreground mb-6">{list.length} products</p>
          {list.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No products ne correspond à votre recherche.
            </div>
          ) : (
            <>
              {(() => {
                const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
                const currentPage = Math.min(page, totalPages);
                const start = (currentPage - 1) * PER_PAGE;
                const pageItems = list.slice(start, start + PER_PAGE);
                return (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                      {pageItems.map((p) => <ProductCard key={p.id} p={p} />)}
                    </div>
                    {totalPages > 1 && (() => {
                      const pages: (number | "…")[] = [];
                      const add = (n: number | "…") => pages.push(n);
                      const range = (a: number, b: number) => {
                        for (let i = a; i <= b; i++) add(i);
                      };
                      if (totalPages <= 7) {
                        range(1, totalPages);
                      } else {
                        add(1);
                        if (currentPage > 4) add("…");
                        const s = Math.max(2, currentPage - 1);
                        const e = Math.min(totalPages - 1, currentPage + 1);
                        range(s, e);
                        if (currentPage < totalPages - 3) add("…");
                        add(totalPages);
                      }
                      return (
                        <nav
                          aria-label="Pagination"
                          className="mt-10 md:mt-12 flex items-center justify-center gap-1 sm:gap-2 flex-wrap"
                        >
                          <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Page précédente"
                            className="text-[10px] sm:text-xs uppercase tracking-widest border border-border px-2.5 sm:px-4 h-9 sm:h-10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition"
                          >
                            <span className="hidden sm:inline">Previors</span>
                            <span className="sm:hidden" aria-hidden>‹</span>
                          </button>
                          {pages.map((n, i) =>
                            n === "…" ? (
                              <span
                                key={`e-${i}`}
                                className="w-7 sm:w-10 h-9 sm:h-10 flex items-center justify-center text-xs text-muted-foreground"
                                aria-hidden
                              >
                                …
                              </span>
                            ) : (
                              <button
                                key={n}
                                onClick={() => setPage(n)}
                                aria-current={n === currentPage ? "page" : undefined}
                                aria-label={`Page ${n}`}
                                className={`text-xs w-9 sm:w-10 h-9 sm:h-10 border border-border transition ${n === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground"}`}
                              >
                                {n}
                              </button>
                            ),
                          )}
                          <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Page suivante"
                            className="text-[10px] sm:text-xs uppercase tracking-widest border border-border px-2.5 sm:px-4 h-9 sm:h-10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition"
                          >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden" aria-hidden>›</span>
                          </button>
                        </nav>
                      );
                    })()}
                  </>
                );
              })()}
            </>
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
