import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, FileText, FileEdit, Settings, ArrowLeft, MessageSquare, Menu, X, LogOut } from "lucide-react";
import { useUserRoles } from "@/lib/roles";
import { useAuth, signOut } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { to: "/admin/customers", label: "Clients", icon: Users },
  { to: "/admin/contacts", label: "Messages", icon: MessageSquare },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/pages", label: "Pages", icon: FileEdit },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRoles();
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
    if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, authLoading, roleLoading, navigate, isLoginRoute]);

  if (isLoginRoute) return <Outlet />;

  if (authLoading || roleLoading || !user || !isAdmin) {
    return <div className="mx-auto max-w-5xl px-5 py-16 text-sm text-muted-foreground">Vérification de l'accès admin…</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2" aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin" className="font-display text-lg md:text-xl">Verodav · Admin</Link>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline text-muted-foreground truncate max-w-[200px]">{user.email}</span>
          <Link to="/" className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 hover:bg-secondary">
            <ArrowLeft className="h-3.5 w-3.5" /> Site
          </Link>
          <button onClick={async () => { await signOut(); navigate({ to: "/admin/login" }); }} className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 hover:bg-secondary">
            <LogOut className="h-3.5 w-3.5" /> Quitter
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-card min-h-[calc(100vh-3.5rem)] p-3">
          <SideNav />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
            <aside className="md:hidden fixed top-0 left-0 z-50 h-dvh w-72 bg-card border-r border-border p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="font-display text-lg">Admin</div>
                <button onClick={() => setMobileOpen(false)} className="p-2 -mr-2" aria-label="Fermer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SideNav onNavigate={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to as string}
          onClick={onNavigate}
          activeOptions={n.exact ? { exact: true } : undefined}
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          className="flex items-center gap-2.5 border border-transparent px-3 py-2.5 text-sm hover:bg-secondary transition"
        >
          <n.icon className="h-4 w-4" /> {n.label}
        </Link>
      ))}
    </nav>
  );
}
