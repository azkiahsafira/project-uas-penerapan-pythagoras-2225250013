import { useEffect, useState } from 'react'

// Tombol "Install aplikasi" (PWA) dan pemberitahuan saat offline.
//
// - Android/Windows (Chrome, Edge): browser memberi event `beforeinstallprompt`;
//   tombol muncul dan membuka dialog install bawaan browser.
// - iPhone/iPad (Safari): tidak ada install otomatis, jadi ditampilkan petunjuk
//   "Bagikan → Tambah ke Layar Utama".
// - Bila aplikasi sudah dibuka sebagai aplikasi terpasang, tombol disembunyikan.

const sudahTerpasang = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

const perangkatApple = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export function TombolInstall() {
  const [ajakan, setAjakan] = useState(null) // event beforeinstallprompt
  const [terpasang, setTerpasang] = useState(sudahTerpasang)
  const [petunjukApple, setPetunjukApple] = useState(false)

  useEffect(() => {
    const simpan = (e) => {
      e.preventDefault() // tahan dialog bawaan, tampilkan lewat tombol kita
      setAjakan(e)
    }
    const selesai = () => {
      setTerpasang(true)
      setAjakan(null)
    }
    window.addEventListener('beforeinstallprompt', simpan)
    window.addEventListener('appinstalled', selesai)
    return () => {
      window.removeEventListener('beforeinstallprompt', simpan)
      window.removeEventListener('appinstalled', selesai)
    }
  }, [])

  if (terpasang) return null

  if (ajakan) {
    return (
      <button
        type="button"
        className="tombol-install"
        onClick={async () => {
          ajakan.prompt()
          const pilihan = await ajakan.userChoice
          if (pilihan.outcome === 'accepted') setTerpasang(true)
          setAjakan(null)
        }}
      >
        📲 Install aplikasi
      </button>
    )
  }

  if (perangkatApple()) {
    return (
      <div className="install-apple">
        <button type="button" className="tombol-install" onClick={() => setPetunjukApple(!petunjukApple)} aria-expanded={petunjukApple}>
          📲 Pasang di iPhone/iPad
        </button>
        {petunjukApple && (
          <p className="petunjuk-install">
            Ketuk tombol <strong>Bagikan</strong> (kotak dengan panah ke atas) di Safari, lalu pilih <strong>Tambah ke Layar Utama</strong>.
          </p>
        )}
      </div>
    )
  }

  return null
}

export function PemberitahuanOffline() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const nyala = () => setOnline(true)
    const mati = () => setOnline(false)
    window.addEventListener('online', nyala)
    window.addEventListener('offline', mati)
    return () => {
      window.removeEventListener('online', nyala)
      window.removeEventListener('offline', mati)
    }
  }, [])

  if (online) return null
  return (
    <p className="offline" role="status">
      📴 Sedang offline. Aplikasi tetap bisa dipakai; hasil tes disimpan di perangkat dan dikirim otomatis saat internet kembali.
    </p>
  )
}

// Pemberitahuan versi baru. Aplikasi yang di-install di HP sering hanya "disembunyikan", bukan ditutup,
// sehingga tetap memakai versi lama. Saat aplikasi dibuka lagi (dan tiap 15 menit), index.html terbaru
// dicek; bila nama berkas JavaScript-nya berbeda, muncul tombol "Perbarui sekarang".
// Tidak muncul saat tes agar jawaban yang sedang dikerjakan tidak hilang.
const skripSekarang = () => document.querySelector('script[type="module"][src*="assets/index-"]')?.getAttribute('src')?.split('/').pop()

export function PemberitahuanVersiBaru({ sembunyikan = false }) {
  const [ada, setAda] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD) return
    const cek = async () => {
      try {
        const res = await fetch(`./index.html?cek-versi=${Date.now()}`, { cache: 'no-store' })
        const teks = await res.text()
        const terbaru = teks.match(/assets\/(index-[^"']+\.js)/)?.[1]
        const sekarang = skripSekarang()
        if (terbaru && sekarang && terbaru !== sekarang) setAda(true)
      } catch {
        // offline: coba lagi nanti
      }
    }
    const saatTerlihat = () => document.visibilityState === 'visible' && cek()
    cek()
    const jeda = setInterval(cek, 15 * 60 * 1000)
    document.addEventListener('visibilitychange', saatTerlihat)
    return () => {
      clearInterval(jeda)
      document.removeEventListener('visibilitychange', saatTerlihat)
    }
  }, [])

  if (!ada || sembunyikan) return null
  return (
    <div className="versi-baru" role="status">
      <span>✨ Versi baru aplikasi sudah tersedia.</span>
      <button type="button" className="hitung kecil" onClick={() => window.location.reload()}>
        Perbarui sekarang
      </button>
    </div>
  )
}
