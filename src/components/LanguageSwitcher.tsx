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
        aria-label="The project is still connected to the original Supabase.\n\nI need to migrate all authenticated users to my new Supabase project.\n\nRequirements:\n\n- Preserve email addresses.\n\n- Preserve password hashes.\n\n- Preserve user IDs.\n\n- Preserve email verification status.\n\n- Preserve metadata.\n\nIf password hashes cannot be exported through SQL, explain the supported migration method for auth.users.\n\nDo not generate fake passwords or require password resets if avoidable."
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
