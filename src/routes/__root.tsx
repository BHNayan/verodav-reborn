import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ScrollRestoration,
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
        <h1 className="font-display text-3xl">Une erreur s'est produite</h1>
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
      { name: "description", content: "Verodav Home — sélection d'ustensiles de cuisine professionnels à Strasbourg. Cuisson, pâtes, ventilateurs, accessoires et pièces de rechange." },
      { property: "og:title", content: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { property: "og:description", content: "Verodav Home — sélection d'ustensiles de cuisine professionnels à Strasbourg. Cuisson, pâtes, ventilateurs, accessoires et pièces de rechange." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Verodav Home — Cuisine moderne, ustensiles innovants" },
      { name: "twitter:description", content: "Verodav Home — sélection d'ustensiles de cuisine professionnels à Strasbourg. Cuisson, pâtes, ventilateurs, accessoires et pièces de rechange." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d8ef9e7-2ec5-4f55-a618-8125d5f4e639/id-preview-5a69c9c5--483ff4e8-1c5a-48cb-9073-dbfce74d8d43.lovable.app-1778968249178.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0d8ef9e7-2ec5-4f55-a618-8125d5f4e639/id-preview-5a69c9c5--483ff4e8-1c5a-48cb-9073-dbfce74d8d43.lovable.app-1778968249178.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
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
        <ScrollRestoration />
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
