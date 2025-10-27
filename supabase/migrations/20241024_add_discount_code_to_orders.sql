alter table public.orders
  add column if not exists discount_code text;
