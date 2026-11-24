// Urutan penelitian dalam 2 PERTEMUAN (revisi dosen; README "Alur Penelitian"):
//   Pertemuan 1 : pre-test → cek prasyarat → Sesi 1 & Sesi 2 → Kuesioner Pertemuan 1 (beban1)
//   Pertemuan 2 : Sesi 3 → Latihan Soal (minimal TARGET_LATIHAN soal) → Kuesioner Pertemuan 2 (beban2) → post-test
// Kuesioner Harian Cognitive Load diisi segera setelah kegiatan belajar tiap pertemuan (Paas dkk., 2003).
// Kunci ini menjaga validitas data: pre-test harus mengukur kemampuan SEBELUM belajar, post-test SESUDAH
// semua kegiatan, dan tiap tes hanya dikerjakan satu kali. Kode kelompok "Uji coba peneliti" (mis. untuk
// demo ke dosen) tidak dikunci, dan datanya dikeluarkan dari analisis.
import { daftarAktivitas, daftarHasil, identitasTerakhir } from './penyimpanan.js'

export const KELOMPOK_UJI = 'Uji coba peneliti'
export const TARGET_LATIHAN = 5 // Latihan Soal muat dalam Pertemuan 2 bersama Sesi 3
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
    beban1: ada('beban1'),
    beban2: ada('beban2'),
    sesi: sesiSelesai(),
    latihan: daftarAktivitas().filter((a) => a.jenis === 'latihan' && milik(a, kode)).length,
  }
}

const PESAN_PRETEST = 'Kerjakan pre-test dulu di menu Tes, lalu kembali ke sini.'

// Pesan bila Belajar (cek prasyarat & Sesi 1–3) masih terkunci, atau null bila boleh dibuka
export function kunciBelajar(st = statusAlur()) {
  if (st.bebas) return null
  return st.pretest ? null : PESAN_PRETEST
}

export function kunciLatihan(st = statusAlur()) {
  if (st.bebas) return null
  if (!st.pretest) return PESAN_PRETEST
  if (!st.sesi.includes(3)) return 'Latihan Soal dibuka di Pertemuan 2, setelah Sesi 3 di menu Belajar selesai.'
  return null
}

// Pesan bila satu sesi Belajar masih terkunci: berurutan, dan Sesi 3 (Pertemuan 2) dibuka setelah Kuesioner Pertemuan 1
export function kunciSesi(id, st = statusAlur()) {
  if (id > 1 && !st.sesi.includes(id - 1)) return 'Selesaikan sesi sebelumnya dulu'
  if (st.bebas) return null
  if (id === 3 && !st.beban1) return 'Dibuka di Pertemuan 2, setelah Kuesioner Pertemuan 1 di menu Tes'
  return null
}

// { terkunci: pesan | null, sudah: boolean } untuk tiap instrumen di menu Tes
export function kunciTes(jenis, st = statusAlur()) {
  const sudah = st[jenis] === true
  if (st.bebas) return { terkunci: null, sudah: false }
  if (sudah) return { terkunci: null, sudah }
  if (jenis !== 'pretest' && !st.pretest) return { terkunci: 'Kerjakan pre-test dulu.', sudah }
  if (jenis === 'beban1' && !(st.sesi.includes(1) && st.sesi.includes(2)))
    return { terkunci: 'Dibuka setelah Sesi 1 dan Sesi 2 selesai (akhir Pertemuan 1).', sudah }
  if (jenis === 'beban2') {
    if (!st.beban1) return { terkunci: 'Isi Kuesioner Pertemuan 1 dulu.', sudah }
    if (!st.sesi.includes(3)) return { terkunci: 'Dibuka setelah Sesi 3 selesai.', sudah }
    if (st.latihan < TARGET_LATIHAN)
      return { terkunci: `Dibuka setelah Latihan Soal minimal ${TARGET_LATIHAN} soal (baru ${st.latihan}).`, sudah }
  }
  if (jenis === 'posttest' && !st.beban2) return { terkunci: 'Dibuka setelah Kuesioner Pertemuan 2 (akhir Pertemuan 2).', sudah }
  return { terkunci: null, sudah }
}
