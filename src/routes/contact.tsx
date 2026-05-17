import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageCmsWrapper } from "@/components/PageCmsWrapper";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Verodav Home" },
      { name: "description", content: "Contactez Verodav Home à Strasbourg. Conseils, commandes, service après-vente." },
      { property: "og:title", content: "Contact — Verodav Home" },
      { property: "og:description", content: "Contactez Verodav Home à Strasbourg. Conseils, commandes, service après-vente." },
      { property: "og:url", content: "https://verodav-reborn.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://verodav-reborn.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name, email: form.email, subject: form.subject || null, message: form.message,
    });
    setBusy(false);
    if (error) return setMsg({ kind: "err", text: t("contact.error") + " " + error.message });
    setMsg({ kind: "ok", text: t("contact.sent") });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <PageCmsWrapper slug="contact">
      <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-copper">— {t("nav.contact")}</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">{t("contact.title")}</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">{t("contact.intro")}</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl mb-6">{t("contact.coords")}</h2>
          <ul className="space-y-5">
            <li className="flex gap-4"><MapPin className="h-5 w-5 text-copper shrink-0 mt-0.5" /><div><div className="font-medium">{t("contact.shop")}</div><div className="text-muted-foreground">{SITE.address}</div></div></li>
            <li className="flex gap-4"><Phone className="h-5 w-5 text-copper shrink-0 mt-0.5" /><div><div className="font-medium">{t("contact.phone")}</div><a href={`tel:${SITE.phoneRaw}`} className="text-muted-foreground hover:text-copper">{SITE.phone}</a></div></li>
            <li className="flex gap-4"><Mail className="h-5 w-5 text-copper shrink-0 mt-0.5" /><div><div className="font-medium">{t("common.email")}</div><a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-copper">{SITE.email}</a></div></li>
            <li className="flex gap-4"><Clock className="h-5 w-5 text-copper shrink-0 mt-0.5" /><div><div className="font-medium">{t("contact.hours")}</div><div className="text-muted-foreground">Lun–Sam · 9h–18h</div></div></li>
          </ul>

          <div className="mt-8 aspect-[16/10] overflow-hidden border border-border">
            <iframe title="Carte" src="https://www.openstreetmap.org/export/embed.html?bbox=7.738%2C48.575%2C7.768%2C48.595&layer=mapnik&marker=48.585%2C7.753" className="h-full w-full" loading="lazy" />
          </div>
        </div>

        <form onSubmit={submit} className="bg-card border border-border p-8">
          <h2 className="font-display text-2xl mb-6">{t("contact.write")}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("common.name")}</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("common.email")}</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("common.subject")}</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("common.message")}</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} required className="mt-1 w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-copper" />
            </div>
            {msg && <p className={`text-sm ${msg.kind === "ok" ? "text-emerald-700" : "text-destructive"}`}>{msg.text}</p>}
            <button type="submit" disabled={busy} className="w-full bg-primary px-6 py-4 text-xs uppercase tracking-widest text-primary-foreground hover:bg-copper transition-colors disabled:opacity-50">
              {busy ? "…" : t("common.send")}
            </button>
          </div>
        </form>
      </div>
      </>
    </PageCmsWrapper>
  );
}
