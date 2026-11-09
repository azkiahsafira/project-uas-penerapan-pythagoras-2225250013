# task.md — Daftar Tugas Pengembangan (ADDIE)

Tanda: `[x]` selesai · `[ ]` belum · 🔁 = perlu disesuaikan dengan revisi dosen

## A. Analysis
- [x] Wawancara kebutuhan siswa (pedoman + data simulasi S01, kelas IX-B)
- [x] Peta temuan IL/EL/GL → kebutuhan fitur ([prd.md](prd.md) §5)
- [x] Keputusan teknis dari catatan dosen (FastAPI, Supabase, kode siswa, Bahasa Indonesia, three.js)
- [ ] **Wawancara kebutuhan Android dengan pengembang** (lihat bagian F) — dijawab Azkiah
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
- [ ] **three.js**: adegan tangga–dinding & layang-layang yang bisa diputar (lazy load)
- [ ] Latihan **identifikasi sisi miring** pada segitiga yang diputar (IL1)
- [ ] Penanda **Diketahui/Ditanya** pada soal cerita (EL1, EL5)
- [ ] **Petunjuk bertingkat** 5 tahap + fading (GL3)
- [ ] Pertanyaan **refleksi** "Mengapa…?" (GL4) & **cek kewajaran** (GL2)
- [ ] **Cek prasyarat** kuadrat/akar di awal (IL3)
- [ ] 🔁 **Mode Fokus**: hiasan & animasi hanya di beranda (EL3, DS03)
- [ ] Opsi paket **APK** (Capacitor)

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
| 1 | HP Android seperti apa yang dipakai siswa (merek/RAM/ukuran layar)? | _(menunggu)_ |
| 2 | Bagaimana akses internet saat pembelajaran (Wi-Fi sekolah, kuota, tidak ada)? | _(menunggu)_ |
| 3 | Aplikasi dipasang sebagai PWA (dari Chrome) atau file APK? | _(menunggu)_ |
| 4 | Seberapa banyak animasi/hiasan yang diinginkan, mengingat temuan EL3? | _(menunggu)_ |
| 5 | Siapa yang membagikan kode siswa, dan formatnya? | _(menunggu)_ |
| 6 | Di mana ilustrasi 3D three.js paling dibutuhkan? | _(menunggu)_ |
| 7 | HP dipakai sendiri atau bergantian? | _(menunggu)_ |
| 8 | Backend gratis mana yang dipilih (Render / lainnya)? | _(menunggu)_ |
