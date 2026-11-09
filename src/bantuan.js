// Bantuan belajar berbasis temuan wawancara (lihat prd.md §5):
// - IL3 / F2 : soal cek prasyarat kuadrat & akar
// - EL1 / F5 : Diketahui & Ditanya pada soal cerita
// - IL1 / F4 : orientasi segitiga yang diputar untuk menunjuk sisi miring
// - GL3 / F6 : petunjuk bertingkat 5 tahap yang memudar (fading)
// - GL2 / F8 : cek kewajaran jawaban
// - GL4 / F7 : pertanyaan refleksi "Mengapa…?"
import { INPUT, bulat } from './pythagoras.js'

const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]

const kocok = (arr) => {
  const salin = [...arr]
  for (let i = salin.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[salin[i], salin[j]] = [salin[j], salin[i]]
  }
  return salin
}

// ---------------------------------------------------------------------------
// F2 Cek prasyarat: 2 soal kuadrat + 2 soal akar kuadrat
// ---------------------------------------------------------------------------
export const JUMLAH_PRASYARAT = 4
export const BATAS_SIAP = 3 // minimal benar agar dianggap siap

export function buatPrasyarat() {
  // 8 dan 9 tidak dipakai karena 8² dan 9² adalah butir post-test/pre-test
  const [k1, k2] = kocok([3, 4, 5, 6, 7, 11, 12, 13, 15, 16])
  const [r1, r2] = kocok([4, 5, 6, 7, 8, 9, 10, 12, 13, 15])
  return kocok([
    {
      tanya: `${k1}² = …`,
      baca: `${k1} kuadrat sama dengan berapa?`,
      jawab: k1 * k1,
      jelas: `${k1}² = ${k1} × ${k1} = ${k1 * k1}`,
    },
    {
      tanya: `${k2}² = …`,
      baca: `${k2} kuadrat sama dengan berapa?`,
      jawab: k2 * k2,
      jelas: `${k2}² = ${k2} × ${k2} = ${k2 * k2}`,
    },
    {
      tanya: `√${r1 * r1} = …`,
      baca: `Akar kuadrat dari ${r1 * r1} sama dengan berapa?`,
      jawab: r1,
      jelas: `√${r1 * r1} = ${r1}, karena ${r1} × ${r1} = ${r1 * r1}`,
    },
    {
      tanya: `√${r2 * r2} = …`,
      baca: `Akar kuadrat dari ${r2 * r2} sama dengan berapa?`,
      jawab: r2,
      jelas: `√${r2 * r2} = ${r2}, karena ${r2} × ${r2} = ${r2 * r2}`,
    },
  ])
}

const KUNCI_PRASYARAT = 'pythagoras-prasyarat'

export function bacaPrasyarat() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_PRASYARAT))
  } catch {
    return null
  }
}

export function simpanPrasyarat(hasil) {
  try {
    localStorage.setItem(KUNCI_PRASYARAT, JSON.stringify(hasil))
  } catch {
    // penyimpanan tidak tersedia: hasil hanya berlaku selama halaman terbuka
  }
}

// ---------------------------------------------------------------------------
// F5 Diketahui & Ditanya
// ---------------------------------------------------------------------------
export const PERAN = { siku: 'Sisi siku-siku', miring: 'Sisi miring' }
export const peranSisi = (k) => (k === 'c' ? 'miring' : 'siku')

// Pecah cerita menjadi potongan teks & angka (angka yang diketahui bisa diketuk).
// Satuan sesudah angka (cm, m, km, inci) ikut ditampilkan pada chip.
export function pecahCerita(soal) {
  const diketahui = INPUT[soal.cari].map((k) => ({ sisi: k, nilai: soal.sisi[k] }))
  const potongan = []
  const pola = /(\d+)(\s*(?:cm|km|m|inci)\b)?/g
  let akhir = 0
  for (const m of soal.cerita.matchAll(pola)) {
    const data = diketahui.find((d) => String(d.nilai) === m[1])
    if (!data) continue
    if (m.index > akhir) potongan.push({ teks: soal.cerita.slice(akhir, m.index) })
    potongan.push({ teks: m[0], sisi: data.sisi, nilai: data.nilai })
    akhir = m.index + m[0].length
  }
  if (akhir < soal.cerita.length) potongan.push({ teks: soal.cerita.slice(akhir) })
  return potongan
}

// ---------------------------------------------------------------------------
// F4 Orientasi segitiga (diputar & dicerminkan) untuk latihan menunjuk sisi miring
// ---------------------------------------------------------------------------
const SUDUT = [0, 90, 180, 270, 35, 140, 215, 320]
export const buatOrientasi = () => ({ sudut: acak(SUDUT), cermin: Math.random() < 0.5 })

// ---------------------------------------------------------------------------
// F6 Petunjuk bertingkat (5 tahap). Saat siswa sudah lancar, hanya 3 tahap
// pertama yang ditawarkan (petunjuk memudar / fading).
// ---------------------------------------------------------------------------
export const TAHAP_PETUNJUK = ['Cari segitiga siku-siku', 'Tentukan sisi miring', 'Pilih rumus', 'Hitung', 'Cek jawaban']

