"""Membuat materi ajar Bab Teorema Pythagoras, subbab "Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah"
(HTML siap cetak/PDF).

Isi disusun dari temuan wawancara kebutuhan (informan S01, data simulasi):
IL1 sisi miring tertukar saat segitiga diputar, IL2 banyak unsur sekaligus, IL3 prasyarat kuadrat & akar,
EL1/EL5 soal cerita panjang, EL2 teks-gambar berjauhan, GL1-GL5 menggambar, cek kewajaran,
petunjuk bertahap, menjelaskan, dan transfer ke konteks baru.

Soal sengaja BERBEDA dari butir pre-test/post-test (src/tes.js) agar tidak bias penelitian.

Pemakaian:  python scripts/buat_materi.py   ->  docs/materi/Materi-Teorema-Pythagoras.html
"""
import math
import os

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(AKAR, "docs", "materi")

BIRU = "#2563eb"      # diketahui
PINK = "#db2777"      # dicari
NETRAL = "#94a3b8"
GARIS = "#1e2a4d"


# ---------------------------------------------------------------------------
# Gambar segitiga siku-siku (SVG) dengan label tepat di samping sisinya (EL2)
# ---------------------------------------------------------------------------
def segitiga(alas, tinggi, label_a, label_b, label_c, warna=("n", "n", "n"), putar=0, cermin=False,
             lebar=230, tinggi_kotak=170, judul=""):
    """Segitiga siku-siku: sudut siku di titik O, alas a mendatar, tinggi b tegak, sisi miring c.
    warna: tuple untuk (a, b, c) berisi 'k' (diketahui), 'd' (dicari), atau 'n' (netral)."""
    pts = [(0.0, 0.0), (float(alas), 0.0), (0.0, float(tinggi))]  # O, ujung alas, ujung tinggi
    if cermin:
        pts = [(-x, y) for x, y in pts]
    rad = math.radians(putar)
    pts = [(x * math.cos(rad) - y * math.sin(rad), x * math.sin(rad) + y * math.cos(rad)) for x, y in pts]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    tepi = 52 if lebar >= 200 else 26
    skala = min((lebar - 2 * tepi) / (max(xs) - min(xs) or 1), (tinggi_kotak - 2 * tepi) / (max(ys) - min(ys) or 1))
    def ke_layar(p):
        return (tepi + (p[0] - min(xs)) * skala, tinggi_kotak - tepi - (p[1] - min(ys)) * skala)
    O, A, B = [ke_layar(p) for p in pts]
    pusat = ((O[0] + A[0] + B[0]) / 3, (O[1] + A[1] + B[1]) / 3)
    peta = {"k": BIRU, "d": PINK, "n": NETRAL}

    def sisi(p, q, kode, teks):
        w = peta[kode]
        tebal = 4 if kode != "n" else 2.5
        mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
        # arah keluar = tegak lurus sisi, menjauhi titik tengah segitiga
        ex, ey = q[0] - p[0], q[1] - p[1]
        nx, ny = -ey, ex
        n = math.hypot(nx, ny) or 1
        nx, ny = nx / n, ny / n
        if (mx - pusat[0]) * nx + (my - pusat[1]) * ny < 0:
            nx, ny = -nx, -ny
        lx, ly = mx + nx * 10, my + ny * 10
        # teks ditaruh di sisi luar garis: rata kiri/kanan sesuai arah keluar
        jangkar = "start" if nx > 0.35 else "end" if nx < -0.35 else "middle"
        dy_teks = 13 if ny > 0.35 else -4 if ny < -0.35 else 4
        return (f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" stroke="{w}" stroke-width="{tebal}" stroke-linecap="round"/>'
                f'<text x="{lx:.1f}" y="{ly + dy_teks:.1f}" fill="{w}" font-size="13" font-weight="700" text-anchor="{jangkar}">{teks}</text>')

    # tanda sudut siku-siku di O
    def satuan(p, q):
        d = math.hypot(q[0] - p[0], q[1] - p[1]) or 1
        return ((q[0] - p[0]) / d, (q[1] - p[1]) / d)
    u1, u2, s = satuan(O, A), satuan(O, B), 12
    kotak = [O, (O[0] + u1[0] * s, O[1] + u1[1] * s), (O[0] + (u1[0] + u2[0]) * s, O[1] + (u1[1] + u2[1]) * s), (O[0] + u2[0] * s, O[1] + u2[1] * s)]
    siku = '<polyline points="' + " ".join(f"{x:.1f},{y:.1f}" for x, y in kotak[1:]) + f'" fill="none" stroke="{GARIS}" stroke-width="1.8"/>'
    isi = (f'<polygon points="{O[0]:.1f},{O[1]:.1f} {A[0]:.1f},{A[1]:.1f} {B[0]:.1f},{B[1]:.1f}" fill="#f1f7ff"/>'
           + sisi(O, A, warna[0], label_a) + sisi(O, B, warna[1], label_b) + sisi(A, B, warna[2], label_c) + siku)
    jud = f'<text x="{lebar / 2}" y="14" font-size="12" fill="#475577" text-anchor="middle">{judul}</text>' if judul else ""
    return f'<svg viewBox="0 0 {lebar} {tinggi_kotak}" width="{lebar}" height="{tinggi_kotak}" class="gbr">{jud}{isi}</svg>'


