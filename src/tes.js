// Instrumen penelitian: pre-test, post-test, dan kuesioner beban kognitif Leppink.
//
// Pre-test dan post-test adalah soal PARALEL: indikator dan tingkat kesulitan
// tiap nomor sama, hanya angka/konteksnya berbeda, supaya siswa tidak sekadar
// menghafal jawaban pre-test. Soal tidak sama dengan contoh di menu Belajar.
//
// Struktur soal:
//   indikator : kemampuan yang diukur
//   tanya     : teks soal
//   tipe      : 'pilihan' | 'angka'
//   opsi      : (pilihan) daftar jawaban
//   jawab     : kunci jawaban (teks opsi, atau angka)

export const INDIKATOR = [
  'Mengenali sisi miring segitiga siku-siku',
  'Menghitung kuadrat bilangan',
  'Menghitung akar kuadrat',
  'Menentukan bentuk rumus Pythagoras',
  'Menghitung sisi miring',
  'Menghitung sisi siku-siku',
  'Soal cerita: mencari sisi siku-siku',
  'Soal cerita: mencari sisi miring (jarak)',
  'Menentukan tripel Pythagoras',
  'Soal cerita: diagonal layar',
]

export const PRETEST = [
  {
    tanya: 'Pada segitiga siku-siku, sisi miring adalah ...',
    tipe: 'pilihan',
    opsi: ['Sisi yang paling pendek', 'Sisi yang berhadapan dengan sudut siku-siku', 'Sisi alas', 'Sisi tegak'],
    jawab: 'Sisi yang berhadapan dengan sudut siku-siku',
  },
  { tanya: 'Berapa hasil 9²?', tipe: 'angka', jawab: 81 },
  { tanya: 'Berapa hasil √121?', tipe: 'angka', jawab: 11 },
  {
    tanya: 'Jika c adalah sisi miring, serta a dan b sisi siku-siku, rumus yang benar adalah ...',
    tipe: 'pilihan',
    opsi: ['c² = a² + b²', 'c = a + b', 'c² = a² − b²', 'c = a × b'],
    jawab: 'c² = a² + b²',
  },
  { tanya: 'Segitiga siku-siku memiliki sisi a = 9 cm dan b = 12 cm. Berapa cm panjang sisi miringnya?', tipe: 'angka', jawab: 15 },
  { tanya: 'Segitiga siku-siku memiliki sisi miring 17 cm dan salah satu sisi siku-sikunya 8 cm. Berapa cm sisi siku-siku yang lain?', tipe: 'angka', jawab: 15 },
  {
    tanya: 'Sebuah tangga sepanjang 10 m disandarkan ke dinding. Jarak kaki tangga ke dinding 6 m. Berapa meter tinggi dinding yang dicapai ujung tangga?',
    tipe: 'pilihan',
    opsi: ['4 m', '8 m', '12 m', '16 m'],
    jawab: '8 m',
  },
  { tanya: 'Rudi bersepeda 12 km ke utara, lalu 5 km ke timur. Berapa km jarak terpendek Rudi dari titik awal?', tipe: 'angka', jawab: 13 },
  {
    tanya: 'Manakah ukuran sisi yang membentuk segitiga siku-siku?',
    tipe: 'pilihan',
    opsi: ['4, 5, 6', '5, 12, 13', '6, 7, 8', '2, 3, 4'],
    jawab: '5, 12, 13',
  },
  { tanya: 'Layar sebuah tablet lebarnya 16 cm dan tingginya 12 cm. Berapa cm panjang diagonal layar tablet tersebut?', tipe: 'angka', jawab: 20 },
]

