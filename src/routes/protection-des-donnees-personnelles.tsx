import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, Section } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/protection-des-donnees-personnelles")({
  head: () => ({
    meta: [
      { title: "Protection des données personnelles — Verodav Home" },
      { name: "description", content: "Politique de protection des données personnelles conforme au RGPD." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalLayout
      title="Protection des données personnelles"
      intro="Dernière mise à jour : 17 août 2025."
    >
      <Section title="Préambule">
        <p>La Société accorde une grande valeur à l'honnêteté et a à cœur de construire avec ses clients une relation forte fondée sur la confiance et l'intérêt mutuel. Conformément à cette philosophie, la protection des données personnelles de ses clients est essentielle à ses yeux.</p>
        <p><strong>VERODAV HOME</strong> — Filiale de VERODAV GROUP, société par actions simplifiée au capital social de 2 000 euros, immatriculée au RCS sous le numéro 843 715 954, dont le siège social se situe au 21 rue de Cherbourg, 67100 Strasbourg (France), agit en tant que Responsable de traitement.</p>
        <p>La Société se réserve le droit de modifier cette politique afin de garantir sa conformité avec le droit en vigueur.</p>
      </Section>

      <Section title="Principes généraux en matière de traitement de données personnelles">
        <p>La Société s'engage à répondre aux exigences posées par le Règlement européen 2016/679 du 27 avril 2016 (RGPD), en respectant les principes fondamentaux suivants :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Licéité, loyauté et transparence</strong> : les données collectées le sont de manière licite, loyale et transparente.</li>
          <li><strong>Limitation des finalités</strong> : les données sont collectées pour des objectifs déterminés, explicites et légitimes.</li>
          <li><strong>Minimisation des données</strong> : les données doivent être pertinentes et traitées en adéquation avec leur finalité.</li>
          <li><strong>Exactitude</strong> : les données traitées doivent être exactes et tenues à jour.</li>
          <li><strong>Limitation de la conservation</strong> : la durée de conservation ne doit pas excéder celle nécessaire à la finalité.</li>
          <li><strong>Intégrité et confidentialité</strong> : des mesures techniques et organisationnelles appropriées sont mises en œuvre.</li>
        </ul>
      </Section>

      <Section title="Collecte des données personnelles">
        <p>Par donnée à caractère personnel, l'on entend « toute information se rapportant à une personne physique identifiée ou identifiable » (art. 4 RGPD). Tout utilisateur est amené à communiquer à la Société des données personnelles dans le cadre de formulaires tels que :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>la visite du Site et l'utilisation de cookies ;</li>
          <li>la création d'un compte client sur le Site ;</li>
          <li>le renseignement d'un formulaire de saisie d'informations ;</li>
          <li>la souscription à une newsletter ;</li>
          <li>le contact avec le Service client ;</li>
          <li>la rédaction d'un avis ou commentaire sur le Site.</li>
        </ul>
        <p>Les données pouvant être collectées comprennent : données d'identification (nom, prénom, âge, email, téléphone), données de connexion et navigation (adresse IP, cookies, terminaux), et autres données personnelles transmises dans le cadre de la prestation.</p>
        <p>Conformément au RGPD, la Société ne collecte ni ne traite de données dites « sensibles ».</p>
      </Section>

      <Section title="Finalités du traitement">
        <p><strong>Gestion de la relation client.</strong> Inscription, gestion du compte client et fourniture de la prestation.</p>
        <p><strong>Gestion du service Client.</strong> Communication avec le Client sur ses réclamations et questions.</p>
        <p><strong>Gestion des relations commerciales.</strong> Avec votre consentement, communication d'informations et messages de prospection, envoi de la newsletter.</p>
        <p><strong>Gestion administrative et financière.</strong> Réponse aux demandes légitimes d'autorités publiques (sécurité, lutte contre la fraude, application de la loi).</p>
      </Section>

      <Section title="Durée de conservation des données">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead className="bg-secondary">
              <tr><th className="text-left p-3">Catégorie</th><th className="text-left p-3">Durée</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-border"><td className="p-3">Données du compte Client</td><td className="p-3">5 ans à compter de la fin de la relation commerciale</td></tr>
              <tr className="border-t border-border"><td className="p-3">Données Client / Prospect</td><td className="p-3">5 ans à compter de la fin de la relation</td></tr>
              <tr className="border-t border-border"><td className="p-3">Actions commerciales</td><td className="p-3">3 ans à compter du dernier contact</td></tr>
              <tr className="border-t border-border"><td className="p-3">Pièce d'identité (exercice des droits)</td><td className="p-3">1 an à compter de la réception</td></tr>
              <tr className="border-t border-border"><td className="p-3">Cookies</td><td className="p-3">13 mois à compter du dépôt</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Destinataires des données">
        <p>Seules les personnes ayant besoin de traiter les données pour l'accomplissement de leurs obligations y ont accès. Certains sous-traitants (hébergement notamment) peuvent être destinataires, sous contrat garantissant la protection des données. Les données sont hébergées dans l'Union européenne et ne font l'objet d'aucun transfert hors UE.</p>
      </Section>

      <Section title="Mesures de sécurité et de confidentialité">
        <p>La Société s'engage à ne pas vendre, louer ni partager les informations personnellement identifiables des utilisateurs avec des tiers, sauf raison légale contraignante. En application de l'article 32 du RGPD, des mesures techniques et organisationnelles ont été instaurées : pseudonymisation, anonymisation, chiffrement HTTPS, garantie de la confidentialité et de la résilience des services, procédures d'évaluation de l'efficacité des mesures.</p>
      </Section>

      <Section title="Droits des utilisateurs">
        <p>Tout utilisateur bénéficie d'un droit d'accès, de portabilité, de rectification, d'effacement, de limitation du traitement, d'opposition, ainsi que du droit de déterminer le sort des données après le décès (art. 40-1 Loi Informatique et Libertés). Aucun processus de traitement entièrement automatisé n'est utilisé. Le consentement donné peut être retiré à tout moment.</p>
      </Section>

      <Section title="Exercice des droits — Contact">
        <p>Pour obtenir des informations ou exercer vos droits :</p>
        <p>
          Par courrier électronique : <a href={`mailto:${SITE.email}`} className="text-copper hover:underline">{SITE.email}</a><br />
          Par courrier postal : VERODAV HOME — 21 rue de Cherbourg, 67100 Strasbourg, France
        </p>
        <p>La Société s'engage à répondre dans un délai d'un (1) mois maximum. En cas de désaccord, vous pouvez saisir la CNIL — 3 Place de Fontenoy, TSA 80715, 75334 PARIS Cedex 07 — ou via <a href="https://www.cnil.fr/fr/agir" target="_blank" rel="noreferrer" className="text-copper hover:underline">cnil.fr/fr/agir</a>.</p>
      </Section>

      <Section title="Politique relative aux cookies">
        <p>Lors de votre visite, des cookies peuvent être installés sur votre logiciel de navigation. Les cookies strictement nécessaires (fonctionnement, panier, identification) sont exemptés de consentement. Les cookies non strictement nécessaires (publicité, personnalisation) requièrent votre consentement préalable, valable 13 mois maximum.</p>
        <p>Vous pouvez à tout moment paramétrer votre navigateur pour accepter ou refuser les cookies.</p>
      </Section>
    </LegalLayout>
  );
}
