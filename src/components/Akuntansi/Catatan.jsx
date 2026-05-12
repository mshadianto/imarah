// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Catatan atas Laporan Keuangan
// ═════════════════════════════════════════════════════════════════════

import { Card, ak } from "./ui.jsx";
import { Header, PrintBar } from "./LaporanShared.jsx";

const { P, FONT } = ak;

export default function Catatan({ state }) {
  const { profil } = state;
  return (
    <Card style={{ padding: 36, maxWidth: 960, margin: "0 auto" }}>
      <Header title={profil.nama || "Masjid"} subtitle="Catatan atas Laporan Keuangan" />

      <div
        style={{
          fontSize: 14,
          color: "rgba(28,38,32,0.85)",
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Note open title="1. Informasi Umum Entitas">
          <p>
            <strong>{profil.nama || "Masjid"}</strong> beralamat di {profil.alamat || "—"},{" "}
            {profil.kota || "—"}. Entitas merupakan organisasi nirlaba yang bergerak di bidang keagamaan,
            pendidikan, dan sosial kemasyarakatan di bawah pengelolaan Takmir / Dewan Kemakmuran Masjid (DKM).
          </p>
          <p>
            <strong>Susunan Pengurus:</strong> Ketua DKM — {profil.ketua || "—"}; Bendahara —{" "}
            {profil.bendahara || "—"}.
          </p>
        </Note>

        <Note open title="2. Kebijakan Akuntansi Signifikan">
          <p>
            <strong>Dasar Penyusunan.</strong> Laporan keuangan disusun berdasarkan ISAK 35 — Penyajian Laporan
            Keuangan Entitas Berorientasi Non-Laba, yang merupakan interpretasi atas PSAK 1.
          </p>
          <p>
            <strong>Pengakuan Pendapatan.</strong> Penerimaan infaq, shadaqah, zakat, dan wakaf diakui pada
            saat kas atau setara kas diterima oleh kas masjid.
          </p>
          <p>
            <strong>Klasifikasi Aset Neto.</strong> Aset neto diklasifikasikan menjadi:
          </p>
          <ul style={{ paddingLeft: 22, lineHeight: 1.7 }}>
            <li><em>Tanpa Pembatasan</em> — dana yang dapat digunakan untuk kegiatan operasional umum masjid.</li>
            <li><em>Dengan Pembatasan Temporer</em> — dana yang penggunaannya dibatasi oleh tujuan atau periode tertentu (zakat, donasi pembangunan, santunan).</li>
            <li><em>Dengan Pembatasan Permanen</em> — dana yang pokoknya tidak boleh digunakan, hanya hasilnya (wakaf uang dan aset wakaf).</li>
          </ul>
          <p><strong>Mata Uang Penyajian.</strong> Rupiah Indonesia (Rp).</p>
        </Note>

        <Note title="3. Pengelolaan Dana Zakat">
          <p>
            Dana zakat dikelola terpisah dari kas operasional masjid dan disalurkan kepada delapan asnaf
            sebagaimana ditentukan dalam QS. At-Taubah ayat 60: fakir, miskin, amil, muallaf, riqab, gharim,
            fi sabilillah, dan ibnu sabil. Setiap penyaluran didokumentasikan dengan bukti penerimaan dari
            mustahiq.
          </p>
        </Note>

        <Note title="4. Wakaf">
          <p>
            Aset wakaf dicatat sebagai aset neto dengan pembatasan permanen. Pokok wakaf uang tidak boleh
            digunakan habis; hanya hasil pengelolaan (manfaat) yang dapat digunakan untuk kemaslahatan umat
            sesuai akad wakaf.
          </p>
        </Note>

        <Note title="5. Transparansi & Akuntabilitas">
          <p>
            Laporan keuangan masjid diumumkan secara berkala kepada jamaah melalui papan pengumuman dan kanal
            digital Imarah. Audit internal dilaksanakan secara berkala oleh tim independen yang dibentuk oleh
            musyawarah jamaah.
          </p>
        </Note>
      </div>

      <PrintBar onClick={() => window.print()} />
    </Card>
  );
}

function Note({ title, open, children }) {
  return (
    <details
      open={open || undefined}
      style={{ borderBottom: `1px solid ${P.ink100}`, paddingBottom: 14 }}
    >
      <summary
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: FONT.display,
          fontSize: 17,
          color: P.jade700,
          cursor: "pointer",
          listStyle: "none",
        }}
      >
        <span style={{ display: "inline-block", transition: "transform 0.2s" }}>▸</span>
        {title}
      </summary>
      <div style={{ paddingLeft: 24, marginTop: 10, color: "rgba(28,38,32,0.8)", display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </div>
    </details>
  );
}
