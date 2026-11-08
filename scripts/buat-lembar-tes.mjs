// Membuat lembar tes versi cetak (HTML) dari src/tes.js agar soalnya PERSIS sama
// dengan di aplikasi. Dipakai untuk siswa yang diajar langsung (tanpa aplikasi).
//
// Pemakaian:  node scripts/buat-lembar-tes.mjs
// Hasil:      docs/instrumen-cetak/*.html  (lalu dicetak/diubah ke PDF lewat browser)
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INDIKATOR, LEPPINK, POSTTEST, PRETEST } from '../src/tes.js'

const AKAR = join(dirname(fileURLToPath(import.meta.url)), '..')
const KELUAR = join(AKAR, 'docs', 'instrumen-cetak')
mkdirSync(KELUAR, { recursive: true })

const HURUF = ['A', 'B', 'C', 'D']
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const GAYA = `
  @page { size: A4; margin: 16mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 11.5pt; line-height: 1.45; margin: 0; }
  .kepala { border: 2px solid #7cc3ff; border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; background: #f3f9ff; }
  .kepala h1 { margin: 0 0 2px; font-size: 17pt; }
  .kepala .sub { margin: 0 0 10px; color: #475577; }
  .identitas { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .identitas div { border-bottom: 1px dotted #7a88a8; padding: 2px 0; }
  .petunjuk { border-left: 4px solid #f9a8d4; padding: 6px 12px; margin: 0 0 14px; background: #fff5fa; }
  .petunjuk ol { margin: 4px 0; padding-left: 18px; }
  .soal { break-inside: avoid; margin: 0 0 12px; padding: 8px 10px; border: 1px solid #dce6f5; border-radius: 10px; }
  .soal .no { font-weight: 800; color: #2b7bd0; }
  .opsi { list-style: none; margin: 6px 0 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .opsi li::before { content: attr(data-h) '. '; font-weight: 700; }
  .opsi li { padding-left: 2px; }
  .opsi .lingkar { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #1d2a4d; border-radius: 50%; margin-right: 6px; vertical-align: -2px; }
  .isian { margin-top: 8px; display: flex; gap: 10px; align-items: flex-end; }
  .isian .cara { flex: 1; height: 54px; border: 1px dashed #b7c3dc; border-radius: 6px; padding: 3px 6px; color: #8a96b3; font-size: 9pt; }
  .isian .jawab { width: 150px; border-bottom: 1.5px solid #1d2a4d; padding-bottom: 2px; font-size: 10pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; }
  th, td { border: 1px solid #b7c3dc; padding: 4px 5px; text-align: center; vertical-align: middle; }
  td.teks { text-align: left; }
  th { background: #eef6ff; }
  .kotak { display: inline-block; width: 14px; height: 14px; border: 1.5px solid #1d2a4d; border-radius: 3px; }
  .kaki { margin-top: 12px; font-size: 9pt; color: #66739a; text-align: center; }
  .halaman-baru { break-before: page; }
  h2 { font-size: 13pt; margin: 14px 0 6px; }
`

function identitas(judul, sub, waktu = true) {
  return `
  <div class="kepala">
    <h1>${esc(judul)}</h1>
    <p class="sub">${esc(sub)}</p>
    <div class="identitas">
      <div>Nama: </div>
      <div>Kelas: 8</div>
      <div>Sekolah: </div>
      <div>Tanggal: </div>
      ${waktu ? '<div>Jam mulai: </div><div>Jam selesai: </div>' : ''}
    </div>
  </div>`
}

function lembarTes(judul, sub, soal) {
  const isi = soal
    .map((s, i) => {
      const jawab =
        s.tipe === 'pilihan'
          ? `<ul class="opsi">${s.opsi.map((o, k) => `<li data-h="${HURUF[k]}">${esc(o)}</li>`).join('')}</ul>
             <div class="isian"><div class="jawab">Jawaban (A/B/C/D): </div></div>`
          : `<div class="isian"><div class="cara">Tulis cara/hitunganmu di sini</div><div class="jawab">Jawaban: </div></div>`
      return `<div class="soal"><span class="no">${i + 1}.</span> ${esc(s.tanya)}${jawab}</div>`
    })
    .join('')
  return `${identitas(judul, sub)}
  <div class="petunjuk"><strong>Petunjuk</strong>
    <ol>
      <li>Tulis nama, sekolah, tanggal, dan jam mulai sebelum mengerjakan.</li>
      <li>Kerjakan sendiri, tanpa kalkulator dan tanpa bantuan orang lain.</li>
      <li>Untuk soal pilihan, tulis huruf jawabanmu (A, B, C, atau D). Untuk soal hitungan, tulis angkanya saja di kotak "Jawaban".</li>
      <li>Tidak apa-apa jika belum bisa, kerjakan semampunya. Tulis jam selesai setelah semua soal dikerjakan.</li>
    </ol>
  </div>
  ${isi}
  <p class="kaki">Media Belajar Penerapan Teorema Pythagoras · Project UAS · Lembar ini sama dengan tes di aplikasi</p>`
}

