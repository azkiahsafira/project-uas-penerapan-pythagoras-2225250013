"""Video pembelajaran "Belajar Teorema Pythagoras bersama Siku" (model RMT) untuk diunggah ke Google Drive.

Setiap adegan = slide 1280×720 (HTML → PNG lewat Edge headless) + narasi suara Indonesia (Windows "Microsoft Andika",
tts.ps1) + subtitle. Adegan disusun mengikuti fase RMT: tujuan & makna (MLE) → Fase I mengamati/membandingkan →
Fase II membangun konsep & menemukan pola → Fase III berlatih soal cerita → refleksi & transendensi. Isinya mencakup SELURUH
langkah menu Belajar Sesi 1–3 dan cara memakai fitur aplikasi (Cek Prasyarat, Kalkulator, Latihan Soal, Tes, Tanya Siku).

Pemakaian (Windows):  python scripts/video/buat_video.py <folder-kerja> <ffmpeg.exe> <berkas-keluaran.mp4>
"""
import os
import subprocess
import sys
import wave
from html import escape

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from buat_materi import bukti_luas, segitiga, tangga_dinding  # noqa: E402

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KERJA, FFMPEG, KELUAR = sys.argv[1], sys.argv[2], sys.argv[3]
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
TTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tts.ps1")
os.makedirs(KERJA, exist_ok=True)

SIKU = ('<svg viewBox="0 0 104 100" class="siku"><path d="M14 10 L14 92 L96 92 Z" fill="#fff" stroke="#6b5a8e" stroke-width="4" '
        'stroke-linejoin="round"/><path d="M14 78 H28 V92" fill="none" stroke="#ff8fc4" stroke-width="3"/>'
        '<ellipse cx="33" cy="62" rx="3.6" ry="4.6" fill="#3b2f55"/><ellipse cx="49" cy="70" rx="3.6" ry="4.6" fill="#3b2f55"/>'
        '<circle cx="32" cy="60.4" r="1.4" fill="#fff"/><circle cx="48" cy="68.4" r="1.4" fill="#fff"/>'
        '<ellipse cx="26" cy="71" rx="4" ry="2.4" fill="#ff9cc6"/><ellipse cx="57" cy="79" rx="4" ry="2.4" fill="#ff9cc6"/>'
        '<path d="M37 74 q4 4 8 1" fill="none" stroke="#3b2f55" stroke-width="2" stroke-linecap="round"/>'
        '<path d="M26 26 l-9 -6 v12 z M26 26 l9 -6 v12 z" fill="#ff8fc4" stroke="#6b5a8e" stroke-width="1.6"/>'
        '<circle cx="26" cy="26" r="3" fill="#ffd6ea" stroke="#6b5a8e" stroke-width="1.2"/></svg>')

BENDA = {  # ikon sederhana untuk tugas "amati & bandingkan"
    "tangga": '<svg viewBox="0 0 120 120"><rect x="80" y="8" width="20" height="98" fill="#fde7c3" stroke="#6b5a8e" stroke-width="3"/>'
              '<line x1="6" y1="106" x2="114" y2="106" stroke="#6b5a8e" stroke-width="4"/><line x1="24" y1="104" x2="80" y2="24" '
              'stroke="#b45309" stroke-width="8" stroke-linecap="round"/><polyline points="70,96 70,106 80,106" fill="none" stroke="#ff5fa8" stroke-width="4"/></svg>',
    "buku": '<svg viewBox="0 0 120 120"><rect x="18" y="14" width="84" height="92" rx="6" fill="#8fcaff" stroke="#6b5a8e" stroke-width="3"/>'
            '<rect x="28" y="24" width="64" height="20" rx="4" fill="#fff"/><polyline points="18,30 34,30 34,14" fill="none" stroke="#ff5fa8" stroke-width="4"/></svg>',
    "hp": '<svg viewBox="0 0 120 120"><rect x="32" y="6" width="56" height="108" rx="10" fill="#c4b5fd" stroke="#6b5a8e" stroke-width="3"/>'
          '<rect x="38" y="16" width="44" height="82" rx="4" fill="#fff"/><polyline points="38,30 52,30 52,16" fill="none" stroke="#ff5fa8" stroke-width="4"/></svg>',
}


