// Latar belakang 3D "Pulau Melayang Pythagoras" (three.js) untuk semua menu, di belakang kotak-kotak yang tembus pandang.
// Gaya diorama: pulau-pulau kecil melayang di langit pastel biru soft + pink soft, dengan bayangan nyata, pantulan cahaya
// lembut (environment map), kabut kedalaman, dan sudut pandang yang ikut bergeser (paralaks). Setiap pulau adalah contoh
// dari materi teorema Pythagoras:
//   - Pulau rumah: tangga bersandar ke dinding (kaki 3, tinggi 4, tangga 5) dengan kelinci yang naik-turun (Contoh 1 materi)
//   - Pulau layang-layang: benang dari patok ke layang-layang = sisi miring (Contoh 2 materi), dengan kolam & air terjun
//   - Pulau kebun: petak 3×3, 4×4, 5×5 mengelilingi kolam segitiga siku-siku (bukti luas 3² + 4² = 5²)
//   - Pulau tiang bendera: tali penyangga dari puncak tiang ke patok = sisi miring, tanda sudut siku-siku di kaki tiang
//   - pulau-pulau kecil, balon udara, burung, awan, dan kilauan
// Objek bisa diklik/diketuk: bereaksi dan berbicara tentang materi. Hemat: three.js diunduh setelah halaman tampil,
// ±30 fps, berhenti saat tab tidak dilihat, saat "Animasi: mati", dan saat prefers-reduced-motion. Disembunyikan saat tes.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const W = {
  biru: 0xb3dcff,
  biruTua: 0x6fb3f0,
  pink: 0xffc4de,
  pinkTua: 0xf58bbd,
  putih: 0xffffff,
  krem: 0xfff4ea,
  lila: 0xdccbf5,
  lilaTua: 0xb9a3ea,
  kayu: 0xe9bd94,
  air: 0x8fcdff,
  mata: 0x1b2447,
}

const SAPAAN = {
  tangga: ['Tangga 5, kaki 3, tinggi 4! 🪜', 'Tangga bersandar = segitiga siku-siku 🐰', 'Tangga itu sisi miringnya 💙'],
  layang: ['Benangku sisi miring! 🪁', 'Tinggi² + jarak² = benang² 💨', 'Wuusss, terbang tinggi! ☁️'],
  taman: ['3² + 4² = 5² 🌷', '9 + 16 = 25 petak, pas! ✨', 'Luas dua kebun kecil = luas kebun besar 💖'],
  tiang: ['Tali penyangga = sisi miring 🚩', 'Tiang tegak lurus tanah: sudut 90° 📐', 'tinggi² + jarak patok² = tali² 💪'],
  balon: ['Balon udara terbang tinggi 🎈', 'Dari atas, semua terlihat jelas ✨', 'Hore, kamu hebat! 🎉'],
  burung: ['Cuit! Semangat belajar 🐦', 'Terbang lurus = jarak terpendek 💨', 'Cuit cuit! 💗'],
  pulau: ['Pulau kecil melayang ☁️', 'Belajar pelan-pelan saja ya 🌸', 'Kamu pasti bisa! 💙'],
  kupu: ['Kupu-kupu menyapa! 🦋', 'Sayapku kiri-kanan sama besar ✨', 'Terus semangat ya! 💗'],
}

export default function Latar3D() {
  const kanvas = useRef(null)
  const [ucap, setUcap] = useState(null)

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
      Promise.all([
        import('three'),
        import('three/examples/jsm/geometries/RoundedBoxGeometry.js'),
        import('three/examples/jsm/environments/RoomEnvironment.js'),
      ]).then(([THREE, rb, ruang]) => {
        if (batal || !kanvas.current) return
        bersihkan = bangunAdegan(THREE, rb.RoundedBoxGeometry, ruang.RoomEnvironment, kanvas.current, setUcap)
      })
    }, 600)
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

