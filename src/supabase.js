// Koneksi ke database Supabase.
//
// URL dan anon key dibaca dari environment variable saat build:
//   VITE_SUPABASE_URL      contoh: https://abcdefgh.supabase.co
//   VITE_SUPABASE_ANON_KEY kunci "anon" / "publishable" dari Supabase
// Nilainya ada di file .env (ikut di-commit, dipakai juga saat build di GitHub Actions).
//
// Anon key memang dirancang untuk dipakai di aplikasi web (bukan rahasia);
// keamanan data dijaga oleh aturan Row Level Security di supabase/schema.sql,
// yang hanya mengizinkan aplikasi MENAMBAH data, tidak membaca/mengubah/menghapus.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const kunci = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && kunci ? createClient(url, kunci, { auth: { persistSession: false } }) : null

export const supabaseAktif = supabase !== null
