import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
      { property: "og:title", content: "Verodav Home" },
      { property: "og:description", content: "Cuisine moderne. Ustensiles innovants." },
      { property: "og:type", content: "website" },
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
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollRestoration />
      <SiteHeader />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
