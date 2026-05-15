import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Verodav Home" },
      { name: "description", content: "Verodav Home, boutique d'ustensiles de cuisine professionnels à Strasbourg." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-copper">— À propos</span>
            <h1 className="mt-3 font-display text-5xl md:text-7xl text-balance">
              Une maison dédiée à la <em className="text-copper not-italic">cuisine</em>.
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Depuis Strasbourg, Verodav Home rassemble les ustensiles, accessoires et pièces de rechange
            qui font la différence dans une cuisine quotidienne. Notre conviction : le bon outil
            transforme le geste.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-3 gap-10">
        {[
          { title: "Sélection", body: "Chaque référence est choisie pour sa qualité, son ergonomie et sa durabilité. Pas de compromis sur l'essentiel." },
          { title: "Service", body: "Conseils, compatibilité de pièces, suivi de commande. Une équipe joignable, basée à Strasbourg." },
          { title: "Durabilité", body: "Nous proposons systématiquement des pièces de rechange — un appareil qui dure est un appareil qu'on répare." },
        ].map((b, i) => (
          <div key={b.title} className="border-t-2 border-copper pt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">0{i+1}</div>
            <h3 className="mt-2 font-display text-2xl">{b.title}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{b.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Nos catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((c) => (
              <Link key={c.slug} to="/categorie/$slug" params={{ slug: c.slug }}
                className="border border-primary-foreground/20 p-5 hover:bg-copper hover:border-copper transition">
                <div className="font-display text-lg leading-tight">{c.name}</div>
                <div className="text-xs text-primary-foreground/60 mt-2">{c.count} produits</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
