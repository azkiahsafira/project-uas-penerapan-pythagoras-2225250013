# changelog.md — Riwayat Perubahan

Format: tanggal · versi · perubahan utama. Rincian lengkap ada di riwayat commit GitHub.

## [2.19] · 18 November 2026 — Font permen karet, Raka & Nisa berhoodie hewan
- Font diganti: **Bubblegum Sans** untuk judul & tombol, **Itim** untuk teks.
- Judul PELITA dipindah ke tengah header dan diperbesar, beserta kepanjangan & artinya.
- Raka kini memakai hoodie dinosaurus biru muda (duri pink & ekor kecil); Nisa memakai hoodie kucing pink muda
  bertelinga dengan kerudung putih di dalam tudungnya. Animasi melambai, berkedip, dan melirik tetap sama.
- Versi cache PWA dinaikkan (`pythagoras-v6`) agar HP memuat tampilan baru.

## [2.18] · 18 November 2026 — Tema kawaii "PELITA" (biru muda & pink muda)
- Judul aplikasi menjadi **PELITA** (PEnerapan · Learning · pItagoras · Teorema · Azkiah Safira), artinya ditulis di bawahnya:
  "Pelita = penerang belajar Teorema Pythagoras". Judul tab & nama aplikasi di HP ikut berganti.
- Tema baru bergaya kawaii orisinal: header berpelangi & awan, latar 3D toon "Dunia Sahabat Kawaii" yang ikut bergerak saat
  pindah menu, dan empat sahabat: **Kuadra si penguin (a²)**, Lila si domba (b²), Hipo si beruang (c²), Akar si kucing (√).
- Font lucu di seluruh aplikasi (Mochiy Pop One & Sniglet); kursor kartun (penguin Kuadra, sarung tangan di atas tombol)
  dengan cincin & letupan hati saat klik.
- Enam animasi perayaan berbeda setiap jawaban benar (tidak pernah sama dua kali berturut-turut) dan lagu latar "Lagu 3-4-5".
- Versi cache PWA dinaikkan (`pythagoras-v5`) agar HP otomatis memuat tampilan baru; `Lautan.jsx` (tema lama) dihapus.

## [2.17] · 18 November 2026 — Tanya Siku: kode alasan & model cadangan gratis
- Bila DeepSeek gagal, pesan menampilkan kode alasan (mis. `deepseek:saldo_habis`) dan galatnya tercatat di log Vercel.
- Model cadangan gratis (OpenRouter, `CADANGAN_API_KEY`) dipakai hanya bila DeepSeek gagal; panel menampilkan dengan jujur
  model mana yang menjawab ("Dijawab oleh: …"). DeepSeek tetap integrasi utama dan otomatis dipakai lagi bila saldo diisi.

## [2.16] · 17 November 2026 — Chatbot "Tanya Siku" (DeepSeek + RMT)
- Tombol **Tanya Siku** di kanan bawah membuka panel chat: Siku membimbing langkah demi langkah mengikuti tahap RMT
  **Pahami → Rencanakan → Kerjakan → Periksa**, dengan **petunjuk bertingkat 1–4** yang dinaikkan siswa sendiri.
- Tidak memberi jawaban akhir: dilarang di prompt dan diperiksa di server (balasan yang memuat hasil akhir diminta ulang
  atau diganti petunjuk aman). Panel tidak tersedia saat tes.
- Beban kognitif: satu langkah per balasan (IL), balasan ≤ 3 kalimat & tombol cepat (EL), setiap balasan diakhiri
  pertanyaan agar siswa menjelaskan alasannya (GL).
- API key DeepSeek hanya di environment variable backend (`DEEPSEEK_API_KEY`), tidak di frontend/GitHub; tombol baru muncul
  setelah kunci terpasang. Setiap giliran dicatat ke `aktivitas` (jenis `asisten`). Rincian: docs/chatbot-tanya-siku.md.
- Lembar uji coba tes Mathematical Literacy (kelas 9) dengan kotak jawaban & skor per tahap rubrik.

