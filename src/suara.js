// Membacakan teks dengan suara bawaan perangkat (Web Speech API, gratis & bisa offline
// bila suara bahasa Indonesia sudah terpasang di perangkat).
//
// Dasar teori: prinsip modalitas dalam teori beban kognitif — penjelasan lisan
// yang menyertai gambar mengurangi beban mata (extraneous load) dibanding siswa
// harus membaca teks sambil melihat gambar.

export const suaraTersedia = () => typeof window !== 'undefined' && 'speechSynthesis' in window

// Pilih suara berbahasa Indonesia bila ada
export function suaraIndonesia() {
  if (!suaraTersedia()) return null
  const daftar = window.speechSynthesis.getVoices()
  return (
    daftar.find((v) => /^id(-|_|$)/i.test(v.lang) && /natural|online|google/i.test(v.name)) ||
    daftar.find((v) => /^id(-|_|$)/i.test(v.lang)) ||
    null
  )
}

// Ubah simbol matematika menjadi kata agar dibaca dengan benar
export function teksUntukDibaca(teks) {
  return String(teks)
    .replace(/√\(([^)]*)\)/g, ' akar dari $1 ')
    .replace(/√/g, ' akar ')
    .replace(/²/g, ' kuadrat ')
    .replace(/(\d+)\s*cm\b/g, '$1 sentimeter')
    .replace(/(\d+)\s*m\b/g, '$1 meter')
    .replace(/\s[−-]\s/g, ' dikurang ')
    .replace(/−/g, ' dikurang ')
    .replace(/\+/g, ' tambah ')
    .replace(/×/g, ' kali ')
    .replace(/=/g, ' sama dengan ')
    .replace(/\.\.\./g, ' titik titik ')
    .replace(/→/g, ', lalu ')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hentikan() {
  if (suaraTersedia()) window.speechSynthesis.cancel()
}

// Bacakan beberapa bagian berurutan. onBagian(i) dipanggil saat bagian ke-i mulai dibaca,
// onSelesai() saat semua selesai atau dihentikan.
export function bacakan(bagian, { onBagian, onSelesai } = {}) {
  if (!suaraTersedia()) return
  hentikan()
  const suara = suaraIndonesia()
  let berhenti = false
  bagian.forEach((teks, i) => {
    const u = new SpeechSynthesisUtterance(teksUntukDibaca(teks))
    u.lang = suara?.lang ?? 'id-ID'
    if (suara) u.voice = suara
    u.rate = 0.95
    u.pitch = 1.05
    u.onstart = () => onBagian?.(i)
    u.onend = () => {
      if (i === bagian.length - 1 && !berhenti) onSelesai?.()
    }
    u.onerror = () => {
      berhenti = true
      onSelesai?.()
    }
    window.speechSynthesis.speak(u)
  })
}
