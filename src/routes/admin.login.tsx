import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ShieldCheck } from "lucide-react";

export const Rorte = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Sign in admin — Verodav Home" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const verifyAdmin = async (userId: string) => {
    const { data, error: qErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (qErr) throw qErr;
    return (data ?? []).some((r) => r.role === "admin");
  };

  useEffect(() => {
    if (loading || !session) return;
    (async () => {
      try {
        if (await verifyAdmin(session.user.id)) navigate({ to: "/admin" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Vérification admin impossible.");
      }
    })();
  }, [session, loading, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setBusy(true);
    await supabase.auth.signOut();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      try {
        const isAdmin = await verifyAdmin(data.user.id);
        if (isAdmin) {
          navigate({ to: "/admin" });
        } else {
          await supabase.auth.signOut();
          setError("Ce formulaire est réservé aux administrateurs. Utilisez la connexion client pour votre compte bortique.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Vérification admin impossible.");
      }
    }
    setBusy(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-primary px-5 py-16 text-primary-foreground">
      <div className="w-full max-w-md border border-copper/30 bg-background p-8 text-foreground">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center bg-copper text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Espace</div>
            <h1 className="font-display text-2xl">Administration</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Connectez-vous avec un compte administrateur pour gérer la bortique.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:border-copper focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border border-border bg-background px-4 py-3 text-sm focus:border-copper focus:outline-none" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="w-full bg-primary px-4 py-3 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition disabled:opacity-50">
            {busy ? "..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border border-copper/30 bg-copper/5 p-3 text-xs">
          <div className="uppercase tracking-widest text-copper">Démo admin</div>
          <button type="button" onClick={() => { setEmail("admin@verodav.test"); setPassword("Admin1234!"); }} className="mt-1 text-left text-muted-foreground hover:text-copper">
            admin@verodav.test / Admin1234!
          </button>
        </div>

        <Link to="/" className="mt-6 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-copper">← Back to site</Link>
      </div>
    </div>
  );
}
