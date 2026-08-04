import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/",
    mode: s.mode === "signup" ? "signup" : "signin",
  }),
  head: () => ({
    meta: [
      { title: "Connexion — Verodav Home" },
      { name: "description", content: "Connectez-vous à votre compte Verodav Home." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect, mode: initialMode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode as "signin" | "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !session) return;
    const target = redirect && redirect !== "/" ? redirect : "/compte";
    navigate({ to: target });
  }, [session, loading, redirect, navigate]);

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setInfo("Vérifiez votre boîte de réception pour confirmer votre compte.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError(result.error.message ?? "La connexion avec Google a échoué.");
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email) return setError("Entrez votre adresse e-mail pour réinitialiser votre mot de passe.");
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setInfo("E-mail de réinitialisation envoyé.");
  };

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-5 py-16">
      <div className="w-full">
        <h1 className="font-display text-4xl">{mode === "signup" ? "Créer un compte" : "Se connecter"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "Rejoignez Verodav Home." : "Accédez à votre compte Verodav Home."}
        </p>

        {mode === "signin" && (
          <div className="mt-6 border border-copper/40 bg-copper/5 p-4">
            <div className="text-xs uppercase tracking-widest text-copper">Compte client démo</div>
            <div className="mt-3 flex items-center justify-between gap-2 border border-border bg-background px-3 py-2 text-xs">
              <div className="min-w-0">
                <div className="font-medium">Client</div>
                <div className="truncate text-muted-foreground">customer@verodav.test / Customer1234!</div>
              </div>
              <button type="button" onClick={() => { setEmail("customer@verodav.test"); setPassword("Customer1234!"); }} className="shrink-0 bg-primary px-3 py-1.5 text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-copper">Remplir</button>
            </div>
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-3 border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-secondary transition disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.4-1.66 4.12-5.46 4.12-3.28 0-5.96-2.72-5.96-6.08S8.72 6.08 12 6.08c1.86 0 3.12.78 3.84 1.46l2.62-2.52C16.86 3.5 14.66 2.5 12 2.5 6.78 2.5 2.5 6.78 2.5 12s4.28 9.5 9.5 9.5c5.48 0 9.12-3.84 9.12-9.26 0-.62-.06-1.1-.16-1.58H12z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:border-copper focus:outline-none"
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:border-copper focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:border-copper focus:outline-none"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-emerald-600">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary px-4 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition disabled:opacity-50"
          >
            {busy ? "..." : mode === "signup" ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs">
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-muted-foreground hover:text-copper">
            {mode === "signin" ? "Pas de compte ? Créer un compte" : "Déjà inscrit ? Se connecter"}
          </button>
          {mode === "signin" && (
            <button onClick={handleReset} className="text-muted-foreground hover:text-copper">
              Mot de passe oublié ?
            </button>
          )}
        </div>

        <Link to="/" className="mt-10 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-copper">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
