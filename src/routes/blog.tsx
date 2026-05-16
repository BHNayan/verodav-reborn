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
  const [featured, ...rest] = posts;
  return (
    <div className="mx-auto max-w-[1400px] px-5 lg:px-10 py-14 md:py-20">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-copper">Le journal</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95]">Blog</h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          Conseils, guides d'achat et inspirations pour mieux équiper votre cuisine et votre maison.
        </p>
      </header>

      {/* Featured */}
      <Link
        to="/blog/$slug"
        params={{ slug: featured.slug }}
        className="mt-12 grid lg:grid-cols-12 gap-6 lg:gap-10 group"
      >
        <div className="lg:col-span-7 overflow-hidden bg-secondary aspect-[16/10]">
          <img
            src={featured.image}
            alt={featured.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="text-copper">{featured.category}</span>
            <span className="h-px w-6 bg-border" />
            <span>{formatDate(featured.date)}</span>
            <span>· {featured.readTime}</span>
          </div>
          <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight group-hover:text-copper transition">
            {featured.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary group-hover:text-copper">
            Lire l'article →
          </span>
        </div>
      </Link>

      {/* Grid */}
      <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
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
            </div>
            <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-copper transition">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
