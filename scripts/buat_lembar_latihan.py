"""Lembar latihan soal Pertemuan 4 (implementasi) untuk siswa yang diajar langsung (tanpa aplikasi).

Setara dengan menu Latihan Soal di aplikasi: berjenjang seperti "Latihan Berjenjang" di materi PDF
(tingkat 1 angka langsung -> tingkat 2 dengan gambar yang diputar -> tingkat 3 soal cerita), memakai
Strategi 5 Langkah, dan target minimal 10 soal. Semua angka BARU: tidak sama dengan contoh/latihan di
materi PDF dan tidak memakai tripel butir pre-test/post-test (konten.md §5).

Pemakaian:  python scripts/buat_lembar_latihan.py
Hasil:      docs/latihan-cetak/1-Lembar-Latihan-Pertemuan-4.html  (untuk siswa)
            docs/latihan-cetak/2-Kunci-Latihan-Pertemuan-4.html   (untuk guru/peneliti)
"""
import os

from buat_materi import segitiga  # gambar segitiga yang sama dengan materi PDF

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(AKAR, "docs", "latihan-cetak")

# Tripel Pythagoras (a, b, c) yang TIDAK dipakai di pre-test/post-test
# (tes memakai 5-12-13, 6-8-10, 7-24-25, 8-15-17, 9-12-15, 12-16-20, 27-36-45, 30-40-50)
# maupun di contoh & latihan materi PDF.
SOAL = [
    # --- Tingkat 1: angka langsung ---
    {"tingkat": 1, "cari": "c", "sisi": (24, 32, 40),
     "teks": "Segitiga siku-siku dengan a = 24 cm dan b = 32 cm. Berapa cm panjang c?"},
    {"tingkat": 1, "cari": "b", "sisi": (12, 35, 37),
     "teks": "Segitiga siku-siku dengan c = 37 cm dan a = 12 cm. Berapa cm panjang b?"},
    {"tingkat": 1, "cari": "c", "sisi": (33, 44, 55),
     "teks": "Segitiga siku-siku dengan a = 33 cm dan b = 44 cm. Berapa cm panjang c?"},
    {"tingkat": 1, "cari": "a", "sisi": (28, 45, 53),
     "teks": "Segitiga siku-siku dengan c = 53 cm dan b = 45 cm. Berapa cm panjang a?"},
    # --- Tingkat 2: dengan gambar (posisi diputar/dibalik) ---
    {"tingkat": 2, "cari": "c", "sisi": (20, 48, 52), "putar": 125, "cermin": False,
     "teks": "Tentukan dulu sisi miringnya, lalu hitung panjang sisi yang ditandai \"?\"."},
    {"tingkat": 2, "cari": "b", "sisi": (25, 60, 65), "putar": 230, "cermin": True,
     "teks": "Hitung panjang sisi yang ditandai \"?\". Perhatikan letak sudut siku-sikunya."},
    {"tingkat": 2, "cari": "c", "sisi": (36, 48, 60), "putar": 300, "cermin": False,
     "teks": "Tentukan dulu sisi miringnya, lalu hitung panjang sisi yang ditandai \"?\"."},
    {"tingkat": 2, "cari": "a", "sisi": (15, 36, 39), "putar": 60, "cermin": True,
     "teks": "Hitung panjang sisi yang ditandai \"?\". Perhatikan letak sudut siku-sikunya."},
    # --- Tingkat 3: soal cerita (konteks sama dengan materi PDF) ---
    {"tingkat": 3, "cari": "b", "sisi": (11, 60, 61), "satuan": "m",
     "teks": "Benang layang-layang yang terulur panjangnya 61 m. Jarak mendatar dari Rani ke titik tepat di bawah "
             "layang-layang 11 m. Berapa meter tinggi layang-layang?"},
    {"tingkat": 3, "cari": "c", "sisi": (42, 40, 58), "satuan": "km",
     "teks": "Sebuah perahu berlayar 40 km ke utara, lalu 42 km ke barat. Berapa km jarak perahu dari titik berangkat?"},
    {"tingkat": 3, "cari": "a", "sisi": (60, 45, 75), "satuan": "m",
     "teks": "Menara pemancar setinggi 45 m ditopang kawat dari puncak menara ke tanah. Panjang kawat 75 m. "
             "Berapa meter jarak ujung kawat di tanah ke kaki menara?"},
    {"tingkat": 3, "cari": "c", "sisi": (48, 55, 73), "satuan": "m",
     "teks": "Taman berbentuk persegi panjang berukuran 48 m × 55 m. Budi berjalan memotong diagonal taman. "
             "Berapa meter panjang jalannya, dan berapa meter lebih hemat dibanding berjalan menyusuri tepi taman?"},
]