## [2.15] · 17 November 2026 — Header bawah laut & menu yang bergeser
- Header diganti bertema **bawah laut**, selaras dengan latar akuarium 3D: air biru soft → pink soft, ombak di permukaan,
  sinar matahari, gelembung berisi simbol Pythagoras (a², b², c², √, 90°), rumput laut, pasir, penyu & ikan kecil.
- Gedung sekolah diganti **kapal selam Pythagoras** bermata besar: menaranya segitiga siku-siku bersisi 3-4-5, jendelanya
  9 + 16 = 25 (makin besar sesuai luas persegi). Bisa diklik: melaju, baling-baling berputar kencang, dan berbicara.
- **Menu berjalan:** penanda gelembung meluncur ke menu terpilih sambil ditunggangi ikan kecil; halaman baru bergeser masuk
  (menu berikutnya dari kanan, sebelumnya dari kiri); di HP layar bisa digeser kiri/kanan untuk pindah menu; di bawah setiap
  halaman ada jalur Belajar → Kalkulator → Latihan Soal → Tes dengan tombol sebelumnya/berikutnya.

## [2.14] · 16 November 2026 — Latar "Akuarium 3D" & menu Tes lebih ringkas
- Latar diganti menjadi **akuarium 3D**: ikan gemuk, ubur-ubur bercahaya, ikan buntal, kerang bermutiara, bintang laut, dan
  batu segitiga 3-4-5 bermata besar berkilau yang **melirik ke arah kursor/jari** dan berkedip. Sinar matahari menembus air,
  pola cahaya di pasir, dasar laut yang menjauh ke kabut, efek bersinar (bloom, khusus layar besar), rumput laut & gelembung.
- Bisa diklik: ikan berputar, ubur-ubur berkilat, buntal mengembang berduri, kerang membuka mutiara, batu & bintang melompat;
  klik air kosong memunculkan gelembung dan ikan-ikan berenang mendekat. Sirip punggung ikan berbentuk segitiga siku-siku.
- Menu Tes: label "Pertemuan 1" dan "Pertemuan 5" dihapus; cukup Pre-test, Post-test, dan Kuesioner Beban Kognitif
  ("Setelah post-test"). Pesan kunci juga tidak lagi menyebut nomor pertemuan.

## [2.13.1] · 16 November 2026 — Latar pulau melayang lebih ramai
- Gerak di seluruh layar: kelopak bunga berjatuhan, gelembung sabun pelangi yang naik, 5 kupu-kupu, 5 burung, 3 balon udara.
- Kincir angin berputar di pulau kecil, ikan melompat dari kolam kebun, kelinci kedua melompat-lompat di pulau tiang bendera.
- Pulau mengambang & berayun lebih jelas, awan bergerak lebih cepat, kilauan berkedip lebih sering.

## [2.13] · 16 November 2026 — Latar 3D "Pulau Melayang"
- Tema latar diganti menjadi **diorama pulau melayang** (tidak flat lagi): bayangan nyata dari matahari, pantulan cahaya
  lembut, permukaan mengkilap, kabut kedalaman, dan paralaks; warna tetap biru soft + pink soft.
- Setiap pulau = contoh materi: rumah & tangga bersandar 3 : 4 : 5 dengan kelinci, layang-layang (benang = sisi miring)
  dengan kolam & air terjun, kebun petak 3² + 4² = 5² mengelilingi kolam segitiga siku-siku, tiang bendera dengan tali
  penyangga + tanda sudut siku-siku. Ditambah pulau kecil, balon udara bergaris, burung, awan empuk, dan kilauan.

## [2.12] · 16 November 2026 — Latar 3D lebih imut & ramai
- Karakter bergaya **chibi**: mata besar berkilau yang berkedip, pipi merona, mulut terbuka saat diklik, Siku punya tangan
  yang melambai dan memantul lembut; kubus 3² + 4² = 5² membulat dan ikut berwajah.
