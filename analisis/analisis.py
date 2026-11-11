"""
Analisis data penelitian "Penerapan Teorema Pythagoras".

Membaca file CSV hasil tes (ekspor dari Supabase atau dari menu Tes di
aplikasi), lalu menghitung:
  1. Nilai pre-test, post-test, selisih, dan N-gain tiap siswa
  2. Ketercapaian tiap indikator soal (pre vs post)
  3. Skor beban kognitif Leppink (IL, EL, GL) dan interpretasinya
  4. Perbandingan antarkelompok (hanya bila data berisi lebih dari satu kelompok)
  4b. Literasi matematis per proses (merumuskan, menerapkan, menafsirkan): skor pre, post, N-gain
  5. (opsional, --aktivitas) Waktu & jumlah salah per langkah materi, total
     waktu tiap sesi, serta hasil latihan pertemuan 4 (implementasi), dari
     tabel `aktivitas`

Keluaran:
  - laporan di terminal
  - rekap_siswa.csv          (bisa dibuka di Excel)
  - grafik_nilai.svg         (pre vs post per siswa)
  - grafik_beban.svg         (IL, EL, GL per siswa)
  - grafik_indikator.svg     (jumlah siswa benar per indikator)
  - rekap_literasi.csv       (skor tiap proses literasi matematis per siswa)
  - grafik_literasi.svg      (rata-rata skor proses literasi per kelompok, pre vs post)

Cara pakai:
  python analisis.py data.csv
  python analisis.py data.csv --keluaran folder_hasil
  python analisis.py data.csv --aktivitas aktivitas.csv
  python analisis.py data.csv --kertas data_kertas.csv   (jawaban lembar kertas)

Hanya memakai library bawaan Python, tidak perlu install apa pun.
"""

import argparse
import csv
import json
import os
import sys
from html import escape

# ---------------------------------------------------------------------------
# Kunci jawaban. HARUS sama dengan src/tes.js di aplikasi.
# Script akan memberi peringatan jika nilai hasil hitung ulang berbeda dengan
# nilai yang tersimpan (tanda kunci di sini tidak sinkron dengan aplikasi).
# ---------------------------------------------------------------------------
INDIKATOR = [
    "Mengenali sisi miring",
    "Menghitung kuadrat",
    "Menghitung akar kuadrat",
    "Bentuk rumus Pythagoras",
    "Menghitung sisi miring",
    "Menghitung sisi siku-siku",
    "Soal cerita: sisi siku-siku",
    "Soal cerita: jarak (sisi miring)",
    "Tripel Pythagoras",
    "Soal cerita: diagonal layar",
]

KUNCI = {
    "pretest": [
        "Sisi yang berhadapan dengan sudut siku-siku", 81, 11, "c² = a² + b²",
        15, 15, "8 m", 13, "5, 12, 13", 20,
    ],
    "posttest": [
        "Sisi miring (hipotenusa)", 64, 14, "a² = c² − b²",
        20, 24, "40 m", 17, "7, 24, 25", 45,
    ],
}

# Huruf kunci untuk soal pilihan pada lembar kertas (urutan opsi sama dengan src/tes.js).
# None = soal isian angka.
KUNCI_HURUF = {
    "pretest": ["B", None, None, "A", None, None, "B", None, "B", None],
    "posttest": ["C", None, None, "B", None, None, "B", None, "A", None],
}

# Proses literasi matematis (OECD/PISA, dipakai juga di materi PDF): tiap nomor soal dikelompokkan ke proses
# UTAMA yang diukurnya. Soal tes TIDAK diubah; ini hanya cara membaca hasil. Urutan = nomor soal 1-10.
#   Merumuskan  : mengubah situasi/gambar menjadi model matematika (mengenali sisi miring, memilih rumus,
#                 menyadari bahwa jarak terpendek / diagonal = sisi miring)
#   Menerapkan  : menjalankan prosedur matematika (kuadrat, akar, menghitung sisi)
#   Menafsirkan : menilai hasil dalam konteks (memilih jawaban yang masuk akal, memeriksa apakah tiga
#                 ukuran membentuk segitiga siku-siku)
PROSES_LITERASI = [
    "Merumuskan",   # 1 mengenali sisi miring
    "Menerapkan",   # 2 kuadrat
    "Menerapkan",   # 3 akar kuadrat
    "Merumuskan",   # 4 bentuk rumus
    "Menerapkan",   # 5 menghitung sisi miring
    "Menerapkan",   # 6 menghitung sisi siku-siku
    "Menafsirkan",  # 7 soal cerita tangga/layang-layang: pilih jawaban yang masuk akal
    "Merumuskan",   # 8 soal cerita jarak terpendek = sisi miring
    "Menafsirkan",  # 9 tripel Pythagoras: apakah membentuk segitiga siku-siku?
    "Merumuskan",   # 10 soal cerita diagonal layar = sisi miring
]
URUTAN_PROSES = ["Merumuskan", "Menerapkan", "Menafsirkan"]


def skor_proses(benar):
    """Persentase benar per proses literasi (0-100) dari daftar benar/salah 10 butir."""
    if not benar:
        return {p: None for p in URUTAN_PROSES}
    hasil = {}
    for p in URUTAN_PROSES:
        butir = [b for b, q in zip(benar, PROSES_LITERASI) if q == p]
        hasil[p] = round(100 * sum(butir) / len(butir))
    return hasil