def kotak_persegi(n, warna):
    sel = 26
    kotak = "".join(f'<rect x="{x * sel}" y="{y * sel}" width="{sel}" height="{sel}" fill="{warna}" stroke="#fff" stroke-width="2"/>'
                    for x in range(n) for y in range(n))
    return (f'<div class="persegi"><svg viewBox="-2 -2 {n * sel + 4} {n * sel + 4}" width="{n * sel}" height="{n * sel}">{kotak}</svg>'
            f'<p>{n} × {n} = <b>{n * n}</b></p></div>')


def rumus(*baris):
    return '<div class="rumus">' + "".join(f"<div>{b}</div>" for b in baris) + "</div>"


def layar_app(nama):
    """Tangkapan layar aplikasi asli (docs/screenshot) untuk adegan fitur."""
    jalur = os.path.join(AKAR, "docs", "screenshot", nama).replace(os.sep, "/")
    return f'<img class="tangkapan" src="file:///{jalur}">'


# Isi video = SELURUH materi menu Belajar (Sesi 1–3, setiap langkah) + cara memakai fitur aplikasi.
ADEGAN = [
    dict(fase="", judul="PELITA · Belajar Teorema Pythagoras", isi=layar_app("01-laptop-beranda.png"),
         narasi="Halo, teman-teman! Aku Siku, si segitiga siku-siku. Di video ini kita belajar teorema Pythagoras bersama "
                "aplikasi PELITA, dari kuadrat dan akar, teorema Pythagoras, sampai soal cerita sehari-hari."),
    dict(fase="Model pembelajaran", judul="Belajar dengan model RMT", isi=layar_app("02-laptop-belajar-model-rmt.png"),
         narasi="Kita belajar dengan model Rigorous Mathematical Thinking, atau R M T. Fase satu, pengembangan kognitif: melatih "
                "cara berpikir seperti mengamati dan membandingkan. Fase dua, konten sebagai proses: membangun konsep dan "
                "menemukan pola. Fase tiga, latihan konstruksi konseptual: berlatih memakai alat matematika lalu merefleksikan "
                "cara berpikir kita."),
    # ------------------------------- SESI 1 -------------------------------
    dict(fase="Sesi 1 · Mediasi", judul="🎯 Tujuan Sesi 1",
         isi='<ul class="besar"><li><b>Tujuan:</b> menghitung kuadrat & akar kuadrat, lalu menunjukkan sisi miring '
             'walaupun segitiganya diputar.</li><li><b>Mengapa penting:</b> kuadrat, akar, dan nama sisi adalah "alat" '
             'di setiap soal Pythagoras.</li></ul>',
         narasi="Sesi satu. Tujuannya: menghitung kuadrat dan akar kuadrat, lalu menunjukkan sisi miring segitiga siku-siku "
                "walaupun gambarnya diputar. Ini penting, karena kuadrat, akar, dan nama sisi adalah alat yang dipakai di "
                "setiap soal Pythagoras."),
    dict(fase="Sesi 1 · Fase I", judul="Ayo amati: apa yang sama?",
         isi='<div class="deret">' + "".join(f'<div class="benda">{BENDA[k]}<p>{n}</p></div>' for k, n in
                                             [("tangga", "tangga & dinding"), ("buku", "pojok buku"), ("hp", "layar HP")]) +
             '</div><p class="sorot">Ciri yang sama: ada <b>sudut siku-siku (90°)</b></p>',
         narasi="Ayo amati tiga benda ini: tangga yang bersandar di dinding, pojok buku, dan layar HP. Bandingkan ketiganya. "
                "Apa ciri yang sama? Semuanya punya sudut siku-siku, yaitu sudut sembilan puluh derajat."),
    dict(fase="Sesi 1 · Fase II", judul="Kuadrat = luas persegi",
         isi='<div class="deret">' + kotak_persegi(3, "#8fcaff") + kotak_persegi(4, "#ff9fcb") +
             rumus("5² = 5 × 5 = 25", "10² = 10 × 10 = 100", "7² = 7 × 7 = 49", "(bukan 7 × 2!)") + '</div>',
         narasi="Kuadrat artinya bilangan dikalikan dengan dirinya sendiri, dan sama dengan luas persegi. Persegi bersisi tiga "
                "berisi sembilan kotak. Persegi bersisi empat berisi enam belas kotak. Tujuh kuadrat sama dengan tujuh kali "
                "tujuh, yaitu empat puluh sembilan, bukan tujuh kali dua."),
    dict(fase="Sesi 1 · Fase II", judul="Akar kuadrat & tabel kuadrat",
         isi='<div class="deret">' + rumus("√9 = 3, karena 3² = 9", "√25 = 5, karena 5² = 25", "√64 = 8, karena 8² = 64") +
             rumus("11² = 121 · 12² = 144", "13² = 169 · 14² = 196", "15² = 225 · 16² = 256", "17² = 289 · 18² = 324",
                   "19² = 361 · 20² = 400") + '</div>',
         narasi="Akar kuadrat adalah kebalikan dari kuadrat. Akar enam puluh empat sama dengan delapan, karena delapan kali "
                "delapan sama dengan enam puluh empat. Tabel kuadrat sebelas sampai dua puluh menjadi pegangan. Untuk mencari "
                "akar dua ratus delapan puluh sembilan, cari angka itu di tabel: tujuh belas kuadrat sama dengan dua ratus "
                "delapan puluh sembilan, jadi akarnya tujuh belas."),
    dict(fase="Sesi 1 · Fase II", judul="Segitiga siku-siku & nama sisinya",
         isi='<div class="deret">' + segitiga(4, 3, "a (sisi siku-siku)", "b (sisi siku-siku)", "c (sisi miring)",
                                              warna=("k", "k", "d"), lebar=420, tinggi_kotak=300) + '</div>',
         narasi="Segitiga siku-siku punya satu sudut siku-siku, ditandai kotak kecil di pojoknya. Dua sisi yang mengapit sudut "
                "siku-siku disebut sisi siku-siku, kita beri nama a dan b. Sisi di depan sudut siku-siku disebut sisi miring "
                "atau hipotenusa, kita beri nama c. Sisi miring selalu paling panjang."),
    dict(fase="Sesi 1 · Fase I", judul="Awas keliru: segitiga yang diputar",
         isi='<div class="deret">' + segitiga(4, 3, "a", "b", "c", warna=("k", "k", "d")) +
             segitiga(4, 3, "p", "q", "r", warna=("k", "k", "d"), putar=200, cermin=True) + '</div>'
             '<p class="sorot">Sisi miring = sisi di <b>depan kotak sudut siku-siku</b> → di gambar kanan: <b>r</b></p>',
         narasi="Hati-hati, sisi miring bukan selalu sisi paling bawah. Segitiga bisa diputar atau dibalik, tetapi tetap "
                "segitiga yang sama. Cari dulu kotak sudut siku-sikunya, lalu lihat sisi di depannya. Pada gambar kanan, sisi "
                "miringnya adalah r."),
    # ------------------------------- SESI 2 -------------------------------
    dict(fase="Sesi 2 · Fase I", judul="Ayo amati: kotak di dalam persegi",
         isi='<div class="deret">' + kotak_persegi(3, "#8fcaff") + kotak_persegi(4, "#ff9fcb") + kotak_persegi(6, "#c4b5fd") + '</div>',
         narasi="Sesi dua. Tujuannya memahami rumus Pythagoras dan memilih rumus yang tepat. Kita mulai dengan mengamati. "
                "Persegi bersisi tiga berisi sembilan kotak, bersisi empat berisi enam belas kotak. Hubungannya: banyak kotak "
                "sama dengan sisi kali sisi. Jadi persegi bersisi enam berisi tiga puluh enam kotak."),
    dict(fase="Sesi 2 · Fase II", judul="Menemukan pola → Teorema Pythagoras",
         isi='<div class="deret">' + bukti_luas() + rumus("9 + 16 = 25", "a² + b² = c²") + '</div>',
         narasi="Sekarang gambar persegi di setiap sisi segitiga tiga, empat, lima. Luasnya sembilan, enam belas, dan dua puluh "
                "lima. Sembilan ditambah enam belas sama dengan dua puluh lima! Inilah teorema Pythagoras: c kuadrat sama "
                "dengan a kuadrat ditambah b kuadrat."),
    dict(fase="Sesi 2 · Fase II", judul="Pilih rumus sesuai yang dicari",
         isi='<div class="dua"><div class="pilih biru"><b>Mencari sisi miring c</b>' + rumus("c² = a² + b²") + '<p>kuadratnya <b>dijumlah</b></p></div>'
             '<div class="pilih pink"><b>Mencari sisi siku-siku</b>' + rumus("a² = c² − b²", "b² = c² − a²") + '<p>kuadratnya <b>dikurang</b></p></div></div>',
         narasi="Pilih rumus sesuai yang dicari. Kalau yang dicari sisi miring, kuadrat kedua sisi dijumlah. Kalau yang dicari "
                "sisi siku-siku, kuadratnya dikurang: a kuadrat sama dengan c kuadrat dikurangi b kuadrat."),
    dict(fase="Sesi 2 · Fase III", judul="Mencari sisi miring",
         isi='<div class="deret">' + segitiga(6, 8, "a = 6", "b = 8", "c = ?", warna=("k", "k", "d")) +
             rumus("c² = 6² + 8²", "c² = 36 + 64 = 100", "c = √100 = 10", "Coba: a = 20, b = 15", "c² = 400 + 225 = 625 → c = 25") + '</div>',
         narasi="Contoh: a sama dengan enam dan b sama dengan delapan. c kuadrat sama dengan tiga puluh enam ditambah enam puluh "
                "empat, yaitu seratus. Jadi c sama dengan akar seratus, yaitu sepuluh. Giliranmu: sisi dua puluh dan lima "
                "belas. c kuadrat sama dengan empat ratus ditambah dua ratus dua puluh lima, yaitu enam ratus dua puluh lima. "
                "Jadi c sama dengan dua puluh lima sentimeter."),
    dict(fase="Sesi 2 · Fase III", judul="Mencari sisi siku-siku",
         isi='<div class="deret">' + segitiga(6, 8, "a = 6", "b = ?", "c = 10", warna=("k", "d", "k")) +
             rumus("b² = c² − a²", "b² = 100 − 36 = 64", "b = √64 = 8", "Coba: c = 13, b = 5", "a² = 169 − 25 = 144 → a = 12") + '</div>',
         narasi="Kalau yang dicari sisi siku-siku, kita kurangkan. Sisi miring sepuluh dan a enam: b kuadrat sama dengan seratus "
                "dikurangi tiga puluh enam, yaitu enam puluh empat. Jadi b sama dengan delapan. Coba sendiri: sisi miring tiga "
                "belas dan b lima. a kuadrat sama dengan seratus enam puluh sembilan dikurangi dua puluh lima, yaitu seratus "
                "empat puluh empat. Jadi a sama dengan dua belas."),
    # ------------------------------- SESI 3 -------------------------------
    dict(fase="Sesi 3 · Fase I", judul="Ayo amati: soal kapten kapal", isi=layar_app("05-laptop-sesi3-fase1-kapten-kapal.png"),
         narasi="Sesi tiga: Pythagoras dalam kehidupan sehari-hari. Baca soal ini: di sebuah kapal ada dua puluh enam domba dan "
                "sepuluh kambing. Berapa umur kaptennya? Jawabannya: tidak bisa ditentukan, karena informasinya tidak "
                "berhubungan dengan pertanyaan. Pelajarannya: pahami dulu soal sebelum menghitung."),
    dict(fase="Sesi 3 · Fase II", judul="Strategi 5 Langkah soal cerita",
         isi='<ol class="lima"><li>Baca & tandai angka penting dan pertanyaannya</li><li>Tulis Diketahui – Ditanya (dengan satuan)</li>'
             '<li>Gambar segitiga siku-siku, beri label, warnai sisi yang dicari</li><li>Pilih rumus & hitung (miring → tambah, siku-siku → kurang)</li>'
             '<li>Cek kewajaran: sisi miring harus paling panjang</li></ol>',
         narasi="Untuk soal cerita, pakai strategi lima langkah. Satu, baca dan tandai. Dua, tulis yang diketahui dan ditanya, "
                "lengkap dengan satuannya. Tiga, gambar segitiga siku-siku dan beri label. Empat, pilih rumus dan hitung. Lima, "
                "cek kewajaran: sisi miring harus paling panjang."),
    dict(fase="Sesi 3 · Fase III", judul="Contoh 1: panjang tangga",
         isi='<div class="deret">' + tangga_dinding("3 m", "4 m", "?", "panjang") + rumus("tangga = sisi miring", "c² = 3² + 4²", "c² = 9 + 16 = 25", "c = 5 m") + '</div>',
         narasi="Contoh satu. Kaki tangga tiga meter dari dinding, ujungnya menyentuh dinding setinggi empat meter. Tangga "
                "berada di depan sudut siku-siku, jadi tangga adalah sisi miring. c kuadrat sama dengan sembilan ditambah "
                "enam belas, yaitu dua puluh lima. Panjang tangga lima meter."),
    dict(fase="Sesi 3 · Fase III", judul="Contoh 2: tinggi layang-layang",
         isi='<div class="deret">' + segitiga(20, 21, "a = 20 m", "b = ?", "c = 29 m", warna=("k", "d", "k"),
                                              lebar=420, tinggi_kotak=300) + rumus("benang = sisi miring c = 29 m", "jarak mendatar a = 20 m",
                                                                                   "tinggi = b", "b² = 29² − 20²", "b² = 841 − 400 = 441", "b = 21 m") + '</div>',
         narasi="Contoh dua. Benang layang-layang dua puluh sembilan meter, jarak mendatar dua puluh meter. Benang adalah sisi "
                "miring, dan yang dicari tinggi, yaitu sisi siku-siku, jadi kita kurangkan. b kuadrat sama dengan delapan ratus "
                "empat puluh satu dikurangi empat ratus, yaitu empat ratus empat puluh satu. Tinggi layang-layang dua puluh satu meter."),
    dict(fase="Sesi 3 · Fase III", judul="Contoh 3 & 4: jarak terpendek, diagonal layar",
         isi='<div class="dua"><div class="pilih biru"><b>Andi: 15 m ke timur, 20 m ke utara</b>' + rumus("c² = 225 + 400 = 625", "c = 25 m") + '</div>'
             '<div class="pilih pink"><b>Layar 28 cm × 21 cm</b>' + rumus("c² = 784 + 441 = 1225", "c = 35 cm") + '</div></div>',
         narasi="Contoh tiga. Andi berjalan lima belas meter ke timur lalu dua puluh meter ke utara. Jarak terpendek adalah sisi "
                "miring: c kuadrat sama dengan dua ratus dua puluh lima ditambah empat ratus, yaitu enam ratus dua puluh lima, "
                "jadi dua puluh lima meter. Contoh empat. Ukuran layar dihitung dari diagonalnya. Layar dua puluh delapan kali "
                "dua puluh satu sentimeter punya diagonal tiga puluh lima sentimeter."),
    dict(fase="Sesi 3 · Fase II", judul="Tripel Pythagoras",
         isi='<div class="deret">' + rumus("3, 4, 5 · 6, 8, 10", "20, 21, 29 · 9, 40, 41", "15² + 20² = 625 = 25² ✓", "4, 5, 6 → 16 + 25 = 41 ≠ 36 ✗") + '</div>',
         narasi="Tiga bilangan bulat yang memenuhi rumus Pythagoras disebut tripel Pythagoras, misalnya tiga, empat, lima dan "
                "enam, delapan, sepuluh. Cara memeriksanya: kuadratkan dua bilangan terkecil, jumlahkan, lalu bandingkan dengan "
                "kuadrat bilangan terbesar. Empat, lima, enam bukan tripel, karena enam belas ditambah dua puluh lima tidak sama "
                "dengan tiga puluh enam."),
    dict(fase="Fase III · Refleksi", judul="Refleksi",
         isi='<ul class="besar"><li>Mengapa mencari sisi siku-siku memakai <b>pengurangan</b>?</li>'
             '<li>Bagaimana tahu jawabanmu masuk akal tanpa menghitung ulang?</li>'
             '<li>🪞 Fungsi berpikir apa yang kamu pakai: mengamati, membandingkan, memberi label, memakai rumus?</li></ul>',
         narasi="Sekarang refleksikan. Mengapa saat mencari sisi siku-siku kita memakai pengurangan? Bagaimana kamu tahu "
                "jawabanmu masuk akal tanpa menghitung ulang? Dan fungsi berpikir apa yang paling membantumu hari ini?"),
    # --------------------------- FITUR APLIKASI ---------------------------
    dict(fase="Memakai aplikasi", judul="Kalkulator & Cek Prasyarat", isi=layar_app("06-laptop-kalkulator.png"),
         narasi="Di aplikasi PELITA, mulai dari cek prasyarat kuadrat dan akar di menu Belajar. Menu Kalkulator membantu "
                "memeriksa langkahmu: pilih sisi yang dicari, isi dua sisi lainnya, lalu lihat langkah hitung dan gambar "
                "segitiganya."),
    dict(fase="Memakai aplikasi", judul="Latihan Soal & Tes", isi=layar_app("07-laptop-latihan-soal.png"),
         narasi="Di pertemuan kedua, setelah sesi tiga, kerjakan menu Latihan Soal minimal lima soal. Setiap soal dikerjakan "
                "bertahap: diketahui dan ditanya, tunjuk sisi miring, lalu hitung. Menu Tes berisi pre-test, kuesioner di akhir "
                "pertemuan satu dan pertemuan dua, lalu post-test."),
    dict(fase="Memakai aplikasi", judul="Tanya Siku", isi=layar_app("09-laptop-tanya-siku-mandiri.png"),
         narasi="Kalau bingung, tekan tombol Tanya Siku. Siku membimbing langkah demi langkah: amati, hubungkan, pakai alat, "
                "lalu jelaskan. Siku memberi petunjuk, bukan jawaban akhir, dan tetap bisa menjawab walaupun internet AI "
                "sedang gangguan."),
    dict(fase="Transendensi", judul="🌏 Pythagoras ada di mana-mana",
         isi='<ul class="besar"><li>Tukang bangunan memakai pola 3-4-5 agar pojok bangunan siku.</li>'
             '<li>Ukuran layar TV & HP dihitung dari diagonalnya.</li><li>Kawat penopang tiang, diagonal taman, jarak berjalan.</li></ul>'
             '<p class="sorot">Belajar di <b>pelita-azkiah-safira-pythagoras.vercel.app</b></p>',
         narasi="Pythagoras ada di mana-mana: tukang bangunan memakai pola tiga, empat, lima, ukuran layar dihitung dari "
                "diagonalnya, juga kawat penopang tiang dan diagonal taman. Ayo lanjut belajar di aplikasi PELITA. Sampai jumpa!"),
]

