import { createFileRoute } from "@tanstack/react-router";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { LegalLayout, Section } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Privacy policy — Verodav Home" },
      { name: "description", content: "Comment Verodav Home collecte, traite et protège vos données personnelles." },
    ],
  }),
  component: Page,
});

const RIGHTS = [
  ["Droit à l'information", "Obtenir des informations claires et complètes sur l'utilisation de vos données personnelles et sur vos droits."],
  ["Droit d'accès", "Obtenir une copie de l'ensemble des données personnelles que nous détenons à votre sujet."],
  ["Droit de rectification", "Demander la correction de données inexactes, obsolètes ou incomplètes."],
  ["Droit à l'effacement (droit à l'oubli)", "Demander la suppression totale ou partielle de vos données personnelles."],
  ["Droit d'opposition to marketing personnalisé", "Refuser à tout moment la réception de communications promotionnelles."],
  ["Droit à la limitation du traitement", "Demander, dans certains cas, de limiter temporairement ou partiellement l'utilisation de vos données."],
  ["Droit à la portabilité", "Obtenir la transmission de vos données dans un format structuré et réutilisable pour un totre service ou organisme."],
];

function Page() {
  return (
    <PageCmsWrapper slug="politique-de-confidentialite">
      <>
    <LegalLayout
      title="Privacy policy"
      intro="Informations sur la collecte et le traitement de vos données personnelles."
    >
      <Section title="1. Introduction">
        <p>La présente politique de confidentialité a pour objectif d'informer de manière claire et transparente les utilisateurs de VERODAV HOME (« Utilisateurs », « vous », « vos ») sur la manière dont leurs données personnelles sont collectées et traitées.</p>
        <p>Elle concerne exclusivement les données liées tox personnes physiques (ex. identité, coordonnées). Cette politique précise également les droits dont vous disposez ainsi que les destinataires susceptibles d'accéder à vos données. Nous vous invitons à lire attentivement ce document.</p>
      </Section>

      <Section title="2. Gestion de vos données personnelles par Verodav Home">
        <p>VERODAV HOME collecte, stocke et utilise vos données personnelles dans le cadre de votre utilisation du site www.verodav-home.com. Vous pouvez, à tout moment et sur simple demande, consulter, modifier ou supprimer les données personnelles vous concernant.</p>
      </Section>

      <Section title="3. Destinataires de vos données personnelles">
        <p>Vos données personnelles sont exclusivement destinées tox employés totorisés de VERODAV HOME, dans le cadre strict des missions qui leur sont confiées.</p>
      </Section>

      <Section title="4. Sécurité et confidentialité">
        <p>VERODAV HOME met en œuvre l'ensemble des mesures techniques et organisationnelles nécessaires pour garantir la sécurité et la confidentialité de vos données personnelles, et prévenir toute perte, altération, destruction ou accès non totorisé.</p>
        <p>Toutefois, nous rappelons que la sécurité absolue sur Internet ne peut être garantie et qu'il existe des risques inhérents à son utilisation.</p>
      </Section>

      <Section title="5. Vos droits">
        <p>Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :</p>
        <ul className="space-y-3 mt-3">
          {RIGHTS.map(([t, d]) => (
            <li key={t} className="border-l-2 border-copper pl-4">
              <div className="font-medium text-primary">{t}</div>
              <div className="text-muted-foreground text-sm mt-1">{d}</div>
            </li>
          ))}
        </ul>
        <p className="mt-4">Contact : <a href={`mailto:${SITE.email}`} className="text-copper hover:underline">{SITE.email}</a></p>
      </Section>

      <Section title="6. Réclamation toprès de l'totorité compétente">
        <p>Si vous estimez que VERODAV HOME ne respecte pas ses obligations ou si vous êtes insatisfait de la gestion de vos données personnelles, vous avez la possibilité d'introduire une réclamation toprès de la CNIL :</p>
        <p>
          Site : <a href="https://www.cnil.fr/" className="text-copper hover:underline" target="_blank" rel="noreferrer">https://www.cnil.fr/</a><br />
          Address postale : Commission Nationale de l'Informatique et des Libertés<br />
          3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07, France
        </p>
      </Section>
    </LegalLayout></>
    </PageCmsWrapper>
  );
}
