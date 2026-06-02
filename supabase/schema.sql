-- Supabase schema for GamesGauges
-- Run this in the Supabase SQL editor.

-- Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Users profile table
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  bio text,
  created_at timestamptz not null default now()
);

-- Games
create table if not exists public.juegos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  desarrollador text,
  año_lanzamiento int,
  descripcion text,
  cover_url text,
  created_at timestamptz not null default now()
);

-- Genres
create table if not exists public.generos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

-- Game-genre join
create table if not exists public.juego_genero (
  juego_id uuid not null references public.juegos(id) on delete cascade,
  genero_id uuid not null references public.generos(id) on delete cascade,
  primary key (juego_id, genero_id)
);

-- Reviews
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  juego_id uuid not null references public.juegos(id) on delete cascade,
  calificacion text not null,
  comentario text not null,
  created_at timestamptz not null default now()
);

-- Optional constraint to keep ratings consistent with UI values
alter table public.resenas
  add constraint resenas_calificacion_check
  check (calificacion in (
    'Obra maestra',
    'Muy recomendable',
    'Entretenido pero mejorable',
    'Solo para fans',
    'No lo recomiendo'
  ));

-- Search helpers
create index if not exists usuarios_nombre_trgm_idx on public.usuarios using gin (nombre gin_trgm_ops);
create index if not exists juegos_nombre_trgm_idx on public.juegos using gin (nombre gin_trgm_ops);

-- Row Level Security
alter table public.usuarios enable row level security;
alter table public.juegos enable row level security;
alter table public.generos enable row level security;
alter table public.juego_genero enable row level security;
alter table public.resenas enable row level security;

-- Policies: usuarios
create policy "usuarios_select_all" on public.usuarios
  for select using (true);

create policy "usuarios_insert_self" on public.usuarios
  for insert with check (auth.uid() = id);

create policy "usuarios_update_self" on public.usuarios
  for update using (auth.uid() = id);

-- Policies: juegos, generos, juego_genero (public read)
create policy "juegos_select_all" on public.juegos
  for select using (true);

create policy "generos_select_all" on public.generos
  for select using (true);

create policy "juego_genero_select_all" on public.juego_genero
  for select using (true);

-- Policies: resenas
create policy "resenas_select_all" on public.resenas
  for select using (true);

create policy "resenas_insert_authenticated" on public.resenas
  for insert with check (auth.uid() = usuario_id);

create policy "resenas_delete_own" on public.resenas
  for delete using (auth.uid() = usuario_id);
