"""
Analisis tes Mathematical Literacy (4 soal uraian, kisi-kisi dari dosen) untuk uji efektivitas aplikasi.

Jawaban uraian dinilai MANUAL oleh peneliti dengan rubrik (docs/instrumen-cetak-literasi/2-Rubrik-...pdf),
lalu skor tiap soal (0-6) diketik ke CSV dengan format templat_skor_literasi.csv:

    nama,kelompok,jenis,s1,s2,s3,s4
    8A-01,Belajar dengan aplikasi,pretest,2,1,3,0

  nama      : kode siswa (jangan nama asli)
  kelompok  : "Belajar dengan aplikasi" atau "Diajar langsung"
  jenis     : pretest atau posttest
  s1..s4    : skor soal 1 (Reasoning), 2 (Formulating), 3 (Employing), 4 (Interpreting & Evaluating), masing-masing 0-6

Menghitung skor total (maks 24), selisih, N-gain, skor per indikator pre -> post, dan perbandingan kelompok.

Pemakaian:  python analisis_literasi.py skor_literasi.csv [--keluaran hasil_analisis]
Hanya memakai library bawaan Python.
"""

import argparse
import csv
import os
import sys

from analisis import KELOMPOK_UJI, cetak_tabel, fmt, kategori_n_gain, n_gain, rata, svg_batang

INDIKATOR_ML = ["Mathematical Reasoning", "Formulating", "Employing", "Interpreting & Evaluating"]
SKOR_MAKS = 6  # per soal; total 24
TOTAL_MAKS = SKOR_MAKS * len(INDIKATOR_ML)


def baca_skor(path):
    """Baca CSV skor rubrik; tiap baris = satu tes (pre/post) satu siswa."""
    data, peringatan = [], []
    with open(path, encoding="utf-8-sig", newline="") as f:
        for i, b in enumerate(csv.DictReader(f), start=2):
            jenis = (b.get("jenis") or "").strip().lower().replace("-", "")
            if jenis not in ("pretest", "posttest"):
                peringatan.append(f"baris {i}: jenis '{b.get('jenis')}' bukan pretest/posttest, dilewati.")
                continue
            skor = []
            for k in range(1, len(INDIKATOR_ML) + 1):
                teks = (b.get(f"s{k}") or "").strip().replace(",", ".")
                try:
                    n = float(teks)
                except ValueError:
                    n = None
                if n is None or not 0 <= n <= SKOR_MAKS:
                    peringatan.append(f"baris {i}: s{k} = '{teks}' harus angka 0-{SKOR_MAKS}; dianggap 0.")
                    n = 0
                skor.append(n)
            data.append({"nama": (b.get("nama") or "").strip(), "kelompok": (b.get("kelompok") or "").strip(),
                         "jenis": jenis, "skor": skor})
    return data, peringatan


def rekap(data):
    """Gabungkan pre & post per siswa. Bila satu tes tercatat dua kali, yang dipakai yang pertama."""
    siswa, peringatan = {}, []
    for d in data:
        s = siswa.setdefault(d["nama"].lower(), {"nama": d["nama"], "kelompok": d["kelompok"]})
        if d["jenis"] in s:
            peringatan.append(f"{d['nama']}: {d['jenis']} tercatat lebih dari sekali; yang dipakai baris pertama.")
            continue
        s[d["jenis"]] = d["skor"]
        s["kelompok"] = s["kelompok"] or d["kelompok"]
    hasil = []
    for s in siswa.values():
        pre, post = s.get("pretest"), s.get("posttest")
        tot_pre = sum(pre) if pre else None
        tot_post = sum(post) if post else None
        persen = lambda t: None if t is None else 100 * t / TOTAL_MAKS
        hasil.append({
            "nama": s["nama"], "kelompok": s["kelompok"], "pre": pre, "post": post,
            "total_pre": tot_pre, "total_post": tot_post,
            "selisih": None if tot_pre is None or tot_post is None else tot_post - tot_pre,
            "n_gain": n_gain(persen(tot_pre), persen(tot_post)),
        })
    return hasil, peringatan


