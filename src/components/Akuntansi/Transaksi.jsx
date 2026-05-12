// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Transaksi (full input form view)
// ═════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { Btn, Card, Input, Label, Pill, Select, ak, showToast } from "./ui.jsx";
import { parseRp, getKategori } from "./helpers.js";
import { KLASIFIKASI_LABEL } from "./constants.js";

const { P, FONT } = ak;
const todayISO = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM = {
  tipe: "IN",
  tanggal: todayISO(),
  kategoriId: "",
  nominal: "",
  uraian: "",
  pihak: "",
  metode: "Tunai",
  bukti: "",
};

export default function Transaksi({ state, addTrx, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, tanggal: todayISO() });

  const kategoriList = form.tipe === "IN" ? state.kategoriIn : state.kategoriOut;

  // Ensure a default kategori is selected whenever tipe changes / kategori list updates.
  useEffect(() => {
    if (!kategoriList.find((k) => k.id === form.kategoriId)) {
      setForm((p) => ({ ...p, kategoriId: kategoriList[0]?.id || "" }));
    }
  }, [kategoriList, form.kategoriId]);

  const nominalDisplay = useMemo(() => {
    const n = parseRp(form.nominal);
    return n ? n.toLocaleString("id-ID") : "";
  }, [form.nominal]);

  const onNominalChange = (e) => {
    const raw = parseRp(e.target.value);
    setForm((p) => ({ ...p, nominal: raw ? String(raw) : "" }));
  };

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
    addTrx({
      tipe: form.tipe,
      tanggal: form.tanggal,
      kategoriId: form.kategoriId,
      nominal,
      uraian: form.uraian.trim(),
      pihak: form.pihak.trim(),
      metode: form.metode,
      bukti: form.bukti.trim(),
      klasifikasi: kat && kat.klasifikasi ? kat.klasifikasi : "UNRESTRICTED",
    });
    showToast("Transaksi tersimpan");
    setForm({ ...EMPTY_FORM, tanggal: todayISO() });
    onSaved && onSaved();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
        gap: 24,
      }}
      className="ak-trx-grid"
    >
      <Card style={{ padding: 28 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 24, color: P.ink900, marginBottom: 4 }}>
          Catat Transaksi Baru
        </div>
        <p style={{ fontSize: 14, color: "rgba(28,38,32,0.6)", marginBottom: 20, marginTop: 0 }}>
          Setiap rupiah amanah umat — pastikan pencatatan akurat dan tepat kategori.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TipeButton
              active={form.tipe === "IN"}
              color={P.emerald500}
              onClick={() => setForm((p) => ({ ...p, tipe: "IN", kategoriId: "" }))}
            >
              Pemasukan
            </TipeButton>
            <TipeButton
              active={form.tipe === "OUT"}
              color={P.rose500 || "#e11d48"}
              onClick={() => setForm((p) => ({ ...p, tipe: "OUT", kategoriId: "" }))}
            >
              Pengeluaran
            </TipeButton>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Label>Tanggal</Label>
              <Input
                type="date"
                required
                value={form.tanggal}
                onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))}
              />
            </div>
            <div>
              <Label>Nominal (Rp)</Label>
              <Input
                mono
                inputMode="numeric"
                placeholder="0"
                required
                value={nominalDisplay}
                onChange={onNominalChange}
              />
            </div>
          </div>

          <div>
            <Label>Kategori / Akun</Label>
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
          </div>

          <div>
            <Label>Uraian / Keterangan</Label>
            <Input
              type="text"
              required
              placeholder="contoh: Infaq Jumat dari jamaah"
              value={form.uraian}
              onChange={(e) => setForm((p) => ({ ...p, uraian: e.target.value }))}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <Label>Sumber/Tujuan</Label>
              <Input
                type="text"
                placeholder="Nama donatur / penerima"
                value={form.pihak}
                onChange={(e) => setForm((p) => ({ ...p, pihak: e.target.value }))}
              />
            </div>
            <div>
              <Label>Metode</Label>
              <Select
                value={form.metode}
                onChange={(e) => setForm((p) => ({ ...p, metode: e.target.value }))}
              >
                <option>Tunai</option>
                <option>Transfer Bank</option>
                <option>QRIS</option>
                <option>E-Wallet</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>No. Bukti / Referensi (opsional)</Label>
            <Input
              type="text"
              placeholder="contoh: BKM-2026/05/0123"
              value={form.bukti}
              onChange={(e) => setForm((p) => ({ ...p, bukti: e.target.value }))}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
            <Btn type="submit">Simpan Transaksi</Btn>
            <Btn
              variant="ghost"
              onClick={() => setForm({ ...EMPTY_FORM, tanggal: todayISO() })}
            >
              Reset
            </Btn>
          </div>
        </form>
      </Card>

      <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "rgba(28,38,32,0.5)",
              marginBottom: 6,
              fontFamily: FONT.body,
            }}
          >
            Klasifikasi Dana — ISAK 35
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 17, color: P.ink900, marginBottom: 14 }}>
            Pedoman Singkat
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14, color: "rgba(28,38,32,0.75)" }}>
            <div>
              <Pill tone="jade">Tanpa Pembatasan</Pill>
              <p style={{ marginTop: 6, marginBottom: 0, lineHeight: 1.55 }}>
                Dana yang dapat digunakan untuk operasional masjid secara umum: infaq, shadaqah, kotak amal.
              </p>
            </div>
            <div>
              <Pill tone="brass">Terikat Temporer</Pill>
              <p style={{ marginTop: 6, marginBottom: 0, lineHeight: 1.55 }}>
                Dana yang penggunaannya dibatasi waktu/tujuan: zakat, donasi pembangunan, santunan yatim.
              </p>
            </div>
            <div>
              <Pill tone="ink">Terikat Permanen</Pill>
              <p style={{ marginTop: 6, marginBottom: 0, lineHeight: 1.55 }}>
                Dana yang tidak boleh digunakan habis (pokok harus tetap): wakaf uang, aset wakaf.
              </p>
            </div>
          </div>
        </Card>

        <Card style={{ background: P.jade50, borderColor: P.jade100 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 17, color: P.jade700 }}>Tips Akuntansi Masjid</div>
          <ul style={{ marginTop: 8, fontSize: 14, color: "rgba(10,51,38,0.8)", paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Pisahkan zakat dari kas umum — kelola pada akun tersendiri.</li>
            <li>Simpan bukti fisik (kuitansi/foto) selain pencatatan digital.</li>
            <li>Laporkan keuangan minimal sebulan sekali secara terbuka.</li>
            <li>Audit internal tiap kuartal oleh tim independen jamaah.</li>
          </ul>
        </Card>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .ak-trx-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function TipeButton({ active, color, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "flex-start",
        padding: "12px 16px",
        borderRadius: 5,
        border: `1px solid ${active ? P.jade700 : P.ink200}`,
        background: active ? P.jade700 : "#fff",
        color: active ? "#fff" : P.jade700,
        fontFamily: FONT.body,
        fontSize: 14,
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
