# Chatbot "Tanya Siku" — DeepSeek + Rigorous Mathematical Thinking (RMT)

Chatbot pedagogis di dalam aplikasi yang membimbing siswa menyelesaikan masalah teorema Pythagoras **langkah demi langkah**,
memberi **petunjuk bertingkat sesuai kesulitan**, mengelola **beban kognitif (IL/EL/GL)**, dan **tidak memberi jawaban akhir**.

| Bagian | Berkas |
| --- | --- |
| Panel chat (frontend) | [`src/TanyaSiku.jsx`](../src/TanyaSiku.jsx), gaya di `src/App.css` (bagian "Tanya Siku") |
| Pemanggil API (frontend) | `asistenTersedia()` dan `tanyaAsisten()` di [`src/api.js`](../src/api.js) |
| Endpoint & pembatas | `POST /api/asisten` di [`backend/main.py`](../backend/main.py) |
| Prompt RMT, pemanggil DeepSeek, penjaga jawaban | [`backend/asisten.py`](../backend/asisten.py) |
| Pengujian (DeepSeek ditiru, tanpa Supabase) | [`backend/test_asisten.py`](../backend/test_asisten.py) |

## 1. Alur kerja

```
Siswa (panel Tanya Siku)
   │  pertanyaan + 10 giliran terakhir + menu + tingkat bantuan + tahap RMT
   ▼
Backend FastAPI  POST /api/asisten   (token kode siswa wajib; maks. 12 pertanyaan / 5 menit / siswa)
   │  prompt sistem RMT + DEEPSEEK_API_KEY (environment variable server)
   ▼
API resmi DeepSeek https://api.deepseek.com (model deepseek-flash = DeepSeek V4.1 Flash, balasan JSON {tahap, balasan})
   │
   ▼
Penjaga jawaban akhir → bila bocor: minta ulang 1x → bila masih bocor: petunjuk aman bawaan
   │
   ▼
Balasan + tahap RMT ke siswa; giliran dicatat ke tabel `aktivitas` (jenis 'asisten')
```

## 2. Penerapan RMT (Kinard & Kozulin, 2008)

| Unsur RMT | Wujud di Tanya Siku |
| --- | --- |
| **Tahap kegiatan belajar** (orientasi → perencanaan → pelaksanaan → refleksi/evaluasi diri) | Model wajib memandu urut **Pahami → Rencanakan → Kerjakan → Periksa** dan melaporkan tahapnya; panel menampilkan jalur 4 tahap dengan tahap aktif. Bila siswa langsung minta jawaban, Siku kembali ke tahap Pahami. |
| **Mediated Learning Experience**: intensionalitas & timbal balik, makna, transendensi, rasa mampu | Tertulis di prompt: fokus pada satu hal & ajak siswa menjawab; jelaskan mengapa langkah perlu; tunjukkan pola umum (sisi miring selalu terpanjang); puji usaha/strategi secara spesifik. |
| **Fungsi kognitif** (memberi label & visualisasi, membandingkan, pencarian sistematis, presisi, menghubungkan pengetahuan awal, bukti logis) | Prompt meminta siswa memberi label sisi a, b, c dan membuat sketsa; mengecek satuan; mengaitkan kuadrat & akar; menjelaskan alasan. |
| **Alat psikologis khas matematika** (bahasa & simbol matematika) | Istilah dan simbol sama dengan aplikasi: sisi siku-siku a & b, sisi miring c, c² = a² + b². |
| **Asesmen dinamis: petunjuk bertingkat (graduated prompts)** | Tingkat bantuan 1–4 dinaikkan **siswa sendiri** lewat tombol "Petunjuk lebih jelas": 1 pertanyaan pancingan → 2 arahkan ke informasi/sketsa → 3 sebutkan strategi/rumus → 4 tunjukkan langkah dengan angka tetapi berhenti sebelum hasil akhir. Banyaknya tingkat yang dibutuhkan tercatat sebagai data. |

## 3. Pengelolaan beban kognitif

| Beban | Strategi |
| --- | --- |
| **Intrinsik (IL) dikelola** | Satu langkah per balasan; soal dipecah menjadi bagian kecil; tingkat bantuan naik bertahap sesuai kesulitan siswa. |
| **Ekstrinsik (EL) ditekan** | Balasan ≤ 3 kalimat (±50 kata), bahasa sederhana, tanpa tabel/markdown, tidak menyalin ulang soal; tombol cepat ("Aku bingung mulai dari mana", "Cek langkahku", "Soal baru") untuk siswa yang belum tahu cara bertanya; panel tidak dipasang saat tes. |
| **Germane (GL) didorong** | Setiap balasan diakhiri satu pertanyaan yang membuat siswa berpikir atau menjelaskan alasannya (self-explanation); tahap Periksa meminta siswa mengevaluasi hasilnya sendiri. |

