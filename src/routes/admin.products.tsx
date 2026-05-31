import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExportImportBar } from "@/components/admin/ExportImportBar";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { syncWooCommerce } from "@/lib/woo-sync.functions";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  images: string[];
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
};
type Cat = { id: string; name: string };

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const empty: Omit<Product, "id"> = {
  slug: "", name: "", price: 0, stock: 0, category_id: null, image_url: "", images: [], description: "", is_active: true, is_featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string" && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p.filter((x): x is string => typeof x === "string");
    } catch {
      return raw.split(/[,;|\n]/).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<(Omit<Product, "id"> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const runWooSync = useServerFn(syncWooCommerce);

  const handleWooSync = async () => {
    if (!confirm("Sync all products from your WordPress/WooCommerce store? Existing products with the same slug will be updated.")) return;
    setSyncing(true);
    try {
      const r = await runWooSync({ data: {} as never });
      alert(
        `WordPress sync complete.\nCreated: ${r.created}\nUpdated: ${r.updated}\nFailed: ${r.failed}` +
        (r.errors.length ? `\n\nErrors:\n${r.errors.join("\n")}` : "")
      );
      load();
    } catch (e) {
      alert("WordPress sync failed: " + (e as Error).message);
    } finally {
      setSyncing(false);
    }
  };




  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems(((data ?? []) as any[]).map((p) => ({ ...p, images: normalizeImages(p.images) })) as Product[]);
  };
  useEffect(() => { load(); supabase.from("categories").select("id,name").order("name").then(({ data }) => setCats((data ?? []) as Cat[])); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setErr(null); setBusy(true);
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      price: Number(editing.price),
      stock: Number(editing.stock),
      images: editing.images ?? [],
    };
    const { id, ...rest } = payload;
    const { error } = id
      ? await supabase.from("products").update(rest).eq("id", id)
      : await supabase.from("products").insert(rest);
    setBusy(false);
    if (error) return setErr(error.message);
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert(error.message); else load();
  };

  const exportRows = () => {
    const catName = new Map(cats.map((c) => [c.id, c.name]));
    return items.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category_id ? catName.get(p.category_id) ?? "" : "",
      image_url: p.image_url ?? "",
      images: (p.images ?? []).join("|"),
      description: p.description ?? "",
      is_active: p.is_active,
      is_featured: p.is_featured,
    }));
  };

  const importRows = async (rows: Record<string, unknown>[]) => {
    if (!rows.length) return alert("Fichier vide");

    // Build a case-insensitive lookup for each row (handles WooCommerce headers like "Regular price")
    const pick = (r: Record<string, unknown>, ...keys: string[]) => {
      const map = new Map(Object.keys(r).map((k) => [k.toLowerCase().trim(), k]));
      for (const k of keys) {
        const hit = map.get(k.toLowerCase());
        if (hit !== undefined && r[hit] !== undefined && r[hit] !== null && r[hit] !== "") return r[hit];
      }
      return undefined;
    };
    const truthy = (v: unknown, def = true) => {
      if (v === undefined || v === null || v === "") return def;
      const s = String(v).toLowerCase().trim();
      return ["1", "true", "yes", "y", "ori", "publish", "published", "instock", "in stock", "visible"].includes(s);
    };

    // Auto-create missing categories so WooCommerce imports work ort of the box.
    let catByName = new Map(cats.map((c) => [c.name.toLowerCase(), c.id]));
    const wantedCats = new Set<string>();
    for (const r of rows) {
      const raw = pick(r, "category", "category_name", "categories", "Categories");
      if (!raw) continue;
      // WooCommerce: "Kitchen > Robots, Bricolage" → take the leaf of the first path
      const first = String(raw).split(/[,|]/)[0]?.trim();
      if (!first) continue;
      const leaf = first.split(">").pop()?.trim();
      if (leaf && !catByName.has(leaf.toLowerCase())) wantedCats.add(leaf);
    }
    if (wantedCats.size) {
      const toInsert = Array.from(wantedCats).map((name) => ({ name, slug: slugify(name) }));
      const { data: created } = await supabase.from("categories").insert(toInsert).select("id,name");
      for (const c of (created ?? []) as Cat[]) catByName.set(c.name.toLowerCase(), c.id);
    }

    let ok = 0, fail = 0, updated = 0;
    const errors: string[] = [];

    for (const r of rows) {
      const name = String(pick(r, "name", "Name", "title") ?? "").trim();
      if (!name) { fail++; continue; }

      // WooCommerce: SKU is the most stable identifier. Fall back to slug, then slugified name.
      const sku = String(pick(r, "sku", "SKU") ?? "").trim();
      const slug = String(pick(r, "slug") ?? "").trim() || (sku ? slugify(sku) : slugify(name));

      const catRaw = pick(r, "category", "category_name", "categories", "Categories");
      let category_id: string | null = null;
      if (catRaw) {
        const leaf = String(catRaw).split(/[,|]/)[0]?.split(">").pop()?.trim();
        if (leaf) category_id = catByName.get(leaf.toLowerCase()) ?? null;
      } else if (r.category_id) {
        category_id = String(r.category_id);
      }

      const images = normalizeImages(pick(r, "images", "Images") ?? r.images);
      const price = Number(pick(r, "sale price", "Sale price", "regular price", "Regular price", "price") ?? 0);
      const stock = Number(pick(r, "stock", "Stock") ?? 0);
      const description = (pick(r, "description", "Description", "shout description", "Shout description") as string) ?? null;
      const published = pick(r, "published", "Published", "status", "Status");
      const featured = pick(r, "is_featured", "Is featured?", "featured");
      const inStock = pick(r, "in stock?", "In stock?", "stock status");

      const payload = {
        slug,
        name,
        price: isNaN(price) ? 0 : price,
        stock: isNaN(stock) ? 0 : stock,
        category_id,
        image_url: (pick(r, "image_url", "image") as string) || images[0] || null,
        images,
        description,
        is_active: truthy(published, true) && (inStock === undefined ? true : truthy(inStock, true)),
        is_featured: truthy(featured, false),
      };

      // Check existence to report new vs updated.
      const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
      const { error } = await supabase.from("products").upsert(payload, { onConflict: "slug" });
      if (error) { fail++; errors.push(`${slug}: ${error.message}`); }
      else if (existing) updated++;
      else ok++;
    }
    alert(`Import terminé. Créés: ${ok}, mis à jour: ${updated}, échoués: ${fail}${errors.length ? "\n" + errors.slice(0, 5).join("\n") : ""}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-4xl">Products</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleWooSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-50"
            title="Import all products from your WooCommerce store"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Sync…" : "Sync WordPress"}
          </button>
          <ExportImportBar filenameBase="products" getRows={exportRows} onImport={importRows} />
          <button onClick={() => setEditing({ ...empty })} className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper">
            <Plus className="h-4 w-4" /> Norveto
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest">
            <tr><th className="px-4 py-3">Produit</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
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
            {!items.length && <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={5}>No products</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form onSubmit={save} className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border bg-background p-6">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing.id ? "Edit" : "Norveto"} produit</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1"><X className="h-5 w-5" /></button></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="inp" /></Field>
              <Field label="Slug (auto si vide)"><input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="inp" /></Field>
              <Field label="Price (€)"><input required type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="inp" /></Field>
              <Field label="Stock"><input required type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="inp" /></Field>
              <Field label="Category">
                <select value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="inp">
                  <option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">Images</span>
                <div className="mt-2 border border-border bg-card p-3">
                  <ProductImageManager
                    mainImage={editing.image_url || null}
                    gallery={editing.images ?? []}
                    onChange={(main, gallery) => setEditing({ ...editing, image_url: main, images: gallery })}
                  />
                </div>
              </div>
              <div className="sm:col-span-2"><Field label="Description"><textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="inp" /></Field></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Actif</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> Vedette</label>
            </div>
            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-secondary">Cancel</button>
              <button disabled={busy} className="bg-primary px-5 py-2 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper disabled:opacity-50">{busy ? "..." : "Save"}</button>
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
