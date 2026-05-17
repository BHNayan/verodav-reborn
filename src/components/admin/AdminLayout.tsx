import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, FileText, ArrowLeft } from "lucide-react";
import { useUserRoles } from "@/lib/roles";
import { useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { to: "/admin/customers", label: "Clients", icon: Users },
  { to: "/admin/blog", label: "Blog", icon: FileText },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRoles();

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/admin", mode: "signin" } });
      return;
    }
    if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading || !user || !isAdmin) {
    return <div className="mx-auto max-w-5xl px-5 py-16 text-sm text-muted-foreground">Vérification de l'accès admin…</div>;
  }

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-8 md:flex-row md:px-8 md:py-10">
      <aside className="md:w-64 md:shrink-0">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-copper">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour site
          </Link>
          <h2 className="mt-3 font-display text-2xl">Administration</h2>
        </div>
        <nav className="grid grid-cols-2 gap-1 md:flex md:flex-col">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={n.exact ? { exact: true } : undefined}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex items-center gap-2 border border-border px-3 py-2.5 text-sm hover:bg-secondary transition"
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
