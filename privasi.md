# privasi.md — Etika Penelitian & Perlindungan Data Siswa

Pengguna aplikasi adalah **siswa SMP (anak di bawah umur)**. Dokumen ini mengikuti bagian C pedoman wawancara
("Persiapan dan etika pelaksanaan") dan berlaku untuk wawancara, aplikasi, dan analisis data.

## 1. Persetujuan
| Pihak | Bentuk | Kapan |
| --- | --- | --- |
| Sekolah | izin penelitian dari kepala sekolah / guru mata pelajaran | sebelum kegiatan pertama |
| Orang tua / wali | surat persetujuan tertulis | sebelum siswa ikut wawancara / memakai aplikasi |
| Siswa | persetujuan lisan/tertulis; boleh berhenti kapan saja tanpa akibat | di awal setiap kegiatan |
| Rekaman / foto | izin terpisah; tanpa izin = tidak merekam | sebelum merekam |

## 2. Data yang dikumpulkan
| Data | Dipakai untuk | Tidak dikumpulkan |
| --- | --- | --- |
| Kode siswa (kelas + absen, mis. `8A-07`), kelas | menghubungkan pre-test, post-test, kuesioner | nama asli, alamat, nomor HP, foto wajah |
| Jawaban tes & kuesioner, durasi | analisis N-gain & beban kognitif | lokasi, kontak, akun media sosial |
| Aktivitas belajar (waktu per langkah, salah, petunjuk, Bacakan) | melihat bagian materi yang sulit | rekaman layar / suara |

## 3. Aturan pengelolaan
- **Kode, bukan nama.** Daftar "kode ↔ nama" hanya dipegang peneliti di kertas/berkas pribadi, **tidak** di aplikasi, repo, atau prompt AI.
- Transkrip wawancara memakai kode informan (S01, S02).
- Basis data Supabase: hanya bisa **ditambah** dari aplikasi; membaca data hanya lewat dashboard pemilik proyek.
- CSV data asli tidak pernah di-commit ke GitHub (repo ini publik).
- Saat bertanya ke AI: jangan menempelkan nama, foto, atau data pribadi siswa.
- Screenshot untuk laporan memakai **data contoh** ("Siswa A", "Nisa"), bukan data siswa sungguhan.

## 4. Penyimpanan & penghapusan
- Data disimpan selama penelitian dan penyusunan laporan (±2 bulan).
- Setelah laporan dinilai: hapus tabel Supabase / nonaktifkan kode siswa, simpan hanya rekap tanpa identitas.
- Siswa atau orang tua boleh meminta datanya dihapus; hapus baris dengan kode siswa tersebut.

## 5. Keamanan teknis
- Hanya *publishable key* Supabase yang ada di aplikasi; service key & password tidak pernah dibagikan.
- Komunikasi selalu HTTPS.
- Data di HP (localStorage) hanya berisi kode siswa dan progres belajar; bisa dihapus lewat pengaturan Chrome.

## 6. Penggunaan AI
- AI (Claude) dipakai untuk membantu membuat aplikasi; seluruh percakapan didokumentasikan di [docs/bukti-ai](docs/bukti-ai).
- Email akun disamarkan pada salinan publik.
- Keputusan desain dan isi materi tetap diperiksa oleh mahasiswa dan ahli.
