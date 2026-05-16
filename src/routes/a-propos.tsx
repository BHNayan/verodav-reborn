import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { categories } from "@/lib/products";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Verodav Home" },
      {
        name: "description",
        content:
          "Verodav Home, boutique d'équipements pour la cuisine, la maison et le travail. Fondée en 2014 à Strasbourg.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    n: "01",
    title: "Fiabilité",
    body: "Des références sélectionnées pour leur qualité, leur ergonomie et leur durabilité. Nous travaillons directement avec des fournisseurs et marques réputés.",
  },
  {
    n: "02",
    title: "Service attentif",
    body: "Conseils, compatibilité de pièces, suivi de commande. Une équipe joignable, basée à Strasbourg, à l'écoute de chaque client.",
  },
  {
    n: "03",
    title: "Produits distinctifs",
    body: "Innovation, praticité et durabilité réunies dans une gamme pensée pour simplifier et enrichir votre quotidien.",
  },
];

const FAQ = [
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous acceptons plusieurs méthodes de paiement pratiques, notamment les cartes de crédit/débit, PayPal et d'autres passerelles de paiement en ligne. Vous pouvez choisir l'option qui vous convient le mieux lors du processus de paiement.",
  },
  {
    q: "Quelles sont les options d'expédition et les délais de livraison ?",
    a: "Nous proposons plusieurs options d'expédition, y compris la livraison standard et la livraison express. Les délais de livraison dépendent de votre lieu de résidence et de la méthode d'expédition choisie. Vous trouverez des informations détaillées sur les options d'expédition et les délais de livraison estimés lors du processus de commande.",
  },
  {
    q: "Proposez-vous des services d'expédition internationale ?",
    a: "Oui, nous assurons l'expédition internationale vers de nombreux pays. Veuillez vérifier les destinations d'expédition disponibles lors du processus de paiement ou consultez notre page sur la politique d'expédition pour plus d'informations.",
  },
  {
    q: "Comment puis-je suivre ma commande ?",
    a: "Une fois votre commande expédiée, vous recevrez un courriel de confirmation contenant un numéro de suivi. Vous pouvez utiliser ce numéro de suivi pour contrôler l'état de votre envoi. En outre, vous pouvez vous connecter à votre compte sur notre site web et naviguer jusqu'à la section « Historique des commandes » pour suivre votre commande.",
  },
  {
    q: "Que faire si j'ai un problème avec ma commande ou si j'ai besoin d'aide ?",
    a: "Si vous avez des questions, des préoccupations ou si vous avez besoin d'aide pour passer votre commande, notre équipe d'assistance à la clientèle est là pour vous aider. Vous pouvez nous contacter en utilisant les informations de contact fournies sur notre site web ou en utilisant nos canaux d'assistance à la clientèle désignés.",
  },
  {
    q: "Mes données personnelles et de paiement sont-elles sécurisées ?",
    a: "Nous prenons au sérieux votre vie privée et votre sécurité. Nous utilisons des mesures de sécurité conformes aux normes industrielles pour protéger vos données personnelles et vos informations de paiement. Notre site web est crypté, ce qui garantit la sécurité de vos données pendant leur transmission.",
  },
  {
    q: "Les produits proposés sur votre site sont-ils authentiques ?",
    a: "Nous garantissons que tous les produits figurant sur notre site web sont authentiques. Nous travaillons directement avec des fournisseurs et des marques réputés pour assurer la qualité et l'authenticité des produits que nous proposons.",
  },
  {
    q: "Proposez-vous des récompenses ou des programmes de fidélité ?",
    a: "Oui, nous accordons de l'importance à nos clients et leur proposons divers programmes de récompense et de fidélisation. Restez à l'écoute de nos bulletins d'information, de nos canaux de médias sociaux ou des annonces sur notre site Web pour connaître les remises exclusives, les promotions et les récompenses de fidélité offertes à nos précieux clients.",
  },
];

function AboutPage() {
  return (
    <>
      {/* HERO */}
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.3em] text-copper">— À propos</span>
            <h1 className="mt-3 font-display text-5xl md:text-7xl text-balance leading-[1.02]">
              Votre destination pour des <em className="text-copper not-italic">appareils de qualité</em>.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-border">
            <p className="text-muted-foreground leading-relaxed">
              Verodav Home est la boutique incontournable pour découvrir une large gamme d'équipements
              performants, pratiques et fiables, que ce soit pour la cuisine, la maison ou le travail.
            </p>
            <div className="mt-6 flex items-center gap-6 text-xs uppercase tracking-widest">
              <div>
                <div className="font-display text-3xl text-primary">2014</div>
                <div className="text-muted-foreground mt-1">Année de création</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="font-display text-3xl text-primary">Strasbourg</div>
                <div className="text-muted-foreground mt-1">France</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STORY */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— Notre histoire</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Fondée par un passionné de solutions pratiques.
          </h2>
        </div>
        <div className="lg:col-span-8 space-y-5 text-foreground/85 leading-relaxed">
          <p>
            Notre mission est de simplifier votre quotidien en vous proposant des solutions innovantes
            tout en garantissant une expérience client exceptionnelle. Nous nous appuyons sur trois
            piliers essentiels : <strong>la fiabilité</strong>, <strong>un service clientèle attentif</strong>,
            et <strong>des produits distinctifs</strong> qui répondent à vos besoins variés.
          </p>
          <p>
            Depuis sa création en 2014 par un passionné de solutions pratiques et de design fonctionnel,
            Verodav Home s'engage à offrir des produits qui allient qualité, innovation et efficacité
            pour améliorer votre confort au quotidien, que ce soit à la maison ou au bureau.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-copper">— Nos valeurs</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl max-w-2xl">
                L'excellence et la satisfaction de nos clients au cœur de chaque décision.
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v) => (
              <div key={v.n} className="border-t-2 border-copper pt-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{v.n}</div>
                <h3 className="mt-2 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-3xl text-foreground/80 leading-relaxed">
            Verodav Home, c'est avant tout une histoire de passion : une passion pour des solutions qui
            améliorent la vie, une histoire humaine fondée sur le travail acharné, et une relation de
            confiance durable avec nos clients.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— FAQ</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Questions fréquentes.</h2>
          <p className="mt-4 text-muted-foreground">
            Une autre question ?{" "}
            <Link to="/contact" className="text-copper underline-offset-4 hover:underline">
              Contactez-nous
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-8">
          <FaqList />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Nos catégories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/categorie/$slug"
                params={{ slug: c.slug }}
                className="border border-primary-foreground/20 p-5 hover:bg-copper hover:border-copper transition"
              >
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

function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-border border-y border-border">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left group"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg md:text-xl text-primary group-hover:text-copper transition">
                {item.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-copper transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground leading-relaxed pr-10">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
