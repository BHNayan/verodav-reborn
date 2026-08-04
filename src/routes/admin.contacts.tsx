File: src/routes/admin.contacts.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Mail } from "lucide-react";

type Submission = { id: string; name: string; email: string; subject: string | null; message: string; status: string; created_at: string };
const STATUSES = ["new", "read", "replied", "archived"];

export const Route = createFileRoute("/admin/contacts")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setRows((data ?? []) as Submission[]);
  };
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) return alert(error.message);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return alert(error.message);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-4xl">Messages de contact</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`border border-border px-3 py-1.5 text-xs uppercase tracking-widest ${filter === s ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{s === "new" ? "nouveau" : s === "read" ? "lu" : s === "replied" ? "répondu" : s === "archived" ? "archivé" : "tous"}</button>
        ))}
      </div>
      <div className="mt-6 border border-border bg-card">
        {rows.map((r) => (
          <div key={r.id} className="border-b border-border last:border-0">
            <button onClick={() => { setOpen(open === r.id ? null : r.id); if (r.status === "new") setStatus(r.id, "read"); }} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-secondary/30">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {r.status === "new" && <span className="h-2 w-2 rounded-full bg-copper" />}
                  <span className="truncate font-medium">{r.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{r.email}</span>
                </div>
                <div className="truncate text-sm text-muted-foreground">{r.subject || r.message.slice(0, 80)}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                <select value={r.status} onChange={(e) => { e.stopPropagation(); setStatus(r.id, e.target.value); }} onClick={(e) => e.stopPropagation()} className="border border-border bg-transparent px-2 py-1 text-xs">
                  {STATUSES.map((s) => <option key={s} value={s}>{s === "new" ? "Nouveau" : s === "read" ? "Lu" : s === "replied" ? "Répondu" : s === "archived" ? "Archivé" : s}</option>)}
                </select>
              </div>
            </button>
            {open === r.id && (
              <div className="bg-secondary/30 px-4 py-4 text-sm space-y-3">
                {r.subject && <div><strong>Sujet :</strong> {r.subject}</div>}
                <div className="whitespace-pre-wrap">{r.message}</div>
                <div className="flex gap-2 pt-2">
                  <a href={`mailto:${r.email}?subject=Re: ${encodeURIComponent(r.subject || "Votre message")}`} className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs hover:bg-secondary">
                    <Mail className="h-3.5 w-3.5" /> Répondre
                  </a>
                  <button onClick={() => remove(r.id)} className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!rows.length && <div className="p-8 text-center text-sm text-muted-foreground">Aucun message</div>}
      </div>
    </div>
  );
}
