-- Skema database penelitian "Penerapan Teorema Pythagoras".
-- Jalankan sekali di Supabase → SQL Editor → New query → Run.

create table if not exists public.hasil (
  id            text primary key,              -- dibuat oleh aplikasi
  jenis         text not null check (jenis in ('pretest', 'posttest', 'leppink')),
  nama          text not null,
  kelas         text not null,
  sekolah       text not null,
  kelompok      text not null,
  mulai         timestamptz not null,
  selesai       timestamptz not null,
  durasi_detik  integer not null,
  benar         integer,                        -- pre/post-test
  total         integer,                        -- pre/post-test
  skor          integer,                        -- pre/post-test, 0-100
  il            numeric,                        -- kuesioner: rata-rata intrinsic load
  el            numeric,                        -- kuesioner: rata-rata extraneous load
  gl            numeric,                        -- kuesioner: rata-rata germane load
  jawaban       jsonb not null,                 -- jawaban per nomor/butir
  dibuat        timestamptz not null default now()
);

-- Row Level Security: tanpa policy, tabel tertutup untuk semua akses dari aplikasi.
alter table public.hasil enable row level security;

-- Aplikasi (role anon) hanya boleh MENAMBAH baris baru.
-- Membaca, mengubah, dan menghapus data hanya bisa dilakukan peneliti
-- lewat dashboard Supabase (Table Editor).
drop policy if exists "aplikasi boleh menambah hasil" on public.hasil;
create policy "aplikasi boleh menambah hasil"
  on public.hasil
  for insert
  to anon
  with check (true);

-- Pastikan role anon punya hak INSERT (beberapa proyek baru tidak memberikannya otomatis).
grant insert on public.hasil to anon;
