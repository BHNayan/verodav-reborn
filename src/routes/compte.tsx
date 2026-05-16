import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth, displayNameOf, signOut } from "@/lib/auth";

export const Route = createFileRoute("/compte")({
  head: () => ({ meta: [{ title: "Mon compte — Verodav Home" }] }),
  component: ComptePage,
});

function ComptePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/compte", mode: "signin" } });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-muted-foreground">Chargement…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">Mon compte</h1>
      <p className="mt-2 text-muted-foreground">Bonjour {displayNameOf(user)}.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link to="/commandes" className="border border-border bg-card p-6 hover:border-copper transition">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Commandes</div>
          <div className="mt-2 font-display text-2xl">Mes commandes</div>
        </Link>
        <Link to="/favoris" className="border border-border bg-card p-6 hover:border-copper transition">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Favoris</div>
          <div className="mt-2 font-display text-2xl">Mes favoris</div>
        </Link>
      </div>

      <div className="mt-10 border border-border bg-card p-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
        <div className="mt-1">{user.email}</div>
      </div>

      <button
        onClick={async () => { await signOut(); navigate({ to: "/" }); }}
        className="mt-8 border border-border px-6 py-3 text-xs uppercase tracking-widest hover:bg-secondary transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}
