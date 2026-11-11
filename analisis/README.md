# Analisis Data Penelitian (Python)

Script [analisis.py](analisis.py) mengolah hasil pre-test, post-test, dan kuesioner beban kognitif.
Hanya memakai library bawaan Python 3, jadi tidak perlu install apa pun.

## Langkah

1. **Unduh data** dari Supabase: dashboard → proyek `penelitian-pythagoras` → **Table Editor** → tabel `hasil` → **Export → Export to CSV**.
   (Bisa juga memakai CSV dari tombol *Unduh semua hasil* di menu Tes aplikasi.)
   Lakukan juga untuk tabel `aktivitas` (proses belajar), simpan misalnya sebagai `aktivitas.csv`.
2. Simpan file CSV itu di folder `analisis/`, misalnya `data.csv`.
3. Jalankan di terminal dari folder `analisis/`:

   ```bash
   python analisis.py data.csv --aktivitas aktivitas.csv
   ```

   (Tanpa `--aktivitas`, hanya hasil tes yang dianalisis.)

   **Siswa yang diajar langsung (lembar kertas):** cetak lembar di folder [`docs/instrumen-cetak`](../docs/instrumen-cetak)
   (pre-test, post-test, kuesioner, dan kunci jawaban; soalnya sama persis dengan di aplikasi). Setelah dikerjakan,
   salin [`templat_kertas.csv`](templat_kertas.csv) menjadi `data_kertas.csv`, hapus baris contoh, lalu isi satu baris per lembar:

   | Kolom | Isi |
   | ----- | --- |
   | `jenis` | `pretest`, `posttest`, atau `leppink` |
   | `nama`, `sekolah`, `tanggal` | identitas dari lembar |
   | `kelompok` | `Diajar langsung` |
   | `durasi_menit` | jam selesai − jam mulai (menit) |
   | `s1`–`s10` | jawaban tes: huruf A–D untuk soal pilihan, angka untuk soal hitungan |
   | `b1`–`b10` | kuesioner: angka 0–10 yang dicentang |

   Lalu jalankan `python analisis.py data.csv --kertas data_kertas.csv` (bisa digabung dengan `--aktivitas`).
   Jawaban dikoreksi otomatis dengan kunci yang sama, dan tabel perbandingan kelompok muncul kembali.

4. Hasilnya tampil di terminal dan tersimpan di folder `hasil_analisis/`:

   | File | Isi |
   | ---- | --- |
   | `rekap_siswa.csv` | nilai pre, post, selisih, N-gain, durasi, IL/EL/GL per siswa (buka di Excel) |
   | `grafik_nilai.svg` | grafik batang pre-test vs post-test per siswa |
   | `grafik_beban.svg` | grafik IL, EL, GL per siswa |
   | `grafik_indikator.svg` | jumlah siswa menjawab benar per nomor soal, pre vs post |
   | `rekap_literasi.csv` | skor literasi matematis per proses (merumuskan, menerapkan, menafsirkan) tiap siswa: pre, post, selisih, N-gain |
   | `grafik_literasi.svg` | rata-rata skor tiap proses literasi per kelompok, pre vs post |
   | `rekap_langkah.csv` | rata-rata waktu, total salah, dan jawaban dibuka per langkah materi (dengan `--aktivitas`) |
   | `grafik_waktu_langkah.svg` | rata-rata waktu per langkah (dengan `--aktivitas`) |
   | `grafik_salah_langkah.svg` | jumlah jawaban salah per langkah (dengan `--aktivitas`) |
   | `rekap_latihan.csv` | latihan pertemuan 4 per siswa: jumlah soal, benar, salah, lihat jawaban, % benar, rata-rata waktu (dengan `--aktivitas`) |

   File SVG bisa dibuka di browser, atau dimasukkan ke Word lewat **Insert → Pictures**.

**Tes Mathematical Literacy:** jalankan `python ekspor_jawaban_literasi.py hasil.csv` (CSV ekspor tabel `hasil`) untuk
membuat `lembar_penilaian_literasi.html` (soal + jawaban uraian tiap siswa + rubrik per tahap) dan `skor_literasi.csv`
(baris siswa sudah terisi, kolom skor kosong). Nilai jawaban uraian dengan rubrik
([docs/instrumen-cetak-literasi](../docs/instrumen-cetak-literasi)), ketik skor tiap soal (0–6) ke `skor_literasi.csv`
(format [templat_skor_literasi.csv](templat_skor_literasi.csv): `nama,kelompok,jenis,s1,s2,s3,s4`), lalu jalankan
`python analisis_literasi.py skor_literasi.csv`. Hasil: skor total /24, N-gain, skor per indikator, perbandingan kelompok,
`rekap_mathematical_literacy.csv`, dan `grafik_mathematical_literacy.svg`.

