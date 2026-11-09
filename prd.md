# PRD — Aplikasi Belajar Penerapan Teorema Pythagoras (Android)

> **Product Requirements Document** · Project UAS Algoritma Pemrograman · Azkiah Safira (2225250013) · Kelas 3F
> Dosen pengampu: Dr. Aan Hendrayana, S.Si., M.Pd. · Model pengembangan: **ADDIE**
> Status: **rancangan v2** (revisi dosen) · dasar: dokumen *Kisi-kisi dan Pedoman Wawancara Mendalam* (informan S01, siswa IX-B, data simulasi)

## 1. Latar belakang

Siswa SMP kelas VIII mempelajari teorema Pythagoras dan penerapannya pada masalah sehari-hari. Wawancara pada tahap **Analysis**
(siswa kelas IX yang sudah mempelajari materi ini di kelas VIII) menunjukkan bahwa kesulitan utama siswa **bukan** pada menghitung,
melainkan pada **menentukan sisi miring**, **memilih informasi penting dari soal cerita**, dan **bolak-balik antara teks dan gambar**.
Aplikasi ini dirancang untuk mengelola beban kognitif (Cognitive Load Theory) agar kemampuan **literasi matematis (Mathematical Literacy)**
siswa meningkat: merumuskan situasi nyata ke model matematika, menerapkan konsep, dan menafsirkan hasil.

## 2. Tujuan

| Kode | Tujuan | Ukuran keberhasilan |
| --- | --- | --- |
| T1 | Meningkatkan literasi matematis pada materi Pythagoras | N-gain pre-test → post-test ≥ 0,3 (sedang) |
| T2 | Menekan beban yang tidak perlu (extraneous load) | Skor EL Leppink ≤ 4 (skala 0–10) |
| T3 | Mendorong pemahaman (germane load) | Skor GL Leppink ≥ 6 |
| T4 | Siswa makin mandiri | Jumlah petunjuk yang dipakai menurun dari soal awal ke soal lanjutan |
| T5 | Siswa tepat menentukan sisi miring pada berbagai posisi segitiga | ≥ 80% benar pada tugas identifikasi sisi miring (segitiga diputar) |

## 3. Keputusan dari catatan dosen

| Aspek | Keputusan |
| --- | --- |
| Materi | **Bab Teorema Pythagoras**, subbab **Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah** (kelas VIII) |
| Peran pengguna | **Siswa SMP** (pengguna utama); peneliti/guru hanya melihat data |
| Perangkat | **Smartphone Android** (utama), tetap bisa dibuka di laptop |
| Login | **Kode siswa = kelas + nomor absen** (mis. `8A-07`), didaftarkan peneliti; tanpa nama asli dan tanpa password |
| Bahasa | **Bahasa Indonesia** |
| Frontend | **JavaScript + React (Vite)**, ilustrasi 3D **tangga–dinding** dengan **three.js** |
| Pemasangan | **PWA dari Chrome** (tanpa APK); satu siswa satu HP |
| Internet | **Kuota HP siswa** → hemat data, bisa offline |
| Animasi | **Tetap seperti versi sekarang** (keputusan pengembang, lihat §5 EL3) |
| Backend | **Python + FastAPI**, di layanan web gratis (rencana: **Render** free web service, ±2 bulan penelitian) |
| Data & hosting basis data | **Supabase** (PostgreSQL) |

## 4. Pengguna

**Persona utama — Siswa kelas VIII (13–14 tahun)**
- Memakai smartphone Android (sering milik sendiri atau orang tua), layar ±6 inci, kuota terbatas.
- Sudah mengenal perkalian; **kuadrat dan akar kuadrat belum tentu kuat** (IL03).
- Lebih percaya diri bila ada gambar, tetapi terburu-buru pada teks panjang (catatan konteks).

**Persona pendukung — Peneliti/guru (mahasiswa)**
- Membagikan kode siswa, memantau hasil pre-test/post-test, kuesioner, dan jejak belajar.

## 5. Temuan wawancara → kebutuhan → fitur