export const POSTTEST = [
  {
    tanya: 'Sisi terpanjang pada segitiga siku-siku disebut ...',
    tipe: 'pilihan',
    opsi: ['Alas', 'Tinggi', 'Sisi miring (hipotenusa)', 'Sisi siku-siku'],
    jawab: 'Sisi miring (hipotenusa)',
  },
  { tanya: 'Berapa hasil 8²?', tipe: 'angka', jawab: 64 },
  { tanya: 'Berapa hasil √196?', tipe: 'angka', jawab: 14 },
  {
    tanya: 'Jika c adalah sisi miring, rumus untuk mencari sisi siku-siku a adalah ...',
    tipe: 'pilihan',
    opsi: ['a² = c² + b²', 'a² = c² − b²', 'a = c − b', 'a² = b² − c²'],
    jawab: 'a² = c² − b²',
  },
  { tanya: 'Segitiga siku-siku memiliki sisi a = 12 cm dan b = 16 cm. Berapa cm panjang sisi miringnya?', tipe: 'angka', jawab: 20 },
  { tanya: 'Segitiga siku-siku memiliki sisi miring 25 cm dan salah satu sisi siku-sikunya 7 cm. Berapa cm sisi siku-siku yang lain?', tipe: 'angka', jawab: 24 },
  {
    tanya: 'Benang layang-layang yang terulur panjangnya 50 m. Jarak mendatar dari anak ke titik tepat di bawah layang-layang 30 m. Berapa meter tinggi layang-layang?',
    tipe: 'pilihan',
    opsi: ['20 m', '40 m', '60 m', '80 m'],
    jawab: '40 m',
  },
  { tanya: 'Sinta berjalan 8 m ke barat, lalu 15 m ke selatan. Berapa meter jarak terpendek Sinta dari titik awal?', tipe: 'angka', jawab: 17 },
  {
    tanya: 'Manakah ukuran sisi yang membentuk segitiga siku-siku?',
    tipe: 'pilihan',
    opsi: ['7, 24, 25', '6, 9, 11', '5, 6, 7', '3, 5, 7'],
    jawab: '7, 24, 25',
  },
  { tanya: 'Layar sebuah televisi lebarnya 36 cm dan tingginya 27 cm. Berapa cm panjang diagonal layar televisi tersebut?', tipe: 'angka', jawab: 45 },
]

// Kuesioner beban kognitif, diadaptasi dari Leppink dkk. (2013):
// 3 butir intrinsic load (IL), 3 butir extraneous load (EL), 4 butir germane load (GL).
// Skala 0 (sama sekali tidak setuju) sampai 10 (sangat setuju).
export const LEPPINK = [
  { id: 'IL1', dimensi: 'IL', teks: 'Materi yang dipelajari dalam kegiatan ini sangat rumit.' },
  { id: 'IL2', dimensi: 'IL', teks: 'Rumus-rumus dalam kegiatan ini terasa sangat rumit bagi saya.' },
  { id: 'IL3', dimensi: 'IL', teks: 'Konsep dan istilah dalam kegiatan ini terasa sangat rumit bagi saya.' },
  { id: 'EL1', dimensi: 'EL', teks: 'Petunjuk dan penjelasan selama kegiatan ini sangat tidak jelas.' },
  { id: 'EL2', dimensi: 'EL', teks: 'Petunjuk dan penjelasan dalam kegiatan ini sangat tidak membantu saya belajar.' },
  { id: 'EL3', dimensi: 'EL', teks: 'Petunjuk dan penjelasan dalam kegiatan ini penuh dengan kata-kata yang membingungkan.' },
  { id: 'GL1', dimensi: 'GL', teks: 'Kegiatan ini benar-benar meningkatkan pemahaman saya tentang materi yang dipelajari.' },
  { id: 'GL2', dimensi: 'GL', teks: 'Kegiatan ini benar-benar meningkatkan pengetahuan dan pemahaman saya tentang teorema Pythagoras.' },
  { id: 'GL3', dimensi: 'GL', teks: 'Kegiatan ini benar-benar meningkatkan pemahaman saya tentang rumus-rumus yang dipelajari.' },
  { id: 'GL4', dimensi: 'GL', teks: 'Kegiatan ini benar-benar meningkatkan pemahaman saya tentang konsep dan istilah yang dipelajari.' },
]

export const NAMA_DIMENSI = {
  IL: 'Intrinsic load (beban karena kesulitan materi)',
  EL: 'Extraneous load (beban karena penyajian/gangguan)',
  GL: 'Germane load (beban yang membantu belajar)',
}

export function nilaiTes(soal, jawaban) {
  let benar = 0
  soal.forEach((s, i) => {
    const j = jawaban[i]
    if (j === undefined || j === '') return
    const ok = s.tipe === 'angka' ? Math.abs(parseFloat(String(j).replace(',', '.')) - s.jawab) < 0.01 : j === s.jawab
    if (ok) benar += 1
  })
  return { benar, total: soal.length, skor: Math.round((benar / soal.length) * 100) }
}

export function nilaiLeppink(jawaban) {
  const rata = (dim) => {
    const nilai = LEPPINK.filter((b) => b.dimensi === dim).map((b) => jawaban[b.id])
    return Math.round((nilai.reduce((t, n) => t + n, 0) / nilai.length) * 100) / 100
  }
  return { IL: rata('IL'), EL: rata('EL'), GL: rata('GL') }
}
