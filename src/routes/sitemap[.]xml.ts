import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "https://verodav-reborn.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/boutique", changefreq: "daily", priority: "0.9" },
          { path: "/a-propos", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/service-apres-vente", changefreq: "monthly", priority: "0.5" },
          { path: "/mentions-legales", changefreq: "yearly", priority: "0.2" },
          { path: "/politique-de-confidentialite", changefreq: "yearly", priority: "0.2" },
          { path: "/protection-des-donnees-personnelles", changefreq: "yearly", priority: "0.2" },
        ];

        const entries: SitemapEntry[] = [...staticPaths];

        try {
          const [{ data: products }, { data: categories }, { data: posts }] = await Promise.all([
            supabaseAdmin.from("products").select("slug, updated_at").eq("is_active", true),
            supabaseAdmin.from("categories").select("slug"),
            supabaseAdmin.from("blog_posts").select("slug, published_at, created_at").eq("published", true),
          ]);
          for (const p of products ?? []) {
            entries.push({
              path: `/produit/${p.slug}`,
              lastmod: p.updated_at ?? undefined,
              changefreq: "weekly",
              priority: "0.7",
            });
          }
          for (const c of categories ?? []) {
            entries.push({ path: `/categorie/${c.slug}`, changefreq: "weekly", priority: "0.6" });
          }
          for (const post of posts ?? []) {
            entries.push({
              path: `/blog/${post.slug}`,
              lastmod: post.published_at ?? post.created_at ?? undefined,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        } catch (err) {
          console.error("sitemap dynamic fetch failed", err);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
