"""Laporan hasil uji coba instrumen tes Mathematical Literacy (Tahap 1, kepada siswa kelas 9 yang diwawancarai).

Tanpa data  : menghasilkan TEMPLAT kosong (tabel skor per tahap, rekap, analisis, catatan) untuk diisi.
Dengan data : skor per tahap dibaca dari CSV (format analisis/templat_skor_uji_coba.csv), lalu rekap per soal,
              capaian per indikator, dan capaian per tahap rubrik dihitung otomatis.
Catatan kualitatif (opsional) dibaca dari JSON (format analisis/templat_catatan_uji_coba.json).

Pemakaian:
    python scripts/buat_laporan_uji_coba.py                                   # templat kosong
    python scripts/buat_laporan_uji_coba.py analisis/skor_uji_coba.csv [analisis/catatan_uji_coba.json]
Hasil: docs/laporan-uji-coba-literasi/Laporan-Uji-Coba-Mathematical-Literacy.html (cetak ke PDF dengan Edge/Chrome)

Data asli (CSV/JSON selain templat) di-ignore git; yang ditulis hanya KODE siswa, bukan nama.
"""
import csv
import json
import os
import sys
from html import escape

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from buat_tes_literasi import AKAR, GAYA, KISI, PENYUSUN, PENYUSUN_HTML, halaman  # noqa: E402

KELUAR = os.path.join(AKAR, "docs", "laporan-uji-coba-literasi")
NAMA_FILE = "Laporan-Uji-Coba-Mathematical-Literacy.html"
INDIKATOR_SINGKAT = ["Reasoning", "Formulating", "Employing", "Interpreting & Evaluating"]
MAKS_SOAL = [sum(t["skor"] for t in k["tahap"]) for k in KISI]
MAKS_TOTAL = sum(MAKS_SOAL)

GAYA_LAPORAN = GAYA + """
h2 { break-after: avoid; }
.isian { display: inline-block; min-width: 55mm; border-bottom: 1px dotted #7a88a8; }
.garis { border-bottom: 1px dotted #7a88a8; height: 7mm; }
.kotak-catatan { border: 1px solid #b7c3dc; border-radius: 8px; padding: 6px 10px; min-height: 24mm; margin: 4px 0 10px; }
.kosong { color: #b0b9cf; }
td.angka, th.angka { text-align: center; white-space: nowrap; }
.tahap-label { font-size: 8.5pt; color: #5f6d8f; }
.blok { break-inside: avoid; }
ol.rapat li, ul.rapat li { margin: 2px 0; }
/* tabel skor per tahap: lebar kolom tetap agar 8 kolom muat di A4 tegak */
table.tahap-tabel { table-layout: fixed; font-size: 9pt; }
table.tahap-tabel col.c-soal { width: 15%; }
table.tahap-tabel col.c-tahap { width: 11.5%; }
table.tahap-tabel col.c-jml { width: 16%; }
table.tahap-tabel td, table.tahap-tabel th { white-space: normal; overflow-wrap: break-word; padding: 4px 3px; }
table.tahap-tabel .tahap-label { display: block; line-height: 1.25; margin-top: 2px; }
"""


def baca_skor(path):
    """CSV: kode,s1_t1..s1_t5,s2_t1..s2_t6,... -> [{kode, skor: [[tahap...] per soal]}]; nilai melebihi maks ditolak."""
    hasil = []
    with open(path, encoding="utf-8-sig", newline="") as f:
        for baris in csv.DictReader(f):
            kode = (baris.get("kode") or "").strip()
            if not kode:
                continue
            skor = []
            for i, k in enumerate(KISI, 1):
                per = []
                for n, t in enumerate(k["tahap"], 1):
                    teks = (baris.get(f"s{i}_t{n}") or "").strip().replace(",", ".")
                    nilai = float(teks) if teks else 0.0
                    if not 0 <= nilai <= t["skor"]:
                        raise SystemExit(f"{kode}: skor soal {i} tahap {n} = {nilai}, harus 0..{t['skor']}")
                    per.append(nilai)
                skor.append(per)
            hasil.append({"kode": kode, "skor": skor})
    return hasil


def fmt(x):
    return str(int(x)) if float(x).is_integer() else f"{x:.1f}".replace(".", ",")


def sel(x):
    return fmt(x) if x is not None else '<span class="kosong">…</span>'


def isian(catatan, kunci, lebar=""):
    nilai = (catatan or {}).get(kunci)
    return escape(str(nilai)) if nilai else f'<span class="isian" style="{lebar}">&nbsp;</span>'


def kotak(catatan, kunci, baris=3):
    nilai = (catatan or {}).get(kunci)
    if nilai:
        isi = "".join(f"<p style='margin:2px 0'>{escape(p)}</p>" for p in str(nilai).split("\n") if p.strip())
        return f'<div class="kotak-catatan">{isi}</div>'
    return '<div class="kotak-catatan">' + '<div class="garis"></div>' * baris + "</div>"


