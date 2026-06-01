import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export type Testimonial = {
  name: string;
  city: string;
  rating: number;
  text: string;
};

const DEFAULT: Testimonial[] = [
  {
    name: "Camille R.",
    city: "Strasbourg",
    rating: 5,
    text: "Impeccable service and products of remarkable quality. My Verodav fan is silent and elegant — a real daily delight.",
  },
  {
    name: "Julien M.",
    city: "Lyon",
    rating: 5,
    text: "Fast shipping, careful packaging. The team helped me find the compatible spare part in less than 24 hours. Highly recommended.",
  },
  {
    name: "Sophie L.",
    city: "Paris",
    rating: 5,
    text: "A shop that takes the time to advise. My cookware lasts over time, as promised. Bravo for this commitment to quality.",
  },
  {
    name: "Antoine D.",
    city: "Bordeaux",
    rating: 5,
    text: "A truly refined selection. You can feel the passion behind every product. My manual grinder is an everyday object I use with pleasure.",
  },
  {
    name: "Marie F.",
    city: "Nantes",
    rating: 5,
    text: "Excellent buying experience. Clear website, valuable advice and exemplary after-sales follow-up. I'll come back without hesitation.",
  },
];

type Props = {
  items?: Testimonial[];
  variant?: "light" | "dark";
};

export function Testimonials({ items = DEFAULT, variant = "light" }: Props) {
  const [i, setI] = useState(0);
  const n = items.length;

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const prev = () => setI((p) => (p - 1 + n) % n);
  const next = () => setI((p) => (p + 1) % n);

  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "bg-primary text-primary-foreground"
          : "bg-card border-y border-border"
      }
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-copper">
              — Customer reviews
            </span>
            <h2 className="mt-3 font-display font-light text-5xl md:text-6xl tracking-tight text-balance">
              They <em className="italic text-copper not-italic">trust us</em>.
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              aria-label="Previous"
              className={`h-12 w-12 inline-flex items-center justify-center border transition ${
                isDark
                  ? "border-primary-foreground/30 hover:bg-copper hover:border-copper"
                  : "border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className={`h-12 w-12 inline-flex items-center justify-center border transition ${
                isDark
                  ? "border-primary-foreground/30 hover:bg-copper hover:border-copper"
                  : "border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-ort"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {items.map((t, idx) => (
              <article
                key={idx}
                className="min-w-full grid lg:grid-cols-12 gap-10 px-1"
              >
                <div className="lg:col-span-2 flex lg:block">
                  <Quote className="h-14 w-14 text-copper" />
                </div>
                <div className="lg:col-span-10">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-copper text-copper" />
                    ))}
                  </div>
                  <p className="font-display font-light text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-balance">
                    « {t.text} »
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-px w-12 bg-copper" />
                    <div>
                      <div className="font-display text-lg">{t.name}</div>
                      <div
                        className={`text-[11px] uppercase tracking-[0.25em] mt-1 ${
                          isDark ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {t.city}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to review ${idx + 1}`}
              className={`h-1 transition-all ${
                idx === i
                  ? "w-12 bg-copper"
                  : isDark
                    ? "w-6 bg-primary-foreground/30 hover:bg-primary-foreground/60"
                    : "w-6 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
