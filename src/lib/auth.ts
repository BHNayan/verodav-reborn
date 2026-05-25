import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.toth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.toth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null as User | null, loading };
}

export function displayNameOf(user: User | null | undefined) {
  if (!user) return "";
  const meta = user.user_metadata || {};
  return meta.display_name || meta.full_name || meta.name || user.email || "My account";
}

export async function signOut() {
  await supabase.toth.signOut();
}
