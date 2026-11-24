"""Bahan ajar TANPA APLIKASI berbasis model Rigorous Mathematical Thinking (RMT; Kinard & Kozulin, 2008).

Isi diambil langsung dari materi aplikasi (src/materi.js) agar pembelajaran tanpa aplikasi setara dengan menu Belajar:
langkah, fase & langkah RMT, fungsi kognitif, mediasi MLE (tujuan, makna, transendensi), dan soal cek pemahaman.

Pemakaian:  python scripts/buat_modul_rmt.py   (butuh Node.js untuk membaca src/materi.js)
Hasil (HTML, cetak ke PDF dengan browser):
  docs/pembelajaran-tanpa-aplikasi/0-Modul-Ajar-RMT-Teorema-Pythagoras.html   (untuk guru)
  docs/pembelajaran-tanpa-aplikasi/1-LKPD-Pertemuan-1.html                    (lembar kerja siswa)
  docs/pembelajaran-tanpa-aplikasi/2-LKPD-Pertemuan-2.html
  docs/pembelajaran-tanpa-aplikasi/3-LKPD-Pertemuan-3.html
  docs/pembelajaran-tanpa-aplikasi/4-Kunci-Jawaban-LKPD.html                 (untuk guru)
Pertemuan 4 memakai docs/latihan-cetak/1-Lembar-Latihan-Pertemuan-4.pdf (latihan berjenjang, Fase III).
"""
import json
import os
import subprocess
from html import escape

from buat_materi import bukti_luas, segitiga, tangga_dinding

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(AKAR, "docs", "pembelajaran-tanpa-aplikasi")
PENYUSUN = "Disusun oleh: <b>Azkiah Safira</b> · NIM 2225250013 · Kelas 3F"


def baca_materi():
    kode = ("import('./src/materi.js').then(m => process.stdout.write(JSON.stringify("
            "{SESI: m.SESI, FASE: m.FASE_RMT, LANGKAH: m.LANGKAH_RMT})))")
    keluaran = subprocess.run(["node", "-e", kode], cwd=AKAR, capture_output=True, check=True)
    return json.loads(keluaran.stdout.decode("utf-8"))


M = baca_materi()
SESI, FASE, LANGKAH = M["SESI"], M["FASE"], M["LANGKAH"]
ROMAWI = {1: "I", 2: "II", 3: "III"}
WARNA_FASE = {1: ("#e8f4ff", "#8fcaff", "#2f6fb3"), 2: ("#fff0f7", "#ff9fcb", "#c2477f"), 3: ("#f4efff", "#c4b5fd", "#7b4fd0")}

