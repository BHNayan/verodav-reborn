## Goal
Build a complete role-based e-commerce CMS on top of the existing Verodav Home site. Admins manage everything (products, categories, orders, customers, blog); customers get a dashboard for their orders, addresses, favorites, profile. Two seeded test accounts with credentials shown as hints on the login page.

## Database (migration)

New tables (all with RLS + `updated_at` triggers using existing `touch_updated_at`):

1. **`app_role`** enum: `'admin' | 'customer'`
2. **`user_roles`** — `id, user_id (uuid→auth.users), role app_role, unique(user_id, role)`
3. **`has_role(_user_id, _role)`** — security definer function (standard pattern)
4. **`categories`** — `id, slug (unique), name, description, image_url, sort_order`
5. **`products`** — `id, slug (unique), name, description, price (numeric), compare_at_price, stock (int), category_id (fk), image_url, images (jsonb), is_active (bool), is_featured (bool)`
6. **`addresses`** — `id, user_id, full_name, line1, line2, city, postal_code, country, phone, is_default`
7. **`orders`** — `id, user_id, status (text: pending|paid|shipped|delivered|cancelled), total (numeric), shipping_address (jsonb), created_at`
8. **`order_items`** — `id, order_id, product_id, product_name, unit_price, quantity`
9. **`favorites`** — `id, user_id, product_id, unique(user_id, product_id)`
10. **`blog_posts`** — `id, slug (unique), title, excerpt, content, cover_url, author_id, published (bool), published_at`

Extend **`profiles`**: add `phone`, `address` columns (nullable).

### RLS pattern
- **Products / categories / published blog**: public SELECT
- **Admin (via `has_role(auth.uid(),'admin')`)**: full CRUD on everything
- **Customer**: SELECT/INSERT/UPDATE/DELETE only their own `orders`, `order_items` (via order), `addresses`, `favorites`, `profiles` (own)
- **`user_roles`**: SELECT own, admin manages all

### Seeded data
- 2 categories, ~6 demo products, 1 blog post
- 2 auth users via SQL: `admin@verodav.test / Admin1234!` and `customer@verodav.test / Customer1234!` with `auto_confirm_email = true` for test convenience
- Assign roles in `user_roles`

## Frontend

### Auth changes (`src/routes/auth.tsx`)
- Add a visible "Comptes de démonstration" hint card with both emails/passwords and a "Remplir" button per account
- Enable auto-confirm so test signups work immediately

### Role helper (`src/lib/roles.ts`)
- `useUserRole()` hook → fetches from `user_roles`, returns `'admin' | 'customer' | null`

### Header (`src/components/SiteHeader.tsx`)
- If admin → "Admin" link to `/admin`; otherwise → "Mon compte" to `/compte`

### Customer dashboard (`/compte`, existing — expand)
Tabbed layout:
- **Profil**: edit name, phone
- **Adresses**: list + add/edit/delete
- **Commandes** (already partial): list orders with items
- **Favoris** (existing): from new `favorites` table

### Admin dashboard (new routes under `_authenticated/admin/`)

Guard: `_authenticated/admin.tsx` layout uses `beforeLoad` calling a server fn `requireAdmin()` (uses `requireSupabaseAuth` + `has_role` check). Non-admin → redirect `/`.

Routes:
- `/admin` — overview stats (counts: products, orders, customers, revenue)
- `/admin/products` — table list, search, create/edit/delete (form: name, slug, price, stock, category, images, is_active, is_featured, description)
- `/admin/categories` — list + create/edit/delete
- `/admin/orders` — list all orders, filter by status, view detail, update status
- `/admin/customers` — list users (from profiles), see their order count, total spent
- `/admin/blog` — list/create/edit/delete blog posts (rich textarea, publish toggle)

All admin mutations through `createServerFn` with `requireSupabaseAuth` middleware + admin role check, using `supabaseAdmin`.

### Shop wiring
- Replace static `src/lib/products.ts` reads with Supabase queries (server fn for SSR-safe list, browser client for client-side filter)
- Cart already exists; add real "Place order" action that creates an `orders` + `order_items` row (customer-only)

## Files to create/edit

**New:**
- `src/lib/roles.ts`, `src/lib/admin.functions.ts`, `src/lib/shop.functions.ts`
- `src/routes/_authenticated.tsx` (auth gate layout)
- `src/routes/_authenticated/admin.tsx` (admin gate layout + sidebar)
- `src/routes/_authenticated/admin/index.tsx`
- `src/routes/_authenticated/admin/products.tsx`
- `src/routes/_authenticated/admin/categories.tsx`
- `src/routes/_authenticated/admin/orders.tsx`
- `src/routes/_authenticated/admin/customers.tsx`
- `src/routes/_authenticated/admin/blog.tsx`
- `src/components/admin/AdminLayout.tsx`, `DataTable.tsx`, `ProductForm.tsx`, etc.

**Edit:**
- `src/routes/auth.tsx` (demo credentials hint)
- `src/routes/compte.tsx` → expand to tabbed dashboard
- `src/routes/commandes.tsx`, `src/routes/favoris.tsx` (wire to DB)
- `src/routes/boutique.tsx`, `src/routes/produit.$slug.tsx` (DB-driven)
- `src/components/SiteHeader.tsx` (admin link for admins)

## Technical notes
- `supabase--configure_auth` with `auto_confirm_email: true` so seeded users + new signups work without email verification (test mode)
- `attachSupabaseAuth` already wired in `src/start.ts` (verify)
- Use `@tanstack/react-query` for admin CRUD with invalidations

## Out of scope (this turn)
- Real payment processing (orders are recorded but checkout uses cart→create-order, no Stripe)
- Image uploads to storage (image URLs entered manually for now)
- Multi-language admin UI

## Confirmation needed
This is a **very large** change (~15+ new files, big migration, RLS for ~10 tables, two new role-protected sections). Want me to proceed end-to-end in this turn, or split it (Phase 1: schema + roles + demo accounts + admin shell; Phase 2: admin CRUD screens; Phase 3: customer dashboard + checkout wiring)?
