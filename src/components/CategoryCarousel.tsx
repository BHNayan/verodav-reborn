import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCategories } from "@/lib/products";

export function CategoryCarousel() {
  const categories = useCategories();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cat-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-copper">— Catégories</span>
            <h2 className="mt-3 font-display font-light text-3xl md:text-5xl tracking-tight text-balance">
              Toutes nos <em className="not-italic italic text-copper">familles</em>.
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Précédent"
              className="h-11 w-11 inline-flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Suivant"
              className="h-11 w-11 inline-flex items-center justify-center border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/categorie/$slug"
              params={{ slug: c.slug }}
              data-cat-card
              className="group relative shrink-0 snap-start w-[72%] sm:w-[46%] md:w-[34%] lg:w-[26%] xl:w-[22%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent" />
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.28em] text-primary-foreground/90 bg-primary/40 backdrop-blur px-2.5 py-1">
                  {c.count} produits
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground flex items-end justify-between gap-3">
                  <h3 className="font-display text-2xl leading-tight">{c.name}</h3>
                  <ArrowUpRight className="h-5 w-5 text-copper translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