def tangga_dinding(kaki, tinggi, panjang, dicari):
    """Ilustrasi tangga bersandar di dinding dengan label menempel pada bendanya (EL2)."""
    w = {"kaki": BIRU, "tinggi": BIRU, "panjang": BIRU}
    w[dicari] = PINK
    return f'''<svg viewBox="0 0 330 205" width="330" height="205" class="gbr">
  <rect x="200" y="10" width="34" height="160" fill="#fde7c3" stroke="{GARIS}" stroke-width="2"/>
  <path d="M200 30 h34 M200 60 h34 M200 90 h34 M200 120 h34 M200 150 h34" stroke="#e8c79a" stroke-width="2"/>
  <line x1="10" y1="170" x2="250" y2="170" stroke="{GARIS}" stroke-width="2.5"/>
  <line x1="70" y1="168" x2="198" y2="40" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>
  <g stroke="#b45309" stroke-width="3">
    <line x1="88" y1="150" x2="98" y2="160"/><line x1="112" y1="126" x2="122" y2="136"/>
    <line x1="136" y1="102" x2="146" y2="112"/><line x1="160" y1="78" x2="170" y2="88"/></g>
  <line x1="70" y1="178" x2="198" y2="178" stroke="{w["kaki"]}" stroke-width="3"/>
  <text x="134" y="198" font-size="12" font-weight="700" fill="{w["kaki"]}" text-anchor="middle">kaki tangga ke dinding = {kaki}</text>
  <line x1="240" y1="40" x2="240" y2="168" stroke="{w["tinggi"]}" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="246" y="108" font-size="12" font-weight="700" fill="{w["tinggi"]}">tinggi = {tinggi}</text>
  <text x="112" y="86" font-size="12" font-weight="700" fill="{w["panjang"]}" text-anchor="middle" transform="rotate(-45 112 86)">panjang tangga = {panjang}</text>
  <polyline points="188,158 178,158 178,168" fill="none" stroke="{GARIS}" stroke-width="1.8"/>
</svg>'''


def bukti_luas():
    """Persegi pada tiap sisi segitiga 3-4-5: 9 + 16 = 25."""
    return f'''<svg viewBox="0 0 250 240" width="250" height="240" class="gbr">
  <rect x="60" y="120" width="60" height="45" fill="none"/>
  <polygon points="60,165 120,165 60,120" fill="#f1f7ff" stroke="{GARIS}" stroke-width="2"/>
  <rect x="60" y="165" width="60" height="60" fill="#dbeafe" stroke="{BIRU}" stroke-width="2"/>
  <text x="90" y="200" font-size="13" font-weight="700" fill="{BIRU}" text-anchor="middle">4² = 16</text>
  <rect x="15" y="120" width="45" height="45" fill="#dbeafe" stroke="{BIRU}" stroke-width="2"/>
  <text x="37" y="147" font-size="12" font-weight="700" fill="{BIRU}" text-anchor="middle">3² = 9</text>
  <polygon points="60,120 120,165 165,105 105,60" fill="#fce7f3" stroke="{PINK}" stroke-width="2"/>
  <text x="112" y="116" font-size="13" font-weight="700" fill="{PINK}" text-anchor="middle">5² = 25</text>
  <polyline points="60,155 70,155 70,165" fill="none" stroke="{GARIS}" stroke-width="1.6"/>
  <text x="125" y="20" font-size="12" fill="#475577" text-anchor="middle">9 + 16 = 25</text>
</svg>'''


# ---------------------------------------------------------------------------
# Isi materi
# ---------------------------------------------------------------------------
KUADRAT = "".join(f"<td>{n}² = {n * n}</td>" + ("</tr><tr>" if n % 5 == 0 and n < 20 else "") for n in range(1, 21))