Mau mencoba dulu? Jalankan dengan data contoh (fiktif):

```bash
python analisis.py contoh_data.csv --aktivitas contoh_aktivitas.csv --kertas templat_kertas.csv
```

Contoh keluarannya ada di folder [contoh_hasil/](contoh_hasil/).

## Yang dihitung

| Analisis | Rumus / aturan |
| -------- | -------------- |
| Nilai tes | jumlah benar ÷ 10 × 100 (dikoreksi ulang dari jawaban, lalu dicocokkan dengan nilai tersimpan) |
| N-gain (Hake) | (post − pre) ÷ (100 − pre); ≥ 0,7 tinggi, 0,3–0,7 sedang, < 0,3 rendah |
| Ketercapaian indikator | jumlah siswa yang menjawab benar tiap nomor, pre vs post |
| Beban kognitif | rata-rata butir tiap dimensi (skala 0–10); < 3,34 rendah, 3,34–6,66 sedang, ≥ 6,67 tinggi |
| Literasi matematis per proses | tiap nomor soal digolongkan ke proses utamanya (tabel di bawah); skor proses = benar ÷ jumlah butir proses × 100; N-gain dihitung per proses |
| Perbandingan kelompok | rata-rata semua ukuran per kelompok (hanya muncul bila data berisi lebih dari satu kelompok; aplikasi kini memakai satu kelompok, "Belajar dengan aplikasi") |
| Proses belajar per langkah | waktu tiap siswa dijumlah per langkah (bila dibuka lebih dari sekali), lalu dirata-rata; jumlah salah, jawaban dibuka, dan berapa kali tombol Bacakan dipakai; ditampilkan pula 3 langkah terlama dan 3 langkah dengan salah terbanyak |

Setiap tes hanya bisa dikerjakan **satu kali** (aplikasi & backend menolak percobaan kedua). Jika data tetap berisi tes ganda
(mis. dari lembar kertas), yang dipakai adalah percobaan **pertama**, dan script memberi PERINGATAN. Baris kelompok
`Uji coba peneliti` (kode demo) tidak ikut dianalisis.

### Pemetaan soal ke proses literasi matematis

Dosen menetapkan kemampuan yang diukur adalah **literasi matematis**. Materi PDF memakai tiga prosesnya (OECD/PISA).
Soal pre-test/post-test **tidak diubah**; tiap nomor digolongkan ke proses **utama** yang diukurnya
(`PROSES_LITERASI` di `analisis.py`):

| Proses | Nomor soal | Alasan |
| --- | --- | --- |
| **Merumuskan** (mengubah situasi menjadi model matematika) | 1, 4, 8, 10 | mengenali sisi miring, memilih bentuk rumus, menyadari jarak terpendek & diagonal layar = sisi miring |
| **Menerapkan** (menjalankan prosedur matematika) | 2, 3, 5, 6 | kuadrat, akar kuadrat, menghitung sisi miring & sisi siku-siku |
| **Menafsirkan** (menilai hasil dalam konteks) | 7, 9 | memilih tinggi yang masuk akal di antara pilihan (tangga/layang-layang), memeriksa apakah tiga ukuran membentuk segitiga siku-siku |

Karena masing-masing kelompok hanya 1 siswa, hasilnya dibaca sebagai perbandingan dua kasus (deskriptif), bukan uji statistik.
Proses menafsirkan hanya punya 2 butir, jadi satu jawaban mengubah skornya 50 poin.

## Catatan

- Kunci jawaban di `analisis.py` harus sama dengan `src/tes.js`. Jika soal di aplikasi diubah, ubah juga `KUNCI` di script ini. Script memberi PERINGATAN jika nilai hasil hitung ulang tidak cocok.
- File CSV data asli **tidak ikut di-upload ke GitHub** (diatur di `.gitignore`) karena berisi nama siswa. Simpan di laptop sendiri.