function lembarLeppink() {
  const baris = LEPPINK.map(
    (b, i) =>
      `<tr><td>${i + 1}</td><td class="teks">${esc(b.teks)}</td>${Array.from({ length: 11 }, () => '<td><span class="kotak"></span></td>').join('')}</tr>`,
  ).join('')
  return `${identitas('Kuesioner Beban Kognitif', 'Pertemuan 5, setelah post-test · diadaptasi dari Leppink dkk. (2013)', false)}
  <div class="petunjuk"><strong>Petunjuk</strong>
    <ol>
      <li>Baca setiap pernyataan tentang kegiatan belajar Pythagoras yang sudah kamu ikuti.</li>
      <li>Beri tanda centang (✓) pada SATU kotak angka di setiap baris.</li>
      <li>0 = sama sekali tidak setuju, 10 = sangat setuju. Tidak ada jawaban benar atau salah, jawab sejujurnya.</li>
    </ol>
  </div>
  <table>
    <thead><tr><th>No</th><th>Pernyataan</th>${Array.from({ length: 11 }, (_, n) => `<th>${n}</th>`).join('')}</tr></thead>
    <tbody>${baris}</tbody>
  </table>
  <p class="kaki">0 = sama sekali tidak setuju · 10 = sangat setuju</p>`
}

function kunciTes(judul, soal) {
  const baris = soal
    .map((s, i) => {
      const kunci = s.tipe === 'pilihan' ? `${HURUF[s.opsi.indexOf(s.jawab)]} (${esc(s.jawab)})` : esc(s.jawab)
      return `<tr><td>${i + 1}</td><td class="teks">${esc(INDIKATOR[i])}</td><td>${s.tipe === 'pilihan' ? 'Pilihan' : 'Isian angka'}</td><td><strong>${kunci}</strong></td></tr>`
    })
    .join('')
  return `<h2>${esc(judul)}</h2>
  <table><thead><tr><th>No</th><th>Indikator</th><th>Bentuk</th><th>Kunci</th></tr></thead><tbody>${baris}</tbody></table>`
}

function lembarKunci() {
  const leppink = LEPPINK.map((b, i) => `<tr><td>${i + 1}</td><td>${b.dimensi}</td><td class="teks">${esc(b.teks)}</td></tr>`).join('')
  return `<div class="kepala"><h1>Kunci Jawaban & Pedoman Penilaian</h1>
    <p class="sub">Untuk peneliti/guru · JANGAN dibagikan ke siswa</p></div>
  <div class="petunjuk"><strong>Penilaian tes</strong>: setiap soal benar bernilai 1. Nilai = (jumlah benar ÷ 10) × 100.
    Untuk soal isian angka, jawaban dianggap benar bila angkanya sama dengan kunci (satuan boleh tidak ditulis).</div>
  ${kunciTes('Pre-test (pertemuan 1)', PRETEST)}
  ${kunciTes('Post-test (pertemuan 5)', POSTTEST)}
  <h2>Kuesioner Leppink</h2>
  <div class="petunjuk">Skor tiap dimensi = rata-rata butirnya (skala 0–10):
    <strong>IL</strong> = rata-rata butir 1–3, <strong>EL</strong> = rata-rata butir 4–6, <strong>GL</strong> = rata-rata butir 7–10.
    Harapan: EL rendah, GL tinggi.</div>
  <table><thead><tr><th>No</th><th>Dimensi</th><th>Pernyataan</th></tr></thead><tbody>${leppink}</tbody></table>
  <h2>Memasukkan jawaban kertas ke analisis</h2>
  <div class="petunjuk">Salin jawaban siswa ke file <code>analisis/templat_kertas.csv</code> (satu baris per lembar):
    kolom <code>s1</code>–<code>s10</code> berisi huruf (A–D) atau angka seperti yang ditulis siswa; untuk kuesioner,
    kolom <code>b1</code>–<code>b10</code> berisi angka 0–10. Lalu jalankan
    <code>python analisis.py data.csv --kertas templat_kertas.csv</code>. Jawaban dikoreksi otomatis memakai kunci yang sama.</div>`
}

function halaman(judul, isi) {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(judul)}</title><style>${GAYA}</style></head><body>${isi}</body></html>`
}

const LEMBAR = {
  '1-Pre-test': halaman('Pre-test', lembarTes('Pre-test Teorema Pythagoras', 'Pertemuan 1, sebelum Sesi 1 · 10 soal', PRETEST)),
  '2-Post-test': halaman('Post-test', lembarTes('Post-test Teorema Pythagoras', 'Pertemuan 5 · 10 soal', POSTTEST)),
  '3-Kuesioner-Beban-Kognitif': halaman('Kuesioner Beban Kognitif', lembarLeppink()),
  '4-Kunci-Jawaban': halaman('Kunci Jawaban', lembarKunci()),
}

for (const [nama, html] of Object.entries(LEMBAR)) {
  writeFileSync(join(KELUAR, `${nama}.html`), html)
  console.log('tersimpan:', nama)
}