function bangunAdegan(THREE, RoundedBoxGeometry, RoomEnvironment, kanvas, setUcap) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas: kanvas, antialias: true, alpha: true })
  } catch {
    return () => {}
  }
  const hp = Math.min(window.innerWidth, window.innerHeight) < 600
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, hp ? 1.25 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const gelap = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const adegan = new THREE.Scene()
  // kabut pastel: pulau yang jauh memudar, memberi kesan kedalaman
  adegan.fog = new THREE.Fog(gelap ? 0x2a2148 : 0xf3ecff, 30, 62)
  const KAMERA_Z = 24
  const kamera = new THREE.PerspectiveCamera(36, 1, 0.1, 140)
  kamera.position.set(0, 2, KAMERA_Z)

  // pantulan cahaya lembut seperti di dalam studio foto (permukaan mengkilap tampak bervolume)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const ruang = new RoomEnvironment()
  const lingkungan = pmrem.fromScene(ruang, 0.04).texture
  ruang.dispose?.()
  pmrem.dispose()
  adegan.environment = lingkungan
  adegan.environmentIntensity = 0.45

  // matahari (berbayang) + cahaya pink dari belakang + cahaya biru dari samping
  adegan.add(new THREE.HemisphereLight(0xe3f2ff, 0xffd9ea, 0.9))
  const matahari = new THREE.DirectionalLight(0xfff6fa, 2.3)
  matahari.position.set(6, 12, 10)
  matahari.target.position.set(0, 0, -3)
  matahari.castShadow = true
  matahari.shadow.mapSize.set(hp ? 1024 : 2048, hp ? 1024 : 2048)
  matahari.shadow.bias = -0.0004
  matahari.shadow.normalBias = 0.03
  const tepi = new THREE.DirectionalLight(0xffa8d2, 0.9)
  tepi.position.set(-8, 3, -6)
  const samping = new THREE.DirectionalLight(0xa8d8ff, 0.6)
  samping.position.set(9, -2, 6)
  adegan.add(matahari, matahari.target, tepi, samping)

  // ---- bahan & bentuk dasar ----
  const bahan = {}
  const std = (warna, kasar = 0.6, kilap = 0) =>
    (bahan[`s${warna}-${kasar}-${kilap}`] ??= kilap
      ? new THREE.MeshPhysicalMaterial({ color: warna, roughness: kasar, clearcoat: kilap, clearcoatRoughness: 0.15 })
      : new THREE.MeshStandardMaterial({ color: warna, roughness: kasar }))
  const datar = (warna) => (bahan[`d${warna}`] ??= new THREE.MeshBasicMaterial({ color: warna }))
  const tembus = (warna, op) =>
    (bahan[`t${warna}-${op}`] ??= new THREE.MeshBasicMaterial({
      color: warna,
      transparent: true,
      opacity: op,
      depthWrite: false,
    }))
  const warnaVerteks = (kasar, duaSisi = false) =>
    (bahan[`v${kasar}-${duaSisi}`] ??= new THREE.MeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: kasar,
      side: duaSisi ? THREE.DoubleSide : THREE.FrontSide,
    }))
  const bola = new THREE.SphereGeometry(1, 28, 20)
  const v2 = (x, y) => new THREE.Vector2(x, y)
  const SUMBU_Y = new THREE.Vector3(0, 1, 0)
  // batang silinder dari titik a ke titik b (untuk tali, benang, tali balon)
  function batangAntara(m, a, b) {
    const arah = b.clone().sub(a)
    m.position.copy(a).addScaledVector(arah, 0.5)
    m.scale.set(1, arah.length(), 1)
    m.quaternion.setFromUnitVectors(SUMBU_Y, arah.normalize())
  }
  const tali = (r, warna) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8), std(warna, 0.5))

  // tekstur bulat lembut (kilauan, cahaya matahari)
  const teksturBulat = (() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.65)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  // tekstur garis-garis air terjun (digeser terus agar tampak mengalir)
  const teksturAir = (() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 256
    const g = c.getContext('2d')
    g.fillStyle = 'rgba(255,255,255,0.55)'
    g.fillRect(0, 0, 64, 256)
    for (let i = 0; i < 26; i++) {
      g.fillStyle = `rgba(255,255,255,${0.5 + (i % 3) * 0.15})`
      g.fillRect((i * 23) % 60, (i * 53) % 256, 3 + (i % 3), 30 + (i % 5) * 14)
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })()

  // ---- wajah kecil untuk kelinci (mata berkilau, berkedip, pipi merona) ----
  const semuaMata = []
  function wajah(lebar, r) {
    const g = new THREE.Group()
    for (const s of [-1, 1]) {
      const mata = new THREE.Group()
      const bolaMata = new THREE.Mesh(bola, datar(W.mata))
      bolaMata.scale.set(r, r * 1.18, r * 0.45)
      const kilau = new THREE.Mesh(bola, datar(W.putih))
      kilau.scale.setScalar(r * 0.36)
      kilau.position.set(r * 0.32, r * 0.38, r * 0.4)
      mata.add(bolaMata, kilau)
      mata.position.x = (s * lebar) / 2
      g.add(mata)
      semuaMata.push(mata)
      const pipi = new THREE.Mesh(bola, tembus(W.pinkTua, 0.55))
      pipi.scale.set(r * 0.9, r * 0.55, r * 0.2)
      pipi.position.set(s * (lebar / 2 + r * 1.1), -r * 1.1, -r * 0.1)
      g.add(pipi)
    }
    const senyum = new THREE.Mesh(new THREE.TorusGeometry(r * 0.6, r * 0.15, 8, 16, Math.PI), datar(W.mata))
    senyum.rotation.z = Math.PI
    senyum.position.y = -r * 0.7
    g.add(senyum)
    return g
  }

  function kelinci() {
    const g = new THREE.Group()
    const bulu = std(W.putih, 0.7)
    const badan = new THREE.Mesh(bola, bulu)
    badan.scale.set(0.36, 0.33, 0.34)
    const kepala = new THREE.Mesh(bola, bulu)
    kepala.scale.setScalar(0.33)
    kepala.position.set(0, 0.48, 0.06)
    const ekor = new THREE.Mesh(bola, bulu)
    ekor.scale.setScalar(0.12)
    ekor.position.set(0, 0.02, -0.34)
    g.add(badan, kepala, ekor)
    for (const s of [-1, 1]) {
      const telinga = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.34, 4, 10), bulu)
      telinga.position.set(s * 0.13, 0.9, 0)
      telinga.rotation.z = -s * 0.18
      const dalam = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.24, 4, 8), std(W.pink, 0.6))
      dalam.position.z = 0.05
      telinga.add(dalam)
      g.add(telinga)
    }
    const muka = wajah(0.24, 0.065)
    muka.position.set(0, 0.5, 0.37)
    g.add(muka)
    return g
  }

  function pohon(warna, s = 1) {
    const g = new THREE.Group()
    const batang = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.7, 10), std(W.kayu, 0.75))
    batang.position.y = 0.35
    g.add(batang)
    for (const [x, y, z, r] of [
      [0, 0.95, 0, 0.42],
      [0.3, 0.78, 0.1, 0.3],
      [-0.28, 0.8, -0.05, 0.32],
      [0.05, 1.25, 0.04, 0.3],
    ]) {
      const daun = new THREE.Mesh(bola, std(warna, 0.55))
      daun.scale.setScalar(r)
      daun.position.set(x, y, z)
      g.add(daun)
    }
    g.scale.setScalar(s)
    return g
  }

  function jamur() {
    const g = new THREE.Group()
    const batang = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.4, 14), std(W.krem, 0.7))
    batang.position.y = 0.2
    const tudung = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(W.pinkTua, 0.35, 1))
    tudung.scale.set(0.4, 0.32, 0.4)
    tudung.position.y = 0.36
    g.add(batang, tudung)
    for (const [a, h] of [
      [0.4, 0.5],
      [2.2, 0.4],
      [4, 0.55],
      [5.3, 0.75],
    ]) {
      const bintik = new THREE.Mesh(bola, std(W.putih, 0.5))
      bintik.scale.setScalar(0.05)
      bintik.position.set(Math.cos(a) * 0.36 * Math.cos(h), 0.36 + 0.3 * Math.sin(h), Math.sin(a) * 0.36 * Math.cos(h))
      g.add(bintik)
    }
    return g
  }

  function kincir() {
    const g = new THREE.Group()
    const menara = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.24, 1.1, 16), std(W.krem, 0.6))
    menara.position.y = 0.55
    const atap = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.32, 16), std(W.pinkTua, 0.3, 1))
    atap.position.y = 1.26
    const baling = new THREE.Group()
    for (let i = 0; i < 4; i++) {
      const daun = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.62, 0.03, 2, 0.02), std(i % 2 ? W.pink : W.putih, 0.4, 1))
      daun.position.y = 0.33
      const lengan = new THREE.Group()
      lengan.rotation.z = (i * Math.PI) / 2
      lengan.add(daun)
      baling.add(lengan)
    }
    const poros = new THREE.Mesh(bola, std(W.biruTua, 0.3, 1))
    poros.scale.setScalar(0.06)
    baling.add(poros)
    baling.position.set(0, 1.0, 0.2)
    g.add(menara, atap, baling)
    g.userData.baling = baling
    return g
  }

  // ---- pulau melayang: tanah bergelombang (lila → biru), rumput "meleleh" di tepinya, dan bunga ----
  const ATAS = 0.44 // tinggi permukaan rumput
  const riak = (a, y, s) => {
    const bawah = Math.min(Math.max((-y - 0.05) / 0.5, 0), 1)
    return 1 + 0.06 * Math.sin(a * 5 + s) + 0.035 * Math.sin(a * 9 + s * 1.7) + bawah * 0.09 * Math.sin(a * 3 + y * 2.5 + s)
  }
  function pulau(r, warnaRumput, s, cincin = [0.55, 0.3]) {
    const g = new THREE.Group()
    const tinggi = r * 1.15
    const c = new THREE.Color()
    // tanah
    const profil = new THREE.SplineCurve([
      v2(0.001, -tinggi),
      v2(r * 0.22, -tinggi * 0.84),
      v2(r * 0.45, -tinggi * 0.6),
      v2(r * 0.7, -tinggi * 0.34),
      v2(r * 0.9, -tinggi * 0.1),
      v2(r, 0.1),
    ]).getPoints(28)
    profil.push(v2(0.001, 0.12))
    const tanah = new THREE.LatheGeometry(profil, 56)
    tanah.rotateY(Math.PI) // sambungan bentuk diputar ke belakang agar tidak terlihat
    const cAtas = new THREE.Color(W.lila)
    const cBawah = new THREE.Color(W.biruTua)
    let p = tanah.attributes.position
    let warna = new Float32Array(p.count * 3)
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const f = riak(Math.atan2(z, x), y, s)
      p.setX(i, x * f)
      p.setZ(i, z * f)
      c.copy(cAtas).lerp(cBawah, Math.min(Math.max(-y / tinggi, 0), 1))
      c.offsetHSL(0, 0, Math.sin(y * 9 + s) * 0.03) // lapisan-lapisan tanah
      c.toArray(warna, i * 3)
    }
    tanah.setAttribute('color', new THREE.BufferAttribute(warna, 3))
    tanah.computeVertexNormals()
    g.add(new THREE.Mesh(tanah, warnaVerteks(0.85)))
    // rumput
    const profilRumput = new THREE.SplineCurve([
      v2(0.001, ATAS),
      v2(r * 0.55, ATAS + 0.01),
      v2(r * 0.92, ATAS - 0.05),
      v2(r * 1.06, 0.27),
      v2(r * 1.08, 0.1),
      v2(r * 1.03, 0),
    ]).getPoints(20)
    const rumput = new THREE.LatheGeometry(profilRumput, 72)
    rumput.rotateY(Math.PI)
    const cRumput = new THREE.Color(warnaRumput)
    const cTerang = cRumput.clone().lerp(new THREE.Color(W.putih), 0.35)
    p = rumput.attributes.position
    warna = new Float32Array(p.count * 3)
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = p.getZ(i)
      const a = Math.atan2(z, x)
      const f = riak(a, 0, s)
      p.setX(i, x * f)
      p.setZ(i, z * f)
      if (y < 0.3) p.setY(i, y - Math.max(0, Math.sin(a * 7 + s * 3)) ** 3 * 0.3 * Math.min((0.3 - y) / 0.3, 1))
      c.copy(cTerang).lerp(cRumput, Math.min(Math.hypot(x, z) / r, 1))
      c.toArray(warna, i * 3)
    }
    rumput.setAttribute('color', new THREE.BufferAttribute(warna, 3))
    rumput.computeVertexNormals()
    g.add(new THREE.Mesh(rumput, warnaVerteks(0.7, true)))
    // bunga kecil di sekeliling tepi
    const n = Math.round(r * 14)
    const bunga = new THREE.InstancedMesh(bola, std(W.putih, 0.45), n)
    const m4 = new THREE.Matrix4()
    const warnaBunga = [W.pinkTua, W.putih, W.biruTua, W.pink, W.lilaTua]
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.sin(i * 12.9 + s) * 0.3
      const rr = r * (cincin[0] + ((i * 37) % 10) * 0.1 * cincin[1]) * riak(a, 0, s)
      m4.makeScale(0.07, 0.07, 0.07).setPosition(Math.cos(a) * rr, ATAS - 0.01, Math.sin(a) * rr)
      bunga.setMatrixAt(i, m4)
      bunga.setColorAt(i, c.set(warnaBunga[i % warnaBunga.length]))
    }
    g.add(bunga)
    return g
  }

  const objek = [] // { nama, grup, putar, miring, perbarui(t, dt), reaksi(t) }

  // gerak umum pulau: mengambang naik-turun, berayun pelan, melompat saat diklik
  function pulauHidup(o, fase) {
    let mulai = -1
    o.reaksi = (t) => {
      mulai = t
      o.saatReaksi?.(t)
    }
    o.gerak = (t) => {
      let lompat = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 0.9
        if (r >= 1) mulai = -1
        else lompat = Math.sin(r * Math.PI) * 0.7
      }
      const d = o.grup.userData
      o.grup.position.y = d.y + (Math.sin(t * 1.1 + fase) * 0.38 + lompat) * d.k
      o.grup.rotation.set(
        (o.miring ?? 0.26) + Math.sin(t * 0.7 + fase) * 0.05,
        (o.putar ?? 0) + Math.sin(t * 0.45 + fase) * 0.35,
        Math.sin(t * 0.9 + fase) * 0.04,
      )
    }
    o.perbarui ??= (t) => o.gerak(t)
    return o
  }

  // ---- 1. Pulau rumah & tangga bersandar (3 : 4 : 5) ----
  {
    const grup = pulau(2.3, W.pink, 1)
    const rumah = new THREE.Group()
    const dinding = new THREE.Mesh(new RoundedBoxGeometry(1.3, 1.15, 1.1, 3, 0.08), std(W.krem, 0.7))
    dinding.position.y = 0.575
    const bentukAtap = new THREE.Shape([v2(-0.72, 0), v2(0.72, 0), v2(0, 0.62)])
    const geoAtap = new THREE.ExtrudeGeometry(bentukAtap, {
      depth: 1.4,
      bevelEnabled: true,
      bevelSize: 0.06,
      bevelThickness: 0.06,
      bevelSegments: 4,
    })
    geoAtap.translate(0, 0, -0.7)
    geoAtap.rotateY(Math.PI / 2)
    const atap = new THREE.Mesh(geoAtap, std(W.pinkTua, 0.35, 1))
    atap.position.y = 1.15
    const jendela = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.36, 0.08, 2, 0.04), std(W.biruTua, 0.15, 1))
    jendela.position.set(-0.28, 0.72, 0.55)
    const pintu = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.56, 0.08, 2, 0.05), std(W.pinkTua, 0.4, 1))
    pintu.position.set(0.3, 0.28, 0.55)
    rumah.add(dinding, atap, jendela, pintu)
    rumah.position.set(-0.7, ATAS, -0.15)
    grup.add(rumah)
    // tangga: kaki 0,9 dari dinding, tinggi 1,2, panjang 1,5 (perbandingan 3 : 4 : 5)
    const kaki = new THREE.Vector3(0.85, ATAS, 0.2)
    const puncak = new THREE.Vector3(-0.05, ATAS + 1.2, 0.2)
    const arah = puncak.clone().sub(kaki)
    const panjang = arah.length()
    const tangga = new THREE.Group()
    for (const z of [-0.2, 0.2]) {
      const rel = new THREE.Mesh(new RoundedBoxGeometry(0.09, panjang, 0.09, 2, 0.03), std(W.biruTua, 0.3, 1))
      rel.position.set(0, panjang / 2, z)
      tangga.add(rel)
    }
    for (let i = 1; i <= 4; i++) {
      const anak = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.4, 10), std(W.kayu, 0.6))
      anak.rotation.x = Math.PI / 2
      anak.position.y = (panjang * i) / 5
      tangga.add(anak)
    }
    tangga.position.copy(kaki)
    tangga.quaternion.setFromUnitVectors(SUMBU_Y, arah.clone().normalize())
    grup.add(tangga)
    // tanda sudut siku-siku di pertemuan dinding & tanah
    const tanda = new THREE.Group()
    for (const [x, y, w, h] of [
      [0.1, 0.2, 0.2, 0.025],
      [0.2, 0.1, 0.025, 0.2],
    ]) {
      const garis = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.025), std(W.putih, 0.4))
      garis.position.set(x, y, 0)
      tanda.add(garis)
    }
    tanda.position.set(-0.05, ATAS, 0.45)
    grup.add(tanda)
    const kel = kelinci()
    kel.scale.setScalar(0.62)
    grup.add(kel)
    const p1 = pohon(W.pink, 0.9)
    p1.position.set(1.25, ATAS - 0.02, -0.95)
    const p2 = pohon(W.biru, 0.6)
    p2.position.set(-1.65, ATAS - 0.02, 0.55)
    grup.add(p1, p2)
    let lompatKelinci = -1
    const o = pulauHidup({ nama: 'tangga', grup, putar: -0.25 }, 0)
    o.saatReaksi = (t) => (lompatKelinci = t)
    o.perbarui = (t) => {
      o.gerak(t)
      const p = 0.12 + (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.7 // kelinci naik-turun di sepanjang tangga
      let y = Math.abs(Math.sin(t * 4)) * 0.08
      if (lompatKelinci >= 0) {
        const r = (t - lompatKelinci) / 0.7
        if (r >= 1) lompatKelinci = -1
        else y += Math.sin(r * Math.PI) * 0.5
      }
      kel.position.copy(kaki).addScaledVector(arah, p)
      kel.position.x += 0.16
      kel.position.y += 0.18 + y
      kel.position.z += 0.05
      kel.rotation.y = Math.sin(t * 0.5) > 0 ? -0.6 : 0.6
    }
    objek.push(o)
  }

  // ---- 2. Pulau layang-layang (benang = sisi miring) dengan kolam & air terjun ----
  {
    const grup = pulau(1.8, W.biru, 2)
    const patok = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.4, 10), std(W.kayu, 0.7))
    patok.position.set(-0.4, ATAS + 0.18, 0.3)
    grup.add(patok)
    const layang = new THREE.Group()
    const ekst = { depth: 0.05, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3 }
    const kiri = new THREE.Mesh(
      new THREE.ExtrudeGeometry(new THREE.Shape([v2(0, 0.9), v2(-0.62, 0.2), v2(0, -1)]), ekst),
      std(W.pink, 0.4, 1),
    )
    const kanan = new THREE.Mesh(
      new THREE.ExtrudeGeometry(new THREE.Shape([v2(0, 0.9), v2(0, -1), v2(0.62, 0.2)]), ekst),
      std(W.biruTua, 0.4, 1),
    )
    const tegak = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.9, 8), std(W.kayu, 0.6))
    tegak.position.set(0, -0.05, 0.1)
    const lintang = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.24, 8), std(W.kayu, 0.6))
    lintang.rotation.z = Math.PI / 2
    lintang.position.set(0, 0.2, 0.1)
    layang.add(kiri, kanan, tegak, lintang)
    const pita = []
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Group()
      for (const s of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 10), std(i % 2 ? W.biruTua : W.pinkTua, 0.4))
        c.rotation.z = (s * Math.PI) / 2
        c.position.x = s * 0.11
        p.add(c)
      }
      layang.add(p)
      pita.push(p)
    }
    grup.add(layang)
    const benang = tali(0.014, W.pinkTua)
    grup.add(benang)
    // kolam kecil di tepi, airnya jatuh menjadi air terjun
    const d = new THREE.Vector2(-0.62, 0.78).normalize()
    const kolam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.04, 36),
      (bahan.kolam = new THREE.MeshPhysicalMaterial({ color: W.air, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05 })),
    )
    kolam.position.set(d.x * 1.15, ATAS - 0.02, d.y * 1.15)
    grup.add(kolam)
    const geoAir = new THREE.PlaneGeometry(0.42, 2.6, 1, 14)
    geoAir.translate(0, -1.3, 0)
    const pa = geoAir.attributes.position
    for (let i = 0; i < pa.count; i++) pa.setZ(i, (-pa.getY(i) / 2.6) ** 1.6 * 0.45 + 0.04)
    geoAir.computeVertexNormals()
    const air = new THREE.Mesh(
      geoAir,
      (bahan.airTerjun = new THREE.MeshStandardMaterial({
        color: W.biru,
        map: teksturAir,
        transparent: true,
        opacity: 0.88,
        roughness: 0.2,
        emissive: W.biru,
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
      })),
    )
    air.position.set(d.x * 1.8 * 1.02, ATAS - 0.04, d.y * 1.8 * 1.02)
    air.rotation.y = Math.atan2(d.x, d.y)
    grup.add(air)
    const kabutAir = []
    for (let i = 0; i < 3; i++) {
      const k = new THREE.Mesh(bola, tembus(W.putih, 0.7))
      k.position.set(air.position.x + d.x * 0.5 + (i - 1) * 0.18, -2.1, air.position.z + d.y * 0.5)
      grup.add(k)
      kabutAir.push(k)
    }
    const p1 = pohon(W.biru, 0.75)
    p1.position.set(0.75, ATAS - 0.02, -0.55)
    grup.add(p1)
    const ujung = new THREE.Vector3()
    const pangkal = new THREE.Vector3(-0.4, ATAS + 0.38, 0.3)
    let putaran = -1
    const o = pulauHidup({ nama: 'layang', grup, putar: 0.25 }, 1.7)
    o.saatReaksi = (t) => (putaran = t)
    o.perbarui = (t) => {
      o.gerak(t)
      let putar = 0
      if (putaran >= 0) {
        const r = (t - putaran) / 1.1
        if (r >= 1) putaran = -1
        else putar = r * Math.PI * 2
      }
      layang.position.set(1.0 + Math.sin(t * 0.8) * 0.3, 3.5 + Math.sin(t * 1.3) * 0.2, 0.3)
      layang.rotation.set(0, Math.sin(t * 0.9) * 0.3, Math.sin(t * 1.1) * 0.15 + putar)
      layang.updateMatrix()
      pita.forEach((p, i) => p.position.set(Math.sin(t * 3 + i) * 0.1 * (i + 1), -1.3 - i * 0.38, 0))
      ujung.set(0, -1, 0.05).applyMatrix4(layang.matrix)
      batangAntara(benang, pangkal, ujung)
      teksturAir.offset.y = (t * 0.9) % 1
      kabutAir.forEach((k, i) => k.scale.setScalar(0.16 + Math.sin(t * 3 + i * 2) * 0.04))
    }
    objek.push(o)
  }

  // ---- 3. Pulau kebun 3² + 4² = 5² (petak mengelilingi kolam segitiga siku-siku) ----
  {
    const grup = pulau(2.4, W.pink, 3, [0.9, 0.06])
    const s = 0.3
    const petak = new RoundedBoxGeometry(s * 0.86, 0.14, s * 0.86, 2, 0.04)
    const O = v2(0, 0)
    const A = v2(3 * s, 0)
    const B = v2(0, 4 * s)
    const cx = 1.5 * s
    const cy = 2 * s
    const sisi = [
      { p: O, q: A, n: v2(0, -1), jumlah: 3, warna: W.biruTua },
      { p: B, q: O, n: v2(-1, 0), jumlah: 4, warna: W.pinkTua },
      { p: A, q: B, n: v2(4, 3).normalize(), jumlah: 5, warna: W.putih },
    ]
    const semuaPetak = []
    for (const { p, q, n, jumlah, warna } of sisi) {
      const u = q.clone().sub(p).normalize()
      for (let i = 0; i < jumlah; i++)
        for (let j = 0; j < jumlah; j++) {
          const m = new THREE.Mesh(petak, std(jumlah === 5 && (i + j) % 2 ? W.pink : warna, 0.35, 1))
          const pos = p
            .clone()
            .addScaledVector(u, (i + 0.5) * s)
            .addScaledVector(n, (j + 0.5) * s)
          m.position.set(pos.x - cx, ATAS + 0.07, -(pos.y - cy))
          m.rotation.y = Math.atan2(u.y, u.x)
          m.userData.jarak = i + j
          grup.add(m)
          semuaPetak.push(m)
        }
    }
    const geoKolam = new THREE.ExtrudeGeometry(new THREE.Shape([O, A, B]), {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
    })
    geoKolam.rotateX(-Math.PI / 2)
    geoKolam.translate(-cx, ATAS, cy)
    const kolam = new THREE.Mesh(
      geoKolam,
      (bahan.kolamKebun = new THREE.MeshPhysicalMaterial({
        color: 0x5aa8f0,
        roughness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      })),
    )
    grup.add(kolam)
    const p1 = pohon(W.pink, 0.7)
    p1.position.set(-1.55, ATAS - 0.02, -1.25)
    grup.add(p1)
    // ikan kecil yang sesekali melompat dari kolam
    const ikan = new THREE.Group()
    const badanIkan = new THREE.Mesh(bola, std(W.pinkTua, 0.3, 1))
    badanIkan.scale.set(0.16, 0.09, 0.07)
    const ekorIkan = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.14, 8), std(W.pinkTua, 0.3, 1))
    ekorIkan.rotation.z = Math.PI / 2
    ekorIkan.position.x = -0.19
    ikan.add(badanIkan, ekorIkan)
    grup.add(ikan)
    let gelombang = -1
    const o = pulauHidup({ nama: 'taman', grup, putar: 0.35, miring: 0.5 }, 3.1)
    o.saatReaksi = (t) => (gelombang = t)
    o.perbarui = (t) => {
      o.gerak(t)
      for (const m of semuaPetak) {
        const f = gelombang >= 0 ? t - gelombang - m.userData.jarak * 0.06 : -1
        const naik = f > 0 && f < 0.5 ? Math.sin((f / 0.5) * Math.PI) : 0
        m.position.y = ATAS + 0.07 + naik * 0.3
      }
      if (gelombang >= 0 && t - gelombang > 1.6) gelombang = -1
      const p = (t % 2.6) / 2.6
      ikan.visible = p < 0.4
      if (ikan.visible) {
        const r = p / 0.4
        ikan.position.set(-0.4 + r * 0.5, ATAS + Math.sin(r * Math.PI) * 0.75, 0.2)
        ikan.rotation.z = (0.5 - r) * 2.4
        ekorIkan.rotation.y = Math.sin(t * 25) * 0.5
      }
    }
    objek.push(o)
  }

  // ---- 4. Pulau tiang bendera dengan tali penyangga (sisi miring) ----
  {
    const grup = pulau(1.9, W.biru, 4)
    const xTiang = -0.6
    const zTiang = 0.1
    const tiang = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.5, 14), std(W.putih, 0.3, 1))
    tiang.position.set(xTiang, ATAS + 1.25, zTiang)
    const pucuk = new THREE.Mesh(bola, std(W.pinkTua, 0.3, 1))
    pucuk.scale.setScalar(0.09)
    pucuk.position.set(xTiang, ATAS + 2.54, zTiang)
    const geoBendera = new THREE.PlaneGeometry(0.85, 0.5, 12, 6)
    geoBendera.translate(0.425, 0, 0)
    const asal = geoBendera.attributes.position.array.slice()
    const bendera = new THREE.Mesh(
      geoBendera,
      (bahan.bendera = new THREE.MeshStandardMaterial({ color: W.pinkTua, roughness: 0.6, side: THREE.DoubleSide })),
    )
    bendera.position.set(xTiang + 0.04, ATAS + 2.2, zTiang)
    const kawat = tali(0.016, W.biruTua)
    batangAntara(kawat, new THREE.Vector3(xTiang, ATAS + 1.6, zTiang), new THREE.Vector3(0.75, ATAS + 0.03, zTiang))
    const patok = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 10), std(W.kayu, 0.7))
    patok.position.set(0.75, ATAS + 0.08, zTiang)
    const tanda = new THREE.Group()
    for (const [x, y, w, h] of [
      [0.1, 0.2, 0.2, 0.025],
      [0.2, 0.1, 0.025, 0.2],
    ]) {
      const garis = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.025), std(W.putih, 0.4))
      garis.position.set(x, y, 0)
      tanda.add(garis)
    }
    tanda.position.set(xTiang + 0.05, ATAS, zTiang + 0.06)
    grup.add(tiang, pucuk, bendera, kawat, patok, tanda)
    const p1 = pohon(W.biru, 0.7)
    p1.position.set(-1.25, ATAS - 0.02, -0.85)
    grup.add(p1)
    const kel = kelinci()
    kel.scale.setScalar(0.5)
    grup.add(kel)
    const o = pulauHidup({ nama: 'tiang', grup, putar: -0.2 }, 4.4)
    const pb = geoBendera.attributes.position
    o.perbarui = (t) => {
      o.gerak(t)
      const a = t * 0.9
      kel.position.set(0.35 + Math.cos(a) * 0.45, ATAS + 0.17 + Math.abs(Math.sin(t * 5)) * 0.18, 0.85 + Math.sin(a) * 0.3)
      kel.rotation.y = -a
      for (let i = 0; i < pb.count; i++) {
        const x = asal[i * 3]
        pb.setZ(i, Math.sin(x * 6 - t * 6) * 0.08 * (x / 0.85))
      }
      pb.needsUpdate = true
      geoBendera.computeVertexNormals()
    }
    objek.push(o)
  }

  // ---- 5. Pulau-pulau kecil di kejauhan ----
  ;[
    [1.0, W.biru, () => kincir()],
    [1.15, W.pink, () => jamur()],
    [0.85, W.biru, () => pohon(W.biru, 0.65)],
  ].forEach(([r, warna, isi], i) => {
    const grup = pulau(r, warna, 5 + i * 1.3)
    const benda = isi()
    benda.position.y = ATAS - 0.02
    grup.add(benda)
    const o = pulauHidup({ nama: 'pulau', grup, urutan: i, putar: i * 0.6, skala: 0.8 }, 2 + i * 1.9)
    const baling = benda.userData.baling
    o.perbarui = (t) => {
      o.gerak(t)
      if (baling) baling.rotation.z = -t * 2.5
    }
    objek.push(o)
  })

  // ---- 6. Tiga balon udara bergaris ----
  for (let b = 0; b < 3; b++) {
    const grup = new THREE.Group()
    let geo = new THREE.LatheGeometry(
      new THREE.SplineCurve([
        v2(0.001, -1),
        v2(0.3, -0.9),
        v2(0.75, -0.35),
        v2(0.95, 0.25),
        v2(0.8, 0.85),
        v2(0.42, 1.15),
        v2(0.001, 1.22),
      ]).getPoints(24),
      36,
    )
    geo = geo.toNonIndexed()
    const pg = geo.attributes.position
    const warna = new Float32Array(pg.count * 3)
    const c = new THREE.Color()
    const garis = [
      [W.pink, W.putih, W.biruTua],
      [W.biru, W.putih, W.pinkTua],
      [W.lila, W.pink, W.putih],
    ][b]
    for (let i = 0; i < pg.count; i += 3) {
      const x = (pg.getX(i) + pg.getX(i + 1) + pg.getX(i + 2)) / 3
      const z = (pg.getZ(i) + pg.getZ(i + 1) + pg.getZ(i + 2)) / 3
      c.set(garis[Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 12) % 3])
      for (let j = 0; j < 3; j++) c.toArray(warna, (i + j) * 3)
    }
    geo.setAttribute('color', new THREE.BufferAttribute(warna, 3))
    const balon = new THREE.Mesh(
      geo,
      (bahan[`balonUdara${b}`] = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        vertexColors: true,
        roughness: 0.35,
        clearcoat: 0.8,
      })),
    )
    const keranjang = new THREE.Mesh(new RoundedBoxGeometry(0.45, 0.32, 0.45, 2, 0.06), std(W.kayu, 0.7))
    keranjang.position.y = -1.6
    grup.add(balon, keranjang)
    for (const [x, z] of [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]) {
      const t = tali(0.012, W.kayu)
      batangAntara(t, new THREE.Vector3(x * 0.2, -1.45, z * 0.2), new THREE.Vector3(x * 0.24, -0.92, z * 0.24))
      grup.add(t)
    }
    const api = new THREE.Mesh(bola, datar(0xffe3a3))
    api.scale.setScalar(0.07)
    api.position.y = -1.08
    grup.add(api)
    let mulai = -1
    const o = { nama: 'balon', grup, urutan: b, skala: [1, 0.75, 0.6][b] }
    o.reaksi = (t) => (mulai = t)
    o.perbarui = (t) => {
      const d = grup.userData
      let lompat = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 1
        if (r >= 1) mulai = -1
        else lompat = Math.sin(r * Math.PI) * 0.8
      }
      const x = (((t * (0.55 + b * 0.15) + d.lebar * (0.3 + b * 0.33)) % d.lebar) - d.lebar / 2) * (b === 1 ? -1 : 1)
      grup.position.set(x, d.y + (Math.sin(t * 0.9 + b * 2) * 0.6 + lompat) * d.k, d.z)
      grup.rotation.y = t * 0.4 + b
      api.scale.setScalar(0.06 + Math.sin(t * 9) * 0.015)
    }
    objek.push(o)
  }

  // ---- 7. Burung-burung kecil yang terbang melintas ----
  for (let i = 0; i < 5; i++) {
    const grup = new THREE.Group()
    const tubuh = new THREE.Mesh(bola, std(i % 2 ? W.pink : W.putih, 0.5))
    tubuh.scale.set(0.32, 0.24, 0.24)
    const kepala = new THREE.Mesh(bola, std(i % 2 ? W.pink : W.putih, 0.5))
    kepala.scale.setScalar(0.17)
    kepala.position.set(0.3, 0.14, 0)
    const paruh = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 10), std(0xffb07c, 0.5))
    paruh.rotation.z = -Math.PI / 2
    paruh.position.set(0.5, 0.12, 0)
    grup.add(tubuh, kepala, paruh)
    for (const s of [-1, 1]) {
      const mata = new THREE.Mesh(bola, datar(W.mata))
      mata.scale.setScalar(0.035)
      mata.position.set(0.4, 0.2, s * 0.1)
      grup.add(mata)
    }
    const sayap = [-1, 1].map((s) => {
      const geo = new RoundedBoxGeometry(0.28, 0.03, 0.34, 2, 0.012)
      geo.translate(0, 0, s * 0.17)
      const m = new THREE.Mesh(geo, std(i % 2 ? W.pinkTua : W.biru, 0.5))
      m.position.y = 0.06
      m.userData.s = s
      grup.add(m)
      return m
    })
    const arahTerbang = i % 2 ? -1 : 1
    let mulai = -1
    const o = { nama: 'burung', grup, urutan: i, skala: 1.2 }
    o.reaksi = (t) => (mulai = t)
    o.perbarui = (t) => {
      const d = grup.userData
      let lompat = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 0.8
        if (r >= 1) mulai = -1
        else lompat = Math.sin(r * Math.PI) * 0.9
      }
      const jalan = ((t * (1.6 + (i % 3) * 0.35) + i * 9) % d.lebar) - d.lebar / 2
      grup.position.set(jalan * arahTerbang, d.y + Math.sin(t * 2 + i) * 0.3 + lompat, d.z)
      grup.rotation.y = arahTerbang > 0 ? -0.35 : Math.PI + 0.35
      const kepak = Math.sin(t * 12 + i) * 0.7
      sayap.forEach((m) => (m.rotation.x = -m.userData.s * kepak))
    }
    objek.push(o)
  }

  // ---- 8. Kupu-kupu yang terbang berkeliling ----
  for (let i = 0; i < 5; i++) {
    const grup = new THREE.Group()
    const badan = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.3, 4, 8), std(W.mata, 0.5))
    grup.add(badan)
    const warnaSayap = [W.pink, W.biru, W.pinkTua, W.lilaTua, W.biruTua][i]
    const matSayap = (bahan[`sayapKupu${i}`] = new THREE.MeshStandardMaterial({
      color: warnaSayap,
      roughness: 0.4,
      side: THREE.DoubleSide,
      emissive: warnaSayap,
      emissiveIntensity: 0.15,
    }))
    const sisiSayap = [-1, 1].map((s) => {
      const sisi = new THREE.Group()
      for (const [x, y, r, sy] of [
        [0.24, 0.1, 0.26, 1.2],
        [0.18, -0.16, 0.18, 1],
      ]) {
        const sayap = new THREE.Mesh(new THREE.CircleGeometry(r, 18), matSayap)
        sayap.scale.y = sy
        sayap.position.set(s * x, y, 0)
        sisi.add(sayap)
      }
      sisi.userData.s = s
      grup.add(sisi)
      return sisi
    })
    let mulai = -1
    const o = { nama: 'kupu', grup, urutan: i, skala: 0.9 }
    o.reaksi = (t) => (mulai = t)
    o.perbarui = (t) => {
      const d = grup.userData
      let lompat = 0
      if (mulai >= 0) {
        const r = (t - mulai) / 0.8
        if (r >= 1) mulai = -1
        else lompat = Math.sin(r * Math.PI) * 1.2
      }
      grup.position.set(
        d.x + Math.sin(t * 0.6 + i * 1.7) * 2.2 * d.k,
        d.y + (Math.sin(t * 1.1 + i * 2.3) * 1.3 + Math.abs(Math.sin(t * 4 + i)) * 0.25 + lompat) * d.k,
        d.z + Math.sin(t * 0.4 + i) * 1.2,
      )
      grup.rotation.set(0.3, Math.sin(t * 0.6 + i) * 0.6, Math.cos(t * 0.6 + i * 1.7) * 0.3)
      const kepak = Math.sin(t * 16 + i) * 0.9 + 0.3
      sisiSayap.forEach((m) => (m.rotation.y = m.userData.s * kepak))
    }
    objek.push(o)
  }

  // ---- kelopak bunga berjatuhan & gelembung yang naik (gerak di seluruh layar) ----
  const jumlahKelopak = hp ? 40 : 80
  const kelopak = new THREE.InstancedMesh(
    bola,
    (bahan.kelopak = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })),
    jumlahKelopak,
  )
  const dataKelopak = Array.from({ length: jumlahKelopak }, (_, i) => ({
    fx: Math.random() * 2 - 1,
    fy: Math.random() * 2 - 1,
    z: -8 + Math.random() * 10,
    jatuh: 0.5 + Math.random() * 0.7,
    fase: Math.random() * 6.3,
    putar: 1 + Math.random() * 2,
    warna: [W.pink, W.pinkTua, W.putih, W.biru, W.pink][i % 5],
  }))
  dataKelopak.forEach((d, i) => kelopak.setColorAt(i, new THREE.Color(d.warna)))
  adegan.add(kelopak)
  const gelembung = []
  const matGelembung = (bahan.gelembung = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    transparent: true,
    opacity: 0.5,
    emissive: 0xeaf4ff,
    emissiveIntensity: 0.35,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.3,
    depthWrite: false,
  }))
  for (let i = 0; i < (hp ? 8 : 14); i++) {
    const m = new THREE.Mesh(bola, matGelembung)
    m.userData = {
      fx: Math.random() * 2 - 1,
      fy: Math.random() * 2 - 1,
      z: -6 + Math.random() * 7,
      naik: 0.5 + Math.random() * 0.8,
      besar: 0.12 + Math.random() * 0.22,
      fase: Math.random() * 6.3,
    }
    adegan.add(m)
    gelembung.push(m)
  }
  const matriks = new THREE.Matrix4()
  const posisiSementara = new THREE.Vector3()
  const putaranSementara = new THREE.Quaternion()
  const sudutSementara = new THREE.Euler()
  const ukuranKelopak = new THREE.Vector3(0.13, 0.035, 0.09)
  // posisi disimpan sebagai pecahan layar (-1..1) agar tetap memenuhi layar berukuran apa pun
  function gerakkanPartikel(t, dt) {
    const tx = lebarDunia / 2
    const ty = tinggiDunia / 2
    dataKelopak.forEach((d, i) => {
      const jauh = (KAMERA_Z - d.z) / KAMERA_Z
      d.fy -= (d.jatuh * dt) / (ty * jauh)
      d.fx += ((0.35 + Math.sin(t * 0.8 + d.fase) * 0.5) * dt) / (tx * jauh)
      if (d.fy < -1.15) {
        d.fy = 1.15
        d.fx = Math.random() * 2 - 1
      }
      if (d.fx > 1.15) d.fx = -1.15
      posisiSementara.set(d.fx * tx * jauh, d.fy * ty * jauh, d.z)
      putaranSementara.setFromEuler(sudutSementara.set(t * d.putar + d.fase, t * d.putar * 0.7, d.fase))
      kelopak.setMatrixAt(i, matriks.compose(posisiSementara, putaranSementara, ukuranKelopak))
    })
    kelopak.instanceMatrix.needsUpdate = true
    for (const m of gelembung) {
      const d = m.userData
      const jauh = (KAMERA_Z - d.z) / KAMERA_Z
      d.fy += (d.naik * dt) / (ty * jauh)
      if (d.fy > 1.2) {
        d.fy = -1.2
        d.fx = Math.random() * 2 - 1
      }
      m.position.set(d.fx * tx * jauh + Math.sin(t * 1.5 + d.fase) * 0.4, d.fy * ty * jauh, d.z)
      m.scale.setScalar(d.besar * (1 + Math.sin(t * 4 + d.fase) * 0.06))
    }
  }

  // ---- awan empuk (tanpa bayangan) ----
  const awan = []
  for (let i = 0; i < 7; i++) {
    const g = new THREE.Group()
    for (const [x, y, r] of [
      [0, 0, 1.05],
      [1.05, -0.15, 0.78],
      [-1.05, -0.18, 0.75],
      [0.45, 0.55, 0.72],
      [-0.4, 0.45, 0.62],
    ]) {
      const b = new THREE.Mesh(bola, std(W.putih, 1))
      b.scale.set(r, r * 0.85, r)
      b.position.set(x, y, 0)
      g.add(b)
    }
    g.userData = {
      fx: ((i * 0.618) % 1) * 2 - 1,
      fy: ((i * 0.383 + 0.2) % 1) * 2 - 1,
      z: -5 - (i % 4) * 2.5,
      kec: 0.4 + (i % 3) * 0.18,
    }
    g.userData.besar = 0.7 + (i % 3) * 0.25
    adegan.add(g)
    awan.push(g)
  }

  // ---- kilauan & cahaya matahari ----
  const kilau = []
  for (const [warna, jumlah] of [
    [0xffffff, 60],
    [0xffb3d6, 40],
    [0xa8d8ff, 40],
  ]) {
    const posisi = new Float32Array(jumlah * 3)
    for (let i = 0; i < jumlah; i++) {
      posisi[i * 3] = (Math.random() - 0.5) * 36
      posisi[i * 3 + 1] = (Math.random() - 0.5) * 22
      posisi[i * 3 + 2] = -3 - Math.random() * 10
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3))
    const mat = new THREE.PointsMaterial({
      color: warna,
      size: 0.4,
      map: teksturBulat,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    bahan[`kilau-${warna}`] = mat
    const p = new THREE.Points(geo, mat)
    adegan.add(p)
    kilau.push(p)
  }
  const sinarMatahari = new THREE.Sprite(
    (bahan.matahari = new THREE.SpriteMaterial({
      map: teksturBulat,
      color: gelap ? 0xc9b8ff : 0xfff3f8,
      transparent: true,
      opacity: gelap ? 0.35 : 0.9,
      fog: false,
      depthWrite: false,
    })),
  )
  sinarMatahari.scale.set(18, 18, 1)
  adegan.add(sinarMatahari)

  // bayangan untuk pulau, rumah, pohon, balon & burung (bagian tembus pandang tidak berbayang)
  for (const o of objek) {
    o.grup.traverse((m) => {
      m.userData.pemilik = o
      if (m.isMesh) {
        const tembusPandang = m.material.transparent
        m.castShadow = !tembusPandang
        m.receiveShadow = !tembusPandang
      }
    })
    adegan.add(o.grup)
  }

  // ---- tata letak menyesuaikan ukuran layar ----
  let lebarDunia = 20
  let tinggiDunia = 15
  function susun() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    kamera.aspect = w / h
    kamera.updateProjectionMatrix()
    tinggiDunia = 2 * KAMERA_Z * Math.tan((kamera.fov * Math.PI) / 360)
    lebarDunia = tinggiDunia * kamera.aspect
    const tegak = kamera.aspect < 1
    const k = tegak ? 0.46 : w >= 1280 ? 1 : w >= 960 ? 0.85 : 0.72
    const tx = lebarDunia / 2
    const ty = tinggiDunia / 2
    // pulau ditaruh di tepi layar agar tidak menutupi kotak materi di tengah;
    // di HP layar sempit, jadi pulau lebih kecil & sebagian "mengintip" dari tepi
    const letak = tegak
      ? {
          tangga: [[-tx + 0.5, ty - 2.2, 0]],
          layang: [[tx - 0.45, ty - 4.6, -1]],
          taman: [[-tx + 0.15, -ty + 1.1, 1]],
          tiang: [[tx - 0.5, -ty + 1.3, 0]],
          pulau: [
            [-tx + 0.2, 0.6, -6],
            [tx - 0.2, -1.4, -7],
            [0.4, ty - 0.6, -10],
          ],
          balon: [
            [0, ty - 2.4, -7],
            [0, 0.5, -11],
            [0, -ty + 4, -9],
          ],
          burung: [
            [0, ty - 5.2, -2],
            [0, -ty + 4.6, -3],
            [0, 1.5, -4],
            [0, ty - 3.2, -6],
            [0, -1.8, -2],
          ],
          kupu: [
            [-tx + 0.8, ty - 6, 1],
            [tx - 0.8, -0.5, 1],
            [-tx + 0.8, -ty + 5, 0],
            [tx - 0.8, ty - 7.5, 0],
            [0, -ty + 2.5, 1],
          ],
        }
      : {
          tangga: [[-tx + 2.6 * k + 0.2, ty - 2.6 * k - 1, 0]],
          layang: [[tx - 2.1 * k - 0.3, ty - 5 * k - 0.7, -1]],
          taman: [[-tx + 2.7 * k + 0.3, -ty + 2.6 * k + 0.1, 1]],
          tiang: [[tx - 2.1 * k - 0.4, -ty + 2.2 * k + 0.2, 0]],
          pulau: [
            [-tx + 1.2, 0.2, -6],
            [tx - 1.1, 0.4, -7],
            [0, ty - 1.8, -10],
          ],
          balon: [
            [0, ty - 2.4, -7],
            [0, 1.5, -11],
            [0, -ty + 3.5, -9],
          ],
          burung: [
            [0, ty - 4.5, -2],
            [0, -ty + 4.2, -3],
            [0, 1.2, -4],
            [0, ty - 3.4, -6],
            [0, -1.5, -2],
          ],
          kupu: [
            [-tx + 4.5 * k, 0.5, 1],
            [tx - 4.5 * k, -1, 1],
            [-tx + 6 * k, -ty + 4, 0],
            [tx - 6 * k, ty - 4.5, 0],
            [-tx + 2, ty - 6.5, 2],
          ],
        }
    for (const o of objek) {
      const [x, y, z] = letak[o.nama][o.urutan ?? 0]
      const jauh = (KAMERA_Z - z) / KAMERA_Z // makin jauh, layar "makin lebar"
      const kk = k * (o.skala ?? 1)
      o.grup.userData = { ...o.grup.userData, x: x * jauh, y: y * jauh, z, k: kk, lebar: (tx * jauh + 4) * 2 }
      o.grup.position.set(x * jauh, y * jauh, z)
      o.grup.scale.setScalar(kk)
    }
    for (const g of awan) {
      const { fx, fy, z } = g.userData
      const jauh = (KAMERA_Z - z) / KAMERA_Z
      g.userData.lebar = (tx * jauh + 4) * 2
      g.userData.x0 = fx * tx * jauh
      g.scale.setScalar(g.userData.besar * (tegak ? 0.5 : 1))
      g.position.set(g.userData.x0, fy * ty * jauh, z)
    }
    sinarMatahari.position.set(tx * 0.55 * 2.2, ty * 0.75 * 2.2, -30)
    const cakupan = Math.max(tx, ty) * 1.3 + 3
    Object.assign(matahari.shadow.camera, { left: -cakupan, right: cakupan, top: cakupan, bottom: -cakupan, near: 1, far: 70 })
    matahari.shadow.camera.updateProjectionMatrix()
  }
  susun()
  window.addEventListener('resize', susun)

  // ---- sudut pandang ikut bergerak (kesan 3D): tetikus & guliran halaman ----
  const arahPandang = { x: 0, y: 0 }
  const tetikus = (e) => {
    arahPandang.x = (e.clientX / window.innerWidth) * 2 - 1
    arahPandang.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', tetikus, { passive: true })

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
    const atas = new THREE.Vector3(0, o.nama === 'burung' ? 0.6 : 2.4, 0)
    o.grup.localToWorld(atas)
    atas.project(kamera)
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

  // ---- putaran animasi hemat (±30 fps) ----
  const gerakDikurangi = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const animasiMati = () => document.documentElement.classList.contains('tanpa-animasi') || gerakDikurangi?.matches
  let bingkai = 0
  let terakhir = performance.now()
  let waktuBerhenti = 0
  let kedip = 3
  function perbaruiSemua(dt) {
    waktu += dt
    for (const o of objek) o.perbarui(waktu, dt)
    kedip -= dt
    const tutup = kedip < 0.12 && kedip > 0
    for (const m of semuaMata) m.scale.y = tutup ? 0.12 : 1
    if (kedip <= 0) kedip = 2.5 + Math.random() * 2.5
    for (const g of awan) {
      const d = g.userData
      d.geser = ((d.geser ?? 0) + d.kec * dt) % d.lebar
      let x = d.x0 + d.geser
      if (x > d.lebar / 2) x -= d.lebar
      g.position.x = x
    }
    kilau.forEach((p, i) => (p.material.opacity = 0.5 + Math.sin(waktu * 3.5 + i * 2) * 0.45))
    gerakkanPartikel(waktu, dt)
    // kamera bergeser pelan mengikuti tetikus & guliran: pulau dekat & jauh bergerak berbeda (paralaks 3D)
    const gulir = Math.min(window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1), 1)
    const tujuanX = arahPandang.x * 1.4 + Math.sin(waktu * 0.15) * 0.6
    const tujuanY = 2 - arahPandang.y * 0.9 - (gulir - 0.5) * 2.4
    kamera.position.x += (tujuanX - kamera.position.x) * Math.min(dt * 2, 1)
    kamera.position.y += (tujuanY - kamera.position.y) * Math.min(dt * 2, 1)
    kamera.lookAt(0, 0, -4)
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
      if (document.hidden) return
      // saat animasi mati, reaksi klik tetap digerakkan ±1,5 detik lalu berhenti
      if (animasiMati() && !(sekali && sekarang < waktuBerhenti)) return
      bingkai = requestAnimationFrame(langkah)
    }
    waktuBerhenti = sekali ? performance.now() + 1500 : 0
    terakhir = performance.now() - 40
    bingkai = requestAnimationFrame(langkah)
  }
  perbaruiSemua(0.016)
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
    window.removeEventListener('pointermove', tetikus)
    document.removeEventListener('visibilitychange', ubahTampil)
    kanvas.removeEventListener('click', diklik)
    kanvas.removeEventListener('pointermove', melayang)
    pengamat.disconnect()
    adegan.traverse((m) => m.geometry?.dispose())
    Object.values(bahan).forEach((b) => b.dispose())
    teksturBulat.dispose()
    teksturAir.dispose()
    lingkungan.dispose()
    renderer.dispose()
  }
}
