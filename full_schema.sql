-- Complete Supabase-compatible SQL Schema Export
-- Generated on: 2026-08-05

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- ########################################################
-- Table: public.addresses
-- ########################################################
CREATE TABLE public.addresses (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id uuid NOT NULL,
full_name text NOT NULL,
line1 text NOT NULL,
line2 text,
city text NOT NULL,
postal_code text NOT NULL,
country text DEFAULT 'France'::text NOT NULL,
phone text,
is_default boolean DEFAULT false NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.addresses
ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE ONLY public.addresses
ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE POLICY "Admins view all addresses" ON public.addresses FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Users delete own addresses" ON public.addresses FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY "Users insert own addresses" ON public.addresses FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users update own addresses" ON public.addresses FOR UPDATE USING ((auth.uid() = user_id));
CREATE POLICY "Users view own addresses" ON public.addresses FOR SELECT USING ((auth.uid() = user_id));
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.blog_posts
-- ########################################################
CREATE TABLE public.blog_posts (
id uuid DEFAULT gen_random_uuid() NOT NULL,
slug text NOT NULL,
title text NOT NULL,
excerpt text,
content text,
cover_url text,
author_id uuid,
published boolean DEFAULT false NOT NULL,
published_at timestamp with time zone,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL,
category text DEFAULT 'Article'::text
);
ALTER TABLE ONLY public.blog_posts
ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.blog_posts
ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE ONLY public.blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE POLICY "Admins delete posts" ON public.blog_posts FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins insert posts" ON public.blog_posts FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update posts" ON public.blog_posts FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone view published posts" ON public.blog_posts FOR SELECT USING ((published OR (EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role))))));
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.categories
-- ########################################################
CREATE TABLE public.categories (
id uuid DEFAULT gen_random_uuid() NOT NULL,
slug text NOT NULL,
name text NOT NULL,
description text,
image_url text,
sort_order integer DEFAULT 0 NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.categories
ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories
ADD CONSTRAINT categories_slug_key UNIQUE (slug);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Admins manage categories delete" ON public.categories FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins manage categories insert" ON public.categories FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins manage categories update" ON public.categories FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone view categories" ON public.categories FOR SELECT USING (true);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.contact_submissions
-- ########################################################
CREATE TABLE public.contact_submissions (
id uuid DEFAULT gen_random_uuid() NOT NULL,
name text NOT NULL,
email text NOT NULL,
subject text,
message text NOT NULL,
status text DEFAULT 'new'::text NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.contact_submissions
ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);
CREATE TRIGGER trg_contact_touch BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Admins delete contact" ON public.contact_submissions FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update contact" ON public.contact_submissions FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins view contact" ON public.contact_submissions FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT TO authenticated, anon WITH CHECK (true);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.favorites
-- ########################################################
CREATE TABLE public.favorites (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id uuid NOT NULL,
product_id uuid NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.favorites
ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.favorites
ADD CONSTRAINT favorites_user_id_product_id_key UNIQUE (user_id, product_id);
ALTER TABLE ONLY public.favorites
ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.favorites
ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE POLICY "Users delete own favorites" ON public.favorites FOR DELETE USING ((auth.uid() = user_id));
CREATE POLICY "Users insert own favorites" ON public.favorites FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users view own favorites" ON public.favorites FOR SELECT USING ((auth.uid() = user_id));
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.order_items
-- ########################################################
CREATE TABLE public.order_items (
id uuid DEFAULT gen_random_uuid() NOT NULL,
order_id uuid NOT NULL,
product_id uuid,
product_name text NOT NULL,
unit_price numeric(10,2) NOT NULL,
quantity integer DEFAULT 1 NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.order_items
ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
CREATE TRIGGER trg_order_items_decrement_stock BEFORE INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.decrement_product_stock_for_order_item();
ALTER TABLE ONLY public.order_items
ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.order_items
ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
CREATE POLICY "Admins manage order items delete" ON public.order_items FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins manage order items update" ON public.order_items FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Users insert own order items" ON public.order_items FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.orders o
WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))));
CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.orders o
WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))));
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.orders
-- ########################################################
CREATE TABLE public.orders (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id uuid NOT NULL,
status text DEFAULT 'pending'::text NOT NULL,
total numeric(10,2) DEFAULT 0 NOT NULL,
shipping_address jsonb,
notes text,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
CREATE INDEX idx_orders_status ON public.orders USING btree (status);
CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE ONLY public.orders
ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING ((auth.uid() = user_id));
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.products
-- ########################################################
CREATE TABLE public.products (
id uuid DEFAULT gen_random_uuid() NOT NULL,
slug text NOT NULL,
name text NOT NULL,
description text,
price numeric(10,2) DEFAULT 0 NOT NULL,
compare_at_price numeric(10,2),
stock integer DEFAULT 0 NOT NULL,
category_id uuid,
image_url text,
images jsonb DEFAULT '[]'::jsonb NOT NULL,
is_active boolean DEFAULT true NOT NULL,
is_featured boolean DEFAULT false NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.products
ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.products
ADD CONSTRAINT products_slug_key UNIQUE (slug);
CREATE INDEX idx_products_active ON public.products USING btree (is_active);
CREATE INDEX idx_products_category ON public.products USING btree (category_id);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE ONLY public.products
ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
CREATE POLICY "Admins delete products" ON public.products FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins insert products" ON public.products FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone view active products" ON public.products FOR SELECT USING ((is_active OR (EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role))))));
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.profiles
-- ########################################################
CREATE TABLE public.profiles (
id uuid NOT NULL,
email text,
display_name text,
avatar_url text,
created_at timestamp with time zone DEFAULT now() NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL,
phone text,
address text
);
ALTER TABLE ONLY public.profiles
ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
ALTER TABLE ONLY public.profiles
ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT USING ((auth.uid() = id));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.site_pages
-- ########################################################
CREATE TABLE public.site_pages (
slug text NOT NULL,
title text DEFAULT ''::text NOT NULL,
content text DEFAULT ''::text NOT NULL,
meta jsonb DEFAULT '{}'::jsonb NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.site_pages
ADD CONSTRAINT site_pages_pkey PRIMARY KEY (slug);
CREATE TRIGGER trg_site_pages_updated BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Admins delete site pages" ON public.site_pages FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins insert site pages" ON public.site_pages FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update site pages" ON public.site_pages FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone view site pages" ON public.site_pages FOR SELECT USING (true);
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.site_settings
-- ########################################################
CREATE TABLE public.site_settings (
key text NOT NULL,
value jsonb DEFAULT '{}'::jsonb NOT NULL,
updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.site_settings
ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);
CREATE TRIGGER touch_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE POLICY "Admins delete site settings" ON public.site_settings FOR DELETE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins insert site settings" ON public.site_settings FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Admins update site settings" ON public.site_settings FOR UPDATE USING ((EXISTS ( SELECT 1
FROM public.user_roles ur
WHERE ((ur.user_id = auth.uid()) AND (ur.role = 'admin'::public.app_role)))));
CREATE POLICY "Anyone view site settings" ON public.site_settings FOR SELECT USING (true);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- Table: public.user_roles
-- ########################################################
CREATE TABLE public.user_roles (
id uuid DEFAULT gen_random_uuid() NOT NULL,
user_id uuid NOT NULL,
role public.app_role NOT NULL,
created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.user_roles
ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles
ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
ALTER TABLE ONLY public.user_roles
ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Functions
CREATE OR REPLACE FUNCTION public.decrement_product_stock_for_order_item();
CREATE OR REPLACE FUNCTION public.place_order(_items jsonb, _shipping_address jsonb DEFAULT NULL::jsonb, _notes text DEFAULT NULL::text);
CREATE OR REPLACE FUNCTION public.handle_new_user();
CREATE OR REPLACE FUNCTION public.touch_updated_at();
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role);
CREATE OR REPLACE FUNCTION public.handle_new_user_role();

-- Row Level Security & Policies

-- Policies for addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for site_pages
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
GRANT SELECT ON public.addresses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
GRANT SELECT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
GRANT SELECT ON public.favorites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
GRANT SELECT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;
GRANT SELECT ON public.site_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT SELECT ON public.user_roles TO anon;