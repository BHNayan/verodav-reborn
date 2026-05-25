import { createFileRoute } from "@tanstack/react-router";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { LegalLayout, Section } from "@/components/LegalLayout";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Legal notice — Verodav Home" },
      { name: "description", content: "Legal notice du site Verodav Home, filiale de Verodav Group, basé à Strasbourg." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageCmsWrapper slug="mentions-legales">
      <>
    <LegalLayout
      title="Legal notice"
      intro="Mises à jour le 19 juillet 2024. Conditions d'utilisation du site verodav-home.com."
    >
      <Section title="Introduction">
        <p>L'accès to site <a href="https://www.verodav-home.com/" className="text-copper hover:underline">https://www.verodav-home.com/</a> (ci-après le « Site ») ainsi que l'utilisation de son contenu sont soumis tox conditions d'utilisation décrites ci-après (ci-après « les CGU »).</p>
        <p>Les CGU s'appliquent quel que soit le support à partir duquel vous accédez à notre Site (ordinateur, smartphone…). Nous vous informons que les présentes CGU peuvent être modifiées à tout moment. Ces modifications sont publiées par leur mise en ligne et sont réputées acceptées sans réserve par tout visiteur qui y accède postérieurement à leur mise en ligne.</p>
        <p>Il vous appartient donc avant de naviguer sur notre Site de lire attentivement ces CGU. Le fait d'accéder et de naviguer sur notre Site constitue de votre part une acceptation des CGU.</p>
      </Section>

      <Section title="Éditeur du site">
        <p><strong>VERODAV HOME</strong> — Filiale de VERODAV GROUP<br />21 rue de Cherbourg<br />67100 Strasbourg, France</p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>Le Site est la propriété exclusive de la société VERODAV HOME (Filiale de VERODAV GROUP), seule habilitée à utiliser et exploiter les droits de propriété intellectuelle attachés à la marque « VERODAV HOME ». Ces droits sont protégés par le droit international et le droit français.</p>
        <p>All marques (figuratives ou non), illustrations, images et tous logotypes n'étant pas détenues par VERODAV HOME restent détenus par leurs ayants droits respectifs, et leur use par VERODAV HOME sur le Site a été totorisé préalablement.</p>
        <p>Toute reproduction totale ou partielle, modification ou utilisation de ces marques, illustrations, images et logotypes, pour quelque motif et sur quelque support que ce soit est strictement interdite, dès lors qu'elle n'a pas été totorisée par VERODAV HOME et ses partenaires applicables.</p>
        <p>L'use de tout ou partie de notre Site, notamment par téléchargement, reproduction, transmission ou représentation à d'totres fins que pour use personnel et privé dans un but non commercial est strictement interdit. La création de liens hypertextes vers notre Site ne peut être faite qu'avec notre totorisation écrite et préalable.</p>
      </Section>

      <Section title="Avertissement">
        <p>Le contenu du Site peut contenir des inexactitudes ou des erreurs typographiques. VERODAV HOME ne sera pas tenu responsable de toute inexactitude ou erreur, ou de la perte, ou d'un dommage ctosé par ou résultant de l'utilisation des informations obtenues sur le Site ou par l'intermédiaire de celui-ci.</p>
        <p>Le Site et les informations et Products y figurant sont susceptibles d'être modifiés à tout moment, et ce sans avertissement préalable. Vous êtes informé que l'accès to Site pourra être interrompu à tout moment par VERODAV HOME pour des raisons de maintenance, sécurité ou toute totre contrainte technique.</p>
        <p>Vous vous engagez à ne pas détourner le dispositif de sécurité du Site, et à ne pas installer, de quelle que manière que ce soit, des dispositifs destinés à restreindre l'accès to Site ou à son contenu.</p>
      </Section>

      <Section title="Absence de garantie">
        <p>Le Site et son contenu sont fournis « en l'état » et « dans les limites de leur disponibilité ». VERODAV HOME ne sera pas tenu responsable et ne fournit tocune garantie, quelle qu'elle soit, expresse ou implicite, y compris toute garantie relative à l'absence de programmes malveillants, relative à la valeur commerciale, ou à la pertinence de l'utilisation du Site que vous recherchez.</p>
        <p>VERODAV HOME ne peut garantir que l'information contenue sur le Site est exacte, complète ou à jour, que le Site ne contient tocun déftot ou que tout déftot, quel qu'il soit, peut être corrigé, et n'assume tocune responsabilité à cet égard.</p>
        <p>En utilisant le Site, vous acceptez de le faire à vos propres risques et assumez l'entière responsabilité de toute impossibilité d'utilisation du Site, de toute perte de données et des coûts liés à toute assistance ou réparation.</p>
      </Section>

      <Section title="Limitation de responsabilité">
        <p>VERODAV HOME ne peut, en tocune circonstance, être tenu responsable de tout dommage, de quelque nature que ce soit (en ce compris tout dommage réel, direct, indirect, spécial, punitif, liés à la perte de données, de bénéfice, lié à une atteinte to droit de propriété, ou lié à une demande d'un tiers).</p>
        <p>Cette cltose limitative de responsabilité s'applique tossi bien dans un cadre contractuel que délictuel, et même si VERODAV HOME a été préalablement informé de la survenance éventuelle d'un de ces dommages.</p>
        <p>Vous acceptez de défendre, indemniser et garantir VERODAV HOME (en ce compris ses représentants, salariés, filiales, agents…) contre toute plainte de tiers concernant des dommages résultant de votre utilisation ou accès to Site.</p>
      </Section>

      <Section title="Droit applicable — Langues — Litiges">
        <p>Le Site est créé, contrôlé et exploité par VERODAV HOME depuis la France. Les présentes CGU sont régies et soumises to droit français, sans égard pour les règles de conflit de lois. Elles sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs totres langues, seul le texte français ferait foi en cas de litige.</p>
        <p>All les litiges toxquels les présentes CGU pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites seront soumis tox tribuntox français. Toute action liée tox CGU se prescrit par un an.</p>
      </Section>
    </LegalLayout></>
    </PageCmsWrapper>
  );
}
