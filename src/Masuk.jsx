import { useState } from 'react'
import { masukKode } from './api.js'
import Maskot from './Maskot.jsx'
import { identitasDariSiswa, simpanIdentitas } from './penyimpanan.js'

// Masuk dengan KODE SISWA (kelas + nomor absen, mis. 8A-07), tanpa nama asli (privasi.md).
// Dipakai di menu Belajar, Latihan, dan Tes.
export default function FormKode({ judul = 'Masuk dengan kode siswa', atas = null, ket, tombol = 'Masuk', onMasuk, onBatal }) {
  const [kode, setKode] = useState('')
  const [galat, setGalat] = useState('')
  const [memuat, setMemuat] = useState(false)

  const kirim = async (e) => {
    e.preventDefault()
    setGalat('')
    setMemuat(true)
    try {
      const identitas = identitasDariSiswa(await masukKode(kode))
      simpanIdentitas(identitas)
      onMasuk(identitas)
    } catch (err) {
      setGalat(err.message)
    } finally {
      setMemuat(false)
    }
  }

  return (
    <section className="kartu sempit kenalan">
      {atas}
      <Maskot ukuran={70} topi />
      <h2>{judul}</h2>
      <p className="ket">{ket ?? 'Kode siswa diberikan oleh gurumu: kelas, huruf kelas, tanda -, lalu nomor absen.'}</p>
      <form onSubmit={kirim}>
        <label>
          Kode siswa
          <input
            className="isian-kode"
            value={kode}
            onChange={(e) => setKode(e.target.value.toUpperCase())}
            placeholder="8A-07"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={8}
            aria-describedby="galat-kode"
          />
        </label>
        {galat && (
          <p className="umpan salah" id="galat-kode" role="alert">
            {galat}
          </p>
        )}
        <div className="navigasi">
          {onBatal ? (
            <button type="button" onClick={onBatal}>
              Batal
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="hitung" disabled={kode.trim().length < 3 || memuat}>
            {memuat ? 'Memeriksa…' : tombol}
          </button>
        </div>
      </form>
    </section>
  )
}
