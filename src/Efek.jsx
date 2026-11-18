import { useEffect, useRef } from 'react'

// Efek kursor & sentuhan yang imut di seluruh halaman (tidak dipasang saat tes):
// - kursor tetikus BERUPA KARTUN: Kuadra si penguin menunjuk panah oranye (ujungnya = penunjuk); di atas tombol menjadi sarung
//   tangan kartun yang menunjuk (lihat .kursor-imut di App.css)
// - setiap klik/sentuh: gelombang cincin dan letupan hati-bintang-bunga
// - kursor meninggalkan jejak kilau (tidak di dalam kotak materi/tes agar siswa tetap fokus membaca)
// Partikel dibuat langsung di DOM dan dihapus sendiri setelah animasinya selesai.

const BENTUK = ['♥', '✦', '★', '♥', '✿', '●']
const WARNA = ['#f472b6', '#7cc3ff', '#c4b5fd', '#fda4af', '#5fb4ff', '#f6c85f']

function bolehAnimasi() {
  if (document.documentElement.classList.contains('tanpa-animasi')) return false
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function buatPartikel(wadah, x, y, { dx, dy, ukuran, jenis, lama, teks }) {
  const el = document.createElement('span')
  el.className = `partikel ${jenis}`
  el.textContent = teks ?? BENTUK[Math.floor(Math.random() * BENTUK.length)]
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.color = WARNA[Math.floor(Math.random() * WARNA.length)]
  el.style.fontSize = `${ukuran}px`
  el.style.setProperty('--dx', `${dx}px`)
  el.style.setProperty('--dy', `${dy}px`)
  el.style.animationDuration = `${lama}ms`
  el.addEventListener('animationend', () => el.remove())
  wadah.appendChild(el)
}

function buatCincin(wadah, x, y) {
  const el = document.createElement('span')
  el.className = 'cincin-klik'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.addEventListener('animationend', () => el.remove())
  wadah.appendChild(el)
}

export default function EfekKlik({ aktif }) {
  const wadah = useRef(null)

  useEffect(() => {
    if (!aktif) return undefined
    let terakhir = 0
    document.documentElement.classList.add('kursor-imut')

    const klik = (e) => {
      if (!wadah.current || !bolehAnimasi()) return
      buatCincin(wadah.current, e.clientX, e.clientY)
      const jumlah = 12
      for (let i = 0; i < jumlah; i++) {
        const sudut = (i / jumlah) * Math.PI * 2 + Math.random() * 0.4
        const jarak = 34 + Math.random() * 34
        buatPartikel(wadah.current, e.clientX, e.clientY, {
          dx: Math.cos(sudut) * jarak,
          dy: Math.sin(sudut) * jarak - 20,
          ukuran: 12 + Math.random() * 10,
          jenis: 'letup',
          lama: 750 + Math.random() * 350,
        })
      }
    }

    const gerak = (e) => {
      if (e.pointerType !== 'mouse' || !wadah.current || !bolehAnimasi()) return
      const sekarang = performance.now()
      if (sekarang - terakhir < 45) return // batasi jumlah partikel
      if (e.target.closest?.('.pemutar, .sempit, input, select, textarea, .tanya-siku')) return
      terakhir = sekarang
      buatPartikel(wadah.current, e.clientX, e.clientY, {
        dx: (Math.random() - 0.5) * 18,
        dy: 14 + Math.random() * 12,
        ukuran: 8 + Math.random() * 7,
        jenis: 'jejak',
        lama: 700,
      })
    }
    window.addEventListener('pointerdown', klik)
    window.addEventListener('pointermove', gerak)
    return () => {
      document.documentElement.classList.remove('kursor-imut')
      window.removeEventListener('pointerdown', klik)
      window.removeEventListener('pointermove', gerak)
    }
  }, [aktif])

  return <div className="efek-klik" ref={wadah} aria-hidden="true" />
}
