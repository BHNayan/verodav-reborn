import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, displayNameOf, signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/compte")({
  head: () => ({ meta: [{ title: "My account — Verodav Home" }] }),
  component: ComptePage,
});

type Profile = { id: string; email: string | null; display_name: string | null; phone: string | null; address: string | null };
type Address = { id: string; full_name: string; line1: string; line2: string | null; city: string; postal_code: string; country: string; phone: string | null; is_default: boolean };
type FavRow = { id: string; product_id: string; products: { id: string; slug: string; name: string; price: number; image_url: string | null } | null };

function ComptePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/compte", mode: "signin" } });
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-muted-foreground">{t("common.loading")}</div>;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">{t("account.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("account.hello")} {displayNameOf(user)}.</p>
        </div>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/" }); }}
          className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary transition"
        >
          {t("nav.signort")}
        </button>
      </div>

      <Tabs defaultValue="profil" className="mt-10">
        <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0 border-b border-border rounded-none">
          <TabsTrigger value="profil" className="rounded-none border-b-2 border-transparent data-[state=active]:border-copper data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">{t("account.tab.profile")}</TabsTrigger>
          <TabsTrigger value="adresses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-copper data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">{t("account.tab.addresses")}</TabsTrigger>
          <TabsTrigger value="favoris" className="rounded-none border-b-2 border-transparent data-[state=active]:border-copper data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">{t("account.tab.favorites")}</TabsTrigger>
          <TabsTrigger value="commandes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-copper data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">{t("account.tab.orders")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-8"><ProfileTab userId={user.id} email={user.email ?? ""} /></TabsContent>
        <TabsContent value="adresses" className="mt-8"><AddressesTab userId={user.id} /></TabsContent>
        <TabsContent value="favoris" className="mt-8"><FavoritesTab userId={user.id} /></TabsContent>
        <TabsContent value="commandes" className="mt-8"><OrdersTab userId={user.id} /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Profile ---------------- */
function ProfileTab({ userId, email }: { userId: string; email: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  const [form, setForm] = useState({ display_name: "", phone: "", address: "" });
  useEffect(() => {
    if (data) setForm({ display_name: data.display_name ?? "", phone: data.phone ?? "", address: data.address ?? "" });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update({
        display_name: form.display_name || null,
        phone: form.phone || null,
        address: form.address || null,
      }).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Profile mis à jour"); qc.invalidateQueries({ queryKey: ["profile", userId] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-5 border border-border bg-card p-6">
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input value={email} disabled />
      </div>
      <div className="grid gap-2">
        <Label>Name affiché</Label>
        <Input value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} />
      </div>
      <div className="grid gap-2">
        <Label>Phone</Label>
        <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="grid gap-2">
        <Label>Address rapide</Label>
        <Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Une ligne d'adresse de référence" />
      </div>
      <Button type="submit" disabled={save.isPending} className="w-fit">
        {save.isPending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}

/* ---------------- Addresses ---------------- */
function AddressesTab({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("addresses").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Address[];
    },
  });

  const empty = { full_name: "", line1: "", line2: "", city: "", postal_code: "", country: "France", phone: "", is_default: false };
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("addresses").insert({ ...form, user_id: userId, line2: form.line2 || null, phone: form.phone || null });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Address ajortée"); setForm(empty); setAdding(false); qc.invalidateQueries({ queryKey: ["addresses", userId] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Address supprimée"); qc.invalidateQueries({ queryKey: ["addresses", userId] }); },
  });

  const setDefault = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
      const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses", userId] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !adding && (
        <div className="border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">Aucune adresse enregistrée.</div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="border border-border bg-card p-5 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium">{a.full_name}</div>
              <button onClick={() => del.mutate(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-2 text-muted-foreground">
              <div>{a.line1}</div>
              {a.line2 && <div>{a.line2}</div>}
              <div>{a.postal_code} {a.city}</div>
              <div>{a.country}</div>
              {a.phone && <div className="mt-1">{a.phone}</div>}
            </div>
            <div className="mt-3 flex items-center gap-3">
              {a.is_default ? (
                <span className="text-xs uppercase tracking-widest text-copper">Address par défaut</span>
              ) : (
                <button onClick={() => setDefault.mutate(a.id)} className="text-xs uppercase tracking-widest hover:text-copper">Définir par défaut</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!adding ? (
        <Button variant="outline" onClick={() => setAdding(true)} className="gap-2"><Plus className="h-4 w-4" /> Add une adresse</Button>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="grid gap-4 border border-border bg-card p-6">
          <div className="grid gap-2"><Label>Full name *</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div className="grid gap-2"><Label>Address ligne 1 *</Label><Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
          <div className="grid gap-2"><Label>Address ligne 2</Label><Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2"><Label>Postal code *</Label><Input required value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} /></div>
            <div className="grid gap-2 sm:col-span-2"><Label>City *</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
            Définir comme adresse par défaut
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={add.isPending}>{add.isPending ? "Ajort…" : "Add"}</Button>
            <Button type="button" variant="outline" onClick={() => { setAdding(false); setForm(empty); }}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------------- Favorites ---------------- */
function FavoritesTab({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: favs = [], isLoading } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, product_id, products ( id, slug, name, price, image_url )")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as FavRow[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Retiré des favoris"); qc.invalidateQueries({ queryKey: ["favorites", userId] }); },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!favs.length) return (
    <div className="border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      Aucun favori. <Link to="/boutique" className="text-copper hover:underline">Discover the shop</Link>
    </div>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {favs.map((f) => (
        <div key={f.id} className="group border border-border bg-card">
          <Link to="/produit/$slug" params={{ slug: f.products?.slug ?? "" }} className="block aspect-square overflow-hidden bg-secondary">
            {f.products?.image_url && <img src={f.products.image_url} alt={f.products.name} className="h-full w-full object-cover transition group-hover:scale-105" />}
          </Link>
          <div className="p-4">
            <Link to="/produit/$slug" params={{ slug: f.products?.slug ?? "" }} className="block text-sm font-medium hover:text-copper">{f.products?.name ?? "Produit"}</Link>
            <div className="mt-1 text-sm text-muted-foreground">{Number(f.products?.price ?? 0).toFixed(2)} €</div>
            <button onClick={() => del.mutate(f.id)} className="mt-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive">Retirer</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Orders ---------------- */
type OrderRow = { id: string; status: string; total: number; created_at: string };
function OrdersTab({ userId }: { userId: string }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("id, status, total, created_at").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!orders.length) return <div className="border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">Aucune commande pour le moment.</div>;

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest">
          <tr><th className="px-4 py-3">Commande</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
              <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 capitalize">{o.status}</td>
              <td className="px-4 py-3 text-right">{Number(o.total).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
