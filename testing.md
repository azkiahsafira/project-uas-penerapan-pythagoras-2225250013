# testing.md — Rencana Pengujian

Pengujian dilakukan berlapis: dari kode (otomatis), fitur, perangkat Android, sampai uji ahli dan uji coba siswa
(tahap **Development → Implementation** ADDIE).

## 1. Uji otomatis (setiap perubahan kode)

| Uji | Perintah | Lulus bila |
| --- | --- | --- |
| Lint JavaScript | `npm run lint` | tanpa error/peringatan |
| Build produksi | `npm run build` | berhasil, ukuran bundel utama < 600 KB |
| Analisis Python | `python analisis/analisis.py analisis/contoh_data.csv --aktivitas analisis/contoh_aktivitas.csv --kertas analisis/templat_kertas.csv` | laporan & grafik terbentuk tanpa peringatan kunci |
| Kunci jawaban sinkron | bandingkan `src/tes.js`, `analisis/analisis.py`, `backend/penilaian.py` | kunci ketiganya sama |
| Backend FastAPI | `backend/.venv/Scripts/python -m pytest backend -q` | 16 uji lulus |

Uji unit yang direncanakan:
- `src/pythagoras.js`: sisi miring, sisi siku-siku, input tidak valid (c ≤ a), tripel Pythagoras, koma desimal.
- Penilaian tes: jawaban angka (toleransi 0,01), jawaban pilihan, jawaban huruf A–D dari lembar kertas.
- Skor Leppink: rata-rata IL (butir 1–3), EL (4–6), GL (7–10).

## 2. Uji fungsional (checklist)

| No | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| 1 | Masuk dengan kode siswa terdaftar / tidak terdaftar | masuk / pesan ramah "kode tidak ditemukan" |
| 2 | Sesi 1 → 3 berurutan | sesi berikutnya terbuka setelah sesi sebelumnya selesai |
| 3 | Salah 1× lalu 2× pada cek pemahaman | petunjuk muncul, lalu jawaban dibuka; pesan semangat tampil |
| 4 | Benar pada cek pemahaman | layar perayaan ±2 detik, lalu kembali ke penjelasan |
| 5 | Latihan 10 soal | progres "10 dari 10", setiap soal tercatat |
| 6 | Pre-test → post-test → kuesioner | menu lain & hiasan & musik hilang saat tes; hasil tersimpan |
| 7 | Mode pesawat (offline) lalu online | aplikasi tetap jalan; data terkirim otomatis saat online |
| 8 | Tombol Bacakan | teks dibaca, bagian yang dibaca disorot, musik mengecil |
| 9 | Tombol Animasi mati / Musik mati | animasi berhenti / musik berhenti, pilihan diingat |
| 10 | Kalkulator: c lebih pendek dari a | pesan kesalahan yang jelas |
| 11 | Cek prasyarat: 2 dari 4 benar | diarahkan ke kuadrat & akar Sesi 1; skor tampil di kartu Pemanasan |
| 12 | Latihan langkah 1: sisi miring ditandai sisi siku-siku | pesan "Ada sisi yang tertukar"; setelah 2× salah, Diketahui/Ditanya yang benar ditampilkan |
| 13 | Latihan langkah 2: ketuk sisi siku-siku pada segitiga diputar | sisi ditandai merah + penjelasan; sisi miring benar → label muncul |
| 14 | Jawab sisi miring lebih pendek dari sisi lain | peringatan cek kewajaran, belum dinilai salah |
| 15 | 3 soal benar tanpa bantuan | langkah 1–2 disembunyikan, petunjuk tinggal 3 tahap; salah sekali → bantuan muncul lagi |
| 16 | Soal ke-3, 6, 9 | pertanyaan refleksi; "Soal berikutnya" terkunci sampai dijawab |
| 17 | Kode baru, belum pre-test | Belajar & Latihan terkunci ("Kerjakan pre-test dulu"); post-test & kuesioner "Belum dibuka" |
| 18 | Pre-test dikumpulkan | pre-test "✓ Sudah dikerjakan"; Belajar terbuka; Latihan masih terkunci sampai Sesi 3 selesai |
| 19 | Sesi 3 selesai, latihan < 10 soal | post-test "Dibuka setelah Latihan Soal minimal 10 soal (baru n)" |
| 20 | Kirim pre-test kedua (kode sama) ke backend | ditolak 409 `sudah_dikerjakan` |
| 21 | Kode kelompok "Uji coba peneliti" | semua bagian terbuka; data tidak ikut analisis |

## 3. Uji perangkat Android

| Perangkat | Contoh | Fokus |
| --- | --- | --- |
| HP murah | RAM 2–3 GB, Android 8–10 | kelancaran animasi & latar, waktu muat |
| HP menengah | RAM 4–6 GB, Android 11+ | tampilan, 3D (three.js) |
| Layar kecil | lebar 360 px | tidak ada geser ke samping, tombol ≥ 44 px |

Yang dicatat: waktu muat pertama (4G/kuota), ukuran data terunduh, kelancaran (tersendat/tidak), suhu & baterai setelah 30 menit,
pemasangan PWA dari Chrome berhasil.

## 4. Validasi ahli (sebelum uji siswa)
- **Ahli materi** (dosen/guru matematika): kesesuaian dengan bab Teorema Pythagoras, subbab penerapan; kebenaran konsep & soal.
- **Ahli media**: tampilan, navigasi, keterbacaan, penggunaan animasi.
- Instrumen: skala Likert 1–4 per aspek; kesepakatan dapat dideskripsikan dengan **Aiken's V** (dengan catatan jumlah penilai sedikit).
- Hasil: daftar revisi + bukti perbaikan.

## 5. Uji coba terbatas
- 1–2 siswa **di luar** subjek penelitian mencoba alur lengkap.
- Amati: bagian yang membingungkan, waktu tiap sesi, petunjuk yang paling sering dipakai.
- Tanyakan singkat: "Bagian mana yang sulit dibaca?" "Apa yang mengganggu?"

## 6. Aturan data uji
- **Jangan** menguji dengan Supabase produksi. Jalankan lokal dengan `VITE_SUPABASE_URL=` kosong.
- Bila terlanjur masuk, hapus data uji dan cek tabel kosong **tepat sebelum** penelitian (lihat [deploy.md](deploy.md)).
