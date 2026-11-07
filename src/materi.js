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
//   visual  : (opsional) { jenis: 'segitiga', sisi, cari, sembunyikan } atau { jenis: 'persegi' }
//   cek     : (opsional) pertanyaan pemahaman
//             { tanya, tipe: 'angka' | 'pilihan', opsi?, jawab, petunjuk, penjelasan }

export const SESI = [
  {
    id: 1,
    judul: 'Sesi 1: Mengenal Segitiga Siku-siku, Kuadrat, dan Akar',
    tujuan: 'Mengenali sisi-sisi segitiga siku-siku dan menghitung kuadrat serta akar kuadrat.',
    langkah: [
      {
        judul: 'Apa itu segitiga siku-siku?',
        isi: [
          'Segitiga siku-siku adalah segitiga yang salah satu sudutnya 90° (sudut siku-siku). Tanda kotak kecil di pojok gambar menunjukkan sudut siku-siku.',
          'Contohnya ada di sekitar kita: tangga yang bersandar di dinding, atau penggaris segitiga.',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 4, b: 3, c: 5 }, cari: null },
      },
      {
        judul: 'Nama sisi-sisinya',
        isi: [
          'Dua sisi yang membentuk sudut siku-siku disebut sisi siku-siku. Kita beri nama a (alas) dan b (tinggi).',
          'Sisi yang berada di depan sudut siku-siku disebut sisi miring atau hipotenusa, kita beri nama c. Sisi miring selalu sisi yang paling panjang.',
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
        judul: 'Kuadrat sebuah bilangan',
        isi: [
          'Kuadrat artinya bilangan dikalikan dengan dirinya sendiri. Ditulis dengan angka 2 kecil di atas.',
          'Kuadrat juga sama dengan luas persegi: persegi bersisi 3 luasnya 3 × 3 = 9.',
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
          'Karena 5² = 25, maka √25 = 5.',
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
        judul: 'Ringkasan Sesi 1',
        isi: [
          'Segitiga siku-siku punya satu sudut 90°.',
          'Sisi siku-siku: a dan b. Sisi miring: c, selalu paling panjang.',
          'Kuadrat: bilangan dikali dirinya sendiri (4² = 16). Akar kuadrat adalah kebalikannya (√16 = 4).',
        ],
        cek: {
          tanya: 'Cek terakhir: berapa √144?',
          tipe: 'angka',
          jawab: 12,
          petunjuk: 'Coba hitung 11², 12², 13².',
          penjelasan: '√144 = 12, karena 12 × 12 = 144.',
        },
      },
    ],
  },
  {
    id: 2,
    judul: 'Sesi 2: Teorema Pythagoras',
    tujuan: 'Memahami rumus c² = a² + b² dan menggunakannya untuk mencari sisi segitiga siku-siku.',
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
        judul: 'Contoh: mencari sisi miring',
        isi: ['Diketahui a = 6 dan b = 8. Kita cari c dengan langkah berikut:'],
        rumus: ['c² = a² + b²', 'c² = 6² + 8²', 'c² = 36 + 64', 'c² = 100', 'c = √100 = 10'],
        visual: { jenis: 'segitiga', sisi: { a: 6, b: 8, c: 10 }, cari: 'c' },
      },
      {
        judul: 'Giliran kamu (dibantu)',
        isi: ['Diketahui a = 5 dan b = 12. Langkah awal sudah dikerjakan. Lanjutkan langkah terakhirnya.'],
        rumus: ['c² = 5² + 12²', 'c² = 25 + 144', 'c² = 169', 'c = √169 = ...'],
        visual: { jenis: 'segitiga', sisi: { a: 5, b: 12, c: 13 }, cari: 'c', sembunyikan: true },
        cek: {
          tanya: 'Berapa panjang c?',
          tipe: 'angka',
          jawab: 13,
          petunjuk: 'Bilangan berapa yang dikuadratkan hasilnya 169? Coba 13 × 13.',
          penjelasan: 'c = √169 = 13, karena 13 × 13 = 169.',
        },
      },
      {
        judul: 'Mencari sisi siku-siku',
        isi: [
          'Jika yang dicari sisi siku-siku (a atau b), rumusnya dibalik: kuadrat sisi miring DIKURANGI kuadrat sisi yang diketahui.',
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
          'Mencari sisi siku-siku: kurangkan kuadrat (yang besar dikurangi yang kecil), lalu akarkan.',
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
    tujuan: 'Menggunakan teorema Pythagoras untuk menyelesaikan soal cerita (literasi matematis).',
    langkah: [
      {
        judul: 'Strategi 4 langkah',
        isi: [
          'Saat bertemu soal cerita, gunakan 4 langkah ini:',
          '1. Pahami: apa yang diketahui dan apa yang ditanya?',
          '2. Gambar: buat segitiga siku-siku dan tandai sisinya.',
          '3. Hitung: pilih rumus yang tepat (dijumlah atau dikurang).',
          '4. Periksa: apakah jawabannya masuk akal? Sisi miring harus paling panjang.',
        ],
      },
      {
        judul: 'Contoh: tangga',
        isi: [
          'Tangga sepanjang 5 m bersandar di dinding. Kaki tangga berjarak 3 m dari dinding. Berapa tinggi dinding yang dicapai tangga?',
          'Pahami: tangga = sisi miring (c = 5), jarak ke dinding = alas (a = 3), tinggi dinding = b (ditanya).',
          'Hitung: karena mencari sisi siku-siku, kuadratnya dikurang.',
          'Periksa: 4 m lebih pendek dari tangga 5 m, jadi masuk akal.',
        ],
        rumus: ['b² = 5² − 3² = 25 − 9 = 16', 'b = √16 = 4 m'],
        visual: { jenis: 'segitiga', sisi: { a: 3, b: 4, c: 5 }, cari: 'b' },
      },
      {
        judul: 'Mengenali sisi miring dalam cerita',
        isi: [
          'Benang layang-layang terulur sepanjang 25 m. Jarak mendatar dari anak ke titik tepat di bawah layang-layang adalah 15 m.',
        ],
        cek: {
          tanya: 'Dalam cerita ini, apa yang menjadi sisi miring?',
          tipe: 'pilihan',
          opsi: ['Panjang benang', 'Jarak mendatar', 'Tinggi layang-layang'],
          jawab: 'Panjang benang',
          petunjuk: 'Sisi miring adalah yang miring dan paling panjang, menghubungkan anak dengan layang-layang.',
          penjelasan: 'Benang membentang miring dari tangan anak ke layang-layang, jadi benang adalah sisi miring.',
        },
      },
      {
        judul: 'Selesaikan soal layang-layang',
        isi: ['Benang = 25 m (sisi miring), jarak mendatar = 15 m. Berapa meter tinggi layang-layang?'],
        visual: { jenis: 'segitiga', sisi: { a: 15, b: 20, c: 25 }, cari: 'b', sembunyikan: true },
        cek: {
          tanya: 'Tinggi layang-layang (meter)?',
          tipe: 'angka',
          jawab: 20,
          petunjuk: 'b² = 25² − 15² = 625 − 225.',
          penjelasan: 'b² = 625 − 225 = 400, jadi b = √400 = 20 m.',
        },
      },
      {
        judul: 'Soal cerita: layar TV',
        isi: [
          'Ukuran TV disebut dari panjang diagonal layarnya. Sebuah layar lebarnya 80 cm dan tingginya 60 cm.',
          'Berapa cm panjang diagonal layar tersebut?',
        ],
        visual: { jenis: 'segitiga', sisi: { a: 80, b: 60, c: 100 }, cari: 'c', sembunyikan: true },
        cek: {
          tanya: 'Panjang diagonal (cm)?',
          tipe: 'angka',
          jawab: 100,
          petunjuk: 'Diagonal adalah sisi miring: c² = 80² + 60² = 6400 + 3600.',
          penjelasan: 'c² = 6400 + 3600 = 10000, jadi c = √10000 = 100 cm.',
        },
      },
      {
        judul: 'Apakah sudutnya siku-siku?',
        isi: [
          'Tukang bangunan memeriksa sudut lantai dengan mengukur 6 m, 8 m, dan 10 m. Jika 6² + 8² = 10², maka sudutnya pasti siku-siku.',
        ],
        rumus: ['6² + 8² = 36 + 64 = 100', '10² = 100'],
        cek: {
          tanya: 'Apakah sisi 6, 8, dan 10 membentuk segitiga siku-siku?',
          tipe: 'pilihan',
          opsi: ['Ya', 'Tidak'],
          jawab: 'Ya',
          petunjuk: 'Bandingkan 6² + 8² dengan 10².',
          penjelasan: 'Ya. 36 + 64 = 100 = 10², jadi memenuhi teorema Pythagoras.',
        },
      },
      {
        judul: 'Refleksi',
        isi: [
          'Selamat, kamu sudah menyelesaikan semua sesi!',
          'Coba pikirkan: di mana lagi kamu bisa menemukan segitiga siku-siku di sekitarmu? Misalnya di atap rumah, jalan pintas memotong lapangan, atau ramp kursi roda.',
          'Untuk berlatih lebih banyak, buka menu Latihan Soal.',
        ],
      },
    ],
  },
]
