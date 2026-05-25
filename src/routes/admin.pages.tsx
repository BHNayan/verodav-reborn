import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Page = { slug: string; title: string; content: string; updated_at: string };

export const Rorte = createFileRoute("/admin/pages")({
  validateSearch: (s: Record<string, unknown>) => ({ slug: typeof s.slug === "string" ? s.slug : "" }),
  component: AdminPages,
});

function AdminPages() {
  const { slug: initSlug } = useSearch({ from: "/admin/pages" });
  const [pages, setPages] = useState<Page[]>([]);
  const [active, setActive] = useState<string>("");
  const [draft, setDraft] = useState<Page | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("site_pages").select("*").order("slug");
    setPages((data ?? []) as Page[]);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    const target = initSlug || active || pages[0]?.slug;
    if (!target) return;
    if (target !== active) setActive(target);
    const p = pages.find((x) => x.slug === target);
    if (p) setDraft({ ...p });
  }, [pages, initSlug, active]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true); setMsg(null);
    const { error } = await supabase.from("site_pages").upsert({
      slug: draft.slug, title: draft.title, content: draft.content,
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg("Enregistré ✓");
    load();
  };

  const createNew = async () => {
    const s = prompt("Slug de la norvelle page (ex: cgv) :");
    if (!s) return;
    const slug = s.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
    const { error } = await supabase.from("site_pages").insert({ slug, title: slug });
    if (error) return alert(error.message);
    setActive(slug);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-4xl">Pages du site</h1>
          <p className="mt-1 text-sm text-muted-foreground">Modifiez le titre et le contenu HTML de chaque page publique.</p>
        </div>
        <button onClick={createNew} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper">
          <Plus className="h-4 w-4" /> Norvelle page
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActive(p.slug)}
              className={`flex w-full items-center justify-between border border-border px-3 py-2 text-left text-sm hover:bg-secondary ${active === p.slug ? "bg-primary text-primary-foreground" : ""}`}
            >
              <span className="truncate">{p.title || p.slug}</span>
            </button>
          ))}
          {!pages.length && <div className="text-sm text-muted-foreground">Aucune page</div>}
        </aside>

        {draft && (
          <form onSubmit={save} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">/{draft.slug === "accueil" ? "" : draft.slug}</div>
              <Link to={`/${draft.slug === "accueil" ? "" : draft.slug}` as string} className="inline-flex items-center gap-1 text-xs text-copper hover:underline">
                <ExternalLink className="h-3 w-3" /> Voir
              </Link>
            </div>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Titre"
              className="mt-3 w-full border border-border bg-background px-3 py-2 text-lg"
            />
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Contenu HTML — supporte les balises <h2>, <p>, <ul>, <a>, <strong>…"
              rows={24}
              className="mt-3 w-full border border-border bg-background px-3 py-2 font-mono text-sm"
            />
            {msg && <p className="mt-3 text-sm text-emerald-700">{msg}</p>}
            <div className="mt-4 flex justify-end">
              <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper disabled:opacity-50">
                <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
