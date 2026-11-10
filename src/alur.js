// Urutan pertemuan penelitian (README "Alur Penelitian"):
//   Pertemuan 1   : pre-test, lalu cek prasyarat & Sesi 1
//   Pertemuan 1–3 : Sesi 1–3 (menu Belajar)
//   Pertemuan 4   : Latihan Soal (minimal TARGET_LATIHAN soal)
//   Pertemuan 5   : post-test, lalu kuesioner beban kognitif
// Kunci ini menjaga validitas data: pre-test harus mengukur kemampuan SEBELUM belajar, post-test SESUDAH
// semua kegiatan, dan tiap tes hanya dikerjakan satu kali. Kode kelompok "Uji coba peneliti" (mis. untuk
// demo ke dosen) tidak dikunci, dan datanya dikeluarkan dari analisis.
import { daftarAktivitas, daftarHasil, identitasTerakhir } from './penyimpanan.js'

export const KELOMPOK_UJI = 'Uji coba peneliti'
export const TARGET_LATIHAN = 10
const KUNCI_PROGRES = 'pythagoras-sesi-selesai'

function sesiSelesai() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_PROGRES)) ?? []
  } catch {
    return []
  }
}

const milik = (x, kode) => kode && (x.kode === kode || x.nama === kode)

// Status alur siswa yang sedang masuk di perangkat ini (dibaca ulang setiap kali dipakai)
export function statusAlur() {
  const id = identitasTerakhir()
  const kode = id?.kode
  const hasil = daftarHasil().filter((h) => milik(h, kode))
  const ada = (jenis) => hasil.some((h) => h.jenis === jenis)
  return {
    kode,
    bebas: id?.kelompok === KELOMPOK_UJI,
    pretest: ada('pretest'),
    posttest: ada('posttest'),
    leppink: ada('leppink'),
    sesi: sesiSelesai(),
    latihan: daftarAktivitas().filter((a) => a.jenis === 'latihan' && milik(a, kode)).length,
  }
}

const PESAN_PRETEST = 'Kerjakan pre-test dulu di menu Tes (pertemuan 1), lalu kembali ke sini.'

// Pesan bila Belajar (cek prasyarat & Sesi 1–3) masih terkunci, atau null bila boleh dibuka
export function kunciBelajar(st = statusAlur()) {
  if (st.bebas) return null
  return st.pretest ? null : PESAN_PRETEST
}

export function kunciLatihan(st = statusAlur()) {
  if (st.bebas) return null
  if (!st.pretest) return PESAN_PRETEST
  if (!st.sesi.includes(3)) return 'Latihan Soal dibuka di pertemuan 4, setelah Sesi 1–3 di menu Belajar selesai.'
  return null
}

// { terkunci: pesan | null, sudah: boolean } untuk tiap instrumen di menu Tes
export function kunciTes(jenis, st = statusAlur()) {
  const sudah = st[jenis] === true
  if (st.bebas) return { terkunci: null, sudah: false }
  if (sudah) return { terkunci: null, sudah }
  if (jenis === 'posttest') {
    if (!st.pretest) return { terkunci: 'Kerjakan pre-test dulu.', sudah }
    if (!st.sesi.includes(3)) return { terkunci: 'Dibuka di pertemuan 5, setelah Sesi 1–3 selesai.', sudah }
    if (st.latihan < TARGET_LATIHAN)
      return { terkunci: `Dibuka setelah Latihan Soal minimal ${TARGET_LATIHAN} soal (baru ${st.latihan}).`, sudah }
  }
  if (jenis === 'leppink' && !st.posttest) return { terkunci: 'Dibuka setelah post-test dikumpulkan.', sudah }
  return { terkunci: null, sudah }
}
