import { useEffect, useRef, useState } from "react";
import { Konfeti, Pelangi } from "./Hiasan.jsx";
import { SAPA, SAPAAN, SORAK, salamWaktu } from "./kalimat.js";
import Maskot from "./Maskot.jsx";
import Prisma3D from "./Prisma3D.jsx";
import { BusSekolah, GedungSMP } from "./Sekolah.jsx";
import Siswa from "./Siswa.jsx";
import Siswi from "./Siswi.jsx";

// nama kelas posisi balon kata untuk tiap karakter
const PEMBICARA = { siku: "siku", siswa: "raka", siswi: "nisa" };

const LAMA_TIDUR = 25000; // ms tanpa gerakan sebelum Siku tertidur
const GANTI_SAPAAN = 7000; // ms sebelum balon kata berganti ke kalimat berikutnya

// Panggung header: balon kata, pelangi, prisma 3D, dua siswa SMP (Raka & Nisa),
// dan maskot Siku bertopi wisuda.
// - Siku, Raka, dan Nisa bisa diklik, dan bola mata mereka mengikuti kursor/jari.
// - Bila halaman lama tidak disentuh, Siku tertidur (Zzz) sampai ada gerakan.
// - Saat `diam` (tes berlangsung) semua animasi berhenti dan karakter tidak bisa diklik.
// - `sekolah`: karakter berdiri di halaman sekolah (gedung SMP, rumput, bus lewat).
export default function Panggung({ halaman, diam, sekolah = false }) {
  const [pesan, setPesan] = useState(null); // { teks, siapa, n }
  const [hitungan, setHitungan] = useState({ total: 0 }); // jumlah klik per karakter (+ total untuk key animasi)
  const [lirik, setLirik] = useState(null);
  const [tidur, setTidur] = useState(false);
  // kalimat sapaan menu yang sedang tampil; dicatat bersama menunya agar mulai dari 0 saat ganti menu
  const [urutan, setUrutan] = useState({ halaman, n: 0 });
  const isiRef = useRef(null);
  const aktifTerakhir = useRef(0);

  // Balon kata kembali ke sapaan menu setelah beberapa detik
  useEffect(() => {
    if (!pesan) return undefined;
    const t = setTimeout(() => setPesan(null), 2800);
    return () => clearTimeout(t);
  }, [pesan]);

  // Balon kata berganti kalimat secara berkala (bila tidak ada pesan & Siku tidak tidur)
  useEffect(() => {
    if (diam || pesan || tidur) return undefined;
    const t = setInterval(
      () =>
        setUrutan((u) => ({
          halaman,
          n: (u.halaman === halaman ? u.n : 0) + 1,
        })),
      GANTI_SAPAAN,
    );
    return () => clearInterval(t);
  }, [diam, pesan, tidur, halaman]);

  // Lacak kursor: bola mata melirik, dan catat waktu aktif terakhir
  useEffect(() => {
    if (diam) return undefined;
    aktifTerakhir.current = performance.now();
    let bingkai = 0;
    const gerak = (e) => {
      aktifTerakhir.current = performance.now();
      setTidur(false);
      if (bingkai) return;
      bingkai = requestAnimationFrame(() => {
        bingkai = 0;
        const kotak = isiRef.current?.getBoundingClientRect();
        if (!kotak) return;
        const dx = e.clientX - (kotak.left + kotak.width / 2);
        const dy = e.clientY - (kotak.top + kotak.height / 2);
        const jarak = Math.hypot(dx, dy) || 1;
        const kuat = Math.min(1, jarak / 220);
        setLirik({ x: (dx / jarak) * kuat, y: (dy / jarak) * kuat });
      });
    };
    const aktif = () => {
      aktifTerakhir.current = performance.now();
      setTidur(false);
    };
    const cek = setInterval(() => {
      if (performance.now() - aktifTerakhir.current > LAMA_TIDUR)
        setTidur(true);
    }, 2000);
    window.addEventListener("pointermove", gerak);
    window.addEventListener("pointerdown", aktif);
    window.addEventListener("keydown", aktif);
    window.addEventListener("scroll", aktif, { passive: true });
    return () => {
      cancelAnimationFrame(bingkai);
      clearInterval(cek);
      window.removeEventListener("pointermove", gerak);
      window.removeEventListener("pointerdown", aktif);
      window.removeEventListener("keydown", aktif);
      window.removeEventListener("scroll", aktif);
    };
  }, [diam]);

  const klik = (siapa) => {
    if (diam) return;
    const daftar = siapa === "siku" ? SORAK : SAPA[siapa];
    const bangun = siapa === "siku" && tidur;
    setTidur(false);
    const ke = hitungan[siapa] ?? 0;
    setPesan({
      teks: bangun
        ? "Hoaam... aku bangun! Ayo belajar lagi! 😄"
        : daftar[ke % daftar.length],
      siapa,
      n: hitungan.total,
    });
    setHitungan({ ...hitungan, [siapa]: ke + 1, total: hitungan.total + 1 });
  };

  const sedangTidur = tidur && !diam && !pesan;
  const daftarSapaan = SAPAAN[halaman];
  const nomorSapaan =
    diam || urutan.halaman !== halaman ? 0 : urutan.n % daftarSapaan.length;
  const sapaanMenu =
    halaman === "belajar" && nomorSapaan === 0
      ? `${salamWaktu()} ${daftarSapaan[0]}`
      : daftarSapaan[nomorSapaan];
  const teks = diam
    ? sapaanMenu
    : pesan
      ? pesan.teks
      : sedangTidur
        ? "Zzz... Siku ketiduran. Klik Siku untuk membangunkan!"
        : sapaanMenu;
  const suasanaSiku =
    pesan?.siapa === "siku" ? "senang" : sedangTidur ? "tidur" : "halo";

  return (
    <div
      className={`panggung ${diam ? "diam" : ""} ${sekolah ? "sekolah" : ""}`}
    >
      {/* key: balon kata dianimasikan ulang setiap isinya berganti */}
      {/* balon kata muncul di atas karakter yang sedang bicara (sapaan menu & tidur = Siku) */}
      <p
        className={`gelembung oleh-${PEMBICARA[pesan?.siapa] ?? "siku"}`}
        key={
          pesan
            ? `p${pesan.n}`
            : sedangTidur
              ? "tidur"
              : `${halaman}-${nomorSapaan}`
        }
        aria-live="polite"
      >
        {teks}
      </p>
      <div className="panggung-isi" ref={isiRef}>
        <Pelangi />
        <Prisma3D />
        {sekolah && (
          <>
            <GedungSMP />
            <BusSekolah />
          </>
        )}
        <button
          type="button"
          className={`tombol-karakter tombol-siswa ${pesan?.siapa === "siswa" ? "disapa" : ""}`}
          key={pesan?.siapa === "siswa" ? `s${pesan.n}` : "siswa"}
          onClick={() => klik("siswa")}
          disabled={diam}
          aria-label="Sapa anak SMP"
        >
          {pesan?.siapa === "siswa" && <Konfeti jumlah={16} />}
          <Siswa ukuran={104} lirik={diam ? null : lirik} />
        </button>
        <button
          type="button"
          className={`tombol-karakter tombol-siswi ${pesan?.siapa === "siswi" ? "disapa" : ""}`}
          key={pesan?.siapa === "siswi" ? `i${pesan.n}` : "siswi"}
          onClick={() => klik("siswi")}
          disabled={diam}
          aria-label="Sapa siswi SMP"
        >
          {pesan?.siapa === "siswi" && <Konfeti jumlah={16} />}
          <Siswi ukuran={104} lirik={diam ? null : lirik} />
        </button>
        <button
          type="button"
          className={`tombol-karakter tombol-siku ${pesan?.siapa === "siku" ? "disapa" : ""}`}
          key={pesan?.siapa === "siku" ? `k${pesan.n}` : "siku"}
          onClick={() => klik("siku")}
          disabled={diam}
          aria-label={sedangTidur ? "Bangunkan Siku" : "Sapa Siku"}
        >
          {pesan?.siapa === "siku" && <Konfeti jumlah={22} />}
          <Maskot
            ukuran={100}
            diam={diam}
            suasana={suasanaSiku}
            lirik={diam ? null : lirik}
            topi
          />
        </button>
      </div>
      {!diam && <p className="petunjuk-klik">Klik Siku, Raka, atau Nisa!</p>}
    </div>
  );
}
