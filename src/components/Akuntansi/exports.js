// ═════════════════════════════════════════════════════════════════════
// Akuntansi · CSV / JSON export helpers
// ═════════════════════════════════════════════════════════════════════

import { klasifikasiLabel, getKategori } from "./helpers.js";

function downloadBlob(content, filename, type) {
  const blob = new Blob(content, { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportCSV(state) {
  const rows = [
    ["Tanggal", "No.Bukti", "Tipe", "Uraian", "Kategori", "Klasifikasi", "Sumber/Tujuan", "Metode", "Nominal"],
  ];
  state.transaksi.forEach((t) => {
    const kat = getKategori(state, t.kategoriId);
    rows.push([
      t.tanggal,
      t.bukti || "",
      t.tipe === "IN" ? "Masuk" : "Keluar",
      t.uraian || "",
      kat ? kat.nama : "",
      klasifikasiLabel(t.klasifikasi),
      t.pihak || "",
      t.metode || "",
      t.nominal,
    ]);
  });
  const csv = rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c == null ? "" : c);
          return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");
  downloadBlob(["﻿" + csv], `imarah-transaksi-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
}

export function exportJSON(state) {
  downloadBlob(
    [JSON.stringify(state, null, 2)],
    `imarah-backup-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json"
  );
}

export async function importJSONFile(file) {
  if (!file) throw new Error("Pilih file terlebih dahulu");
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.transaksi)) {
    throw new Error("Format file tidak valid (transaksi tidak ditemukan)");
  }
  return data;
}
