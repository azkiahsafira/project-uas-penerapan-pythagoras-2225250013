"""Lembar tes Mathematical Literacy (cetak) dan rubrik penilaiannya.

Soal dibaca dari src/data/soal-literasi.json (sama persis dengan menu Tes aplikasi bila VITE_TES_LITERASI=1),
kisi-kisi & skor per tahap dari scripts/kisi-literasi.json (sama dengan Tabel 2 tugas kisi-kisi dosen).

Pemakaian:  python scripts/buat_tes_literasi.py
Hasil:      docs/instrumen-cetak-literasi/1-Tes-Mathematical-Literacy.html          (untuk siswa, pre & post)
            docs/instrumen-cetak-literasi/2-Rubrik-Penilaian-Mathematical-Literacy.html (untuk peneliti)
"""
import json
import os
from html import escape

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(AKAR, "docs", "instrumen-cetak-literasi")
SOAL = json.load(open(os.path.join(AKAR, "src", "data", "soal-literasi.json"), encoding="utf-8"))
KISI = json.load(open(os.path.join(AKAR, "scripts", "kisi-literasi.json"), encoding="utf-8"))

GAYA = """
@page { size: A4; margin: 15mm 15mm 16mm; }
* { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; color: #1d2a4d; font-size: 11pt; line-height: 1.45; margin: 0; }
.kepala { border: 2px solid #7cc3ff; border-radius: 12px; padding: 10px 16px; margin-bottom: 12px; background: #f3f9ff; }
.kepala h1 { margin: 0 0 2px; font-size: 16pt; }
.kepala .sub { margin: 0 0 8px; color: #475577; }
.identitas { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
.identitas div { border-bottom: 1px dotted #7a88a8; padding: 2px 0; }
.kotak { display: inline-block; width: 13px; height: 13px; border: 1.5px solid #1d2a4d; border-radius: 3px; margin: 0 4px 0 10px; vertical-align: -2px; }
.petunjuk { border-left: 4px solid #f9a8d4; padding: 6px 12px; margin: 0 0 12px; background: #fff5fa; }
.petunjuk ol { margin: 4px 0; padding-left: 18px; }
.soal { break-inside: avoid; margin: 0 0 12px; padding: 8px 10px; border: 1px solid #dce6f5; border-radius: 10px; }
.soal .no { font-weight: 800; color: #2b7bd0; }
.jawab { height: 300px; border: 1px dashed #b7c3dc; border-radius: 6px; margin-top: 8px; padding: 4px 8px; color: #8a96b3; font-size: 9pt; }
.halaman-baru { break-before: page; }
table { border-collapse: collapse; width: 100%; font-size: 10pt; }
th, td { border: 1px solid #b7c3dc; padding: 5px 6px; vertical-align: top; text-align: left; }
th { background: #eef6ff; }
td.c, th.c { text-align: center; }
h2 { font-size: 12.5pt; margin: 14px 0 6px; color: #1d4ed8; }
.kecil { font-size: 9pt; color: #5f6d8f; }
"""


def halaman(judul, isi):
    return f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>{judul}</title><style>{GAYA}</style></head><body>{isi}</body></html>'


def lembar_tes():
    isi = ['<div class="kepala"><h1>Tes Mathematical Literacy</h1>'
           '<p class="sub">Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah · Matematika SMP Kelas VIII</p>'
           '<div class="identitas"><div>Kode / nama: </div><div>Kelas: 8</div><div>Tanggal: </div>'
           '<div>Tes:<span class="kotak"></span>Pre-test<span class="kotak"></span>Post-test</div>'
           '<div>Jam mulai: </div><div>Jam selesai: </div></div></div>',
           '<div class="petunjuk"><strong>Petunjuk</strong><ol>'
           '<li>Ada 4 soal cerita. Kerjakan sendiri dan jujur; tidak apa-apa jika belum bisa, kerjakan semampunya.</li>'
           '<li>Tuliskan <b>langkah penyelesaian</b> selengkap mungkin: apa yang diketahui dan ditanya, gambar/model, '
           'rumus, perhitungan, dan kesimpulan. Langkah yang benar tetap diberi nilai walaupun jawaban akhir keliru.</li>'
           '<li>Tulis jawaban pada kotak di bawah setiap soal.</li></ol></div>']
    for i, s in enumerate(SOAL, 1):
        isi.append(f'<div class="soal"><span class="no">{i}.</span> <b>{escape(s["judul"])}.</b> {escape(s["teks"])} '
                   f'<b>{escape(s["tanya"])}</b><div class="jawab">jawaban &amp; langkah penyelesaian:</div></div>')
    return halaman("Tes Mathematical Literacy", "".join(isi))


