import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useProducts, useCategories, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/categorie/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Verodav Home` },
      { name: "description", content: `Produits de la catégorie ${params.slug}.` },
    ],
  }),
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
          <h3 className="font-display text-2xl mb-6">Autres catégories</h3>
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