NAMA_BEBAN = {
    "IL": "Intrinsic load",
    "EL": "Extraneous load",
    "GL": "Germane load",
}


# ---------------------------------------------------------------------------
# Membaca data
# ---------------------------------------------------------------------------
def ke_angka(teks):
    """Ubah teks menjadi float; koma dianggap titik desimal. None jika gagal."""
    if teks is None:
        return None
    teks = str(teks).strip().replace(",", ".")
    if teks == "":
        return None
    try:
        return float(teks)
    except ValueError:
        return None


def ambil(baris, *nama_kolom):
    """Ambil nilai kolom pertama yang ada (ekspor Supabase & aplikasi beda nama kolom)."""
    for nama in nama_kolom:
        if nama in baris and baris[nama] not in (None, ""):
            return baris[nama]
    return None


def baca_csv(path):
    # utf-8-sig agar BOM dari file ekspor aplikasi ikut terbaca dengan benar
    with open(path, encoding="utf-8-sig", newline="") as f:
        baris_baris = list(csv.DictReader(f))

    data = []
    for b in baris_baris:
        jenis = ambil(b, "jenis")
        if jenis not in ("pretest", "posttest", "leppink"):
            continue
        try:
            jawaban = json.loads(ambil(b, "jawaban") or "{}")
        except json.JSONDecodeError:
            jawaban = {}
        data.append({
            "jenis": jenis,
            "nama": (ambil(b, "nama") or "").strip(),
            "kelas": ambil(b, "kelas") or "",
            "sekolah": ambil(b, "sekolah") or "",
            "kelompok": ambil(b, "kelompok") or "",
            "selesai": ambil(b, "selesai", "waktu_selesai") or "",
            "durasi": ke_angka(ambil(b, "durasi_detik")),
            "skor": ke_angka(ambil(b, "skor")),
            "IL": ke_angka(ambil(b, "il", "IL")),
            "EL": ke_angka(ambil(b, "el", "EL")),
            "GL": ke_angka(ambil(b, "gl", "GL")),
            "jawaban": jawaban,
        })
    return data


def baca_kertas(path):
    """Baca jawaban dari lembar kertas (templat_kertas.csv) untuk siswa yang diajar langsung.
    Kolom: jenis, nama, kelas, sekolah, kelompok, tanggal, durasi_menit,
    s1..s10 (huruf A-D atau angka) untuk pretest/posttest, b1..b10 (0-10) untuk leppink."""
    with open(path, encoding="utf-8-sig", newline="") as f:
        baris_baris = list(csv.DictReader(f))
    data = []
    for b in baris_baris:
        jenis = (ambil(b, "jenis") or "").strip().lower().replace("-", "")
        if jenis not in ("pretest", "posttest", "leppink"):
            continue
        menit = ke_angka(ambil(b, "durasi_menit"))
        d = {
            "jenis": jenis,
            "nama": (ambil(b, "nama") or "").strip(),
            "kelas": ambil(b, "kelas") or "8",
            "sekolah": ambil(b, "sekolah") or "",
            "kelompok": ambil(b, "kelompok") or "Diajar langsung",
            "selesai": ambil(b, "tanggal") or "",
            "durasi": menit * 60 if menit is not None else None,
            "skor": None,
            "IL": None, "EL": None, "GL": None,
            "jawaban": {},
        }
        if jenis == "leppink":
            skor = [ke_angka(ambil(b, f"b{i}")) for i in range(1, 11)]
            rata_bagian = lambda xs: (sum(xs) / len(xs)) if xs and None not in xs else None
            d["IL"], d["EL"], d["GL"] = rata_bagian(skor[0:3]), rata_bagian(skor[3:6]), rata_bagian(skor[6:10])
        else:
            d["jawaban"] = {str(i): (ambil(b, f"s{i + 1}") or "").strip() for i in range(10)}
        data.append(d)
    return data


# ---------------------------------------------------------------------------
# Perhitungan
# ---------------------------------------------------------------------------
def koreksi(jenis, jawaban):
    """Kembalikan daftar True/False per nomor soal."""
    hasil = []
    for i, kunci in enumerate(KUNCI[jenis]):
        j = jawaban.get(str(i))
        huruf = KUNCI_HURUF[jenis][i]
        if huruf and isinstance(j, str) and j.strip().upper() in ("A", "B", "C", "D"):
            # jawaban dari lembar kertas berupa huruf
            hasil.append(j.strip().upper() == huruf)
        elif isinstance(kunci, (int, float)):
            n = ke_angka(j)
            hasil.append(n is not None and abs(n - kunci) < 0.01)
        else:
            hasil.append(j == kunci)
    return hasil


def n_gain(pre, post):
    """N-gain Hake: (post - pre) / (100 - pre)."""
    if pre is None or post is None:
        return None
    if pre >= 100:
        return None  # tidak terdefinisi jika pre-test sudah 100
    return (post - pre) / (100 - pre)


