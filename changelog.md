# changelog.md — Riwayat Perubahan

Format: tanggal · versi · perubahan utama. Rincian lengkap ada di riwayat commit GitHub.

## [2.3.1] · 10 November 2026
- Pemberitahuan **"Versi baru aplikasi sudah tersedia → Perbarui sekarang"** untuk aplikasi yang di-install di HP; cache service worker v4.

## [2.3] · 10 November 2026 — Soal disamakan dengan materi PDF
- Belajar mengikuti urutan & contoh PDF: kuadrat → akar → tabel kuadrat → segitiga siku-siku → sisi miring pada segitiga diputar;
  memilih rumus; Strategi 5 Langkah; panjang tangga 3–4–5, layang-layang 20–21–29, jarak terpendek 15–20–25, diagonal layar 21–28–35, tripel Pythagoras.
- Latihan berjenjang (angka → gambar → cerita) dengan konteks PDF; tripel yang sama dengan pre/post-test tidak dipakai lagi.
- Contoh Kalkulator = Contoh 1–3 PDF + diagonal layar. Pre-test/post-test tidak diubah (sudah sesuai indikator materi).

## [2.2] · 10 November 2026 — Aplikasi tersambung ke backend Python
- Kode siswa `8A-01` s.d. `8F-36` (216 kode) didaftarkan di tabel `siswa`; hanya kode terdaftar yang bisa masuk.
- Aplikasi memakai backend FastAPI di Vercel (`VITE_API_URL`): login dicek server, nilai tes dihitung di server.
- Kode dirapikan otomatis: `8a-1` → `8A-01`.
- Dokumen diselaraskan (backend Vercel), 24 screenshot, bukti percakapan AI diperbarui.

## [2.1] · 10 November 2026 — Fitur dari temuan wawancara
- **Cek prasyarat** kuadrat & akar (4 soal) sebelum Sesi 1; skor < 3 diarahkan ke bagian kuadrat & akar Sesi 1 (IL3).
- Latihan per soal: **1) Diketahui & Ditanya** (ketuk angka di soal, tentukan sisinya) → **2) tunjuk sisi miring** pada segitiga
  yang diputar/dicerminkan → **3) hitung** (EL1, IL1, IL2).
- **Petunjuk bertingkat** 5 tahap; bantuan **memudar** setelah 3 soal benar tanpa bantuan dan muncul lagi bila salah (GL3).
- **Cek kewajaran** sebelum jawaban dinilai (sisi miring harus terpanjang) + kalimat kewajaran di pembahasan (GL2).
- **Refleksi "Mengapa…?"** setiap soal ke-3, dengan alasan tertulis opsional (GL4).
- Data baru di tabel `aktivitas`: kolom `petunjuk` & `catatan`, jenis `prasyarat` & `refleksi`; analisis Python menampilkan
  petunjuk per soal (soal 1–5 vs 6+), refleksi benar, dan skor prasyarat. Animasi tidak diubah.

## [2.0] · 9 November 2026 — Coding (Langkah 4)
- **Backend Python + FastAPI** (`backend/`): masuk dengan kode siswa (token HMAC, batas percobaan), penilaian pre/post-test & Leppink di server,
  simpan hasil & aktivitas (kirim ulang aman), soal latihan berjenjang, rekap & ekspor CSV peneliti; 14 pengujian pytest; `render.yaml`.
- **React**: login **kode siswa** (`8A-07`) menggantikan nama + sekolah di menu Belajar, Latihan, dan Tes; penghubung API dengan cadangan ke Supabase langsung.
- **three.js**: ilustrasi 3D tangga–dinding yang bisa diputar, dengan segitiga siku-siku & label (biru = diketahui, merah muda = dicari); dimuat hanya saat dibuka.
- Tabel `siswa` di `supabase/schema.sql` untuk daftar kode siswa.
- Backend terpasang di **Vercel**: https://pythagoras-api.vercel.app (Render kini meminta kartu pembayaran untuk paket gratis).

## [2.0-rancangan] · 9 November 2026 — Revisi dosen
- Dokumen perancangan: prd, readme, agents, architecture, task, design, api.
- Wawancara kebutuhan Android (AI → pengembang): kuota HP siswa, PWA, kode siswa kelas + absen, 3D tangga–dinding, backend Render, animasi dipertahankan.
- Materi ajar PDF bab Teorema Pythagoras, subbab Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah (11 halaman).
- Dokumen tambahan: testing, deploy, privasi, konten, panduan, changelog.
- Musik latar ceria dengan tombol nyala/mati (mengecil saat Bacakan, berhenti saat tes).

## [1.3] · 8 November 2026 — Penyempurnaan tampilan & instrumen
- Latihan menjadi **Pertemuan 4 (implementasi)**, tercatat ke database.
- Layar perayaan penuh saat benar, pesan semangat saat salah.
- Header halaman sekolah (gedung SMP, Siku, Raka, Nisa berdiri di rumput, bus sekolah), balon kata di atas karakter yang bicara.
- Latar belakang **Bawah Laut** di semua menu; hewan laut bisa diklik; kotak tembus pandang.
- Lembar tes cetak + input jawaban kertas di analisis Python; pilihan kelompok "Diajar langsung" dihapus dari aplikasi.
- Screenshot & bukti percakapan AI diperbarui; bukti AI bisa dibuka sebagai halaman web.

## [1.2] · 7 November 2026 — Tampilan & PWA
- Tema biru muda + pink, maskot Siku, siswa Raka & siswi Nisa, hewan, pelangi, prisma 3D.
- PWA: bisa di-install dan dipakai offline.
- Tombol **Bacakan** (narasi suara), pencatatan aktivitas belajar.
- Workflow agar Supabase tidak dijeda; kelas hanya Kelas 8.

## [1.1] · 7 November 2026 — Penelitian
- Materi 3 sesi berbasis teori beban kognitif.
- Pre-test, post-test, kuesioner Leppink; penyimpanan ke Supabase.
- Script Python analisis (N-gain, Leppink).

## [1.0] · 7 November 2026 — Awal
- Kalkulator teorema Pythagoras dengan langkah penyelesaian, latihan soal, README, deploy GitHub Pages.
