import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/produit/$slug" params={{ slug: p.slug }} className="group block hover-lift">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {p.image ? (
          <img src={p.image} alt={p.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">—</div>
        )}
        {p.on_sale && (
          <span className="absolute left-3 top-3 bg-copper text-copper-foreground text-[10px] uppercase tracking-widest px-2 py-1">Promo</span>
        )}
        {!p.in_stock && (
          <span className="absolute right-3 top-3 bg-primary/90 text-primary-foreground text-[10px] uppercase tracking-widest px-2 py-1">Épuisé</span>
        )}
      </div>
      <div className="pt-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {p.category_names[0]}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug text-balance line-clamp-2 group-hover:text-copper transition">
          {p.name}
        </h3>
        <p className="mt-2 text-sm font-medium">{formatPrice(p.price)}</p>
      </div>
    </Link>
  );
}
