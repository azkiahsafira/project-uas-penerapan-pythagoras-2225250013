# panduan.md — Panduan Penggunaan

Alamat aplikasi: **https://azkiahsafira.github.io/project-uas-penerapan-pythagoras-2225250013/**

## A. Untuk siswa

### 1. Memasang di HP Android
1. Buka alamat di atas dengan **Chrome**.
2. Ketuk tombol **"Install aplikasi"** di bagian atas (atau menu ⋮ → *Tambahkan ke layar utama*).
3. Ikon **Siku** muncul di layar HP. Setelah dibuka sekali, aplikasi bisa dipakai **tanpa internet**.

### 2. Memakai aplikasi
| Menu | Isi | Tips |
| --- | --- | --- |
| **Belajar** | Sesi 1 → 2 → 3, berurutan | Jawab pertanyaan kecil di tiap langkah; tekan 🔊 **Bacakan** bila ingin mendengar |
| **Kalkulator** | Hitung sisi miring/alas/tinggi + langkahnya | Untuk memeriksa hitunganmu |
| **Latihan Soal** | Pertemuan 4, minimal 10 soal | Baca pembahasan setelah menjawab |
| **Tes** | Pre-test, post-test, kuesioner | Kerjakan sendiri; menu lain terkunci selama tes |

- Tombol **✨ Animasi** dan **🎵 Musik** ada di bawah/pojok layar; bisa dimatikan kapan saja.
- Ketuk **Siku, Raka, Nisa**, atau hewan laut untuk mendengar sapaan mereka.
- Kalau salah, tidak apa-apa: baca petunjuknya, lalu coba lagi.

## B. Untuk peneliti / guru

### 1. Alur 5 pertemuan
| Pertemuan | Kelompok aplikasi | Kelompok diajar langsung |
| --- | --- | --- |
| 1 | Tes → Pre-test, lalu Belajar → Sesi 1 | Lembar pre-test cetak, lalu pembelajaran langsung |
| 2 | Belajar → Sesi 2 | pembelajaran langsung |
| 3 | Belajar → Sesi 3 | pembelajaran langsung |
| 4 | Latihan Soal (implementasi) | latihan langsung |
| 5 | Tes → Post-test, lalu Kuesioner | lembar post-test & kuesioner cetak |

### 2. Sebelum mulai
Ikuti checklist di [deploy.md](deploy.md) bagian 4 (hapus data uji, siapkan kode siswa, cetak lembar).

### 3. Melihat & mengunduh data
1. Buka https://supabase.com/dashboard/project/hjhltqqwwzbbgkpwzcxx → **Table Editor**.
2. Tabel `hasil` (tes & kuesioner) dan `aktivitas` (proses belajar) → **Export to CSV**.

### 4. Analisis
```bash
cd analisis
python analisis.py data.csv --aktivitas aktivitas.csv --kertas data_kertas.csv
```
Hasil: nilai pre/post, N-gain, ketercapaian indikator, skor IL/EL/GL, perbandingan kelompok, jejak belajar, grafik SVG.
Jawaban lembar kertas diketik ke `data_kertas.csv` (lihat [analisis/README.md](analisis/README.md)).

## C. Masalah yang sering terjadi
| Masalah | Solusi |
| --- | --- |
| Tampilan belum berubah setelah pembaruan | Laptop: **Ctrl + Shift + R**. HP: tutup lalu buka lagi aplikasinya (2×) |
| Tombol "Install aplikasi" tidak muncul | Pastikan memakai Chrome; atau menu ⋮ → *Tambahkan ke layar utama* |
| Bacakan tidak bersuara | Naikkan volume media; pasang suara Bahasa Indonesia di pengaturan Text-to-Speech HP |
| Musik tidak bunyi | Ketuk layar sekali (browser mewajibkan sentuhan sebelum memutar suara) |
| Data tidak masuk Supabase | Data aman di HP dan dikirim otomatis saat online; atau unduh CSV di menu Tes |
| Aplikasi terasa berat di HP lama | Matikan **Animasi** dan **Musik** |
