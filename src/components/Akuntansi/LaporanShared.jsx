// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Laporan shared primitives
// Reused by LaporanPosisi, LaporanAktivitas, LaporanArusKas, Catatan.
// ═════════════════════════════════════════════════════════════════════

import { Btn, ak } from "./ui.jsx";

const { P, FONT } = ak;

export function Header({ title, subtitle, meta }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: 24,
        borderBottom: `1px solid ${P.ink100}`,
        paddingBottom: 18,
      }}
    >
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
      <h2 style={{ fontFamily: FONT.display, fontSize: 28, color: P.ink900, margin: 0 }}>
        {title}
      </h2>
      <div
        style={{
          fontFamily: FONT.display,
          fontStyle: "italic",
          fontSize: 17,
          color: P.ink900,
          marginTop: 4,
        }}
      >
        {subtitle}
      </div>
      {meta ? (
        <div
          style={{
            fontSize: 13,
            color: "rgba(28,38,32,0.6)",
            marginTop: 4,
            fontFamily: FONT.body,
          }}
        >
          {meta}
        </div>
      ) : null}
    </div>
  );
}

export function ReportTable({ children }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Row({
  label,
  value,
  strong,
  indent = 0,
  subtle,
  valueColor,
  italic,
  border,
}) {
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
    <div
      style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}
      className="ak-no-print"
    >
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
        <div
          style={{
            borderTop: `1px solid ${P.ink900}`,
            paddingTop: 4,
            marginTop: 50,
          }}
        >
          {profil?.ketua || "Ketua DKM"}
        </div>
        <div>Ketua DKM</div>
      </div>
      <div>
        <div
          style={{
            borderTop: `1px solid ${P.ink900}`,
            paddingTop: 4,
            marginTop: 50,
          }}
        >
          {profil?.bendahara || "Bendahara"}
        </div>
        <div>Bendahara</div>
      </div>
    </div>
  );
}

// Used by LaporanArusKas section headings.
export function SectionHead({ title }) {
  return (
    <tr>
      <th
        colSpan={2}
        style={{
          padding: "0 0 8px",
          fontFamily: FONT.display,
          fontSize: 16,
          color: P.ink900,
          textAlign: "left",
          textTransform: "none",
          letterSpacing: 0,
          borderBottom: "none",
        }}
      >
        {title}
      </th>
    </tr>
  );
}
