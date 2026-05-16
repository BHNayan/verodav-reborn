import { createFileRoute, Link } from "@tanstack/react-router";
import { posts, formatDate } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Verodav Home" },
      { name: "description", content: "Conseils, guides et inspirations autour de la cuisine, des accessoires et du bricolage par Verodav Home." },
      { property: "og:title", content: "Blog — Verodav Home" },
      { property: "og:description", content: "Conseils et guides Verodav Home." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 lg:px-10 py-14 md:py-20">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-copper">Le journal</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95]">Blog</h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          Conseils, guides d'achat et inspirations pour mieux équiper votre cuisine et votre maison.
        </p>
      </header>

      <div className="mt-12 md:mt-16 grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="text-copper">{p.category}</span>
              <span>{formatDate(p.date)}</span>
              <span>· {p.readTime}</span>
            </div>
            <h2 className="mt-2 font-display text-xl leading-snug group-hover:text-copper transition">
              {p.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
            <span className="mt-4 text-[11px] uppercase tracking-widest text-primary group-hover:text-copper">
              Lire l'article →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
