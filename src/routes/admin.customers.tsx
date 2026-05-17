import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">{useI18n().t("admin.customers.title")}</h1>
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
