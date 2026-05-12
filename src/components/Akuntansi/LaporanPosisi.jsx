// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Laporan Posisi Keuangan (Balance Sheet, ISAK 35)
// ═════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { Btn, Card, ak } from "./ui.jsx";
import { aggregateBuckets, fmtDateLong, fmtRp } from "./helpers.js";

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

// ── Shared little pieces (also reused by other laporan components) ────
export function Header({ title, subtitle, meta }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 24, borderBottom: `1px solid ${P.ink100}`, paddingBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: P.brass500,
          marginBottom: 4,
          fontFamily: FONT.body,
        }}
      >
        LAPORAN KEUANGAN ISAK 35
      </div>
      <h2 style={{ fontFamily: FONT.display, fontSize: 28, color: P.ink900, margin: 0 }}>{title}</h2>
      <div style={{ fontFamily: FONT.display, fontStyle: "italic", fontSize: 17, color: P.ink900, marginTop: 4 }}>
        {subtitle}
      </div>
      {meta ? (
        <div style={{ fontSize: 13, color: "rgba(28,38,32,0.6)", marginTop: 4, fontFamily: FONT.body }}>{meta}</div>
      ) : null}
    </div>
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

export function ReportTable({ children }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Row({ label, value, strong, indent = 0, subtle, valueColor, italic, border }) {
  return (
    <tr style={subtle ? { background: P.ink50 } : undefined}>
      <td
        style={{
          padding: "6px 0",
          paddingLeft: indent * 14,
          fontWeight: strong ? 600 : 400,
          fontStyle: italic ? "italic" : "normal",
          color: italic ? "rgba(28,38,32,0.6)" : P.ink900,
          fontFamily: FONT.body,
          fontSize: 14,
          borderTop: border === "thick" ? `2px solid ${P.ink900}` : "none",
        }}
      >
        {label}
      </td>
      <td
        style={{
          textAlign: "right",
          padding: "6px 0",
          fontFamily: FONT.mono,
          fontSize: 14,
          fontWeight: strong ? 600 : 400,
          fontStyle: italic ? "italic" : "normal",
          color: valueColor || (italic ? "rgba(28,38,32,0.6)" : P.ink900),
          borderTop: border === "thick" ? `2px solid ${P.ink900}` : "none",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

export function GroupRow({ title }) {
  return (
    <tr style={{ background: P.ink50 }}>
      <td
        colSpan={2}
        style={{
          padding: "10px 0",
          fontFamily: FONT.body,
          fontWeight: 600,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: P.jade700,
        }}
      >
        {title}
      </td>
    </tr>
  );
}

export function PrintBar({ onClick }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }} className="ak-no-print">
      <Btn variant="secondary" onClick={onClick}>
        Cetak
      </Btn>
    </div>
  );
}

export function Signatures({ profil }) {
  return (
    <div
      className="ak-print-only"
      style={{
        marginTop: 40,
        display: "none",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        textAlign: "center",
        fontSize: 12,
        color: "rgba(28,38,32,0.7)",
        fontFamily: FONT.body,
      }}
    >
      <div>
        <div style={{ borderTop: `1px solid ${P.ink900}`, paddingTop: 4, marginTop: 50 }}>
          {profil?.ketua || "Ketua DKM"}
        </div>
        <div>Ketua DKM</div>
      </div>
      <div>
        <div style={{ borderTop: `1px solid ${P.ink900}`, paddingTop: 4, marginTop: 50 }}>
          {profil?.bendahara || "Bendahara"}
        </div>
        <div>Bendahara</div>
      </div>
    </div>
  );
}