def kategori_n_gain(g):
    if g is None:
        return "-"
    if g >= 0.7:
        return "tinggi"
    if g >= 0.3:
        return "sedang"
    return "rendah"


def kategori_beban(nilai):
    """Skala 0-10 dibagi tiga sama besar."""
    if nilai is None:
        return "-"
    if nilai < 3.34:
        return "rendah"
    if nilai < 6.67:
        return "sedang"
    return "tinggi"


def rata(nilai):
    nilai = [n for n in nilai if n is not None]
    return sum(nilai) / len(nilai) if nilai else None


KELOMPOK_UJI = "Uji coba peneliti"  # kode demo/uji coba (alur.js); datanya tidak ikut dianalisis


def rekap_per_siswa(data):
    """Gabungkan pre, post, dan leppink per siswa. Bila satu tes dikerjakan lebih dari sekali, yang dipakai
    adalah percobaan PERTAMA (pre-test ulang sesudah belajar akan membuat N-gain bias)."""
    siswa = {}
    peringatan = []
    for d in sorted(data, key=lambda x: x["selesai"]):
        kunci = d["nama"].lower()
        s = siswa.setdefault(kunci, {"nama": d["nama"], "kelas": d["kelas"], "kelompok": d["kelompok"]})
        if d["jenis"] in s:
            peringatan.append(f"{d['nama']} mengerjakan {d['jenis']} lebih dari sekali; yang dipakai percobaan pertama.")
            continue
        s[d["jenis"]] = d
        s["kelas"] = d["kelas"] or s["kelas"]
        s["kelompok"] = d["kelompok"] or s["kelompok"]

    rekap = []
    for s in siswa.values():
        r = {"nama": s["nama"], "kelas": s["kelas"], "kelompok": s["kelompok"]}
        for jenis in ("pretest", "posttest"):
            d = s.get(jenis)
            if not d:
                r[jenis] = None
                r[jenis + "_benar"] = None
                r[jenis + "_menit"] = None
                continue
            benar = koreksi(jenis, d["jawaban"])
            hitung = round(sum(benar) / len(benar) * 100)
            if d["skor"] is not None and round(d["skor"]) != hitung:
                peringatan.append(
                    f"{s['nama']} ({jenis}): nilai tersimpan {d['skor']:.0f}, hitung ulang {hitung}. "
                    "Kunci jawaban di analisis.py mungkin tidak sama dengan src/tes.js."
                )
            r[jenis] = hitung
            r[jenis + "_benar"] = benar
            r[jenis + "_menit"] = round(d["durasi"] / 60, 1) if d["durasi"] is not None else None
        r["selisih"] = r["posttest"] - r["pretest"] if r["pretest"] is not None and r["posttest"] is not None else None
        r["n_gain"] = n_gain(r["pretest"], r["posttest"])
        r["literasi_pre"] = skor_proses(r["pretest_benar"])
        r["literasi_post"] = skor_proses(r["posttest_benar"])
        lp = s.get("leppink")
        for k in ("IL", "EL", "GL"):
            r[k] = lp[k] if lp else None
        rekap.append(r)
    return rekap, peringatan


# ---------------------------------------------------------------------------
# Laporan terminal
# ---------------------------------------------------------------------------
def fmt(n, desimal=0):
    if n is None:
        return "-"
    return f"{n:.{desimal}f}"


def cetak_tabel(judul, kolom, baris):
    print(f"\n{judul}")
    lebar = [max(len(str(k)), *(len(str(b[i])) for b in baris)) if baris else len(str(k)) for i, k in enumerate(kolom)]
    garis = "-+-".join("-" * w for w in lebar)
    print(garis)
    print(" | ".join(str(k).ljust(w) for k, w in zip(kolom, lebar)))
    print(garis)
    for b in baris:
        print(" | ".join(str(v).ljust(w) for v, w in zip(b, lebar)))
    print(garis)


