"""Penilaian pre-test, post-test, dan kuesioner Leppink DI SERVER.

Kunci jawaban HARUS sama dengan src/tes.js (aplikasi) dan analisis/analisis.py.
Jawaban bisa berupa teks pilihan (dari aplikasi), huruf A-D (dari lembar kertas), atau angka.
"""

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

# Huruf kunci untuk soal pilihan (urutan opsi sama dengan src/tes.js); None = isian angka
KUNCI_HURUF = {
    "pretest": ["B", None, None, "A", None, None, "B", None, "B", None],
    "posttest": ["C", None, None, "B", None, None, "B", None, "A", None],
}

BUTIR_LEPPINK = {
    "IL": ["IL1", "IL2", "IL3"],
    "EL": ["EL1", "EL2", "EL3"],
    "GL": ["GL1", "GL2", "GL3", "GL4"],
}


def ke_angka(nilai):
    """Ubah teks menjadi angka; koma dianggap titik desimal. None bila bukan angka."""
    if nilai is None:
        return None
    teks = str(nilai).strip().replace(",", ".")
    if not teks:
        return None
    try:
        return float(teks)
    except ValueError:
        return None


def benar_tidak(jenis, nomor, jawaban):
    """True bila jawaban nomor ke-`nomor` benar."""
    kunci = KUNCI[jenis][nomor]
    huruf = KUNCI_HURUF[jenis][nomor]
    if jawaban is None or str(jawaban).strip() == "":
        return False
    teks = str(jawaban).strip()
    if huruf and teks.upper() in ("A", "B", "C", "D"):
        return teks.upper() == huruf
    if isinstance(kunci, (int, float)):
        n = ke_angka(teks)
        return n is not None and abs(n - kunci) < 0.01
    return teks == kunci


def nilai_tes(jenis, jawaban):
    """Kembalikan {benar, total, skor} untuk pretest/posttest. `jawaban` = {"0": ..., "1": ...}."""
    if jenis not in KUNCI:
        raise ValueError(f"jenis tes tidak dikenal: {jenis}")
    total = len(KUNCI[jenis])
    benar = sum(1 for i in range(total) if benar_tidak(jenis, i, jawaban.get(str(i))))
    return {"benar": benar, "total": total, "skor": round(benar / total * 100)}


def nilai_leppink(jawaban):
    """Rata-rata IL, EL, GL (skala 0-10). Butir yang kosong/tidak valid membuat dimensinya None."""
    hasil = {}
    for dimensi, butir in BUTIR_LEPPINK.items():
        nilai = [ke_angka(jawaban.get(b)) for b in butir]
        if any(n is None or n < 0 or n > 10 for n in nilai):
            hasil[dimensi] = None
        else:
            hasil[dimensi] = round(sum(nilai) / len(nilai), 2)
    return hasil
