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

4. Hasilnya tampil di terminal dan tersimpan di folder `hasil_analisis/`:

   | File | Isi |
   | ---- | --- |
   | `rekap_siswa.csv` | nilai pre, post, selisih, N-gain, durasi, IL/EL/GL per siswa (buka di Excel) |
   | `grafik_nilai.svg` | grafik batang pre-test vs post-test per siswa |
   | `grafik_beban.svg` | grafik IL, EL, GL per siswa |
   | `grafik_indikator.svg` | jumlah siswa menjawab benar per nomor soal, pre vs post |
   | `rekap_langkah.csv` | rata-rata waktu, total salah, dan jawaban dibuka per langkah materi (dengan `--aktivitas`) |
   | `grafik_waktu_langkah.svg` | rata-rata waktu per langkah (dengan `--aktivitas`) |
   | `grafik_salah_langkah.svg` | jumlah jawaban salah per langkah (dengan `--aktivitas`) |

   File SVG bisa dibuka di browser, atau dimasukkan ke Word lewat **Insert → Pictures**.

Mau mencoba dulu? Jalankan dengan data contoh (fiktif):

```bash
python analisis.py contoh_data.csv --aktivitas contoh_aktivitas.csv
```

Contoh keluarannya ada di folder [contoh_hasil/](contoh_hasil/).

## Yang dihitung

| Analisis | Rumus / aturan |
| -------- | -------------- |
| Nilai tes | jumlah benar ÷ 10 × 100 (dikoreksi ulang dari jawaban, lalu dicocokkan dengan nilai tersimpan) |
| N-gain (Hake) | (post − pre) ÷ (100 − pre); ≥ 0,7 tinggi, 0,3–0,7 sedang, < 0,3 rendah |
| Ketercapaian indikator | jumlah siswa yang menjawab benar tiap nomor, pre vs post |
| Beban kognitif | rata-rata butir tiap dimensi (skala 0–10); < 3,34 rendah, 3,34–6,66 sedang, ≥ 6,67 tinggi |
| Perbandingan kelompok | rata-rata semua ukuran untuk kelompok aplikasi vs diajar langsung |
| Proses belajar per langkah | waktu tiap siswa dijumlah per langkah (bila dibuka lebih dari sekali), lalu dirata-rata; jumlah salah, jawaban dibuka, dan berapa kali tombol Bacakan dipakai; ditampilkan pula 3 langkah terlama dan 3 langkah dengan salah terbanyak |

Jika seorang siswa mengerjakan tes yang sama lebih dari sekali, yang dipakai adalah hasil **terakhir**.

## Catatan

- Kunci jawaban di `analisis.py` harus sama dengan `src/tes.js`. Jika soal di aplikasi diubah, ubah juga `KUNCI` di script ini. Script memberi PERINGATAN jika nilai hasil hitung ulang tidak cocok.
- File CSV data asli **tidak ikut di-upload ke GitHub** (diatur di `.gitignore`) karena berisi nama siswa. Simpan di laptop sendiri.