GAYA = """
@page { size: A4; margin: 14mm 14mm 15mm; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Itim', 'Segoe UI', Arial, sans-serif; color: #3f3566; font-size: 11pt; line-height: 1.45; margin: 0; }
h1, h2, h3, .chip, th, .merek { font-family: 'Bubblegum Sans', 'Itim', sans-serif; font-weight: 400; letter-spacing: .02em; }
.kepala { border: 2.5px solid #ffb3d6; border-radius: 20px; padding: 12px 18px; margin-bottom: 12px;
  background: linear-gradient(135deg, #e3f3ff 0%, #f4ecff 55%, #ffe6f3 100%); box-shadow: 0 0 0 4px #fff, 0 0 0 5.5px #bfe3ff; }
.kepala h1 { margin: 4px 0 2px; font-size: 21pt; color: #8b5fd6; line-height: 1.1; }
.kepala .sub { margin: 0 0 4px; color: #6b5a8e; }
.merek { display: inline-block; background: #fff; border: 1.5px solid #ffb3d6; color: #d9468f; border-radius: 99px; padding: 0 10px; font-size: 10pt; }
.penyusun { margin: 2px 0 0; font-size: 9.5pt; }
.identitas { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px 18px; margin-top: 8px; }
.identitas div { border-bottom: 1.5px dotted #c4b5fd; padding: 2px 0; }
h2 { font-size: 15pt; color: #d9468f; margin: 14px 0 6px; }
h3 { font-size: 13pt; margin: 4px 0; color: #4f3f86; }
.mediasi { border: 2px dashed #ffc6e0; border-radius: 14px; background: #fff7fb; padding: 6px 12px; margin: 6px 0 10px; }
.mediasi p { margin: 2px 0; }
.fase { margin: 12px 0 4px; padding: 6px 12px; border-radius: 14px; border: 2px solid; break-after: avoid; break-inside: avoid; }
.fase b { font-family: 'Bubblegum Sans', sans-serif; font-weight: 400; font-size: 13pt; }
.langkah { break-inside: avoid; border: 2px solid #e3dcf5; border-radius: 16px; padding: 8px 12px; margin: 8px 0; background: #fff; }
.chip { display: inline-block; border-radius: 99px; padding: 0 10px; font-size: 10pt; color: #fff; margin-right: 6px; }
.fungsi { display: inline-block; border: 1.5px dashed #c4b5fd; border-radius: 99px; padding: 0 10px; font-size: 9.5pt; background: #fbf9ff; }
.isi p { margin: 4px 0; }
.rumus { font-family: Consolas, monospace; background: #f4efff; border-radius: 10px; padding: 4px 10px; margin: 4px 0; display: inline-block; }
.rumus div { margin: 1px 0; }
.baris { display: flex; gap: 14px; align-items: flex-start; }
.baris .isi { flex: 1; }
.gbr { max-width: 230px; height: auto; }
.tanya { margin-top: 6px; padding: 6px 10px; border-radius: 12px; background: #e8f4ff; }
.tanya b { color: #2f6fb3; }
.opsi { margin: 4px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px 18px; }
.opsi li::before { content: "☐ "; font-size: 12pt; }
.jawab { margin-top: 4px; height: 16mm; border-radius: 8px; border: 1.3px solid #c9dcf5;
  background: repeating-linear-gradient(to bottom, #fff 0, #fff calc(7mm - 1px), #e4eaf4 calc(7mm - 1px), #e4eaf4 7mm); }
.jawab.kecil { height: 9mm; }
.refleksi { break-inside: avoid; border: 2.5px solid #c4b5fd; border-radius: 16px; padding: 8px 12px; margin-top: 12px; background: #fbf9ff; }
.cek li { list-style: none; margin: 3px 0; }
.cek li::before { content: "☐ "; }
table { border-collapse: collapse; width: 100%; font-size: 10pt; margin: 6px 0; }
th, td { border: 1px solid #d6dff0; padding: 5px 7px; vertical-align: top; text-align: left; }
th { background: #ffe6f3; color: #6b3f7a; font-size: 11pt; }
.kecil { font-size: 9.5pt; color: #6b5a8e; }
.halaman-baru { break-before: page; }
.kaki { text-align: center; font-size: 8.5pt; color: #a08cc8; margin-top: 10px; }
"""

FONT = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Itim&display=block" rel="stylesheet">')


def halaman(judul, isi):
    return (f'<!doctype html><html lang="id"><head><meta charset="utf-8"><title>{escape(judul)}</title>{FONT}'
            f'<style>{GAYA}</style></head><body>{isi}<p class="kaki">♡ PELITA · Penerapan Teorema Pythagoras · '
            f'model Rigorous Mathematical Thinking ♡</p></body></html>')


def kepala(judul, sub, identitas=True):
    ident = ('<div class="identitas"><div>Kode siswa: </div><div>Kelas: </div><div>Tanggal: </div></div>' if identitas else '')
    return (f'<div class="kepala"><span class="merek">✨ PELITA · Penerapan Teorema Pythagoras</span><h1>{escape(judul)}</h1>'
            f'<p class="sub">{escape(sub)}</p><p class="penyusun">{PENYUSUN}</p>{ident}</div>')


def gambar(v):
    """Gambar statis yang setara dengan visual di aplikasi."""
    if not v:
        return ""
    jenis = v["jenis"]
    if jenis == "persegi":
        return bukti_luas()
    s = v.get("sisi", {})
    cari = v.get("cari")
    if jenis == "tangga3d":
        peta = {"a": "kaki", "b": "tinggi", "c": "panjang"}
        return tangga_dinding(f'{s["a"]} m', f'{s["b"]} m', f'{s["c"]} m' if cari != "c" else "?", peta.get(cari, "panjang"))
    if jenis == "putar":
        lab = v.get("label", {"a": "a", "b": "b", "c": "c"})
        o = v.get("orientasi", {})
        return segitiga(s["a"], s["b"], lab["a"], lab["b"], lab["c"], putar=o.get("sudut", 0), cermin=o.get("cermin", False))

    def label(huruf):
        if huruf == cari and v.get("sembunyikan"):
            return f"{huruf} = ?"
        return f"{huruf} = {s[huruf]}"
    warna = tuple("d" if h == cari else "k" for h in "abc")
    return segitiga(s["a"], s["b"], label("a"), label("b"), label("c"), warna=warna)


