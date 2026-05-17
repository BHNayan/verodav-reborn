import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useProducts, useCategories, categoriesQueryOptions, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const SITE_URL = "https://verodav-reborn.lovable.app";

export const Route = createFileRoute("/categorie/$slug")({
  loader: async ({ context, params }) => {
    const categories = await context.queryClient.ensureQueryData(categoriesQueryOptions());
    const category = categories.find((c) => c.slug === params.slug) ?? null;
    return { category };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.category;
    const url = `${SITE_URL}/categorie/${params.slug}`;
    const name = c?.name ?? params.slug;
    const title = `${name} — Boutique Verodav Home`;
    const desc = c
      ? `Découvrez ${c.count} produits de la catégorie ${c.name} chez Verodav Home — ustensiles, accessoires et pièces sélectionnés à Strasbourg pour votre cuisine et votre maison.`
      : `Découvrez la catégorie ${name} chez Verodav Home — ustensiles, accessoires et pièces de qualité pour votre cuisine et votre maison.`;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (c?.image) {
      meta.push({ property: "og:image", content: c.image });
      meta.push({ name: "twitter:image", content: c.image });
    }
    return { meta, links: [{ rel: "canonical", href: url }] };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Catégorie introuvable</h1>
      <Link to="/boutique" className="mt-6 inline-block text-copper">← Retour à la boutique</Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const allProducts = useProducts();
  const categories = useCategories();
  const cat = categories.find((c) => c.slug === slug);
  const products = allProducts.filter((p) => p.categories.includes(slug));

  if (categories.length && !cat) throw notFound();
  if (!cat) return <div className="mx-auto max-w-7xl px-6 py-16 text-sm text-muted-foreground">Chargement…</div>;

  return (
    <>
      <header className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0">
          <img src={cat.image} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <Link to="/boutique" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-copper">← Boutique</Link>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">{cat.name}</h1>
          <p className="mt-3 text-muted-foreground">{products.length} produits</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p: Product) => <ProductCard key={p.id} p={p} />)}
        </div>

        <div className="mt-20 pt-10 border-t border-border">
          <h2 className="font-display text-2xl mb-6">Autres catégories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.filter((c) => c.slug !== cat.slug).map((c) => (
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
