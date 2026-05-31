import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type WooImage = { src: string };
type WooCategory = { name: string };
type WooProduct = {
  id: number;
  name: string;
  slug: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: string;
  manage_stock: boolean;
  images: WooImage[];
  categories: WooCategory[];
};

export const syncWooCommerce = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    // Admin check
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin only");

    const storeUrl = process.env.WC_STORE_URL;
    const key = process.env.WC_CONSUMER_KEY;
    const secret = process.env.WC_CONSUMER_SECRET;
    if (!storeUrl || !key || !secret) {
      throw new Error("Missing WC_STORE_URL / WC_CONSUMER_KEY / WC_CONSUMER_SECRET");
    }
    const base = storeUrl.replace(/\/+$/, "");
    const auth = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");

    // Load existing categories
    const { data: existingCats } = await supabaseAdmin.from("categories").select("id,name");
    const catByName = new Map<string, string>((existingCats ?? []).map((c) => [c.name.toLowerCase(), c.id]));

    let page = 1;
    let totalPages = 1;
    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    do {
      const url = `${base}/wp-json/wc/v3/products?per_page=100&page=${page}&status=any`;
      const res = await fetch(url, { headers: { Authorization: auth } });
      if (!res.ok) {
        throw new Error(`WooCommerce API ${res.status}: ${await res.text().catch(() => "")}`);
      }
      totalPages = Number(res.headers.get("x-wp-totalpages") ?? "1") || 1;
      const products = (await res.json()) as WooProduct[];

      // Create missing categories first
      const neededCats = new Set<string>();
      for (const p of products) {
        const first = p.categories?.[0]?.name?.trim();
        if (first && !catByName.has(first.toLowerCase())) neededCats.add(first);
      }
      if (neededCats.size) {
        const toInsert = Array.from(neededCats).map((name) => ({ name, slug: slugify(name) }));
        const { data: insertedCats, error: catErr } = await supabaseAdmin
          .from("categories")
          .upsert(toInsert, { onConflict: "slug" })
          .select("id,name");
        if (catErr) errors.push(`categories: ${catErr.message}`);
        for (const c of insertedCats ?? []) catByName.set(c.name.toLowerCase(), c.id);
      }

      for (const p of products) {
        try {
          const images = (p.images ?? []).map((i) => i.src).filter(Boolean);
          const slug = p.slug || slugify(p.name);
          const catName = p.categories?.[0]?.name?.trim();
          const category_id = catName ? catByName.get(catName.toLowerCase()) ?? null : null;
          const priceNum = Number(p.sale_price || p.price || p.regular_price || 0) || 0;
          const stockNum = typeof p.stock_quantity === "number"
            ? p.stock_quantity
            : (p.stock_status === "instock" ? 999 : 0);
          const description = [p.description, p.short_description].filter(Boolean).join("\n\n").trim() || null;

          const payload = {
            slug,
            name: p.name,
            price: priceNum,
            stock: stockNum,
            category_id,
            image_url: images[0] ?? null,
            images,
            description,
            is_active: p.status === "publish" && p.stock_status !== "outofstock",
            is_featured: !!p.featured,
          };

          const { data: existing } = await supabaseAdmin
            .from("products")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();
          const { error } = await supabaseAdmin
            .from("products")
            .upsert(payload, { onConflict: "slug" });
          if (error) {
            failed++;
            errors.push(`${slug}: ${error.message}`);
          } else if (existing) {
            updated++;
          } else {
            created++;
          }
        } catch (e) {
          failed++;
          errors.push(`${p.slug}: ${(e as Error).message}`);
        }
      }

      page++;
    } while (page <= totalPages);

    return {
      created,
      updated,
      failed,
      totalPages,
      errors: errors.slice(0, 10),
    };
  });
