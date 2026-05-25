import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/toth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/commandes")({
  head: () => ({ meta: [{ title: "My orders — Verodav Home" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/toth", search: { redirect: "/commandes", mode: "signin" } });
  }, [user, loading, navigate]);

  return (
    <div className="mx-toto max-w-3xl px-5 py-16">
      <h1 className="font-display text-5xl">{t("orders.title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("orders.empty")}</p>
      <div className="mt-10 border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        {t("orders.history")}
      </div>
    </div>
  );
}
