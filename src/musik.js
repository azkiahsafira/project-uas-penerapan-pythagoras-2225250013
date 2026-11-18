// Musik latar "Lagu 3-4-5" yang lucu, dimainkan langsung dengan Web Audio (tanpa file lagu).
// Lagu ciptaan sendiri (bebas hak cipta) yang berkaitan dengan materi:
// - setiap frase terdiri atas motif 3 not (a), lalu 4 not (b), lalu 5 not (c), lalu "jawaban" panjang:
//   seperti 3² + 4² = 5², dua motif pendek "dijumlah" menjadi motif terpanjang
// - bunyi kotak musik & xilofon yang imut, bass "boing" yang memantul, tepuk kecil, dan lonceng di akhir frase
//
// Aturan agar tidak mengganggu belajar (extraneous load):
// - volume pelan dan bisa dimatikan kapan saja (tombol 🎵)
// - otomatis mengecil saat fitur "Bacakan" sedang berbicara
// - dijeda saat tes berlangsung dan saat tab/aplikasi tidak terlihat

const KUNCI = 'pythagoras-musik'
const TEMPO = 112 // ketukan per menit (riang)
const LANGKAH = 60 / TEMPO / 2 // durasi satu not seperdelapan (detik)
const VOLUME = 0.16
const VOLUME_REDAM = 0.04

// Melodi (nomor MIDI, null = diam); 8 birama × 8 not seperdelapan
const MELODI = [
  [76, null, 79, null, 84, null, null, null], // a: 3 not
  [81, null, 79, null, 76, null, 79, null], // b: 4 not
  [72, 74, 76, 79, 81, null, null, null], // c: 5 not
  [79, null, 76, null, 72, null, null, null], // jawaban: a² + b² = c²
  [77, null, 81, null, 84, null, null, null], // a: 3 not
  [86, null, 84, null, 81, null, 77, null], // b: 4 not
  [74, 76, 79, 83, 86, null, null, null], // c: 5 not
  [84, null, 79, 76, 72, null, null, null], // jawaban, kembali ke awal
].flat()

// Akar akor tiap birama (bass) dan nada akornya
const AKOR = [
  [48, [60, 64, 67]],
  [45, [57, 60, 64]],
  [41, [57, 60, 65]],
  [48, [60, 64, 67]],
  [41, [57, 60, 65]],
  [50, [62, 65, 69]],
  [43, [55, 59, 62]],
  [48, [60, 64, 67]],
]

const frek = (midi) => 440 * 2 ** ((midi - 69) / 12)

let ac = null
let utama = null
let derau = null
let pengatur = null
let langkah = 0
let waktuBerikut = 0
let main = false

export function musikNyala() {
  try {
    return localStorage.getItem(KUNCI) === 'nyala'
  } catch {
    return false
  }
}

export function simpanPilihanMusik(nyala) {
  try {
    localStorage.setItem(KUNCI, nyala ? 'nyala' : 'mati')
  } catch {
    // penyimpanan tidak tersedia: pilihan hanya berlaku selama halaman terbuka
  }
}

function siapkan() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  if (!ac) {
    ac = new AC()
    const saring = ac.createBiquadFilter()
    saring.type = 'lowpass'
    saring.frequency.value = 3200
    utama = ac.createGain()
    utama.gain.value = 0
    utama.connect(saring).connect(ac.destination)
    const panjang = Math.floor(ac.sampleRate * 0.05)
    derau = ac.createBuffer(1, panjang, ac.sampleRate)
    const d = derau.getChannelData(0)
    for (let i = 0; i < panjang; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / panjang) ** 3
  }
  return true
}

function nada(midi, mulai, lama, { tipe = 'triangle', keras = 0.5, serang = 0.01 } = {}) {
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = tipe
  o.frequency.value = frek(midi)
  g.gain.setValueAtTime(0, mulai)
  g.gain.linearRampToValueAtTime(keras, mulai + serang)
  g.gain.exponentialRampToValueAtTime(0.001, mulai + lama)
  o.connect(g).connect(utama)
  o.start(mulai)
  o.stop(mulai + lama + 0.05)
}

