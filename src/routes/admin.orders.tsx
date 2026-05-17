import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";

type Order = { id: string; user_id: string; status: string; total: number; created_at: string };
type Item = { id: string; product_name: string; unit_price: number; quantity: number };

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export const Route = createFileRoute("/admin/orders")({ component: Page });

function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, Item[]>>({});

  const load = async () => {
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setOrders((data ?? []) as Order[]);
  };
  useEffect(() => { load(); }, [filter]);

  const toggle = async (id: string) => {
    if (open === id) return setOpen(null);
    setOpen(id);
    if (!items[id]) {
      const { data } = await supabase.from("order_items").select("*").eq("order_id", id);
      setItems((s) => ({ ...s, [id]: (data ?? []) as Item[] }));
    }
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) alert(error.message); else load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Commandes</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`border border-border px-3 py-1.5 text-xs uppercase tracking-widest ${filter === s ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{s}</button>
        ))}
      </div>
      <div className="mt-6 border border-border bg-card">
        {orders.map((o) => (
          <div key={o.id} className="border-b border-border last:border-0">
            <button onClick={() => toggle(o.id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-secondary/30">
              <div className="min-w-0">
                <div className="truncate font-medium">#{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}</div>
                <div className="text-xs text-muted-foreground">Client: {o.user_id.slice(0, 8)}</div>
              </div>
              <div className="flex items-center gap-3">
                <select value={o.status} onChange={(e) => { e.stopPropagation(); setStatus(o.id, e.target.value); }} onClick={(e) => e.stopPropagation()} className="border border-border bg-transparent px-2 py-1 text-xs">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="font-display text-lg w-24 text-right">{Number(o.total).toFixed(2)} €</div>
                {open === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
            {open === o.id && (
              <div className="bg-secondary/30 px-4 py-3 text-sm">
                {(items[o.id] ?? []).map((i) => (
                  <div key={i.id} className="flex justify-between py-1"><span>{i.product_name} × {i.quantity}</span><span>{(Number(i.unit_price) * i.quantity).toFixed(2)} €</span></div>
                ))}
                {!items[o.id]?.length && <div className="text-muted-foreground">Chargement…</div>}
              </div>
            )}
          </div>
        ))}
        {!orders.length && <div className="p-8 text-center text-sm text-muted-foreground">Aucune commande</div>}
      </div>
    </div>
  );
}
