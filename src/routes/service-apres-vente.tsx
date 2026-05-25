import { createFileRoute } from "@tanstack/react-router";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { LegalLayout, Section } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/service-apres-vente")({
  head: () => ({
    meta: [
      { title: "After-sales service — Verodav Home" },
      { name: "description", content: "Garanties, conditions de retour, processus de réclamation et support client Verodav Home." },
      { property: "og:title", content: "After-sales service — Verodav Home" },
      { property: "og:description", content: "Garanties, conditions de retour, processus de réclamation et support client Verodav Home." },
      { property: "og:url", content: "https://verodav-reborn.lovable.app/service-apres-vente" },
    ],
    links: [{ rel: "canonical", href: "https://verodav-reborn.lovable.app/service-apres-vente" }],
  }),
  component: Page,
});

function Page() {
  return (
    <PageCmsWrapper slug="service-apres-vente">
      <>
    <LegalLayout
      title="After-sales service"
      intro="Chez Verodav Home, notre objectif est de garantir la satisfaction de nos clients en offrant un service après-vente rapide, efficace et transparent."
    >
      <Section title="1. Garantie des products">
        <p>All nos products sont couverts par deux garanties légales :</p>
        <ul className="space-y-3 mt-2">
          <li className="border-l-2 border-copper pl-4">
            <div className="font-medium text-primary">Garantie légale de conformité</div>
            <div className="text-muted-foreground text-sm mt-1">Valable pendant deux ans à compter de la réception du produit, cette garantie couvre les défauts de fabrication ou de conformité qui rendent le produit inutilisable ou non conforme à la description fournie.</div>
          </li>
          <li className="border-l-2 border-copper pl-4">
            <div className="font-medium text-primary">Garantie contre les défauts cachés</div>
            <div className="text-muted-foreground text-sm mt-1">Si un défaut non apparent au moment de l'achat apparaît et affecte l'utilisation du produit, vous pouvez bénéficier de cette garantie sous certaines conditions légales.</div>
          </li>
        </ul>
        <p>En cas de produit défectueux ou non conforme, vous pouvez choisir entre une réparation, un remplacement ou un remboursement, selon la nature du problème et les disponibilités.</p>
      </Section>

      <Section title="2. Conditions de retour">
        <p>Vous disposez d'un délai de <strong>14 jours</strong> à compter de la réception de votre commande pour retourner un produit si vous n'êtes pas satisfait, <strong>au fournisseur final</strong> (l'adresse vous sera communiquée).</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Le produit doit être retourné en parfait état, non utilisé, et dans son emballage d'origine avec tous les accessoires.</li>
          <li>Les frais de retour sont à la charge du client, sauf si le produit est défectueux ou non conforme.</li>
          <li>Pour organiser un retour, vous devez nous contacter au préalable via les informations fournies ci-dessous.</li>
        </ul>
      </Section>

      <Section title="3. Processus de réclamation">
        <p>Pour toute réclamation liée à un produit ou à votre commande, nous avons mis en place un processus simple et rapide :</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div className="border border-border p-5 bg-card">
            <div className="text-xs uppercase tracking-widest text-copper">Étape 1</div>
            <div className="font-medium mt-1 text-primary">Contactez notre support</div>
            <p className="text-sm text-muted-foreground mt-2">Envoyez-nous un e-mail à <a href={`mailto:${SITE.email}`} className="text-copper hover:underline">{SITE.email}</a> en précisant votre numéro de commande, une description détaillée du problème et, si possible, des photos ou vidéos.</p>
          </div>
          <div className="border border-border p-5 bg-card">
            <div className="text-xs uppercase tracking-widest text-copper">Étape 2</div>
            <div className="font-medium mt-1 text-primary">Analyse et réponse</div>
            <p className="text-sm text-muted-foreground mt-2">Notre équipe SAV s'engage à répondre à votre réclamation sous <strong>48 heures ouvrables</strong>, en mettant à votre disposition le lien pour faciliter l'envoi du colis direct chez le fournisseur.</p>
          </div>
        </div>
      </Section>

      <Section title="4. Exclusions de garantie">
        <p>La garantie ne couvre pas :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>L'usure normale du produit ;</li>
          <li>Les dommages causés par une utilisation inappropriée ou non conforme aux instructions ;</li>
          <li>Les modifications ou réparations effectuées par des tiers non autorisés ;</li>
          <li>Les dommages causés par des accidents, des chutes, l'eau ou tout autre facteur extérieur.</li>
        </ul>
      </Section>

      <Section title="5. Procédure de retour et remboursement">
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Préparez votre colis</strong> : placez le produit dans son emballage d'origine, en incluant tous les accessoires, manuels et factures.</li>
          <li><strong>Étiquetez le colis</strong> : utilisez l'étiquette de retour que nous vous fournirons après votre demande. Les frais de retour sont à votre charge, sauf indication contraire (produit défectueux).</li>
          <li><strong>Suivi du retour</strong> : direct avec le fournisseur dès réception du colis.</li>
          <li><strong>Remboursement</strong> : après confirmation par le fournisseur final, Verodav effectue un virement sous <strong>10 jours ouvrables</strong> via le mode de paiement initial.</li>
        </ol>
      </Section>

      <Section title="6. Support client">
        <p>Notre équipe de support client est disponible pour répondre à toutes vos questions et préoccupations.</p>
        <div className="mt-3 p-5 bg-secondary/60 border border-border">
          <p>Email : <a href={`mailto:${SITE.email}`} className="text-copper hover:underline">{SITE.email}</a></p>
          <p>Phone : <a href={`tel:${SITE.phoneRaw}`} className="text-copper hover:underline">{SITE.phone}</a></p>
          <p>Hours: Monday to Friday, de 9h à 18h</p>
        </div>
        <p className="mt-4 text-sm">Chez Verodav Home, nous nous engageons à vous offrir une expérience client de qualité, même après l'achat. N'hésitez pas à nous contacter pour toute demande d'assistance !</p>
      </Section>
    </LegalLayout></>
    </PageCmsWrapper>
  );
}