def chip_rmt(rmt):
    info = LANGKAH[str(rmt["langkah"])]
    _, _, tua = WARNA_FASE[info["fase"]]
    return (f'<span class="chip" style="background:{tua}">Fase {ROMAWI[info["fase"]]} · Langkah RMT {rmt["langkah"]}: '
            f'{escape(info["nama"])}</span><span class="fungsi">🧠 {escape(rmt["fungsi"])}</span>')


def kotak_cek(cek):
    if not cek:
        return ""
    if cek["tipe"] == "pilihan":
        opsi = "".join(f"<li>{escape(str(o))}</li>" for o in cek["opsi"])
        return (f'<div class="tanya"><b>Pertanyaan:</b> {escape(cek["tanya"])}<ul class="opsi">{opsi}</ul>'
                f'<div class="kecil">Alasanku:</div><div class="jawab kecil"></div></div>')
    return f'<div class="tanya"><b>Pertanyaan:</b> {escape(cek["tanya"])}<div class="jawab"></div></div>'


def lkpd(sesi):
    isi = [kepala(f"LKPD Pertemuan {sesi['id']}: {sesi['judul'].split(': ', 1)[1]}",
                  "Lembar Kerja Peserta Didik · Matematika SMP Kelas VIII · model Rigorous Mathematical Thinking (RMT)"),
           '<div class="mediasi">'
           f'<p><b>🎯 Tujuan:</b> {escape(sesi["tujuan"])}</p>'
           f'<p><b>💡 Mengapa penting:</b> {escape(sesi["makna"])}</p>'
           '<p class="kecil">Petunjuk: kerjakan berurutan. Bagian Fase I melatih cara berpikir, Fase II membangun konsep, '
           'Fase III berlatih. Tulis langkah dan alasanmu, bukan hanya jawabannya.</p></div>']
    fase_lalu = None
    for no, l in enumerate(sesi["langkah"], 1):
        fase = LANGKAH[str(l["rmt"]["langkah"])]["fase"]
        if fase != fase_lalu:
            muda, garis, tua = WARNA_FASE[fase]
            isi.append(f'<div class="fase" style="background:{muda};border-color:{garis}"><b style="color:{tua}">'
                       f'Fase {ROMAWI[fase]} · {escape(FASE[str(fase)]["nama"])}</b> — {escape(FASE[str(fase)]["ket"])}</div>')
            fase_lalu = fase
        paragraf = "".join(f"<p>{escape(p)}</p>" for p in l["isi"])
        rumus = ('<div class="rumus">' + "".join(f"<div>{escape(r)}</div>" for r in l["rumus"]) + "</div>") if l.get("rumus") else ""
        gbr = gambar(l.get("visual"))
        tubuh = f'<div class="baris"><div class="isi">{paragraf}{rumus}</div>{gbr}</div>' if gbr else f'<div class="isi">{paragraf}{rumus}</div>'
        isi.append(f'<div class="langkah">{chip_rmt(l["rmt"])}<h3>{no}. {escape(l["judul"])}</h3>{tubuh}{kotak_cek(l.get("cek"))}</div>')
    isi.append('<div class="refleksi"><h3>🪞 Refleksi (metakognisi)</h3>'
               '<p>Fungsi berpikir apa yang paling banyak kamu pakai hari ini? (boleh lebih dari satu)</p>'
               '<ul class="cek"><li>Mengamati dengan teliti</li><li>Membandingkan</li><li>Memberi label / nama</li>'
               '<li>Menemukan pola dan hubungan</li><li>Memakai alat matematika (tabel, gambar, rumus)</li></ul>'
               '<p>Bagian mana yang paling sulit, dan bagaimana kamu mengatasinya?</p><div class="jawab"></div>'
               f'<p><b>🌏 Dipakai di mana lagi?</b> {escape(sesi["transendensi"])}</p><div class="jawab kecil"></div></div>')
    return halaman(f"LKPD Pertemuan {sesi['id']}", "".join(isi))


def kunci():
    isi = [kepala("Kunci Jawaban LKPD Pertemuan 1–3", "Untuk guru · jangan dibagikan ke siswa", identitas=False)]
    for sesi in SESI:
        baris = ""
        for no, l in enumerate(sesi["langkah"], 1):
            c = l.get("cek")
            if not c:
                continue
            baris += (f'<tr><td>{no}. {escape(l["judul"])}</td><td>{escape(c["tanya"])}</td><td><b>{escape(str(c["jawab"]))}</b></td>'
                      f'<td>{escape(c["penjelasan"])}</td></tr>')
        isi.append(f'<h2>Pertemuan {sesi["id"]} · {escape(sesi["judul"].split(": ", 1)[1])}</h2><table><tr><th style="width:22%">Langkah</th>'
                   f'<th>Pertanyaan</th><th style="width:14%">Jawaban</th><th>Penjelasan</th></tr>{baris}</table>')
    return halaman("Kunci Jawaban LKPD", "".join(isi))


