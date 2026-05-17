import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BlogSection = { heading?: string; paragraphs: string[]; bullets?: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readTime: string;
  image: string;
  sections: BlogSection[];
};

type BlogRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string | null;
  published_at: string | null;
  created_at: string;
};

function readTimeFor(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

function parseContent(content: string): BlogSection[] {
  if (!content) return [];
  // Split on h2-like headings ("## Heading"). The first chunk has no heading.
  const blocks = content.split(/\n(?=## )/g);
  return blocks
    .map((block) => {
      const headingMatch = block.match(/^##\s+(.+)$/m);
      const heading = headingMatch ? headingMatch[1].trim() : undefined;
      const body = heading ? block.replace(/^##\s+.+\n?/, "") : block;

      // Pull bullets (consecutive "- " lines at end of section)
      const bulletMatch = body.match(/((?:^- .+\n?)+)$/m);
      let bullets: string[] | undefined;
      let rest = body;
      if (bulletMatch) {
        bullets = bulletMatch[1]
          .trim()
          .split("\n")
          .map((l) => l.replace(/^- /, "").trim())
          .filter(Boolean);
        rest = body.slice(0, bulletMatch.index).trim();
      }

      const paragraphs = rest
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

      return { heading, paragraphs, bullets };
    })
    .filter((s) => s.heading || s.paragraphs.length || (s.bullets && s.bullets.length));
}

function rowToPost(row: BlogRow): BlogPost {
  const content = row.content ?? "";
  const sections = parseContent(content);
  const date = row.published_at ?? row.created_at;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: "Article",
    date,
    readTime: readTimeFor(content + " " + (row.excerpt ?? "")),
    image: row.cover_url ?? "",
    sections,
  };
}

async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, cover_url, content, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(500);
  if (error) throw error;
  return (data as BlogRow[]).map(rowToPost);
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, cover_url, content, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToPost(data as BlogRow) : null;
}

export const postsQueryOptions = () =>
  queryOptions({
    queryKey: ["blog", "posts"],
    queryFn: fetchPosts,
    staleTime: 60_000,
  });

export const postQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => fetchPostBySlug(slug),
    staleTime: 60_000,
  });

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

import { useQuery } from "@tanstack/react-query";
export function usePosts(): BlogPost[] {
  const { data } = useQuery(postsQueryOptions());
  return data ?? [];
}
export function getPostFromList(list: BlogPost[], slug: string) {
  return list.find((p) => p.slug === slug);
}
