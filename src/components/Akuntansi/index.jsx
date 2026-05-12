// ═════════════════════════════════════════════════════════════════════
// Akuntansi · main container
// Renders its own sub-nav + top bar + selected sub-view.
// Mounted by imarah.jsx as one of the top-level "page" routes.
// ═════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";

import { useAkuntansiStore } from "./useAkuntansiStore.js";
import {
  NAV_GROUPS,
  VIEW_TITLE,
  KLASIFIKASI_LABEL,
} from "./constants.js";
import {
  buildPeriodeOptions,
  fmtRp,
  getPeriodeBounds,
} from "./helpers.js";
import { Btn, Select, ToastHost, ak } from "./ui.jsx";

import Dashboard from "./Dashboard.jsx";
import Transaksi from "./Transaksi.jsx";
import BukuKas from "./BukuKas.jsx";
import LaporanPosisi from "./LaporanPosisi.jsx";
import LaporanAktivitas from "./LaporanAktivitas.jsx";
import LaporanArusKas from "./LaporanArusKas.jsx";
import Catatan from "./Catatan.jsx";
import BaganAkun from "./BaganAkun.jsx";
import Profil from "./Profil.jsx";
import DataBackup from "./DataBackup.jsx";
import TransaksiModal from "./TransaksiModal.jsx";

const { P, FONT } = ak;
// Reference to keep tree-shaking honest if KLASIFIKASI_LABEL ever stops being used elsewhere.
void KLASIFIKASI_LABEL;

