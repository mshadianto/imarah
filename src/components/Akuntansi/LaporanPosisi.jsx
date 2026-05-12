// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Laporan Posisi Keuangan (Balance Sheet, ISAK 35)
// ═════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { Card, ak } from "./ui.jsx";
import { aggregateBuckets, fmtDateLong, fmtRp } from "./helpers.js";
import { Header, ReportTable, Row, PrintBar, Signatures } from "./LaporanShared.jsx";

// Re-export so existing imports keep working during the gradual migration.
export { Header, ReportTable, Row, GroupRow, PrintBar, Signatures } from "./LaporanShared.jsx";

const { P, FONT } = ak;

export default function LaporanPosisi({ state }) {
  const buckets = useMemo(() => aggregateBuckets(state), [state]);
  const totalAset =
    buckets.UNRESTRICTED + buckets.TEMP_RESTRICTED + buckets.PERM_RESTRICTED;

  return (
    <Card style={{ padding: 36, maxWidth: 960, margin: "0 auto" }}>
      <Header
        title={state.profil.nama || "Masjid"}
        subtitle="Laporan Posisi Keuangan"
        meta={<>per {fmtDateLong(new Date().toISOString())}</>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }} className="ak-pos-grid">
        <div>
          <h3
            style={{
              fontFamily: FONT.display,
              fontSize: 16,
              color: P.jade700,
              borderBottom: `1px solid ${P.ink100}`,
              paddingBottom: 8,
              margin: "0 0 12px",
            }}
          >
            ASET
          </h3>
          <ReportTable>
            <Row label="Kas dan Setara Kas" value={fmtRp(totalAset)} />
            <Row label="Piutang" value="—" />
            <Row label="Persediaan" value="—" />
            <Row label="Aset Tetap (Bangunan, Tanah)" value="—" />
            <Row strong subtle label="TOTAL ASET" value={fmtRp(totalAset)} valueColor={P.jade700} />
          </ReportTable>
        </div>

        <div>
          <h3
            style={{
              fontFamily: FONT.display,
              fontSize: 16,
              color: P.jade700,
              borderBottom: `1px solid ${P.ink100}`,
              paddingBottom: 8,
              margin: "0 0 12px",
            }}
          >
            LIABILITAS &amp; ASET NETO
          </h3>
          <div style={subHead}>Liabilitas</div>
          <ReportTable>
            <Row label="Utang Usaha" value="—" />
            <Row label="Pendapatan Diterima di Muka" value="—" />
          </ReportTable>
          <div style={{ ...subHead, marginTop: 18 }}>Aset Neto</div>
          <ReportTable>
            <Row
              label="Tanpa Pembatasan dari Pemberi Sumber Daya"
              value={fmtRp(buckets.UNRESTRICTED)}
            />
            <Row
              label="Dengan Pembatasan dari Pemberi Sumber Daya — Temporer"
              value={fmtRp(buckets.TEMP_RESTRICTED)}
            />
            <Row
              label="Dengan Pembatasan dari Pemberi Sumber Daya — Permanen"
              value={fmtRp(buckets.PERM_RESTRICTED)}
            />
            <Row
              strong
              subtle
              label="TOTAL LIABILITAS & ASET NETO"
              value={fmtRp(totalAset)}
              valueColor={P.jade700}
            />
          </ReportTable>
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          fontSize: 12,
          color: "rgba(28,38,32,0.5)",
          borderTop: `1px solid ${P.ink100}`,
          paddingTop: 14,
          fontStyle: "italic",
        }}
      >
        Catatan: Klasifikasi aset neto disajikan sesuai ISAK 35. Lihat <strong>Catatan atas Laporan Keuangan</strong> untuk informasi lebih rinci.
      </div>

      <PrintBar onClick={() => window.print()} />
      <Signatures profil={state.profil} />

      <style>{`
        @media (max-width: 800px) { .ak-pos-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </Card>
  );
}

const subHead = {
  fontSize: 11,
  textTransform: "uppercase",
  color: "rgba(28,38,32,0.5)",
  letterSpacing: 1,
  marginTop: 8,
  marginBottom: 4,
  fontFamily: FONT.body,
};
