import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/commandes")({
  head: () => ({ meta: [{ title: "Mes commandes — Verodav Home" }] }),
  component: CommandesPage,
});

function CommandesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/commandes", mode: "signin" } });
  }, [user, loading, navigate]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">Mes commandes</h1>
      <p className="mt-3 text-muted-foreground">Vous n'avez pas encore passé de commande.</p>
      <div className="mt-10 border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        L'historique de vos commandes apparaîtra ici.
      </div>
    </div>
  );
}
