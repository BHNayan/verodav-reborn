-- Replace admin role policies so the app no longer needs direct access to has_role()
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins delete roles" ON public.user_roles;

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins manage categories insert" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories update" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories delete" ON public.categories;
CREATE POLICY "Admins manage categories insert" ON public.categories
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins manage categories update" ON public.categories
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins manage categories delete" ON public.categories
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Anyone view active products" ON public.products;
DROP POLICY IF EXISTS "Admins insert products" ON public.products;
DROP POLICY IF EXISTS "Admins update products" ON public.products;
DROP POLICY IF EXISTS "Admins delete products" ON public.products;
CREATE POLICY "Anyone view active products" ON public.products
FOR SELECT USING (
  is_active OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins insert products" ON public.products
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins update products" ON public.products
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins delete products" ON public.products
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins view all addresses" ON public.addresses;
CREATE POLICY "Admins view all addresses" ON public.addresses
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins view all orders" ON public.orders
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins update orders" ON public.orders
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins delete orders" ON public.orders
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins manage order items update" ON public.order_items;
DROP POLICY IF EXISTS "Admins manage order items delete" ON public.order_items;
CREATE POLICY "Admins view all order items" ON public.order_items
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins manage order items update" ON public.order_items
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins manage order items delete" ON public.order_items
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Anyone view published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins delete posts" ON public.blog_posts;
CREATE POLICY "Anyone view published posts" ON public.blog_posts
FOR SELECT USING (
  published OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins insert posts" ON public.blog_posts
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins update posts" ON public.blog_posts
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins delete posts" ON public.blog_posts
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins insert site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins update site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins delete site pages" ON public.site_pages;
CREATE POLICY "Admins insert site pages" ON public.site_pages
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins update site pages" ON public.site_pages
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins delete site pages" ON public.site_pages
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins delete site settings" ON public.site_settings;
CREATE POLICY "Admins insert site settings" ON public.site_settings
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins update site settings" ON public.site_settings
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);
CREATE POLICY "Admins delete site settings" ON public.site_settings
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role)
);

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Move stock decrementing into a backend trigger so place_order does not need elevated callable privileges.
CREATE OR REPLACE FUNCTION public.decrement_product_stock_for_order_item()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _product record;
BEGIN
  IF NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  IF NEW.product_id IS NULL THEN
    RAISE EXCEPTION 'Product required';
  END IF;

  SELECT id, name, price, stock, is_active INTO _product
  FROM public.products
  WHERE id = NEW.product_id
  FOR UPDATE;

  IF NOT FOUND OR NOT _product.is_active THEN
    RAISE EXCEPTION 'Product unavailable';
  END IF;

  IF _product.stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for %', _product.name;
  END IF;

  NEW.product_name := _product.name;
  NEW.unit_price := _product.price;

  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = _product.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_items_decrement_stock ON public.order_items;
CREATE TRIGGER trg_order_items_decrement_stock
BEFORE INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_product_stock_for_order_item();

REVOKE ALL ON FUNCTION public.decrement_product_stock_for_order_item() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.place_order(_items jsonb, _shipping_address jsonb DEFAULT NULL::jsonb, _notes text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _order_id uuid;
  _total numeric := 0;
  _item jsonb;
  _product record;
  _qty int;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := COALESCE((_item->>'qty')::int, 0);
    IF _qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    SELECT id, name, price, stock, is_active INTO _product
    FROM public.products
    WHERE id = (_item->>'id')::uuid;

    IF NOT FOUND OR NOT _product.is_active THEN
      RAISE EXCEPTION 'Product unavailable: %', _item->>'id';
    END IF;

    IF _product.stock < _qty THEN
      RAISE EXCEPTION 'Insufficient stock for %', _product.name;
    END IF;

    _total := _total + (_product.price * _qty);
  END LOOP;

  INSERT INTO public.orders (user_id, status, total, shipping_address, notes)
  VALUES (_uid, 'pending', _total, _shipping_address, _notes)
  RETURNING id INTO _order_id;

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_item->>'qty')::int;

    SELECT id, name, price INTO _product
    FROM public.products
    WHERE id = (_item->>'id')::uuid;

    INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity)
    VALUES (_order_id, _product.id, _product.name, _product.price, _qty);
  END LOOP;

  RETURN _order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(jsonb, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, jsonb, text) TO authenticated;