GAYA = """
@import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Itim&display=block');
* { box-sizing: border-box; margin: 0; }
html, body { width: 1280px; height: 720px; overflow: hidden; }
body { font-family: 'Itim', sans-serif; color: #3f3566; position: relative;
  background: radial-gradient(circle, rgba(255,255,255,.65) 3px, transparent 3.5px) 0 0 / 34px 34px,
              linear-gradient(160deg, #cfeaff 0%, #e9e2ff 50%, #ffd8ec 100%); }
.bendera { position: absolute; top: 0; left: 0; width: 1280px; height: 46px; }
.label-fase { position: absolute; top: 52px; left: 50%; translate: -50% 0; background: #fff; border: 3px solid #ff9fcb;
  color: #d9468f; border-radius: 99px; padding: 2px 22px; font: 26px 'Bubblegum Sans', sans-serif; }
h1 { position: absolute; top: 100px; left: 0; right: 0; text-align: center; font: 58px 'Bubblegum Sans', sans-serif;
  color: #7b4fd0; text-shadow: 0 4px 0 #fff, 0 6px 0 #ffd6ea; }
.panggung { position: absolute; top: 185px; left: 60px; right: 60px; bottom: 150px; display: flex; align-items: center;
  justify-content: center; gap: 30px; background: rgba(255,255,255,.82); border: 4px solid #fff; border-radius: 30px;
  box-shadow: 0 0 0 4px #ffc6e0, 0 12px 0 4px #ffd6ea; padding: 16px 30px; }
.deret { display: flex; align-items: center; justify-content: center; gap: 46px; }
.benda { text-align: center; } .benda svg { width: 150px; height: 150px; } .benda p { font-size: 26px; }
.sorot { position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 26px; }
.persegi { text-align: center; font-size: 30px; } .persegi p { margin-top: 6px; }
.rumus { font: 34px Consolas, monospace; background: #f4efff; border-radius: 18px; padding: 14px 26px; line-height: 1.5; }
.gbr { width: 340px; height: auto; } .gbr text { font-size: 14px; }
ul.besar { font-size: 34px; line-height: 1.5; padding-left: 40px; }
.dua { display: flex; gap: 40px; } .pilih { border-radius: 24px; padding: 18px 28px; text-align: center; font-size: 30px; }
.pilih .rumus { margin: 12px 0; } .biru { background: #e8f4ff; border: 4px solid #8fcaff; } .pink { background: #fff0f7; border: 4px solid #ff9fcb; }
ol.lima { font-size: 30px; line-height: 1.55; }
.tangkapan { max-height: 100%; max-width: 100%; border-radius: 18px; border: 4px solid #fff; }
.siku { position: absolute; left: 34px; bottom: 26px; width: 120px; height: auto; filter: drop-shadow(0 6px 0 rgba(255,198,224,.9)); }
.sub { position: absolute; left: 175px; right: 40px; bottom: 22px; min-height: 96px; display: flex; align-items: center;
  background: #fff; border: 3px solid #bfe3ff; border-radius: 26px; padding: 10px 22px; font-size: 23px; line-height: 1.3; }
.sub::before { content: ''; position: absolute; left: -16px; bottom: 30px; border: 14px solid transparent; border-right-color: #bfe3ff; }
"""
BENDERA = ('<svg class="bendera" viewBox="0 0 1280 46" preserveAspectRatio="none"><path d="M0 4 Q640 40 1280 4" fill="none" stroke="#6b5a8e" stroke-width="2"/>'
           + "".join(f'<path d="M{20 + i * 50} {4 + 18 * (1 - ((20 + i * 50 - 640) / 640) ** 2)} l26 0 l-13 22 z" fill="{w}" stroke="#6b5a8e" stroke-width="1.6"/>'
                     for i, w in zip(range(26), ["#ff8fc4", "#7cc3ff", "#ffe27a", "#c4b5fd", "#b8f0d0"] * 6)) + '</svg>')


