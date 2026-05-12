// ═════════════════════════════════════════════════════════════════════
// Akuntansi · helpers (formatting, period, classification)
// ═════════════════════════════════════════════════════════════════════

import { KLASIFIKASI_LABEL } from "./constants.js";

export const fmtRp = (n) => "Rp " + (Number(n) || 0).toLocaleString("id-ID");
export const fmtRpPlain = (n) => (Number(n) || 0).toLocaleString("id-ID");

export const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

export const fmtDateLong = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

export const uid = () => "t-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);

export const parseRp = (s) => parseInt((s || "").toString().replace(/[^\d]/g, ""), 10) || 0;

export const klasifikasiLabel = (k) => KLASIFIKASI_LABEL[k] || "—";

export function getKategori(state, id) {
  return (
    state.kategoriIn.find((k) => k.id === id) ||
    state.kategoriOut.find((k) => k.id === id) ||
    null
  );
}

// ── Period bounds ─────────────────────────────────────────────────────
export function getPeriodeBounds(key) {
  const now = new Date();
  let start, end, label;
  if (key === "CURRENT_MONTH") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    label = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  } else if (key === "LAST_MONTH") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    label = start.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  } else if (key === "YTD") {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    label = `Jan – Des ${now.getFullYear()}`;
  } else if (key === "ALL") {
    start = new Date(2000, 0, 1);
    end = new Date(2100, 0, 1);
    label = "Seluruh periode";
  } else if (key && key.startsWith("Y-")) {
    const y = parseInt(key.slice(2), 10);
    start = new Date(y, 0, 1);
    end = new Date(y, 11, 31, 23, 59, 59);
    label = String(y);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    label = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  }
  return { start, end, label };
}

export function trxInPeriode(state, periodeKey) {
  const { start, end } = getPeriodeBounds(periodeKey);
  return state.transaksi.filter((t) => {
    const d = new Date(t.tanggal);
    return d >= start && d <= end;
  });
}

// ── Build the period-filter <select> options ──────────────────────────
export function buildPeriodeOptions() {
  const opts = [
    ["CURRENT_MONTH", "Bulan ini"],
    ["LAST_MONTH", "Bulan lalu"],
    ["YTD", "Tahun berjalan"],
    ["ALL", "Seluruh data"],
  ];
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= thisYear - 2; y--) opts.push(["Y-" + y, "Tahun " + y]);
  return opts;
}

// ── Aggregate aset neto by klasifikasi (used across reports) ──────────
export function aggregateBuckets(state, list) {
  const trx = list || state.transaksi;
  const buckets = { UNRESTRICTED: 0, TEMP_RESTRICTED: 0, PERM_RESTRICTED: 0 };
  trx.forEach((t) => {
    const kat = getKategori(state, t.kategoriId);
    if (t.tipe === "IN" && kat) {
      buckets[kat.klasifikasi || "UNRESTRICTED"] += t.nominal;
    } else if (t.tipe === "OUT") {
      buckets[t.klasifikasi || "UNRESTRICTED"] -= t.nominal;
    }
  });
  return buckets;
}
