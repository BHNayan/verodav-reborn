import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/favoris")({
  head: () => ({ meta: [{ title: "Mes favoris — Verodav Home" }] }),
  component: FavorisPage,
});

function FavorisPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/favoris", mode: "signin" } });
  }, [user, loading, navigate]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">Mes favoris</h1>
      <p className="mt-3 text-muted-foreground">Aucun favori pour le moment.</p>
      <div className="mt-10 border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        Ajoutez des produits à vos favoris depuis la boutique.
      </div>
    </div>
  );
}
