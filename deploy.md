# deploy.md — Pemasangan, Pemeliharaan, dan Pencadangan

## 1. Frontend (aplikasi) — GitHub Pages
- Setiap `git push` ke branch `main` menjalankan workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
  `npm ci` → `npm run build` → hasil `dist/` dipasang ke branch `gh-pages`.
- Alamat: https://azkiahsafira.github.io/project-uas-penerapan-pythagoras-2225250013/
- Variabel build: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key, aman publik) di file `.env`.
- Service worker (`public/sw.js`) selalu mengecek versi terbaru; naikkan `VERSI` bila strategi cache berubah.
- Bila tampilan belum berubah setelah push: tunggu 1–3 menit, lalu **Ctrl + Shift + R** (laptop) atau tutup-buka aplikasi (HP).

## 2. Basis data — Supabase
| Hal | Keterangan |
| --- | --- |
| Proyek | `penelitian-pythagoras` (https://supabase.com/dashboard/project/hjhltqqwwzbbgkpwzcxx) |
| Skema | jalankan [supabase/schema.sql](supabase/schema.sql) di SQL Editor (aman dijalankan ulang) |
| Keamanan | RLS aktif; peran `anon` hanya boleh **menambah** baris (tidak bisa membaca/mengubah/menghapus) |
| Tetap aktif | workflow [supabase-aktif.yml](.github/workflows/supabase-aktif.yml) menyapa database setiap 3 hari |
| Rahasia | password database & service key **tidak** disimpan di repo atau dibagikan ke siapa pun |

## 3. Backend Python — Vercel (FastAPI serverless, gratis tanpa kartu)
> Render sempat dicoba, tetapi kini meminta kartu pembayaran bahkan untuk paket gratis, jadi backend dipasang di **Vercel**.
1. Daftar di https://vercel.com/signup dengan **GitHub** (dilakukan sendiri oleh pemilik proyek).
2. **Add New → Project** → impor repo `project-uas-penerapan-pythagoras-2225250013` (izinkan Vercel membaca repo ini).
   Vercel mendeteksi dua aplikasi; pilih **backend (FastAPI)** → *Import single project* (Root Directory = `backend`).
3. Vercel menjalankan `backend/main.py` (FastAPI) dengan dependensi dari `backend/requirements.txt`; rute tetap `/api/...`.
4. **Environment Variables**: `SUPABASE_URL` = `https://hjhltqqwwzbbgkpwzcxx.supabase.co`, dan `SUPABASE_SERVICE_KEY` = kunci `sb_secret_...`
   (**diisi sendiri**, jangan dibagikan). Opsional: `KUNCI_PENELITI` untuk endpoint rekap peneliti.
5. Deploy → alamat backend: **https://pythagoras-api.vercel.app** (proyek Vercel `pythagoras-api`); cek https://pythagoras-api.vercel.app/api/sehat.
6. Isi `VITE_API_URL` di `.env` dengan alamat itu lalu push, agar aplikasi di GitHub Pages memakai backend.
7. Setiap push ke `main` otomatis memperbarui backend di Vercel.

Alternatif bila memiliki kartu: Render (berkas [render.yaml](render.yaml) tetap tersedia).

## 4. Sebelum penelitian dimulai (checklist)
- [ ] Daftarkan kode siswa (kelas + nomor absen, mis. `8A-07`); kode uji `8Z-99` sudah dinonaktifkan
- [ ] Hapus semua data uji di tabel `hasil` dan `aktivitas`; pastikan **0 baris**
- [ ] Di HP/laptop yang dipakai mencoba: klik "Ganti nama" / keluar dari kode uji
- [ ] Coba buka aplikasi di 1 HP siswa: bisa di-install, materi terbuka, tidak ada geser ke samping
- [ ] Cetak lembar tes untuk siswa yang diajar langsung (`docs/instrumen-cetak/`)

## 5. Pencadangan data
- Setelah **setiap pertemuan**: Supabase → Table Editor → `hasil` & `aktivitas` → **Export to CSV**.
- Simpan di laptop + Google Drive pribadi (bukan di repo publik); nama file berisi tanggal, mis. `hasil_2026-11-17.csv`.
- Data asli siswa tidak boleh di-commit (sudah diatur `.gitignore` untuk `analisis/*.csv`).

## 6. Pemulihan
| Masalah | Tindakan |
| --- | --- |
| Supabase dijeda | Dashboard → **Restore project** (data tetap aman) |
| Data siswa tidak terkirim | data aman di HP siswa; buka aplikasi saat online, atau unduh CSV dari menu Tes |
| Versi aplikasi bermasalah | `git revert <commit>` lalu push; GitHub Pages memasang versi sebelumnya |
