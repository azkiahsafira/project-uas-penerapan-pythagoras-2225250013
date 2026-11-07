// Penyimpanan data penelitian:
// - hasil     : pre-test, post-test, kuesioner Leppink  -> tabel `hasil`
// - aktivitas : proses belajar di menu Belajar          -> tabel `aktivitas`
//
// Semua data SELALU disimpan dulu di perangkat (localStorage), lalu dikirim
// ke Supabase. Jika internet putus, data tetap aman di perangkat dengan tanda
// terkirim = false, dan dikirim ulang otomatis (kirimTertunda) nanti.

import { supabase } from './supabase.js'

const KUNCI_HASIL = 'pythagoras-hasil'
const KUNCI_IDENTITAS = 'pythagoras-identitas'
const KUNCI_AKTIVITAS = 'pythagoras-aktivitas'

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

export const buatId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const daftarAktivitas = () => baca(KUNCI_AKTIVITAS, [])

// Catat satu aktivitas belajar (lihat kolom tabel `aktivitas` di supabase/schema.sql)
export function catatAktivitas(aktivitas) {
  return tulis(KUNCI_AKTIVITAS, [...daftarAktivitas(), { id: buatId(), ...aktivitas, terkirim: false }])
}

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

// Ubah format aktivitas menjadi kolom tabel `aktivitas`
const keBarisAktivitas = (a) => ({
  id: a.id,
  jenis: a.jenis,
  nama: a.nama,
  kelas: a.kelas,
  sekolah: a.sekolah,
  kelompok: a.kelompok,
  sesi: a.sesi,
  langkah: a.langkah ?? null,
  judul: a.judul,
  mulai: a.mulai,
  selesai: a.selesai,
  durasi_detik: a.durasiDetik,
  salah: a.salah ?? 0,
  hasil: a.hasil ?? null,
})

const ANTREAN = [
  { kunci: KUNCI_HASIL, tabel: 'hasil', keBaris },
  { kunci: KUNCI_AKTIVITAS, tabel: 'aktivitas', keBaris: keBarisAktivitas },
]

let sedangMengirim = null

// Kirim semua data yang belum terkirim (hasil tes & aktivitas belajar).
// Mengembalikan jumlah baris yang berhasil dikirim.
export function kirimTertunda() {
  if (!supabase) return Promise.resolve(0)
  if (sedangMengirim) return sedangMengirim
  sedangMengirim = (async () => {
    let berhasil = 0
    for (const { kunci, tabel, keBaris: ubah } of ANTREAN) {
      for (const data of baca(kunci, []).filter((x) => !x.terkirim)) {
        const { error } = await supabase.from(tabel).insert(ubah(data))
        // 23505 = id sudah ada di database (pernah terkirim), anggap berhasil
        if (!error || error.code === '23505') {
          tulis(
            kunci,
            baca(kunci, []).map((x) => (x.id === data.id ? { ...x, terkirim: true } : x)),
          )
          berhasil += 1
        } else {
          console.warn(`Gagal mengirim ke tabel ${tabel}:`, error.message)
          return berhasil // kemungkinan sedang offline; coba lagi nanti
        }
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
