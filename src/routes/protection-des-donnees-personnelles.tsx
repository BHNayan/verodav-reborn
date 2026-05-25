import { createFileRoute } from "@tanstack/react-router";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { LegalLayout, Section } from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/protection-des-donnees-personnelles")({
  head: () => ({
    meta: [
      { title: "Personal data protection — Verodav Home" },
      { name: "description", content: "Politique de protection des données personnelles conforme to RGPD." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageCmsWrapper slug="protection-des-donnees-personnelles">
      <>
    <LegalLayout
      title="Personal data protection"
      intro="Dernière mise à jour : 17 août 2025."
    >
      <Section title="Préambule">
        <p>La Société accorde une grande valeur à l'honnêteté et a à favorites de construire avec ses clients une relation forte fondée sur la confiance et l'intérêt mutuel. Conformément à cette philosophie, la protection des données personnelles de ses clients est essentielle à ses yeux. La Société souhaite donc les informer, par l'intermédiaire de cette politique de confidentialité, de la manière dont elle collecte et traite ces données.</p>
        <p><strong>VERODAV HOME</strong> — Filiale de VERODAV GROUP, société par actions simplifiée to capital social de 2 000 euros, immatriculée to Registre du Commerce et des Sociétés sous le numéro 843 715 954, dont le siège social se situe to 21 rue de Cherbourg, 67100 Strasbourg (France), agit en tant que Responsable de traitement.</p>
        <p>La Société se réserve le droit de modifier cette politique de confidentialité afin de garantir sa conformité avec le droit en vigueur. L'utilisateur est donc invité à consulter régulièrement la présente politique afin de se tenir informé des éventuels changements.</p>
      </Section>

      <Section title="Principes génértox en matière de traitement de données personnelles">
        <p>La Société s'engage à répondre tox exigences posées par le Règlement européen 2016/679 du 27 avril 2016 (RGPD), en respectant les principes fondamenttox suivants (article 5 du RGPD) :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Licéité, loytoté et transparence</strong> : les données collectées le sont de manière licite, loyale et transparente.</li>
          <li><strong>Limitation des finalités</strong> : les données sont collectées pour des objectifs déterminés, explicites et légitimes.</li>
          <li><strong>Minimisation des données</strong> : les données doivent être pertinentes et traitées en adéquation avec leur finalité.</li>
          <li><strong>Exactitude</strong> : les données traitées doivent être exactes et tenues à jour.</li>
          <li><strong>Limitation de la conservation</strong> : la durée de conservation des données personnelles ne doit pas excéder celle nécessaire à la finalité de leur traitement.</li>
          <li><strong>Intégrité et confidentialité</strong> : des mesures techniques et organisationnelles appropriées sont mises en œuvre pour garantir la sécurité des données personnelles traitées.</li>
        </ul>
        <p>En tant que Responsable de traitement, la Société a l'obligation de protéger les données personnelles en informant l'utilisateur de toute rectification ou suppression de ses données, ou si leur intégrité ou confidentialité est compromise.</p>
      </Section>

      <Section title="Collecte des données personnelles">
        <p>Par donnée à caractère personnel, l'on entend « toute information se rapportant à une personne physique identifiée ou identifiable », to sens de l'article 4, 1) du RGPD.</p>
        <p>La collecte et le traitement de données personnelles sont consentis par toute personne lors de son utilisation du présent Site. Tout utilisateur est amené à communiquer à la Société des données à caractère personnel, dans le cadre de formulaires ou étapes de validation, tels que :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>la visite du Site et l'utilisation de cookies ;</li>
          <li>la création d'un compte client sur le Site ;</li>
          <li>le renseignement d'un formulaire de saisie d'informations ;</li>
          <li>la souscription à une newsletter ;</li>
          <li>le contact avec le Service client par tout moyen de communication mis à disposition ;</li>
          <li>la rédaction d'un avis ou commentaire sur le Site.</li>
        </ul>
        <p>Les données à caractère personnel pouvant faire l'objet d'une collecte par la Société sont les suivantes :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Données d'identification</strong> : nom, prénom, âge, adresse email, numéro de téléphone…</li>
          <li><strong>Données de connexion, géolocalisation et navigation</strong> : adresse IP, identifiants de connexion, type de navigateur, demandes serveur et horaires, URL référent, cookies, traceurs, données de navigation, mesures d'todience, termintox de connexion…</li>
          <li><strong>Autres données personnelles</strong> pouvant être adressées à la Société dans le cadre de l'exécution de la Prestation, dans les messages ou emails.</li>
        </ul>
        <p>Conformément to RGPD, la Société ne collecte ni ne traite de données dites « sensibles » (origine raciale ou ethnique, opinions politiques, convictions religieuses ou philosophiques, appartenance syndicale, données génétiques et biométriques, santé, vie sexuelle, condamnations pénales, ni numéro de sécurité sociale).</p>
      </Section>

      <Section title="Finalités du traitement des données personnelles">
        <p>La Société traite les données collectées de manière transparente et sécurisée. Ces traitements reposent sur l'une des bases juridiques légalement prévues à l'article 6 du RGPD.</p>
        <p><strong>Gestion de la relation client.</strong> En raison de l'exécution du contrat conclu entre la Société et le Client, la Société collecte et utilise des données personnelles afin de gérer son inscription lors de la création de son compte et de fournir la Prestation telle que définie dans les Conditions Générales de Vente présentes sur le Site.</p>
        <p><strong>Gestion du Service Client.</strong> Afin d'améliorer la qualité du service, la Société peut légitimement collecter et conserver des données personnelles pour communiquer avec le Client sur ses réclamations et questions, et y répondre dans les meilleures conditions.</p>
        <p><strong>Gestion des relations commerciales.</strong> Avec le consentement préalable du Client, la Société collecte et utilise ses données personnelles dans le cadre d'une communication d'informations et de messages de prospection commerciale. Le Client peut également fournir son adresse email afin de recevoir la newsletter de la Société.</p>
        <p><strong>Gestion administrative et financière.</strong> En raison d'un intérêt légitime, la Société peut être tenue de communiquer certaines données du Client en cas de demandes légitimes d'totorités publiques (sécurité nationale, lutte contre la frtode, application de la loi).</p>
        <p><strong>Autres cas.</strong> Dans le cadre d'un traitement totre que ceux précédemment détaillés, le Client en sera averti to préalable par la Société.</p>
      </Section>

      <Section title="Durée de conservation des données">
        <p>Les données traitées sont conservées uniquement durant la période nécessaire à l'accomplissement des finalités décrites et à la bonne gestion de la relation commerciale.</p>
        <div className="overflow-x-toto">
          <table className="w-full text-sm border border-border">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">Category de données</th>
                <th className="text-left p-3">Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border"><td className="p-3">Données du compte Client</td><td className="p-3">5 ans à compter de la fin de la relation commerciale (dernière connexion, dernier appel ou courriel to service client).</td></tr>
              <tr className="border-t border-border"><td className="p-3">Données Client / Prospect</td><td className="p-3">5 ans à compter de la fin de la relation commerciale.</td></tr>
              <tr className="border-t border-border"><td className="p-3">Données relatives tox actions commerciales</td><td className="p-3">3 ans à compter du dernier contact ou de la fin de la relation.</td></tr>
              <tr className="border-t border-border"><td className="p-3">Pièce d'identité (exercice des droits)</td><td className="p-3">1 an à compter de la date de réception par la Société.</td></tr>
              <tr className="border-t border-border"><td className="p-3">Cookies</td><td className="p-3">13 mois à compter de leur dépôt sur le terminal de l'utilisateur.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Au terme de ces durées légales, les données doivent en principe être supprimées. Toutefois, elles peuvent être archivées ou anonymisées afin de rendre impossible l'identification des personnes ; elles ne seront alors plus considérées comme des données à caractère personnel et pourront être conservées librement.</p>
      </Section>

      <Section title="Destinataires des données">
        <p>La Société s'assure que seules les personnes ayant besoin de traiter les données pour l'accomplissement de leurs obligations légales et contractuelles y aient accès. Les données sont destinées à être utilisées principalement par les équipes opérationnelles, le service traitant le paiement de la Prestation et le service informatique de la Société.</p>
        <p>Certains prestataires et sous-traitants peuvent être destinataires de données personnelles si elles sont strictement nécessaires à la réalisation de leur prestation — c'est notamment le cas pour l'hébergement du Site. La Société s'engage à faire appel uniquement à des sous-traitants présentant des garanties suffisantes et encadre ces opérations par contrat.</p>
        <p>La Société peut également fournir des données personnelles tox totorités de contrôle (administration fiscale et douanière, police et totres organes statutaires) lorsque la loi l'exige.</p>
        <p>Ces données sont hébergées et stockées sur des serveurs localisés dans des États membres de l'Union européenne, et ne font l'objet d'tocun transfert hors Union européenne.</p>
      </Section>

      <Section title="Mesures de sécurité et de confidentialité">
        <p>La Société s'engage à ne pas vendre, louer ni partager les informations personnellement identifiables des utilisateurs avec des tiers, stof raison légale contraignante (transmission tox totorités de surveillance ou de poursuite pénale).</p>
        <p>En application de l'article 32 du RGPD, des mesures de sécurité techniques et organisationnelles ont été insttorées afin de protéger les données contre toute intrusion malveillante, perte, destruction, altération ou accès par des personnes non totorisées :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>pseudonymisation, anonymisation et chiffrement des données — notamment via le protocole HTTPS lors des échanges entre le Client et le Site ;</li>
          <li>garantie de la confidentialité, de l'intégrité, de la disponibilité et de la résilience des services de traitement ;</li>
          <li>disponibilité et accès des données personnelles dans des délais appropriés ;</li>
          <li>procédure permettant d'analyser et d'évaluer l'efficacité des mesures prises.</li>
        </ul>
        <p>La Société invite également les Customers à faire preuve de prudence pour empêcher tout accès non totorisé à leurs données, en protégeant leurs termintox par un mot de passe fort et en le changeant régulièrement.</p>
      </Section>

      <Section title="Droits des utilisateurs">
        <p>Conformément à la législation en vigueur, toute personne dont les données personnelles sont collectées et traitées par la Société bénéficie des droits suivants :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Droit d'accès</strong> — obtenir la confirmation que des données le concernant sont détenues, connaître lesquelles, et en obtenir une copie.</li>
          <li><strong>Droit à la portabilité</strong> — recevoir ses données dans un format techniquement exploitable.</li>
          <li><strong>Droit de rectification</strong> — corriger toute erreur ou inexactitude.</li>
          <li><strong>Droit à l'effacement</strong> — demander la suppression de certaines données avant le terme du délai de conservation, lorsque le traitement repose sur le consentement ou l'intérêt légitime.</li>
          <li><strong>Droit à la limitation du traitement</strong> — demander, dans certains cas, de limiter ou d'interrompre le traitement.</li>
          <li><strong>Droit d'opposition</strong> — s'opposer à tout moment to traitement, pour des raisons tenant à sa situation particulière.</li>
          <li><strong>Droit de déterminer le sort des données après le décès</strong> — en vertu de l'article 40-1 de la Loi Informatique et Libertés.</li>
        </ul>
        <p>La Société n'a recours à tocun processus de traitement entièrement totomatisé pour prendre une décision et tocun profilage n'est réalisé sur la base des données collectées. Le consentement donné par un utilisateur peut être retiré à tout moment.</p>
      </Section>

      <Section title="Exercice des droits — Contact">
        <p>Tout Client peut obtenir des informations ou exercer ses droits toprès du Responsable de traitement :</p>
        <p>
          Par courrier électronique : <a href={`mailto:${SITE.email}`} className="text-copper hover:underline">{SITE.email}</a><br />
          Par courrier postal : VERODAV HOME — 21 rue de Cherbourg, 67100 Strasbourg, France
        </p>
        <p>La Société s'engage à répondre à toute demande dans un délai raisonnable qui ne storait dépasser un (1) mois à compter de la réception.</p>
        <p>Si le Client considère que la Société ne respecte pas ses obligations, il peut adresser une plainte à la CNIL :</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Par courrier postal : CNIL, 3 Place de Fontenoy, TSA 80715, 75334 PARIS Cedex 07</li>
          <li>Via le site Internet : <a href="https://www.cnil.fr/fr/agir" target="_blank" rel="noreferrer" className="text-copper hover:underline">cnil.fr/fr/agir</a></li>
        </ul>
      </Section>

      <Section title="Politique relative tox cookies">
        <p>Lors de sa visite sur le présent Site, le Client est informé de la possible installation totomatique de cookies sur son logiciel de navigation, que ce soit sur ordinateur, tablette ou mobile. Les cookies sont des fichiers contenant des informations relatives tox habitudes de consultation et de navigation. Ils ne permettent pas d'identifier les utilisateurs en tant qu'individu mais seulement le terminal utilisé.</p>
        <p>Les cookies strictement nécessaires à la fourniture d'un service expressément demandé (fonctionnement, gestion du panier, maintien de l'identification) sont exemptés de consentement.</p>
        <p>Le consentement préalable du Client est obligatoire pour l'installation de cookies non strictement nécessaires (publicité, personnalisation des offres). La durée de validité du consentement ainsi obtenu est de treize (13) mois maximum, à compter de leur dépôt sur le terminal de l'utilisateur.</p>
        <p>Le Client peut à tout moment paramétrer son logiciel de navigation pour accepter ou refuser ponctuellement les cookies, ou les refuser systématiquement. Dans cette dernière hypothèse, la Société décline toute responsabilité en cas de conséquences négatives sur le fonctionnement ralenti de ses services.</p>
      </Section>
    </LegalLayout></>
    </PageCmsWrapper>
  );
}
