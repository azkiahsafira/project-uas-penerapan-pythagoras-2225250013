// Latar belakang 3D "Langit Pythagoras" (three.js) untuk semua menu, di belakang kotak-kotak yang tembus pandang.
// Tema warna biru soft + pink soft. Semua objek adalah contoh dari materi teorema Pythagoras:
//   - Siku: segitiga siku-siku berwajah, dengan tanda kotak sudut siku-siku dan sisi miring berwarna biru
//   - Menara kotak 3² + 4² = 5²: 9 kubus biru, 16 kubus pink, dan 25 kubus putih di sisi segitiga (bukti luas)
//   - Layang-layang berwajah dengan benang pink (benang = sisi miring, Contoh 2 materi)
//   - Tangga bersandar di dinding (kaki 3, tinggi 4, tangga 5) dengan kelinci yang naik-turun (Contoh 1 materi)
//   - awan, hati, dan bintang kecil yang melayang
// Objek bisa diklik/diketuk: bereaksi dan mengucapkan kalimat lucu tentang materi.
// Hemat: three.js diunduh setelah halaman tampil, gambar maksimal ±30 fps, berhenti saat tab tidak dilihat,
// saat "Animasi: mati", dan saat prefers-reduced-motion. Disembunyikan saat tes (App.jsx). Bila WebGL tidak ada,
// yang tampil hanya gradasi langit.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const WARNA = {
  biru: 0x9fd3ff,
  biruTua: 0x5aa9f0,
  pink: 0xffb8d6,
  pinkTua: 0xf472b6,
  putih: 0xffffff,
  mata: 0x1e2a4d,
  pipi: 0xff8fbf,
  kayu: 0xffd9a8,
}

const SAPAAN = {
  siku: ['Halo! Aku Siku, segitiga siku-siku 🔺', 'Sisi terpanjangku sisi miring 💙', 'Kotak kecil di pojokku = sudut 90° ✨'],
  persegi: ['3² + 4² = 5² 🧊', '9 + 16 = 25, pas sekali! ✨', 'Luas dua kotak kecil = luas kotak besar 💖'],
  layang: ['Benangku sisi miring! 🪁', 'Tinggi² + jarak² = benang² 💨', 'Wuusss, terbang tinggi! ☁️'],
  tangga: ['Kaki 3, tinggi 4, tangga 5! 🪜', 'Aku naik sisi miring 🐰', 'Tangga bersandar = segitiga siku-siku 💙'],
}

export default function Latar3D() {
  const kanvas = useRef(null)
  const [ucap, setUcap] = useState(null) // { teks, x, y, n }

  useEffect(() => {
    if (!ucap) return undefined
    const t = setTimeout(() => setUcap(null), 2600)
    return () => clearTimeout(t)
  }, [ucap])

  useEffect(() => {
    let batal = false
    let bersihkan = () => {}
    // three.js diunduh setelah halaman utama tampil agar pembukaan aplikasi tetap cepat
    const tunda = setTimeout(() => {
      import('three').then((THREE) => {
        if (batal || !kanvas.current) return
        bersihkan = bangunAdegan(THREE, kanvas.current, setUcap)
      })
    }, 700)
    return () => {
      batal = true
      clearTimeout(tunda)
      bersihkan()
    }
  }, [])

  return (
    <>
      <div className="latar-adegan latar-3d" aria-hidden="true">
        <canvas ref={kanvas} className="latar-3d-kanvas" />
      </div>
      {ucap &&
        createPortal(
          <span className="laut-ucap" key={ucap.n} style={{ left: ucap.x, top: ucap.y }} role="status">
            {ucap.teks}
          </span>,
          document.body,
        )}
    </>
  )
}

