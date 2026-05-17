import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
};
type Cat = { id: string; name: string };

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const empty: Omit<Product, "id"> = {
  slug: "", name: "", price: 0, stock: 0, category_id: null, image_url: "", description: "", is_active: true, is_featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<(Omit<Product, "id"> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Product[]);
  };
  useEffect(() => { load(); supabase.from("categories").select("id,name").order("name").then(({ data }) => setCats((data ?? []) as Cat[])); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setErr(null); setBusy(true);
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), price: Number(editing.price), stock: Number(editing.stock) };
    const { id, ...rest } = payload;
    const { error } = id
      ? await supabase.from("products").update(rest).eq("id", id)
      : await supabase.from("products").insert(rest);
    setBusy(false);
    if (error) return setErr(error.message);
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message); else load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl md:text-4xl">Produits</h1>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper">
          <Plus className="h-4 w-4" /> Nouveau
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest">
            <tr><th className="px-4 py-3">Produit</th><th className="px-4 py-3">Prix</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url && <img src={p.image_url} alt="" className="h-10 w-10 object-cover" />}
                    <div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.slug}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3">{Number(p.price).toFixed(2)} €</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs ${p.is_active ? "bg-emerald-100 text-emerald-800" : "bg-muted"}`}>{p.is_active ? "Actif" : "Inactif"}</span>
                  {p.is_featured && <span className="ml-1 inline-block bg-copper/20 px-2 py-0.5 text-xs text-copper">Vedette</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="p-2 hover:text-copper"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>Aucun produit</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={save} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-background p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing.id ? "Modifier" : "Nouveau"} produit</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Nom"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="inp" /></Field>
              <Field label="Slug (auto si vide)"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="inp" /></Field>
              <Field label="Prix (€)"><input required type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="inp" /></Field>
              <Field label="Stock"><input required type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="inp" /></Field>
              <Field label="Catégorie">
                <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="inp">
                  <option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Image URL"><input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="inp" /></Field>
              <div className="sm:col-span-2"><Field label="Description"><textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="inp" /></Field></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Actif</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> Vedette</label>
            </div>
            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary">Annuler</button>
              <button disabled={busy} className="bg-primary px-5 py-2 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper disabled:opacity-50">{busy ? "..." : "Enregistrer"}</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.inp{display:block;width:100%;border:1px solid hsl(var(--border));background:transparent;padding:.55rem .75rem;font-size:.875rem}.inp:focus{outline:none;border-color:hsl(var(--ring))}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</span><span className="mt-1 block">{children}</span></label>;
}