- **Lebih terasa 3D:** cahaya lembut dari beberapa arah (putih, pink, biru), kabut pastel, dan sudut pandang yang ikut
  bergeser saat tetikus digerakkan/halaman digulir (paralaks).
- **Lebih ramai:** pelangi pastel, 3 balon segitiga siku-siku, 3 awan & 2 bintang berwajah, hati, dan kilauan bercahaya.
- Warna langit biru soft + pink soft yang lebih cerah; di HP objek lebih kecil dan "mengintip" dari tepi agar tulisan tetap jelas.

## [2.11] · 16 November 2026 — Latar 3D "Langit Pythagoras"
- Latar Bawah Laut diganti latar **3D (three.js)** bertema materi, warna **biru soft + pink soft**: Siku segitiga siku-siku berwajah,
  menara kotak 3² + 4² = 5², layang-layang dengan benang (sisi miring), tangga bersandar dengan kelinci; awan, hati, bintang.
  Objek bisa diklik (bereaksi + balon kata). Hemat baterai/kuota; mati saat tes, saat "Animasi: mati", dan prefers-reduced-motion.

## [2.10] · 11 November 2026 — Lebih banyak Python & JavaScript (saran dosen)
- **Python:** `analisis/ekspor_jawaban_literasi.py` (lembar penilaian jawaban uraian dari data Supabase + `skor_literasi.csv`),
  `analisis/test_analisis.py` (17 pengujian pytest), analisis utama melewati tes uraian.
- **JavaScript:** `tests/*.test.mjs` (16 pengujian `node:test`) + `npm test`.
- GitHub Actions menjalankan lint, build, `npm test`, dan pytest backend + analisis setiap push.
- `.gitattributes`: dokumen yang dibuat otomatis (bukti AI, materi & lembar cetak HTML) ditandai dokumentasi, sehingga
  statistik bahasa GitHub menampilkan kode program yang sebenarnya (Python & JavaScript).

## [2.9.1] · 11 November 2026
- Tes Mathematical Literacy **dinyalakan** (`VITE_TES_LITERASI=1`): pre-test & post-test kini 4 soal uraian. Siswa manual memakai
  `docs/instrumen-cetak-literasi`; lembar tes 10 soal lama tidak dipakai lagi.

## [2.9] · 11 November 2026 — Tes Mathematical Literacy (disiapkan)
- 4 soal Mathematical Literacy dari tugas kisi-kisi dosen (Reasoning, Formulating, Employing, Interpreting & Evaluating; total 24)
  disiapkan sebagai pre-test & post-test: menu Tes mode uraian (sakelar `VITE_TES_LITERASI`, **belum dinyalakan**), backend
  menyimpan tanpa skor otomatis, `analisis/analisis_literasi.py` + `templat_skor_literasi.csv`, lembar tes & rubrik cetak
  (`docs/instrumen-cetak-literasi`).

## [2.8] · 11 November 2026 — Lembar latihan cetak
- Lembar **latihan soal pertemuan 4** untuk siswa yang diajar langsung: 12 soal berjenjang (angka → gambar diputar → cerita),
  Strategi 5 Langkah, angka baru (tidak sama dengan materi PDF & pre/post-test); **kunci terpisah** untuk guru. `docs/latihan-cetak`.

## [2.7] · 11 November 2026 — Lembar validasi ahli
- Lembar validasi **ahli materi** & **ahli media** siap cetak (masing-masing 20 butir, skala 1–4, saran, kesimpulan kelayakan)
  di `docs/validasi`, dibuat oleh `scripts/buat-lembar-validasi.mjs`.

## [2.6.1] · 11 November 2026
- Kode siswa `8A-01` s.d. `8F-36` diaktifkan lagi; `8Z-99` (demo) tetap nonaktif. Bukti percakapan AI diperbarui.