def laporan(rekap, peringatan):
    print("=" * 70)
    print("ANALISIS HASIL PENELITIAN - PENERAPAN TEOREMA PYTHAGORAS")
    print("=" * 70)
    print(f"Jumlah siswa: {len(rekap)}")

    cetak_tabel(
        "1. NILAI PRE-TEST, POST-TEST, DAN N-GAIN",
        ["Nama", "Kelas", "Kelompok", "Pre", "Post", "Selisih", "N-gain", "Kategori"],
        [
            [r["nama"], r["kelas"], r["kelompok"], fmt(r["pretest"]), fmt(r["posttest"]),
             fmt(r["selisih"]), fmt(r["n_gain"], 2), kategori_n_gain(r["n_gain"])]
            for r in rekap
        ],
    )
    print("   N-gain = (post - pre) / (100 - pre). Kategori Hake: >= 0,7 tinggi; 0,3-0,7 sedang; < 0,3 rendah.")

    cetak_tabel(
        "2. DURASI PENGERJAAN (MENIT)",
        ["Nama", "Pre-test", "Post-test"],
        [[r["nama"], fmt(r["pretest_menit"], 1), fmt(r["posttest_menit"], 1)] for r in rekap],
    )

    baris_ind = []
    for i, ind in enumerate(INDIKATOR):
        pre = [r["pretest_benar"][i] for r in rekap if r["pretest_benar"]]
        post = [r["posttest_benar"][i] for r in rekap if r["posttest_benar"]]
        baris_ind.append([i + 1, ind, PROSES_LITERASI[i], f"{sum(pre)}/{len(pre)}", f"{sum(post)}/{len(post)}"])
    cetak_tabel("3. KETERCAPAIAN INDIKATOR (jumlah siswa menjawab benar)", ["No", "Indikator", "Proses literasi", "Pre", "Post"], baris_ind)

    laporan_literasi(rekap)

    cetak_tabel(
        "4. BEBAN KOGNITIF LEPPINK (skala 0-10)",
        ["Nama", "Kelompok", "IL", "EL", "GL"],
        [
            [r["nama"], r["kelompok"],
             f"{fmt(r['IL'], 2)} ({kategori_beban(r['IL'])})",
             f"{fmt(r['EL'], 2)} ({kategori_beban(r['EL'])})",
             f"{fmt(r['GL'], 2)} ({kategori_beban(r['GL'])})"]
            for r in rekap
        ],
    )
    print("   Harapan (Activation/Balance Model): IL dikelola, EL serendah mungkin, GL setinggi mungkin.")

    kelompok = sorted({r["kelompok"] for r in rekap if r["kelompok"]})
    if len(kelompok) > 1:
        cetak_tabel(
            "5. PERBANDINGAN KELOMPOK (rata-rata)",
            ["Kelompok", "Siswa", "Pre", "Post", "N-gain", "IL", "EL", "GL"],
            [
                [k, len(rs := [r for r in rekap if r["kelompok"] == k]),
                 fmt(rata(r["pretest"] for r in rs)), fmt(rata(r["posttest"] for r in rs)),
                 fmt(rata(r["n_gain"] for r in rs), 2), fmt(rata(r["IL"] for r in rs), 2),
                 fmt(rata(r["EL"] for r in rs), 2), fmt(rata(r["GL"] for r in rs), 2)]
                for k in kelompok
            ],
        )

    belum = [r["nama"] for r in rekap if r["pretest"] is None or r["posttest"] is None or r["IL"] is None]
    if belum:
        print("\nCatatan: data belum lengkap (pre/post/kuesioner) untuk: " + ", ".join(belum))
    for p in peringatan:
        print("PERINGATAN: " + p)


def laporan_literasi(rekap):
    """Skor literasi matematis per proses (0-100) tiap siswa, pre -> post, dan N-gain per proses."""
    def sel(r, p):
        pre, post = r["literasi_pre"][p], r["literasi_post"][p]
        g = n_gain(pre, post)
        return f"{fmt(pre)} -> {fmt(post)}" + (f" (g {fmt(g, 2)})" if g is not None else "")

    cetak_tabel(
        "3b. LITERASI MATEMATIS PER PROSES (skor 0-100, pre -> post, N-gain)",
        ["Nama", "Kelompok", *URUTAN_PROSES],
        [[r["nama"], r["kelompok"], *(sel(r, p) for p in URUTAN_PROSES)] for r in rekap],
    )
    jumlah = {p: PROSES_LITERASI.count(p) for p in URUTAN_PROSES}
    print("   Butir: " + "; ".join(
        f"{p} = no {', '.join(str(i + 1) for i, q in enumerate(PROSES_LITERASI) if q == p)} ({jumlah[p]} soal)" for p in URUTAN_PROSES))
    print("   Tiap soal digolongkan ke proses UTAMA yang diukurnya; soal tes tidak diubah.")

    kelompok = sorted({r["kelompok"] for r in rekap if r["kelompok"]})
    if len(kelompok) > 1:
        cetak_tabel(
            "3c. LITERASI MATEMATIS PER KELOMPOK (rata-rata, pre -> post)",
            ["Kelompok", "Siswa", *URUTAN_PROSES],
            [
                [k, len(rs := [r for r in rekap if r["kelompok"] == k]),
                 *(f"{fmt(rata(r['literasi_pre'][p] for r in rs))} -> {fmt(rata(r['literasi_post'][p] for r in rs))}"
                   for p in URUTAN_PROSES)]
                for k in kelompok
            ],
        )


# ---------------------------------------------------------------------------
# Keluaran file
# ---------------------------------------------------------------------------
def simpan_literasi_csv(rekap, path):
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["nama", "kelompok", "proses_literasi", "nomor_soal", "pretest", "posttest", "selisih", "n_gain"])
        for r in rekap:
            for p in URUTAN_PROSES:
                pre, post = r["literasi_pre"][p], r["literasi_post"][p]
                g = n_gain(pre, post)
                nomor = " ".join(str(i + 1) for i, q in enumerate(PROSES_LITERASI) if q == p)
                w.writerow([r["nama"], r["kelompok"], p, nomor, pre, post,
                            None if pre is None or post is None else post - pre, None if g is None else round(g, 3)])


def simpan_rekap_csv(rekap, path):
    kolom = ["nama", "kelas", "kelompok", "pretest", "posttest", "selisih", "n_gain", "kategori_n_gain",
             "pretest_menit", "posttest_menit", "IL", "EL", "GL"]
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(kolom)
        for r in rekap:
            w.writerow([r["nama"], r["kelas"], r["kelompok"], r["pretest"], r["posttest"], r["selisih"],
                        None if r["n_gain"] is None else round(r["n_gain"], 3), kategori_n_gain(r["n_gain"]),
                        r["pretest_menit"], r["posttest_menit"], r["IL"], r["EL"], r["GL"]])


