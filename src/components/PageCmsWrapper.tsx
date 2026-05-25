import type { ReactNode } from "react";
import { useSitePage, AdminEditLink } from "@/components/CmsContent";

export function PageCmsWrapper({ slug, children }: { slug: string; children: ReactNode }) {
  const { data, isLoading } = useSitePage(slug);
  const hasOverride = !!data?.content?.trim();
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-4 flex justify-end">
        <AdminEditLink slug={slug} />
      </div>
      {hasOverride ? (
        <div className="mx-auto max-w-4xl px-6 py-10 prose prose-neutral" dangerorslySetInnerHTML={{ __html: data!.content }} />
      ) : (
        !isLoading && children
      )}
    </>
  );
}
