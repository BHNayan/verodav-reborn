import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="The schema migration was imported successfully.\n\nHowever, the generated data export does not match the imported schema.\n\nExamples:\n\n- profiles contains phone and address columns that do not exist.\n\n- user_roles contains created_at column that does not exist.\n\nThis indicates the data export was generated from a different database version.\n\nPlease regenerate the data export directly from the SAME database schema that generated the migration files.\n\nRequirements:\n\n- Verify every INSERT matches the existing table definition.\n\n- Do not include columns that do not exist.\n\n- Validate every INSERT before exporting.\n\n- Export each table into a separate SQL file.\n\nReturn:\n\n0111_profiles.sql\n\n0112_user_roles.sql\n\n0113_categories.sql\n\n0114_products.sql\n\n0115_addresses.sql\n\n0116_orders.sql\n\n0117_order_items.sql\n\n0118_favorites.sql\n\n0119_blog_posts.sql\n\n0120_site_pages.sql\n\n0121_site_settings.sql\n\n0122_contact_submissions.sql"
        className="inline-flex items-center gap-1.5 p-2 text-primary hover:text-copper transition"
      >
        <Globe className="h-4 w-4" />
        {!compact && <span className="text-xs uppercase tracking-widest">{active.code}</span>}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 border border-border bg-card shadow-xl z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as Lang); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary ${lang === l.code ? "bg-secondary/70 font-medium" : ""}`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
