import { createClient } from '@supabase/supabase-js';
import { posts } from '../src/lib/blog';
const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const rows = posts.map(p => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  cover_url: p.image,
  content: p.sections.map(s => (s.heading ? `## ${s.heading}\n\n` : '') + s.paragraphs.join('\n\n') + (s.bullets ? '\n\n' + s.bullets.map(b => '- ' + b).join('\n') : '')).join('\n\n'),
  published: true,
  published_at: new Date(p.date).toISOString(),
}));
const { error } = await supa.from('blog_posts').insert(rows);
if (error) { console.error(error); process.exit(1); }
console.log('blog posts', rows.length);
