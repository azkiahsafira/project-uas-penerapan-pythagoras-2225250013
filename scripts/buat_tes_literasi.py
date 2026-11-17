"""Lembar tes Mathematical Literacy (cetak) dan rubrik penilaiannya.

Soal dibaca dari src/data/soal-literasi.json (sama persis dengan menu Tes aplikasi bila VITE_TES_LITERASI=1),
kisi-kisi & skor per tahap dari scripts/kisi-literasi.json (sama dengan Tabel 2 tugas kisi-kisi dosen).

Pemakaian:  python scripts/buat_tes_literasi.py
Hasil:      docs/instrumen-cetak-literasi/0-Uji-Coba-Tes-Mathematical-Literacy.html (uji coba instrumen, siswa kelas 9)
            docs/instrumen-cetak-literasi/1-Tes-Mathematical-Literacy.html          (untuk siswa, pre & post)
            docs/instrumen-cetak-literasi/2-Rubrik-Penilaian-Mathematical-Literacy.html (untuk peneliti)
"""
import json
import os
from html import escape

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(AKAR, "docs", "instrumen-cetak-literasi")
SOAL = json.load(open(os.path.join(AKAR, "src", "data", "soal-literasi.json"), encoding="utf-8"))
KISI = json.load(open(os.path.join(AKAR, "scripts", "kisi-literasi.json"), encoding="utf-8"))

