# Penerapan Teorema Pythagoras

Media pembelajaran berbasis web untuk **membangun literasi matematis** siswa SMP pada materi teorema Pythagoras. Berisi materi belajar 3 sesi, kalkulator dengan langkah penyelesaian, dan latihan soal kontekstual.

Dibuat untuk memenuhi **Project UAS** mata kuliah **Algoritma Pemrograman**.

| | |
| --- | --- |
| Nama | Azkiah Safira |
| NIM | 2225250013 |
| Kelas | 3F |
| Dosen Pengampu | Dr. Aan Hendrayana, S.Si., M.Pd. |

**Coba aplikasinya:** https://azkiahsafira.github.io/project-uas-penerapan-pythagoras-2225250013/

## Teorema Pythagoras

Pada segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi siku-sikunya:

```
c² = a² + b²
```

| Simbol | Keterangan |
| ------ | ---------- |
| `a` | alas (sisi siku-siku mendatar) |
| `b` | tinggi (sisi siku-siku tegak) |
| `c` | sisi miring (hipotenusa), selalu sisi terpanjang |

Dari rumus tersebut diperoleh tiga bentuk:

| Yang dicari | Rumus |
| ----------- | ----- |
| Sisi miring | `c = √(a² + b²)` |
| Alas | `a = √(c² − b²)` |
| Tinggi | `b = √(c² − a²)` |

## Fitur

- **Belajar 3 sesi**: materi bertahap yang harus diikuti berurutan.
  - Sesi 1: mengenal segitiga siku-siku, kuadrat, dan akar kuadrat.
  - Sesi 2: menemukan dan memakai teorema Pythagoras.
  - Sesi 3: Pythagoras dalam kehidupan sehari-hari (soal cerita).
  - Setiap langkah punya cek pemahaman: petunjuk muncul jika salah, dan jawaban dibuka setelah 2 kali salah agar siswa tidak buntu. Progres sesi tersimpan di perangkat.
- **Tes penelitian** (menu Tes):
  - **Pre-test** (pertemuan 1, sebelum Sesi 1) dan **post-test** (pertemuan 5): masing-masing 10 soal paralel, satu soal per layar, tanpa umpan balik benar/salah agar tes tidak ikut mengajari.
  - **Kuesioner beban kognitif Leppink** (pertemuan 5, setelah post-test): 10 pernyataan skala 0–10 untuk intrinsic, extraneous, dan germane load.
  - Identitas siswa (nama, kelas, sekolah, kelompok aplikasi/diajar langsung), durasi pengerjaan, dan nilai dicatat. Menu lain disembunyikan selama tes.
  - Hasil disimpan di perangkat lalu dikirim ke database **Supabase**. Jika internet putus, hasil tetap aman di perangkat dan dikirim ulang otomatis. Hasil juga bisa diunduh sebagai CSV.
- **Kalkulator tiga mode**: mencari sisi miring, alas, atau tinggi.
- **Langkah penyelesaian**: perhitungan ditampilkan baris per baris, dari rumus sampai hasil akhir.
- **Gambar segitiga**: ukuran segitiga menyesuaikan input, dan sisi yang dicari diberi warna.
- **Deteksi tripel Pythagoras**: memberi tahu jika ketiga sisi bilangan bulat, misalnya (3, 4, 5).
- **Validasi input**: menolak angka kosong, nol, negatif, atau sisi miring yang tidak lebih panjang dari sisi lain.
- **Contoh soal sehari-hari**: tangga bersandar, diagonal layar TV, tinggi layang-layang, dan jalan pintas di lapangan.
- **Latihan soal**: soal cerita dibuat acak, jawaban diperiksa otomatis, ada skor, dan pembahasan langkah demi langkah ditampilkan setelah menjawab.
- **Header beranimasi**: prisma segitiga 3-4-5 yang berputar dalam 3D (CSS 3D transform), karakter anak SMP bergaya chibi yang melambai dan sesekali melompat, simbol matematika yang melayang, serta awan berwajah.
- **Animasi penyemangat**: konfeti saat jawaban benar, layar perayaan saat satu sesi selesai, Siku mini yang berjalan di progress bar, dan umpan balik salah yang bergoyang pelan.
- **Tombol "Animasi: nyala/mati"** di bagian bawah halaman, misalnya untuk siswa yang mudah terganggu. Semua animasi juga berhenti selama tes.
- **Maskot "Siku"**: karakter segitiga siku-siku beranimasi (melayang, berkedip, melambai) dengan balon kata di header, serta bereaksi senang/berpikir saat siswa menjawab. Animasi berhenti saat tes dan mengikuti pengaturan *kurangi gerakan* perangkat.
- Tema biru, responsif (laptop dan HP), serta mendukung mode terang/gelap.

