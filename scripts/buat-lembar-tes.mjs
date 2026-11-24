// Membuat lembar KUESIONER HARIAN COGNITIVE LOAD versi cetak (HTML) dari src/tes.js agar butirnya PERSIS sama
// dengan di aplikasi (pre-test & post-test memakai tes Mathematical Literacy: scripts/buat_tes_literasi.py).
// Kuesioner diisi di akhir SETIAP pertemuan (Pertemuan 1 dan Pertemuan 2), oleh kelompok dengan aplikasi
// maupun kelompok tanpa aplikasi. Butir dan skala (Paas 1–9) mengikuti lembar blanko dari dosen.
//
// Pemakaian:  node scripts/buat-lembar-tes.mjs
// Hasil:      docs/instrumen-cetak/*.html  (lalu dicetak/diubah ke PDF lewat browser)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BAGIAN_KUESIONER, KUESIONER_HARIAN, SKALA_PAAS } from '../src/tes.js'

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..')
const KELUAR = join(AKAR, 'docs', 'instrumen-cetak')
mkdirSync(KELUAR, { recursive: true })

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const GAYA = `
  @page { size: A4; margin: 13mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 10.5pt; line-height: 1.4; margin: 0; }
  .kepala { border: 2px solid #7cc3ff; border-radius: 12px; padding: 10px 14px; margin-bottom: 10px; background: #f3f9ff; }
  .kepala h1 { margin: 0 0 2px; font-size: 16pt; }
  .kepala .sub { margin: 0 0 8px; color: #475577; }
  .identitas { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 18px; }
  .identitas div { border-bottom: 1px dotted #7a88a8; padding: 2px 0; }
  .kotak { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #1d2a4d; border-radius: 3px; vertical-align: -2px; margin: 0 3px 0 8px; }
  .petunjuk { border-left: 4px solid #f9a8d4; padding: 5px 12px; margin: 0 0 10px; background: #fff5fa; }
  .petunjuk ol { margin: 3px 0; padding-left: 18px; }
  .skala { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px 12px; font-size: 9pt; margin: 4px 0 0; }
  table { border-collapse: collapse; width: 100%; font-size: 9.5pt; }
  th, td { border: 1px solid #b7c3dc; padding: 4px 4px; text-align: center; vertical-align: middle; }
  td.teks { text-align: left; }
  th { background: #eef6ff; }
  tr.bagian td { background: #fff0f7; font-weight: 700; text-align: left; }
  td .kotak { margin: 0; }
  .kaki { margin-top: 8px; font-size: 8.5pt; color: #66739a; text-align: center; }
`

const WAKTU = {
  1: 'Diisi di akhir Pertemuan 1 (setelah Sesi 1 & Sesi 2: Mengenal Segitiga Siku-siku dan Menemukan Rumus Pythagoras)',
  2: 'Diisi di akhir Pertemuan 2 (setelah Sesi 3 & Latihan Soal: Penerapan Pythagoras), sebelum post-test',
}

function lembarHarian(pertemuan) {
  const kotak = Array.from({ length: 9 }, () => '<td><span class="kotak"></span></td>').join('')
  let baris = ''
  let bagian = ''
  KUESIONER_HARIAN.forEach((b, i) => {
    if (b.dimensi !== bagian) {
      bagian = b.dimensi
      baris += `<tr class="bagian"><td colspan="11">${esc(BAGIAN_KUESIONER[bagian])}</td></tr>`
    }
    baris += `<tr><td>${i + 1}</td><td class="teks">${esc(b.teks)}</td>${kotak}</tr>`
  })
  const skala = SKALA_PAAS.map((s, i) => `<div><b>${i + 1}</b> = ${esc(s)}</div>`).join('')
  return `
  <div class="kepala">
    <h1>Kuesioner Cognitive Load · Pertemuan ${pertemuan}</h1>
    <p class="sub">Materi Teorema Pythagoras · Kelas VIII · ${esc(WAKTU[pertemuan])}</p>
    <div class="identitas">
      <div>Kode siswa: </div>
      <div>Kelas: 8</div>
      <div>Sekolah: </div>
      <div>Tanggal: </div>
      <div style="grid-column: 1 / -1">Kelompok:<span class="kotak"></span>Belajar dengan aplikasi PELITA<span class="kotak"></span>Belajar tanpa aplikasi</div>
    </div>
  </div>
  <div class="petunjuk"><strong>Petunjuk</strong>
    <ol>
      <li>Ingat kembali kegiatan belajar matematika <b>hari ini</b>.</li>
      <li>Beri tanda centang (✓) pada SATU kotak angka (1–9) di setiap baris, sesuai besar usaha berpikir yang kamu keluarkan.</li>
      <li>Tidak ada jawaban benar atau salah dan jawabanmu tidak memengaruhi nilai. Jawablah dengan jujur.</li>
    </ol>
    <div class="skala">${skala}</div>
  </div>
  <table>
    <thead><tr><th>No</th><th>Pertanyaan</th>${Array.from({ length: 9 }, (_, n) => `<th>${n + 1}</th>`).join('')}</tr></thead>
    <tbody>${baris}</tbody>
  </table>
  <p class="kaki">Skala 1–9: 1 = sangat rendah · 5 = sedang · 9 = amat sangat tinggi · Butir 1–3 EL, 4–6 IL, 7–10 GL</p>`
}

function halaman(judul, isi) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(judul)}</title><style>${GAYA}</style></head><body>${isi}</body></html>`
}

const LEMBAR = {
  '3-Kuesioner-Cognitive-Load-Pertemuan-1': halaman('Kuesioner Cognitive Load Pertemuan 1', lembarHarian(1)),
  '4-Kuesioner-Cognitive-Load-Pertemuan-2': halaman('Kuesioner Cognitive Load Pertemuan 2', lembarHarian(2)),
}

for (const [nama, html] of Object.entries(LEMBAR)) {
  writeFileSync(join(KELUAR, `${nama}.html`), html)
  console.log('tersimpan:', nama)
}
