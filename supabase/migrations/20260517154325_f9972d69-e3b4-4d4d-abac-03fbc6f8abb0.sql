CREATE OR REPLACE FUNCTION public.place_order(
  _items jsonb,
  _shipping_address jsonb DEFAULT NULL,
  _notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Validate stock and compute total using current DB prices
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := COALESCE((_item->>'qty')::int, 0);
    IF _qty <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    SELECT id, name, price, stock, is_active INTO _product
    FROM public.products
    WHERE id = (_item->>'id')::uuid
    FOR UPDATE;

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

    UPDATE public.products
    SET stock = stock - _qty
    WHERE id = _product.id;
  END LOOP;

  RETURN _order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(jsonb, jsonb, text) FROM public;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, jsonb, text) TO authenticated;