NAMA_TINGKAT = {1: "Tingkat 1 · Angka langsung", 2: "Tingkat 2 · Dengan gambar (perhatikan posisinya!)",
                3: "Tingkat 3 · Soal cerita (pakai Strategi 5 Langkah)"}


def periksa():
    for i, s in enumerate(SOAL, 1):
        a, b, c = s["sisi"]
        assert a * a + b * b == c * c, f"soal {i} bukan tripel"


def pembahasan(s):
    a, b, c = s["sisi"]
    sat = s.get("satuan", "cm")
    if s["cari"] == "c":
        baris = f"c² = {a}² + {b}² = {a * a} + {b * b} = {c * c} → c = √{c * c} = <b>{c} {sat}</b>"
        cek = f"{c} lebih panjang dari {a} dan {b} ✓"
    else:
        lain = b if s["cari"] == "a" else a
        x = s["sisi"]["ab".index(s["cari"])]
        baris = f"{s['cari']}² = {c}² − {lain}² = {c * c} − {lain * lain} = {x * x} → {s['cari']} = √{x * x} = <b>{x} {sat}</b>"
        cek = f"{x} lebih pendek dari sisi miring {c} ✓"
    if "hemat" in s["teks"]:
        cek += f" · lebih hemat {a} + {b} − {c} = <b>{a + b - c} {sat}</b>"
    return baris, cek


def gambar(s):
    a, b, c = s["sisi"]
    lab = {k: ("?" if k == s["cari"] else f"{v} cm") for k, v in zip("abc", (a, b, c))}
    warna = tuple("d" if k == s["cari"] else "k" for k in "abc")
    # perbandingan sisi dibatasi agar segitiga yang pipih tetap terbaca
    rasio = min(max(b / a, 0.45), 2.4)
    return segitiga(1, rasio, lab["a"], lab["b"], lab["c"], warna, putar=s["putar"], cermin=s["cermin"],
                    lebar=300, tinggi_kotak=230)


GAYA = """
@page { size: A4; margin: 15mm 15mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 11pt; line-height: 1.45; margin: 0; }
.kepala { border: 2px solid #7cc3ff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; background: #f3f9ff; }
.kepala h1 { margin: 0 0 2px; font-size: 16pt; }
.kepala .sub { margin: 0 0 8px; color: #475577; }
.identitas { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
.identitas div { border-bottom: 1px dotted #7a88a8; padding: 2px 0; }
.petunjuk { border-left: 4px solid #f9a8d4; padding: 6px 12px; margin: 0 0 12px; background: #fff5fa; }
.petunjuk ol { margin: 4px 0; padding-left: 18px; }
h2 { font-size: 12.5pt; margin: 14px 0 6px; color: #1d4ed8; border-bottom: 2px solid #bfdbfe; padding-bottom: 3px; }
.soal { break-inside: avoid; margin: 0 0 10px; padding: 8px 10px; border: 1px solid #dce6f5; border-radius: 10px; }
.soal .no { font-weight: 800; color: #2b7bd0; }
.dua { display: flex; gap: 12px; align-items: center; }
.dua > div { flex: 1; }
.gbr { display: block; margin: 0 auto; }
.cara { height: 62px; border: 1px dashed #b7c3dc; border-radius: 6px; padding: 3px 6px; color: #8a96b3; font-size: 9pt; margin-top: 6px; }
.cara.tinggi { height: 92px; }
.baris { display: flex; gap: 14px; margin-top: 6px; font-size: 10pt; }
.baris span { flex: 1; border-bottom: 1.5px solid #1d2a4d; padding-bottom: 2px; }
.halaman-baru { break-before: page; }
table { border-collapse: collapse; width: 100%; font-size: 10pt; }
th, td { border: 1px solid #b7c3dc; padding: 5px 6px; vertical-align: top; text-align: left; }
th { background: #eef6ff; }
.kecil { font-size: 9pt; color: #5f6d8f; }
"""


def kepala(judul, sub, identitas=True):
    isi = ('<div class="identitas"><div>Nama: </div><div>Kelas: 8</div><div>Tanggal: </div>'
           '<div>Jumlah soal dikerjakan: ……… / 12</div></div>') if identitas else ""
    return f'<div class="kepala"><h1>{judul}</h1><p class="sub">{sub}</p>{isi}</div>'


