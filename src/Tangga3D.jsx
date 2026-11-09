import { useEffect, useRef, useState } from 'react'

// Ilustrasi 3D (three.js): tangga bersandar di dinding, bisa diputar dengan jari/tetikus.
// Tombol "Lihat segitiganya" menampilkan segitiga siku-siku di atas benda nyata:
// biru = sisi diketahui, merah muda = sisi yang dicari (design.md §6).
// three.js baru diunduh saat komponen ini tampil (hemat kuota siswa) dan
// hanya menggambar ulang saat diputar (hemat baterai). Bila WebGL tidak ada, tampil `cadangan` (gambar 2D).
const BIRU = 0x2563eb
const PINK = 0xdb2777

export default function Tangga3D({ kaki = 3, tinggi = 4, panjang = 5, cari = 'tinggi', satuan = 'm', cadangan = null }) {
  const wadah = useRef(null)
  const kanvas = useRef(null)
  const kendali = useRef({})
  const [status, setStatus] = useState('memuat') // memuat | siap | gagal
  const [segitiga, setSegitiga] = useState(true)
  const [label, setLabel] = useState([])

  useEffect(() => {
    let batal = false
    let bersihkan = () => {}
    Promise.all([import('three'), import('three/examples/jsm/controls/OrbitControls.js')])
      .then(([THREE, { OrbitControls }]) => {
        if (batal || !kanvas.current) return
        let renderer
        try {
          renderer = new THREE.WebGLRenderer({ canvas: kanvas.current, antialias: true, alpha: true })
        } catch {
          setStatus('gagal')
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        const adegan = new THREE.Scene()
        const kamera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
        const pusat = new THREE.Vector3(kaki / 2 + 0.3, tinggi / 2, 0)
        // dilihat agak dari depan agar segitiga & labelnya tidak saling menutupi
        const posisiAwal = new THREE.Vector3(kaki / 2 + 2.4, tinggi * 0.65, 9.8)
        kamera.position.copy(posisiAwal)

        adegan.add(new THREE.HemisphereLight(0xffffff, 0xbbf7d0, 1.6))
        const matahari = new THREE.DirectionalLight(0xffffff, 1.4)
        matahari.position.set(5, 8, 6)
        adegan.add(matahari)

        const bahan = (warna) => new THREE.MeshStandardMaterial({ color: warna, roughness: 0.85 })
        // lantai & dinding (sudut siku-siku ada di kaki dinding, titik 0,0,0)
        const lantai = new THREE.Mesh(new THREE.BoxGeometry(kaki + 4, 0.1, 4), bahan(0xbbf7d0))
        lantai.position.set(kaki / 2 + 0.5, -0.05, 0)
        const dinding = new THREE.Mesh(new THREE.BoxGeometry(0.3, tinggi + 1.2, 4), bahan(0xfde7c3))
        dinding.position.set(-0.15, (tinggi + 1.2) / 2, 0)
        adegan.add(lantai, dinding)

        // tangga: dua tiang + anak tangga, dari lantai (x = kaki) ke dinding (y = tinggi)
        const tangga = new THREE.Group()
        const kayu = bahan(0xb45309)
        const sudut = Math.atan2(tinggi, kaki)
        for (const z of [-0.28, 0.28]) {
          const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, panjang, 10), kayu)
          tiang.position.set(kaki / 2, tinggi / 2, z)
          tiang.rotation.z = Math.PI / 2 - sudut
          tangga.add(tiang)
        }
        const jumlahAnak = Math.floor(panjang / 0.4)
        for (let i = 1; i < jumlahAnak; i++) {
          const t = i / jumlahAnak
          const anak = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.56, 8), kayu)
          anak.rotation.x = Math.PI / 2
          anak.position.set(kaki * (1 - t), tinggi * t, 0)
          tangga.add(anak)
        }
        adegan.add(tangga)

        // segitiga siku-siku di atas benda nyata
        const warna = (nama) => (nama === cari ? PINK : BIRU)
        // sisi segitiga berupa tabung tipis (garis WebGL selalu 1 piksel, terlalu tipis di HP)
        const garis = (a, b, w, r = 0.05) => {
          const A = new THREE.Vector3(...a)
          const B = new THREE.Vector3(...b)
          const arah = B.clone().sub(A)
          const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, arah.length(), 10), new THREE.MeshBasicMaterial({ color: w }))
          m.position.copy(A).addScaledVector(arah, 0.5)
          m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.clone().normalize())
          return m
        }
        const kelompokSegitiga = new THREE.Group()
        const dz = 0.45 // sedikit di depan tangga agar terlihat
        kelompokSegitiga.add(
          garis([0, 0.02, dz], [kaki, 0.02, dz], warna('kaki')),
          garis([0.02, 0, dz], [0.02, tinggi, dz], warna('tinggi')),
          garis([kaki, 0.02, dz], [0.02, tinggi, dz], warna('panjang')),
          garis([0.3, 0.02, dz], [0.3, 0.3, dz], 0x1e2a4d, 0.025),
          garis([0.3, 0.3, dz], [0.02, 0.3, dz], 0x1e2a4d, 0.025),
        )
        adegan.add(kelompokSegitiga)

        const titikLabel = [
          // rata: 'tengah' | 'kanan' (label di kiri titik) | 'kiri' (label di kanan titik)
          {
            id: 'kaki',
            rata: 'tengah',
            p: new THREE.Vector3(kaki / 2, -0.3, dz),
            teks: `kaki tangga = ${cari === 'kaki' ? '?' : kaki + ' ' + satuan}`,
          },
          {
            id: 'tinggi',
            rata: 'kanan',
            p: new THREE.Vector3(-0.35, tinggi / 2, dz),
            teks: `tinggi = ${cari === 'tinggi' ? '?' : tinggi + ' ' + satuan}`,
          },
          {
            id: 'panjang',
            rata: 'kiri',
            p: new THREE.Vector3(kaki / 2 + 0.35, tinggi / 2 + 0.15, dz),
            teks: `tangga = ${cari === 'panjang' ? '?' : panjang + ' ' + satuan}`,
          },
        ]

        const kontrol = new OrbitControls(kamera, renderer.domElement)
        kontrol.target.copy(pusat)
        kontrol.enablePan = false
        kontrol.minDistance = 5
        kontrol.maxDistance = 16
        kontrol.maxPolarAngle = Math.PI / 2 - 0.05 // tidak menembus lantai
        kontrol.update() // arahkan kamera ke tengah adegan sejak awal

        let terlihat = true
        const gambar = () => {
          if (!terlihat) return
          renderer.render(adegan, kamera)
          // label HTML mengikuti posisi sisi di layar (teks selalu tegak & mudah dibaca)
          const { clientWidth: w, clientHeight: h } = renderer.domElement
          setLabel(
            titikLabel.map(({ id, rata, p, teks }) => {
              const v = p.clone().project(kamera)
              return { id, rata, teks, x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h }
            }),
          )
        }
        const ukur = () => {
          const w = wadah.current?.clientWidth || 300
          const h = Math.round(Math.min(w * 0.8, 360))
          renderer.setSize(w, h, false)
          renderer.domElement.style.width = `${w}px`
          renderer.domElement.style.height = `${h}px`
          kamera.aspect = w / h
          kamera.updateProjectionMatrix()
          gambar()
        }
        kontrol.addEventListener('change', gambar)
        const pengamatUkuran = new ResizeObserver(ukur)
        pengamatUkuran.observe(wadah.current)
        const pengamatTampil = new IntersectionObserver(([e]) => {
          terlihat = e.isIntersecting
          if (terlihat) gambar()
        })
        pengamatTampil.observe(wadah.current)

        kendali.current = {
          tampilkanSegitiga: (ya) => {
            kelompokSegitiga.visible = ya
            gambar()
          },
          aturUlang: () => {
            kamera.position.copy(posisiAwal)
            kontrol.target.copy(pusat)
            kontrol.update()
            gambar()
          },
        }
        ukur()
        setStatus('siap')

        bersihkan = () => {
          pengamatUkuran.disconnect()
          pengamatTampil.disconnect()
          kontrol.dispose()
          adegan.traverse((o) => {
            o.geometry?.dispose()
            o.material?.dispose()
          })
          renderer.dispose()
        }
      })
      .catch(() => !batal && setStatus('gagal'))
    return () => {
      batal = true
      bersihkan()
    }
  }, [kaki, tinggi, panjang, cari, satuan])

  if (status === 'gagal') return cadangan

  return (
    <div className="tangga3d" ref={wadah}>
      <div className="t3-panggung">
        <canvas ref={kanvas} aria-label="Ilustrasi 3D tangga bersandar di dinding" />
        {status === 'memuat' && <p className="t3-memuat">Memuat gambar 3D…</p>}
        {segitiga &&
          label.map((l) => (
            <span
              key={l.id}
              className={`t3-label rata-${l.rata} ${l.id === cari ? 'dicari' : ''}`}
              style={{ left: l.x, top: l.y }}
            >
              {l.teks}
            </span>
          ))}
      </div>
      <div className="t3-tombol">
        <button
          type="button"
          className="kecil"
          aria-pressed={segitiga}
          onClick={() => {
            setSegitiga(!segitiga)
            kendali.current.tampilkanSegitiga?.(!segitiga)
          }}
        >
          {segitiga ? '🔺 Sembunyikan segitiga' : '🔺 Lihat segitiganya'}
        </button>
        <button type="button" className="kecil" onClick={() => kendali.current.aturUlang?.()}>
          ↺ Atur ulang
        </button>
      </div>
      <p className="ket t3-petunjuk">Geser dengan jari untuk memutar, cubit untuk memperbesar.</p>
    </div>
  )
}