ORIENTASI = "".join(
    f'<div class="sel">{segitiga(4, 3, "", "", "", ("n", "n", "n"), putar=p, cermin=c, lebar=150, tinggi_kotak=130)}'
    f'<p>Gambar {i + 1}: sisi miring = ......</p></div>'
    for i, (p, c) in enumerate([(0, False), (90, False), (200, True), (300, False)])
)

KUNCI = [
    ("1", "c² = 15² + 20² = 225 + 400 = 625, c = 25"),
    ("2", "b² = 26² − 10² = 676 − 100 = 576, b = 24"),
    ("3", "c² = 21² + 28² = 441 + 784 = 1.225, c = 35"),
    ("4", "a² = 29² − 21² = 841 − 441 = 400, a = 20"),
    ("5", "Sisi miring = sisi di depan sudut siku-siku. c² = 16² + 30² = 256 + 900 = 1.156, c = 34"),
    ("6", "b² = 50² − 14² = 2.500 − 196 = 2.304, b = 48"),
    ("7", "Kawat = sisi miring 26 m, tinggi tiang 24 m. Jarak² = 26² − 24² = 676 − 576 = 100, jarak = 10 m"),
    ("8", "Diagonal² = 21² + 28² = 1.225, diagonal = 35 cm"),
    ("9", "Jarak² = 40² + 9² = 1.600 + 81 = 1.681, jarak = 41 km"),
    ("10", "Diagonal² = 18² + 24² = 324 + 576 = 900, diagonal = 30 m (lebih pendek dari 18 + 24 = 42 m)"),
]

GAYA = """
@page { size: A4; margin: 15mm 15mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 11.5pt; line-height: 1.5; margin: 0; }
h1 { font-size: 24pt; margin: 0 0 6px; }
h2 { font-size: 16pt; margin: 0 0 8px; color: #1d4ed8; border-bottom: 3px solid #bfdbfe; padding-bottom: 4px; }
h3 { font-size: 12.5pt; margin: 14px 0 6px; }
p { margin: 6px 0; }
.bab { break-before: page; }
.sampul { text-align: center; padding-top: 30mm; }
.sampul .pita { display: inline-block; padding: 4px 14px; border-radius: 999px; background: #e0f2fe; font-weight: 700; color: #0369a1; }
.sampul .sub { font-size: 13pt; color: #475577; }
.sampul table { width: auto; margin: 22px auto 0; border-collapse: collapse; text-align: left; }
.sampul td { padding: 3px 12px; border: none; }
.kotak { border-radius: 12px; padding: 10px 14px; margin: 10px 0; break-inside: avoid; }
.tujuan { background: #eff6ff; border: 1.5px solid #bfdbfe; }
.ingat { background: #fff7ed; border: 1.5px solid #fed7aa; }
.penting { background: #fdf2f8; border: 1.5px solid #fbcfe8; }
.coba { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
.refleksi { background: #faf5ff; border: 1.5px solid #e9d5ff; }
.mengapa { background: #f8fafc; border: 1.5px dashed #94a3b8; font-size: 10pt; color: #475577; }
.label { display: inline-block; font-weight: 800; font-size: 9.5pt; padding: 1px 8px; border-radius: 999px; margin-bottom: 4px; }
.tujuan .label { background: #dbeafe; color: #1d4ed8; }
.ingat .label { background: #ffedd5; color: #c2410c; }
.penting .label { background: #fce7f3; color: #be185d; }
.coba .label { background: #dcfce7; color: #15803d; }
.refleksi .label { background: #f3e8ff; color: #7e22ce; }
.mengapa .label { background: #e2e8f0; color: #334155; }
.dua { display: flex; gap: 14px; align-items: center; break-inside: avoid; }
h3 { break-after: avoid; }
.dua > div { flex: 1; }
.gbr { display: block; margin: 0 auto; }
.rumus { font-size: 15pt; font-weight: 800; text-align: center; margin: 8px 0; letter-spacing: .5px; }
table { border-collapse: collapse; width: 100%; font-size: 10.5pt; }
th, td { border: 1px solid #cbd5e1; padding: 5px 7px; vertical-align: top; }
th { background: #eff6ff; text-align: left; }
.kuadrat td { text-align: center; font-weight: 600; }
.langkah { counter-reset: no; list-style: none; padding: 0; margin: 6px 0; }
.langkah li { counter-increment: no; position: relative; padding: 6px 8px 6px 40px; margin: 5px 0; border-radius: 10px; background: #fff; border: 1px solid #e2e8f0; }
.langkah li::before { content: counter(no); position: absolute; left: 8px; top: 6px; width: 24px; height: 24px; border-radius: 50%; background: #2563eb; color: #fff; font-weight: 800; text-align: center; line-height: 24px; font-size: 10.5pt; }
.dd td:first-child { width: 28%; font-weight: 700; }
.biru { color: #2563eb; font-weight: 700; }
.pink { color: #db2777; font-weight: 700; }
.isian { display: inline-block; min-width: 110px; border-bottom: 1.5px solid #1d2a4d; }
.garis-tulis { height: 46px; border: 1px dashed #b7c3dc; border-radius: 8px; margin: 4px 0 8px; }
.kisi { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.kisi .sel { border: 1px solid #e2e8f0; border-radius: 10px; padding: 4px; text-align: center; font-size: 9.5pt; }
.soal { break-inside: avoid; margin: 8px 0; }
.kecil { font-size: 9.5pt; color: #64748b; }
.legenda span { display: inline-block; margin-right: 14px; font-weight: 700; }
"""


