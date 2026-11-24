"""Video pembelajaran "Belajar Teorema Pythagoras bersama Siku" (model RMT) untuk diunggah ke Google Drive.

Setiap adegan = slide 1280×720 (HTML → PNG lewat Edge headless) + narasi suara Indonesia (Windows "Microsoft Andika",
tts.ps1) + subtitle. Adegan disusun mengikuti fase RMT: tujuan & makna (MLE) → Fase I mengamati/membandingkan →
Fase II membangun konsep & menemukan pola → Fase III berlatih soal cerita → refleksi & transendensi.

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


ADEGAN = [
    dict(fase="", judul="PELITA · Belajar Teorema Pythagoras", isi=f'<img class="tangkapan" src="file:///{os.path.join(AKAR, "docs", "tampilan-laptop.png").replace(os.sep, "/")}">',
         narasi="Halo, teman-teman! Aku Siku, si segitiga siku-siku. Di video ini kita belajar teorema Pythagoras dengan model "
                "Rigorous Mathematical Thinking, atau R M T. Kita berpikir dalam tiga fase: mengamati dan membandingkan, "
                "membangun konsep, lalu berlatih memecahkan masalah."),
    dict(fase="Mediasi", judul="🎯 Tujuan & 💡 Mengapa penting",
         isi='<ul class="besar"><li><b>Tujuan:</b> memahami rumus c² = a² + b² dan memakainya untuk soal sehari-hari.</li>'
             '<li><b>Mengapa penting:</b> kita bisa menghitung panjang yang sulit diukur langsung, cukup dari dua sisi yang lain.</li></ul>',
         narasi="Tujuan kita hari ini: memahami rumus c kuadrat sama dengan a kuadrat ditambah b kuadrat, lalu memakainya untuk "
                "soal sehari-hari. Kenapa penting? Karena dengan rumus ini, kita bisa menghitung panjang yang sulit diukur "
                "langsung, cukup dari dua sisi yang lain."),
    dict(fase="Fase I · Pengembangan Kognitif", judul="Ayo amati: apa yang sama?",
         isi='<div class="deret">' + "".join(f'<div class="benda">{BENDA[k]}<p>{n}</p></div>' for k, n in
                                             [("tangga", "tangga & dinding"), ("buku", "pojok buku"), ("hp", "layar HP")]) +
             '</div><p class="sorot">Ciri yang sama: ada <b>sudut siku-siku (90°)</b></p>',
         narasi="Fase satu, pengembangan kognitif. Ayo amati tiga benda ini: tangga yang bersandar di dinding, pojok buku, dan "
                "layar HP. Bandingkan ketiganya. Apa ciri yang sama? Ya, semuanya punya sudut siku-siku, yaitu sudut sembilan "
                "puluh derajat."),
    dict(fase="Fase I · Pengembangan Kognitif", judul="Diputar pun tetap sama",
         isi='<div class="deret">' + segitiga(4, 3, "a", "b", "c", warna=("k", "k", "d")) +
             segitiga(4, 3, "p", "q", "r", warna=("k", "k", "d"), putar=200, cermin=True) + '</div>'
             '<p class="sorot">Sisi miring = sisi di <b>depan kotak sudut siku-siku</b>, selalu <b>paling panjang</b></p>',
         narasi="Segitiga siku-siku bisa diputar atau dibalik, tetapi tetap segitiga yang sama. Caranya, cari dulu kotak kecil "
                "sudut siku-sikunya. Sisi di depan kotak itu adalah sisi miring, dan sisi miring selalu paling panjang."),
    dict(fase="Fase II · Konten sebagai Proses", judul="Kuadrat = luas persegi",
         isi='<div class="deret">' + kotak_persegi(3, "#8fcaff") + kotak_persegi(4, "#ff9fcb") + '</div>'
             + rumus("Akar kuadrat adalah kebalikannya:  √25 = 5, karena 5² = 25"),
         narasi="Fase dua, konten sebagai proses. Kuadrat sebuah bilangan sama dengan luas persegi. Persegi bersisi tiga berisi "
                "sembilan kotak, jadi tiga kuadrat sama dengan sembilan. Persegi bersisi empat berisi enam belas kotak. Akar "
                "kuadrat adalah kebalikannya: akar dua puluh lima adalah lima."),
    dict(fase="Fase II · Konten sebagai Proses", judul="Memberi label sisi",
         isi='<div class="deret">' + segitiga(4, 3, "a (sisi siku-siku)", "b (sisi siku-siku)", "c (sisi miring)", warna=("k", "k", "d"),
                                              lebar=420, tinggi_kotak=300) + '</div>',
         narasi="Kita beri nama sisi-sisinya. Dua sisi yang mengapit sudut siku-siku disebut sisi siku-siku, kita beri nama a "
                "dan b. Sisi di depan sudut siku-siku disebut sisi miring, kita beri nama c."),
    dict(fase="Fase II · Konten sebagai Proses", judul="Menemukan pola",
         isi='<div class="deret">' + bukti_luas() + rumus("9 + 16 = 25", "a² + b² = c²") + '</div>',
         narasi="Sekarang kita temukan polanya. Gambar persegi di setiap sisi segitiga tiga, empat, lima. Luasnya sembilan, "
                "enam belas, dan dua puluh lima. Perhatikan: sembilan ditambah enam belas sama dengan dua puluh lima! Inilah "
                "teorema Pythagoras: c kuadrat sama dengan a kuadrat ditambah b kuadrat."),
    dict(fase="Fase II · Konten sebagai Proses", judul="Pilih alat yang tepat",
         isi='<div class="dua"><div class="pilih biru"><b>Mencari sisi miring c</b>' + rumus("c² = a² + b²") + '<p>kuadratnya <b>dijumlah</b></p></div>'
             '<div class="pilih pink"><b>Mencari sisi siku-siku</b>' + rumus("a² = c² − b²") + '<p>kuadratnya <b>dikurang</b></p></div></div>',
         narasi="Pilih alat yang tepat. Kalau yang dicari sisi miring, kuadrat kedua sisi dijumlah. Kalau yang dicari sisi "
                "siku-siku, kuadratnya dikurang: a kuadrat sama dengan c kuadrat dikurangi b kuadrat."),
    dict(fase="Fase II · Konten sebagai Proses", judul="Contoh: mencari sisi miring",
         isi='<div class="deret">' + segitiga(6, 8, "a = 6", "b = 8", "c = ?", warna=("k", "k", "d")) +
             rumus("c² = a² + b²", "c² = 6² + 8²", "c² = 36 + 64 = 100", "c = √100 = 10") + '</div>',
         narasi="Contoh. Diketahui a sama dengan enam dan b sama dengan delapan. Kita cari c. c kuadrat sama dengan enam kuadrat "
                "ditambah delapan kuadrat, yaitu tiga puluh enam ditambah enam puluh empat, sama dengan seratus. Jadi c sama "
                "dengan akar seratus, yaitu sepuluh."),
    dict(fase="Fase III · Latihan Konstruksi Konseptual", judul="Soal cerita: panjang tangga",
         isi='<div class="deret">' + tangga_dinding("3 m", "4 m", "?", "panjang") +
             '<ol class="lima"><li>Baca & tandai</li><li>Tulis diketahui – ditanya</li><li>Gambar & beri label</li>'
             '<li>Hitung: c² = 9 + 16 = 25, c = 5</li><li>Periksa</li></ol></div>',
         narasi="Fase tiga, berlatih. Sebuah tangga bersandar di dinding. Kaki tangga tiga meter dari dinding, dan ujungnya "
                "menyentuh dinding setinggi empat meter. Berapa panjang tangga? Pakai strategi lima langkah: baca dan tandai, "
                "tulis yang diketahui dan ditanya, gambar dan beri label, hitung, lalu periksa. Tangga adalah sisi miring. "
                "c kuadrat sama dengan sembilan ditambah enam belas, yaitu dua puluh lima. Jadi panjang tangga lima meter."),
    dict(fase="Fase III · Refleksi", judul="Periksa & refleksi",
         isi='<ul class="besar"><li>Sisi miring paling panjang? 5 m &gt; 4 m &gt; 3 m ✓</li><li>Satuan benar? meter ✓</li>'
             '<li>🪞 Fungsi berpikir apa yang kamu pakai: mengamati, membandingkan, memberi label, atau memakai rumus?</li></ul>',
         narasi="Periksa dulu: apakah sisi miring paling panjang? Lima lebih panjang dari empat dan tiga. Satuannya meter. Masuk "
                "akal! Sekarang refleksikan: fungsi berpikir apa yang tadi kamu pakai? Mengamati, membandingkan, memberi label, "
                "atau memakai rumus?"),
    dict(fase="Transendensi", judul="🌏 Pythagoras ada di mana-mana",
         isi='<ul class="besar"><li>Tukang bangunan memakai pola 3-4-5 agar pojok bangunan siku.</li>'
             '<li>Ukuran layar TV & HP dihitung dari diagonalnya.</li><li>Jarak terpendek saat berjalan ke timur lalu ke utara.</li></ul>'
             '<p class="sorot">Lanjut belajar di <b>pelita-azkiah-safira-pythagoras.vercel.app</b></p>',
         narasi="Pythagoras ada di mana-mana. Tukang bangunan memakai pola tiga, empat, lima agar pojok bangunan siku. Ukuran "
                "layar TV dan HP dihitung dari diagonalnya. Ayo lanjut belajar di aplikasi PELITA dan kerjakan lembar kerjanya. "
                "Sampai jumpa!"),
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
    tengah = max(1, len(kalimat) // 2)
    bagian = [" ".join(kalimat[:tengah]), " ".join(kalimat[tengah:])] if len(a["narasi"]) > 210 else [a["narasi"]]
    gambar = []
    for j, sub in enumerate(bagian):
        fase = f'<div class="label-fase">{escape(a["fase"])}</div>' if a["fase"] else ""
        html = (f'<!doctype html><html lang="id"><head><meta charset="utf-8"><style>{GAYA}</style></head><body>{BENDERA}{fase}'
                f'<h1>{escape(a["judul"])}</h1><div class="panggung">{a["isi"]}</div>{SIKU}<div class="sub">{escape(ringkas(sub, 240))}</div></body></html>')
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
    for j, png in enumerate(gambar):
        masukan += ["-loop", "1", "-t", f"{total / len(gambar):.3f}", "-i", png]
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
