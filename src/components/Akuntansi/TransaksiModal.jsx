// ═════════════════════════════════════════════════════════════════════
// Akuntansi · TransaksiModal — quick add/edit
// ═════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { AkModal, Btn, Input, Label, Select, ak, showToast } from "./ui.jsx";
import { parseRp, getKategori } from "./helpers.js";
import { KLASIFIKASI_LABEL } from "./constants.js";

const { P, FONT } = ak;
const todayISO = () => new Date().toISOString().slice(0, 10);

const blankForm = () => ({
  tipe: "IN",
  tanggal: todayISO(),
  kategoriId: "",
  nominal: "",
  uraian: "",
  pihak: "",
});

export default function TransaksiModal({ open, onClose, state, addTrx, updateTrx, editingId }) {
  const editing = useMemo(
    () => (editingId ? state.transaksi.find((t) => t.id === editingId) : null),
    [editingId, state.transaksi]
  );

  const [form, setForm] = useState(blankForm);

  // Initialize form whenever the modal is opened or the editing target changes.
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        tipe: editing.tipe,
        tanggal: editing.tanggal,
        kategoriId: editing.kategoriId,
        nominal: String(editing.nominal || ""),
        uraian: editing.uraian || "",
        pihak: editing.pihak || "",
      });
    } else {
      setForm(blankForm());
    }
  }, [open, editing]);

  const kategoriList = form.tipe === "IN" ? state.kategoriIn : state.kategoriOut;

  useEffect(() => {
    if (!open) return;
    if (!kategoriList.find((k) => k.id === form.kategoriId)) {
      setForm((p) => ({ ...p, kategoriId: kategoriList[0]?.id || "" }));
    }
  }, [open, kategoriList, form.kategoriId]);

  const nominalDisplay = useMemo(() => {
    const n = parseRp(form.nominal);
    return n ? n.toLocaleString("id-ID") : "";
  }, [form.nominal]);

  const submit = (e) => {
    e.preventDefault();
    const nominal = parseRp(form.nominal);
    if (!nominal) {
      showToast("Nominal tidak boleh 0");
      return;
    }
    if (!form.kategoriId) {
      showToast("Pilih kategori terlebih dahulu");
      return;
    }
    const kat = getKategori(state, form.kategoriId);
    const payload = {
      tipe: form.tipe,
      tanggal: form.tanggal,
      kategoriId: form.kategoriId,
      nominal,
      uraian: form.uraian.trim(),
      pihak: form.pihak.trim(),
      metode: editing?.metode || "Tunai",
      bukti: editing?.bukti || "",
      klasifikasi: kat && kat.klasifikasi ? kat.klasifikasi : "UNRESTRICTED",
    };
    if (editing) {
      updateTrx(editing.id, payload);
      showToast("Transaksi diperbarui");
    } else {
      addTrx(payload);
      showToast("Transaksi tersimpan");
    }
    onClose();
  };

  return (
    <AkModal
      open={open}
      onClose={onClose}
      eyebrow="Catat Cepat"
      title={editing ? "Ubah Transaksi" : "Transaksi Baru"}
    >
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Toggle
            active={form.tipe === "IN"}
            color={P.emerald500}
            onClick={() => setForm((p) => ({ ...p, tipe: "IN", kategoriId: "" }))}
          >
            Pemasukan
          </Toggle>
          <Toggle
            active={form.tipe === "OUT"}
            color={P.rose500 || "#e11d48"}
            onClick={() => setForm((p) => ({ ...p, tipe: "OUT", kategoriId: "" }))}
          >
            Pengeluaran
          </Toggle>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Input
            type="date"
            required
            value={form.tanggal}
            onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
          />
          <Input
            mono
            inputMode="numeric"
            placeholder="Nominal (Rp)"
            required
            value={nominalDisplay}
            onChange={(e) => {
              const raw = parseRp(e.target.value);
              setForm((p) => ({ ...p, nominal: raw ? String(raw) : "" }));
            }}
          />
        </div>

        <Select
          required
          value={form.kategoriId}
          onChange={(e) => setForm((p) => ({ ...p, kategoriId: e.target.value }))}
        >
          {kategoriList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
              {k.klasifikasi ? ` · ${KLASIFIKASI_LABEL[k.klasifikasi]}` : ""}
            </option>
          ))}
        </Select>

        <Input
          type="text"
          required
          placeholder="Uraian"
          value={form.uraian}
          onChange={(e) => setForm((p) => ({ ...p, uraian: e.target.value }))}
        />

        <Input
          type="text"
          placeholder="Sumber/Tujuan (opsional)"
          value={form.pihak}
          onChange={(e) => setForm((p) => ({ ...p, pihak: e.target.value }))}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 6 }}>
          <Btn variant="ghost" onClick={onClose}>
            Batal
          </Btn>
          <Btn type="submit">Simpan</Btn>
        </div>
      </form>
    </AkModal>
  );
}

function Toggle({ active, color, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
        padding: "10px 12px",
        borderRadius: 5,
        border: `1px solid ${active ? P.jade700 : P.ink200}`,
        background: active ? P.jade700 : "#fff",
        color: active ? "#fff" : P.jade700,
        fontFamily: FONT.body,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {children}
    </button>
  );
}

// Label is imported in some paths via other modules; keep it referenced to avoid
// dead-import warnings in dev-only environments.
void Label;
