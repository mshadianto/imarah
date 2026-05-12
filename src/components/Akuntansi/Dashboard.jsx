// ═════════════════════════════════════════════════════════════════════
// Akuntansi · Dashboard view
// Hero saldo + 4 KPI cards + 6-month arus chart + sumber doughnut + recent table
// ═════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

import { Card, ak } from "./ui.jsx";
import { fmtRp, fmtDate, fmtDateLong, trxInPeriode, aggregateBuckets, getKategori } from "./helpers.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const { P, FONT } = ak;
const PALETTE_DOUGHNUT = [
  "#155741",
  "#b8893f",
  "#2f7d63",
  "#9d7232",
  "#c89d5b",
  "#0a3326",
  "#d4a574",
  "#5b6b62",
];

export default function Dashboard({ state, onOpenQuickAdd, onGoto }) {
  // ── KPIs ────────────────────────────────────────────────────────────
  const totals = useMemo(() => {
    const totalIn = state.transaksi.filter((t) => t.tipe === "IN").reduce((a, t) => a + t.nominal, 0);
    const totalOut = state.transaksi.filter((t) => t.tipe === "OUT").reduce((a, t) => a + t.nominal, 0);
    return { totalIn, totalOut, saldo: totalIn - totalOut };
  }, [state.transaksi]);

  const buckets = useMemo(() => aggregateBuckets(state), [state]);

  const monthTrx = useMemo(() => trxInPeriode(state, "CURRENT_MONTH"), [state]);
  const inBulan = useMemo(
    () => monthTrx.filter((t) => t.tipe === "IN").reduce((a, t) => a + t.nominal, 0),
    [monthTrx]
  );
  const outBulan = useMemo(
    () => monthTrx.filter((t) => t.tipe === "OUT").reduce((a, t) => a + t.nominal, 0),
    [monthTrx]
  );

  // ── 6-month bar data ────────────────────────────────────────────────
  const arusData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString("id-ID", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return months.map((m) => {
      const filtered = state.transaksi.filter((t) => {
        const d = new Date(t.tanggal);
        return d.getMonth() === m.month && d.getFullYear() === m.year;
      });
      return {
        label: m.label,
        in: filtered.filter((t) => t.tipe === "IN").reduce((a, t) => a + t.nominal, 0),
        out: filtered.filter((t) => t.tipe === "OUT").reduce((a, t) => a + t.nominal, 0),
      };
    });
  }, [state.transaksi]);

  const barData = {
    labels: arusData.map((d) => d.label),
    datasets: [
      { label: "Masuk", data: arusData.map((d) => d.in), backgroundColor: P.jade700, borderRadius: 4 },
      { label: "Keluar", data: arusData.map((d) => d.out), backgroundColor: P.brass500, borderRadius: 4 },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${fmtRp(c.parsed.y)}` } },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => "Rp " + (v / 1000).toFixed(0) + "k",
          font: { family: "JetBrains Mono", size: 10 },
        },
        grid: { color: "#ecebe4" },
      },
      x: {
        ticks: { font: { family: "Plus Jakarta Sans", size: 11 } },
        grid: { display: false },
      },
    },
  };

  // ── Sumber doughnut ─────────────────────────────────────────────────
  const sumber = useMemo(() => {
    const monthIn = monthTrx.filter((t) => t.tipe === "IN");
    const byKat = {};
    monthIn.forEach((t) => {
      const kat = getKategori(state, t.kategoriId);
      const key = kat ? kat.nama : "Lainnya";
      byKat[key] = (byKat[key] || 0) + t.nominal;
    });
    return { labels: Object.keys(byKat), data: Object.values(byKat) };
  }, [monthTrx, state]);

  const doughnutData = {
    labels: sumber.labels,
    datasets: [
      {
        data: sumber.data,
        backgroundColor: PALETTE_DOUGHNUT,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => `${c.label}: ${fmtRp(c.parsed)}` } },
    },
  };
  const sumberTotal = sumber.data.reduce((a, b) => a + b, 0);

  // ── Recent ──────────────────────────────────────────────────────────
  const recent = useMemo(
    () =>
      [...state.transaksi]
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 10),
    [state.transaksi]
  );

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
          marginBottom: 24,
          background: `linear-gradient(135deg, ${P.jade900} 0%, ${P.jade700} 65%, ${P.jade600} 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage: `
              linear-gradient(30deg, rgba(255,255,255,0.06) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.06) 87.5%),
              linear-gradient(150deg, rgba(255,255,255,0.06) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.06) 87.5%)
            `,
            backgroundSize: "24px 42px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                color: P.brass400,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
                fontFamily: FONT.body,
              }}
            >
              Saldo Kas &amp; Bank
            </div>
            <div
              style={{
                fontFamily: FONT.display,
                color: "#fff",
                fontSize: 44,
                lineHeight: 1.05,
                letterSpacing: -0.5,
              }}
            >
              {fmtRp(totals.saldo)}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6, fontFamily: FONT.body }}>
              per {fmtDateLong(new Date().toISOString())}
            </div>
          </div>
          <div style={{ textAlign: "right", color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: FONT.body }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginBottom: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6ee7b7" }} />
              Pemasukan bulan ini ·{" "}
              <span style={{ fontFamily: FONT.mono, color: "#fff" }}>{fmtRp(inBulan)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fda4af" }} />
              Pengeluaran bulan ini ·{" "}
              <span style={{ fontFamily: FONT.mono, color: "#fff" }}>{fmtRp(outBulan)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <KpiCard
          label="Aset Neto Tanpa Pembatasan"
          value={fmtRp(buckets.UNRESTRICTED)}
          sub="Infaq · Shadaqah · Operasional"
        />
        <KpiCard
          label="Aset Neto Terikat Temporer"
          value={fmtRp(buckets.TEMP_RESTRICTED)}
          sub="Zakat · Donasi Yatim · Pembangunan"
        />
        <KpiCard
          label="Aset Neto Terikat Permanen"
          value={fmtRp(buckets.PERM_RESTRICTED)}
          sub="Wakaf Uang & Aset Wakaf"
        />
        <KpiCard
          label="Total Transaksi Bulan Ini"
          value={String(monthTrx.length)}
          valueColor={P.brass500}
          sub="Pencatatan tervalidasi"
        />
      </div>

      {/* Chart row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
        className="ak-chart-row"
      >
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(28,38,32,0.5)" }}>
                Arus Kas 6 Bulan Terakhir
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 17, color: P.ink900 }}>
                Tren Pemasukan &amp; Pengeluaran
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: P.jade700 }} /> Masuk
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: P.brass500 }} /> Keluar
              </span>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(28,38,32,0.5)" }}>
            Komposisi Penerimaan
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 17, color: P.ink900, marginBottom: 12 }}>
            Sumber Dana Bulan Ini
          </div>
          <div style={{ height: 200 }}>
            {sumber.labels.length ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(28,38,32,0.4)",
                  fontSize: 13,
                }}
              >
                Belum ada pemasukan bulan ini
              </div>
            )}
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            {sumber.labels.map((l, i) => {
              const pct = sumberTotal ? ((sumber.data[i] / sumberTotal) * 100).toFixed(1) : 0;
              return (
                <div
                  key={l}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        flexShrink: 0,
                        background: PALETTE_DOUGHNUT[i % PALETTE_DOUGHNUT.length],
                      }}
                    />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{l}</span>
                  </span>
                  <span style={{ fontFamily: FONT.mono, color: "rgba(28,38,32,0.6)" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent */}
      <Card padding={0}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 16px",
            borderBottom: `1px solid ${P.ink100}`,
          }}
        >
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "rgba(28,38,32,0.5)" }}>
              Aktivitas Terbaru
            </div>
            <div style={{ fontFamily: FONT.display, fontSize: 18, color: P.ink900 }}>10 Transaksi Terakhir</div>
          </div>
          <button
            onClick={() => onGoto && onGoto("buku-kas")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: P.ink500,
              fontSize: 13,
              fontFamily: FONT.body,
              fontWeight: 600,
            }}
          >
            Lihat semua →
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={ak.TH_STYLE || {}}>Tanggal</th>
                <th>Uraian</th>
                <th>Kategori</th>
                <th style={{ textAlign: "right" }}>Masuk</th>
                <th style={{ textAlign: "right" }}>Keluar</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "rgba(28,38,32,0.4)",
                      padding: 32,
                      fontFamily: FONT.body,
                    }}
                  >
                    Belum ada transaksi.{" "}
                    <button
                      onClick={onOpenQuickAdd}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: P.jade700,
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontFamily: FONT.body,
                      }}
                    >
                      Catat transaksi pertama
                    </button>
                  </td>
                </tr>
              ) : (
                recent.map((t) => {
                  const kat = getKategori(state, t.kategoriId);
                  return (
                    <tr key={t.id}>
                      <td style={{ fontFamily: FONT.mono, fontSize: 12, whiteSpace: "nowrap" }}>
                        {fmtDate(t.tanggal)}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.uraian}</div>
                        {t.pihak ? (
                          <div style={{ fontSize: 11, color: "rgba(28,38,32,0.5)" }}>{t.pihak}</div>
                        ) : null}
                      </td>
                      <td>{kat ? kat.nama : "—"}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: FONT.mono,
                          color: t.tipe === "IN" ? P.jade700 : "inherit",
                        }}
                      >
                        {t.tipe === "IN" ? fmtRp(t.nominal) : ""}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: FONT.mono,
                          color: t.tipe === "OUT" ? P.rose700 : "inherit",
                        }}
                      >
                        {t.tipe === "OUT" ? fmtRp(t.nominal) : ""}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shared table cell styles */}
      <style>{`
        .ak-chart-row { display: grid; }
        @media (max-width: 900px) {
          .ak-chart-row { grid-template-columns: 1fr !important; }
        }
        table th {
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: ${P.ink500};
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid ${P.ink100};
          font-weight: 600;
          font-family: ${FONT.body};
        }
        table td {
          padding: 13px 16px;
          border-bottom: 1px solid #f4f3ee;
          font-size: 14px;
          vertical-align: top;
          font-family: ${FONT.body};
          color: ${P.ink900};
        }
        table tr:hover td { background: #fafaf6; }
      `}</style>
    </div>
  );
}

function KpiCard({ label, value, sub, valueColor = "#155741" }) {
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          backgroundImage: "radial-gradient(circle, rgba(184,137,63,0.15) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "rgba(28,38,32,0.5)",
          marginBottom: 12,
          fontFamily: FONT.body,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 22, color: valueColor, letterSpacing: -0.3 }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(28,38,32,0.4)", marginTop: 8, fontFamily: FONT.body }}>{sub}</div>
    </Card>
  );
}
