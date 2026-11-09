// Musik latar ceria yang dimainkan langsung dengan Web Audio (tanpa file lagu).
// Lagu ciptaan sendiri (bebas hak cipta): melodi bernada marimba, bass lembut,
// akor tipis, dan "shaker" pelan; 8 birama diulang terus.
//
// Aturan agar tidak mengganggu belajar (extraneous load):
// - volume pelan dan bisa dimatikan kapan saja (tombol 🎵)
// - otomatis mengecil saat fitur "Bacakan" sedang berbicara
// - dijeda saat tes berlangsung dan saat tab/aplikasi tidak terlihat

const KUNCI = 'pythagoras-musik'
const TEMPO = 96 // ketukan per menit
const LANGKAH = 60 / TEMPO / 2 // durasi satu not seperdelapan (detik)
const VOLUME = 0.16
const VOLUME_REDAM = 0.04

// Melodi (nomor MIDI, null = diam); 8 birama × 8 not seperdelapan
const MELODI = [
  [72, null, 76, null, 79, 76, 79, null], // C
  [81, null, 79, 76, null, 72, 74, null], // Am
  [76, null, 77, 76, 74, null, 72, null], // F
  [74, null, 79, null, 74, 72, 74, null], // G
  [72, 76, 79, 84, null, 81, 79, null], // C
  [76, null, 81, 79, 76, null, 72, null], // Am
  [69, 72, 77, 76, null, 74, 72, null], // F
  [74, null, 71, 74, 79, null, 72, null], // G -> C
].flat()

// Akar akor tiap birama (bass) dan nada akornya
const AKOR = [
  [48, [60, 64, 67]],
  [45, [57, 60, 64]],
  [41, [57, 60, 65]],
  [43, [55, 59, 62]],
  [48, [60, 64, 67]],
  [45, [57, 60, 64]],
  [41, [57, 60, 65]],
  [43, [55, 59, 62]],
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

function jadwalkan(i, t) {
  const birama = Math.floor(i / 8) % AKOR.length
  const posisi = i % 8
  const m = MELODI[i % MELODI.length]
  if (m != null) {
    nada(m, t, LANGKAH * 1.8, { keras: 0.32 }) // marimba
    nada(m + 12, t, LANGKAH * 0.9, { tipe: 'sine', keras: 0.08 }) // kilau oktaf
  }
  const [bass, akor] = AKOR[birama]
  if (posisi === 0 || posisi === 4) nada(bass, t, LANGKAH * 3.5, { tipe: 'sine', keras: 0.42, serang: 0.02 })
  if (posisi === 0) akor.forEach((n) => nada(n, t, LANGKAH * 7.5, { tipe: 'sine', keras: 0.05, serang: 0.25 }))
  shaker(t, posisi % 2 === 1 ? 0.05 : 0.02)
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
