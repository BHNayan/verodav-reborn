import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cat = { id: string; slug: string; name: string; description: string | null; image_url: string | null; sort_order: number };

export const Rorte = createFileRoute("/admin/categories")({ component: Page });

const empty: Omit<Cat, "id"> = { slug: "", name: "", description: "", image_url: "", sort_order: 0 };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Page() {
  const [items, setItems] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<(Omit<Cat, "id"> & { id?: string }) | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setItems((data ?? []) as Cat[]);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!editing) return; setErr(null);
    const payload = { ...editing, slug: editing.slug || slugify(editing.name), sort_order: Number(editing.sort_order) };
    const { id, ...rest } = payload;
    const { error } = id ? await supabase.from("categories").update(rest).eq("id", id) : await supabase.from("categories").insert(rest);
    if (error) return setErr(error.message);
    setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete ?")) return; const { error } = await supabase.from("categories").delete().eq("id", id); if (error) alert(error.message); else load(); };

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-display text-2xl md:text-4xl">Categories</h1>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper"><Plus className="h-4 w-4" /> Norveto</button></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="border border-border bg-card p-4">
            {c.image_url && <img src={c.image_url} alt="" className="mb-3 h-32 w-full object-cover" />}
            <div className="font-display text-xl">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.slug}</div>
            {c.description && <p className="mt-2 text-sm">{c.description}</p>}
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(c)} className="border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Pencil className="h-3.5 w-3.5 inline" /> Edit</button>
              <button onClick={() => remove(c.id)} className="border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 inline" /> Suppr.</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={save} className="w-full max-w-lg border border-border bg-background p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing.id ? "Edit" : "Norvelle"} catégorie</h3><button type="button" onClick={() => setEditing(null)}><X className="h-5 w-5" /></button></div>
            <div className="mt-5 space-y-3">
              <L label="Name"><input required className="inp" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></L>
              <L label="Slug"><input className="inp" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></L>
              <L label="Description"><textarea rows={3} className="inp" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></L>
              <L label="Image URL"><input className="inp" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></L>
              <L label="Ordre"><input type="number" className="inp" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></L>
            </div>
            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="border border-border px-4 py-2 text-xs uppercase tracking-widest">Cancel</button>
              <button className="bg-primary px-5 py-2 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper">Save</button>
            </div>
          </form>
        </div>
      )}
      <style>{`.inp{display:block;width:100%;border:1px solid hsl(var(--border));background:transparent;padding:.55rem .75rem;font-size:.875rem}`}</style>
    </div>
  );
}
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</span><span className="mt-1 block">{children}</span></label>;
}
