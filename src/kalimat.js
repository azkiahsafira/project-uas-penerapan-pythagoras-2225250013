// Semua kalimat sapaan karakter & suara hewan dikumpulkan di sini agar mudah diubah.
//
// Catatan penting: kalimat SENGAJA tidak memuat rumus atau jawaban soal,
// supaya siswa yang iseng mengklik karakter sebelum pre-test tidak mendapat bocoran.

// Salam sesuai jam di perangkat siswa
export function salamWaktu() {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat pagi! ☀️'
  if (jam < 15) return 'Selamat siang! 🌤️'
  if (jam < 18) return 'Selamat sore! 🌇'
  return 'Selamat malam! 🌙'
}

// Balon kata di header. Kalimat bergantian setiap beberapa detik, sesuai menu.
// Kalimat pertama menu Belajar diawali salam sesuai waktu.
export const SAPAAN = {
  belajar: [
    'Aku Siku! Yuk belajar pelan-pelan, satu langkah dulu.',
    'Pilih sesi yang ada tulisan "Ayo mulai!" ya.',
    'Setiap langkah ada pertanyaan kecil, santai saja!',
    'Selesaikan satu sesi untuk melihat aku menari! 💃',
    'Klik aku, Raka, atau Nisa kalau mau ngobrol!',
    'Hewan-hewan di bawah halaman juga bisa diajak main, lho! 🐰',
  ],
  kalkulator: [
    'Masukkan dua sisi, nanti aku bantu hitung sisi ketiga!',
    'Coba tombol "Coba hitung" di contoh soal di bawah!',
    'Perhatikan garis segitiganya tergambar sendiri ✨',
    'Langkah perhitungannya ditulis satu per satu, lho!',
  ],
  latihan: [
    'Ayo latihan! Salah itu wajar, coba lagi ya.',
    'Jawab benar berturut-turut untuk dapat combo 🔥',
    'Gambar di samping bisa membantumu, lho!',
    'Bingung? Tekan "Lihat jawaban" lalu baca pembahasannya.',
  ],
  tes: ['Kerjakan sendiri ya. Kamu pasti bisa!'],
}

// Sorakan saat Siku diklik
export const SORAK = [
  'Hore! Kamu keren! ⭐',
  'Semangat! Kamu pasti bisa!',
  'Pelan-pelan saja, pahami tiap langkah 😉',
  'Belajar itu seru, kan?',
  'Aku segitiga paling bahagia sedunia!',
  'Tos dulu dong! ✋',
  'Kalau bingung, baca petunjuknya ya!',
  'Salah itu wajar, yang penting terus mencoba 💪',
  'Aku punya satu sudut siku-siku, lho! 📐',
  'Jangan lupa minum air putih ya 💧',
  'Kamu hebat sudah sampai sini! 🌟',
  'Senyum dulu dong! 😄',
  'Matematika itu kayak teka-teki, seru!',
  'Aku bangga sama kamu! 🥰',
  'Capek? Istirahat sebentar juga boleh 😊',
  'Topi wisudaku keren, kan? 🎓',
]

// Sapaan saat Raka (siswa) dan Nisa (siswi) diklik
export const SAPA = {
  siswa: [
    'Halo! Aku Raka, kita belajar bareng ya!',
    'Aku juga lagi belajar Pythagoras, lho!',
    'Ayo kita jadi juara kelas! 🏆',
    'Tadi aku sarapan dulu biar semangat! 🍳',
    'Cita-citaku jadi arsitek, harus jago segitiga! 🏗️',
    'Ssst... Nisa paling rajin di kelas kami 😄',
    'Main layang-layang juga pakai matematika, lho! 🪁',
    'Kalau ada yang susah, kita kerjakan bareng!',
    'Aku suka menggambar segitiga pakai penggaris 📏',
    'Yuk lanjut, sedikit lagi!',
  ],
  siswi: [
    'Hai! Aku Nisa. Semangat belajarnya ya! 💪',
    'Aku suka soal cerita, seru banget!',
    'Yuk kerjakan bareng-bareng! 📝',
    'Baca soalnya pelan-pelan ya 📖',
    'Aku selalu mencatat yang penting di buku ✏️',
    'Raka suka bercanda, tapi dia pintar, lho 😆',
    'Kalau salah, coba lagi. Pasti bisa!',
    'Cita-citaku jadi guru matematika! 👩‍🏫',
    'Sedikit demi sedikit, lama-lama jadi bukit ⛰️',
    'Kamu keren sudah mau belajar hari ini! 🌸',
  ],
}

// Suara hewan di bawah halaman (bergantian setiap diklik)
export const SUARA_HEWAN = {
  kelinci: ['Boing boing! 🥕', 'Wortel itu enak, lho! 🥕', 'Lompat-lompat, ayo semangat! 🐰', 'Telingaku panjang, kan? 👂'],
  ayam: ['Ciap ciap! 🐣', 'Aku masih kecil tapi rajin belajar!', 'Ciap! Sudah sarapan belum? 🌽'],
  kucing: ['Meong! 🐾', 'Meong~ elus lagi dong 😺', 'Purrr... nyaman sekali 💤', 'Aku suka ikan! 🐟'],
  bebek: ['Kwek kwek! 🦆', 'Aku jago berenang! 💦', 'Kwek! Jalan-jalan dulu, ah'],
  panda: ['Nyam nyam bambu! 🎋', 'Aku hitam putih, lucu kan? 🐼', 'Jangan lupa istirahat ya!'],
  katak: ['Kwok kwok! 🐸', 'Aku bisa lompat jauh! 🌿', 'Kwok! Habis hujan, seru!'],
  anjing: ['Guk guk! 🐶', 'Ayo main lempar bola! 🎾', 'Guk! Aku sayang kamu 💛'],
  beruang: ['Halo! Peluk dulu 🐻', 'Aku suka madu! 🍯', 'Semangat belajarnya ya! 💪', 'Hoaam... aku ngantuk 😴'],
}