def ringkas(teks, maks=210):
    """Subtitle: potong narasi panjang menjadi kalimat-kalimat awal yang muat di layar."""
    if len(teks) <= maks:
        return teks
    keluaran = ""
    for kalimat in teks.replace("! ", "!|").replace(". ", ".|").replace("? ", "?|").split("|"):
        if len(keluaran) + len(kalimat) > maks:
            break
        keluaran += kalimat + " "
    return keluaran.strip() or teks[:maks] + "…"


def durasi(berkas):
    with wave.open(berkas) as w:
        return w.getnframes() / w.getframerate()


klip = []
for i, a in enumerate(ADEGAN, 1):
    dasar = os.path.join(KERJA, f"adegan-{i:02d}")
    # ---- narasi ----
    with open(dasar + ".txt", "w", encoding="utf-8") as f:
        f.write(a["narasi"])
    subprocess.run(["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", TTS, "-Masuk", dasar + ".txt",
                    "-Keluar", dasar + ".wav"], check=True, capture_output=True)
    # ---- slide: subtitle dibagi dua bila narasi panjang (bagian 1 & 2 bergantian di tengah durasi) ----
    kalimat = [k.strip() for k in a["narasi"].replace("! ", "!|").replace(". ", ".|").replace("? ", "?|").split("|") if k.strip()]
    # subtitle dibagi menjadi beberapa layar berisi ≤ 200 huruf, lama tiap layar sebanding panjang teksnya
    bagian = []
    for k in kalimat:
        if bagian and len(bagian[-1]) + len(k) < 200:
            bagian[-1] += " " + k
        else:
            bagian.append(k)
    gambar = []
    for j, sub in enumerate(bagian):
        fase = f'<div class="label-fase">{escape(a["fase"])}</div>' if a["fase"] else ""
        html = (f'<!doctype html><html lang="id"><head><meta charset="utf-8"><style>{GAYA}</style></head><body>{BENDERA}{fase}'
                f'<h1>{escape(a["judul"])}</h1><div class="panggung">{a["isi"]}</div>{SIKU}<div class="sub">{escape(sub)}</div></body></html>')
        halaman = f"{dasar}-{j}.html"
        png = f"{dasar}-{j}.png"
        with open(halaman, "w", encoding="utf-8") as f:
            f.write(html)
        subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1280,720",
                        "--virtual-time-budget=9000", f"--user-data-dir={os.path.join(KERJA, 'edge-profil')}",
                        f"--screenshot={png}", "file:///" + halaman.replace(os.sep, "/")], check=True, capture_output=True, timeout=120)
        gambar.append(png)
    # ---- klip: gambar (dibagi rata) + narasi, jeda 0,9 detik, fade masuk/keluar ----
    total = durasi(dasar + ".wav") + 0.9
    mp4 = dasar + ".mp4"
    masukan, filter_ = [], []
    panjang = sum(len(x) for x in bagian)
    for j, png in enumerate(gambar):
        masukan += ["-loop", "1", "-t", f"{total * len(bagian[j]) / panjang:.3f}", "-i", png]
        filter_.append(f"[{j}:v]scale=1280:720,setsar=1,fps=30[v{j}]")
    gabung = "".join(f"[v{j}]" for j in range(len(gambar))) + f"concat=n={len(gambar)}:v=1:a=0,fade=t=in:st=0:d=0.4," \
             f"fade=t=out:st={total - 0.4:.3f}:d=0.4,format=yuv420p[v]"
    subprocess.run([FFMPEG, "-y", *masukan, "-i", dasar + ".wav", "-filter_complex", ";".join(filter_) + ";" + gabung,
                    "-map", "[v]", "-map", f"{len(gambar)}:a", "-af", "apad=pad_dur=0.9,aresample=44100", "-t", f"{total:.3f}",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-c:a", "aac", "-b:a", "128k", mp4],
                   check=True, capture_output=True)
    klip.append(mp4)
    print(f"adegan {i:02d}: {total:.1f} detik")

daftar = os.path.join(KERJA, "daftar.txt")
with open(daftar, "w", encoding="utf-8") as f:
    f.writelines(f"file '{k.replace(os.sep, '/')}'\n" for k in klip)
subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", daftar, "-c", "copy", "-movflags", "+faststart", KELUAR],
               check=True, capture_output=True)
print("selesai:", KELUAR)
