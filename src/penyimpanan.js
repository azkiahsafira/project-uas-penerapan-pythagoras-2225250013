// Penyimpanan hasil penelitian (pre-test, post-test, kuesioner Leppink).
//
// Untuk sementara hasil disimpan di perangkat (localStorage) dan bisa diunduh
// sebagai CSV. Nanti fungsi simpanHasil() juga akan mengirim data ke Supabase.

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
  const semua = [...daftarHasil(), hasil]
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

const KOLOM = ['waktu_selesai', 'jenis', 'nama', 'kelas', 'sekolah', 'kelompok', 'durasi_detik', 'benar', 'total', 'skor', 'IL', 'EL', 'GL', 'jawaban']

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
