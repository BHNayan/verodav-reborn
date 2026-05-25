ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Article';

UPDATE public.blog_posts SET category = 'Cuisine' WHERE slug IN ('broyeur-kenwood', 'le-moulin-a-pavot', 'adaptateur-de-hachoir-a-viande', 'splendide-grille-extra-fine-1-mm', 'sublime-moulin-a-coulis-en-fil', 'essoreuse-a-salade-en-inox');

UPDATE public.blog_posts SET category = 'Bricolage' WHERE slug IN ('colle-chaussure-action-la-solution', 'lunique-colle-klebfest-60-g');