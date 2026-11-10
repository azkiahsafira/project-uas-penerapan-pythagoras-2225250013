// Membuat lembar validasi ahli materi & ahli media (tahap Development, model ADDIE) versi cetak.
// Butir disusun dari rancangan aplikasi: prd.md (temuan wawancara IL/EL/GL), materi PDF (literasi matematis:
// merumuskan, menerapkan, menafsirkan), design.md, dan fitur yang sudah dibuat.
//
// Pemakaian:  node scripts/buat-lembar-validasi.mjs
// Hasil:      docs/validasi/*.html  (lalu diubah ke PDF lewat browser / Edge headless)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..')
const KELUAR = join(AKAR, 'docs', 'validasi')
mkdirSync(KELUAR, { recursive: true })

const LINK = 'https://azkiah-safira-pythagoras.vercel.app'
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const MATERI = [
  {
    aspek: 'A. Kelayakan isi',
    butir: [
      'Materi sesuai dengan capaian pembelajaran Teorema Pythagoras kelas VIII SMP.',
      'Konsep sisi siku-siku, sisi miring, dan teorema Pythagoras disajikan dengan benar (tidak ada miskonsepsi).',
      'Prasyarat kuadrat dan akar kuadrat diberikan sebelum teorema Pythagoras.',
      'Contoh dan soal memakai konteks kehidupan sehari-hari yang dekat dengan siswa (tangga, layang-layang, jarak, layar).',
      'Isi aplikasi (Belajar, Latihan, Kalkulator) sesuai dengan materi ajar PDF.',
    ],
  },
  {
    aspek: 'B. Penyajian',
    butir: [
      'Materi disajikan bertahap, satu konsep per layar, dari mudah ke sulit.',
      'Strategi 5 Langkah soal cerita (tandai, Diketahui–Ditanya, gambar, rumus & hitung, cek kewajaran) jelas.',
      'Latihan berjenjang (angka langsung → dengan gambar → soal cerita) membantu siswa naik tingkat kesulitan.',
      'Petunjuk bertingkat dan pembahasan membantu siswa yang mengalami kesulitan.',
      'Pertanyaan refleksi "Mengapa…?" mendorong siswa menjelaskan alasannya.',
    ],
  },
  {
    aspek: 'C. Literasi matematis',
    butir: [
      'Siswa dilatih merumuskan: mengubah soal cerita menjadi segitiga siku-siku serta Diketahui–Ditanya.',
      'Siswa dilatih menerapkan: memilih rumus yang tepat (tambah/kurang) dan menghitung dengan benar.',
      'Siswa dilatih menafsirkan: memeriksa kewajaran jawaban dalam konteks (sisi miring harus terpanjang).',
    ],
  },
  {
    aspek: 'D. Pengelolaan beban kognitif',
    butir: [
      'Beban intrinsik dikelola: materi dipecah kecil dan bantuan langkah memudar setelah siswa lancar.',
      'Beban ekstrinsik ditekan: teks, gambar, dan label sisi berdekatan; warna hanya untuk sisi diketahui/dicari.',
      'Beban germane didorong: contoh lengkap, contoh setengah jadi, refleksi, dan cek kewajaran.',
    ],
  },
  {
    aspek: 'E. Bahasa dan evaluasi',
    butir: [
      'Bahasa Indonesia yang digunakan baku, komunikatif, dan mudah dipahami siswa SMP.',
      'Istilah dan simbol matematika (a², √, c² = a² + b²) digunakan secara konsisten.',
      'Butir pre-test dan post-test sesuai dengan indikator materi dan setara (paralel) tingkat kesulitannya.',
      'Kunci jawaban dan penilaian tes benar.',
    ],
  },
]

const MEDIA = [
  {
    aspek: 'A. Tampilan',
    butir: [
      'Tata letak rapi dan konsisten di semua menu (Belajar, Kalkulator, Latihan Soal, Tes).',
      'Ukuran huruf dan tombol nyaman dibaca dan disentuh di layar smartphone Android.',
      'Pemilihan warna serasi dan teks tetap terbaca di atas latar.',
      'Gambar segitiga dan label sisi jelas; segitiga yang diputar tetap mudah dibaca.',
      'Ilustrasi 3D tangga–dinding (three.js) jelas dan dapat diputar/diperbesar.',
    ],
  },
  {
    aspek: 'B. Navigasi dan kemudahan penggunaan',
    butir: [
      'Menu dan tombol mudah dipahami tanpa penjelasan tambahan.',
      'Masuk dengan kode siswa (kelas + nomor absen) mudah dilakukan.',
      'Urutan pertemuan (pre-test → Sesi 1–3 → Latihan → post-test → kuesioner) jelas, beserta keterangan bagian yang belum dibuka.',
      'Siswa dapat kembali ke langkah sebelumnya dan melanjutkan progres belajar.',
    ],
  },
  {
    aspek: 'C. Interaktivitas dan umpan balik',
    butir: [
      'Cek pemahaman dan latihan memberi umpan balik yang jelas dan segera.',
      'Kegiatan mengetuk angka (Diketahui–Ditanya) dan menunjuk sisi miring berjalan dengan baik.',
      'Tombol Bacakan (suara) membantu siswa memahami teks.',
      'Animasi, perayaan, dan musik menyenangkan tetapi tidak mengganggu, serta hilang saat tes.',
    ],
  },
  {
    aspek: 'D. Kinerja dan teknis',
    butir: [
      'Aplikasi terbuka cepat dan lancar di smartphone Android.',
      'Aplikasi dapat dipasang (install) dari Chrome dan tetap dapat dipakai saat internet terputus.',
      'Data hasil tes dan aktivitas tersimpan dan terkirim ke server tanpa kehilangan data.',
      'Tidak ditemukan galat (error), tampilan terpotong, atau tombol yang tidak berfungsi.',
    ],
  },
  {
    aspek: 'E. Keamanan dan etika',
    butir: [
      'Aplikasi tidak meminta atau menyimpan nama asli siswa (hanya kode siswa).',
      'Tes hanya dapat dikerjakan satu kali dan sesuai urutan, sehingga data penelitian valid.',
      'Kalkulator dan latihan tidak membocorkan soal pre-test/post-test.',
    ],
  },
]

