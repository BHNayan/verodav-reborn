import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/products";

export function HomeSearchBar() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.shout.toLowerCase().includes(term) ||
        p.category_names.some((c) => c.toLowerCase().includes(term))
      )
      .slice(0, 8);
  }, [q, products]);

  return (
    <div className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-10">
        <div ref={wrapRef} className="relative mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2 border border-border bg-background px-3 py-2.5 shadow-sm focus-within:border-copper sm:px-4 sm:py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => { setQ(""); setOpen(false); }}
                aria-label="Effacer"
                className="shrink-0 p-1 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {open && q.trim() !== "" && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] overflow-y-auto border border-border bg-background shadow-2xl">
              {results.length === 0 ? (
                <div className="break-words px-4 py-6 text-center text-xs text-muted-foreground sm:text-sm">
                  Aucun produit trouvé pour "{q}".
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/produit/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-secondary sm:gap-3 sm:px-4 sm:py-3"
                      >
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-11 w-11 shrink-0 object-cover sm:h-12 sm:w-12" loading="lazy" />
                        ) : (
                          <div className="h-11 w-11 shrink-0 bg-secondary sm:h-12 sm:w-12" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{p.name}</div>
                          {p.category_names[0] && (
                            <div className="truncate text-[11px] text-muted-foreground sm:text-xs">{p.category_names[0]}</div>
                          )}
                        </div>
                        <div className="shrink-0 whitespace-nowrap text-xs font-semibold text-copper sm:text-sm">
                          {p.price.toFixed(2)} €
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
