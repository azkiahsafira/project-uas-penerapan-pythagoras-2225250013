# konten.md — Spesifikasi Isi Pembelajaran

| | |
| --- | --- |
| Jenjang | SMP kelas VIII |
| Bab | **Teorema Pythagoras** |
| Subbab | **Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah** |
| Kemampuan sasaran | **Literasi matematis** |
| Bahasa | Bahasa Indonesia, kalimat pendek, satu ide per layar |

## 1. Tujuan pembelajaran
1. Menghitung kuadrat dan akar kuadrat (prasyarat).
2. Menunjukkan sisi miring segitiga siku-siku pada berbagai posisi.
3. Menuliskan teorema Pythagoras dan memilih bentuk rumus sesuai sisi yang dicari.
4. Menyelesaikan masalah sehari-hari dengan teorema Pythagoras.
5. Memeriksa kewajaran jawaban dalam konteks masalah.

## 2. Indikator literasi matematis
| Proses | Indikator | Contoh kegiatan |
| --- | --- | --- |
| **Merumuskan** | mengubah situasi nyata menjadi segitiga siku-siku, menuliskan Diketahui–Ditanya | menggambar tangga–dinding sebagai segitiga |
| **Menerapkan** | memilih rumus yang tepat dan menghitung | b² = c² − a² untuk tinggi layang-layang |
| **Menafsirkan** | menjelaskan arti hasil & memeriksa kewajarannya | "jalan memotong lebih hemat 10 m" |

## 3. Peta isi
| Isi | Aplikasi | Materi PDF | Temuan wawancara |
| --- | --- | --- | --- |
| Kuadrat & akar kuadrat | Sesi 1 | Bagian 1 | IL3 |
| Segitiga siku-siku & sisi miring | Sesi 1 | Bagian 2 | IL1 |
| Teorema Pythagoras (pola luas 9 + 16 = 25) | Sesi 2 | Bagian 3 | IL2, GL1 |
| Mencari sisi miring & sisi siku-siku | Sesi 2, Kalkulator | Bagian 3 | IL2 |
| Strategi 5 langkah soal cerita | Sesi 3 | Bagian 4 | EL1, EL5, GL3 |
| Penerapan sehari-hari | Sesi 3, Latihan (pertemuan 4) | Bagian 5, Latihan | IL4, GL5 |

## 4. Konteks masalah yang dipakai
Tangga–dinding, layang-layang, jarak berjalan/berlayar, diagonal layar (laptop, TV, ponsel), kawat penopang tiang,
diagonal taman/lapangan, papan seluncur, jalan landai kursi roda, bayangan pohon.

## 5. Aturan menulis soal
- Angka memakai **tripel Pythagoras** agar hasil bilangan bulat (3–4–5, 5–12–13, 8–15–17, 7–24–25, 20–21–29, 9–40–41 dan kelipatannya).
- Satuan selalu ditulis (cm, m, km, inci) dan masuk akal untuk konteksnya.
- Kalimat ≤ 2 kalimat untuk soal tingkat 1–2; soal cerita tingkat 3 boleh 2–3 kalimat.
- Kalimat pertanyaan jelas menyebut **apa yang dicari**.
- **Soal latihan & materi tidak boleh memakai angka/konteks yang sama dengan butir pre-test/post-test** ([src/tes.js](src/tes.js)).

## 6. Bank soal latihan (berjenjang)
| Tingkat | Bentuk | Contoh |
| --- | --- | --- |
| 1 | angka langsung | a = 15, b = 20, c = ? |
| 2 | gambar segitiga (diputar/dicerminkan) | tentukan sisi miring, lalu hitung |
| 3 | soal cerita | tiang bendera & kawat penopang |

Target: ≥ 10 soal per tingkat. Soal tingkat 3 di aplikasi dibuat acak dari tripel × konteks ([src/Latihan.jsx](src/Latihan.jsx)).

## 7. Instrumen penelitian
- **Pre-test & post-test**: 10 butir paralel per indikator ([src/tes.js](src/tes.js)); versi cetak di [docs/instrumen-cetak](docs/instrumen-cetak).
- **Kuesioner Leppink dkk. (2013)**: 10 butir, skala 0–10 (IL 3, EL 3, GL 4).
- Kunci jawaban harus sama di `src/tes.js`, `analisis/analisis.py`, dan lembar kunci cetak.

## 8. Sumber
- Buku siswa matematika kelas VIII, bab Teorema Pythagoras.
- Leppink, J., dkk. (2013). Development of an instrument for measuring different types of cognitive load. *Behavior Research Methods*, 45, 1058–1072.
- Pedoman wawancara Cognitive Load (ADDIE) dan temuan informan S01 (simulasi).
