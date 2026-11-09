// Materi pembelajaran teorema Pythagoras untuk siswa SMP, dibagi 3 sesi.
//
// Rancangan mengikuti teori beban kognitif (Cognitive Load Theory):
// - Intrinsic load DIKELOLA: materi dipecah menjadi langkah kecil, satu konsep
//   per layar, dan prasyarat (kuadrat & akar) diajarkan lebih dulu.
// - Extraneous load DITEKAN: satu layar hanya berisi teks singkat, satu gambar,
//   dan satu pertanyaan; tanpa animasi atau hiasan yang tidak perlu.
// - Germane load DIOPTIMALKAN: contoh lengkap (worked example) diikuti contoh
//   setengah jadi (faded example), cek pemahaman di tiap langkah, dan refleksi.
//
// Struktur tiap langkah:
//   judul   : judul layar
//   isi     : paragraf penjelasan (array string)
//   rumus   : (opsional) baris-baris rumus/perhitungan
//   visual  : (opsional) { jenis: 'segitiga', sisi, cari, sembunyikan } · { jenis: 'persegi' } · { jenis: 'tangga3d', sisi, cari }
//             · { jenis: 'putar', sisi, orientasi, label } (segitiga diputar dengan nama sisi bebas)
//   cek     : (opsional) pertanyaan pemahaman
//             { tanya, tipe: 'angka' | 'pilihan', opsi?, jawab, petunjuk, penjelasan }
//
// Isi & urutan disamakan dengan materi PDF (docs/materi/Materi-Teorema-Pythagoras.pdf):
//   Sesi 1 = Bagian 1 (kuadrat & akar) + Bagian 2 (segitiga siku-siku & sisi miring, termasuk posisi diputar)
//   Sesi 2 = Bagian 3 (teorema Pythagoras & memilih rumus)
//   Sesi 3 = Bagian 4 (Strategi 5 Langkah, contoh tangga & layang-layang) + Bagian 5 (jarak terpendek, tripel, refleksi)

