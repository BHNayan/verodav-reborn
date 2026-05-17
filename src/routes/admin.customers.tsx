import { useI18n } from "@/lib/i18n";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExportImportBar } from "@/components/admin/ExportImportBar";

type Customer = { id: string; email: string | null; display_name: string | null; phone: string | null; created_at: string; orders_count: number; total_spent: number };

export const Route = createFileRoute("/admin/customers")({ component: Page });

function Page() {
  const [rows, setRows] = useState<Customer[]>([]);
  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: orders } = await supabase.from("orders").select("user_id,total,status");
      const map = new Map<string, { count: number; total: number }>();
      (orders ?? []).forEach((o) => {
        const m = map.get(o.user_id) ?? { count: 0, total: 0 };
        m.count++;
        if (["paid", "shipped", "delivered"].includes(o.status)) m.total += Number(o.total);
        map.set(o.user_id, m);
      });
      setRows((profiles ?? []).map((p) => ({ ...p, orders_count: map.get(p.id)?.count ?? 0, total_spent: map.get(p.id)?.total ?? 0 })) as Customer[]);
    })();
  }, []);

  const exportRows = () =>
    rows.map((c) => ({
      id: c.id,
      display_name: c.display_name ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
      orders_count: c.orders_count,
      total_spent: c.total_spent,
      created_at: c.created_at,
    }));

  const importRows = async (data: Record<string, unknown>[]) => {
    let ok = 0, fail = 0;
    for (const r of data) {
      const id = String(r.id ?? "").trim();
      if (!id) { fail++; continue; }
      const patch: Record<string, unknown> = {};
      if (r.display_name !== undefined) patch.display_name = r.display_name || null;
      if (r.phone !== undefined) patch.phone = r.phone || null;
      if (Object.keys(patch).length === 0) { fail++; continue; }
      const { error } = await supabase.from("profiles").update(patch as never).eq("id", id);
      if (error) fail++; else ok++;
    }
    alert(`Mise à jour clients — Réussis: ${ok}, échoués: ${fail}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-4xl">{useI18n().t("admin.customers.title")}</h1>
        <ExportImportBar filenameBase="clients" getRows={exportRows} onImport={importRows} importLabel="Mettre à jour" />
      </div>
      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-widest">
            <tr><th className="px-4 py-3">Client</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Téléphone</th><th className="px-4 py-3">Commandes</th><th className="px-4 py-3">Total dépensé</th><th className="px-4 py-3">Inscrit</th></tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.display_name ?? "—"}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone ?? "—"}</td>
                <td className="px-4 py-3">{c.orders_count}</td>
                <td className="px-4 py-3">{c.total_spent.toFixed(2)} €</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Aucun client</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