def laporan(hasil):
    print("=" * 70)
    print("ANALISIS TES MATHEMATICAL LITERACY (4 soal uraian, skor maks 24)")
    print("=" * 70)
    cetak_tabel(
        "1. SKOR TOTAL, SELISIH, DAN N-GAIN",
        ["Nama", "Kelompok", "Pre (/24)", "Post (/24)", "Selisih", "N-gain", "Kategori"],
        [[h["nama"], h["kelompok"], fmt(h["total_pre"], 1), fmt(h["total_post"], 1), fmt(h["selisih"], 1),
          fmt(h["n_gain"], 2), kategori_n_gain(h["n_gain"])] for h in hasil],
    )
    print("   N-gain dihitung dari persentase skor (skor/24 x 100). Kategori Hake: >= 0,7 tinggi; 0,3-0,7 sedang; < 0,3 rendah.")

    def sel(h, k):
        pre = None if h["pre"] is None else h["pre"][k]
        post = None if h["post"] is None else h["post"][k]
        return f"{fmt(pre, 1)} -> {fmt(post, 1)}"

    cetak_tabel(
        "2. SKOR PER INDIKATOR (0-6, pre -> post)",
        ["Nama", "Kelompok", *INDIKATOR_ML],
        [[h["nama"], h["kelompok"], *(sel(h, k) for k in range(len(INDIKATOR_ML)))] for h in hasil],
    )
    kelompok = sorted({h["kelompok"] for h in hasil if h["kelompok"]})
    if len(kelompok) > 1:
        cetak_tabel(
            "3. PERBANDINGAN KELOMPOK (rata-rata)",
            ["Kelompok", "Siswa", "Pre", "Post", "N-gain", *INDIKATOR_ML],
            [
                [k, len(hs := [h for h in hasil if h["kelompok"] == k]), fmt(rata(h["total_pre"] for h in hs), 1),
                 fmt(rata(h["total_post"] for h in hs), 1), fmt(rata(h["n_gain"] for h in hs), 2),
                 *(f"{fmt(rata(h['pre'][i] for h in hs if h['pre']), 1)} -> {fmt(rata(h['post'][i] for h in hs if h['post']), 1)}"
                   for i in range(len(INDIKATOR_ML)))]
                for k in kelompok
            ],
        )
        print("   Dengan 1 siswa per kelompok, hasil dibaca sebagai perbandingan dua kasus (deskriptif), bukan uji statistik.")
    belum = [h["nama"] for h in hasil if h["pre"] is None or h["post"] is None]
    if belum:
        print("\nCatatan: pre-test/post-test belum lengkap untuk: " + ", ".join(belum))


def simpan(hasil, folder):
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, "rekap_mathematical_literacy.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["nama", "kelompok", "total_pre", "total_post", "selisih", "n_gain", "kategori",
                    *(f"pre_{k}" for k in INDIKATOR_ML), *(f"post_{k}" for k in INDIKATOR_ML)])
        for h in hasil:
            w.writerow([h["nama"], h["kelompok"], h["total_pre"], h["total_post"], h["selisih"],
                        None if h["n_gain"] is None else round(h["n_gain"], 3), kategori_n_gain(h["n_gain"]),
                        *(h["pre"] or [None] * 4), *(h["post"] or [None] * 4)])
    warna = [("#9aa6f0", "#4b5bdc"), ("#f6b3cf", "#db2777"), ("#a7e3c3", "#1e7a3c")]
    seri = []
    for k, kel in enumerate(sorted({h["kelompok"] or "-" for h in hasil})):
        hs = [h for h in hasil if (h["kelompok"] or "-") == kel]
        w_pre, w_post = warna[k % len(warna)]
        bulat = lambda v: None if v is None else round(v, 1)
        seri.append((f"{kel} - pre", w_pre, [bulat(rata(h["pre"][i] for h in hs if h["pre"])) for i in range(4)]))
        seri.append((f"{kel} - post", w_post, [bulat(rata(h["post"][i] for h in hs if h["post"])) for i in range(4)]))
    svg_batang("Mathematical Literacy per Indikator (skor 0-6)", INDIKATOR_ML, seri, SKOR_MAKS,
               os.path.join(folder, "grafik_mathematical_literacy.svg"))


def main():
    parser = argparse.ArgumentParser(description="Analisis tes Mathematical Literacy (skor rubrik)")
    parser.add_argument("csv", help="CSV skor rubrik (lihat templat_skor_literasi.csv)")
    parser.add_argument("--keluaran", default="hasil_analisis", help="folder untuk rekap CSV dan grafik")
    args = parser.parse_args()
    if not os.path.exists(args.csv):
        sys.exit(f"File tidak ditemukan: {args.csv}")
    data, peringatan = baca_skor(args.csv)
    uji = [d for d in data if d["kelompok"] == KELOMPOK_UJI]
    data = [d for d in data if d["kelompok"] != KELOMPOK_UJI]
    if uji:
        print(f"Catatan: {len(uji)} baris kelompok '{KELOMPOK_UJI}' (demo/uji coba) tidak ikut dianalisis.")
    if not data:
        sys.exit("Tidak ada skor pre-test/post-test di file tersebut.")
    hasil, p2 = rekap(data)
    laporan(hasil)
    for p in peringatan + p2:
        print("PERINGATAN: " + p)
    simpan(hasil, args.keluaran)
    print(f"\nFile tersimpan di folder '{args.keluaran}': rekap_mathematical_literacy.csv, grafik_mathematical_literacy.svg")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