def rubrik():
    isi = ['<div class="kepala"><h1>Rubrik Penilaian Tes Mathematical Literacy</h1>'
           '<p class="sub">Untuk peneliti — jangan dibagikan ke siswa · skor maksimum 6 per soal, total 24</p></div>']
    for i, k in enumerate(KISI, 1):
        baris = "".join(f'<tr><td>Tahap {n}</td><td>{escape(t["isi"])}</td><td class="c">{t["skor"]}</td></tr>'
                        for n, t in enumerate(k["tahap"], 1))
        isi.append(f'<h2>Soal {i} · {escape(k["indikator"])}</h2><p class="kecil">{escape(k["deskripsi"])}</p>'
                   f'<p><b>{escape(k["judul"])}.</b> {escape(k["teks"])} <b>{escape(k["tanya"])}</b></p>'
                   f'<table><tr><th style="width:11%">Tahap</th><th>Kisi-kisi jawaban</th><th class="c" style="width:9%">Skor</th></tr>'
                   f'{baris}<tr><th colspan="2">Skor maksimum</th><th class="c">{sum(t["skor"] for t in k["tahap"])}</th></tr></table>')
    isi.append('<h2>Pedoman umum penskoran</h2><ul>'
               '<li>Skor penuh diberikan bila tahapan penyelesaian benar, prosedur tepat, dan kesimpulan sesuai konteks.</li>'
               '<li>Skor parsial tetap diberikan bila tahapan berpikir benar tetapi terjadi kesalahan hitung pada tahap berikutnya.</li>'
               '<li>Instrumen mengukur <b>proses</b> mathematical literacy, bukan hanya ketepatan jawaban akhir.</li></ul>')
    kolom = "".join(f'<th class="c">S{i}<br>(0–6)</th>' for i in range(1, 5))
    kosong = "".join('<td></td>' for _ in range(4))
    isi.append('<h2 class="halaman-baru">Lembar rekap skor</h2>'
               '<p class="kecil">Setelah dinilai, ketik baris ini ke <code>analisis/skor_literasi.csv</code> '
               '(format sama dengan <code>templat_skor_literasi.csv</code>) lalu jalankan '
               '<code>python analisis/analisis_literasi.py analisis/skor_literasi.csv</code>.</p>'
               f'<table><tr><th>Kode siswa</th><th>Kelompok</th><th>Tes</th>{kolom}<th class="c">Total<br>(0–24)</th></tr>'
               + "".join(f'<tr><td style="height:26px"></td><td></td><td>{t}</td>{kosong}<td></td></tr>'
                         for t in ("Pre-test", "Post-test", "Pre-test", "Post-test"))
               + "</table>")
    return halaman("Rubrik Penilaian Tes Mathematical Literacy", "".join(isi))


if __name__ == "__main__":
    os.makedirs(KELUAR, exist_ok=True)
    for nama, isi in [("1-Tes-Mathematical-Literacy.html", lembar_tes()),
                      ("2-Rubrik-Penilaian-Mathematical-Literacy.html", rubrik())]:
        with open(os.path.join(KELUAR, nama), "w", encoding="utf-8") as f:
            f.write(isi)
        print("tersimpan:", os.path.join("docs", "instrumen-cetak-literasi", nama))
