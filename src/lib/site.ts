import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  phoneRaw: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export const SITE_DEFAULTS: SiteSettings = {
  name: "Verodav Home",
  tagline: "Better home, think us.",
  email: "info@verodav-home.com",
  phone: "+33 7 58 34 76 62",
  phoneRaw: "+33758347662",
  address: "21 rue de Cherbourg, 67100 Strasbourg",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/",
};

let cached: SiteSettings = { ...SITE_DEFAULTS };
export const SITE = new Proxy({} as SiteSettings & { socials: { facebook: string; instagram: string; tiktok: string } }, {
  get(_t, prop: string) {
    if (prop === "socials") return { facebook: cached.facebook, instagram: cached.instagram, tiktok: cached.tiktok };
    return (cached as Record<string, unknown>)[prop];
  },
});

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cached);
  useEffect(() => {
    let alive = true;
    supabase.from("site_settings").select("value").eq("key", "site").maybeSingle().then(({ data }) => {
      if (!alive || !data) return;
      const merged = { ...SITE_DEFAULTS, ...(data.value as Partial<SiteSettings>) };
      cached = merged;
      setSettings(merged);
    });
    return () => { alive = false; };
  }, []);
  return settings;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