## Rancangan Berdasarkan Teori Beban Kognitif

Materi di [src/materi.js](src/materi.js) dirancang mengikuti *Cognitive Load Theory* (Activation/Balance Model):

| Beban | Strategi | Penerapan di aplikasi |
| ----- | -------- | --------------------- |
| Intrinsic load | Dikelola | Materi dipecah jadi langkah kecil (satu konsep per layar); prasyarat kuadrat dan akar diajarkan dulu di Sesi 1; sesi berikutnya terkunci sampai sesi sebelumnya selesai. |
| Extraneous load | Ditekan | Satu layar hanya berisi teks singkat, satu gambar, dan satu pertanyaan; tanpa animasi atau hiasan; di HP gambar ditaruh di atas teks agar tidak perlu scroll bolak-balik (*split-attention*). |
| Germane load | Dioptimalkan | Contoh lengkap (*worked example*) diikuti contoh setengah jadi (*faded example*); cek pemahaman dengan umpan balik dan petunjuk di setiap langkah; strategi 4 langkah untuk soal cerita; refleksi di akhir. |

## Alur Penelitian

| Pertemuan | Kegiatan | Menu di aplikasi |
| --------- | -------- | ---------------- |
| 1 | Pre-test, lalu Sesi 1 | Tes → Pre-test, lalu Belajar → Sesi 1 |
| 2 | Sesi 2 | Belajar → Sesi 2 |
| 3 | Sesi 3 | Belajar → Sesi 3 |
| 4 | Implementasi (difasilitasi mahasiswa) | Latihan Soal dan Kalkulator |
| 5 | Post-test dan skala beban kognitif | Tes → Post-test, lalu Tes → Kuesioner Beban Kognitif |

Kedua siswa (yang belajar dengan aplikasi dan yang diajar langsung) mengerjakan pre-test, post-test, dan kuesioner yang sama.

### Instrumen

- **Pre-test dan post-test** ([src/tes.js](src/tes.js)): 10 soal paralel. Setiap nomor mengukur indikator yang sama dengan angka/konteks berbeda:

  | No | Indikator |
  | -- | --------- |
  | 1 | Mengenali sisi miring segitiga siku-siku |
  | 2 | Menghitung kuadrat bilangan |
  | 3 | Menghitung akar kuadrat |
  | 4 | Menentukan bentuk rumus Pythagoras |
  | 5 | Menghitung sisi miring |
  | 6 | Menghitung sisi siku-siku |
  | 7 | Soal cerita: mencari sisi siku-siku |
  | 8 | Soal cerita: mencari sisi miring (jarak) |
  | 9 | Menentukan tripel Pythagoras |
  | 10 | Soal cerita: diagonal layar |

  Nilai = jumlah benar ÷ 10 × 100.

- **Kuesioner beban kognitif**: diadaptasi dari Leppink dkk. (2013), 10 butir skala 0 (sama sekali tidak setuju) sampai 10 (sangat setuju). Skor tiap jenis beban adalah rata-rata butirnya:

  | Jenis beban | Butir | Harapan |
  | ----------- | ----- | ------- |
  | Intrinsic load (IL) | 1–3 | dikelola |
  | Extraneous load (EL) | 4–6 | serendah mungkin |
  | Germane load (GL) | 7–10 | setinggi mungkin |

## Algoritma

Algoritma perhitungan ada di fungsi `hitung()` pada [src/pythagoras.js](src/pythagoras.js).

```
MULAI
  BACA sisi yang dicari (a, b, atau c)
  BACA dua sisi yang diketahui

  UNTUK setiap sisi yang diketahui:
    JIKA bukan angka ATAU ≤ 0 MAKA
      TAMPILKAN "harus berupa angka lebih dari 0"
      SELESAI

  JIKA yang dicari = c MAKA
    c ← √(a² + b²)
  SELAIN ITU
    JIKA c ≤ sisi lain MAKA
      TAMPILKAN "sisi miring harus lebih panjang"
      SELESAI
    sisi yang dicari ← √(c² − sisi lain²)

  TAMPILKAN hasil (dibulatkan 2 angka di belakang koma)
  TAMPILKAN langkah-langkah perhitungan
  JIKA a, b, c semuanya bilangan bulat MAKA
    TAMPILKAN "tripel Pythagoras"
SELESAI
```

### Contoh

Tangga sepanjang 5 m bersandar di dinding, jarak kaki tangga ke dinding 3 m. Berapa tinggi dinding yang dicapai?

```
b² = c² − a²
b² = 5² − 3²
b² = 25 − 9
b² = 16
b  = √16 = 4 m
```

### Algoritma Latihan Soal

