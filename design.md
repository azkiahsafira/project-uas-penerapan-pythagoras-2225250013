# design.md — Rancangan Desain Antarmuka & Interaksi

> Dasar: temuan wawancara (EL1–EL5, GL1–GL5, DS01–DS03) dan prinsip Cognitive Load Theory.
> Target layar utama: **smartphone Android** 360–412 px lebar.

## 1. Prinsip desain dari wawancara

| Temuan siswa | Prinsip desain |
| --- | --- |
| "Gambar sangat membantu kalau diletakkan dekat keterangan soal" (EL02) | **Integrasi**: label panjang sisi ditulis langsung pada gambar; teks soal tepat di atas gambar |
| "Kalimat soal yang panjang membuat saya membacanya beberapa kali" (EL01, EL05) | **Pemecahan**: soal cerita dipecah per kalimat; angka penting bisa diketuk untuk masuk ke tabel *Diketahui/Ditanya* |
| "Terlalu banyak warna, animasi bergerak, atau hiasan, saya malah kurang fokus" (EL03, DS03) | Animasi dipertahankan (keputusan pengembang); **disembunyikan saat tes** dan bisa dimatikan siswa |
| "Cukup gunakan warna untuk membedakan sisi yang diketahui dan sisi yang dicari" (EL03) | **Warna bermakna**: biru = diketahui, merah muda/oranye = dicari, abu-abu = belum ditentukan |
| "Penjelasan terlalu cepat saat memasukkan angka ke rumus" (EL04) | **Pacing oleh siswa**: tombol Lanjut/Kembali, langkah substitusi ditampilkan satu baris per ketukan |
| "Paham setelah menggambar & memberi nama sisi" (GL01) | **Aktif**: siswa mengetuk sisi untuk memberi label a, b, c sebelum rumus muncul |
| "Petunjuk tahap demi tahap" (GL03, DS02) | **Petunjuk bertingkat** (lihat §5) |

> ⚠️ **Keputusan pengembang (wawancara AI → Azkiah):** animasi & hiasan yang sudah ada (halaman sekolah, latar bawah laut, konfeti, layar perayaan)
> **dipertahankan apa adanya**, walaupun informan S01 menyebut animasi berlebihan dapat mengganggu (EL03). Pengendalian yang tetap berlaku:
> semua hiasan & musik **disembunyikan saat tes**, ada tombol **"Animasi: mati"**, `prefers-reduced-motion` dihormati, dan warna pada segitiga
> tetap hanya untuk membedakan sisi diketahui vs dicari. Dampaknya diukur lewat skor **EL Leppink** dan dibahas di laporan.

## 2. Token visual

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--diketahui` | `#3b82f6` (biru) | sisi/angka yang diketahui |
| `--dicari` | `#ec4899` (merah muda) | sisi/angka yang dicari |
| `--netral` | `#94a3b8` | sisi yang belum ditentukan |
| `--benar` | `#16a34a` | umpan balik benar |
| `--salah` | `#dc2626` | umpan balik salah (tanpa getaran berlebihan) |
| Latar layar soal | putih / `#f8fbff` polos | tanpa pola atau gambar latar |
| Huruf | Plus Jakarta Sans, ≥ 16 px isi, ≥ 20 px judul, angka & simbol ≥ 18 px |
| Sudut | 16 px kartu, 12 px tombol | |
| Tombol | tinggi ≥ 44 px, satu tombol utama per layar | |

## 3. Daftar layar (Android, satu kolom)

1. **Masuk** — kolom kode siswa (huruf besar otomatis), tombol "Masuk". Pesan jelas bila kode salah.
2. **Beranda** — halaman sekolah dengan Siku, Raka, Nisa; menu Belajar · Kalkulator · Latihan · Tes; latar bawah laut.
3. **Cek prasyarat** — 4 soal kuadrat/akar, satu per layar.
4. **Materi (Sesi 1–3)** — judul, ≤ 3 kalimat, gambar terintegrasi, satu pertanyaan cek; Bacakan; progres langkah.
5. **Ilustrasi 3D** — kartu three.js **tangga–dinding** yang bisa diputar dengan jari; tombol "Lihat segitiganya" menampilkan garis segitiga siku-siku di atas benda.
6. **Soal cerita (latihan)** — (a) kalimat soal yang bisa diketuk, (b) tabel Diketahui–Ditanya, (c) segitiga 2D berlabel, (d) kolom jawaban, (e) tombol 💡 Petunjuk.
7. **Hasil soal** — benar/salah, pembahasan baris per baris, pertanyaan refleksi singkat.
8. **Tes** — tampilan polos, satu soal per layar, tanpa umpan balik.
9. **Kuesioner Leppink** — skala 0–10 berupa tombol besar.

## 4. Segitiga interaktif
- Tanda **sudut siku-siku** (kotak kecil) selalu terlihat.
- Segitiga muncul dalam **orientasi berbeda** (diputar 0°, 90°, 180°, 270°, dicerminkan) pada latihan identifikasi (temuan IL1).
- Siswa mengetuk sisi → memilih label: *sisi siku-siku a*, *sisi siku-siku b*, *sisi miring c*.
- Sisi miring yang benar disorot dengan garis tebal `--dicari` bila sedang dicari, atau `--diketahui` bila diketahui.

## 5. Petunjuk bertingkat (fading)
| Tingkat | Isi petunjuk |
| --- | --- |
| 1 | "Cari segitiga siku-sikunya. Di mana sudut sikunya?" |
| 2 | "Sisi miring ada di depan sudut siku-siku. Sisi mana itu?" |
| 3 | "Yang dicari sisi miring atau sisi siku-siku? Pilih rumusnya." |
| 4 | Substitusi angka ke rumus (baris pertama ditunjukkan) |
| 5 | "Cek: apakah sisi miring paling panjang?" |

Aturan fading: tombol 💡 selalu ada; setelah 3 soal benar berturut-turut tanpa petunjuk, petunjuk tingkat 1–2 tidak ditawarkan otomatis (tetap bisa diminta).

## 6. Ilustrasi 3D (three.js)
- Dipakai **hanya bila membantu pemahaman**: menghubungkan benda nyata ↔ segitiga siku-siku. Adegan utama: **tangga bersandar di dinding** (soal dari wawancara).
- Gaya *low-poly* pastel, tanpa tekstur berat; ≤ 5.000 segitiga per adegan; 30 fps cukup.
- Kontrol: geser satu jari untuk memutar, dua jari untuk zoom; tombol "Atur ulang".
- Dimuat malas (*lazy*) dan berhenti me-*render* saat kartu tidak terlihat (hemat baterai).
- Cadangan: bila WebGL tidak tersedia, tampilkan gambar 2D yang sama.

## 7. Suara & animasi
- **Bacakan** (Web Speech API) untuk teks materi & soal.
- Musik latar **mati secara bawaan**, tidak diputar di layar soal/tes.
- Umpan balik benar: singkat (≤ 1,5 detik), tidak menutupi pembahasan.
- Semua animasi disembunyikan saat tes, bisa dimatikan lewat tombol "Animasi", dan mematuhi `prefers-reduced-motion`.

## 8. Aksesibilitas
Kontras ≥ 4,5:1, semua tombol berlabel, tidak hanya mengandalkan warna (sisi juga diberi huruf a/b/c), dapat dipakai satu tangan.
