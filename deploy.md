# deploy.md — Pemasangan, Pemeliharaan, dan Pencadangan

## 1. Frontend (aplikasi) — Vercel
- Alamat aplikasi: **https://azkiah-safira-pythagoras.vercel.app** (proyek Vercel `penerapan-pythagoras`, preset Vite, Root Directory `./`).
- Setiap `git push` ke branch `main` otomatis di-build Vercel (`npm run build` → `dist/`). Workflow
  [.github/workflows/periksa.yml](.github/workflows/periksa.yml) hanya memeriksa lint & build di GitHub.
- Bukti percakapan AI: https://azkiah-safira-pythagoras.vercel.app/bukti-ai/
- Domain diatur di Vercel → proyek `penerapan-pythagoras` → Settings → Domains (`azkiah-safira-pythagoras.vercel.app`, Production).
- **Link lama yang sudah dimatikan** (semua halaman membalas **404**):
  - `azkiahsafira.github.io/project-uas-penerapan-pythagoras-2225250013/` — branch `gh-pages` hanya berisi `404.html` dan
    `sw.js` "pemati";
  - `penerapan-pythagoras.vercel.app` — diatur di [vercel.json](vercel.json) (`routes` dengan `has` host).
  - `sw.js` pemati ([public/sw-mati.js](public/sw-mati.js)) menghapus salinan aplikasi (cache + service worker) di HP/laptop
    yang pernah membuka link lama, sehingga yang tampil benar-benar 404.
- Variabel build: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (publishable key, aman publik) di file `.env`.
- Service worker (`public/sw.js`) selalu mengecek versi terbaru; naikkan `VERSI` bila strategi cache berubah.
- Bila tampilan belum berubah setelah push: tunggu 1–3 menit, lalu **Ctrl + Shift + R** (laptop) atau tutup-buka aplikasi (HP).
- Sejak cache `pythagoras-v4`, aplikasi mengecek versi baru setiap dibuka lagi (dan tiap 15 menit) lalu menampilkan tombol
  **"Perbarui sekarang"** di atas layar (tidak muncul saat tes).

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
6. Isi `VITE_API_URL` di `.env` dengan alamat itu lalu push, agar aplikasi memakai backend. Alamat aplikasi harus ada di daftar
   CORS backend (`ASAL` di `backend/main.py`, saat ini `https://azkiah-safira-pythagoras.vercel.app`).
7. Setiap push ke `main` otomatis memperbarui backend di Vercel.

Alternatif bila memiliki kartu: Render (berkas [render.yaml](render.yaml) tetap tersedia).

## 4. Sebelum penelitian dimulai (checklist)
- [x] Daftarkan kode siswa: `8A-01` s.d. `8F-36` (216 kode, kelompok "Belajar dengan aplikasi"); kode uji `8Z-99` sudah dinonaktifkan.
  Siswa boleh mengetik `8a-1`; aplikasi & backend merapikannya menjadi `8A-01`.
- [ ] **Aktifkan kode siswa yang dipakai.** Semua kode sengaja dinonaktifkan (10 November 2026) karena hanya 1 siswa yang
  belajar lewat aplikasi. Sebelum pertemuan 1, jalankan di Supabase → SQL Editor (ganti kodenya):
  ```sql
  update public.siswa set aktif = true where kode = '8A-01';
  select kode, aktif from public.siswa where aktif;
  ```
  Kode lain tetap nonaktif sehingga orang lain tidak bisa masuk walau menebak kode.
- **Demo ke dosen tanpa mengikuti urutan pertemuan:** aktifkan kode `8Z-99` (kelompok `Uji coba peneliti`) dengan
  `update public.siswa set aktif = true where kode = '8Z-99';`. Kode ini tidak dikunci dan datanya tidak ikut dianalisis;
  nonaktifkan lagi sesudah demo.
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
| Versi aplikasi bermasalah | `git revert <commit>` lalu push, atau Vercel → Deployments → **Promote** versi sebelumnya |
