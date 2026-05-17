import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_DEFAULTS, type SiteSettings } from "@/lib/site";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  const [form, setForm] = useState<SiteSettings>(SITE_DEFAULTS);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "site").maybeSingle().then(({ data }) => {
      if (data?.value) setForm({ ...SITE_DEFAULTS, ...(data.value as Partial<SiteSettings>) });
    });
  }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    const { error } = await supabase.from("site_settings").upsert({ key: "site", value: form as never });
    setBusy(false);
    setMsg(error ? error.message : "Enregistré ✓");
  };

  const fields: { k: keyof SiteSettings; label: string }[] = [
    { k: "name", label: "Nom du site" },
    { k: "tagline", label: "Slogan" },
    { k: "email", label: "Email de contact" },
    { k: "phone", label: "Téléphone (affichage)" },
    { k: "phoneRaw", label: "Téléphone (lien tel:)" },
    { k: "address", label: "Adresse" },
    { k: "facebook", label: "Facebook URL" },
    { k: "instagram", label: "Instagram URL" },
    { k: "tiktok", label: "TikTok URL" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl md:text-4xl">{useI18n().t("admin.settings.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{useI18n().t("admin.settings.intro")}</p>
      <form onSubmit={save} className="mt-6 max-w-2xl border border-border bg-card p-5 space-y-4">
        {fields.map(({ k, label }) => (
          <label key={k} className="block">
            <span className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
            <input
              value={form[k] ?? ""}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
        ))}
        {msg && <p className="text-sm text-emerald-700">{msg}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper disabled:opacity-50">
            <Save className="h-4 w-4" /> {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