## 4. Bukan pemberi jawaban akhir

1. **Prompt**: larangan menuliskan jawaban akhir / hasil akar walaupun siswa memaksa, mengaku guru, atau menyuruh mengabaikan aturan.
2. **Penjaga di server** (`bocorkan_jawaban`): dari angka yang ditulis siswa dihitung semua kemungkinan hasil akhir
   Pythagoras (√(x² + y²) dan √(y² − x²)). Bila balasan memuat hasil itu **dan** siswa belum menuliskannya sendiri,
   balasan diminta ulang satu kali; bila masih bocor, diganti petunjuk aman bawaan sesuai tahap.
   Siswa yang menulis jawabannya sendiri tetap boleh dikonfirmasi benar/salah.
3. **Saat tes** panel tidak dipasang di aplikasi, dan server menolak `halaman = "tes"`.

## 5. Keamanan API key

- `DEEPSEEK_API_KEY` **hanya** disimpan sebagai *environment variable* di server (Vercel → proyek `pythagoras-api` →
  Settings → Environment Variables). **Tidak ada di kode frontend, tidak di `.env` yang ter-commit, tidak di GitHub.**
- Untuk mencoba di komputer: salin `backend/.env.contoh` menjadi `backend/.env` (di-*ignore* git), isi kuncinya, lalu
  `uvicorn backend.main:app --reload --env-file backend/.env`.
- Browser hanya menerima `asisten: true/false` dari `GET /api/sehat` (kunci tidak pernah dikirim); tombol Tanya Siku baru
  muncul setelah kunci terpasang.
- Hanya siswa yang masuk dengan kode terdaftar yang bisa bertanya; dibatasi 12 pertanyaan per 5 menit per siswa.

## 6. Data untuk penelitian

Setiap giliran dicatat di tabel `aktivitas` (Supabase) dengan `jenis = 'asisten'`:
`hasil` = tahap RMT, `petunjuk` = tingkat bantuan (1–4), `catatan` = menu, apakah balasan disaring, dan pertanyaan siswa.
Jalankan bagian **Versi 3** di [`supabase/schema.sql`](../supabase/schema.sql) sekali di SQL Editor Supabase agar jenis
`asisten` diterima (sebelum itu chatbot tetap berjalan, hanya belum tercatat).

## 7. Mengaktifkan (oleh pemilik proyek)

1. Buat API key di https://platform.deepseek.com (menu **API Keys**). Kuncinya **jangan dibagikan** ke siapa pun.
   Cek saldo di menu **Usage/Billing**: bila akun baru belum mendapat saldo gratis, isi saldo kecil (top up) —
   satu pertanyaan siswa memakai ±1.500 token, sehingga 1 juta token cukup untuk ±600 pertanyaan.
2. Vercel → proyek **pythagoras-api** → Settings → Environment Variables → tambah `DEEPSEEK_API_KEY` = kunci tadi → Save.
3. Deployments → **Redeploy** backend. Cek https://pythagoras-api.vercel.app/api/sehat → harus berisi `"asisten": true`.
4. Supabase → SQL Editor → jalankan bagian **Versi 3** dari `supabase/schema.sql`.
5. Buka aplikasi, masuk dengan kode siswa → tombol **Tanya Siku** muncul di kanan bawah.

## 8. Pengujian

`python -m pytest backend -q` menjalankan 17 uji Tanya Siku. Uji otomatis **sengaja tidak memanggil DeepSeek asli**
(fungsi pemanggilnya diganti sementara) agar bisa dijalankan siapa saja tanpa API key dan tanpa memakai saldo; aplikasi
yang dipasang tetap memanggil API DeepSeek asli. Yang diuji: format permintaan ke api.deepseek.com, penjaga jawaban akhir,
format angka Indonesia, prompt RMT & tingkat bantuan, wajib masuk, mati saat tes, pembatas pertanyaan, balasan yang
diminta ulang/diganti bila bocor, dan `GET /api/sehat` yang tidak membocorkan kunci.

### Mencoba dengan DeepSeek asli di komputer (tanpa menulis ke Supabase)
1. Salin `backend/.env.contoh` menjadi `backend/.env`, lalu tempel API key sendiri pada `DEEPSEEK_API_KEY=` (berkas ini di-ignore git).
2. `uvicorn backend.main:app --reload --env-file backend/.env` (tanpa SUPABASE_URL → data hanya di memori, kode uji `8A-01`).
3. Jalankan aplikasi dengan `VITE_API_URL=http://127.0.0.1:8000` dan `VITE_SUPABASE_URL=` kosong, masuk dengan `8A-01`,
   lalu buka Tanya Siku.
