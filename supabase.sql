-- Create products table
-- Enable extensions for UUID generation
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  price bigint not null,
  compare_price bigint,
  images jsonb default '[]'::jsonb,
  sizes jsonb default '[]'::jsonb,
  colors jsonb default '[]'::jsonb,
  fabric text,
  stock integer default 0,
  featured boolean default false,
  category_id uuid,
  category_name text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  items jsonb not null,
  total bigint not null,
  status text not null default 'pending',
  fulfillment text default 'unfulfilled',
  shipping jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security for products and allow public read
alter table public.products enable row level security;
create policy "public can read products"
  on public.products
  for select to anon
  using (true);

-- Example insert (modify as needed)
insert into public.products (name, slug, description, price, images, sizes, category_name, featured, stock)
values (
  'Sample Gown',
  'sample-gown',
  'A sample product added by migration.',
  150000,
  '[]'::jsonb,
  '[]'::jsonb,
  'LE LUXE',
  true,
  10
)
on conflict do nothing;
-- Seed sample products (replace image URLs with your hosted images)
insert into public.products (name, slug, description, price, images, sizes, colors, category_name, featured, stock)
values
(
  'Midnight Elegance Gown',
  'midnight-elegance-gown',
  'A stunning navy blue evening gown with intricate gold embroidery.',
  185000,
  to_jsonb(array['https://via.placeholder.com/600x800?text=Midnight+Elegance']),
  to_jsonb(array['XS','S','M','L','XL']),
  to_jsonb(array['Navy','Gold']),
  'LE LUXE',
  true,
  5
),
(
  'Champagne Dreams Dress',
  'champagne-dreams-dress',
  'An ethereal champagne-colored gown with a romantic slit and delicate straps.',
  165000,
  to_jsonb(array['https://via.placeholder.com/600x800?text=Champagne+Dreams']),
  to_jsonb(array['XS','S','M','L']),
  to_jsonb(array['Champagne']),
  'LE LUXE',
  true,
  8
),
(
  'Noir Sophisticate Gown',
  'noir-sophisticate-gown',
  'A timeless black evening gown with a sweetheart neckline and gold waist accent.',
  195000,
  to_jsonb(array['https://via.placeholder.com/600x800?text=Noir+Sophisticate']),
  to_jsonb(array['S','M','L','XL']),
  to_jsonb(array['Black','Gold']),
  'LE LUXE',
  true,
  3
),
(
  'Rose Petal Romance Gown',
  'rose-petal-romance-gown',
  'A romantic blush pink gown with delicate pleating and a beaded waist detail.',
  155000,
  to_jsonb(array['https://via.placeholder.com/600x800?text=Rose+Petal+Romance']),
  to_jsonb(array['XS','S','M','L']),
  to_jsonb(array['Pink']),
  'LE LUXE',
  true,
  6
)
on conflict do nothing;

-- Insert a sample order for testing (items reference product slugs and quantity)
insert into public.orders (user_id, items, total, status, fulfillment, shipping)
values (
  null,
  '[{"product_slug":"midnight-elegance-gown","name":"Midnight Elegance Gown","price":185000,"quantity":1}]'::jsonb,
  185000,
  'pending',
  'unfulfilled',
  '{"address":"123 Demo Street","city":"Lagos","country":"NG"}'::jsonb
)
on conflict do nothing;