def lembar_siswa():
    bagian = [kepala("Latihan Soal · Pertemuan 4", "Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah · Matematika SMP Kelas VIII"),
              """<div class="petunjuk"><strong>Petunjuk</strong><ol>
              <li>Kerjakan berurutan dari tingkat 1. Targetmu <b>minimal 10 soal</b>; kalau bisa, selesaikan ke-12 soal.</li>
              <li>Tuliskan cara mengerjakannya, jangan hanya jawaban akhir. Boleh memakai tabel kuadrat di materi.</li>
              <li>Soal cerita: pakai <b>Strategi 5 Langkah</b> — tandai angka, tulis Diketahui–Ditanya, gambar segitiga siku-siku,
              pilih rumus &amp; hitung, lalu cek kewajaran (sisi miring harus paling panjang).</li>
              <li>Kalau buntu, lihat lagi contoh di materi Bagian 3–5, lalu coba lagi.</li></ol></div>"""]
    tingkat = None
    for i, s in enumerate(SOAL, 1):
        if s["tingkat"] != tingkat:
            tingkat = s["tingkat"]
            bagian.append(f'<h2>{NAMA_TINGKAT[tingkat]}</h2>')
        if tingkat == 1:
            bagian.append(f'<div class="soal"><span class="no">{i}.</span> {s["teks"]}'
                          f'<div class="cara">cara:</div><div class="baris"><span>Jawaban:</span></div></div>')
        elif tingkat == 2:
            bagian.append(f'<div class="soal"><div class="dua"><div><span class="no">{i}.</span> {s["teks"]}'
                          f'<div class="cara tinggi">cara:</div><div class="baris"><span>Sisi miring = </span>'
                          f'<span>Jawaban:</span></div></div><div>{gambar(s)}</div></div></div>')
        else:
            bagian.append(f'<div class="soal"><span class="no">{i}.</span> {s["teks"]}'
                          f'<div class="baris"><span>Diketahui:</span><span>Ditanya:</span></div>'
                          f'<div class="cara tinggi">gambar segitiga siku-siku &amp; cara:</div>'
                          f'<div class="baris"><span>Jawaban:</span><span>Cek kewajaran:</span></div></div>')
    bagian.append('<p class="kecil">Angka pada lembar ini berbeda dari soal pre-test dan post-test.</p>')
    return halaman("Lembar Latihan Soal Pertemuan 4", "".join(bagian))


def lembar_kunci():
    baris = []
    for i, s in enumerate(SOAL, 1):
        hitung, cek = pembahasan(s)
        tambahan = ""
        if s["tingkat"] == 2:
            tambahan = f"Sisi miring = sisi di depan kotak siku-siku ({'yang ditanya' if s['cari'] == 'c' else str(s['sisi'][2]) + ' cm'}). "
        if s["tingkat"] == 3:
            peran = "sisi miring" if s["cari"] == "c" else f"sisi siku-siku (sisi miringnya {s['sisi'][2]} {s['satuan']})"
            tambahan = f"Yang ditanya = {peran}. "
        baris.append(f"<tr><td>{i}</td><td>{NAMA_TINGKAT[s['tingkat']].split(' · ')[0]}</td><td>{tambahan}{hitung}</td><td>{cek}</td></tr>")
    isi = (kepala("Kunci Latihan Soal · Pertemuan 4", "Untuk guru/peneliti — jangan dibagikan ke siswa", identitas=False)
           + "<table><tr><th>No</th><th>Tingkat</th><th>Pembahasan</th><th>Cek kewajaran</th></tr>" + "".join(baris) + "</table>"
           + '<p class="kecil">Penilaian sederhana: catat jumlah soal yang dikerjakan dan yang benar (seperti skor di menu Latihan Soal '
             'aplikasi). Target pertemuan 4: minimal 10 soal.</p>')
    return halaman("Kunci Latihan Soal Pertemuan 4", isi)


def halaman(judul, isi):
    return f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>{judul}</title><style>{GAYA}</style></head><body>{isi}</body></html>'


if __name__ == "__main__":
    periksa()
    os.makedirs(KELUAR, exist_ok=True)
    for nama, isi in [("1-Lembar-Latihan-Pertemuan-4.html", lembar_siswa()), ("2-Kunci-Latihan-Pertemuan-4.html", lembar_kunci())]:
        with open(os.path.join(KELUAR, nama), "w", encoding="utf-8") as f:
            f.write(isi)
        print("tersimpan:", os.path.join("docs", "latihan-cetak", nama))
