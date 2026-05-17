import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
const cats = JSON.parse(fs.readFileSync('src/data/categories.json', 'utf-8'));

// delete existing
await supa.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
await supa.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
await supa.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
console.log('cleared');

// insert categories
const catRows = cats.map((c, i) => ({ slug: c.slug, name: c.name, image_url: c.image, description: c.description || '', sort_order: i }));
const { error: ce, data: cd } = await supa.from('categories').insert(catRows).select();
if (ce) throw ce;
const catBySlug = Object.fromEntries(cd.map(r => [r.slug, r.id]));
console.log('categories', cd.length);

// insert products in batches
const prodRows = products.map(p => ({
  slug: p.slug,
  name: p.name,
  price: p.price,
  image_url: p.image,
  description: (p.short ? p.short + '\n\n' : '') + (p.description || ''),
  category_id: catBySlug[p.categories?.[0]] || null,
  is_active: true,
  stock: p.in_stock ? 10 : 0,
}));
for (let i = 0; i < prodRows.length; i += 50) {
  const batch = prodRows.slice(i, i + 50);
  const { error } = await supa.from('products').insert(batch);
  if (error) { console.error('batch', i, error); throw error; }
}
console.log('products', prodRows.length);
