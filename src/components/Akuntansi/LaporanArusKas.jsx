// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Laporan Arus Kas (Cash Flow, metode langsung)
// ═════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import { Card, ak } from "./ui.jsx";
import { fmtRp, fmtRpPlain, getKategori, getPeriodeBounds, trxInPeriode } from "./helpers.js";
import { Header, ReportTable, Row, PrintBar, Signatures } from "./LaporanPosisi.jsx";

const { P, FONT } = ak;

export default function LaporanArusKas({ state }) {
  const { label } = getPeriodeBounds(state.selectedPeriode);

  const { operasi, investasi, pendanaan, netOperasi, netInvestasi, netPendanaan, netTotal } = useMemo(() => {
    const trx = trxInPeriode(state, state.selectedPeriode);

    const op = { in: 0, out: 0, items_in: {}, items_out: {} };
    const inv = { in: 0, out: 0, items: {} };
    const pen = { in: 0, out: 0, items: {} };

    trx.forEach((t) => {
      const kat = getKategori(state, t.kategoriId);
      const nama = kat ? kat.nama : "Lainnya";
      const isInvestasi = /investasi|aset tetap/i.test(nama);
      const isPendanaan = /wakaf|pinjaman|pembangunan & renovasi/i.test(nama);

      if (isInvestasi) {
        if (t.tipe === "IN") inv.in += t.nominal;
        else inv.out += t.nominal;
        inv.items[nama] = (inv.items[nama] || 0) + (t.tipe === "IN" ? t.nominal : -t.nominal);
      } else if (isPendanaan) {
        if (t.tipe === "IN") pen.in += t.nominal;
        else pen.out += t.nominal;
        pen.items[nama] = (pen.items[nama] || 0) + (t.tipe === "IN" ? t.nominal : -t.nominal);
      } else if (t.tipe === "IN") {
        op.in += t.nominal;
        op.items_in[nama] = (op.items_in[nama] || 0) + t.nominal;
      } else {
        op.out += t.nominal;
        op.items_out[nama] = (op.items_out[nama] || 0) + t.nominal;
      }
    });

    const nOp = op.in - op.out;
    const nInv = inv.in - inv.out;
    const nPen = pen.in - pen.out;
    return {
      operasi: op,
      investasi: inv,
      pendanaan: pen,
      netOperasi: nOp,
      netInvestasi: nInv,
      netPendanaan: nPen,
      netTotal: nOp + nInv + nPen,
    };
  }, [state]);

  const fmtSigned = (v) => (v >= 0 ? fmtRp(v) : `(${fmtRpPlain(-v)})`);

  const renderItems = (obj, signed) =>
    Object.entries(obj).map(([k, v]) => (
      <Row key={k} indent={2} label={k} value={signed ? fmtSigned(v) : fmtRp(v)} />
    ));

  return (
    <Card style={{ padding: 36, maxWidth: 960, margin: "0 auto" }}>
      <Header
        title={state.profil.nama || "Masjid"}
        subtitle="Laporan Arus Kas — Metode Langsung"
        meta={<>untuk periode {label}</>}
      />

      <ReportTable>
        <SectionHead title="ARUS KAS DARI AKTIVITAS OPERASI" />
        <Row indent={1} label="Penerimaan" value="" italic />
        {Object.keys(operasi.items_in).length ? renderItems(operasi.items_in) : <Row indent={2} label="—" value="" italic />}
        <Row indent={1} label="Pembayaran" value="" italic />
        {Object.keys(operasi.items_out).length ? (
          Object.entries(operasi.items_out).map(([k, v]) => (
            <Row key={k} indent={2} label={k} value={`(${fmtRpPlain(v)})`} />
          ))
        ) : (
          <Row indent={2} label="—" value="" italic />
        )}
        <Row
          strong
          border="thick"
          label="Arus Kas Bersih dari Aktivitas Operasi"
          value={fmtRp(netOperasi)}
          valueColor={netOperasi >= 0 ? P.jade700 : P.rose700}
        />

        <tr><td style={{ padding: 12 }} /></tr>

        <SectionHead title="ARUS KAS DARI AKTIVITAS INVESTASI" />
        {Object.keys(investasi.items).length ? (
          renderItems(investasi.items, true)
        ) : (
          <Row indent={1} label="Tidak ada aktivitas investasi pada periode ini" value="" italic />
        )}
        <Row strong border="thick" label="Arus Kas Bersih dari Aktivitas Investasi" value={fmtRp(netInvestasi)} />

        <tr><td style={{ padding: 12 }} /></tr>

        <SectionHead title="ARUS KAS DARI AKTIVITAS PENDANAAN" />
        {Object.keys(pendanaan.items).length ? (
          renderItems(pendanaan.items, true)
        ) : (
          <Row indent={1} label="Tidak ada aktivitas pendanaan pada periode ini" value="" italic />
        )}
        <Row strong border="thick" label="Arus Kas Bersih dari Aktivitas Pendanaan" value={fmtRp(netPendanaan)} />

        <tr style={{ background: P.jade50 }}>
          <td
            style={{
              padding: "14px 0",
              fontWeight: 600,
              color: P.jade900,
              fontFamily: FONT.body,
              fontSize: 14,
              borderTop: `2px solid ${P.jade900}`,
            }}
          >
            KENAIKAN (PENURUNAN) BERSIH KAS
          </td>
          <td
            style={{
              textAlign: "right",
              padding: "14px 0",
              fontFamily: FONT.mono,
              fontWeight: 600,
              color: P.jade900,
              fontSize: 14,
              borderTop: `2px solid ${P.jade900}`,
            }}
          >
            {fmtRp(netTotal)}
          </td>
        </tr>
      </ReportTable>

      <PrintBar onClick={() => window.print()} />
      <Signatures profil={state.profil} />
    </Card>
  );
}

function SectionHead({ title }) {
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
