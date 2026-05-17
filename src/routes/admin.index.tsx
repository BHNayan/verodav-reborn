import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, Users, Euro } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: products }, { count: orders }, { count: customers }, { data: paid }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total").in("status", ["paid", "shipped", "delivered"]),
      ]);
      const revenue = (paid ?? []).reduce((s, o) => s + Number(o.total ?? 0), 0);
      setStats({ products: products ?? 0, orders: orders ?? 0, customers: customers ?? 0, revenue });
    })();
  }, []);

  const cards = [
    { label: "Produits", value: stats.products, icon: Package },
    { label: "Commandes", value: stats.orders, icon: ShoppingCart },
    { label: "Clients", value: stats.customers, icon: Users },
    { label: "Revenu (€)", value: stats.revenue.toFixed(2), icon: Euro },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Tableau de bord</h1>
      <p className="mt-1 text-sm text-muted-foreground">Vue d'ensemble de votre boutique.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <c.icon className="h-4 w-4 text-copper" />
            </div>
            <div className="mt-3 font-display text-3xl">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
