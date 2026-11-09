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

-- ===========================================================================
-- Tabel aktivitas: catatan proses belajar siswa di menu Belajar
-- (lama waktu & jumlah salah tiap langkah, serta total waktu tiap sesi).
-- ===========================================================================
create table if not exists public.aktivitas (
  id            text primary key,              -- dibuat oleh aplikasi
  jenis         text not null check (jenis in ('langkah', 'sesi')),
  nama          text not null,
  kelas         text not null,
  sekolah       text not null,
  kelompok      text not null,
  sesi          integer not null,              -- nomor sesi (1-3)
  langkah       integer,                        -- nomor langkah (kosong untuk jenis 'sesi')
  judul         text not null,                  -- judul langkah / judul sesi
  mulai         timestamptz not null,
  selesai       timestamptz not null,
  durasi_detik  integer not null,
  salah         integer not null default 0,     -- berapa kali menjawab salah
  hasil         text,                           -- 'benar' | 'dibuka' (2x salah) | 'selesai' | 'keluar'
  dibuat        timestamptz not null default now()
);

alter table public.aktivitas enable row level security;

drop policy if exists "aplikasi boleh menambah aktivitas" on public.aktivitas;
create policy "aplikasi boleh menambah aktivitas"
  on public.aktivitas
  for insert
  to anon
  with check (true);

grant insert on public.aktivitas to anon;

-- Kolom tambahan: berapa kali siswa menekan tombol "Bacakan" di sebuah langkah
alter table public.aktivitas add column if not exists dibacakan integer not null default 0;

-- Pertemuan 4 (implementasi): setiap soal di menu Latihan dicatat sebagai jenis 'latihan'
-- (sesi = 4, langkah = nomor soal, judul = teks soal, hasil = 'benar' | 'salah' | 'menyerah')
alter table public.aktivitas drop constraint if exists aktivitas_jenis_check;
alter table public.aktivitas add constraint aktivitas_jenis_check
  check (jenis in ('langkah', 'sesi', 'latihan'));

-- Versi 2 (fitur temuan wawancara): cek prasyarat & refleksi ikut dicatat, ditambah
-- jumlah petunjuk bertingkat yang dibuka dan catatan singkat (rincian bantuan / jawaban refleksi)
alter table public.aktivitas add column if not exists petunjuk integer not null default 0;
alter table public.aktivitas add column if not exists catatan text;
alter table public.aktivitas drop constraint if exists aktivitas_jenis_check;
alter table public.aktivitas add constraint aktivitas_jenis_check
  check (jenis in ('langkah', 'sesi', 'latihan', 'prasyarat', 'refleksi'));

-- ===========================================================================
-- Versi 2: tabel kode siswa untuk login (dibaca/ditulis hanya oleh backend FastAPI
-- dengan service key; peran anon TIDAK punya akses). Kode = kelas + nomor absen.
-- ===========================================================================
create table if not exists public.siswa (
  kode      text primary key check (kode ~ '^[0-9]{1,2}[A-Z]?-[0-9]{1,3}$'),
  kelas     text not null default '8',
  kelompok  text not null default 'Belajar dengan aplikasi',
  aktif     boolean not null default true,
  dibuat    timestamptz not null default now()
);
alter table public.siswa enable row level security;

-- Contoh mendaftarkan kode (jalankan sendiri, sesuaikan dengan daftar absen):
-- insert into public.siswa (kode) values ('8A-01'), ('8A-02'), ('8A-03');
-- Menonaktifkan kode setelah penelitian:
-- update public.siswa set aktif = false;
