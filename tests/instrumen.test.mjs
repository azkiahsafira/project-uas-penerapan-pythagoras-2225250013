// Pengujian instrumen penelitian & isi materi: kunci tes, Leppink, kesesuaian materi, tes Mathematical Literacy,
// dan aturan "soal latihan tidak boleh membocorkan butir tes" (konten.md §5).
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SESI } from '../src/materi.js'
import { LEPPINK, POSTTEST, PRETEST, nilaiLeppink, nilaiTes } from '../src/tes.js'

const baca = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')
const jawabanBenar = (soal) => Object.fromEntries(soal.map((s, i) => [i, String(s.jawab)]))

test('pre-test & post-test paralel: 10 butir, tipe sama per nomor, nilai 100 bila semua benar', () => {
  assert.equal(PRETEST.length, 10)
  assert.deepEqual(
    PRETEST.map((s) => s.tipe),
    POSTTEST.map((s) => s.tipe),
  )
  for (const soal of [PRETEST, POSTTEST]) {
    assert.deepEqual(nilaiTes(soal, jawabanBenar(soal)), { benar: 10, total: 10, skor: 100 })
    for (const s of soal.filter((x) => x.tipe === 'pilihan')) assert.ok(s.opsi.includes(s.jawab), s.tanya)
  }
  assert.equal(nilaiTes(PRETEST, { 4: '15,0' }).benar, 1) // koma desimal diterima
})

test('kuesioner Leppink: 3 IL, 3 EL, 4 GL, skor = rata-rata per dimensi', () => {
  assert.deepEqual(
    ['IL', 'EL', 'GL'].map((d) => LEPPINK.filter((b) => b.dimensi === d).length),
    [3, 3, 4],
  )
  const jawaban = Object.fromEntries(LEPPINK.map((b) => [b.id, b.dimensi === 'GL' ? 8 : 2]))
  assert.deepEqual(nilaiLeppink(jawaban), { IL: 2, EL: 2, GL: 8 })
})

test('materi: 3 sesi, kunci setiap cek pilihan ada di opsinya, tanpa kata "geometri"', () => {
  assert.equal(SESI.length, 3)
  for (const sesi of SESI)
    for (const l of sesi.langkah) {
      if (l.cek?.tipe === 'pilihan') assert.ok(l.cek.opsi.includes(l.cek.jawab), l.judul)
      if (l.cek?.tipe === 'angka') assert.equal(typeof l.cek.jawab, 'number', l.judul)
    }
  assert.doesNotMatch(JSON.stringify(SESI).toLowerCase(), /geometri/)
})

test('angka latihan pertemuan 4 tidak sama dengan tripel butir pre/post-test', () => {
  const latihan = baca('src/Latihan.jsx')
  const awal = latihan.indexOf('const TRIPEL = [')
  const blok = latihan.slice(awal, latihan.indexOf(']\n', awal))
  const tripel = [...blok.matchAll(/\[(\d+), (\d+), (\d+)\]/g)].map((m) => m.slice(1, 4).map(Number))
  assert.ok(tripel.length >= 8)
  for (const [a, b, c] of tripel) assert.equal(a * a + b * b, c * c, `${a}-${b}-${c} bukan tripel`)
  for (const soal of [...PRETEST, ...POSTTEST]) {
    const angka = (soal.tanya.match(/\d+/g) || []).map(Number).filter((n) => n > 2)
    for (const t of tripel)
      assert.ok(!(angka.length >= 2 && angka.every((n) => t.includes(n))), `latihan ${t} membocorkan: ${soal.tanya}`)
  }
})

test('tes Mathematical Literacy: 4 soal di aplikasi sama persis dengan rubrik, skor maks 6 per soal', () => {
  const soal = JSON.parse(baca('src/data/soal-literasi.json'))
  const kisi = JSON.parse(baca('scripts/kisi-literasi.json'))
  assert.equal(soal.length, 4)
  soal.forEach((s, i) => {
    assert.deepEqual([s.judul, s.teks, s.tanya], [kisi[i].judul, kisi[i].teks, kisi[i].tanya])
    assert.equal(
      kisi[i].tahap.reduce((t, x) => t + x.skor, 0),
      6,
    )
  })
  assert.deepEqual(
    soal.map((s) => s.indikator.split(' ')[0]),
    ['Mathematical', 'Formulating', 'Employing', 'Interpreting,'],
  )
})
