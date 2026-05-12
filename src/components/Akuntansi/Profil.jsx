// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Profil Masjid
// ═════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { Btn, Card, Input, Label, ak, showToast } from "./ui.jsx";

const { FONT } = ak;

export default function Profil({ state, setProfil }) {
  const [form, setForm] = useState(state.profil);

  const onSave = () => {
    setProfil({
      nama: (form.nama || "").trim(),
      alamat: (form.alamat || "").trim(),
      kota: (form.kota || "").trim(),
      npwp: (form.npwp || "").trim(),
      ketua: (form.ketua || "").trim(),
      bendahara: (form.bendahara || "").trim(),
    });
    showToast("Profil masjid tersimpan");
  };

  return (
    <Card style={{ padding: 28, maxWidth: 640 }}>
      <div style={{ fontFamily: FONT.display, fontSize: 22, color: "#1c2620", marginBottom: 4 }}>
        Profil Masjid
      </div>
      <p style={{ fontSize: 13, color: "rgba(28,38,32,0.6)", marginTop: 0, marginBottom: 20 }}>
        Informasi ini muncul di kop laporan keuangan.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <Label>Nama Masjid</Label>
          <Input value={form.nama || ""} onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))} />
        </div>
        <div>
          <Label>Alamat</Label>
          <Input value={form.alamat || ""} onChange={(e) => setForm((p) => ({ ...p, alamat: e.target.value }))} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Label>Kota</Label>
            <Input value={form.kota || ""} onChange={(e) => setForm((p) => ({ ...p, kota: e.target.value }))} />
          </div>
          <div>
            <Label>NPWP (jika ada)</Label>
            <Input mono value={form.npwp || ""} onChange={(e) => setForm((p) => ({ ...p, npwp: e.target.value }))} />
          </div>
        </div>
        <div>
          <Label>Ketua DKM / Takmir</Label>
          <Input value={form.ketua || ""} onChange={(e) => setForm((p) => ({ ...p, ketua: e.target.value }))} />
        </div>
        <div>
          <Label>Bendahara</Label>
          <Input value={form.bendahara || ""} onChange={(e) => setForm((p) => ({ ...p, bendahara: e.target.value }))} />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Btn onClick={onSave}>Simpan Profil</Btn>
      </div>
    </Card>
  );
}
