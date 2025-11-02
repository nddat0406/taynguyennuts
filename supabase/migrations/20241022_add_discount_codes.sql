create extension if not exists "pgcrypto";

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  value numeric(5,2) not null check (value > 0 and value <= 100),
  start_date timestamptz not null,
  end_date timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint discount_codes_code_is_upper check (code = upper(code)),
  constraint discount_codes_dates_valid check (end_date >= start_date)
);

create table if not exists public.discount_code_products (
  discount_code_id uuid not null references public.discount_codes(id) on delete cascade,
  product_id integer not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (discount_code_id, product_id)
);

create index if not exists discount_codes_is_active_idx on public.discount_codes (is_active);
create index if not exists discount_code_products_product_idx on public.discount_code_products (product_id);
