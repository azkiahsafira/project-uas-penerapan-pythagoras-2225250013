// Penghubung ke backend Python (FastAPI) — lihat api.md.
// Bila VITE_API_URL kosong (backend belum dipasang), aplikasi tetap jalan dengan cara lama:
// kode siswa diperiksa formatnya saja dan data dikirim langsung ke Supabase.

export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const apiAktif = API !== ''

const KUNCI_TOKEN = 'pythagoras-token'
export const POLA_KODE = /^[0-9]{1,2}[A-Z]?-[0-9]{1,3}$/ // contoh: 8A-07

export const rapikanKode = (kode) =>
  String(kode || '')
    .replace(/\s+/g, '')
    .toUpperCase()

export function tokenSaya() {
  try {
    return localStorage.getItem(KUNCI_TOKEN)
  } catch {
    return null
  }
}

function simpanToken(token) {
  try {
    localStorage.setItem(KUNCI_TOKEN, token)
  } catch {
    // penyimpanan tidak tersedia: token hanya berlaku selama halaman terbuka
  }
}

async function minta(path, { method = 'GET', body, token } = {}) {
  const r = await fetch(`${API}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const isi = await r.json().catch(() => ({}))
  if (!r.ok) {
    const galat = new Error(isi.pesan || 'Server sedang bermasalah. Coba lagi nanti ya.')
    galat.status = r.status
    galat.galat = isi.galat
    throw galat
  }
  return isi
}

// Server gratis "tidur" bila lama tidak dipakai; sapa saat aplikasi dibuka agar cepat bangun
export function bangunkanServer() {
  if (apiAktif) fetch(`${API}/api/sehat`).catch(() => {})
}

// Masuk dengan kode siswa. Mengembalikan { kode, kelas, kelompok }.
export async function masukKode(kodeMentah) {
  const kode = rapikanKode(kodeMentah)
  if (!POLA_KODE.test(kode)) throw new Error('Format kode belum tepat. Contoh: 8A-07 (kelas, huruf kelas, tanda -, nomor absen).')
  if (!apiAktif) return { kode, kelas: '8', kelompok: 'Belajar dengan aplikasi' }
  try {
    const isi = await minta('/masuk', { method: 'POST', body: { kode } })
    simpanToken(isi.token)
    return isi.siswa
  } catch (e) {
    if (e.status) throw e
    throw new Error('Tidak bisa terhubung ke server. Pastikan ada internet, lalu coba lagi ya.')
  }
}

// Hasil tes dinilai di server; aplikasi hanya mengirim jawaban
export const kirimHasilApi = (h) =>
  minta('/hasil', {
    method: 'POST',
    token: tokenSaya(),
    body: { id: h.id, jenis: h.jenis, mulai: h.mulai, selesai: h.selesai, jawaban: h.jawaban },
  })

export const kirimAktivitasApi = (daftar) =>
  minta('/aktivitas', {
    method: 'POST',
    token: tokenSaya(),
    body: {
      aktivitas: daftar.map((a) => ({
        id: a.id,
        jenis: a.jenis,
        sesi: a.sesi,
        langkah: a.langkah ?? null,
        judul: a.judul,
        mulai: a.mulai,
        selesai: a.selesai,
        salah: a.salah ?? 0,
        hasil: a.hasil ?? null,
        dibacakan: a.dibacakan ?? 0,
        petunjuk: a.petunjuk ?? 0,
        catatan: a.catatan ?? null,
      })),
    },
  })