function shaker(mulai, keras) {
  const s = ac.createBufferSource()
  s.buffer = derau
  const f = ac.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = 6000
  const g = ac.createGain()
  g.gain.value = keras
  s.connect(f).connect(g).connect(utama)
  s.start(mulai)
}

// bass "boing": nada yang sedikit melengkung naik seperti benda empuk memantul
function boing(midi, mulai) {
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(frek(midi) * 0.85, mulai)
  o.frequency.exponentialRampToValueAtTime(frek(midi), mulai + 0.06)
  g.gain.setValueAtTime(0, mulai)
  g.gain.linearRampToValueAtTime(0.4, mulai + 0.015)
  g.gain.exponentialRampToValueAtTime(0.001, mulai + LANGKAH * 1.6)
  o.connect(g).connect(utama)
  o.start(mulai)
  o.stop(mulai + LANGKAH * 1.7)
}

function jadwalkan(i, t) {
  const birama = Math.floor(i / 8) % AKOR.length
  const posisi = i % 8
  const m = MELODI[i % MELODI.length]
  if (m != null) {
    nada(m, t, LANGKAH * 1.6, { keras: 0.28 }) // xilofon
    nada(m + 12, t, LANGKAH * 2.4, { tipe: 'sine', keras: 0.1, serang: 0.005 }) // kotak musik berdenting
  }
  const [bass, akor] = AKOR[birama]
  if (posisi === 0 || posisi === 3 || posisi === 6) boing(posisi === 3 ? bass + 7 : bass, t)
  if (posisi === 0) akor.forEach((n) => nada(n, t, LANGKAH * 7.5, { tipe: 'sine', keras: 0.04, serang: 0.25 }))
  // tepuk kecil di ketukan 2 & 4, kocokan pelan di sela-selanya
  shaker(t, posisi === 2 || posisi === 6 ? 0.09 : posisi % 2 ? 0.03 : 0.015)
  // lonceng "ting-ting" di akhir setiap frase jawaban
  if ((birama === 3 || birama === 7) && posisi === 5) {
    nada(96, t, LANGKAH * 3, { tipe: 'sine', keras: 0.07, serang: 0.003 })
    nada(100, t + LANGKAH * 0.5, LANGKAH * 3, { tipe: 'sine', keras: 0.06, serang: 0.003 })
  }
}

function putaran() {
  // redam saat "Bacakan" berbicara
  const bicara = 'speechSynthesis' in window && window.speechSynthesis.speaking
  const target = bicara ? VOLUME_REDAM : VOLUME
  if (Math.abs(utama.gain.value - target) > 0.001) utama.gain.setTargetAtTime(target, ac.currentTime, 0.2)
  while (waktuBerikut < ac.currentTime + 0.15) {
    jadwalkan(langkah, waktuBerikut)
    langkah += 1
    waktuBerikut += LANGKAH
  }
}

// Mulai/lanjutkan musik (harus dipanggil setelah ada sentuhan/klik pengguna)
export function mulaiMusik() {
  if (!siapkan()) return
  if (main) {
    // sudah berjalan tetapi suara masih diblokir browser (belum ada klik): coba aktifkan lagi
    if (ac.state === 'suspended') ac.resume()
    return
  }
  main = true
  ac.resume()
  waktuBerikut = ac.currentTime + 0.1
  utama.gain.cancelScheduledValues(ac.currentTime)
  utama.gain.setValueAtTime(0, ac.currentTime)
  utama.gain.linearRampToValueAtTime(VOLUME, ac.currentTime + 1.2)
  pengatur = setInterval(putaran, 50)
  putaran()
}

export function hentikanMusik() {
  if (!main) return
  main = false
  clearInterval(pengatur)
  const t = ac.currentTime
  utama.gain.cancelScheduledValues(t)
  utama.gain.setValueAtTime(utama.gain.value, t)
  utama.gain.linearRampToValueAtTime(0, t + 0.4)
  setTimeout(() => {
    if (!main) ac.suspend()
  }, 500)
}
