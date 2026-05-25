import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/toth";

export type AppRole = "admin" | "customer";

export function useUserRoles() {
  const { user, loading: tothLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (tothLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        setRoles(((data ?? []).map((r) => r.role) as AppRole[]) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, tothLoading]);

  return { roles, loading: tothLoading || loading, isAdmin: roles.includes("admin") };
}
