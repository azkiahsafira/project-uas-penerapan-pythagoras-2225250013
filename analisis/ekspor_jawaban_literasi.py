"""
Menyiapkan penilaian tes Mathematical Literacy (uraian) dari data aplikasi.

Masukan : CSV ekspor tabel `hasil` dari Supabase (Table Editor -> hasil -> Export to CSV).
Keluaran:
  1. lembar_penilaian_literasi.html : untuk tiap siswa & tes (pre/post), soal + jawaban uraian siswa + rubrik per tahap
     dengan kotak skor. Buka di browser lalu cetak/isi; skor parsial tetap diberikan per tahap (pedoman dosen).
  2. skor_literasi.csv              : baris nama,kelompok,jenis dengan kolom s1..s4 KOSONG. Isi skor (0-6) tiap soal,
     lalu jalankan:  python analisis_literasi.py skor_literasi.csv
     Bila skor_literasi.csv sudah ada, file tidak ditimpa (skor yang sudah diketik aman); hasil ditulis ke
     skor_literasi_baru.csv.

Soal & rubrik dibaca dari sumber yang sama dengan aplikasi: src/data/soal-literasi.json dan scripts/kisi-literasi.json.
Hanya memakai library bawaan Python.

Pemakaian:  python ekspor_jawaban_literasi.py hasil.csv [--keluaran folder]
"""

import argparse
import csv
import json
import os
import sys
from html import escape

from analisis import KELOMPOK_UJI, baca_csv

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KISI = os.path.join(AKAR, "scripts", "kisi-literasi.json")
URUTAN_JENIS = {"pretest": 0, "posttest": 1}


def muat_kisi(path=KISI):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def jawaban_literasi(data):
    """Ambil baris pre/post-test berjenis uraian literasi, tanpa data demo; urut per siswa lalu pre -> post.
    Bila satu tes tercatat ganda, yang dipakai yang pertama (sama dengan aturan analisis)."""
    terpilih, sudah = [], set()
    for d in sorted(data, key=lambda x: x["selesai"]):
        if d["jenis"] not in URUTAN_JENIS or d["jawaban"].get("_instrumen") != "literasi":
            continue
        if d["kelompok"] == KELOMPOK_UJI:
            continue
        kunci = (d["nama"].lower(), d["jenis"])
        if kunci in sudah:
            continue
        sudah.add(kunci)
        terpilih.append(d)
    return sorted(terpilih, key=lambda d: (d["nama"].lower(), URUTAN_JENIS[d["jenis"]]))


def lembar_html(baris, kisi):
    bagian = []
    for d in baris:
        kartu = []
        for i, k in enumerate(kisi):
            jawab = str(d["jawaban"].get(str(i), "")).strip() or "(tidak dijawab)"
            tahap = "".join(f'<tr><td>Tahap {n}</td><td>{escape(t["isi"])}</td><td class="c">{t["skor"]}</td><td></td></tr>'
                            for n, t in enumerate(k["tahap"], 1))
            kartu.append(
                f'<h3>Soal {i + 1} · {escape(k["indikator"])}</h3>'
                f'<p><b>{escape(k["judul"])}.</b> {escape(k["teks"])} <b>{escape(k["tanya"])}</b></p>'
                f'<div class="jawab"><b>Jawaban siswa:</b><br>{escape(jawab).replace(chr(10), "<br>")}</div>'
                f'<table><tr><th>Tahap</th><th>Kisi-kisi</th><th class="c">Maks</th><th class="c">Skor</th></tr>{tahap}'
                f'<tr><th colspan="2">Jumlah soal {i + 1}</th><th class="c">6</th><th></th></tr></table>')
        judul = f'{escape(d["nama"])} · {escape(d["kelompok"] or "-")} · {"Pre-test" if d["jenis"] == "pretest" else "Post-test"}'
        bagian.append(f'<section><h2>{judul}</h2>{"".join(kartu)}'
                      '<p class="total">Total (s1 + s2 + s3 + s4) = ……… / 24</p></section>')
    gaya = ("body{font-family:'Segoe UI',Arial,sans-serif;color:#1d2a4d;font-size:11pt;margin:24px}"
            "section{break-after:page}h2{color:#1d4ed8;border-bottom:2px solid #bfdbfe}"
            ".jawab{border:1px solid #f9a8d4;background:#fff5fa;border-radius:8px;padding:8px;margin:6px 0}"
            "table{border-collapse:collapse;width:100%;font-size:10pt;margin-bottom:10px}"
            "th,td{border:1px solid #b7c3dc;padding:4px 6px;text-align:left;vertical-align:top}"
            "th{background:#eef6ff}.c{text-align:center;width:9%}.total{font-weight:700}")
    return (f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Lembar Penilaian Mathematical Literacy</title>'
            f'<style>{gaya}</style></head><body><h1>Lembar Penilaian Tes Mathematical Literacy</h1>'
            f'<p>Jumlah lembar: {len(baris)} · skor per soal 0–6 sesuai rubrik; skor parsial tetap diberikan per tahap.</p>'
            f'{"".join(bagian)}</body></html>')


def tulis_csv_skor(baris, path):
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["nama", "kelompok", "jenis", "s1", "s2", "s3", "s4"])
        for d in baris:
            w.writerow([d["nama"], d["kelompok"], d["jenis"], "", "", "", ""])


def main():
    parser = argparse.ArgumentParser(description="Siapkan lembar penilaian jawaban uraian Mathematical Literacy")
    parser.add_argument("csv", help="CSV ekspor tabel hasil dari Supabase")
    parser.add_argument("--keluaran", default=".", help="folder hasil (bawaan: folder ini)")
    args = parser.parse_args()
    if not os.path.exists(args.csv):
        sys.exit(f"File tidak ditemukan: {args.csv}")
    baris = jawaban_literasi(baca_csv(args.csv))
    if not baris:
        sys.exit("Belum ada jawaban tes Mathematical Literacy (uraian) di file tersebut.")
    os.makedirs(args.keluaran, exist_ok=True)
    with open(os.path.join(args.keluaran, "lembar_penilaian_literasi.html"), "w", encoding="utf-8") as f:
        f.write(lembar_html(baris, muat_kisi()))
    nama_csv = "skor_literasi.csv"
    if os.path.exists(os.path.join(args.keluaran, nama_csv)):
        nama_csv = "skor_literasi_baru.csv"  # jangan menimpa skor yang sudah diketik
    tulis_csv_skor(baris, os.path.join(args.keluaran, nama_csv))
    print(f"{len(baris)} lembar jawaban siap dinilai: lembar_penilaian_literasi.html dan {nama_csv}")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
