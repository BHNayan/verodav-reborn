CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins insert site settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete site settings" ON public.site_settings FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER touch_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('site', '{"name":"Verodav Home","tagline":"Better home, think us.","email":"info@verodav-home.com","phone":"+33 7 58 34 76 62","phoneRaw":"+33758347662","address":"21 rue de Cherbourg, 67100 Strasbourg","facebook":"https://www.facebook.com/","instagram":"https://www.instagram.com/","tiktok":"https://www.tiktok.com/"}'::jsonb)
ON CONFLICT (key) DO NOTHING;