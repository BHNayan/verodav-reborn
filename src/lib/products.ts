import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  categories: string[];
  category_names: string[];
  short: string;
  description: string;
  on_sale: boolean;
  in_stock: boolean;
  rating: number;
  reviews: number;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string;
  description: string;
};

export const products: Product[] = productsData as Product[];
export const categories: Category[] = categoriesData as Category[];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsInCategory = (slug: string) =>
  products.filter((p) => p.categories.includes(slug));
