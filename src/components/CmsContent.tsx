import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/lib/roles";

export function useSitePage(slug: string) {
  return useQuery({
    queryKey: ["site_page", slug],
    queryFn: async () => {
      const { data } = await supabase.from("site_pages").select("*").eq("slug", slug).maybeSingle();
      return data as { slug: string; title: string; content: string } | null;
    },
  });
}

export function AdminEditLink({ slug, className = "" }: { slug: string; className?: string }) {
  const { isAdmin } = useUserRoles();
  if (!isAdmin) return null;
  return (
    <Link
      to="/admin/pages"
      search={{ slug } as never}
      className={`inline-flex items-center gap-1.5 border border-copper/40 bg-copper/10 px-3 py-1.5 text-[10px] uppercase tracking-widest text-copper hover:bg-copper hover:text-primary-foreground transition ${className}`}
    >
      <Pencil className="h-3 w-3" /> Éditer cette page
    </Link>
  );
}

export function CmsContent({ slug }: { slug: string }) {
  const { data } = useSitePage(slug);
  if (!data?.content?.trim()) return null;
  return (
    <div className="prose prose-neutral max-w-none mx-auto px-4 py-10" dangerouslySetInnerHTML={{ __html: data.content }} />
  );
}
