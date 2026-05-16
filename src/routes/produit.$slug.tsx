import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Mail, Phone, ShoppingBag, Star } from "lucide-react";
import { getProduct, products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, SITE } from "@/lib/site";
import { cart } from "@/lib/cart";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    const related = products
      .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
      .slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — Verodav Home` },
      { name: "description", content: loaderData.product.short || loaderData.product.description.slice(0, 160) },
      { property: "og:title", content: loaderData.product.name },
      { property: "og:image", content: loaderData.product.image || "" },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Produit introuvable</h1>
      <Link to="/boutique" className="mt-6 inline-block text-copper">← Retour à la boutique</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const [qty, setQty] = useState(1);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link to="/boutique" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-copper">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-secondary overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">Aucune image</div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.category_names.map((n: string, i: number) => (
              <Link key={i} to="/categorie/$slug" params={{ slug: product.categories[i] }}
                className="text-[10px] uppercase tracking-[0.2em] text-copper border border-copper/40 px-2 py-1 hover:bg-copper hover:text-copper-foreground transition">
                {n}
              </Link>
            ))}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-balance leading-tight">{product.name}</h1>

          {product.rating > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-4 w-4 ${i <= Math.round(product.rating) ? "fill-copper text-copper" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-muted-foreground">({product.reviews} avis)</span>
            </div>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl">{formatPrice(product.price)}</span>
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1 text-xs text-copper"><Check className="h-3.5 w-3.5" /> En stock</span>
            ) : (
              <span className="text-xs text-muted-foreground">Rupture de stock</span>
            )}
          </div>

          {product.short && (
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.short}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-secondary">−</button>
              <span className="px-5 py-3 font-medium min-w-12 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-secondary">+</button>
            </div>
            <button
              onClick={() =>
                cart.add(
                  { id: product.id, name: product.name, price: product.price, image: product.image },
                  qty,
                )
              }
              disabled={!product.in_stock}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-4 w-4" /> Ajouter au panier
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href={`tel:${SITE.phoneRaw}`} className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest hover:border-copper hover:text-copper transition">
              <Phone className="h-3.5 w-3.5" /> Appeler
            </a>
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 text-xs uppercase tracking-widest hover:border-copper hover:text-copper transition">
              <Mail className="h-3.5 w-3.5" /> Question
            </a>
          </div>

          {product.description && (
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="font-display text-xl mb-3">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-card mt-20">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="font-display text-3xl mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p: Product) => <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
