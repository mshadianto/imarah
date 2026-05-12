// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Buku Kas (Jurnal Harian)
// — sticky thead, sort toggle, total count, summary footer, undo-on-delete
// ═════════════════════════════════════════════════════════════════════

import { useDeferredValue, useMemo, useState } from "react";
import { Btn, Card, Input, KlasifikasiPill, Select, ak, showToast } from "./ui.jsx";
import { fmtDate, fmtRp, trxInPeriode, getKategori, getPeriodeBounds } from "./helpers.js";
import { exportCSV } from "./exports.js";

const { P, FONT } = ak;

export default function BukuKas({ state, onEdit, deleteTrx, addTrx }) {
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("ALL");
  const [sortDir, setSortDir] = useState("desc"); // newest first by default — most useful for daily entry

  // Defer the search value so a fast typist doesn't hammer the filter on each keystroke.
  const deferredSearch = useDeferredValue(search);

  const periodeLabel = getPeriodeBounds(state.selectedPeriode).label;

  const { rows, totals } = useMemo(() => {
    let list = trxInPeriode(state, state.selectedPeriode);
    if (filterTipe !== "ALL") list = list.filter((t) => t.tipe === filterTipe);
    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(
        (t) =>
          (t.uraian || "").toLowerCase().includes(q) ||
          (t.pihak || "").toLowerCase().includes(q) ||
          (t.bukti || "").toLowerCase().includes(q)
      );
    }

    // Running saldo is computed ascending then we optionally reverse for display.
    list.sort(
      (a, b) =>
        new Date(a.tanggal) - new Date(b.tanggal) ||
        (a.createdAt || "").localeCompare(b.createdAt || "")
    );

    let saldo = 0;
    let totalIn = 0;
    let totalOut = 0;
    const withSaldo = list.map((t) => {
      if (t.tipe === "IN") {
        saldo += t.nominal;
        totalIn += t.nominal;
      } else {
        saldo -= t.nominal;
        totalOut += t.nominal;
      }
      return { ...t, _saldo: saldo };
    });

    return {
      rows: sortDir === "desc" ? withSaldo.slice().reverse() : withSaldo,
      totals: { in: totalIn, out: totalOut, net: totalIn - totalOut, count: withSaldo.length },
    };
  }, [state, deferredSearch, filterTipe, sortDir]);

  // Delete with optimistic-style undo via toast action.
  const handleDelete = (trx) => {
    const snapshot = { ...trx };
    delete snapshot.id;        // addTrx will mint a fresh id
    delete snapshot.createdAt; // addTrx will set createdAt fresh

    deleteTrx(trx.id);
    showToast({
      message: `Transaksi "${trimMessage(trx.uraian)}" dihapus.`,
      action: {
        label: "Urungkan",
        onClick: () => {
          addTrx(snapshot);
          showToast("Transaksi dipulihkan");
        },
      },
    });
  };

  const isFiltered =
    filterTipe !== "ALL" || search.trim().length > 0;

  return (
    <Card padding={0}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${P.ink100}`,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "rgba(28,38,32,0.5)",
              fontFamily: FONT.body,
            }}
          >
            Jurnal Harian · {periodeLabel}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontFamily: FONT.display, fontSize: 22, color: P.ink900 }}>
              Buku Kas Masjid
            </div>
            <span
              style={{
                fontSize: 12,
                color: P.ink500,
                fontFamily: FONT.body,
                fontWeight: 500,
              }}
            >
              {totals.count} transaksi{isFiltered ? " (terfilter)" : ""}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Input
            type="text"
            placeholder="Cari uraian / pihak / no bukti…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260, padding: "8px 12px", fontSize: 13 }}
          />
          <Select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}
          >
            <option value="ALL">Semua tipe</option>
            <option value="IN">Pemasukan</option>
            <option value="OUT">Pengeluaran</option>
          </Select>
          <Btn
            variant="secondary"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            title={sortDir === "desc" ? "Saat ini: terbaru di atas" : "Saat ini: terlama di atas"}
          >
            {sortDir === "desc" ? "Terbaru ▼" : "Terlama ▲"}
          </Btn>
          <Btn variant="secondary" onClick={() => exportCSV(state)}>
            ⤓ CSV
          </Btn>
          <Btn variant="secondary" onClick={() => window.print()}>
            ⎙ Cetak
          </Btn>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }} className="ak-bukukas-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>No. Bukti</th>
              <th>Uraian</th>
              <th>Kategori</th>
              <th>Klasifikasi</th>
              <th style={{ textAlign: "right" }}>Masuk</th>
              <th style={{ textAlign: "right" }}>Keluar</th>
              <th style={{ textAlign: "right" }}>Saldo</th>
              <th style={{ textAlign: "right" }} className="ak-no-print">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    color: "rgba(28,38,32,0.45)",
                    padding: 48,
                    fontFamily: FONT.body,
                  }}
                >
                  {isFiltered ? (
                    <>
                      Tidak ada transaksi yang cocok dengan filter saat ini.
                      <div style={{ marginTop: 12 }}>
                        <Btn
                          variant="ghost"
                          onClick={() => {
                            setSearch("");
                            setFilterTipe("ALL");
                          }}
                        >
                          Reset filter
                        </Btn>
                      </div>
                    </>
                  ) : (
                    <>
                      Belum ada transaksi pada periode <strong>{periodeLabel}</strong>.
                    </>
                  )}
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const kat = getKategori(state, t.kategoriId);
                return (
                  <tr key={t.id}>
                    <td style={{ fontFamily: FONT.mono, fontSize: 12, whiteSpace: "nowrap" }}>
                      {fmtDate(t.tanggal)}
                    </td>
                    <td style={{ fontFamily: FONT.mono, fontSize: 12, color: "rgba(28,38,32,0.55)" }}>
                      {t.bukti || "-"}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{t.uraian}</div>
                      {(t.pihak || t.metode) && (
                        <div style={{ fontSize: 11, color: "rgba(28,38,32,0.5)" }}>
                          {t.pihak || ""}
                          {t.pihak && t.metode ? " · " : ""}
                          {t.metode || ""}
                        </div>
                      )}
                    </td>
                    <td>{kat ? kat.nama : "—"}</td>
                    <td>
                      <KlasifikasiPill value={t.klasifikasi} />
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontFamily: FONT.mono,
                        color: t.tipe === "IN" ? P.jade700 : "inherit",
                      }}
                    >
                      {t.tipe === "IN" ? fmtRp(t.nominal) : "—"}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontFamily: FONT.mono,
                        color: t.tipe === "OUT" ? P.rose700 : "inherit",
                      }}
                    >
                      {t.tipe === "OUT" ? fmtRp(t.nominal) : "—"}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: FONT.mono }}>{fmtRp(t._saldo)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }} className="ak-no-print">
                      <button
                        title="Ubah"
                        onClick={() => onEdit && onEdit(t.id)}
                        style={iconBtnStyle}
                      >
                        ✎
                      </button>
                      <button
                        title="Hapus"
                        onClick={() => handleDelete(t)}
                        style={iconBtnStyle}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {rows.length > 0 ? (
            <tfoot>
              <tr style={{ background: P.ink50 }}>
                <td
                  colSpan={5}
                  style={{
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontFamily: FONT.body,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    color: P.ink500,
                    borderTop: `2px solid ${P.ink200}`,
                  }}
                >
                  Total {isFiltered ? "(filter aktif)" : "periode"}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: FONT.mono,
                    fontWeight: 600,
                    color: P.jade700,
                    padding: "12px 16px",
                    borderTop: `2px solid ${P.ink200}`,
                  }}
                >
                  {fmtRp(totals.in)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: FONT.mono,
                    fontWeight: 600,
                    color: P.rose700,
                    padding: "12px 16px",
                    borderTop: `2px solid ${P.ink200}`,
                  }}
                >
                  {fmtRp(totals.out)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontFamily: FONT.mono,
                    fontWeight: 700,
                    color: totals.net >= 0 ? P.jade900 : P.rose700,
                    padding: "12px 16px",
                    borderTop: `2px solid ${P.ink200}`,
                  }}
                >
                  {fmtRp(totals.net)}
                </td>
                <td className="ak-no-print" style={{ borderTop: `2px solid ${P.ink200}` }} />
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {/* Sticky thead within the Akuntansi scroll container, plus print rules. */}
      <style>{`
        .ak-bukukas-table thead th {
          position: sticky;
          top: 0;
          background: #fff;
          box-shadow: 0 1px 0 ${P.ink100};
          z-index: 2;
        }
        @media print {
          .ak-bukukas-table thead th { box-shadow: none; }
        }
      `}</style>
    </Card>
  );
}

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "rgba(28,38,32,0.6)",
  padding: "4px 8px",
  fontSize: 14,
};

function trimMessage(s, max = 40) {
  if (!s) return "—";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