const GAYA = `
  @page { size: A4; margin: 15mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 10.5pt; line-height: 1.4; margin: 0; }
  .kepala { border: 2px solid #7cc3ff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; background: #f3f9ff; }
  .kepala h1 { margin: 0 0 2px; font-size: 16pt; }
  .kepala .sub { margin: 0 0 8px; color: #475577; }
  .identitas { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .identitas div { border-bottom: 1px dotted #7a88a8; padding: 2px 0; }
  .petunjuk { border-left: 4px solid #f9a8d4; padding: 6px 12px; margin: 0 0 12px; background: #fff5fa; }
  .petunjuk ol { margin: 4px 0; padding-left: 18px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #b7c3dc; padding: 4px 5px; vertical-align: middle; }
  th { background: #eef6ff; text-align: center; }
  td.no, td.skor { text-align: center; width: 30px; }
  tr.aspek td { background: #f7faff; font-weight: 700; }
  tr { break-inside: avoid; }
  .saran { height: 70px; border: 1px solid #b7c3dc; border-radius: 6px; margin: 4px 0 10px; }
  .kesimpulan li { margin: 4px 0; list-style: none; }
  .kotak { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #1d2a4d; border-radius: 3px; margin-right: 6px; vertical-align: -2px; }
  .ttd { width: 260px; margin-left: auto; margin-top: 14px; text-align: left; }
  .ttd .ruang { height: 60px; }
  h2 { font-size: 12pt; margin: 12px 0 6px; }
  .kecil { font-size: 9pt; color: #5f6d8f; }
  .rekap td, .rekap th { text-align: center; }
`

function lembar(judul, peran, bagian) {
  let no = 0
  const total = bagian.reduce((t, b) => t + b.butir.length, 0)
  const baris = bagian
    .map(
      (b) =>
        `<tr class="aspek"><td colspan="6">${esc(b.aspek)}</td></tr>` +
        b.butir
          .map(
            (t) =>
              `<tr><td class="no">${++no}</td><td>${esc(t)}</td>${[1, 2, 3, 4].map(() => '<td class="skor"></td>').join('')}</tr>`,
          )
          .join(''),
    )
    .join('')
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(judul)}</title><style>${GAYA}</style></head><body>
  <div class="kepala">
    <h1>${esc(judul)}</h1>
    <p class="sub">Aplikasi "Penerapan Teorema Pythagoras" · Bab Teorema Pythagoras, SMP Kelas VIII · ${esc(LINK)}</p>
    <div class="identitas">
      <div>Nama validator: </div>
      <div>Bidang keahlian: ${esc(peran)}</div>
      <div>Instansi: </div>
      <div>Tanggal: </div>
    </div>
  </div>
  <div class="petunjuk">
    <strong>Petunjuk pengisian</strong>
    <ol>
      <li>Bapak/Ibu dimohon mencoba aplikasi melalui tautan di atas (sebaiknya di smartphone Android) dan membaca materi ajar PDF.</li>
      <li>Berilah tanda centang (✓) pada kolom skor: <b>1</b> = kurang, <b>2</b> = cukup, <b>3</b> = baik, <b>4</b> = sangat baik.</li>
      <li>Tuliskan saran perbaikan pada bagian yang disediakan, lalu pilih kesimpulan kelayakan.</li>
    </ol>
  </div>
  <table>
    <thead><tr><th>No</th><th>Aspek dan butir penilaian</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead>
    <tbody>${baris}</tbody>
  </table>
  <h2>Saran dan komentar</h2>
  <div class="saran"></div>
  <h2>Kesimpulan</h2>
  <p>Aplikasi ini dinyatakan:</p>
  <ul class="kesimpulan">
    <li><span class="kotak"></span>Layak digunakan tanpa revisi</li>
    <li><span class="kotak"></span>Layak digunakan dengan revisi sesuai saran</li>
    <li><span class="kotak"></span>Tidak layak digunakan</li>
  </ul>
  <div class="ttd">
    <p>…………………, ……………… 2026<br>Validator,</p>
    <div class="ruang"></div>
    <p>(………………………………………)<br>NIP/NIDN: </p>
  </div>
  <p class="kecil">Diisi peneliti — skor total: ……… dari ${total * 4} · persentase = skor total ÷ ${total * 4} × 100% = ……… % ·
  kriteria: 81–100% sangat layak, 61–80% layak, 41–60% cukup layak, 21–40% kurang layak, ≤ 20% tidak layak.</p>
  </body></html>`
}

const berkas = [
  ['1-Validasi-Ahli-Materi.html', lembar('Lembar Validasi Ahli Materi', 'Pendidikan Matematika', MATERI)],
  ['2-Validasi-Ahli-Media.html', lembar('Lembar Validasi Ahli Media', 'Media / Teknologi Pembelajaran', MEDIA)],
]
for (const [nama, isi] of berkas) {
  writeFileSync(join(KELUAR, nama), isi)
  console.log('tersimpan:', join('docs', 'validasi', nama))
}
console.log('butir materi:', MATERI.reduce((t, b) => t + b.butir.length, 0), '| butir media:', MEDIA.reduce((t, b) => t + b.butir.length, 0))
