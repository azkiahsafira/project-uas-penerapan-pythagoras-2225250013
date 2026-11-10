# api.md — Rancangan API Backend (FastAPI)

> Status: **v2 aktif**. Backend Python **FastAPI** di **Vercel** (gratis), basis data **Supabase** (PostgreSQL).
> Basis URL: `https://pythagoras-api.vercel.app/api` (dokumentasi interaktif: `/docs`) · Format: JSON (UTF-8) · Zona waktu: UTC (ISO 8601)

## 1. Autentikasi — kode siswa
- Siswa masuk dengan **kode siswa = kelas + nomor absen** (mis. `8A-07`) yang didaftarkan peneliti di tabel `siswa`. Tidak ada password dan nama asli.
- Server membalas **token** (HMAC-SHA256, berlaku 30 hari). Token dikirim di header: `Authorization: Bearer <token>`.
- Endpoint peneliti memakai header `X-Kunci-Peneliti` (rahasia di environment variable).

## 2. Ringkasan endpoint

| Metode | Path | Akses | Kegunaan |
| --- | --- | --- | --- |
| GET | `/sehat` | publik | Cek server hidup & "membangunkan" server gratis |
| POST | `/masuk` | publik | Masuk dengan kode siswa → token |
| GET | `/saya` | siswa | Profil singkat (kode, kelas, kelompok) |
| POST | `/aktivitas` | siswa | Kirim catatan belajar (batch) |
| POST | `/hasil` | siswa | Kirim jawaban pre-test/post-test/kuesioner; **dinilai di server** |
| GET | `/soal/latihan` | siswa | Ambil soal latihan berjenjang |
| GET | `/peneliti/rekap` | peneliti | Rekap nilai & beban kognitif per siswa |
| GET | `/peneliti/ekspor/{tabel}` | peneliti | Unduh CSV `hasil` atau `aktivitas` |

## 3. Detail endpoint

### `GET /sehat`
```json
{ "status": "ok", "waktu": "2026-11-10T01:00:00Z" }
```

### `POST /masuk`
Permintaan:
```json
{ "kode": "8A-07" }
```
Balasan 200:
```json
{ "token": "eyJ...", "siswa": { "kode": "8A-07", "kelas": "8", "kelompok": "aplikasi" } }
```
Kesalahan: `404` kode tidak terdaftar · `403` kode dinonaktifkan · `429` terlalu banyak percobaan (5/menit per IP).

### `POST /aktivitas`
```json
{
  "aktivitas": [
    {
      "id": "1794-abc", "jenis": "langkah", "sesi": 2, "langkah": 3, "judul": "Menemukan pola",
      "mulai": "2026-11-10T01:02:00Z", "selesai": "2026-11-10T01:03:10Z",
      "salah": 1, "hasil": "benar", "dibacakan": 0, "petunjuk": 2,
      "catatan": "bantuan:penuh;diketahui_salah:0;miring_salah:1;kewajaran:0"
    }
  ]
}
```
Balasan 200: `{ "diterima": 1, "duplikat": 0 }` — `id` dari aplikasi membuat pengiriman ulang aman (idempoten).
`jenis`: `langkah` · `sesi` · `latihan` · `prasyarat` (cek kuadrat & akar, sesi 0) · `refleksi` (jawaban "Mengapa…?", `catatan` = alasan siswa).
`petunjuk` = jumlah petunjuk bertingkat yang dibuka (0–20); `catatan` = rincian bantuan pada soal latihan (maks. 500 karakter).

### `POST /hasil`
```json
{ "id": "1794-def", "jenis": "posttest", "mulai": "...", "selesai": "...",
  "jawaban": { "0": "B", "1": "64", "2": "14" } }
```
Untuk `leppink`: `"jawaban": { "IL1": 4, "IL2": 3, "...": 0, "GL4": 8 }`.
Balasan 200 (tes): `{ "tersimpan": true, "baru": true }` — **skor tidak dikirim balik** saat tes agar tidak menjadi umpan balik; skor dihitung & disimpan di server.
**Tiap instrumen hanya sekali per kode siswa:** kiriman dengan `id` yang sama aman diulang (`"baru": false`), tetapi `id` lain untuk
jenis yang sama ditolak `409 sudah_dikerjakan`.

### `GET /soal/latihan?tingkat=1..3`
```json
{ "soal": [ { "id": "L-T2-07", "tingkat": 2, "konteks": "tangga",
  "cerita": "Tangga sepanjang 13 m ...", "sisi": { "a": 5, "c": 13 }, "dicari": "b" } ] }
```
Tingkat: 1 = angka langsung, 2 = dengan gambar, 3 = soal cerita (temuan IL4).

### `GET /peneliti/rekap`
```json
{ "siswa": [ { "kode": "8A-07", "kelompok": "aplikasi", "pre": 30, "post": 80, "n_gain": 0.71,
  "IL": 4.3, "EL": 2.7, "GL": 7.5, "petunjuk_rata2": 1.4 } ] }
```

## 4. Model data (Supabase)

| Tabel | Kolom utama |
| --- | --- |
| `siswa` | `kode` (PK), `kelas`, `kelompok` (`aplikasi` / `langsung`), `aktif`, `dibuat` |
| `hasil` | `id` (PK), `kode` → siswa, `jenis`, `mulai`, `selesai`, `durasi_detik`, `benar`, `total`, `skor`, `il`, `el`, `gl`, `jawaban` (jsonb) |
| `aktivitas` | `id` (PK), `kode` → siswa, `jenis`, `sesi`, `langkah`, `judul`, `mulai`, `selesai`, `durasi_detik`, `salah`, `hasil`, `dibacakan`, `petunjuk`, `catatan` |

Keamanan: RLS aktif; peran `anon` **tidak** boleh menulis langsung — hanya backend (service role) yang menulis.

## 5. Format kesalahan
```json
{ "galat": "kode_tidak_terdaftar", "pesan": "Kode siswa tidak ditemukan. Periksa lagi kodenya ya." }
```
Pesan selalu dalam Bahasa Indonesia yang ramah siswa.

## 6. Contoh pemanggilan dari JavaScript
```js
const r = await fetch(`${API}/masuk`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ kode: '8A-07' }),
})
const { token } = await r.json()
```
