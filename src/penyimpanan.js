// Penyimpanan hasil penelitian (pre-test, post-test, kuesioner Leppink).
//
// Setiap hasil SELALU disimpan dulu di perangkat (localStorage), lalu dikirim
// ke tabel `hasil` di Supabase. Jika internet putus, hasil tetap aman di
// perangkat dengan tanda terkirim = false, dan dikirim ulang otomatis
// (kirimTertunda) saat aplikasi dibuka lagi atau tes berikutnya selesai.

import { supabase } from './supabase.js'

const KUNCI_HASIL = 'pythagoras-hasil'
const KUNCI_IDENTITAS = 'pythagoras-identitas'

function baca(kunci, bawaan) {
  try {
    return JSON.parse(localStorage.getItem(kunci)) ?? bawaan
  } catch {
    return bawaan
  }
}

function tulis(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai))
    return true
  } catch {
    return false
  }
}

export const daftarHasil = () => baca(KUNCI_HASIL, [])

export function simpanHasil(hasil) {
  const semua = [...daftarHasil(), { ...hasil, terkirim: false }]
  return tulis(KUNCI_HASIL, semua)
}

export function hapusHasil(id) {
  tulis(
    KUNCI_HASIL,
    daftarHasil().filter((h) => h.id !== id),
  )
}

export const identitasTerakhir = () => baca(KUNCI_IDENTITAS, null)
export const simpanIdentitas = (identitas) => tulis(KUNCI_IDENTITAS, identitas)

// Ubah format aplikasi menjadi kolom tabel Supabase (lihat supabase/schema.sql)
const keBaris = (h) => ({
  id: h.id,
  jenis: h.jenis,
  nama: h.nama,
  kelas: h.kelas,
  sekolah: h.sekolah,
  kelompok: h.kelompok,
  mulai: h.mulai,
  selesai: h.selesai,
  durasi_detik: h.durasiDetik,
  benar: h.benar ?? null,
  total: h.total ?? null,
  skor: h.skor ?? null,
  il: h.beban?.IL ?? null,
  el: h.beban?.EL ?? null,
  gl: h.beban?.GL ?? null,
  jawaban: h.jawaban,
})

let sedangMengirim = null

// Kirim semua hasil yang belum terkirim. Mengembalikan jumlah yang berhasil dikirim.
export function kirimTertunda() {
  if (!supabase) return Promise.resolve(0)
  if (sedangMengirim) return sedangMengirim
  sedangMengirim = (async () => {
    let berhasil = 0
    for (const h of daftarHasil().filter((x) => !x.terkirim)) {
      const { error } = await supabase.from('hasil').insert(keBaris(h))
      // 23505 = id sudah ada di database (pernah terkirim), anggap berhasil
      if (!error || error.code === '23505') {
        tulis(
          KUNCI_HASIL,
          daftarHasil().map((x) => (x.id === h.id ? { ...x, terkirim: true } : x)),
        )
        berhasil += 1
      } else {
        console.warn('Gagal mengirim hasil ke Supabase:', error.message)
        break // kemungkinan sedang offline; coba lagi nanti
      }
    }
    return berhasil
  })().finally(() => {
    sedangMengirim = null
  })
  return sedangMengirim
}

const KOLOM = ['waktu_selesai', 'jenis', 'nama', 'kelas', 'sekolah', 'kelompok', 'durasi_detik', 'benar', 'total', 'skor', 'IL', 'EL', 'GL', 'terkirim', 'jawaban']

function selCsv(nilai) {
  const teks = nilai === undefined || nilai === null ? '' : String(nilai)
  return /[",\n;]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks
}

export function keCsv(hasil) {
  const baris = hasil.map((h) =>
    [
      h.selesai,
      h.jenis,
      h.nama,
      h.kelas,
      h.sekolah,
      h.kelompok,
      h.durasiDetik,
      h.benar,
      h.total,
      h.skor,
      h.beban?.IL,
      h.beban?.EL,
      h.beban?.GL,
      h.terkirim ? 'ya' : 'belum',
      JSON.stringify(h.jawaban),
    ]
      .map(selCsv)
      .join(','),
  )
  return [KOLOM.join(','), ...baris].join('\n')
}

export function unduhCsv(hasil) {
  // BOM agar Excel membaca huruf √ dan ² dengan benar
  const blob = new Blob(['﻿' + keCsv(hasil)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hasil-penelitian-pythagoras-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
