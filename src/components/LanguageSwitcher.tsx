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
        aria-label="The migrated products table does NOT contain the column compare_at_price.\n\nThe actual schema is:\n\nid\n\nslug\n\ncategory_id\n\nname\n\ndescription\n\nprice\n\nsale_price\n\nstock\n\nimage_url\n\nimages\n\nis_active\n\nis_featured\n\nsku\n\ncreated_at\n\nupdated_at\n\nPlease regenerate ONLY 014_products.sql.\n\nRequirements:\n\n- Replace compare_at_price with sale_price.\n\n- Use ONLY columns that exist in the migrated schema.\n\n- Do not change any data.\n\n- Split the export into files of maximum 50 INSERT statements each:\n\n014_products_part1.sql\n\n014_products_part2.sql\n\n014_products_part3.sql\n\n...\n\nValidate every file before returning."
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