def laporan(data=None, catatan=None):
    siswa = data or [{"kode": None, "skor": [[None] * len(k["tahap"]) for k in KISI]}]
    terisi = bool(data)
    n = len(siswa)
    isi = [f'<div class="kepala"><h1>Laporan Hasil Uji Coba Instrumen Tes Mathematical Literacy</h1>'
           f'<p class="sub">Penerapan Teorema Pythagoras dalam Menyelesaikan Masalah · Tahap 1'
           f'{"" if terisi else " · TEMPLAT — isi bagian yang bertitik"}</p>'
           f'<p class="penyusun">{PENYUSUN_HTML} · Dosen: Dr. Aan Hendrayana, S.Si., M.Pd.</p></div>']

    # 1. Identitas
    isi.append('<h2>1. Identitas Uji Coba</h2><table>'
               f'<tr><th style="width:32%">Hari, tanggal</th><td>{isian(catatan, "tanggal")}</td></tr>'
               f'<tr><th>Tempat / sekolah</th><td>{isian(catatan, "tempat")}</td></tr>'
               f'<tr><th>Waktu (mulai – selesai)</th><td>{isian(catatan, "waktu")}</td></tr>'
               '<tr><th>Subjek uji coba</th><td>Siswa kelas 9 yang sebelumnya diwawancarai (sudah mempelajari teorema '
               'Pythagoras di kelas 8)</td></tr>'
               f'<tr><th>Jumlah siswa</th><td>{n if terisi else isian(catatan, "jumlah", "min-width:20mm")} orang '
               f'(identitas memakai kode siswa)</td></tr>'
               '<tr><th>Instrumen</th><td>4 soal uraian Mathematical Literacy, dikerjakan tertulis per tahap; '
               f'skor maks. 6 per soal, total {MAKS_TOTAL}</td></tr></table>')

    # 2. Tujuan & prosedur
    isi.append('<h2>2. Tujuan dan Prosedur</h2>'
               '<p><b>Tujuan:</b> menguji keterbacaan soal, kecukupan waktu, dan kesesuaian jawaban siswa dengan tahapan '
               'pada kisi-kisi/rubrik, sebagai dasar revisi instrumen sebelum dipakai sebagai pre-test dan post-test.</p>'
               '<ol class="rapat"><li>Lembar soal dicetak dan dibagikan; siswa mengerjakan secara tertulis per tahap tanpa bantuan.</li>'
               '<li>Jawaban dinilai peneliti dengan rubrik penskoran per tahap (skor parsial untuk langkah yang benar).</li>'
               '<li>Lembar jawaban dipindai/difoto sebagai lampiran.</li>'
               '<li>Skor direkap per soal, per indikator, dan per tahap untuk melihat bagian yang sulit.</li></ol>')

    # 3. Skor per tahap
    isi.append('<h2>3. Skor per Tahap Rubrik</h2>')
    for s in siswa:
        baris = ""
        for i, (k, per) in enumerate(zip(KISI, s["skor"]), 1):
            sel_tahap = "".join(f'<td class="angka">{sel(v)} / {t["skor"]}<br><span class="tahap-label">{escape(t["label"])}</span></td>'
                                for v, t in zip(per, k["tahap"]))
            sel_tahap += '<td></td>' * (6 - len(k["tahap"]))
            jml = sum(per) if terisi else None
            baris += (f'<tr><td><b>Soal {i}</b><br><span class="tahap-label">{escape(k["judul"])}</span></td>{sel_tahap}'
                      f'<td class="angka"><b>{sel(jml)}</b> / {MAKS_SOAL[i - 1]}</td></tr>')
        total = sum(sum(p) for p in s["skor"]) if terisi else None
        nilai = total / MAKS_TOTAL * 100 if terisi else None
        kode = escape(s["kode"]) if s["kode"] else '<span class="isian" style="min-width:25mm">&nbsp;</span>'
        isi.append(f'<div class="blok"><p style="margin:6px 0 4px"><b>Kode siswa:</b> {kode}</p><table class="tahap-tabel"><colgroup><col class="c-soal">' + '<col class="c-tahap">' * 6 + '<col class="c-jml"></colgroup>'
                   '<tr><th>Soal</th>' + "".join(f'<th class="angka">Tahap {m}</th>' for m in range(1, 7)) +
                   '<th class="angka">Skor soal</th></tr>' + baris +
                   f'<tr><th colspan="7">Total skor (nilai = total ÷ {MAKS_TOTAL} × 100)</th>'
                   f'<th class="angka">{sel(total)} / {MAKS_TOTAL}<br>nilai {sel(nilai)}</th></tr></table></div>')
    if not terisi:
        isi.append('<p class="kecil">Bila siswa lebih dari satu, tabel ini diulang untuk setiap kode siswa.</p>')

    # 4. Capaian per indikator
    rata_soal = [sum(sum(s["skor"][i]) for s in siswa) / n if terisi else None for i in range(len(KISI))]
    isi.append('<h2>4. Capaian per Indikator</h2><table><tr><th>Soal · Indikator</th><th class="angka">Rata-rata skor</th>'
               '<th class="angka">Skor maks.</th><th class="angka">Capaian</th></tr>' +
               "".join(f'<tr><td>Soal {i + 1} · {escape(k["indikator"])}</td><td class="angka">{sel(r)}</td>'
                       f'<td class="angka">{MAKS_SOAL[i]}</td><td class="angka">{sel(r / MAKS_SOAL[i] * 100 if r is not None else None)} %</td></tr>'
                       for i, (k, r) in enumerate(zip(KISI, rata_soal))) + '</table>')

    # 5. Tahap yang paling sulit (capaian per tahap)
    isi.append('<h2>5. Capaian per Tahap (bagian yang sulit bagi siswa)</h2>')
    if terisi:
        daftar = []
        for i, k in enumerate(KISI):
            for m, t in enumerate(k["tahap"]):
                capai = sum(s["skor"][i][m] for s in siswa) / (n * t["skor"]) * 100
                daftar.append((capai, i + 1, m + 1, t["label"]))
        sulit = [d for d in sorted(daftar) if d[0] < 50]
        isi.append('<table><tr><th>Soal</th><th>Tahap</th><th class="angka">Capaian</th></tr>' +
                   "".join(f'<tr><td>Soal {s_}</td><td>Tahap {m} · {escape(lbl)}</td><td class="angka">{fmt(c)} %</td></tr>'
                           for c, s_, m, lbl in sorted(daftar)) + '</table>'
                   f'<p class="kecil">Tahap dengan capaian &lt; 50%: {len(sulit)} dari {len(daftar)}. '
                   'Tahap ini menjadi perhatian saat merevisi soal/rubrik dan saat merancang bantuan di aplikasi.</p>')
    else:
        isi.append('<p class="kecil">Diisi otomatis setelah skor per tahap dimasukkan: daftar tahap diurutkan dari capaian '
                   'terendah, untuk menunjukkan langkah yang paling sulit bagi siswa.</p>' + kotak(None, "", 2))

    # 6. Catatan kualitatif
    isi.append('<h2>6. Catatan Pelaksanaan</h2>'
               '<p><b>a. Keterbacaan soal</b> (kata/kalimat yang membingungkan, pertanyaan siswa saat mengerjakan)</p>'
               + kotak(catatan, "keterbacaan") +
               '<p><b>b. Waktu pengerjaan</b> (cukup/kurang, soal yang paling lama)</p>' + kotak(catatan, "waktu_pengerjaan", 2) +
               '<p><b>c. Kendala lain</b></p>' + kotak(catatan, "kendala", 2))

    # 7. Kesimpulan & revisi
    isi.append('<h2>7. Kesimpulan dan Rencana Revisi Instrumen</h2>'
               '<table><tr><th style="width:14%">Soal</th><th>Rencana revisi (kosongkan bila tidak perlu)</th></tr>' +
               "".join(f'<tr><td>Soal {i}</td><td>{isian(catatan, f"revisi_soal_{i}", "min-width:100%")}</td></tr>'
                       for i in range(1, len(KISI) + 1)) + '</table>'
               '<p><b>Kesimpulan</b></p>' + kotak(catatan, "kesimpulan"))

    # 8. Lampiran
    isi.append('<h2>8. Lampiran</h2><ol class="rapat">'
               '<li>Lembar soal uji coba (Soal Tes Mathematical Literacy.pdf)</li>'
               '<li>Rubrik penskoran per tahap (Rubrik Penskoran Mathematical Literacy.pdf)</li>'
               '<li>Pindaian/foto lembar jawaban siswa (Google Drive)</li></ol>'
               f'<p class="kecil" style="margin-top:14mm;text-align:right">{PENYUSUN}</p>')
    return halaman("Laporan Uji Coba Mathematical Literacy", "".join(isi)).replace(GAYA, GAYA_LAPORAN)


if __name__ == "__main__":
    data = baca_skor(sys.argv[1]) if len(sys.argv) > 1 else None
    catatan = json.load(open(sys.argv[2], encoding="utf-8")) if len(sys.argv) > 2 else None
    os.makedirs(KELUAR, exist_ok=True)
    with open(os.path.join(KELUAR, NAMA_FILE), "w", encoding="utf-8") as f:
        f.write(laporan(data, catatan))
    print("tersimpan:", os.path.join("docs", "laporan-uji-coba-literasi", NAMA_FILE), "| siswa:", len(data) if data else "templat kosong")
