alter table public.orders
  add column if not exists discount_code_id uuid references public.discount_codes(id) on delete set null,
  add column if not exists discount_value numeric(12,2),
  add column if not exists discount_type text check (discount_type in ('percentage', 'amount')),
  add column if not exists discount_amount numeric(12,2) default 0,
  add column if not exists original_total numeric(12,2);

create index if not exists orders_discount_code_idx on public.orders(discount_code_id);
