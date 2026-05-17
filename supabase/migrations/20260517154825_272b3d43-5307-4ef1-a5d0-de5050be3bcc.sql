CREATE TABLE IF NOT EXISTS public.site_pages (
  slug text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view site pages" ON public.site_pages FOR SELECT USING (true);
CREATE POLICY "Admins insert site pages" ON public.site_pages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site pages" ON public.site_pages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site pages" ON public.site_pages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_site_pages_updated BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_pages (slug, title) VALUES
  ('accueil', 'Accueil'),
  ('a-propos', 'À propos'),
  ('contact', 'Contact'),
  ('service-apres-vente', 'Service après-vente'),
  ('mentions-legales', 'Mentions légales'),
  ('politique-de-confidentialite', 'Politique de confidentialité'),
  ('protection-des-donnees-personnelles', 'Protection des données personnelles')
ON CONFLICT (slug) DO NOTHING;