| Kode | Temuan (S01, simulasi) | Interpretasi | Fitur | Cara menguji |
| --- | --- | --- | --- | --- |
| IL1 | Tertukar menentukan sisi miring, apalagi bila segitiga diputar | Identifikasi sisi butuh banyak unsur sekaligus | **F4** Segitiga interaktif (2D + 3D three.js) yang bisa diputar, sudut siku ditandai, sisi miring disorot | Siswa menunjuk sisi miring pada 5 orientasi tanpa bantuan |
| IL2 | Lupa sisi miring yang dikuadratkan; bingung yang dicari sisi miring atau sisi siku-siku | Banyak relasi diproses bersamaan | **F6** Langkah terpisah: tentukan sisi → pilih rumus → hitung | Kesalahan memilih rumus menurun |
| IL3 | Perlu kuadrat & akar kuadrat; tanpa itu macet di akhir | Kesenjangan prasyarat | **F2** Cek prasyarat singkat + materi kuadrat/akar | Skor prasyarat vs keberhasilan soal |
| IL4 | Kesulitan naik saat soal cerita & gambar tidak langsung | Konteks menambah unsur | **F9** Latihan berjenjang: angka → gambar → cerita | Waktu & benar per jenjang |
| EL1 | Kalimat soal panjang, bingung mana tinggi & mana sisi miring | Instruksi tidak terstruktur | **F5** Tandai "Diketahui" & "Ditanya" pada soal cerita | Siswa memilih data relevan dengan benar |
| EL2 | Bolak-balik antara teks & gambar | Split-attention | **D1** Teks soal, gambar, dan label sisi **dalam satu layar berdekatan** | Siswa mencocokkan angka teks dengan sisi gambar |
| EL3 | Terlalu banyak warna/animasi/hiasan mengganggu | Distraksi | **Keputusan pengembang: animasi dipertahankan.** Pengendalian: semua hiasan & musik disembunyikan saat tes, tombol "Animasi: mati", `prefers-reduced-motion`, warna pada segitiga hanya untuk sisi diketahui vs dicari | Skor EL Leppink dibandingkan kelompok diajar langsung |
| EL4 | Penjelasan terlalu cepat saat memasukkan angka ke rumus | Pacing | **F3** Materi per langkah, tombol ulangi/kembali, **Bacakan** | Jumlah ulangi per langkah |
| GL1 | Paham setelah menggambar & memberi nama sisi | Elaborasi | **F4** Siswa menandai sendiri sisi a, b, c | Ketepatan penandaan |
| GL2 | Memeriksa: sisi miring harus terpanjang | Penalaran | **F8** Cek kewajaran jawaban | Siswa bisa menjelaskan kewajaran |
| GL3 | Petunjuk tahap demi tahap membuatnya mandiri | Scaffolding | **F6** Petunjuk bertingkat yang **memudar** (fading) | Jumlah petunjuk per soal menurun |
| GL4 | Menjelaskan ke teman membuat ingat | Self-explanation | **F7** Pertanyaan refleksi "Mengapa…?" | Kualitas jawaban refleksi |
| GL5 | Melihat kesamaan pola pada cerita berbeda | Transfer | **F9** Variasi konteks (tangga, layang-layang, layar, jarak) | Benar pada konteks baru |

## 6. Fitur

### MVP (wajib untuk penelitian)
- **F1 Masuk dengan kode siswa** (`8A-07`) — tanpa nama; kode didaftarkan peneliti; tersimpan di HP (satu siswa satu HP).
- **F2 Cek prasyarat** — 4 soal kuadrat & akar; jika lemah, diarahkan ke Sesi 1.
- **F3 Materi 3 sesi bertahap** — satu konsep per layar, Bacakan, ulangi.
- **F4 Segitiga interaktif** — 2D (SVG) untuk soal, **3D (three.js)** untuk ilustrasi tangga–dinding yang bisa diputar.
- **F5 Penanda Diketahui/Ditanya** — ketuk angka pada soal cerita, isi tabel Diketahui–Ditanya sebelum menghitung.
- **F6 Petunjuk bertingkat** — 5 tingkat: (1) cari segitiga siku-siku, (2) tentukan sisi miring, (3) pilih rumus, (4) hitung, (5) cek jawaban; makin jarang ditawarkan bila siswa makin benar.
- **F7 Refleksi singkat** — satu pertanyaan "Mengapa…?" setelah soal kunci.
- **F8 Cek kewajaran** — peringatan bila sisi miring tidak terpanjang.
- **F9 Latihan berjenjang** (pertemuan 4).
- **F10 Pre-test, post-test, kuesioner Leppink** (pertemuan 1 & 5), menu lain dikunci saat tes.
- **F11 Pencatatan aktivitas** — waktu, salah, petunjuk dipakai, per langkah/soal → Supabase lewat backend.

### Lanjutan (bila waktu cukup)
- Rekap untuk peneliti (halaman sederhana / ekspor CSV).

## 7. Kebutuhan non-fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Perangkat | Android 8+, Chrome terbaru, layar 360×640 sampai 412×915 |
| Kinerja | Muat awal < 3 detik di 4G; three.js dimuat **hanya** saat ilustrasi 3D dibuka (lazy load) |
| Offline | Bisa dipakai tanpa internet setelah dibuka sekali (PWA); data dikirim saat online |
| Kuota | Unduhan awal < 2 MB (tanpa three.js), three.js ±600 KB dimuat terpisah |
| Privasi | Tanpa nama asli; hanya kode siswa; kunci rahasia hanya di backend |
| Aksesibilitas | Teks ≥ 16 px, kontras cukup, tombol ≥ 44 px, ada Bacakan |
| Ketersediaan backend | Layanan gratis bisa "tidur"; aplikasi tetap jalan & antre kirim data |

## 8. Di luar cakupan
Materi selain Pythagoras, akun guru lengkap, chat, papan peringkat antarsiswa, pembayaran.

## 9. Hasil wawancara pengembang (AI → Azkiah)
Jawaban lengkap ada di [task.md](task.md) bagian F: HP campuran (dibuat ringan), kuota HP siswa, PWA dari Chrome, satu siswa satu HP,
kode siswa = kelas + nomor absen, 3D tangga–dinding, backend Render, dan animasi dipertahankan.

**Risiko & mitigasi kode kelas+absen:** kode mudah ditebak → hanya kode yang didaftarkan peneliti yang diterima, dibatasi 5 percobaan/menit,
dan kode dinonaktifkan setelah penelitian selesai.
