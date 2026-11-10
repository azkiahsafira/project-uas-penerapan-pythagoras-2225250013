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
- [x] Dokumen tambahan (Langkah 3 dosen): konten.md, testing.md, deploy.md, privasi.md, panduan.md, changelog.md
- [x] Materi ajar PDF berdasarkan temuan wawancara (Langkah 2 dosen) → [docs/materi](docs/materi/Materi-Teorema-Pythagoras.pdf)
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
- [x] Login **kode siswa** (ganti nama + sekolah) — `src/Masuk.jsx`
- [x] Backend **FastAPI** (Python): `/masuk`, `/saya`, `/aktivitas`, `/hasil`, `/sehat`, `/soal/latihan`, rekap & ekspor peneliti + 16 pengujian pytest — `backend/`
- [x] Pasang backend di **Vercel** (https://pythagoras-api.vercel.app) — Render kini meminta kartu
- [x] Daftarkan kode siswa `8A-01` s.d. `8F-36` (6 kelas × 36 absen) di tabel `siswa` & sambungkan aplikasi (`VITE_API_URL`)
- [x] Kode `8A-01` s.d. `8F-36` aktif (11 November 2026); `8Z-99` demo nonaktif — lihat [deploy.md](deploy.md) §4
- [x] Penilaian tes di server (`backend/penilaian.py`) — aktif setelah `VITE_API_URL` diisi
- [x] **three.js**: adegan tangga–dinding yang bisa diputar (lazy load) — `src/Tangga3D.jsx`, Sesi 3 langkah "Contoh: tangga"
- [x] Latihan **tunjuk sisi miring** pada segitiga yang diputar/dicerminkan (IL1) — `src/SegitigaPutar.jsx`
- [x] Penanda **Diketahui/Ditanya**: ketuk angka di soal cerita, tentukan sisinya (EL1, EL5) — `src/Latihan.jsx`
- [x] **Petunjuk bertingkat** 5 tahap + fading: bantuan langkah disembunyikan setelah 3 soal benar mandiri, petunjuk tinggal 3 tahap (GL3)
- [x] Pertanyaan **refleksi** "Mengapa…?" setiap soal ke-3 (GL4) & **cek kewajaran** sebelum dinilai (GL2) — `src/bantuan.js`
- [x] **Cek prasyarat** kuadrat/akar (4 soal) sebelum Sesi 1, skor < 3 diarahkan ke Sesi 1 (IL3) — `src/Prasyarat.jsx`
- [x] Jalankan perubahan kolom `aktivitas` (`petunjuk`, `catatan`, jenis `prasyarat`/`refleksi`) di Supabase SQL Editor
- [x] Animasi & hiasan **dipertahankan apa adanya** (keputusan pengembang); tetap disembunyikan saat tes

## D. Implementation
- [ ] Uji coba di 2–3 HP Android (murah & menengah)
- [ ] Bagikan kode siswa, pre-test (pertemuan 1)
- [ ] Sesi 1–3 (pertemuan 1–3), implementasi (pertemuan 4)
- [ ] Post-test + kuesioner Leppink (pertemuan 5)

## E. Evaluation
- [ ] Analisis N-gain, Leppink, **literasi matematis per proses** (script siap: `analisis.py` bagian 3b–3c), jumlah petunjuk, identifikasi sisi miring
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
| 8 | Backend gratis mana yang dipilih (Render / lainnya)? | **Render** (free web service) → akhirnya **Vercel** karena Render meminta kartu |