def modul():
    tabel_rmt = "".join(
        f'<tr><td><b>Fase {ROMAWI[LANGKAH[str(n)]["fase"]]}</b><br><span class="kecil">{escape(FASE[str(LANGKAH[str(n)]["fase"])]["nama"])}</span></td>'
        f'<td>Langkah {n}: {escape(LANGKAH[str(n)]["nama"])}</td><td>{teks}</td></tr>'
        for n, teks in [
            (1, "Siswa dimediasi mengenal model/gambar sebagai alat berpikir umum (struktur dan fungsinya)."),
            (2, "Siswa memakai alat berpikir itu untuk tugas kognitif (mengamati, membandingkan, memberi label, mempertahankan keajegan)."),
            (3, "Siswa membangun konsep dasar dari pengalaman dan bahasa sehari-hari (kuadrat = luas persegi, benda bersudut siku-siku)."),
            (4, "Siswa menemukan dan merumuskan pola serta hubungan (9 + 16 = 25 → c² = a² + b²)."),
            (5, "Siswa memakai alat khas matematika: tabel kuadrat, gambar segitiga berlabel, rumus, bahasa matematika."),
            (6, "Siswa berlatih memakai alat untuk memecahkan masalah, lalu merefleksikan cara berpikirnya (metakognisi)."),
        ])
    isi = [kepala("Modul Ajar: Teorema Pythagoras dengan Model RMT",
                  "Untuk guru · Matematika SMP Kelas VIII · Rigorous Mathematical Thinking (Kinard & Kozulin, 2008) · 4 pertemuan × 2 JP",
                  identitas=False),
           '<h2>A. Model pembelajaran: Rigorous Mathematical Thinking (RMT)</h2>'
           '<p>RMT memandang kesulitan matematika sering berasal dari fungsi kognitif yang belum berkembang, bukan dari '
           'kurangnya pengetahuan. Guru berperan sebagai <b>mediator</b> (Mediated Learning Experience, MLE) yang membantu siswa '
           'memakai alat berpikir (psychological tools) untuk membangun konsep. Prosesnya tiga fase dan enam langkah, tidak '
           'kaku tetapi semuanya harus muncul:</p>'
           f'<table><tr><th style="width:20%">Fase</th><th style="width:26%">Langkah</th><th>Yang dilakukan siswa (dimediasi guru)</th></tr>{tabel_rmt}</table>'
           '<h3>Tiga kriteria mediasi (MLE) yang dipakai guru di setiap pertemuan</h3>'
           '<table><tr><th style="width:24%">Kriteria</th><th>Contoh ucapan guru</th></tr>'
           '<tr><td>Intensionalitas & timbal balik</td><td>"Hari ini kita akan … Coba perhatikan pojok gambar ini. Apa yang kamu lihat?"</td></tr>'
           '<tr><td>Makna</td><td>"Kenapa kita perlu tahu sisi miring? Karena rumusnya bergantung pada sisi itu."</td></tr>'
           '<tr><td>Transendensi</td><td>"Di mana lagi kamu melihat pola 3-4-5? Tukang bangunan memakainya untuk membuat pojok yang siku."</td></tr>'
           '</table>'
           '<p class="kecil">Fungsi kognitif yang dilatih: mengamati secara sistematis, membandingkan, memberi label, membentuk '
           'hubungan, mempertahankan keajegan (segitiga diputar tetap sama), mendefinisikan masalah, merencanakan, dan '
           'refleksi metakognitif.</p>']
    for sesi in SESI:
        baris = ""
        for no, l in enumerate(sesi["langkah"], 1):
            info = LANGKAH[str(l["rmt"]["langkah"])]
            ada_cek = f' Cek: {escape(l["cek"]["tanya"])}' if l.get("cek") else ""
            baris += (f'<tr><td>Fase {ROMAWI[info["fase"]]} · L{l["rmt"]["langkah"]}</td><td>{no}. {escape(l["judul"])}</td>'
                      f'<td>{escape(l["rmt"]["fungsi"])}</td><td>{escape(l["isi"][0])}{ada_cek}</td></tr>')
        isi.append(f'<h2 class="halaman-baru">Pertemuan {sesi["id"]} · {escape(sesi["judul"].split(": ", 1)[1])}</h2>'
                   f'<p><b>Tujuan pembelajaran:</b> {escape(sesi["tujuan"])}</p>'
                   '<table><tr><th style="width:18%">Kegiatan</th><th>Langkah guru & siswa</th><th style="width:12%">Waktu</th></tr>'
                   '<tr><td>Pendahuluan</td><td>Salam dan doa. <b>Intensionalitas:</b> sampaikan tujuan. <b>Makna:</b> '
                   f'{escape(sesi["makna"])} Bagikan LKPD Pertemuan {sesi["id"]}.</td><td>10 menit</td></tr>'
                   '<tr><td>Inti (Fase I–III)</td><td>Ikuti urutan langkah pada tabel di bawah. Guru memediasi dengan pertanyaan, '
                   'bukan memberi jawaban: minta siswa menjelaskan alasannya, beri petunjuk bertingkat bila siswa macet. '
                   'Diskusikan jawaban cek pemahaman tiap langkah.</td><td>55 menit</td></tr>'
                   '<tr><td>Penutup</td><td><b>Refleksi metakognitif:</b> siswa mengisi bagian Refleksi LKPD (fungsi berpikir apa '
                   f'yang dipakai). <b>Transendensi:</b> {escape(sesi["transendensi"])}</td><td>15 menit</td></tr></table>'
                   '<table><tr><th style="width:15%">Fase · langkah RMT</th><th style="width:22%">Kegiatan (sama dengan aplikasi)</th>'
                   f'<th style="width:20%">Fungsi kognitif</th><th>Isi singkat & cek pemahaman</th></tr>{baris}</table>')
    isi.append('<h2 class="halaman-baru">Pertemuan 4 · Latihan Soal (Fase III)</h2>'
               '<p>Siswa mengerjakan <b>Lembar Latihan Pertemuan 4</b> (docs/latihan-cetak/1-Lembar-Latihan-Pertemuan-4.pdf): '
               'soal berjenjang dari angka langsung, gambar yang diputar, sampai soal cerita, memakai Strategi 5 Langkah. '
               'Guru memediasi dengan petunjuk bertingkat: (1) pertanyaan umum, (2) arahkan ke label sisi/sketsa, '
               '(3) sebutkan rumus yang tepat, (4) tunjukkan langkah tanpa hasil akhir.</p>'
               '<h2>Asesmen</h2><table><tr><th style="width:22%">Jenis (RMT)</th><th>Bentuk</th></tr>'
               '<tr><td>Formatif</td><td>Cek pemahaman di tiap langkah LKPD, pengamatan guru terhadap fungsi kognitif dan bahasa '
               'matematika siswa, isian refleksi.</td></tr>'
               '<tr><td>Sumatif</td><td>Tes Mathematical Literacy (4 soal uraian, rubrik per tahap, skor maks. 24).</td></tr>'
               '<tr><td>Evaluatif</td><td>Nilai = total skor ÷ 24 × 100, dibandingkan sebelum dan sesudah pembelajaran.</td></tr></table>'
               '<h2>Daftar bahan cetak</h2><ul>'
               '<li>LKPD Pertemuan 1, 2, 3 dan Kunci Jawaban LKPD (folder ini)</li>'
               '<li>Materi ringkas: docs/materi/Materi-Teorema-Pythagoras.pdf</li>'
               '<li>Latihan Pertemuan 4 dan kuncinya: docs/latihan-cetak/</li>'
               '<li>Tes & rubrik Mathematical Literacy: docs/instrumen-cetak-literasi/</li></ul>')
    return halaman("Modul Ajar RMT Teorema Pythagoras", "".join(isi))


if __name__ == "__main__":
    os.makedirs(KELUAR, exist_ok=True)
    berkas = [("0-Modul-Ajar-RMT-Teorema-Pythagoras.html", modul())]
    berkas += [(f"{s['id']}-LKPD-Pertemuan-{s['id']}.html", lkpd(s)) for s in SESI]
    berkas += [("4-Kunci-Jawaban-LKPD.html", kunci())]
    for nama, isi in berkas:
        with open(os.path.join(KELUAR, nama), "w", encoding="utf-8") as f:
            f.write(isi)
        print("tersimpan:", os.path.join("docs", "pembelajaran-tanpa-aplikasi", nama))
