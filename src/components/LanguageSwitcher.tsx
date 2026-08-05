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
        aria-label="I want to migrate this project from Loveable Cloud to my own Supabase project.

First, do NOT modify any code.

Please inspect the entire database and generate a complete SQL schema export.

The SQL must include EVERYTHING required to recreate the database exactly:

Extensions

Custom Types (ENUMs)

Tables

All Columns

Primary Keys

Foreign Keys

Unique Constraints

Check Constraints

Default Values

Indexes

Triggers

Trigger Functions

Stored Procedures / Functions

Views

Materialized Views (if any)

Sequences

Row Level Security (RLS)

Policies

Grants / Permissions

Storage bucket definitions (if applicable)

Also provide a complete database documentation including:

Every table name

Purpose of each table

Relationships between tables

Primary and foreign keys

Which tables are used for authentication

Which tables store products, categories, orders, users, settings, pages, blogs, media, etc.

Any custom SQL functions or business logic.

Output everything as SQL files and Markdown documentation.

Do NOT omit anything.

I need a complete database schema so I can recreate this project in a brand-new Supabase instance with identical functionality."
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
