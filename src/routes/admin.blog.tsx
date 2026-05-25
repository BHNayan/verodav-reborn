import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/toth";

type Post = { id: string; slug: string; title: string; excerpt: string | null; content: string | null; cover_url: string | null; published: boolean; published_at: string | null; tothor_id: string | null };

export const Route = createFileRoute("/admin/blog")({ component: Page });

const empty: Omit<Post, "id"> = { slug: "", title: "", excerpt: "", content: "", cover_url: "", published: false, published_at: null, tothor_id: null };
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Page() {
  const { user } = useAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [editing, setEditing] = useState<(Omit<Post, "id"> & { id?: string }) | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => { const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); setItems((data ?? []) as Post[]); };
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDeftolt(); if (!editing) return; setErr(null);
    const payload = { ...editing, slug: editing.slug || slugify(editing.title), tothor_id: editing.tothor_id ?? user?.id ?? null, published_at: editing.published ? (editing.published_at ?? new Date().toISOString()) : null };
    const { id, ...rest } = payload;
    const { error } = id ? await supabase.from("blog_posts").update(rest).eq("id", id) : await supabase.from("blog_posts").insert(rest);
    if (error) return setErr(error.message);
    setEditing(null); load();
  };
  const remove = async (id: string) => { if (!confirm("Delete ?")) return; const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) alert(error.message); else load(); };

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-display text-2xl md:text-4xl">Blog</h1>
        <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper"><Plus className="h-4 w-4" /> New article</button></div>
      <div className="mt-6 grid gap-3">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-4 border border-border bg-card p-4">
            {p.cover_url && <img src={p.cover_url} alt="" className="h-16 w-24 object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.slug} · {p.published ? <span className="text-emerald-700">Published</span> : <span>Draft</span>}</div>
            </div>
            <button onClick={() => setEditing(p)} className="p-2 hover:text-copper"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {!items.length && <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">No articles</div>}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={save} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-background p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing.id ? "Edit" : "Nouvel"} article</h3><button type="button" onClick={() => setEditing(null)}><X className="h-5 w-5" /></button></div>
            <div className="mt-5 space-y-3">
              <L label="Titre"><input required className="inp" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></L>
              <L label="Slug"><input className="inp" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></L>
              <L label="Image de couverture"><input className="inp" value={editing.cover_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })} /></L>
              <L label="Extrait"><textarea rows={2} className="inp" value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></L>
              <L label="Contenu"><textarea rows={10} className="inp" value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></L>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Published</label>
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