def svg_batang(judul, label_grup, seri, nilai_maks, path, satuan=""):
    """
    Grafik batang berkelompok sederhana dalam format SVG.
    seri: list of (nama_seri, warna, [nilai per grup])
    """
    lebar_grup = max(120, 40 * len(seri) + 40)
    kiri, atas, tinggi_area = 60, 50, 260
    lebar_legenda = sum(30 + 7 * len(nama) for nama, _, _ in seri)
    lebar = max(kiri + lebar_grup * len(label_grup) + 30, kiri + lebar_legenda + 20)
    tinggi = atas + tinggi_area + 90
    bagian = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{lebar}" height="{tinggi}" '
        f'font-family="Segoe UI, Arial, sans-serif" font-size="12">',
        f'<rect width="100%" height="100%" fill="#ffffff"/>',
        f'<text x="{kiri}" y="24" font-size="15" font-weight="bold" fill="#1c1f2a">{escape(judul)}</text>',
    ]
    # garis bantu
    for k in range(6):
        nilai = nilai_maks * k / 5
        y = atas + tinggi_area - tinggi_area * k / 5
        bagian.append(f'<line x1="{kiri}" y1="{y:.1f}" x2="{lebar - 20}" y2="{y:.1f}" stroke="#e3e5ec"/>')
        bagian.append(f'<text x="{kiri - 8}" y="{y + 4:.1f}" text-anchor="end" fill="#5b6172">{nilai:g}{satuan}</text>')
    # batang
    lebar_batang = 28
    for g, label in enumerate(label_grup):
        x0 = kiri + g * lebar_grup + (lebar_grup - lebar_batang * len(seri) - 4 * (len(seri) - 1)) / 2
        for s, (_, warna, nilai) in enumerate(seri):
            v = nilai[g]
            x = x0 + s * (lebar_batang + 4)
            if v is None:
                bagian.append(f'<text x="{x + lebar_batang / 2:.1f}" y="{atas + tinggi_area - 4}" text-anchor="middle" fill="#9aa0b0">-</text>')
                continue
            h = tinggi_area * min(v, nilai_maks) / nilai_maks
            y = atas + tinggi_area - h
            bagian.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{lebar_batang}" height="{h:.1f}" rx="3" fill="{warna}"/>')
            bagian.append(f'<text x="{x + lebar_batang / 2:.1f}" y="{y - 4:.1f}" text-anchor="middle" fill="#1c1f2a">{v:g}</text>')
        bagian.append(
            f'<text x="{kiri + g * lebar_grup + lebar_grup / 2:.1f}" y="{atas + tinggi_area + 18}" '
            f'text-anchor="middle" fill="#1c1f2a">{escape(str(label))}</text>'
        )
    # legenda
    lx = kiri
    for nama, warna, _ in seri:
        bagian.append(f'<rect x="{lx}" y="{tinggi - 28}" width="12" height="12" rx="2" fill="{warna}"/>')
        bagian.append(f'<text x="{lx + 18}" y="{tinggi - 18}" fill="#1c1f2a">{escape(nama)}</text>')
        lx += 30 + 7 * len(nama)
    bagian.append("</svg>")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(bagian))


def simpan_grafik(rekap, folder):
    nama = [r["nama"] for r in rekap]
    svg_batang(
        "Nilai Pre-test dan Post-test", nama,
        [("Pre-test", "#9aa6f0", [r["pretest"] for r in rekap]),
         ("Post-test", "#4b5bdc", [r["posttest"] for r in rekap])],
        100, os.path.join(folder, "grafik_nilai.svg"),
    )
    svg_batang(
        "Beban Kognitif Leppink (skala 0-10)", nama,
        [("Intrinsic (IL)", "#e0a33a", [r["IL"] for r in rekap]),
         ("Extraneous (EL)", "#c4302b", [r["EL"] for r in rekap]),
         ("Germane (GL)", "#1e7a3c", [r["GL"] for r in rekap])],
        10, os.path.join(folder, "grafik_beban.svg"),
    )
    pre = [sum(r["pretest_benar"][i] for r in rekap if r["pretest_benar"]) for i in range(len(INDIKATOR))]
    post = [sum(r["posttest_benar"][i] for r in rekap if r["posttest_benar"]) for i in range(len(INDIKATOR))]
    svg_batang(
        "Jumlah Siswa Menjawab Benar per Nomor Soal", [f"No {i + 1}" for i in range(len(INDIKATOR))],
        [("Pre-test", "#9aa6f0", pre), ("Post-test", "#4b5bdc", post)],
        max(1, len(rekap)), os.path.join(folder, "grafik_indikator.svg"),
    )
    # rata-rata skor proses literasi per kelompok (pre & post)
    warna = [("#9aa6f0", "#4b5bdc"), ("#f6b3cf", "#db2777"), ("#a7e3c3", "#1e7a3c")]
    seri = []
    for k, kel in enumerate(sorted({r["kelompok"] or "-" for r in rekap})):
        rs = [r for r in rekap if (r["kelompok"] or "-") == kel]
        w_pre, w_post = warna[k % len(warna)]
        bulat = lambda v: None if v is None else round(v)
        seri.append((f"{kel} - pre", w_pre, [bulat(rata(r["literasi_pre"][p] for r in rs)) for p in URUTAN_PROSES]))
        seri.append((f"{kel} - post", w_post, [bulat(rata(r["literasi_post"][p] for r in rs)) for p in URUTAN_PROSES]))
    svg_batang("Literasi Matematis per Proses (skor 0-100)", URUTAN_PROSES, seri, 100,
               os.path.join(folder, "grafik_literasi.svg"))


