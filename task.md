# task.md — Daftar Tugas Pengembangan (ADDIE)

Tanda: `[x]` selesai · `[ ]` belum · 🔁 = perlu disesuaikan dengan revisi dosen

## A. Analysis
- [x] Wawancara kebutuhan siswa (pedoman + data simulasi S01, kelas IX-B)
- [x] Peta temuan IL/EL/GL → kebutuhan fitur ([prd.md](prd.md) §5)
- [x] Keputusan teknis dari catatan dosen (FastAPI, Supabase, kode siswa, Bahasa Indonesia, three.js)
- [x] **Wawancara kebutuhan Android dengan pengembang** (lihat bagian F) — dijawab Azkiah
- [ ] Wawancara siswa sungguhan (minimal 2 informan) + persetujuan orang tua & siswa

## B. Design
- [x] prd.md, readme.md, agents.md, architecture.md, task.md, design.md, api.md
- [ ] Materi ajar PDF berdasarkan temuan wawancara (Langkah 2 dosen)
- [ ] Wireframe layar Android (Masuk, Soal cerita, Ilustrasi 3D)
- [ ] Bank soal latihan berjenjang (tingkat 1–3, ≥ 10 soal per tingkat)
- [ ] Validasi ahli materi & media (lembar penilaian)

## C. Development
### Sudah ada (versi 1)
- [x] React + Vite PWA, bisa di-install di Android
- [x] Materi 3 sesi + cek pemahaman + Bacakan
- [x] Kalkulator dengan langkah penyelesaian
- [x] Latihan pertemuan 4 + pencatatan aktivitas
- [x] Pre-test, post-test, kuesioner Leppink + lembar cetak
- [x] Supabase (tabel `hasil`, `aktivitas`) + keep-alive
- [x] Analisis Python (N-gain, Leppink, jejak belajar, data kertas)

### Revisi (versi 2)
- [ ] 🔁 Login **kode siswa** (ganti nama + sekolah)
- [ ] 🔁 Backend **FastAPI** (Python) di Render: `/masuk`, `/aktivitas`, `/hasil`, `/sehat`
- [ ] 🔁 Penilaian tes pindah ke server; Supabase hanya ditulis backend
- [ ] **three.js**: adegan tangga–dinding yang bisa diputar (lazy load)
- [ ] Latihan **identifikasi sisi miring** pada segitiga yang diputar (IL1)
- [ ] Penanda **Diketahui/Ditanya** pada soal cerita (EL1, EL5)
- [ ] **Petunjuk bertingkat** 5 tahap + fading (GL3)
- [ ] Pertanyaan **refleksi** "Mengapa…?" (GL4) & **cek kewajaran** (GL2)
- [ ] **Cek prasyarat** kuadrat/akar di awal (IL3)
- [x] Animasi & hiasan **dipertahankan apa adanya** (keputusan pengembang); tetap disembunyikan saat tes

## D. Implementation
- [ ] Uji coba di 2–3 HP Android (murah & menengah)
- [ ] Bagikan kode siswa, pre-test (pertemuan 1)
- [ ] Sesi 1–3 (pertemuan 1–3), implementasi (pertemuan 4)
- [ ] Post-test + kuesioner Leppink (pertemuan 5)

## E. Evaluation
- [ ] Analisis N-gain, Leppink, jumlah petunjuk, identifikasi sisi miring
- [ ] Bandingkan kelompok aplikasi vs diajar langsung
- [ ] Revisi aplikasi berdasarkan temuan; laporan ADDIE

## F. Wawancara kebutuhan Android (AI → pengembang)
Pertanyaan yang diajukan AI kepada Azkiah sebelum coding (jawaban dicatat di sini):

| No | Pertanyaan | Jawaban |
| --- | --- | --- |
| 1 | HP Android seperti apa yang dipakai siswa (merek/RAM/ukuran layar)? | Belum dipastikan → aplikasi dibuat ringan untuk HP campuran |
| 2 | Bagaimana akses internet saat pembelajaran (Wi-Fi sekolah, kuota, tidak ada)? | **Kuota HP siswa** → hemat data, bisa offline setelah dibuka sekali |
| 3 | Aplikasi dipasang sebagai PWA (dari Chrome) atau file APK? | **PWA dari Chrome** (tanpa APK) |
| 4 | Seberapa banyak animasi/hiasan yang diinginkan, mengingat temuan EL3? | **Animasi tetap seperti sekarang, tidak diubah** (keputusan pengembang) |
| 5 | Siapa yang membagikan kode siswa, dan formatnya? | **Kelas + nomor absen**, mis. `8A-07`, didaftarkan peneliti |
| 6 | Di mana ilustrasi 3D three.js paling dibutuhkan? | **Tangga & dinding** (soal tangga dari wawancara) |
| 7 | HP dipakai sendiri atau bergantian? | **Satu siswa satu HP** → cukup masuk sekali |
| 8 | Backend gratis mana yang dipilih (Render / lainnya)? | **Render** (free web service) |