Ada di [src/Latihan.jsx](src/Latihan.jsx). Soal dibuat dari daftar *tripel Pythagoras* (misalnya 3-4-5, 5-12-13, 8-15-17) supaya jawabannya selalu bilangan bulat.

```
MULAI
  skor ← 0, total ← 0
  ULANGI
    pilih acak satu tripel (a, b, c)
    pilih acak sisi yang dicari (a, b, atau c)
    pilih acak cerita soal yang sesuai, tidak sama dengan soal sebelumnya
    TAMPILKAN soal dan gambar (sisi yang dicari ditulis "?")

    BACA jawaban
    total ← total + 1
    JIKA |jawaban − kunci| < 0,01 MAKA
      skor ← skor + 1
      TAMPILKAN "Benar!"
    SELAIN ITU
      TAMPILKAN "Belum tepat" dan kunci jawaban
    TAMPILKAN pembahasan (memakai fungsi hitung())
  SAMPAI pengguna berhenti
SELESAI
```

## Teknologi

- [React](https://react.dev) 19: antarmuka pengguna
- [Vite](https://vite.dev) 8: server pengembangan dan build
- [Oxlint](https://oxc.rs): pemeriksa kode (linter)
- [Supabase](https://supabase.com): database penyimpanan hasil penelitian
- [Python](https://www.python.org) 3: analisis data penelitian

## Database (Supabase)

Hasil pre-test, post-test, dan kuesioner disimpan di tabel `hasil`. Skema dan aturan keamanannya ada di [supabase/schema.sql](supabase/schema.sql).

- Aplikasi hanya boleh **menambah** data (Row Level Security). Membaca, mengubah, dan menghapus data hanya bisa dilakukan peneliti lewat dashboard Supabase, sehingga nama dan nilai siswa tidak bisa dilihat orang lain.
- Data untuk dianalisis: Supabase → **Table Editor** → tabel `hasil` → **Export to CSV**.

Proyek Supabase: **penelitian-pythagoras** (region Singapore). URL dan *publishable key*-nya ada di file [.env](.env) dan ikut dipakai saat build di GitHub Actions. Publishable key memang aman dibagikan karena tabel dilindungi RLS; **jangan pernah** menaruh *secret key* di repo.

Jika ingin memakai proyek Supabase lain: jalankan `supabase/schema.sql` di **SQL Editor** proyek tersebut, lalu ganti isi `.env` dengan **Project URL** dan **publishable key** dari **Project Settings → API Keys**.

## Cara Menjalankan

Pastikan [Node.js](https://nodejs.org) sudah terpasang, lalu jalankan di folder ini:

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

Perintah lainnya:

| Perintah | Fungsi |
| -------- | ------ |
| `npm run build` | membuat versi siap pakai di folder `dist` |
| `npm run preview` | menjalankan hasil build |
| `npm run lint` | memeriksa kode |

Setiap push ke branch `main` otomatis di-build dan di-deploy ke GitHub Pages lewat GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## Analisis Data (Python)

Script [analisis/analisis.py](analisis/analisis.py) mengolah CSV ekspor tabel `hasil` dari Supabase: nilai pre/post-test, N-gain, ketercapaian indikator, skor beban kognitif Leppink, perbandingan kelompok, serta grafik SVG. Hanya memakai library bawaan Python. Petunjuk lengkap ada di [analisis/README.md](analisis/README.md).

```bash
cd analisis
python analisis.py data.csv
```

## Struktur Folder

```
aplikasi-pythagoras/
├── index.html        halaman utama
├── public/           ikon
├── analisis/         script Python untuk mengolah data penelitian
├── supabase/         skema database (SQL)
└── src/
    ├── main.jsx      titik awal aplikasi
    ├── App.jsx       halaman utama: menu, kalkulator, contoh soal
    ├── Belajar.jsx   pemutar materi belajar per sesi
    ├── Maskot.jsx    karakter maskot "Siku" (SVG beranimasi)
    ├── Siswa.jsx     karakter anak SMP (SVG beranimasi)
    ├── Prisma3D.jsx  prisma segitiga 3D berputar
    ├── Hiasan.jsx    simbol melayang, awan, konfeti
    ├── Ikon.jsx      ikon menu
    ├── Tes.jsx       pre-test, post-test, kuesioner Leppink
    ├── tes.js        soal tes dan butir kuesioner
    ├── penyimpanan.js penyimpanan hasil, kirim ke Supabase, ekspor CSV
    ├── supabase.js   koneksi ke Supabase
    ├── materi.js     isi materi 3 sesi
    ├── Latihan.jsx   mode latihan soal
    ├── Segitiga.jsx  gambar segitiga (SVG)
    ├── pythagoras.js logika perhitungan
    ├── App.css       gaya komponen
    └── index.css     warna dan gaya dasar
```