def halaman():
    return f"""<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah</title><style>{GAYA}</style></head><body>

<section class="sampul">
  <span class="pita">Matematika SMP · Kelas VIII · Bab Teorema Pythagoras</span>
  <h1>Penerapan Teorema Pythagoras<br>dalam Menyelesaikan Masalah</h1>
  <p class="sub">Materi ajar untuk membangun literasi matematis,<br>disusun berdasarkan hasil wawancara kebutuhan siswa</p>
  {segitiga(4, 3, "a = 4", "b = 3", "c = ?", ("k", "k", "d"), lebar=260, tinggi_kotak=190)}
  <p class="legenda"><span class="biru">■ biru = diketahui</span><span class="pink">■ merah muda = dicari</span></p>
  <table>
    <tr><td>Bab</td><td>: Teorema Pythagoras</td></tr>
    <tr><td>Subbab</td><td>: Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah</td></tr>
    <tr><td>Penyusun</td><td>: Azkiah Safira (2225250013) · Kelas 3F</td></tr>
    <tr><td>Dosen Pengampu</td><td>: Dr. Aan Hendrayana, S.Si., M.Pd.</td></tr>
    <tr><td>Mata kuliah</td><td>: Algoritma Pemrograman (Project UAS)</td></tr>
    <tr><td>Pendukung</td><td>: Aplikasi Android "Penerapan Teorema Pythagoras"</td></tr>
  </table>
</section>

<section class="bab">
  <h2>Petunjuk Belajar &amp; Tujuan</h2>
  <div class="kotak tujuan"><span class="label">TUJUAN PEMBELAJARAN</span>
    <p>Setelah mempelajari materi ini, kamu dapat:</p>
    <ol>
      <li>menghitung kuadrat dan akar kuadrat bilangan (prasyarat);</li>
      <li>menunjukkan <b>sisi miring</b> segitiga siku-siku walaupun gambarnya diputar;</li>
      <li>menuliskan teorema Pythagoras dan memilih rumus yang tepat;</li>
      <li>mengubah soal cerita menjadi <b>Diketahui – Ditanya – gambar</b> (merumuskan);</li>
      <li>menghitung panjang sisi yang belum diketahui (menerapkan);</li>
      <li>memeriksa apakah jawaban <b>masuk akal</b> dalam situasi nyata (menafsirkan).</li>
    </ol>
    <p class="kecil">Nomor 4–6 adalah tiga proses <b>literasi matematis</b>: merumuskan, menerapkan, dan menafsirkan.</p>
  </div>
  <h3>Cara memakai materi ini</h3>
  <ul class="langkah">
    <li>Belajar <b>berurutan</b>: Bagian 1 → 2 → 3 → 4 → 5. Jangan melompat.</li>
    <li>Setiap bagian hanya berisi <b>satu ide utama</b>. Baca pelan-pelan, lalu kerjakan kotak <b>Ayo Coba</b>.</li>
    <li>Perhatikan warna: <span class="biru">biru = yang diketahui</span>, <span class="pink">merah muda = yang dicari</span>.</li>
    <li>Kalau buntu, pakai <b>Strategi 5 Langkah</b> (Bagian 4) dari langkah pertama.</li>
    <li>Gunakan aplikasi Android untuk mencoba gambar 3D tangga–dinding dan latihan tambahan.</li>
  </ul>
  <div class="kotak mengapa"><span class="label">MENGAPA DISUSUN BEGINI?</span>
    <p>Wawancara menunjukkan siswa kesulitan menentukan sisi miring (IL1), memproses banyak informasi sekaligus (IL2),
    belum kuat kuadrat/akar (IL3), bingung dengan soal cerita panjang (EL1, EL5), dan bolak-balik antara teks dan gambar (EL2).
    Siswa terbantu oleh gambar, langkah bertahap, dan contoh (GL1–GL3). Hubungan lengkapnya ada pada lampiran.</p>
  </div>
</section>

<section class="bab">
  <h2>Bagian 1 · Persiapan: Kuadrat dan Akar Kuadrat</h2>
  <div class="kotak ingat"><span class="label">INGAT</span>
    <p><b>Kuadrat</b> berarti bilangan dikalikan dengan dirinya sendiri: <b>5² = 5 × 5 = 25</b>.</p>
    <p><b>Akar kuadrat</b> adalah kebalikannya: bilangan berapa yang dikuadratkan hasilnya 25? <b>√25 = 5</b>, karena 5 × 5 = 25.</p>
  </div>
  <h3>Tabel kuadrat 1–20 (pegangan selama belajar)</h3>
  <table class="kuadrat"><tr>{KUADRAT}</tr></table>
  <p class="kecil">Cara memakai tabel untuk akar: √196 = ? → cari 196 di tabel → 14² = 196, jadi √196 = 14.</p>
  <div class="kotak coba"><span class="label">AYO COBA 1</span>
    <p>a) 7² = <span class="isian"></span> &nbsp; b) 13² = <span class="isian"></span> &nbsp; c) √64 = <span class="isian"></span> &nbsp; d) √289 = <span class="isian"></span></p>
    <p class="kecil">Kalau masih ragu, pelajari ulang bagian ini sebelum lanjut. Teorema Pythagoras selalu memakai kuadrat di awal dan akar di akhir.</p>
  </div>
</section>

<section class="bab">
  <h2>Bagian 2 · Mengenal Segitiga Siku-siku dan Sisi Miring</h2>
  <div class="dua">
    <div>
      <p>Segitiga siku-siku punya satu <b>sudut siku-siku (90°)</b>, ditandai kotak kecil ⌐.</p>
      <p>Dua sisi yang <b>mengapit</b> sudut siku-siku disebut <b>sisi siku-siku</b> (kita beri nama <b>a</b> dan <b>b</b>).</p>
      <p>Sisi yang <b>berhadapan</b> (di depan) sudut siku-siku disebut <b>sisi miring</b> atau hipotenusa (<b>c</b>).</p>
    </div>
    <div>{segitiga(4, 3, "a", "b", "c (sisi miring)", ("n", "n", "d"), lebar=300, tinggi_kotak=210)}</div>
  </div>
  <div class="kotak penting"><span class="label">AWAS KELIRU!</span>
    <p>Sisi miring <b>bukan</b> selalu sisi paling bawah atau sisi yang tampak "miring". Caranya:
    <b>temukan dulu kotak sudut siku-siku, lalu lihat sisi di depannya</b>. Sisi miring juga selalu <b>sisi terpanjang</b>.</p>
  </div>
  <h3>Segitiga yang sama, posisi berbeda</h3>
  <p>Segitiga di bawah ini <b>sama</b>, hanya diputar atau dibalik. Sisi miringnya tetap sisi di depan sudut siku-siku.</p>
  <div class="kotak coba"><span class="label">AYO COBA 2 · tebalkan sisi miring dengan pensil warna</span>
    <div class="kisi">{ORIENTASI}</div>
  </div>
  <div class="kotak refleksi"><span class="label">REFLEKSI</span>
    <p>Jelaskan dengan kata-katamu sendiri kepada teman: <i>"Bagaimana cara menemukan sisi miring kalau segitiganya diputar?"</i></p>
    <div class="garis-tulis"></div>
  </div>
</section>

<section class="bab">
  <h2>Bagian 3 · Teorema Pythagoras</h2>
  <div class="dua">
    <div>{bukti_luas()}</div>
    <div>
      <p>Buat persegi pada setiap sisi segitiga siku-siku 3–4–5:</p>
      <p>Luas persegi sisi 3 = <b>9</b>, sisi 4 = <b>16</b>, sisi miring 5 = <b>25</b>.</p>
      <p>Ternyata <b>9 + 16 = 25</b>. Luas dua persegi pada sisi siku-siku <b>sama dengan</b> luas persegi pada sisi miring.</p>
      <p>Pola ini berlaku untuk <b>semua</b> segitiga siku-siku.</p>
    </div>
  </div>
  <div class="kotak penting"><span class="label">TEOREMA PYTHAGORAS</span>
    <p class="rumus">c² = a² + b²</p>
    <p style="text-align:center">kuadrat sisi miring = jumlah kuadrat kedua sisi siku-siku</p>
  </div>
  <h3>Pilih rumus sesuai yang dicari</h3>
  <table>
    <tr><th>Yang dicari</th><th>Rumus</th><th>Cara ingat</th></tr>
    <tr><td><span class="pink">Sisi miring c</span></td><td><b>c² = a² + b²</b> → c = √(a² + b²)</td><td>Mencari sisi <b>terpanjang</b> → <b>tambah</b></td></tr>
    <tr><td><span class="pink">Sisi siku-siku a</span></td><td><b>a² = c² − b²</b> → a = √(c² − b²)</td><td>Mencari sisi <b>lebih pendek</b> → <b>kurang</b></td></tr>
    <tr><td><span class="pink">Sisi siku-siku b</span></td><td><b>b² = c² − a²</b> → b = √(c² − a²)</td><td>Sisi miring <b>selalu</b> dikurangi, bukan mengurangi</td></tr>
  </table>
  <div class="kotak coba"><span class="label">AYO COBA 3</span>
    <p>Segitiga siku-siku dengan sisi siku-siku 15 cm dan 20 cm. Isi titik-titiknya:</p>
    <p>c² = ...² + ...² = ... + ... = ... &nbsp;→&nbsp; c = √... = ... cm</p>
  </div>
</section>

<section class="bab">
  <h2>Bagian 4 · Strategi 5 Langkah Soal Cerita</h2>
  <p>Soal cerita sering panjang. Jangan langsung menghitung. Ikuti lima langkah ini <b>satu per satu</b>:</p>
  <ul class="langkah">
    <li><b>Baca &amp; tandai.</b> Garis bawahi angka penting dan kalimat pertanyaannya.</li>
    <li><b>Tulis Diketahui – Ditanya.</b> Pindahkan angka ke tabel, lengkap dengan satuannya.</li>
    <li><b>Gambar segitiga siku-siku.</b> Tandai sudut sikunya, tulis angka <b>tepat di samping sisinya</b>, warnai sisi yang dicari.</li>
    <li><b>Pilih rumus &amp; hitung.</b> Yang dicari sisi miring → tambah. Yang dicari sisi siku-siku → kurang.</li>
    <li><b>Cek kewajaran.</b> Sisi miring harus paling panjang. Apakah jawabannya masuk akal untuk situasi itu?</li>
  </ul>

  <h3>Contoh 1 · Mencari sisi miring (panjang tangga)</h3>
  <p>Sebuah tangga disandarkan pada dinding. Jarak kaki tangga ke dinding <b>3 m</b>, dan ujung atas tangga menyentuh dinding pada ketinggian <b>4 m</b>. Berapa panjang tangga?</p>
  <div class="dua">
    <div>
      <table class="dd">
        <tr><td>Diketahui</td><td><span class="biru">kaki tangga ke dinding = 3 m</span><br><span class="biru">tinggi dinding = 4 m</span></td></tr>
        <tr><td>Ditanya</td><td><span class="pink">panjang tangga = ?</span> → tangga berada di depan sudut siku-siku, jadi <b>sisi miring</b></td></tr>
        <tr><td>Rumus</td><td>c² = a² + b²</td></tr>
        <tr><td>Hitung</td><td>c² = 3² + 4² = 9 + 16 = 25<br>c = √25 = <b>5 m</b></td></tr>
        <tr><td>Cek</td><td>5 m lebih panjang dari 3 m dan 4 m ✓ masuk akal</td></tr>
      </table>
    </div>
    <div>{tangga_dinding("3 m", "4 m", "?", "panjang")}</div>
  </div>

  <h3 style="break-before: page">Contoh 2 · Mencari sisi siku-siku (tinggi layang-layang)</h3>
  <p>Benang layang-layang yang terulur panjangnya <b>29 m</b>. Jarak mendatar dari Dimas ke titik tepat di bawah layang-layang <b>20 m</b>. Berapa tinggi layang-layang?</p>
  <div class="dua">
    <div>
      <table class="dd">
        <tr><td>Diketahui</td><td><span class="biru">benang = 29 m (sisi miring)</span><br><span class="biru">jarak mendatar = 20 m</span></td></tr>
        <tr><td>Ditanya</td><td><span class="pink">tinggi = ?</span> → sisi siku-siku</td></tr>
        <tr><td>Rumus</td><td>b² = c² − a²</td></tr>
        <tr><td>Hitung</td><td>b² = 29² − 20² = 841 − 400 = 441<br>b = √441 = <b>21 m</b></td></tr>
        <tr><td>Cek</td><td>21 m lebih pendek dari benang 29 m ✓</td></tr>
      </table>
    </div>
    <div>{segitiga(20, 21, "jarak 20 m", "tinggi ?", "benang 29 m", ("k", "d", "k"), lebar=290, tinggi_kotak=240)}</div>
  </div>
</section>

<section class="bab">
  <h2>Bagian 5 · Penerapan dalam Kehidupan Sehari-hari</h2>
  <h3>Contoh 3 · Jarak terpendek</h3>
  <p>Andi berjalan <b>15 m</b> ke timur, lalu <b>20 m</b> ke utara. Berapa jarak terpendek Andi dari titik awal?</p>
  <div class="dua">
    <div>
      <p>Arah timur dan utara membentuk <b>sudut siku-siku</b>. Jarak terpendek adalah garis lurus dari titik awal ke titik akhir, yaitu <b>sisi miring</b>.</p>
      <p>c² = 15² + 20² = 225 + 400 = 625 → c = √625 = <b>25 m</b>.</p>
      <p><b>Menafsirkan:</b> berjalan memutar 15 + 20 = 35 m, sedangkan jalan lurus hanya 25 m. Lebih hemat 10 m.</p>
    </div>
    <div>{segitiga(15, 20, "15 m (timur)", "20 m (utara)", "jarak ?", ("k", "k", "d"), lebar=300, tinggi_kotak=240)}</div>
  </div>
  <h3>Tripel Pythagoras</h3>
  <p>Tiga bilangan bulat yang memenuhi c² = a² + b² disebut <b>tripel Pythagoras</b>. Contoh: <b>3, 4, 5</b> · <b>6, 8, 10</b> · <b>20, 21, 29</b> · <b>9, 40, 41</b>.
  Kelipatannya juga tripel, misalnya 3–4–5 dikali 5 menjadi 15–20–25.</p>
  <div class="kotak penting"><span class="label">POLA YANG SAMA, CERITA BERBEDA</span>
    <p>Tangga–dinding, benang layang-layang, diagonal layar, jarak berjalan, kawat penopang tiang, diagonal taman: semuanya
    adalah <b>segitiga siku-siku</b>. Cari dulu sudut sikunya, tentukan sisi miring, lalu gunakan rumus yang sama.</p>
  </div>
  <div class="kotak refleksi"><span class="label">REFLEKSI</span>
    <p>1) Mengapa saat mencari sisi siku-siku kita memakai <b>pengurangan</b>, bukan penjumlahan?</p>
    <div class="garis-tulis"></div>
    <p>2) Bagaimana kamu tahu jawabanmu masuk akal tanpa menghitung ulang?</p>
    <div class="garis-tulis"></div>
  </div>
</section>

<section class="bab">
  <h2>Latihan Berjenjang</h2>
  <p class="kecil">Kerjakan berurutan. Tingkat 1 hanya angka, tingkat 2 dengan gambar, tingkat 3 soal cerita.</p>
  <h3>Tingkat 1 · Angka langsung</h3>
  <div class="soal">1. a = 15, b = 20, c = ?</div>
  <div class="soal">2. c = 26, a = 10, b = ?</div>
  <div class="soal">3. a = 21, b = 28, c = ?</div>
  <div class="soal">4. c = 29, b = 21, a = ?</div>
  <h3>Tingkat 2 · Dengan gambar (perhatikan posisinya!)</h3>
  <div class="dua">
    <div class="soal">5. Tentukan dulu sisi miringnya, lalu hitung panjangnya.
      {segitiga(16, 30, "16 cm", "30 cm", "?", ("k", "k", "d"), putar=150, lebar=300, tinggi_kotak=250)}</div>
    <div class="soal">6. Hitung panjang sisi yang ditandai "?".
      {segitiga(14, 48, "14 cm", "?", "50 cm", ("k", "d", "k"), putar=250, cermin=True, lebar=300, tinggi_kotak=250)}</div>
  </div>
  <h3>Tingkat 3 · Soal cerita (pakai Strategi 5 Langkah)</h3>
  <div class="soal">7. Sebuah tiang bendera setinggi 24 m ditopang kawat dari puncak tiang ke tanah. Panjang kawat 26 m. Berapa jarak ujung kawat di tanah ke kaki tiang?</div>
  <div class="soal">8. Layar laptop berukuran lebar 28 cm dan tinggi 21 cm. Berapa panjang diagonal layarnya?</div>
  <div class="soal">9. Sebuah perahu berlayar 40 km ke utara, lalu 9 km ke barat. Berapa jarak perahu dari titik berangkat?</div>
  <div class="soal">10. Taman berbentuk persegi panjang 24 m × 18 m. Rina berjalan memotong diagonal taman. Berapa panjang jalannya, dan berapa meter lebih hemat dibanding berjalan menyusuri tepi?</div>
</section>

<section class="bab">
  <h2>Rangkuman &amp; Kunci Jawaban</h2>
  <div class="kotak penting"><span class="label">RANGKUMAN</span>
    <ul>
      <li>Sisi miring = sisi <b>di depan sudut siku-siku</b> = sisi <b>terpanjang</b>.</li>
      <li><b>c² = a² + b²</b>. Mencari sisi miring → tambah; mencari sisi siku-siku → kurang.</li>
      <li>Soal cerita: tandai → Diketahui–Ditanya → gambar → rumus &amp; hitung → cek kewajaran.</li>
    </ul>
  </div>
  <h3>Kunci Ayo Coba</h3>
  <p>Ayo Coba 1: a) 49 b) 169 c) 8 d) 17 · Ayo Coba 2: sisi di depan kotak siku-siku pada tiap gambar · Ayo Coba 3: c² = 225 + 400 = 625, c = 25 cm</p>
  <h3>Kunci Latihan Berjenjang</h3>
  <table><tr><th style="width:8%">No</th><th>Pembahasan singkat</th></tr>
  {"".join(f"<tr><td>{n}</td><td>{t}</td></tr>" for n, t in KUNCI)}
  </table>
</section>

<section class="bab">
  <h2>Lampiran · Keterkaitan Materi dengan Hasil Wawancara</h2>
  <table>
    <tr><th>Kode</th><th>Temuan wawancara (S01, simulasi)</th><th>Cara materi menjawabnya</th></tr>
    <tr><td>IL1</td><td>Tertukar menentukan sisi miring, apalagi bila segitiga diputar</td><td>Bagian 2: aturan "di depan sudut siku-siku", 4 orientasi segitiga, latihan tingkat 2 dengan gambar diputar</td></tr>
    <tr><td>IL2</td><td>Banyak unsur dipikirkan sekaligus; lupa sisi miring yang dikuadratkan</td><td>Bagian 3: tabel "pilih rumus sesuai yang dicari"; Bagian 4: langkah dipisah satu per satu</td></tr>
    <tr><td>IL3</td><td>Butuh kuadrat & akar kuadrat; macet di akhir bila belum paham akar</td><td>Bagian 1: prasyarat + tabel kuadrat 1–20</td></tr>
    <tr><td>IL4</td><td>Kesulitan naik pada soal cerita</td><td>Latihan berjenjang: angka → gambar → cerita</td></tr>
    <tr><td>EL1, EL5</td><td>Kalimat soal panjang; sulit memilih informasi penting</td><td>Strategi 5 langkah: tandai angka, tabel Diketahui–Ditanya</td></tr>
    <tr><td>EL2</td><td>Bolak-balik melihat teks dan gambar</td><td>Angka ditulis tepat di samping sisi pada gambar; contoh dan gambar bersebelahan</td></tr>
    <tr><td>EL3</td><td>Terlalu banyak warna mengganggu</td><td>Warna hanya dua makna: biru = diketahui, merah muda = dicari</td></tr>
    <tr><td>EL4</td><td>Penjelasan substitusi terlalu cepat</td><td>Contoh dikerjakan baris demi baris dalam tabel</td></tr>
    <tr><td>GL1</td><td>Paham setelah menggambar & memberi nama sisi</td><td>Ayo Coba 2 (menebalkan sisi miring), langkah 3 "gambar segitiga"</td></tr>
    <tr><td>GL2</td><td>Memeriksa: sisi miring harus terpanjang</td><td>Langkah 5 "cek kewajaran" di setiap contoh</td></tr>
    <tr><td>GL3</td><td>Petunjuk tahap demi tahap membuat mandiri</td><td>Strategi 5 langkah, contoh terbimbing lalu latihan mandiri</td></tr>
    <tr><td>GL4</td><td>Menjelaskan ke teman membuat ingat</td><td>Kotak Refleksi "jelaskan dengan kata-katamu"</td></tr>
    <tr><td>GL5</td><td>Melihat kesamaan pola pada cerita berbeda</td><td>"Pola yang sama, cerita berbeda": 6 konteks berbeda</td></tr>
  </table>
  <p class="kecil">Catatan: semua angka soal pada materi ini berbeda dari butir pre-test dan post-test penelitian agar hasil tes tidak bias.</p>
</section>

</body></html>"""


if __name__ == "__main__":
    os.makedirs(KELUAR, exist_ok=True)
    path = os.path.join(KELUAR, "Materi-Teorema-Pythagoras.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(halaman())
    print("tersimpan:", path)
