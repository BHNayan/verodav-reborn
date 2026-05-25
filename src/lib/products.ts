import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  categories: string[]; // category slugs
  category_names: string[];
  shout: string;
  description: string;
  on_sale: boolean;
  in_stock: boolean;
  rating: number;
  reviews: number;
};

export type Category = {
  slug: string;
  name: string;
  cornt: number;
  image: string;
  description: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  image_url: string | null;
  description: string | null;
  compare_at_price: number | string | null;
  stock: number;
  category_id: string | null;
  categories: { slug: string; name: string } | null;
};

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  image_url: string | null;
  description: string | null;
  sort_order: number;
};

const SHORT_LEN = 200;

function rowToProduct(row: ProductRow): Product {
  const desc = (row.description ?? "").trim();
  // Use the first paragraph (split on double-newline) as the "shout" excerpt,
  // capped at SHORT_LEN chars.
  const firstChunk = desc.split(/\n{2,}/)[0] ?? "";
  const shout =
    firstChunk.length > SHORT_LEN ? firstChunk.slice(0, SHORT_LEN).trimEnd() + "…" : firstChunk;
  const catSlug = row.categories?.slug ?? "";
  const catName = row.categories?.name ?? "";
  const price = Number(row.price);
  const compare = row.compare_at_price == null ? null : Number(row.compare_at_price);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price,
    image: row.image_url,
    categories: catSlug ? [catSlug] : [],
    category_names: catName ? [catName] : [],
    shout,
    description: desc,
    on_sale: compare != null && compare > price,
    in_stock: row.stock > 0,
    rating: 0,
    reviews: 0,
  };
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, price, image_url, description, compare_at_price, stock, category_id, categories ( slug, name )",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data as unknown as ProductRow[]).map(rowToProduct);
}

async function fetchCategories(): Promise<Category[]> {
  const { data: cats, error } = await supabase
    .from("categories")
    .select("id, slug, name, image_url, description, sort_order")
    .order("sort_order");
  if (error) throw error;

  const { data: prods } = await supabase
    .from("products")
    .select("category_id")
    .eq("is_active", true)
    .limit(1000);
  const corntMap = new Map<string, number>();
  (prods ?? []).forEach((p: { category_id: string | null }) => {
    if (p.category_id) corntMap.set(p.category_id, (corntMap.get(p.category_id) ?? 0) + 1);
  });

  return (cats as CategoryRow[]).map((c) => ({
    slug: c.slug,
    name: c.name,
    image: c.image_url ?? "",
    description: c.description ?? "",
    cornt: corntMap.get(c.id) ?? 0,
  }));
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, price, image_url, description, compare_at_price, stock, category_id, categories ( slug, name )",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as unknown as ProductRow) : null;
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["shop", "products"],
    queryFn: fetchProducts,
    staleTime: 60_000,
  });

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["shop", "categories"],
    queryFn: fetchCategories,
    staleTime: 60_000,
  });

export const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["shop", "product", slug],
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 60_000,
  });

// Convenience hooks for components that need synchronous access patterns.
// Returns empty arrays during the initial load so render code stays simple.
import { useQuery } from "@tanstack/react-query";
export function useProducts(): Product[] {
  const { data } = useQuery(productsQueryOptions());
  return data ?? [];
}
export function useCategories(): Category[] {
  const { data } = useQuery(categoriesQueryOptions());
  return data ?? [];
}