function bangunAdegan(THREE, kanvas, setUcap) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, alpha: true })
  } catch {
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  const adegan = new THREE.Scene()
  const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  kamera.position.set(0, 0, 24)
  adegan.add(new THREE.HemisphereLight(0xeaf6ff, 0xffe4f0, 1.9))
  const matahari = new THREE.DirectionalLight(0xffffff, 1.4)
  matahari.position.set(4, 8, 10)
  adegan.add(matahari)

  // gaya kartun: bayangan bertingkat 3 (toon)
  const nada = new THREE.DataTexture(new Uint8Array([150, 210, 255]), 3, 1, THREE.RedFormat)
  nada.minFilter = nada.magFilter = THREE.NearestFilter
  nada.needsUpdate = true
  const bahan = {}
  const toon = (warna) => (bahan[warna] ??= new THREE.MeshToonMaterial({ color: warna, gradientMap: nada }))
  const datar = (warna) => (bahan[`d${warna}`] ??= new THREE.MeshBasicMaterial({ color: warna }))

  const objek = [] // { nama, grup, hitung, reaksi(t), perbarui(t, dt) }

  // wajah lucu: dua mata berkilau, pipi merona, senyum
  function wajah(lebar = 0.7, ukuran = 0.16) {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const mata = new THREE.Mesh(new THREE.SphereGeometry(ukuran, 16, 12), datar(WARNA.mata))
      mata.position.set((s * lebar) / 2, 0, 0)
      mata.scale.z = 0.5
      const kilau = new THREE.Mesh(new THREE.SphereGeometry(ukuran * 0.35, 8, 6), datar(WARNA.putih))
      kilau.position.set((s * lebar) / 2 + ukuran * 0.3, ukuran * 0.35, ukuran * 0.45)
      const pipi = new THREE.Mesh(new THREE.CircleGeometry(ukuran * 0.85, 16), datar(WARNA.pipi))
      pipi.position.set(s * (lebar / 2 + ukuran * 1.3), -ukuran * 1.4, 0)
      g.add(mata, kilau, pipi)
    }
    const senyum = new THREE.Mesh(new THREE.TorusGeometry(ukuran * 1.1, ukuran * 0.22, 8, 20, Math.PI), datar(WARNA.mata))
    senyum.rotation.z = Math.PI
    senyum.position.set(0, -ukuran * 1.2, 0)
    g.add(senyum)
    return g
  }

  // ---- 1. Siku: segitiga siku-siku berwajah ----
  {
    const bentuk = new THREE.Shape()
    bentuk.moveTo(0, 0)
    bentuk.lineTo(3, 0)
    bentuk.lineTo(0, 2.4)
    bentuk.closePath()
    const geo = new THREE.ExtrudeGeometry(bentuk, {
      depth: 0.8,
      bevelEnabled: true,
      bevelSize: 0.22,
      bevelThickness: 0.22,
      bevelSegments: 4,
    })
    geo.translate(-1, -0.8, -0.4) // titik berat di pusat
    const tubuh = new THREE.Mesh(geo, toon(WARNA.pink))
    const grup = new THREE.Group()
    grup.add(tubuh)
    const muka = wajah(0.62, 0.15)
    muka.position.set(-0.1, 0.05, 0.65)
    grup.add(muka)
    // tanda sudut siku-siku (kotak kecil putih) di pojok
    const kotak = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.06), datar(WARNA.putih))
    kotak.position.set(-1 + 0.28, -0.8 + 0.28, 0.64)
    grup.add(kotak)
    // sisi miring disorot biru
    const panjang = Math.hypot(3, 2.4)
    const miring = new THREE.Mesh(new THREE.BoxGeometry(panjang + 0.3, 0.2, 1.36), toon(WARNA.biruTua))
    miring.position.set(0.5 + 0.13, 0.4 + 0.17, 0)
    miring.rotation.z = Math.atan2(-2.4, 3)
    grup.add(miring)
    let lompat = -1
    objek.push({
      nama: 'siku',
      grup,
      skala: 1,
      reaksi: (t) => (lompat = t),
      perbarui: (t) => {
        const r = lompat >= 0 ? Math.min((t - lompat) / 0.9, 1) : 1
        grup.position.y = grup.userData.y + Math.sin(t * 1.6) * 0.25 + Math.sin(r * Math.PI) * 1.4
        grup.rotation.y = Math.sin(t * 0.7) * 0.4 + r * Math.PI * 2 * (lompat >= 0 ? 1 : 0)
        if (r >= 1) lompat = -1
      },
    })
  }

  // ---- 2. Menara kotak 3² + 4² = 5² ----
  {
    const grup = new THREE.Group()
    const s = 0.34
    const kubus = new THREE.BoxGeometry(s * 0.86, s * 0.86, s * 0.86)
    const O = new THREE.Vector2(0, 0)
    const A = new THREE.Vector2(3 * s, 0)
    const B = new THREE.Vector2(0, 4 * s)
    const sisi = [
      { p: O, q: A, n: new THREE.Vector2(0, -1), jumlah: 3, warna: WARNA.biru },
      { p: B, q: O, n: new THREE.Vector2(-1, 0), jumlah: 4, warna: WARNA.pink },
      { p: A, q: B, n: new THREE.Vector2(4, 3).normalize(), jumlah: 5, warna: WARNA.putih },
    ]
    const semua = []
    for (const { p, q, n, jumlah, warna } of sisi) {
      const u = q.clone().sub(p).normalize()
      for (let i = 0; i < jumlah; i++)
        for (let j = 0; j < jumlah; j++) {
          const m = new THREE.Mesh(kubus, toon(jumlah === 5 && (i + j) % 2 ? WARNA.biru : warna))
          const pos = p
            .clone()
            .addScaledVector(u, (i + 0.5) * s)
            .addScaledVector(n, (j + 0.5) * s)
          m.position.set(pos.x, pos.y, 0)
          m.rotation.z = Math.atan2(u.y, u.x)
          m.userData.jarak = i + j
          grup.add(m)
          semua.push(m)
        }
    }
    const segitiga = new THREE.Shape([O, A, B])
    const tengah = new THREE.Mesh(new THREE.ShapeGeometry(segitiga), toon(WARNA.pinkTua))
    tengah.position.z = 0.02
    grup.add(tengah)
    const isi = new THREE.Group()
    isi.add(grup)
    grup.position.set(-0.6, -0.6, 0)
    let gelombang = -1
    objek.push({
      nama: 'persegi',
      grup: isi,
      skala: 1,
      reaksi: (t) => (gelombang = t),
      perbarui: (t) => {
        isi.rotation.y = Math.sin(t * 0.45) * 0.6
        isi.rotation.x = -0.25 + Math.sin(t * 0.6) * 0.08
        isi.position.y = isi.userData.y + Math.sin(t * 1.2 + 1) * 0.18
        for (const m of semua) {
          const fase = gelombang >= 0 ? t - gelombang - m.userData.jarak * 0.06 : -1
          m.scale.setScalar(fase > 0 && fase < 0.5 ? 1 + Math.sin((fase / 0.5) * Math.PI) * 0.45 : 1)
        }
        if (gelombang >= 0 && t - gelombang > 1.4) gelombang = -1
      },
    })
  }

  // ---- 3. Layang-layang berwajah dengan benang (sisi miring) ----
  {
    const grup = new THREE.Group()
    const atas = new THREE.Vector3(0, 1.4, 0)
    const kanan = new THREE.Vector3(1, 0.3, 0)
    const bawah = new THREE.Vector3(0, -1.7, 0)
    const kiri = new THREE.Vector3(-1, 0.3, 0)
    const pusat = new THREE.Vector3(0, 0.3, 0.15)
    const segi = (a, b, warna) => {
      const geo = new THREE.BufferGeometry().setFromPoints([a, b, pusat])
      geo.computeVertexNormals()
      const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color: warna, gradientMap: nada, side: THREE.DoubleSide }))
      grup.add(m)
    }
    segi(atas, kiri, WARNA.pink)
    segi(kanan, atas, WARNA.biru)
    segi(bawah, kanan, WARNA.pink)
    segi(kiri, bawah, WARNA.biru)
    const muka = wajah(0.42, 0.11)
    muka.position.set(0, 0.25, 0.3)
    grup.add(muka)
    // ekor berpita
    const pita = []
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.17), toon(i % 2 ? WARNA.biru : WARNA.pinkTua))
      p.scale.set(1.4, 0.7, 0.5)
      grup.add(p)
      pita.push(p)
    }
    // benang = sisi miring: dari layang-layang ke tangan di bawah (di luar layar)
    const benang = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), datar(WARNA.pinkTua))
    adegan.add(benang)
    const isi = new THREE.Group()
    isi.add(grup)
    let salto = -1
    const ujung = new THREE.Vector3()
    const tangan = new THREE.Vector3()
    objek.push({
      nama: 'layang',
      grup: isi,
      skala: 1,
      reaksi: (t) => (salto = t),
      perbarui: (t) => {
        const r = salto >= 0 ? Math.min((t - salto) / 1.1, 1) : 1
        isi.position.x = isi.userData.x + Math.sin(t * 0.8) * 0.5
        isi.position.y = isi.userData.y + Math.sin(t * 1.3) * 0.3
        grup.rotation.z = Math.sin(t * 1.1) * 0.15 + (salto >= 0 ? r * Math.PI * 2 : 0)
        grup.rotation.y = Math.sin(t * 0.9) * 0.3
        if (r >= 1) salto = -1
        pita.forEach((p, i) => p.position.set(Math.sin(t * 3 + i) * 0.25 * (i + 1) * 0.5, -2 - i * 0.45, 0))
        // benang menempel di bagian bawah layang-layang
        ujung.set(0, -1.6, 0)
        grup.localToWorld(ujung)
        // tangan pemegang benang di bawah, sedikit ke tepi kanan: benang turun di tepi layar, tidak memotong materi
        tangan.set(isi.userData.x + 1.2 * isi.userData.skala, isi.userData.y - 7.5 * isi.userData.skala, -1)
        const arah = ujung.clone().sub(tangan)
        benang.position.copy(tangan).addScaledVector(arah, 0.5)
        benang.scale.set(1, arah.length(), 1)
        benang.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.normalize())
      },
    })
  }

  // ---- 4. Tangga bersandar di dinding dengan kelinci ----
  {
    const grup = new THREE.Group()
    const lantai = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 1.6), toon(WARNA.pink))
    lantai.position.set(1.1, -0.11, 0)
    const dinding = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.9, 1.6), toon(WARNA.putih))
    dinding.position.set(-0.78, 1.95, 0)
    grup.add(lantai, dinding)
    // tangga: kaki 2,4 dari dinding, tinggi 3,2 -> panjang 4 (perbandingan 3 : 4 : 5)
    const kaki = new THREE.Vector3(1.85, 0, 0.35)
    const puncak = new THREE.Vector3(-0.55, 3.2, 0.35)
    const arah = puncak.clone().sub(kaki)
    const panjang = arah.length()
    const tangga = new THREE.Group()
    for (const z of [-0.32, 0.32]) {
      const rel = new THREE.Mesh(new THREE.BoxGeometry(0.12, panjang, 0.12), toon(WARNA.biruTua))
      rel.position.set(0, panjang / 2, z)
      tangga.add(rel)
    }
    for (let i = 1; i <= 5; i++) {
      const anak = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.64, 8), toon(WARNA.kayu))
      anak.rotation.x = Math.PI / 2
      anak.position.set(0, (panjang * i) / 6, 0)
      tangga.add(anak)
    }
    tangga.position.copy(kaki)
    tangga.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah.clone().normalize())
    grup.add(tangga)
    // kelinci kecil
    const kelinci = new THREE.Group()
    const badan = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), toon(WARNA.putih))
    const kepala = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), toon(WARNA.putih))
    kepala.position.set(0, 0.38, 0.05)
    kelinci.add(badan, kepala)
    for (const s of [-1, 1]) {
      const telinga = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.28, 4, 8), toon(WARNA.pink))
      telinga.position.set(s * 0.1, 0.72, 0)
      telinga.rotation.z = -s * 0.15
      kelinci.add(telinga)
    }
    const muka = wajah(0.18, 0.045)
    muka.position.set(0, 0.4, 0.27)
    kelinci.add(muka)
    grup.add(kelinci)
    let hop = -1
    const isi = new THREE.Group()
    isi.add(grup)
    grup.position.set(-0.6, -1.6, 0)
    objek.push({
      nama: 'tangga',
      grup: isi,
      skala: 1,
      reaksi: (t) => (hop = t),
      perbarui: (t) => {
        const p = 0.15 + (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.65 // naik-turun di sepanjang tangga
        const r = hop >= 0 ? Math.min((t - hop) / 0.7, 1) : 1
        kelinci.position.copy(kaki).addScaledVector(arah, p)
        kelinci.position.x += 0.25
        kelinci.position.y += 0.25 + Math.abs(Math.sin(t * 4)) * 0.12 + Math.sin(r * Math.PI) * 0.9
        kelinci.rotation.y = Math.sin(t * 0.5) > 0 ? -0.5 : 0.5
        if (r >= 1) hop = -1
        isi.rotation.y = -0.35 + Math.sin(t * 0.35) * 0.15
        isi.position.y = isi.userData.y + Math.sin(t * 0.9 + 2) * 0.12
      },
    })
  }

  for (const o of objek) {
    o.grup.traverse((m) => (m.userData.pemilik = o))
    adegan.add(o.grup)
  }

  // ---- hiasan: awan, hati, bintang ----
  const awan = []
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group()
    for (const [x, y, r] of [
      [0, 0, 0.9],
      [0.9, 0.15, 0.7],
      [-0.9, 0.05, 0.65],
      [0.35, 0.55, 0.65],
    ]) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), toon(WARNA.putih))
      b.position.set(x, y, 0)
      g.add(b)
    }
    g.userData = { kecepatan: 0.25 + i * 0.08, y: 4 - i * 2.6, z: -6 - i * 1.5 }
    g.position.set(-14 + i * 8, g.userData.y, g.userData.z)
    adegan.add(g)
    awan.push(g)
  }
  const bentukHati = new THREE.Shape()
  bentukHati.moveTo(0, 0.25)
  bentukHati.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0.15)
  bentukHati.bezierCurveTo(-0.5, -0.15, 0, -0.35, 0, -0.55)
  bentukHati.bezierCurveTo(0, -0.35, 0.5, -0.15, 0.5, 0.15)
  bentukHati.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0.25)
  const geoHati = new THREE.ExtrudeGeometry(bentukHati, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  })
  const hiasan = []
  for (let i = 0; i < 9; i++) {
    const hati = i % 3 !== 2
    const m = new THREE.Mesh(hati ? geoHati : new THREE.OctahedronGeometry(0.25), toon(hati ? WARNA.pinkTua : WARNA.biruTua))
    m.scale.setScalar(hati ? 0.55 + (i % 3) * 0.15 : 1)
    m.userData = { x0: (i / 9) * 2 - 1, kecepatan: 0.5 + (i % 4) * 0.18, fase: i * 1.7 }
    adegan.add(m)
    hiasan.push(m)
  }

  // ---- tata letak menyesuaikan ukuran layar (HP tegak / laptop) ----
  let lebarDunia = 20
  let tinggiDunia = 15
  function susun() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    kamera.aspect = w / h
    kamera.updateProjectionMatrix()
    tinggiDunia = 2 * kamera.position.z * Math.tan((kamera.fov * Math.PI) / 360)
    lebarDunia = tinggiDunia * kamera.aspect
    const hp = kamera.aspect < 1
    // objek dikecilkan di layar sempit dan ditaruh di tepi agar tidak menutupi kotak materi di tengah
    const k = hp ? 0.5 : w >= 1280 ? 0.85 : w >= 960 ? 0.72 : 0.6
    const tx = lebarDunia / 2
    const ty = tinggiDunia / 2
    const letak = hp
      ? {
          siku: [-tx + 1.1, ty - 3.4],
          layang: [tx - 1, ty - 3.6],
          persegi: [-tx + 1.2, -ty + 2.2],
          tangga: [tx - 1.6, -ty + 1.4],
        }
      : {
          siku: [-tx + 2.2 * k + 0.6, ty - 3.6 * k - 1.6],
          layang: [tx - 1.6 * k - 0.6, ty - 2.6 * k - 1.2],
          persegi: [-tx + 2.2 * k + 0.7, -ty + 2.6 * k + 0.6],
          tangga: [tx - 2.6 * k - 0.6, -ty + 1.4 * k + 0.4],
        }
    for (const o of objek) {
      const [x, y] = letak[o.nama]
      o.grup.userData = { ...o.grup.userData, x, y, skala: k }
      o.grup.position.set(x, y, 0)
      o.grup.scale.setScalar(k)
    }
  }
  susun()
  window.addEventListener('resize', susun)

  // ---- klik / ketuk objek ----
  const sinar = new THREE.Raycaster()
  const titik = new THREE.Vector2()
  const kenai = (e) => {
    const r = kanvas.getBoundingClientRect()
    titik.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    sinar.setFromCamera(titik, kamera)
    const hasil = sinar.intersectObjects(
      objek.map((o) => o.grup),
      true,
    )
    return hasil[0]?.object.userData.pemilik ?? null
  }
  let waktu = 0
  const diklik = (e) => {
    const o = kenai(e)
    if (!o) return
    o.reaksi(waktu)
    const daftar = SAPAAN[o.nama]
    const n = (o.hitung = (o.hitung ?? -1) + 1)
    // balon kata di atas objek, digambar di lapisan depan agar tidak tertutup kotak
    const atas = new THREE.Vector3(o.grup.position.x, o.grup.position.y + 2.2 * o.grup.userData.skala, 0).project(kamera)
    const x = Math.min(Math.max(((atas.x + 1) / 2) * window.innerWidth, 130), window.innerWidth - 130)
    const y = Math.max(((1 - atas.y) / 2) * window.innerHeight, 70)
    setUcap({ teks: daftar[n % daftar.length], x, y, n: Date.now() })
    gambar(true)
  }
  const melayang = (e) => {
    kanvas.style.cursor = kenai(e) ? 'pointer' : 'default'
  }
  kanvas.addEventListener('click', diklik)
  kanvas.addEventListener('pointermove', melayang)

  // ---- putaran animasi hemat (±30 fps), berhenti bila tidak perlu ----
  const gerakDikurangi = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const animasiMati = () => document.documentElement.classList.contains('tanpa-animasi') || gerakDikurangi?.matches
  let bingkai = 0
  let terakhir = performance.now()
  function perbaruiSemua(dt) {
    waktu += dt
    for (const o of objek) o.perbarui(waktu, dt)
    for (const g of awan) {
      g.position.x += g.userData.kecepatan * dt
      if (g.position.x > lebarDunia / 2 + 6) g.position.x = -lebarDunia / 2 - 6
    }
    for (const m of hiasan) {
      const { x0, kecepatan, fase } = m.userData
      const jalan = ((waktu * kecepatan + fase) % (tinggiDunia + 4)) - tinggiDunia / 2 - 2
      m.position.set(x0 * (lebarDunia / 2 - 1) + Math.sin(waktu + fase) * 0.6, jalan, -3)
      m.rotation.y = waktu * 1.2 + fase
    }
  }
  function gambar(sekali = false) {
    cancelAnimationFrame(bingkai)
    const langkah = (sekarang) => {
      const dt = Math.min((sekarang - terakhir) / 1000, 0.1)
      if (dt >= 1 / 32) {
        terakhir = sekarang
        perbaruiSemua(dt)
        renderer.render(adegan, kamera)
      }
      if (!document.hidden && (!animasiMati() || sekali)) {
        // setelah reaksi klik saat animasi mati, tetap digerakkan ±1,5 detik lalu berhenti
        if (sekali && animasiMati() && waktuBerhenti && sekarang > waktuBerhenti) return
        bingkai = requestAnimationFrame(langkah)
      }
    }
    waktuBerhenti = sekali ? performance.now() + 1500 : 0
    terakhir = performance.now() - 40
    bingkai = requestAnimationFrame(langkah)
  }
  let waktuBerhenti = 0
  perbaruiSemua(0)
  renderer.render(adegan, kamera)
  if (!animasiMati()) gambar()

  const ubahTampil = () => {
    if (!document.hidden && !animasiMati()) gambar()
  }
  document.addEventListener('visibilitychange', ubahTampil)
  const pengamat = new MutationObserver(() => (animasiMati() ? cancelAnimationFrame(bingkai) : gambar()))
  pengamat.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  return () => {
    cancelAnimationFrame(bingkai)
    window.removeEventListener('resize', susun)
    document.removeEventListener('visibilitychange', ubahTampil)
    kanvas.removeEventListener('click', diklik)
    kanvas.removeEventListener('pointermove', melayang)
    pengamat.disconnect()
    adegan.traverse((m) => {
      m.geometry?.dispose()
    })
    Object.values(bahan).forEach((b) => b.dispose())
    nada.dispose()
    renderer.dispose()
  }
}
