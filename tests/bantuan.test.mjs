// Pengujian fitur dari temuan wawancara (src/bantuan.js): prasyarat, Diketahui/Ditanya, petunjuk, kewajaran, refleksi
import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  BATAS_SIAP,
  JUMLAH_PRASYARAT,
  TAHAP_PETUNJUK,
  buatOrientasi,
  buatPrasyarat,
  buatRefleksi,
  cekKewajaran,
  kalimatKewajaran,
  pecahCerita,
  peranSisi,
  petunjuk,
} from '../src/bantuan.js'

const soalJarak = {
  sisi: { a: 15, b: 20, c: 25 },
  cari: 'c',
  cerita: 'Andi berjalan 15 m ke timur, lalu 20 m ke utara. Berapa meter jarak terpendek Andi dari titik awal?',
}

test('cek prasyarat: 4 soal kuadrat/akar dengan kunci benar, tanpa 8² dan 9² (butir tes)', () => {
  for (let ulang = 0; ulang < 50; ulang++) {
    const soal = buatPrasyarat()
    assert.equal(soal.length, JUMLAH_PRASYARAT)
    for (const s of soal) {
      const kuadrat = s.tanya.match(/^(\d+)² = …$/)
      const akar = s.tanya.match(/^√(\d+) = …$/)
      assert.ok(kuadrat || akar, s.tanya)
      if (kuadrat) {
        assert.equal(s.jawab, Number(kuadrat[1]) ** 2)
        assert.ok(![8, 9].includes(Number(kuadrat[1])))
      } else assert.equal(s.jawab ** 2, Number(akar[1]))
    }
  }
  assert.ok(BATAS_SIAP <= JUMLAH_PRASYARAT)
})

test('Diketahui/Ditanya: angka di cerita dikenali beserta satuannya, hanya sisi yang diketahui', () => {
  const potongan = pecahCerita(soalJarak)
  assert.deepEqual(
    potongan.filter((p) => p.sisi).map((p) => [p.sisi, p.teks]),
    [
      ['a', '15 m'],
      ['b', '20 m'],
    ],
  )
  assert.equal(potongan.map((p) => p.teks).join(''), soalJarak.cerita) // teks soal tetap utuh
  assert.deepEqual(['a', 'b', 'c'].map(peranSisi), ['siku', 'siku', 'miring'])
})

test('petunjuk bertingkat: 5 tahap, tahap hitung memakai angka soal', () => {
  const p = petunjuk(soalJarak)
  assert.equal(p.length, TAHAP_PETUNJUK.length)
  assert.match(p[3], /15² \+ 20² = 225 \+ 400 = 625/)
  assert.match(p[4], /√625 = 25/)
  assert.match(petunjuk({ ...soalJarak, cari: 'b' })[2], /DIKURANGI/)
})

test('cek kewajaran: sisi miring harus terpanjang, sisi siku-siku lebih pendek', () => {
  assert.match(cekKewajaran(soalJarak, 18), /PALING PANJANG/)
  assert.equal(cekKewajaran(soalJarak, 25), null)
  const cariA = { ...soalJarak, cari: 'a' }
  assert.match(cekKewajaran(cariA, 30), /LEBIH PENDEK/)
  assert.match(cekKewajaran(cariA, 0), /lebih dari 0/)
  assert.match(kalimatKewajaran(soalJarak), /25 lebih panjang dari 15 dan 20/)
})

test('refleksi: jawaban benar selalu ada di pilihan, 3 pilihan berbeda', () => {
  for (let ulang = 0; ulang < 30; ulang++) {
    const r = buatRefleksi(soalJarak)
    assert.ok(r.opsi.includes(r.benar))
    assert.equal(new Set(r.opsi).size, 3)
  }
})

test('orientasi segitiga untuk latihan menunjuk sisi miring', () => {
  const o = buatOrientasi()
  assert.ok([0, 90, 180, 270, 35, 140, 215, 320].includes(o.sudut))
  assert.equal(typeof o.cermin, 'boolean')
})
