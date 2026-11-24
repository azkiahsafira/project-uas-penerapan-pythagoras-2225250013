// Instrumen penelitian: pre-test, post-test (tes 10 soal cadangan), dan Kuesioner Harian Cognitive Load.
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

// Kuesioner Harian Cognitive Load (instrumen dari dosen pembimbing; rujukan Paas 1992, Paas dkk. 2003, Sweller dkk. 1998,
// Leppink dkk. 2013, Klepsch dkk. 2017): 10 butir usaha mental skala 1–9 (Paas), diisi di AKHIR Pertemuan 1 dan AKHIR
// Pertemuan 2. Butir 1–3 extraneous load (EL), 4–6 intrinsic load (IL), 7–10 germane load (GL). Teks butir SAMA PERSIS
// dengan lembar dosen agar kelompok aplikasi dan kelompok tanpa aplikasi mengisi instrumen yang sama.
export const SKALA_PAAS = [
  'Sangat rendah',
  'Sangat rendah hingga rendah',
  'Rendah',
  'Agak rendah',
  'Sedang',
  'Agak tinggi',
  'Tinggi',
  'Sangat tinggi',
  'Amat sangat tinggi',
]

export const BAGIAN_KUESIONER = {
  EL: 'Extraneous Load (usaha berpikir karena cara penyajian pembelajaran)',
  IL: 'Intrinsic Load (usaha berpikir karena tingkat kesulitan materi)',
  GL: 'Germane Load (usaha berpikir untuk membangun pemahaman)',
}

export const KUESIONER_HARIAN = [
  { id: 'b1', dimensi: 'EL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk memahami maksud penjelasan dan petunjuk dari guru hari ini?' },
  { id: 'b2', dimensi: 'EL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk memahami tampilan media atau lembar kerja yang digunakan hari ini?' },
  { id: 'b3', dimensi: 'EL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk mencari dan mencocokkan informasi dari penjelasan guru, papan tulis, dan lembar kerja hari ini?' },
  { id: 'b4', dimensi: 'IL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk memahami materi matematika yang dipelajari hari ini?' },
  { id: 'b5', dimensi: 'IL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk menyelesaikan soal-soal matematika hari ini?' },
  { id: 'b6', dimensi: 'IL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk memahami hubungan antara konsep, rumus, dan langkah penyelesaian yang dipelajari hari ini?' },
  { id: 'b7', dimensi: 'GL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk benar-benar memahami materi hari ini, bukan sekadar menghafal?' },
  { id: 'b8', dimensi: 'GL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk meningkatkan pemahamanmu tentang topik yang dibahas hari ini?' },
  { id: 'b9', dimensi: 'GL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk meningkatkan pengetahuan dan pemahamanmu tentang matematika melalui kegiatan hari ini?' },
  { id: 'b10', dimensi: 'GL', teks: 'Seberapa besar usaha berpikir yang kamu keluarkan untuk meningkatkan pemahamanmu tentang rumus yang dipelajari hari ini?' },
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

// Skor tiap komponen = rata-rata butirnya (rentang 1–9), sesuai pedoman penskoran dosen
export function nilaiHarian(jawaban) {
  const rata = (dim) => {
    const nilai = KUESIONER_HARIAN.filter((b) => b.dimensi === dim).map((b) => jawaban[b.id])
    return Math.round((nilai.reduce((t, n) => t + n, 0) / nilai.length) * 100) / 100
  }
  return { EL: rata('EL'), IL: rata('IL'), GL: rata('GL') }
}
