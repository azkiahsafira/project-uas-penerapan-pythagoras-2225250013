# Penerapan Teorema Pythagoras

Aplikasi web sederhana untuk menghitung sisi segitiga siku-siku menggunakan teorema Pythagoras, lengkap dengan langkah penyelesaian, gambar segitiga, dan contoh soal dari kehidupan sehari-hari.

Dibuat untuk mata kuliah **Algoritma Pemrograman**.

## Teorema Pythagoras

Pada segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi siku-sikunya:

```
c² = a² + b²
```

| Simbol | Keterangan |
| ------ | ---------- |
| `a` | alas (sisi siku-siku mendatar) |
| `b` | tinggi (sisi siku-siku tegak) |
| `c` | sisi miring (hipotenusa), selalu sisi terpanjang |

Dari rumus tersebut diperoleh tiga bentuk:

| Yang dicari | Rumus |
| ----------- | ----- |
| Sisi miring | `c = √(a² + b²)` |
| Alas | `a = √(c² − b²)` |
| Tinggi | `b = √(c² − a²)` |

## Fitur

- **Kalkulator tiga mode**: mencari sisi miring, alas, atau tinggi.
- **Langkah penyelesaian**: perhitungan ditampilkan baris per baris, dari rumus sampai hasil akhir.
- **Gambar segitiga**: ukuran segitiga menyesuaikan input, dan sisi yang dicari diberi warna.
- **Deteksi tripel Pythagoras**: memberi tahu jika ketiga sisi bilangan bulat, misalnya (3, 4, 5).
- **Validasi input**: menolak angka kosong, nol, negatif, atau sisi miring yang tidak lebih panjang dari sisi lain.
- **Contoh soal sehari-hari**: tangga bersandar, diagonal layar TV, tinggi layang-layang, dan jalan pintas di lapangan.
- Tampilan responsif (laptop dan HP) serta mendukung mode terang/gelap.

## Algoritma

Algoritma perhitungan ada di fungsi `hitung()` pada [src/App.jsx](src/App.jsx).

```
MULAI
  BACA sisi yang dicari (a, b, atau c)
  BACA dua sisi yang diketahui

  UNTUK setiap sisi yang diketahui:
    JIKA bukan angka ATAU ≤ 0 MAKA
      TAMPILKAN "harus berupa angka lebih dari 0"
      SELESAI

  JIKA yang dicari = c MAKA
    c ← √(a² + b²)
  SELAIN ITU
    JIKA c ≤ sisi lain MAKA
      TAMPILKAN "sisi miring harus lebih panjang"
      SELESAI
    sisi yang dicari ← √(c² − sisi lain²)

  TAMPILKAN hasil (dibulatkan 2 angka di belakang koma)
  TAMPILKAN langkah-langkah perhitungan
  JIKA a, b, c semuanya bilangan bulat MAKA
    TAMPILKAN "tripel Pythagoras"
SELESAI
```

### Contoh

Tangga sepanjang 5 m bersandar di dinding, jarak kaki tangga ke dinding 3 m. Berapa tinggi dinding yang dicapai?

```
b² = c² − a²
b² = 5² − 3²
b² = 25 − 9
b² = 16
b  = √16 = 4 m
```

## Teknologi

- [React](https://react.dev) 19: antarmuka pengguna
- [Vite](https://vite.dev) 8: server pengembangan dan build
- [Oxlint](https://oxc.rs): pemeriksa kode (linter)

## Cara Menjalankan

Pastikan [Node.js](https://nodejs.org) sudah terpasang, lalu jalankan di folder ini:

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

Perintah lainnya:

| Perintah | Fungsi |
| -------- | ------ |
| `npm run build` | membuat versi siap pakai di folder `dist` |
| `npm run preview` | menjalankan hasil build |
| `npm run lint` | memeriksa kode |

## Struktur Folder

```
aplikasi-pythagoras/
├── index.html        halaman utama
├── public/           ikon
└── src/
    ├── main.jsx      titik awal aplikasi
    ├── App.jsx       logika perhitungan dan tampilan
    ├── App.css       gaya komponen
    └── index.css     warna dan gaya dasar
```