## [2.6] · 11 November 2026 — Urutan pertemuan dikunci
- Belajar (cek prasyarat & Sesi 1–3) terbuka setelah pre-test; Latihan setelah Sesi 3; post-test setelah Latihan ≥ 10 soal;
  kuesioner setelah post-test (`src/alur.js`). Skor & tingkat Latihan dilanjutkan dari catatan di perangkat.
- Pre-test, post-test, kuesioner **hanya sekali** per kode: tombol "✓ Sudah dikerjakan", backend menolak 409 `sudah_dikerjakan`.
- Analisis memakai percobaan **pertama** bila ada tes ganda; kelompok `Uji coba peneliti` (kode demo) tidak dianalisis.

## [2.5] · 10 November 2026 — Analisis literasi matematis
- `analisis.py`: skor **literasi matematis per proses** (merumuskan no 1, 4, 8, 10 · menerapkan no 2, 3, 5, 6 · menafsirkan no 7, 9),
  pre → post dan N-gain per proses, per siswa & per kelompok; `rekap_literasi.csv` dan `grafik_literasi.svg`. Soal tes tidak diubah.

## [2.4.1] · 10 November 2026
- Semua kode siswa dinonaktifkan sampai kode siswa penelitian diketahui (hanya 1 siswa memakai aplikasi).
- Bukti percakapan AI diperbarui sampai sesi pindah link.

## [2.4] · 10 November 2026 — Link aplikasi baru
- Aplikasi pindah ke **https://azkiah-safira-pythagoras.vercel.app** (Vercel). Link lama GitHub Pages dimatikan.
- CORS backend hanya mengizinkan link baru; workflow GitHub kini hanya memeriksa lint & build.
- Link memakai nama: **https://azkiah-safira-pythagoras.vercel.app**. Link lama GitHub Pages & `penerapan-pythagoras.vercel.app`
  membalas 404, dan salinan aplikasi di perangkat yang pernah membukanya dihapus otomatis (`sw-mati.js`).

## [2.3.1] · 10 November 2026
- Pemberitahuan **"Versi baru aplikasi sudah tersedia → Perbarui sekarang"** untuk aplikasi yang di-install di HP; cache service worker v4.

## [2.3] · 10 November 2026 — Soal disamakan dengan materi PDF
- Belajar mengikuti urutan & contoh PDF: kuadrat → akar → tabel kuadrat → segitiga siku-siku → sisi miring pada segitiga diputar;
  memilih rumus; Strategi 5 Langkah; panjang tangga 3–4–5, layang-layang 20–21–29, jarak terpendek 15–20–25, diagonal layar 21–28–35, tripel Pythagoras.
- Latihan berjenjang (angka → gambar → cerita) dengan konteks PDF; tripel yang sama dengan pre/post-test tidak dipakai lagi.
- Contoh Kalkulator = Contoh 1–3 PDF + diagonal layar. Pre-test/post-test tidak diubah (sudah sesuai indikator materi).

## [2.2] · 10 November 2026 — Aplikasi tersambung ke backend Python
- Kode siswa `8A-01` s.d. `8F-36` (216 kode) didaftarkan di tabel `siswa`; hanya kode terdaftar yang bisa masuk.
- Aplikasi memakai backend FastAPI di Vercel (`VITE_API_URL`): login dicek server, nilai tes dihitung di server.
- Kode dirapikan otomatis: `8a-1` → `8A-01`.
- Dokumen diselaraskan (backend Vercel), 24 screenshot, bukti percakapan AI diperbarui.

## [2.1] · 10 November 2026 — Fitur dari temuan wawancara
- **Cek prasyarat** kuadrat & akar (4 soal) sebelum Sesi 1; skor < 3 diarahkan ke bagian kuadrat & akar Sesi 1 (IL3).
- Latihan per soal: **1) Diketahui & Ditanya** (ketuk angka di soal, tentukan sisinya) → **2) tunjuk sisi miring** pada segitiga
  yang diputar/dicerminkan → **3) hitung** (EL1, IL1, IL2).
