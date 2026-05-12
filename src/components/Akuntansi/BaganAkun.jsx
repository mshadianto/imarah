// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Bagan Akun (Chart of accounts)
// ═════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { Btn, Card, Input, KlasifikasiPill, Select, ak, showConfirm, showToast } from "./ui.jsx";

const { P, FONT } = ak;

export default function BaganAkun({ state, addKategori, deleteKategori }) {
  const [inName, setInName] = useState("");
  const [inKlas, setInKlas] = useState("UNRESTRICTED");
  const [outName, setOutName] = useState("");

  const handleAdd = (tipe) => {
    if (tipe === "IN") {
      if (!inName.trim()) return;
      addKategori("IN", inName.trim(), inKlas);
      setInName("");
      showToast("Kategori pemasukan ditambahkan");
    } else {
      if (!outName.trim()) return;
      addKategori("OUT", outName.trim());
      setOutName("");
      showToast("Kategori pengeluaran ditambahkan");
    }
  };

  const handleDelete = async (tipe, id) => {
    const ok = await showConfirm({
      title: "Hapus kategori?",
      message:
        'Transaksi yang sudah ada tidak akan terhapus, tapi tampilan kategorinya akan jadi "—".',
      confirmLabel: "Hapus kategori",
    });
    if (!ok) return;
    deleteKategori(tipe, id);
    showToast("Kategori dihapus");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ak-bagan-grid">
      <Card padding={0}>
        <div style={{ padding: 20, borderBottom: `1px solid ${P.ink100}` }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(28,38,32,0.5)", fontFamily: FONT.body }}>
            Penerimaan
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 19, color: P.ink900 }}>Akun Pemasukan</div>
        </div>
        <div style={{ borderTop: `1px solid ${P.ink100}` }}>
          {state.kategoriIn.map((k) => (
            <KategoriRow key={k.id} kategori={k} onDelete={() => handleDelete("IN", k.id)} showKlas />
          ))}
        </div>
        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${P.ink100}`,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Input
            type="text"
            placeholder="Nama kategori baru"
            value={inName}
            onChange={(e) => setInName(e.target.value)}
            style={{ flex: "1 1 200px" }}
          />
          <Select
            value={inKlas}
            onChange={(e) => setInKlas(e.target.value)}
            style={{ width: 180 }}
          >
            <option value="UNRESTRICTED">Tanpa Pembatasan</option>
            <option value="TEMP_RESTRICTED">Terikat Temporer</option>
            <option value="PERM_RESTRICTED">Terikat Permanen</option>
          </Select>
          <Btn onClick={() => handleAdd("IN")}>+ Tambah</Btn>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: 20, borderBottom: `1px solid ${P.ink100}` }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(28,38,32,0.5)", fontFamily: FONT.body }}>
            Pengeluaran
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 19, color: P.ink900 }}>Akun Beban</div>
        </div>
        <div style={{ borderTop: `1px solid ${P.ink100}` }}>
          {state.kategoriOut.map((k) => (
            <KategoriRow key={k.id} kategori={k} onDelete={() => handleDelete("OUT", k.id)} />
          ))}
        </div>
        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${P.ink100}`,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Input
            type="text"
            placeholder="Nama kategori baru"
            value={outName}
            onChange={(e) => setOutName(e.target.value)}
            style={{ flex: "1 1 200px" }}
          />
          <Btn onClick={() => handleAdd("OUT")}>+ Tambah</Btn>
        </div>
      </Card>

      <style>{`
        @media (max-width: 900px) { .ak-bagan-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function KategoriRow({ kategori, onDelete, showKlas }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: `1px solid ${P.ink100}`,
      }}
    >
      <div>
        <div style={{ fontWeight: 500, color: P.ink900, fontFamily: FONT.body, fontSize: 14 }}>
          {kategori.nama}
        </div>
        {showKlas ? (
          <div style={{ marginTop: 6 }}>
            <KlasifikasiPill value={kategori.klasifikasi} />
          </div>
        ) : null}
      </div>
      <button
        onClick={onDelete}
        title="Hapus"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "rgba(28,38,32,0.5)",
          padding: 6,
          fontSize: 14,
        }}
      >
        🗑
      </button>
    </div>
  );
}
