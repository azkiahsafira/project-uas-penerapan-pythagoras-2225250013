// Logika perayaan jawaban benar: pemicu, pilihan suara, dan suara tepuk tangan.
// Tampilannya ada di Tepuk.jsx.

const KUNCI_SUARA = 'pythagoras-suara-tepuk'
export const PERISTIWA = 'pythagoras-rayakan'

export function rayakan({ beruntun = 0 } = {}) {
  window.dispatchEvent(new CustomEvent(PERISTIWA, { detail: { beruntun } }))
}

// Pesan semangat saat jawaban salah (kecil, tanpa suara, tidak menutupi soal).
// jenis: 'petunjuk' (salah pertama, ada petunjuk) | 'dibuka' (jawaban ditampilkan) | 'pembahasan' (Latihan)
export const PERISTIWA_SEMANGAT = 'pythagoras-semangati'

export function semangati({ jenis = 'petunjuk' } = {}) {
  window.dispatchEvent(new CustomEvent(PERISTIWA_SEMANGAT, { detail: { jenis } }))
}

export function suaraTepukNyala() {
  try {
    return localStorage.getItem(KUNCI_SUARA) !== 'mati'
  } catch {
    return true
  }
}

export function aturSuaraTepuk(nyala) {
  try {
    localStorage.setItem(KUNCI_SUARA, nyala ? 'nyala' : 'mati')
  } catch {
    // penyimpanan tidak tersedia: pilihan hanya berlaku selama halaman terbuka
  }
}

// Suara dibuat langsung dengan Web Audio (tanpa file): nada "ta-da" lalu tepuk tangan riuh.
let konteks = null
export function bunyikan() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  konteks ??= new AC()
  const ac = konteks
  if (ac.state === 'suspended') ac.resume()
  const t0 = ac.currentTime + 0.02
  const utama = ac.createGain()
  utama.gain.value = 0.5
  utama.connect(ac.destination)

  // nada naik do-mi-sol-do
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.type = 'triangle'
    o.frequency.value = f
    const t = t0 + i * 0.09
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.35, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t + (i === 3 ? 0.6 : 0.25))
    o.connect(g).connect(utama)
    o.start(t)
    o.stop(t + 0.7)
  })

  // tepuk tangan: banyak letupan derau pendek yang disaring
  const panjang = Math.floor(ac.sampleRate * 0.03)
  const derau = ac.createBuffer(1, panjang, ac.sampleRate)
  const d = derau.getChannelData(0)
  for (let i = 0; i < panjang; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / panjang) ** 2
  for (let i = 0; i < 38; i++) {
    const t = t0 + 0.3 + Math.random() * 1.2
    const src = ac.createBufferSource()
    src.buffer = derau
    const filter = ac.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 900 + Math.random() * 1600
    filter.Q.value = 0.9
    const g = ac.createGain()
    g.gain.value = 0.25 + Math.random() * 0.35
    src.connect(filter).connect(g).connect(utama)
    src.start(t)
  }
}