export function petunjuk(soal) {
  const { sisi, cari } = soal
  const lain = cari === 'a' ? 'b' : 'a'
  const kuadrat = cari === 'c' ? sisi.a ** 2 + sisi.b ** 2 : sisi.c ** 2 - sisi[lain] ** 2
  return [
    'Bayangkan gambarnya: dua benda yang saling tegak lurus (misalnya dinding & tanah, timur & utara) membentuk sudut siku-siku. Sisi-sisi di cerita adalah sisi segitiga itu.',
    cari === 'c'
      ? 'Sisi miring berada di depan sudut siku-siku dan paling panjang. Di soal ini, sisi miring adalah yang DITANYA.'
      : `Sisi miring berada di depan sudut siku-siku dan paling panjang. Di soal ini, sisi miringnya sudah DIKETAHUI, yaitu ${sisi.c}.`,
    cari === 'c'
      ? 'Yang dicari sisi miring, jadi kuadrat dua sisi siku-siku DIJUMLAH: c² = a² + b²'
      : `Yang dicari sisi siku-siku, jadi kuadrat sisi miring DIKURANGI kuadrat sisi lainnya: ${cari}² = c² − ${lain}²`,
    cari === 'c'
      ? `c² = ${sisi.a}² + ${sisi.b}² = ${sisi.a ** 2} + ${sisi.b ** 2} = ${kuadrat}`
      : `${cari}² = ${sisi.c}² − ${sisi[lain]}² = ${sisi.c ** 2} − ${sisi[lain] ** 2} = ${kuadrat}`,
    `Tarik akarnya: √${kuadrat} = ${bulat(Math.sqrt(kuadrat))}. Cek: apakah sisi miring tetap yang paling panjang?`,
  ]
}

export const BATAS_LANCAR = 3 // soal benar berturut-turut tanpa bantuan → bantuan dipudarkan

// ---------------------------------------------------------------------------
// F8 Cek kewajaran: sisi miring harus paling panjang
// ---------------------------------------------------------------------------
export function cekKewajaran(soal, n) {
  const { sisi, cari } = soal
  if (!(n > 0)) return 'Panjang sisi harus lebih dari 0.'
  if (cari === 'c') {
    const terpanjang = Math.max(sisi.a, sisi.b)
    if (n <= terpanjang)
      return `Sisi miring harus PALING PANJANG, tetapi jawabanmu (${n}) tidak lebih panjang dari ${terpanjang}.`
  } else if (n >= sisi.c) {
    return `Sisi siku-siku harus LEBIH PENDEK dari sisi miring (${sisi.c}), tetapi jawabanmu ${n}.`
  }
  return null
}

export function kalimatKewajaran(soal) {
  const { sisi, cari } = soal
  return cari === 'c'
    ? `Cek kewajaran: ${sisi.c} lebih panjang dari ${sisi.a} dan ${sisi.b}, jadi masuk akal sebagai sisi miring.`
    : `Cek kewajaran: ${sisi[cari]} lebih pendek dari sisi miring ${sisi.c}, jadi masuk akal.`
}

// ---------------------------------------------------------------------------
// F7 Refleksi "Mengapa…?" — muncul setiap soal ke-3 (soal kunci)
// ---------------------------------------------------------------------------
export const SETIAP_REFLEKSI = 3

export function buatRefleksi(soal) {
  const { sisi, cari } = soal
  const bank = [
    {
      tanya: 'Mengapa soal ini bisa diselesaikan dengan teorema Pythagoras?',
      benar: 'Karena di dalam cerita ada segitiga siku-siku',
      salah: ['Karena di soal ada dua angka', 'Karena satuannya sama'],
      jelas: 'Teorema Pythagoras hanya berlaku pada segitiga siku-siku. Jadi langkah pertama selalu mencari sudut siku-sikunya.',
    },
    cari === 'c'
      ? {
          tanya: `Mengapa jawabanmu (${sisi.c}) harus lebih panjang dari ${sisi.a} dan ${sisi.b}?`,
          benar: 'Karena sisi miring berhadapan dengan sudut siku-siku, sisi terpanjang',
          salah: ['Karena hasil penjumlahan selalu besar', 'Karena c huruf terakhir'],
          jelas: 'Sisi miring berada di depan sudut terbesar (90°), jadi sisi miring selalu paling panjang.',
        }
      : {
          tanya: `Mengapa di soal ini kita MENGURANGI (${sisi.c}² − …), bukan menjumlah?`,
          benar: 'Karena yang dicari sisi siku-siku, sedangkan sisi miring sudah diketahui',
          salah: ['Karena angkanya terlalu besar', 'Karena soalnya tentang tinggi'],
          jelas: `c² = a² + b², jadi sisi siku-siku = c² dikurangi kuadrat sisi siku-siku lainnya.`,
        },
  ]
  const r = acak(bank)
  return { ...r, opsi: kocok([r.benar, ...r.salah]) }
}
