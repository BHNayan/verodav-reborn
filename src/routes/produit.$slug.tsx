import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Mail, Phone, ShoppingBag, Star } from "lucide-react";
import { productQueryOptions, useProducts, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, SITE } from "@/lib/site";
import { cart } from "@/lib/cart";

const SITE_URL = "https://verodav-reborn.lovable.app";

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.slug));
    return { product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const url = `${SITE_URL}/produit/${params.slug}`;
    const title = p ? `${p.name} — Verodav Home` : `${params.slug} — Verodav Home`;
    const rawDesc = (p?.short || p?.description || "").trim();
    const desc = rawDesc
      ? rawDesc.slice(0, 157) + (rawDesc.length > 157 ? "…" : "")
      : p
      ? `Découvrez ${p.name} chez Verodav Home — ${formatPrice(p.price)}. Livraison et conseils par notre équipe à Strasbourg.`
      : "Produit Verodav Home — ustensiles et accessoires de cuisine.";
    const image = p?.image || undefined;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "product" },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    const scripts: Array<{ type: string; children: string }> = [];
    if (p) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: rawDesc || title,
          image: image ? [image] : undefined,
          sku: p.id,
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "EUR",
            price: p.price,
            availability: p.in_stock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
          ...(p.rating > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: p.rating,
                  reviewCount: p.reviews || 1,
                },
              }
            : {}),
        }),
      });
    }
    return { meta, links: [{ rel: "canonical", href: url }], scripts };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Produit introuvable</h1>
      <Link to="/boutique" className="mt-6 inline-block text-copper">← Retour à la boutique</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(productQueryOptions(slug));
  const all = useProducts();
  const [qty, setQty] = useState(1);

  if (isLoading) return <div className="mx-auto max-w-7xl px-6 py-16 text-sm text-muted-foreground">Chargement…</div>;
  if (!product) throw notFound();

  const related = all
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, 4);

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
            <div className="inline-flex items-center border border-border" role="group" aria-label="Quantité">
              <button type="button" aria-label="Diminuer la quantité" onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-secondary">−</button>
              <span aria-live="polite" aria-label={`Quantité : ${qty}`} className="px-5 py-3 font-medium min-w-12 text-center">{qty}</span>
              <button type="button" aria-label="Augmenter la quantité" onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-secondary">+</button>
            </div>
            <button
              onClick={() =>
                cart.add(
                  { id: product.id, name: product.name, price: product.price, image: product.image ?? undefined },
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
