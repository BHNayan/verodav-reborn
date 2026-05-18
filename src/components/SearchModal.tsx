import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/products";
import { useI18n } from "@/lib/i18n";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const products = useProducts();
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.short.toLowerCase().includes(term) ||
        p.category_names.some((c) => c.toLowerCase().includes(term))
      )
      .slice(0, 20);
  }, [q, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60" onClick={onClose} role="dialog" aria-modal="true" aria-label={t("nav.shop")}>
      <div
        className="absolute left-1/2 top-0 w-full max-w-2xl -translate-x-1/2 bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("nav.shop") + "…"}
            aria-label={t("nav.shop")}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} aria-label="Close" className="p-1 text-muted-foreground hover:text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {q.trim() === "" ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Type to search products…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No products found for "{q}".
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/produit/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 object-cover" loading="lazy" />
                    ) : (
                      <div className="h-12 w-12 shrink-0 bg-secondary" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      {p.category_names[0] && (
                        <div className="truncate text-xs text-muted-foreground">{p.category_names[0]}</div>
                      )}
                    </div>
                    <div className="shrink-0 text-sm font-semibold text-copper">
                      {p.price.toFixed(2)} €
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