# identitas penyusun instrumen (mahasiswa), dicantumkan agar dosen tahu pemilik lembar saat mengoreksi
PENYUSUN = "Azkiah Safira · NIM 2225250013 · Kelas 3F"
PENYUSUN_HTML = "Disusun oleh: <b>Azkiah Safira</b> · NIM 2225250013 · Kelas 3F"

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
/* lembar siswa: satu soal per halaman, kotak jawaban bergaris mengisi sisa halaman agar cukup untuk tulisan tangan */
.lembar { height: 264mm; display: flex; flex-direction: column; break-after: page; }
.lembar:last-child { break-after: auto; }
.lembar .soal { flex: 1; display: flex; flex-direction: column; margin: 0; }
.lembar .jawab { flex: 1; height: auto; -webkit-print-color-adjust: exact; print-color-adjust: exact;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(8mm - 1px), #dfe6f2 calc(8mm - 1px), #dfe6f2 8mm); }
/* jawaban dibagi per tahap rubrik: tiap tahap punya kotak bergaris & kotak skor sendiri agar penskoran per tahap jelas */
.tahap-daftar { flex: 1; display: flex; flex-direction: column; gap: 2.5mm; margin-top: 6px; }
.tahap { flex: 1 1 0; display: flex; flex-direction: column; border: 1px solid #b7c3dc; border-radius: 6px; overflow: hidden; }
.tahap.dua { flex-grow: 1.6; }
.tahap-kepala { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 2px 4px 2px 8px; font-size: 9.5pt;
  background: #eef6ff; border-bottom: 1px solid #dce6f5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.tahap-kepala b { color: #2b7bd0; }
.tahap-skor { font-size: 8.5pt; color: #475577; white-space: nowrap; }
.tahap-skor span { display: inline-block; width: 11mm; height: 6mm; border: 1.3px solid #1d2a4d; border-radius: 3px; margin: 0 3px; vertical-align: middle; background: #fff; }
.tahap-isi { flex: 1; -webkit-print-color-adjust: exact; print-color-adjust: exact;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(8mm - 1px), #e4eaf4 calc(8mm - 1px), #e4eaf4 8mm); }
.rekap { margin-top: 4mm; }
.rekap h2 { margin-top: 0; }
.rekap td { height: 10mm; vertical-align: middle; }
.skor-soal { align-self: flex-end; margin-top: 6px; font-size: 9.5pt; color: #475577; }
.skor-soal span { display: inline-block; width: 16mm; height: 8mm; border: 1.5px solid #1d2a4d; border-radius: 4px; margin: 0 4px; vertical-align: middle; }
.kaki-lembar { text-align: center; font-size: 8.5pt; color: #8a96b3; margin-top: 4px; }
.kaki-penyusun::before { content: " · "; }
.penyusun { margin: -4px 0 8px; font-size: 9.5pt; color: #1d2a4d; }
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


def lembar_tes(uji_coba=False):
    """uji_coba=True: lembar uji coba instrumen untuk kakak kelas (kelas 9) yang sebelumnya diwawancarai;
    False: lembar pre-test/post-test untuk siswa kelas 8 pengguna aplikasi."""
    kelas = 9 if uji_coba else 8
    # kode siswa sama dengan kode masuk aplikasi (kelas + huruf kelas - nomor absen), tanpa nama asli (privasi.md)
    judul = "Uji Coba Tes Mathematical Literacy" if uji_coba else "Tes Mathematical Literacy"
    sub = ("Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah · Uji Coba Instrumen · Siswa SMP Kelas IX" if uji_coba
           else "Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah · Matematika SMP Kelas VIII")
    tes = ("<div>Tes: Uji coba instrumen</div>" if uji_coba
           else '<div>Tes:<span class="kotak"></span>Pre-test<span class="kotak"></span>Post-test</div>')
    isi = [f'<div class="kepala"><h1>{judul}</h1><p class="sub">{sub}</p><p class="penyusun">{PENYUSUN_HTML}</p>'
           f'<div class="identitas"><div>Kode siswa: </div><div>Kelas: {kelas}</div><div>Tanggal: </div>{tes}'
           '<div>Jam mulai: </div><div>Jam selesai: </div></div>'
           f'<p class="kecil" style="margin:6px 0 0">Kode siswa = kelas + huruf kelas, tanda -, lalu nomor absen '
           f'(contoh: <b>{kelas}A-07</b>). Tidak perlu menulis nama.</p></div>',
           '<div class="petunjuk"><strong>Petunjuk</strong><ol>'
           '<li>Ada 4 soal cerita, satu soal per halaman. Kerjakan sendiri dan jujur; tidak apa-apa jika belum bisa, '
           'kerjakan semampunya.</li>'
           '<li>Setiap soal dikerjakan <b>per tahap</b>. Tulis jawabanmu di kotak tahap yang sesuai, berurutan mulai dari '
           'Tahap 1. Boleh menggambar.</li>'
           '<li>Jika belum bisa menyelesaikan satu tahap, tetap lanjutkan ke tahap berikutnya. Langkah yang benar tetap '
           'diberi nilai walaupun jawaban akhir keliru.</li>'
           '<li>Kotak <b>Skor</b> diisi oleh peneliti, siswa tidak perlu mengisinya.</li></ol></div>']
    # rekap skor di halaman 1 (diisi peneliti) agar total mudah dibaca saat lembar di-scan
    isi.append('<div class="rekap"><h2>Rekap skor (diisi peneliti)</h2><table><tr><th>Soal</th><th>Indikator</th>'
               '<th class="c" style="width:16%">Skor maks.</th><th class="c" style="width:18%">Skor siswa</th></tr>'
               + "".join(f'<tr><td>Soal {i} · {escape(k["judul"])}</td><td>{escape(k["indikator"])}</td>'
                         f'<td class="c">{sum(t["skor"] for t in k["tahap"])}</td><td></td></tr>' for i, k in enumerate(KISI, 1))
               + f'<tr><th colspan="2">Total skor</th><th class="c">{sum(t["skor"] for k in KISI for t in k["tahap"])}</th><td></td></tr>'
               '<tr><th colspan="2">Nilai = total skor ÷ 24 × 100</th><th class="c">100</th><td></td></tr></table></div>')
    n = len(SOAL)
    lembar = []
    for i, (s, k) in enumerate(zip(SOAL, KISI), 1):
        tahap = "".join(f'<div class="tahap{" dua" if t["skor"] > 1 else ""}"><div class="tahap-kepala">'
                        f'<span><b>Tahap {m}</b> · {escape(t["label"])}</span>'
                        f'<span class="tahap-skor">Skor:<span></span>/ {t["skor"]}</span></div><div class="tahap-isi"></div></div>'
                        for m, t in enumerate(k["tahap"], 1))
        lembar.append(f'<div class="soal"><div><span class="no">{i}.</span> <b>{escape(s["judul"])}.</b> {escape(s["teks"])} '
                      f'<b>{escape(s["tanya"])}</b></div><div class="tahap-daftar">{tahap}</div>'
                      f'<div class="skor-soal">Skor soal {i} (diisi peneliti):<span></span>/ {sum(t["skor"] for t in k["tahap"])}</div></div>'
                      f'<p class="kaki-lembar">Soal {i} dari {n}{" · lanjut ke halaman berikutnya" if i < n else " · selesai, periksa kembali jawabanmu"}'
                      f'<span class="kaki-penyusun">{PENYUSUN}</span></p>')
    # halaman 1: identitas, petunjuk, rekap skor; halaman berikutnya satu soal per halaman
    halaman_ = ['<div class="halaman-1">' + "".join(isi) + '</div>'] + [f'<div class="lembar halaman-baru">{x}</div>' for x in lembar]
    return halaman(judul, "".join(halaman_))


def rubrik():
    isi = ['<div class="kepala"><h1>Rubrik Penilaian Tes Mathematical Literacy</h1>'
           '<p class="sub">Untuk peneliti — jangan dibagikan ke siswa · skor maksimum 6 per soal, total 24</p>'
           f'<p class="penyusun">{PENYUSUN_HTML}</p></div>']
    for i, k in enumerate(KISI, 1):
        baris = "".join(f'<tr><td>Tahap {n}<br><span class="kecil">{escape(t["label"])}</span></td><td>{escape(t["isi"])}</td><td class="c">{t["skor"]}</td></tr>'
                        for n, t in enumerate(k["tahap"], 1))
        isi.append(f'<h2>Soal {i} · {escape(k["indikator"])}</h2><p class="kecil">{escape(k["deskripsi"])}</p>'
                   f'<p><b>{escape(k["judul"])}.</b> {escape(k["teks"])} <b>{escape(k["tanya"])}</b></p>'
                   f'<table><tr><th style="width:17%">Tahap</th><th>Kisi-kisi jawaban</th><th class="c" style="width:9%">Skor</th></tr>'
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
                         for t in ["Uji coba"] * 6 + ["Pre-test", "Post-test", "Pre-test", "Post-test"])
               + "</table>")
    return halaman("Rubrik Penilaian Tes Mathematical Literacy", "".join(isi))


if __name__ == "__main__":
    os.makedirs(KELUAR, exist_ok=True)
    for nama, isi in [("0-Uji-Coba-Tes-Mathematical-Literacy.html", lembar_tes(uji_coba=True)),
                      ("1-Tes-Mathematical-Literacy.html", lembar_tes()),
                      ("2-Rubrik-Penilaian-Mathematical-Literacy.html", rubrik())]:
        with open(os.path.join(KELUAR, nama), "w", encoding="utf-8") as f:
            f.write(isi)
        print("tersimpan:", os.path.join("docs", "instrumen-cetak-literasi", nama))