# ---------------------------------------------------------------------------
# Analisis proses belajar (tabel `aktivitas`): waktu & kesalahan per langkah
# ---------------------------------------------------------------------------
def baca_aktivitas(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        baris_baris = list(csv.DictReader(f))
    data = []
    for b in baris_baris:
        jenis = ambil(b, "jenis")
        if jenis not in ("langkah", "sesi", "latihan", "prasyarat", "refleksi"):
            continue
        data.append({
            "jenis": jenis,
            "nama": (ambil(b, "nama") or "").strip(),
            "kelompok": ambil(b, "kelompok") or "",
            "sesi": int(ke_angka(ambil(b, "sesi")) or 0),
            "langkah": int(ke_angka(ambil(b, "langkah")) or 0),
            "judul": ambil(b, "judul") or "",
            "durasi": ke_angka(ambil(b, "durasi_detik")) or 0,
            "salah": int(ke_angka(ambil(b, "salah")) or 0),
            "hasil": ambil(b, "hasil") or "",
            "dibacakan": int(ke_angka(ambil(b, "dibacakan")) or 0),
            "petunjuk": int(ke_angka(ambil(b, "petunjuk")) or 0),
            "catatan": ambil(b, "catatan") or "",
        })
    return data


def rekap_langkah(aktivitas):
    """Gabungkan per langkah: total waktu tiap siswa dijumlahkan dulu (bila langkah dibuka
    lebih dari sekali), lalu dirata-rata antarsiswa."""
    per_langkah = {}
    for a in aktivitas:
        if a["jenis"] != "langkah":
            continue
        kunci = (a["sesi"], a["langkah"])
        r = per_langkah.setdefault(kunci, {"judul": a["judul"], "siswa": {}})
        s = r["siswa"].setdefault(a["nama"].lower(), {"durasi": 0, "salah": 0, "dibuka": False, "dibacakan": 0})
        s["durasi"] += a["durasi"]
        s["salah"] += a["salah"]
        s["dibuka"] = s["dibuka"] or a["hasil"] == "dibuka"
        s["dibacakan"] += a["dibacakan"]
    hasil = []
    for (sesi, langkah), r in sorted(per_langkah.items()):
        siswa = list(r["siswa"].values())
        hasil.append({
            "sesi": sesi,
            "langkah": langkah,
            "judul": r["judul"],
            "siswa": len(siswa),
            "rata_detik": rata(s["durasi"] for s in siswa),
            "total_salah": sum(s["salah"] for s in siswa),
            "dibuka": sum(1 for s in siswa if s["dibuka"]),
            "dibacakan": sum(s["dibacakan"] for s in siswa),
        })
    return hasil


def laporan_aktivitas(aktivitas, langkah):
    cetak_tabel(
        "6. PROSES BELAJAR PER LANGKAH (menu Belajar)",
        ["Sesi", "Langkah", "Judul", "Siswa", "Rata-rata waktu", "Total salah", "Jawaban dibuka", "Dibacakan"],
        [
            [l["sesi"], l["langkah"], l["judul"][:34], l["siswa"], f"{fmt(l['rata_detik'])} dtk", l["total_salah"], l["dibuka"], f"{l['dibacakan']}x"]
            for l in langkah
        ],
    )
    print("   Jawaban dibuka = siswa salah 2 kali sehingga aplikasi menampilkan jawabannya.")
    print("   Dibacakan = berapa kali tombol \"Bacakan\" (narasi suara) dipakai di langkah itu.")

    per_sesi = {}
    for a in aktivitas:
        if a["jenis"] != "sesi":
            continue
        kunci = (a["nama"], a["sesi"])
        r = per_sesi.setdefault(kunci, {"durasi": 0, "salah": 0, "selesai": False, "keluar": 0})
        r["durasi"] += a["durasi"]
        r["salah"] += a["salah"]
        r["selesai"] = r["selesai"] or a["hasil"] == "selesai"
        r["keluar"] += 1 if a["hasil"] == "keluar" else 0
    cetak_tabel(
        "7. WAKTU BELAJAR PER SESI",
        ["Nama", "Sesi", "Total waktu", "Total salah", "Status", "Keluar di tengah"],
        [
            [nama, sesi, f"{fmt(r['durasi'] / 60, 1)} mnt", r["salah"], "selesai" if r["selesai"] else "belum selesai", f"{r['keluar']}x"]
            for (nama, sesi), r in sorted(per_sesi.items())
        ],
    )

    if langkah:
        terlama = sorted(langkah, key=lambda l: l["rata_detik"] or 0, reverse=True)[:3]
        tersulit = sorted(langkah, key=lambda l: (l["total_salah"], l["dibuka"]), reverse=True)[:3]
        print("\n   Langkah paling lama dipelajari:")
        for l in terlama:
            print(f"   - Sesi {l['sesi']} langkah {l['langkah']} ({l['judul']}): {fmt(l['rata_detik'])} detik")
        print("   Langkah dengan kesalahan terbanyak (indikasi intrinsic load tinggi):")
        for l in tersulit:
            print(f"   - Sesi {l['sesi']} langkah {l['langkah']} ({l['judul']}): {l['total_salah']} salah, {l['dibuka']} jawaban dibuka")


def rekap_latihan(aktivitas):
    """Rekap pertemuan 4 (implementasi) per siswa dari baris jenis 'latihan', ditambah
    jumlah petunjuk (GL3), refleksi (GL4), dan skor cek prasyarat (IL3)."""
    per_siswa = {}
    baru = lambda: {"soal": 0, "benar": 0, "salah": 0, "menyerah": 0, "durasi": [], "dibacakan": 0, "petunjuk": 0,
                    "petunjuk_awal": [], "petunjuk_akhir": [], "refleksi": 0, "refleksi_benar": 0, "prasyarat": {}}
    for a in aktivitas:
        if a["jenis"] == "refleksi":
            r = per_siswa.setdefault(a["nama"], baru())
            r["refleksi"] += 1
            r["refleksi_benar"] += a["hasil"] == "benar"
            continue
        if a["jenis"] == "prasyarat":
            # nomor soal 1-4; bila cek diulang, yang tercatat terakhir dipakai
            per_siswa.setdefault(a["nama"], baru())["prasyarat"][a["langkah"]] = a["hasil"] == "benar"
            continue
        if a["jenis"] != "latihan":
            continue
        r = per_siswa.setdefault(a["nama"], baru())
        r["soal"] += 1
        r["petunjuk"] += a["petunjuk"]
        (r["petunjuk_awal"] if a["langkah"] <= 5 else r["petunjuk_akhir"]).append(a["petunjuk"])
        r[a["hasil"] if a["hasil"] in ("benar", "salah", "menyerah") else "salah"] += 1
        r["durasi"].append(a["durasi"])
        r["dibacakan"] += a["dibacakan"]
    hasil = []
    for nama, r in sorted(per_siswa.items()):
        hasil.append({
            "nama": nama,
            "soal": r["soal"],
            "benar": r["benar"],
            "salah": r["salah"],
            "menyerah": r["menyerah"],
            "persen": 100 * r["benar"] / r["soal"] if r["soal"] else None,
            "rata_detik": rata(r["durasi"]),
            "dibacakan": r["dibacakan"],
            "petunjuk": r["petunjuk"],
            "petunjuk_awal": rata(r["petunjuk_awal"]),
            "petunjuk_akhir": rata(r["petunjuk_akhir"]),
            "refleksi": f"{r['refleksi_benar']}/{r['refleksi']}" if r["refleksi"] else "-",
            "prasyarat": f"{sum(r['prasyarat'].values())}/{len(r['prasyarat'])}" if r["prasyarat"] else "-",
        })
    return hasil


def laporan_latihan(latihan):
    if not latihan:
        print("\n8. LATIHAN PERTEMUAN 4 (IMPLEMENTASI): belum ada data.")
        return
    cetak_tabel(
        "8. LATIHAN PERTEMUAN 4 (IMPLEMENTASI, menu Latihan Soal)",
        ["Nama", "Soal", "Benar", "Salah", "Lihat jawaban", "% benar", "Rata-rata waktu/soal", "Dibacakan",
         "Petunjuk", "Petunjuk/soal 1-5", "Petunjuk/soal 6+", "Refleksi benar", "Prasyarat"],
        [
            [l["nama"], l["soal"], l["benar"], l["salah"], l["menyerah"], f"{fmt(l['persen'])}%", f"{fmt(l['rata_detik'])} dtk", f"{l['dibacakan']}x",
             l["petunjuk"], fmt(l["petunjuk_awal"], 1), fmt(l["petunjuk_akhir"], 1), l["refleksi"], l["prasyarat"]]
            for l in latihan
        ],
    )
    print("   Lihat jawaban = siswa menekan \"Lihat jawaban\" tanpa menjawab. Target pertemuan 4: minimal 10 soal.")
    print("   Petunjuk/soal yang menurun dari soal 1-5 ke soal 6+ menandakan bantuan berhasil dipudarkan (GL3).")


def simpan_latihan(latihan, folder):
    with open(os.path.join(folder, "rekap_latihan.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["nama", "jumlah_soal", "benar", "salah", "lihat_jawaban", "persen_benar", "rata_rata_detik", "dibacakan",
                    "petunjuk", "petunjuk_per_soal_1_5", "petunjuk_per_soal_6_dst", "refleksi_benar", "prasyarat"])
        for l in latihan:
            w.writerow([l["nama"], l["soal"], l["benar"], l["salah"], l["menyerah"],
                        None if l["persen"] is None else round(l["persen"], 1),
                        None if l["rata_detik"] is None else round(l["rata_detik"], 1), l["dibacakan"], l["petunjuk"],
                        None if l["petunjuk_awal"] is None else round(l["petunjuk_awal"], 2),
                        None if l["petunjuk_akhir"] is None else round(l["petunjuk_akhir"], 2), l["refleksi"], l["prasyarat"]])


def simpan_aktivitas(langkah, folder):
    with open(os.path.join(folder, "rekap_langkah.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["sesi", "langkah", "judul", "jumlah_siswa", "rata_rata_detik", "total_salah", "jawaban_dibuka", "dibacakan"])
        for l in langkah:
            w.writerow([l["sesi"], l["langkah"], l["judul"], l["siswa"],
                        None if l["rata_detik"] is None else round(l["rata_detik"], 1), l["total_salah"], l["dibuka"], l["dibacakan"]])
    label = [f"S{l['sesi']}-L{l['langkah']}" for l in langkah]
    waktu = [None if l["rata_detik"] is None else round(l["rata_detik"]) for l in langkah]
    salah = [l["total_salah"] for l in langkah]
    svg_batang(
        "Rata-rata Waktu per Langkah (detik)", label,
        [("Waktu (detik)", "#5fb4ff", waktu)],
        max([w for w in waktu if w is not None] + [10]), os.path.join(folder, "grafik_waktu_langkah.svg"),
    )
    svg_batang(
        "Jumlah Jawaban Salah per Langkah", label,
        [("Salah", "#f472b6", salah)],
        max(salah + [3]), os.path.join(folder, "grafik_salah_langkah.svg"),
    )


def main():
    parser = argparse.ArgumentParser(description="Analisis hasil penelitian teorema Pythagoras")
    parser.add_argument("csv", help="file CSV ekspor dari Supabase (tabel hasil) atau dari menu Tes")
    parser.add_argument("--keluaran", default="hasil_analisis", help="folder untuk rekap CSV dan grafik")
    parser.add_argument("--aktivitas", help="(opsional) file CSV ekspor tabel aktivitas dari Supabase")
    parser.add_argument("--kertas", help="(opsional) file CSV jawaban lembar kertas (lihat templat_kertas.csv)")
    args = parser.parse_args()

    if not os.path.exists(args.csv):
        sys.exit(f"File tidak ditemukan: {args.csv}")

    data = baca_csv(args.csv)
    if args.kertas:
        if not os.path.exists(args.kertas):
            sys.exit(f"File tidak ditemukan: {args.kertas}")
        data += baca_kertas(args.kertas)
    uji = [d for d in data if d["kelompok"] == KELOMPOK_UJI]
    data = [d for d in data if d["kelompok"] != KELOMPOK_UJI]
    if uji:
        print(f"Catatan: {len(uji)} baris kelompok '{KELOMPOK_UJI}' (demo/uji coba) tidak ikut dianalisis.")
    # Jawaban uraian tes Mathematical Literacy tidak bisa dikoreksi dengan kunci pilihan/angka:
    # dinilai dengan rubrik (ekspor_jawaban_literasi.py -> analisis_literasi.py)
    uraian = [d for d in data if d["jawaban"].get("_instrumen") == "literasi"]
    data = [d for d in data if d["jawaban"].get("_instrumen") != "literasi"]
    if uraian:
        print(f"Catatan: {len(uraian)} tes Mathematical Literacy (uraian) dilewati di sini; nilai dengan rubrik lewat "
              "ekspor_jawaban_literasi.py, lalu analisis dengan analisis_literasi.py.")
    if not data:
        sys.exit("Tidak ada data pre-test/post-test/kuesioner di file tersebut.")

    rekap, peringatan = rekap_per_siswa(data)
    laporan(rekap, peringatan)

    os.makedirs(args.keluaran, exist_ok=True)
    simpan_rekap_csv(rekap, os.path.join(args.keluaran, "rekap_siswa.csv"))
    simpan_literasi_csv(rekap, os.path.join(args.keluaran, "rekap_literasi.csv"))
    simpan_grafik(rekap, args.keluaran)
    berkas = ["rekap_siswa.csv", "rekap_literasi.csv", "grafik_nilai.svg", "grafik_beban.svg", "grafik_indikator.svg",
              "grafik_literasi.svg"]

    if args.aktivitas:
        if not os.path.exists(args.aktivitas):
            sys.exit(f"File tidak ditemukan: {args.aktivitas}")
        aktivitas = [a for a in baca_aktivitas(args.aktivitas) if a["kelompok"] != KELOMPOK_UJI]
        langkah = rekap_langkah(aktivitas)
        laporan_aktivitas(aktivitas, langkah)
        simpan_aktivitas(langkah, args.keluaran)
        latihan = rekap_latihan(aktivitas)
        laporan_latihan(latihan)
        simpan_latihan(latihan, args.keluaran)
        berkas += ["rekap_langkah.csv", "grafik_waktu_langkah.svg", "grafik_salah_langkah.svg", "rekap_latihan.csv"]

    print(f"\nFile tersimpan di folder '{args.keluaran}': " + ", ".join(berkas))


if __name__ == "__main__":
    # Agar karakter seperti ² dan − tampil benar di terminal Windows
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
