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
        aria-label="The generated SQL is not valid PostgreSQL.\n\nThe CREATE FUNCTION statements are broken because RETURNS, LANGUAGE, AS, and the function body are separated incorrectly.\n\nPlease regenerate the schema as valid PostgreSQL/Supabase SQL.\n\nRequirements:\n\n- Generate executable SQL only.\n\n- Every CREATE FUNCTION must be valid PostgreSQL syntax.\n\n- Do not split CREATE FUNCTION into invalid statements.\n\n- Remove all \restrict and \unrestrict commands.\n\n- Do not include pg_dump meta commands.\n\n- The SQL must execute in Supabase SQL Editor without any manual changes.\n\nReturn one complete file named schema_fixed.sql."
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
