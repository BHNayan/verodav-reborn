import { createFileRoute } from "@tanstack/react-router";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Verodav Home" },
      { name: "description", content: "Contactez Verodav Home à Strasbourg. Conseils, commandes, service après-vente." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageCmsWrapper slug="contact">
      <>
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— Nous contacter</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">Contact</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Une question, une commande, un conseil sur une pièce de rechange ?
            Notre équipe vous répond rapidement.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl mb-6">Coordonnées</h2>
          <ul className="space-y-5">
            <li className="flex gap-4">
              <MapPin className="h-5 w-5 text-copper shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Boutique</div>
                <div className="text-muted-foreground">{SITE.address}</div>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="h-5 w-5 text-copper shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Téléphone</div>
                <a href={`tel:${SITE.phoneRaw}`} className="text-muted-foreground hover:text-copper">{SITE.phone}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="h-5 w-5 text-copper shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Email</div>
                <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-copper">{SITE.email}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="h-5 w-5 text-copper shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Horaires</div>
                <div className="text-muted-foreground">Lun–Sam · 9h–18h</div>
              </div>
            </li>
          </ul>

          <div className="mt-8 aspect-[16/10] overflow-hidden border border-border">
            <iframe
              title="Carte"
              src="https://www.openstreetmap.org/export/embed.html?bbox=7.738%2C48.575%2C7.768%2C48.595&layer=mapnik&marker=48.585%2C7.753"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>

        <form
          action={`mailto:${SITE.email}`}
          method="post"
          encType="text/plain"
          className="bg-card border border-border p-8"
        >
          <h2 className="font-display text-2xl mb-6">Écrivez-nous</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Nom</label>
              <input name="Nom" required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <input name="Email" type="email" required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Sujet</label>
              <input name="Sujet" className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea name="Message" rows={6} required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <button type="submit" className="w-full bg-primary px-6 py-4 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors">
              Envoyer le message
            </button>
          </div>
        </form>
      </div>
    </></>
    </PageCmsWrapper>
  );
}
