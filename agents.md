# agents.md — Panduan untuk AI Agent / Asisten Koding

Dokumen ini dibaca oleh AI (mis. Claude Code) sebelum mengubah kode proyek ini. Tujuannya agar setiap perubahan
konsisten dengan rancangan penelitian, teori beban kognitif, dan aturan privasi.

## 1. Konteks proyek
- Aplikasi belajar **Penerapan Teorema Pythagoras** untuk **siswa SMP kelas VIII**, dipakai terutama di **smartphone Android**.
- Tujuan pedagogis: meningkatkan **literasi matematis** dengan mengelola **beban kognitif** (IL dikelola, EL ditekan, GL didorong).
- Dokumen acuan: [prd.md](prd.md), [design.md](design.md), [architecture.md](architecture.md), [api.md](api.md), [task.md](task.md).

## 2. Teknologi & perintah
| Bagian | Teknologi | Perintah |
| --- | --- | --- |
| Frontend | React 19 + Vite (JavaScript), three.js | `npm install`, `npm run dev`, `npm run lint`, `npm run build` |
| Backend | FastAPI (Python 3.11+) | `pip install -r backend/requirements.txt`, `uvicorn backend.main:app --reload` |
| Analisis | Python (pustaka bawaan) | `python analisis/analisis.py analisis/contoh_data.csv` |
| Lembar tes cetak | Node | `node scripts/buat-lembar-tes.mjs` |

Sebelum menyelesaikan pekerjaan: **`npm run lint` dan `npm run build` harus lolos**, dan perubahan tampilan dicek di ukuran HP (375×812) dan laptop.

## 3. Gaya kode
- Nama variabel, fungsi, komponen, dan komentar dalam **Bahasa Indonesia** (mis. `catatAktivitas`, `TombolBacakan`).
- JavaScript: **tanpa titik koma**, kutip tunggal, lebar baris ±130 (`npx prettier --no-semi --single-quote --print-width 130`).
  Jangan memformat ulang berkas yang tidak diubah.
- Python: PEP 8, fungsi kecil dengan docstring Bahasa Indonesia.
- Komentar menjelaskan **mengapa** (alasan pedagogis/teknis), bukan mengulang kode.

## 4. Aturan pedagogis (wajib)
1. **Satu konsep per layar**; jangan menumpuk teks panjang.
2. **Teks, gambar, dan label sisi berdekatan** (hindari split-attention).
3. Warna di layar soal hanya untuk membedakan **sisi diketahui** dan **sisi yang dicari**.
4. Animasi hiasan **tidak boleh** muncul di layar soal/tes; hormati Mode Fokus dan `prefers-reduced-motion`.
5. Petunjuk bertingkat (5 tingkat) dan memudar; jangan langsung memberi jawaban kecuali setelah 2 kali salah.
6. Saat tes (pre-test/post-test/kuesioner): tanpa umpan balik benar/salah, tanpa musik, tanpa hiasan, menu lain dikunci.

## 5. Privasi & keamanan (wajib)
- **Jangan pernah** menyimpan atau menampilkan nama asli siswa di kode, data contoh, prompt, atau repositori. Gunakan kode siswa (`PYT-01`) atau "Siswa A".
- **Jangan** commit rahasia: `SUPABASE_SERVICE_KEY`, `KUNCI_TOKEN`, password database. Hanya *publishable key* yang boleh ada di `.env` publik.
- CSV data asli (`analisis/*.csv` selain contoh) di-*ignore* git.
- Saat menguji di komputer, **jangan menulis ke Supabase produksi**: jalankan frontend dengan `VITE_SUPABASE_URL=` kosong atau backend dengan basis data uji.
- Menghapus data di Supabase hanya atas permintaan eksplisit pemilik proyek.

## 6. Struktur penting
- `src/tes.js` — butir pre/post-test & Leppink (sumber tunggal; lembar cetak dibuat dari sini).
- `src/materi.js` — isi 3 sesi materi.
- `src/penyimpanan.js` — antrean offline & pengiriman data.
- `analisis/analisis.py` — kunci jawaban harus **sama** dengan `src/tes.js` (dan nanti `backend/penilaian.py`).
- `public/sw.js` — service worker; naikkan `VERSI` bila strategi cache berubah.

## 7. Alur kerja
1. Baca dokumen acuan yang relevan, lalu rencanakan perubahan kecil.
2. Ubah kode, jalankan lint & build, cek tampilan di HP dan laptop.
3. Perbarui dokumentasi (README / dokumen terkait) bila perilaku berubah.
4. Commit dengan pesan Bahasa Indonesia yang menjelaskan apa & mengapa.
