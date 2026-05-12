// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Laporan Penghasilan Komprehensif (Income Statement, ISAK 35)
// ═════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { Card, ak } from "./ui.jsx";
import { fmtRp, fmtRpPlain, getKategori, getPeriodeBounds, trxInPeriode } from "./helpers.js";
import { Header, ReportTable, Row, GroupRow, PrintBar, Signatures } from "./LaporanShared.jsx";

const { P, FONT } = ak;

export default function LaporanAktivitas({ state }) {
  const { label } = getPeriodeBounds(state.selectedPeriode);

  const { groups, expense, totIn, totOut, kenaikan } = useMemo(() => {
    const trx = trxInPeriode(state, state.selectedPeriode);
    const g = { UNRESTRICTED: {}, TEMP_RESTRICTED: {}, PERM_RESTRICTED: {} };
    const e = {};
    trx.forEach((t) => {
      if (t.tipe === "IN") {
        const kat = getKategori(state, t.kategoriId);
        const klas = (kat && kat.klasifikasi) || "UNRESTRICTED";
        const nama = kat ? kat.nama : "Lainnya";
        g[klas][nama] = (g[klas][nama] || 0) + t.nominal;
      } else {
        const kat = getKategori(state, t.kategoriId);
        const nama = kat ? kat.nama : "Lainnya";
        e[nama] = (e[nama] || 0) + t.nominal;
      }
    });
    const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
    const ti = sum(g.UNRESTRICTED) + sum(g.TEMP_RESTRICTED) + sum(g.PERM_RESTRICTED);
    const to = sum(e);
    return { groups: g, expense: e, totIn: ti, totOut: to, kenaikan: ti - to };
  }, [state]);

  const renderGroup = (title, obj) => {
    const items = Object.entries(obj).filter(([, v]) => v > 0);
    if (!items.length) return null;
    const sub = items.reduce((a, [, v]) => a + v, 0);
    return (
      <>
        <GroupRow title={title} />
        {items.map(([k, v]) => (
          <Row key={k} indent={1} label={k} value={fmtRp(v)} />
        ))}
        <Row italic indent={1} label="Sub-total" value={fmtRp(sub)} />
      </>
    );
  };

  return (
    <Card style={{ padding: 36, maxWidth: 960, margin: "0 auto" }}>
      <Header
        title={state.profil.nama || "Masjid"}
        subtitle="Laporan Penghasilan Komprehensif"
        meta={<>untuk periode {label}</>}
      />

      <ReportTable>
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
            }}
          >
            PENGHASILAN
          </th>
        </tr>
        {renderGroup("Tanpa Pembatasan", groups.UNRESTRICTED)}
        {renderGroup("Dengan Pembatasan — Temporer", groups.TEMP_RESTRICTED)}
        {renderGroup("Dengan Pembatasan — Permanen", groups.PERM_RESTRICTED)}
        <Row strong border="thick" label="TOTAL PENGHASILAN" value={fmtRp(totIn)} valueColor={P.jade700} />

        <tr><td style={{ padding: 12 }} /></tr>

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
            }}
          >
            BEBAN
          </th>
        </tr>
        {Object.entries(expense).length === 0 ? (
          <tr>
            <td colSpan={2} style={{ paddingLeft: 14, color: "rgba(28,38,32,0.4)", fontFamily: FONT.body, fontSize: 14 }}>
              Tidak ada beban pada periode ini
            </td>
          </tr>
        ) : (
          Object.entries(expense).map(([k, v]) => (
            <Row key={k} indent={1} label={k} value={fmtRp(v)} />
          ))
        )}
        <Row strong border="thick" label="TOTAL BEBAN" value={`(${fmtRpPlain(totOut)})`} valueColor={P.rose700} />

        <tr style={{ background: P.jade50 }}>
          <td
            style={{
              padding: "12px 0",
              fontWeight: 600,
              color: P.jade900,
              fontFamily: FONT.body,
              fontSize: 14,
            }}
          >
            KENAIKAN (PENURUNAN) ASET NETO
          </td>
          <td
            style={{
              textAlign: "right",
              padding: "12px 0",
              fontFamily: FONT.mono,
              fontWeight: 600,
              color: P.jade900,
              fontSize: 14,
            }}
          >
            {fmtRp(kenaikan)}
          </td>
        </tr>
      </ReportTable>

      <PrintBar onClick={() => window.print()} />
      <Signatures profil={state.profil} />
    </Card>
  );
}
