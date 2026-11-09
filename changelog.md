# changelog.md — Riwayat Perubahan

Format: tanggal · versi · perubahan utama. Rincian lengkap ada di riwayat commit GitHub.

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
