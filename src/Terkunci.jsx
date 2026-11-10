import Maskot from './Maskot.jsx'

// Pemberitahuan bagian yang belum dibuka karena urutan pertemuan (lihat alur.js)
export default function Terkunci({ pesan, judul = 'Belum dibuka' }) {
  return (
    <section className="kartu terkunci-info" role="status">
      <Maskot suasana="mikir" ukuran={64} />
      <div>
        <h2>🔒 {judul}</h2>
        <p>{pesan}</p>
      </div>
    </section>
  )
}
