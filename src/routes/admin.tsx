import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Rorte = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — Verodav Home" }] }),
  component: AdminLayout,
});