export default function Akuntansi() {
  const store = useAkuntansiStore();
  const { state } = store;

  const [view, setView] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditId, setModalEditId] = useState(null);

  const periodOptions = useMemo(() => buildPeriodeOptions(), []);
  const periodLabel = useMemo(
    () => getPeriodeBounds(state.selectedPeriode).label,
    [state.selectedPeriode]
  );

  const openQuickAdd = (editId) => {
    setModalEditId(editId || null);
    setModalOpen(true);
  };
  const closeQuickAdd = () => {
    setModalOpen(false);
    setModalEditId(null);
  };

  // Render the currently-selected sub-view.
  const Sub = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard state={state} onOpenQuickAdd={() => openQuickAdd()} onGoto={setView} />;
      case "transaksi":
        return (
          <Transaksi
            state={state}
            addTrx={store.addTrx}
            onSaved={() => setView("buku-kas")}
          />
        );
      case "buku-kas":
        return (
          <BukuKas
            state={state}
            onEdit={(id) => openQuickAdd(id)}
            deleteTrx={store.deleteTrx}
          />
        );
      case "lap-posisi":
        return <LaporanPosisi state={state} />;
      case "lap-aktivitas":
        return <LaporanAktivitas state={state} />;
      case "lap-arus-kas":
        return <LaporanArusKas state={state} />;
      case "catatan":
        return <Catatan state={state} />;
      case "kategori":
        return (
          <BaganAkun
            state={state}
            addKategori={store.addKategori}
            deleteKategori={store.deleteKategori}
          />
        );
      case "masjid":
        return <Profil state={state} setProfil={store.setProfil} />;
      case "data":
        return (
          <DataBackup
            state={state}
            replace={store.replace}
            resetTrx={store.resetTrx}
            appendTrx={store.appendTrx}
          />
        );
      default:
        return null;
    }
  };

  // Scroll inner column to top when sub-view changes.
  useEffect(() => {
    const el = document.querySelector("[data-ak-scroll]");
    if (el) el.scrollTop = 0;
  }, [view]);

  return (
    <div
      style={{
        // Reset the dark imarah.jsx vars and impose the Akuntansi light theme.
        background: P.ink50,
        color: P.ink900,
        fontFamily: FONT.body,
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "240px minmax(0, 1fr)",
      }}
      className="ak-root"
    >
      {/* ── Sub-sidebar ────────────────────────────────────────────── */}
      <aside
        className="ak-sidebar ak-no-print"
        style={{
          background: P.jade900,
          color: P.ink100,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div style={{ padding: "26px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Ornament />
            <div>
              <div
                style={{
                  fontFamily: FONT.display,
                  fontSize: 22,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: -0.3,
                }}
              >
                Imarah
              </div>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: P.brass400,
                  marginTop: 4,
                  fontFamily: FONT.body,
                }}
              >
                Akuntansi Masjid
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 0 24px", fontSize: 13 }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title} style={{ marginBottom: 6 }}>
              <div
                style={{
                  padding: "14px 24px 6px",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: FONT.body,
                }}
              >
                {group.title}
              </div>
              {group.items.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 24px",
                      background: active ? "rgba(184,137,63,0.18)" : "transparent",
                      color: active ? "#e9d6ab" : P.ink100,
                      borderLeft: `3px solid ${active ? P.brass400 : "transparent"}`,
                      border: "none",
                      borderRight: "none",
                      borderTop: "none",
                      borderBottom: "none",
                      fontFamily: FONT.body,
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div
          style={{
            padding: "18px 24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            fontFamily: FONT.body,
          }}
        >
          <div style={{ fontFamily: FONT.display, color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 4 }}>
            بسم الله
          </div>
          “Hanyalah yang memakmurkan masjid Allah ialah orang yang beriman…”{" "}
          <span style={{ color: P.brass400 }}>— QS. At-Taubah: 18</span>
        </div>
      </aside>

      {/* ── Main column ────────────────────────────────────────────── */}
      <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <header
          className="ak-no-print"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(247,246,242,0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${P.ink200}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "16px 32px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  color: "rgba(21,87,65,0.7)",
                  fontFamily: FONT.body,
                }}
              >
                Sistem Akuntansi · ISAK 35
              </div>
              <h1
                style={{
                  fontFamily: FONT.display,
                  fontSize: 24,
                  color: P.ink900,
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {VIEW_TITLE[view] || "Imarah"}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ textAlign: "right", fontSize: 12, fontFamily: FONT.body }}>
                <div style={{ color: "rgba(28,38,32,0.6)" }}>Periode aktif</div>
                <div style={{ fontFamily: FONT.mono, color: P.jade700, fontWeight: 500 }}>{periodLabel}</div>
              </div>
              <Select
                value={state.selectedPeriode}
                onChange={(e) => store.setPeriode(e.target.value)}
                style={{ width: "auto", padding: "8px 10px", fontSize: 12 }}
              >
                {periodOptions.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
              <Btn variant="brass" onClick={() => openQuickAdd()}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Catat Transaksi
              </Btn>
            </div>
          </div>
        </header>

        <div data-ak-scroll style={{ padding: 32, flex: 1, overflowY: "auto" }}>
          <Sub />
        </div>

        <footer
          className="ak-no-print"
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "rgba(28,38,32,0.5)",
            borderTop: `1px solid ${P.ink200}`,
            padding: "20px 32px",
            fontFamily: FONT.body,
          }}
        >
          Imarah · Sistem Akuntansi Masjid · Berbasis ISAK 35 (PSAK Entitas Berorientasi Non-Laba)
          <br />
          <span style={{ color: P.brass500 }}>Amanah · Transparan · Profesional</span> · Saldo:{" "}
          <span style={{ fontFamily: FONT.mono, color: P.jade700 }}>
            {fmtRp(
              state.transaksi.reduce(
                (s, t) => s + (t.tipe === "IN" ? t.nominal : -t.nominal),
                0
              )
            )}
          </span>
        </footer>
      </main>

      <TransaksiModal
        open={modalOpen}
        onClose={closeQuickAdd}
        state={state}
        addTrx={store.addTrx}
        updateTrx={store.updateTrx}
        editingId={modalEditId}
      />
      <ToastHost />

      {/* Print + responsive helpers */}
      <style>{`
        @media (max-width: 900px) {
          .ak-root { grid-template-columns: 1fr !important; }
          .ak-sidebar { display: none !important; }
        }
        @media print {
          .ak-no-print { display: none !important; }
          .ak-root { grid-template-columns: 1fr !important; }
          body { background: #fff !important; }
          .ak-print-only { display: grid !important; }
        }
      `}</style>
    </div>
  );
}

function Ornament() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        background: `conic-gradient(from 0deg at 50% 50%,
          ${P.brass500} 0deg 45deg,
          transparent 45deg 90deg,
          ${P.brass500} 90deg 135deg,
          transparent 135deg 180deg,
          ${P.brass500} 180deg 225deg,
          transparent 225deg 270deg,
          ${P.brass500} 270deg 315deg,
          transparent 315deg 360deg)`,
        WebkitMask: "radial-gradient(circle, transparent 7px, #000 8px, #000 20px, transparent 21px)",
        mask: "radial-gradient(circle, transparent 7px, #000 8px, #000 20px, transparent 21px)",
      }}
    />
  );
}