export const SESI = [
  {
    id: 1,
    judul: 'Sesi 1: Kuadrat, Akar, dan Segitiga Siku-siku',
    tujuan: 'Menghitung kuadrat dan akar kuadrat, lalu menunjukkan sisi miring segitiga siku-siku walaupun gambarnya diputar.',
    langkah: [
      {
        judul: 'Kuadrat sebuah bilangan',
        isi: [
          'Kuadrat artinya bilangan dikalikan dengan dirinya sendiri. Ditulis dengan angka 2 kecil di atas.',
          'Kuadrat juga sama dengan luas persegi: persegi bersisi 5 luasnya 5 × 5 = 25.',
        ],
        rumus: ['3² = 3 × 3 = 9', '5² = 5 × 5 = 25', '10² = 10 × 10 = 100'],
        cek: {
          tanya: 'Berapa hasil 7²?',
          tipe: 'angka',
          jawab: 49,
          petunjuk: '7² artinya 7 × 7, bukan 7 × 2.',
          penjelasan: '7² = 7 × 7 = 49.',
        },
      },
      {
        judul: 'Akar kuadrat',
        isi: [
          'Akar kuadrat (√) adalah kebalikan dari kuadrat. Pertanyaannya: bilangan berapa yang jika dikuadratkan menghasilkan angka ini?',
          'Karena 5 × 5 = 25, maka √25 = 5.',
        ],
        rumus: ['√9 = 3, karena 3² = 9', '√25 = 5, karena 5² = 25', '√100 = 10, karena 10² = 100'],
        cek: {
          tanya: 'Berapa hasil √64?',
          tipe: 'angka',
          jawab: 8,
          petunjuk: 'Bilangan berapa yang dikali dirinya sendiri hasilnya 64?',
          penjelasan: '√64 = 8, karena 8 × 8 = 64.',
        },
      },
      {
        judul: 'Tabel kuadrat 11–20',
        isi: [
          'Tabel ini menjadi pegangan selama belajar. Teorema Pythagoras selalu memakai kuadrat di awal dan akar di akhir.',
          'Cara memakai tabel untuk akar: √196 = ? → cari 196 di tabel → 14² = 196, jadi √196 = 14.',
        ],
        rumus: [
          '11² = 121 · 12² = 144 · 13² = 169',
          '14² = 196 · 15² = 225 · 16² = 256',
          '17² = 289 · 18² = 324 · 19² = 361 · 20² = 400',
        ],
        cek: {
          tanya: 'Pakai tabel: berapa √289?',
          tipe: 'angka',
          jawab: 17,
          petunjuk: 'Cari 289 di tabel. Bilangan berapa yang kuadratnya 289?',
          penjelasan: '√289 = 17, karena 17² = 289.',
        },
      },
      {
        judul: 'Apa itu segitiga siku-siku?',
        isi: [
          'Segitiga siku-siku punya satu sudut siku-siku (90°). Tanda kotak kecil di pojok gambar menunjukkan sudut siku-siku.',
          'Contohnya ada di sekitar kita: tangga yang bersandar di dinding, atau penggaris segitiga.',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 4, b: 3, c: 5 }, cari: null },
      },
      {
        judul: 'Nama sisi-sisinya',
        isi: [
          'Dua sisi yang mengapit sudut siku-siku disebut sisi siku-siku. Kita beri nama a dan b.',
          'Sisi yang berhadapan (di depan) sudut siku-siku disebut sisi miring atau hipotenusa, kita beri nama c. Sisi miring selalu sisi yang paling panjang.',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 4, b: 3, c: 5 }, cari: 'c' },
        cek: {
          tanya: 'Pada gambar, sisi mana yang merupakan sisi miring?',
          tipe: 'pilihan',
          opsi: ['a', 'b', 'c'],
          jawab: 'c',
          petunjuk: 'Cari sisi yang berada di depan (berhadapan dengan) kotak siku-siku.',
          penjelasan: 'Sisi c berhadapan dengan sudut siku-siku dan paling panjang, jadi c adalah sisi miring.',
        },
      },
      {
        judul: 'Awas keliru: segitiga yang diputar',
        isi: [
          'Sisi miring BUKAN selalu sisi paling bawah atau sisi yang tampak "miring". Segitiga bisa diputar atau dibalik.',
          'Caranya: temukan dulu kotak sudut siku-siku, lalu lihat sisi di depannya. Sisi miring juga selalu sisi terpanjang.',
        ],
        visual: {
          jenis: 'putar',
          sisi: { a: 4, b: 3, c: 5 },
          orientasi: { sudut: 200, cermin: true },
          label: { a: 'p', b: 'q', c: 'r' },
        },
        cek: {
          tanya: 'Segitiga pada gambar sudah diputar. Sisi mana yang merupakan sisi miring?',
          tipe: 'pilihan',
          opsi: ['p', 'q', 'r'],
          jawab: 'r',
          petunjuk: 'Cari dulu kotak kecil (sudut siku-siku). Sisi miring ada di depannya, tidak menempel pada kotak itu.',
          penjelasan: 'Sisi r berhadapan dengan kotak sudut siku-siku, jadi r adalah sisi miring walaupun posisinya diputar.',
        },
      },
      {
        judul: 'Ringkasan Sesi 1',
        isi: [
          'Kuadrat: bilangan dikali dirinya sendiri (4² = 16). Akar kuadrat adalah kebalikannya (√16 = 4).',
          'Segitiga siku-siku punya satu sudut 90°. Sisi siku-siku: a dan b. Sisi miring: c, di depan sudut siku-siku dan paling panjang.',
          'Walaupun segitiga diputar, sisi miring tetap sisi di depan sudut siku-siku.',
        ],
        cek: {
          tanya: 'Cek terakhir: berapa hasil 13²?',
          tipe: 'angka',
          jawab: 169,
          petunjuk: '13² = 13 × 13. Lihat juga tabel kuadrat.',
          penjelasan: '13² = 13 × 13 = 169.',
        },
      },
    ],
  },
  {
    id: 2,
    judul: 'Sesi 2: Teorema Pythagoras',
    tujuan: 'Memahami rumus c² = a² + b² dan memilih rumus yang tepat untuk mencari sisi segitiga siku-siku.',
    langkah: [
      {
        judul: 'Menemukan pola',
        isi: [
          'Di setiap sisi segitiga siku-siku dengan sisi 3, 4, dan 5, kita gambar persegi. Angka di dalam persegi adalah luasnya.',
          'Perhatikan: luas dua persegi kecil jika dijumlahkan sama dengan luas persegi besar. 9 + 16 = 25.',
        ],
        visual: { jenis: 'persegi' },
        cek: {
          tanya: 'Berapa 9 + 16?',
          tipe: 'angka',
          jawab: 25,
          petunjuk: 'Jumlahkan luas dua persegi yang kecil.',
          penjelasan: '9 + 16 = 25, sama dengan luas persegi pada sisi miring.',
        },
      },
      {
        judul: 'Teorema Pythagoras',
        isi: [
          'Pola tadi berlaku untuk SEMUA segitiga siku-siku. Inilah teorema Pythagoras:',
          'Kuadrat sisi miring sama dengan jumlah kuadrat kedua sisi siku-siku.',
        ],
        rumus: ['c² = a² + b²'],
        visual: { jenis: 'segitiga', sisi: { a: 4, b: 3, c: 5 }, cari: 'c' },
      },
      {
        judul: 'Pilih rumus sesuai yang dicari',
        isi: [
          'Mencari sisi miring c (sisi terpanjang) → TAMBAH: c² = a² + b², lalu c = √(a² + b²).',
          'Mencari sisi siku-siku a atau b (sisi yang lebih pendek) → KURANG: a² = c² − b² atau b² = c² − a².',
          'Saat mengurangkan, kuadrat sisi miring selalu ditulis di depan (yang besar dikurangi yang kecil).',
        ],
        rumus: ['c² = a² + b²', 'a² = c² − b²', 'b² = c² − a²'],
        cek: {
          tanya: 'Yang dicari sisi miring. Kuadrat kedua sisi lainnya dijumlah atau dikurang?',
          tipe: 'pilihan',
          opsi: ['Dijumlah', 'Dikurang'],
          jawab: 'Dijumlah',
          petunjuk: 'Sisi miring adalah sisi terpanjang, jadi hasilnya harus lebih besar.',
          penjelasan: 'Dijumlah: c² = a² + b², karena sisi miring adalah sisi terpanjang.',
        },
      },
      {
        judul: 'Contoh: mencari sisi miring',
        isi: ['Diketahui a = 6 dan b = 8. Kita cari c dengan langkah berikut:'],
        rumus: ['c² = a² + b²', 'c² = 6² + 8²', 'c² = 36 + 64', 'c² = 100', 'c = √100 = 10'],
        visual: { jenis: 'segitiga', sisi: { a: 6, b: 8, c: 10 }, cari: 'c' },
      },
      {
        judul: 'Giliran kamu (dibantu)',
        isi: [
          'Segitiga siku-siku dengan sisi siku-siku 15 cm dan 20 cm. Langkah awal sudah dikerjakan. Lanjutkan langkah terakhirnya.',
        ],
        rumus: ['c² = 15² + 20²', 'c² = 225 + 400', 'c² = 625', 'c = √625 = ... cm'],
        visual: { jenis: 'segitiga', sisi: { a: 20, b: 15, c: 25 }, cari: 'c', sembunyikan: true },
        cek: {
          tanya: 'Berapa cm panjang c?',
          tipe: 'angka',
          jawab: 25,
          petunjuk: 'Bilangan berapa yang dikuadratkan hasilnya 625? Coba 25 × 25.',
          penjelasan: 'c = √625 = 25 cm, karena 25 × 25 = 625.',
        },
      },
      {
        judul: 'Mencari sisi siku-siku',
        isi: [
          'Jika yang dicari sisi siku-siku (a atau b), kuadrat sisi miring DIKURANGI kuadrat sisi yang diketahui.',
          'Contoh: c = 10 dan a = 6. Cari b.',
        ],
        rumus: ['b² = c² − a²', 'b² = 10² − 6²', 'b² = 100 − 36', 'b² = 64', 'b = √64 = 8'],
        visual: { jenis: 'segitiga', sisi: { a: 6, b: 8, c: 10 }, cari: 'b' },
      },
      {
        judul: 'Coba sendiri',
        isi: ['Diketahui sisi miring c = 13 dan b = 5. Berapa panjang a?'],
        visual: { jenis: 'segitiga', sisi: { a: 12, b: 5, c: 13 }, cari: 'a', sembunyikan: true },
        cek: {
          tanya: 'Berapa panjang a?',
          tipe: 'angka',
          jawab: 12,
          petunjuk: 'a² = c² − b² = 169 − 25. Lalu cari akarnya.',
          penjelasan: 'a² = 13² − 5² = 169 − 25 = 144, jadi a = √144 = 12.',
        },
      },
      {
        judul: 'Ringkasan Sesi 2',
        isi: [
          'Mencari sisi miring: jumlahkan kuadrat, lalu akarkan.',
          'Mencari sisi siku-siku: kurangkan kuadrat (kuadrat sisi miring dikurangi kuadrat sisi yang diketahui), lalu akarkan.',
        ],
        rumus: ['c = √(a² + b²)', 'a = √(c² − b²)', 'b = √(c² − a²)'],
        cek: {
          tanya: 'Jika mencari sisi siku-siku, kuadratnya dijumlah atau dikurang?',
          tipe: 'pilihan',
          opsi: ['Dijumlah', 'Dikurang'],
          jawab: 'Dikurang',
          petunjuk: 'Sisi siku-siku lebih pendek dari sisi miring, jadi hasilnya harus lebih kecil.',
          penjelasan: 'Dikurang: kuadrat sisi miring dikurangi kuadrat sisi yang diketahui.',
        },
      },
    ],
  },
  {
    id: 3,
    judul: 'Sesi 3: Pythagoras dalam Kehidupan Sehari-hari',
    tujuan: 'Menyelesaikan soal cerita dengan Strategi 5 Langkah (literasi matematis: merumuskan, menerapkan, menafsirkan).',
    langkah: [
      {
        judul: 'Strategi 5 Langkah soal cerita',
        isi: [
          'Soal cerita sering panjang. Jangan langsung menghitung. Ikuti lima langkah ini satu per satu:',
          '1. Baca & tandai: garis bawahi angka penting dan kalimat pertanyaannya.',
          '2. Tulis Diketahui – Ditanya: pindahkan angka ke tabel, lengkap dengan satuannya.',
          '3. Gambar segitiga siku-siku: tandai sudut sikunya, tulis angka di samping sisinya, warnai sisi yang dicari.',
          '4. Pilih rumus & hitung: yang dicari sisi miring → tambah; yang dicari sisi siku-siku → kurang.',
          '5. Cek kewajaran: sisi miring harus paling panjang. Apakah jawabannya masuk akal?',
        ],
      },
      {
        judul: 'Contoh 1: panjang tangga',
        isi: [
          'Sebuah tangga disandarkan pada dinding. Jarak kaki tangga ke dinding 3 m, dan ujung atas tangga menyentuh dinding pada ketinggian 4 m. Berapa panjang tangga?',
          'Diketahui: kaki tangga ke dinding = 3 m, tinggi dinding = 4 m. Ditanya: panjang tangga. Tangga berada di depan sudut siku-siku, jadi tangga adalah sisi miring.',
          'Rumus: c² = a² + b² (mencari sisi miring → tambah).',
          'Cek: 5 m lebih panjang dari 3 m dan 4 m, jadi masuk akal.',
        ],
        rumus: ['c² = 3² + 4² = 9 + 16 = 25', 'c = √25 = 5 m'],
        // ilustrasi 3D three.js tangga–dinding (soal tangga dari wawancara kebutuhan)
        visual: { jenis: 'tangga3d', sisi: { a: 3, b: 4, c: 5 }, cari: 'c' },
      },
      {
        judul: 'Mengenali sisi miring dalam cerita',
        isi: [
          'Benang layang-layang yang terulur panjangnya 29 m. Jarak mendatar dari Dimas ke titik tepat di bawah layang-layang 20 m. Berapa tinggi layang-layang?',
        ],
        cek: {
          tanya: 'Dalam cerita ini, apa yang menjadi sisi miring?',
          tipe: 'pilihan',
          opsi: ['Panjang benang', 'Jarak mendatar', 'Tinggi layang-layang'],
          jawab: 'Panjang benang',
          petunjuk:
            'Bayangkan gambarnya: sudut siku-siku ada di tanah, tepat di bawah layang-layang. Sisi mana yang berada di depannya?',
          penjelasan:
            'Benang membentang dari tangan Dimas ke layang-layang, di depan sudut siku-siku, jadi benang adalah sisi miring.',
        },
      },
      {
        judul: 'Contoh 2: tinggi layang-layang',
        isi: [
          'Diketahui: benang = 29 m (sisi miring), jarak mendatar = 20 m. Ditanya: tinggi layang-layang (sisi siku-siku).',
          'Karena yang dicari sisi siku-siku, kuadratnya dikurang: b² = 29² − 20² = 841 − 400.',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 20, b: 21, c: 29 }, cari: 'b', sembunyikan: true },
        cek: {
          tanya: 'Berapa meter tinggi layang-layang?',
          tipe: 'angka',
          jawab: 21,
          petunjuk: 'b² = 841 − 400 = 441. Bilangan berapa yang kuadratnya 441?',
          penjelasan: 'b² = 441, jadi b = √441 = 21 m. Cek: 21 m lebih pendek dari benang 29 m, masuk akal.',
        },
      },
      {
        judul: 'Contoh 3: jarak terpendek',
        isi: [
          'Andi berjalan 15 m ke timur, lalu 20 m ke utara. Berapa jarak terpendek Andi dari titik awal?',
          'Arah timur dan utara membentuk sudut siku-siku. Jarak terpendek adalah garis lurus dari titik awal ke titik akhir, yaitu sisi miring.',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 15, b: 20, c: 25 }, cari: 'c', sembunyikan: true },
        cek: {
          tanya: 'Berapa meter jarak terpendek Andi?',
          tipe: 'angka',
          jawab: 25,
          petunjuk: 'c² = 15² + 20² = 225 + 400. Lalu cari akarnya.',
          penjelasan:
            'c² = 625, jadi c = √625 = 25 m. Menafsirkan: berjalan memutar 15 + 20 = 35 m, sedangkan jalan lurus hanya 25 m, lebih hemat 10 m.',
        },
      },
      {
        judul: 'Soal cerita: diagonal layar',
        isi: [
          'Ukuran layar disebut dari panjang diagonalnya. Sebuah layar laptop lebarnya 28 cm dan tingginya 21 cm.',
          'Berapa cm panjang diagonal layar tersebut?',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 28, b: 21, c: 35 }, cari: 'c', sembunyikan: true },
        cek: {
          tanya: 'Panjang diagonal (cm)?',
          tipe: 'angka',
          jawab: 35,
          petunjuk: 'Diagonal adalah sisi miring: c² = 28² + 21² = 784 + 441.',
          penjelasan: 'c² = 784 + 441 = 1.225, jadi c = √1.225 = 35 cm.',
        },
      },
      {
        judul: 'Tripel Pythagoras',
        isi: [
          'Tiga bilangan bulat yang memenuhi c² = a² + b² disebut tripel Pythagoras. Contoh: 3, 4, 5 · 6, 8, 10 · 20, 21, 29 · 9, 40, 41.',
          'Kelipatannya juga tripel, misalnya 3, 4, 5 dikali 5 menjadi 15, 20, 25.',
          'Cara memeriksa: kuadratkan dua bilangan terkecil, jumlahkan, lalu bandingkan dengan kuadrat bilangan terbesar.',
        ],
        rumus: ['15² + 20² = 225 + 400 = 625', '25² = 625 ✓ tripel Pythagoras'],
        cek: {
          tanya: 'Manakah yang merupakan tripel Pythagoras?',
          tipe: 'pilihan',
          opsi: ['4, 5, 6', '6, 8, 10', '5, 7, 9'],
          jawab: '6, 8, 10',
          petunjuk: 'Untuk tiap pilihan, bandingkan jumlah kuadrat dua bilangan kecil dengan kuadrat bilangan terbesar.',
          penjelasan: '6² + 8² = 36 + 64 = 100 = 10², jadi 6, 8, 10 adalah tripel Pythagoras (kelipatan 3, 4, 5).',
        },
      },
      {
        judul: 'Refleksi',
        isi: [
          'Selamat, kamu sudah menyelesaikan semua sesi!',
          'Pola yang sama, cerita berbeda: tangga–dinding, benang layang-layang, diagonal layar, jarak berjalan, kawat penopang tiang, dan diagonal taman semuanya segitiga siku-siku. Cari dulu sudut sikunya, tentukan sisi miring, lalu gunakan rumus yang sama.',
          'Pikirkan: 1) Mengapa saat mencari sisi siku-siku kita memakai pengurangan, bukan penjumlahan? 2) Bagaimana kamu tahu jawabanmu masuk akal tanpa menghitung ulang?',
          'Untuk berlatih lebih banyak, buka menu Latihan Soal.',
        ],
      },
    ],
  },
]
