import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { usePosts, formatDate } from "@/lib/blog";

const PAGE_SIZE = 6;

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  n: fallback(z.number().int().min(PAGE_SIZE), PAGE_SIZE).default(PAGE_SIZE),
});

type BlogSearch = { q: string; n: number };

export const Route = createFileRoute("/blog")({
  validateSearch: zodValidator(searchSchema),
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
  const { q, n } = Route.useSearch();
  const navigate = Route.useNavigate();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return posts;
    const tokens = term.split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.excerpt,
        p.category,
        ...p.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.bullets ?? [])]),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((t: string) => haystack.includes(t));
    });
  }, [q]);

  const visible = filtered.slice(0, n);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="mx-auto max-w-[1400px] px-5 lg:px-10 py-14 md:py-20">
      <header className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-copper">Le journal</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[0.95]">Blog</h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          Conseils, guides d'achat et inspirations pour mieux équiper votre cuisine et votre maison.
        </p>
      </header>

      {/* Search */}
      <div className="mt-10 max-w-xl">
        <label htmlFor="blog-search" className="sr-only">
          Rechercher un article
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="blog-search"
            type="search"
            value={q}
            onChange={(e) =>
              navigate({
                search: (prev: BlogSearch) => ({ ...prev, q: e.target.value, n: PAGE_SIZE }),
                replace: true,
              })
            }
            placeholder="Rechercher un article, un mot-clé…"
            className="w-full bg-secondary/60 border border-border rounded-none pl-11 pr-11 py-3 text-sm outline-none focus:border-copper transition placeholder:text-muted-foreground"
          />
          {q && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  search: (prev: BlogSearch) => ({ ...prev, q: "", n: PAGE_SIZE }),
                  replace: true,
                })
              }
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-copper"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
          {filtered.length} article{filtered.length > 1 ? "s" : ""}
          {q && <> · pour « <span className="text-foreground">{q}</span> »</>}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-20 border border-dashed border-border py-20 text-center">
          <p className="font-display text-2xl">Aucun article trouvé</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Essayez un autre mot-clé ou{" "}
            <button
              type="button"
              className="text-copper underline underline-offset-4"
              onClick={() =>
                navigate({
                  search: (prev: BlogSearch) => ({ ...prev, q: "", n: PAGE_SIZE }),
                  replace: true,
                })
              }
            >
              réinitialisez la recherche
            </button>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-12 md:mt-16 grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
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

          <div className="mt-14 flex flex-col items-center gap-3">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {visible.length} / {filtered.length}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() =>
                  navigate({
                    search: (prev: BlogSearch) => ({
                      ...prev,
                      n: Math.min(prev.n + PAGE_SIZE, filtered.length),
                    }),
                  })
                }
                className="border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition"
              >
                Charger plus
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
