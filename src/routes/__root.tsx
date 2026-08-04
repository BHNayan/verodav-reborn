File: src/routes/__root.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { I18nProvider } from "@/lib/i18n";
import { GoogleTranslate } from "@/components/GoogleTranslate";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <p className="mt-4 text-muted-foreground">Cette page n'existe pas.</p>
        <Link to="/" className="mt-6 inline-block bg-primary px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground hover:bg-copper transition">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Quelque chose s'est mal passé</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-block bg-primary px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground hover:bg-copper transition">
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { name: "description", content: "Verodav Home — une sélection organisée d'ustensiles de cuisine professionnels à Strasbourg. Ustensiles de cuisine, outils à pâtes, ventilateurs, accessoires et pièces détachées." },
      { property: "og:title", content: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { property: "og:description", content: "Verodav Home — une sélection organisée d'ustensiles de cuisine professionnels à Strasbourg. Ustensiles de cuisine, outils à pâtes, ventilateurs, accessoires et pièces détachées." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { name: "twitter:description", content: "Verodav Home — une sélection organisée d'ustensiles de cuisine professionnels à Strasbourg. Ustensiles de cuisine, outils à pâtes, ventilateurs, accessoires et pièces détachées." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d8ef9e7-2ec5-4f55-a618-8125d5f4e639/id-preview-5a69c9c5--483ff4e8-1c5a-48cb-9073-dbfce74d8d43.lovable.app-1778968249178.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d8ef9e7-2ec5-4f55-a618-8125d5f4e639/id-preview-5a69c9c5--483ff4e8-1c5a-48cb-9073-dbfce74d8d43.lovable.app-1778968249178.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:site_name", content: "Verodav Home" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://verodav-reborn.lovable.app/#organization",
              name: "Verodav Home",
              url: "https://verodav-reborn.lovable.app",
              logo: "https://verodav-reborn.lovable.app/favicon.ico",
              email: "info@verodav-home.com",
              telephone: "+33758347662",
              address: {
                "@type": "PostalAddress",
                streetAddress: "21 rue de Cherbourg",
                postalCode: "67100",
                addressLocality: "Strasbourg",
                addressCountry: "FR",
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://verodav-reborn.lovable.app/#website",
              url: "https://verodav-reborn.lovable.app",
              name: "Verodav Home",
              publisher: { "@id": "https://verodav-reborn.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const BOOT_LANG_SCRIPT = `(function(){try{
  var SRC='en';
  var saved=null;try{saved=localStorage.getItem('lang');}catch(e){}
  var lang=(saved==='en'||saved==='fr'||saved==='de')?saved:'en';
  if(!saved){try{localStorage.setItem('lang',lang);}catch(e){}}
  var val='/'+SRC+'/'+lang;
  var host=location.hostname;
  var parts=host.split('.');
  var domains=[null,host,'.'+host];
  if(parts.length>2)domains.push('.'+parts.slice(-2).join('.'));
  for(var i=0;i<domains.length;i++){
    document.cookie='googtrans='+val+';path=/'+(domains[i]?';domain='+domains[i]:'');
  }
  // Keep <html lang> matching the SOURCE (en) so Google Translate
  // treats the page body as English and translates into the target.
  document.documentElement.lang=SRC;
}catch(e){}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: BOOT_LANG_SCRIPT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdminArea = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {/* Scroll restoration handled by router config */}
        <GoogleTranslate />
        {!isAdminArea && <SiteHeader />}
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
        {!isAdminArea && <SiteFooter />}
      </I18nProvider>
    </QueryClientProvider>
  );
}