- **Petunjuk bertingkat** 5 tahap; bantuan **memudar** setelah 3 soal benar tanpa bantuan dan muncul lagi bila salah (GL3).
- **Cek kewajaran** sebelum jawaban dinilai (sisi miring harus terpanjang) + kalimat kewajaran di pembahasan (GL2).
- **Refleksi "Mengapa…?"** setiap soal ke-3, dengan alasan tertulis opsional (GL4).
- Data baru di tabel `aktivitas`: kolom `petunjuk` & `catatan`, jenis `prasyarat` & `refleksi`; analisis Python menampilkan
  petunjuk per soal (soal 1–5 vs 6+), refleksi benar, dan skor prasyarat. Animasi tidak diubah.

## [2.0] · 9 November 2026 — Coding (Langkah 4)
- **Backend Python + FastAPI** (`backend/`): masuk dengan kode siswa (token HMAC, batas percobaan), penilaian pre/post-test & Leppink di server,
  simpan hasil & aktivitas (kirim ulang aman), soal latihan berjenjang, rekap & ekspor CSV peneliti; 14 pengujian pytest; `render.yaml`.
- **React**: login **kode siswa** (`8A-07`) menggantikan nama + sekolah di menu Belajar, Latihan, dan Tes; penghubung API dengan cadangan ke Supabase langsung.
- **three.js**: ilustrasi 3D tangga–dinding yang bisa diputar, dengan segitiga siku-siku & label (biru = diketahui, merah muda = dicari); dimuat hanya saat dibuka.
- Tabel `siswa` di `supabase/schema.sql` untuk daftar kode siswa.
- Backend terpasang di **Vercel**: https://pythagoras-api.vercel.app (Render kini meminta kartu pembayaran untuk paket gratis).

## [2.0-rancangan] · 9 November 2026 — Revisi dosen
- Dokumen perancangan: prd, readme, agents, architecture, task, design, api.
- Wawancara kebutuhan Android (AI → pengembang): kuota HP siswa, PWA, kode siswa kelas + absen, 3D tangga–dinding, backend Render, animasi dipertahankan.
- Materi ajar PDF bab Teorema Pythagoras, subbab Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah (11 halaman).
- Dokumen tambahan: testing, deploy, privasi, konten, panduan, changelog.
- Musik latar ceria dengan tombol nyala/mati (mengecil saat Bacakan, berhenti saat tes).

## [1.3] · 8 November 2026 — Penyempurnaan tampilan & instrumen
- Latihan menjadi **Pertemuan 4 (implementasi)**, tercatat ke database.
- Layar perayaan penuh saat benar, pesan semangat saat salah.
- Header halaman sekolah (gedung SMP, Siku, Raka, Nisa berdiri di rumput, bus sekolah), balon kata di atas karakter yang bicara.
- Latar belakang **Bawah Laut** di semua menu; hewan laut bisa diklik; kotak tembus pandang.
- Lembar tes cetak + input jawaban kertas di analisis Python; pilihan kelompok "Diajar langsung" dihapus dari aplikasi.
- Screenshot & bukti percakapan AI diperbarui; bukti AI bisa dibuka sebagai halaman web.

## [1.2] · 7 November 2026 — Tampilan & PWA
- Tema biru muda + pink, maskot Siku, siswa Raka & siswi Nisa, hewan, pelangi, prisma 3D.
- PWA: bisa di-install dan dipakai offline.
- Tombol **Bacakan** (narasi suara), pencatatan aktivitas belajar.
- Workflow agar Supabase tidak dijeda; kelas hanya Kelas 8.

## [1.1] · 7 November 2026 — Penelitian
- Materi 3 sesi berbasis teori beban kognitif.
- Pre-test, post-test, kuesioner Leppink; penyimpanan ke Supabase.
- Script Python analisis (N-gain, Leppink).

## [1.0] · 7 November 2026 — Awal
- Kalkulator teorema Pythagoras dengan langkah penyelesaian, latihan soal, README, deploy GitHub Pages.
