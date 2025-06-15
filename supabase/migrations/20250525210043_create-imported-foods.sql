create table foods (
  "id" uuid primary key default uuid_generate_v4(),
  "description" text not null,
  "calories" numeric not null,
  "protein" numeric not null,
  "carbs" numeric not null,
  "fat" numeric not null,
  "fibers" numeric not null,
  "baseQuantity" numeric,     
  "baseUnit" text,            
  "micros" jsonb,     
  "updatedAt" timestamp with time zone default now()
);

-- Índice opcional para facilitar buscas por nome
create index idx_foods_description on foods using gin (to_tsvector('portuguese', description));

alter table foods enable row level security;

create policy "Allow authenticated users to read foods"
  on foods
  for select
  using (
    auth.role() = 'authenticated'
  );

create policy "Allow authenticated users to insert foods"
  on foods
  for insert
  with check (
    auth.role() = 'authenticated'
  );

create policy "Allow authenticated users to update foods"
  on foods
  for update
  using (
    auth.role() = 'authenticated'
  )
  with check (
    auth.role() = 'authenticated'
  );

create policy "Only admins/editors can delete"
  on foods
  for delete
  using (
    auth.role() in ('admin', 'editor')
  );

create policy "Allow authenticated users to delete foods"
  on foods
  for delete
  using (
    auth.role() = 'authenticated'
  );