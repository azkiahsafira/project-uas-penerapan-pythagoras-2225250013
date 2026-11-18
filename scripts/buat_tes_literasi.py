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

/* ===== tema cute PELITA: biru muda & pink muda, font Bubblegum Sans (judul) + Itim (teks), sahabat kawaii ===== */
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Itim', 'Segoe UI', Arial, sans-serif; color: #3f3566; }
h1, h2, .no, .tahap-kepala b, th, .merek, .ucap { font-family: 'Bubblegum Sans', 'Itim', 'Segoe UI', sans-serif; font-weight: 400; letter-spacing: .02em; }
h2 { color: #d9468f; font-size: 14pt; }
.kepala { position: relative; border: 2.5px solid #ffb3d6; border-radius: 20px; padding: 12px 150px 12px 18px;
  background: linear-gradient(135deg, #e3f3ff 0%, #f4ecff 55%, #ffe6f3 100%); box-shadow: 0 0 0 4px #fff, 0 0 0 5.5px #bfe3ff; }
.kepala h1 { font-size: 22pt; line-height: 1.05; margin: 2px 0 2px; color: #8b5fd6; }
.kepala .sub { color: #6b5a8e; }
.merek { display: inline-block; background: #fff; border: 1.5px solid #ffb3d6; color: #d9468f; border-radius: 99px; padding: 0 10px; font-size: 10pt; }
.merek b { color: #4fa3f0; font-weight: 400; }
.maskot-kepala { position: absolute; right: 10px; bottom: 6px; width: 138px; height: auto; }
.ucap { position: absolute; right: 14px; top: 8px; background: #fff; border: 1.5px solid #bfe3ff; border-radius: 12px; padding: 2px 9px; font-size: 10pt; color: #4f7fc0; }
.identitas div { border-bottom: 1.5px dotted #c4b5fd; }
.kotak { border-color: #6b5a8e; border-radius: 4px; }
.petunjuk { border: 2px dashed #ffb3d6; border-left: 2px dashed #ffb3d6; border-radius: 16px; background: #fff7fb; padding: 8px 14px; }
.petunjuk strong { font-family: 'Bubblegum Sans', 'Itim', sans-serif; font-weight: 400; font-size: 13pt; color: #d9468f; }
.soal { border: 2px solid #bfe3ff; border-radius: 16px; background: #fff; }
.soal .no { display: inline-block; min-width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%;
  background: #ff8fc4; color: #fff; font-size: 12pt; }
.tahap { border: 1.5px solid #c9dcf5; border-radius: 12px; }
.tahap-kepala { background: #e8f4ff; border-bottom: 1.5px solid #c9dcf5; }
.tahap-kepala b { color: #4f7fc0; font-size: 11pt; }
.tahap:nth-child(2) { border-color: #ffc6e0; } .tahap:nth-child(2) .tahap-kepala { background: #fff0f7; border-color: #ffc6e0; }
.tahap:nth-child(2) .tahap-kepala b { color: #d9468f; }
.tahap:nth-child(3) { border-color: #d9ccfb; } .tahap:nth-child(3) .tahap-kepala { background: #f4efff; border-color: #d9ccfb; }
.tahap:nth-child(3) .tahap-kepala b { color: #8b5fd6; }
.tahap-isi { background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(8mm - 1px), #e9eef8 calc(8mm - 1px), #e9eef8 8mm); }
.tahap-skor span, .skor-soal span { border-color: #3f3566; }
.kaki-lembar { color: #a08cc8; }
.kaki-lembar::before { content: "♡ "; color: #ff8fc4; } .kaki-lembar::after { content: " ♡"; color: #ff8fc4; }
.semangat { display: flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 6px; font-size: 9.5pt; color: #6b5a8e; }
.semangat svg { width: 40px; height: auto; }
.baris-skor { display: flex; justify-content: space-between; align-items: flex-end; }
table { border-radius: 12px; overflow: hidden; }
th, td { border-color: #d6dff0; }
th { background: #ffe6f3; color: #6b3f7a; font-size: 11pt; }
tr:nth-child(even) td { background: #f8fbff; }
.rekap h2::before, .rubrik-soal::before { content: "★ "; color: #ffcf4d; }
code { font-family: Consolas, monospace; font-size: 9pt; background: #f4efff; border-radius: 4px; padding: 0 3px; }
"""

# Siku si segitiga siku-siku berpita, Kuadra si penguin, dan hati/bintang kecil (SVG, ikut tercetak)
SIKU = ('<g><path d="M14 10 L14 92 L96 92 Z" fill="#fff" stroke="#6b5a8e" stroke-width="4" stroke-linejoin="round"/>'
        '<path d="M14 78 H28 V92" fill="none" stroke="#ff8fc4" stroke-width="3"/>'
        '<ellipse cx="33" cy="62" rx="3.4" ry="4.4" fill="#3b2f55"/><ellipse cx="49" cy="70" rx="3.4" ry="4.4" fill="#3b2f55"/>'
        '<circle cx="32" cy="60.4" r="1.3" fill="#fff"/><circle cx="48" cy="68.4" r="1.3" fill="#fff"/>'
        '<ellipse cx="26" cy="71" rx="4" ry="2.4" fill="#ff9cc6"/><ellipse cx="57" cy="79" rx="4" ry="2.4" fill="#ff9cc6"/>'
        '<path d="M37 74 q4 4 8 1" fill="none" stroke="#3b2f55" stroke-width="2" stroke-linecap="round"/>'
        '<path d="M26 26 l-9 -6 v12 z M26 26 l9 -6 v12 z" fill="#ff8fc4" stroke="#6b5a8e" stroke-width="1.6"/>'
        '<circle cx="26" cy="26" r="3" fill="#ffd6ea" stroke="#6b5a8e" stroke-width="1.2"/></g>')
PENGUIN = ('<g transform="translate(96 22)">'
           '<ellipse cx="30" cy="54" rx="22" ry="20" fill="#8fcaff" stroke="#6b5a8e" stroke-width="3"/>'
           '<ellipse cx="30" cy="57" rx="14" ry="14" fill="#fff"/>'
           '<circle cx="30" cy="26" r="20" fill="#8fcaff" stroke="#6b5a8e" stroke-width="3"/>'
           '<ellipse cx="30" cy="29" rx="14" ry="12" fill="#fff"/>'
           '<ellipse cx="24" cy="27" rx="2.8" ry="3.6" fill="#3b2f55"/><ellipse cx="36" cy="27" rx="2.8" ry="3.6" fill="#3b2f55"/>'
           '<circle cx="23.2" cy="25.6" r="1" fill="#fff"/><circle cx="35.2" cy="25.6" r="1" fill="#fff"/>'
           '<ellipse cx="18" cy="33" rx="3.4" ry="2" fill="#ff9cc6"/><ellipse cx="42" cy="33" rx="3.4" ry="2" fill="#ff9cc6"/>'
           '<path d="M26.5 33 H33.5 L30 38 Z" fill="#ffb35c" stroke="#6b5a8e" stroke-width="1.4" stroke-linejoin="round"/>'
           '<path d="M10 42 Q30 50 50 42 L50 47 Q30 55 10 47 Z" fill="#ff8fc4" stroke="#6b5a8e" stroke-width="1.6"/>'
           '<path d="M42 10 l7 -5 v10 z M42 10 l-7 -5 v10 z" fill="#7cc3ff" stroke="#6b5a8e" stroke-width="1.4"/>'
           '<ellipse cx="22" cy="74" rx="7" ry="3.6" fill="#ffb35c" stroke="#6b5a8e" stroke-width="1.6"/>'
           '<ellipse cx="38" cy="74" rx="7" ry="3.6" fill="#ffb35c" stroke="#6b5a8e" stroke-width="1.6"/></g>')
HIASAN = ('<path d="M104 8 l2 4.4 4.8 .6 -3.5 3.3 .9 4.7 -4.2 -2.4 -4.2 2.4 .9 -4.7 -3.5 -3.3 4.8 -.6z" fill="#ffcf4d"/>'
          '<path d="M150 70 c-2 -3.4 -7 -2 -6.4 2 c.6 3 6.4 6.4 6.4 6.4 s5.8 -3.4 6.4 -6.4 c.6 -4 -4.4 -5.4 -6.4 -2z" fill="#ff8fc4"/>'
          '<circle cx="6" cy="40" r="3" fill="#bfe3ff"/>')
MASKOT_KEPALA = f'<svg class="maskot-kepala" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">{SIKU}{PENGUIN}{HIASAN}</svg>'
SIKU_KECIL = f'<svg viewBox="0 0 104 100" xmlns="http://www.w3.org/2000/svg">{SIKU}</svg>'
MEREK = '<span class="merek">✨ <b>PELITA</b> · Penerapan Teorema Pythagoras</span>'
FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Itim&display=block" rel="stylesheet">')



def halaman(judul, isi):
    return f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>{judul}</title>{FONT}<style>{GAYA}</style></head><body>{isi}</body></html>'


SEMANGAT = ["Baca pelan-pelan, ya!", "Gambar dulu segitiganya!", "Cek lagi sisi miringnya!", "Hampir selesai, semangat!"]


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
    isi = [f'<div class="kepala">{MEREK}<span class="ucap">Kamu pasti bisa! ✨</span>{MASKOT_KEPALA}<h1>{judul}</h1><p class="sub">{sub}</p><p class="penyusun">{PENYUSUN_HTML}</p>'
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
                      f'<div class="baris-skor"><div class="semangat">{SIKU_KECIL}<span>{SEMANGAT[(i - 1) % len(SEMANGAT)]}</span></div>'
                      f'<div class="skor-soal">Skor soal {i} (diisi peneliti):<span></span>/ {sum(t["skor"] for t in k["tahap"])}</div></div></div>'
                      f'<p class="kaki-lembar">Soal {i} dari {n}{" · lanjut ke halaman berikutnya" if i < n else " · selesai, periksa kembali jawabanmu"}'
                      f'<span class="kaki-penyusun">{PENYUSUN}</span></p>')
    # halaman 1: identitas, petunjuk, rekap skor; halaman berikutnya satu soal per halaman
    halaman_ = ['<div class="halaman-1">' + "".join(isi) + '</div>'] + [f'<div class="lembar halaman-baru">{x}</div>' for x in lembar]
    return halaman(judul, "".join(halaman_))


def rubrik():
    isi = [f'<div class="kepala">{MEREK}<span class="ucap">Untuk peneliti 📝</span>{MASKOT_KEPALA}<h1>Rubrik Penilaian Tes Mathematical Literacy</h1>'
           '<p class="sub">Uji coba instrumen · siswa SMP kelas IX · untuk peneliti, jangan dibagikan ke siswa · skor maksimum 6 per soal, total 24</p>'
           f'<p class="penyusun">{PENYUSUN_HTML}</p></div>']
    for i, k in enumerate(KISI, 1):
        baris = "".join(f'<tr><td>Tahap {n}<br><span class="kecil">{escape(t["label"])}</span></td><td>{escape(t["isi"])}</td><td class="c">{t["skor"]}</td></tr>'
                        for n, t in enumerate(k["tahap"], 1))
        isi.append(f'<h2 class="rubrik-soal">Soal {i} · {escape(k["indikator"])}</h2><p class="kecil">{escape(k["deskripsi"])}</p>'
                   f'<p><b>{escape(k["judul"])}.</b> {escape(k["teks"])} <b>{escape(k["tanya"])}</b></p>'
                   f'<table><tr><th style="width:17%">Tahap</th><th>Kisi-kisi jawaban</th><th class="c" style="width:9%">Skor</th></tr>'
                   f'{baris}<tr><th colspan="2">Skor maksimum</th><th class="c">{sum(t["skor"] for t in k["tahap"])}</th></tr></table>')
    isi.append('<h2>Pedoman umum penskoran</h2><ul>'
               '<li>Skor penuh diberikan bila tahapan penyelesaian benar, prosedur tepat, dan kesimpulan sesuai konteks.</li>'
               '<li>Skor parsial tetap diberikan bila tahapan berpikir benar tetapi terjadi kesalahan hitung pada tahap berikutnya.</li>'
               '<li>Instrumen mengukur <b>proses</b> mathematical literacy, bukan hanya ketepatan jawaban akhir.</li></ul>')
    kolom = "".join(f'<th class="c">S{i}<br>(0–6)</th>' for i in range(1, 5))
    kosong = "".join('<td></td>' for _ in range(4))
    # rekap khusus UJI COBA instrumen (siswa kelas 9): tanpa pre-test/post-test karena aplikasi belum dipakai siswa
    isi.append('<h2 class="halaman-baru">Lembar rekap skor uji coba instrumen</h2>'
               '<p class="kecil">Diisi peneliti setelah menilai lembar uji coba siswa kelas 9. '
               'Nilai = total skor ÷ 24 × 100.</p>'
               f'<table><tr><th class="c" style="width:7%">No.</th><th>Kode siswa</th>{kolom}<th class="c">Total<br>(0–24)</th>'
               '<th class="c">Nilai<br>(0–100)</th></tr>'
               + "".join(f'<tr><td class="c" style="height:26px">{n}</td><td></td>{kosong}<td></td><td></td></tr>' for n in range(1, 13))
               + f'<tr><th colspan="2">Rata-rata</th>{kosong}<td></td><td></td></tr></table>')
    return halaman("Rubrik Penilaian Tes Mathematical Literacy", "".join(isi))


if __name__ == "__main__":
    os.makedirs(KELUAR, exist_ok=True)
    for nama, isi in [("0-Uji-Coba-Tes-Mathematical-Literacy.html", lembar_tes(uji_coba=True)),
                      ("1-Tes-Mathematical-Literacy.html", lembar_tes()),
                      ("2-Rubrik-Penilaian-Mathematical-Literacy.html", rubrik())]:
        with open(os.path.join(KELUAR, nama), "w", encoding="utf-8") as f:
            f.write(isi)
        print("tersimpan:", os.path.join("docs", "instrumen-cetak-literasi", nama))
