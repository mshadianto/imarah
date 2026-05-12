// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Data & Backup
// ═════════════════════════════════════════════════════════════════════

import { useRef } from "react";
import { Btn, Card, ak, showToast } from "./ui.jsx";
import { exportCSV, exportJSON, importJSONFile } from "./exports.js";
import { buildDemoTransaksi } from "./demoData.js";

const { P, FONT } = ak;

export default function DataBackup({ state, replace, resetTrx, appendTrx }) {
  const fileInput = useRef(null);

  const onImport = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      showToast("Pilih file terlebih dahulu");
      return;
    }
    try {
      const data = await importJSONFile(file);
      if (!window.confirm("Pulihkan data dari file ini? Data saat ini akan ditimpa.")) return;
      replace({ ...state, ...data });
      showToast("Data dipulihkan");
    } catch (e) {
      window.alert("Gagal: " + e.message);
    }
  };

  const onReset = () => {
    if (!window.confirm("Hapus SEMUA data transaksi? Tindakan ini tidak dapat dibatalkan.")) return;
    if (!window.confirm("Konfirmasi sekali lagi — hapus semua data?")) return;
    resetTrx();
    showToast("Data transaksi dihapus");
  };

  const onDemo = () => {
    if (state.transaksi.length && !window.confirm("Sudah ada data. Tambahkan data demo?")) return;
    const demo = buildDemoTransaksi();
    appendTrx(demo);
    showToast(demo.length + " transaksi demo ditambahkan");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        maxWidth: 920,
      }}
      className="ak-backup-grid"
    >
      <Card style={{ padding: 28 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 19, color: P.ink900, marginBottom: 4 }}>
          Ekspor Data
        </div>
        <p style={{ fontSize: 13, color: "rgba(28,38,32,0.6)", marginTop: 0, marginBottom: 14 }}>
          Backup seluruh data transaksi dan pengaturan dalam format JSON.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn onClick={() => exportJSON(state)}>Unduh Backup JSON</Btn>
          <Btn variant="secondary" onClick={() => exportCSV(state)}>
            Unduh CSV Transaksi
          </Btn>
        </div>
      </Card>

      <Card style={{ padding: 28 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 19, color: P.ink900, marginBottom: 4 }}>
          Impor Data
        </div>
        <p style={{ fontSize: 13, color: "rgba(28,38,32,0.6)", marginTop: 0, marginBottom: 14 }}>
          Pulihkan data dari file backup JSON yang sudah diunduh sebelumnya.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept=".json"
          style={{
            display: "block",
            marginBottom: 12,
            fontFamily: FONT.body,
            fontSize: 13,
          }}
        />
        <Btn variant="secondary" onClick={onImport}>
          Pulihkan dari File
        </Btn>
      </Card>

      <Card
        style={{
          padding: 28,
          gridColumn: "1 / -1",
          borderColor: P.rose100,
        }}
      >
        <div style={{ fontFamily: FONT.display, fontSize: 19, color: P.rose700, marginBottom: 4 }}>
          Zona Berbahaya
        </div>
        <p style={{ fontSize: 13, color: "rgba(28,38,32,0.6)", marginTop: 0, marginBottom: 14 }}>
          Hapus seluruh data transaksi. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn variant="danger" onClick={onReset}>
            Hapus Semua Data
          </Btn>
          <Btn variant="ghost" onClick={onDemo}>
            Muat Data Demo
          </Btn>
        </div>
      </Card>

      <style>{`
        @media (max-width: 800px) { .ak-backup-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
