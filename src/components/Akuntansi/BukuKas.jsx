// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Buku Kas
// ═════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Btn, Card, Input, KlasifikasiPill, Select, ak, showToast } from "./ui.jsx";
import { fmtDate, fmtRp, trxInPeriode, getKategori } from "./helpers.js";
import { exportCSV } from "./exports.js";

const { P, FONT } = ak;

export default function BukuKas({ state, onEdit, deleteTrx }) {
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("ALL");

  const rows = useMemo(() => {
    let list = trxInPeriode(state, state.selectedPeriode);
    if (filterTipe !== "ALL") list = list.filter((t) => t.tipe === filterTipe);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.uraian || "").toLowerCase().includes(q) ||
          (t.pihak || "").toLowerCase().includes(q)
      );
    }
    list.sort(
      (a, b) =>
        new Date(a.tanggal) - new Date(b.tanggal) ||
        (a.createdAt || "").localeCompare(b.createdAt || "")
    );
    let saldo = 0;
    return list.map((t) => {
      if (t.tipe === "IN") saldo += t.nominal;
      else saldo -= t.nominal;
      return { ...t, _saldo: saldo };
    });
  }, [state, search, filterTipe]);

  const onDelete = (id) => {
    if (!window.confirm("Hapus transaksi ini?")) return;
    deleteTrx(id);
    showToast("Transaksi dihapus");
  };

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
            Jurnal Harian
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 22, color: P.ink900 }}>Buku Kas Masjid</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Input
            type="text"
            placeholder="Cari uraian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220, padding: "8px 12px", fontSize: 13 }}
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
          <Btn variant="secondary" onClick={() => exportCSV(state)}>
            ⤓ CSV
          </Btn>
          <Btn variant="secondary" onClick={() => window.print()}>
            ⎙ Cetak
          </Btn>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  style={{ textAlign: "center", color: "rgba(28,38,32,0.4)", padding: 40, fontFamily: FONT.body }}
                >
                  Tidak ada transaksi pada periode ini.
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const kat = getKategori(state, t.kategoriId);
                return (
                  <tr key={t.id}>
                    <td style={{ fontFamily: FONT.mono, fontSize: 12, whiteSpace: "nowrap" }}>{fmtDate(t.tanggal)}</td>
                    <td style={{ fontFamily: FONT.mono, fontSize: 12, color: "rgba(28,38,32,0.5)" }}>{t.bukti || "-"}</td>
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
                      <button title="Hapus" onClick={() => onDelete(t.id)} style={iconBtnStyle}>
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
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
