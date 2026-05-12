// ═════════════════════════════════════════════════════════════════════
// Akuntansi · ISAK 35 — constants & default state
// ═════════════════════════════════════════════════════════════════════

export const STORAGE_KEY = "imarah_akuntansi_v1";

// Inline-style palette (matches akuntansi.html legacy theme)
export const PALETTE = {
  ink50: "#f7f6f2",
  ink100: "#ecebe4",
  ink200: "#d9d6c8",
  ink300: "#b8b3a0",
  ink500: "#5b6b62",
  ink900: "#1c2620",
  ink950: "#0d1411",
  jade50: "#f0f7f4",
  jade100: "#dceae3",
  jade500: "#2f7d63",
  jade600: "#1e6a51",
  jade700: "#155741",
  jade800: "#0f4332",
  jade900: "#0a3326",
  brass400: "#c89d5b",
  brass500: "#b8893f",
  brass600: "#9d7232",
  rose100: "#fde2e4",
  rose500: "#e11d48",
  rose700: "#8a2a36",
  rose900: "#640d18",
  emerald500: "#10b981",
};

export const FONT = {
  display: "'Fraunces', Georgia, serif",
  body: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
};

export const KLASIFIKASI_LABEL = {
  UNRESTRICTED: "Tanpa Pembatasan",
  TEMP_RESTRICTED: "Terikat Temporer",
  PERM_RESTRICTED: "Terikat Permanen",
};

export const KLASIFIKASI_PILL = {
  UNRESTRICTED: { bg: "#dceae3", fg: "#0a3326" },
  TEMP_RESTRICTED: { bg: "#f5e8d0", fg: "#7a5a26" },
  PERM_RESTRICTED: { bg: "#ecebe4", fg: "#1c2620" },
};

// ── Default state shape ───────────────────────────────────────────────
export const DEFAULT_STATE = {
  profil: {
    nama: "Masjid Imarah",
    alamat: "",
    kota: "",
    npwp: "",
    ketua: "",
    bendahara: "",
  },
  kategoriIn: [
    { id: "k-i-1", nama: "Infaq Jumat", klasifikasi: "UNRESTRICTED" },
    { id: "k-i-2", nama: "Infaq Harian / Kotak Amal", klasifikasi: "UNRESTRICTED" },
    { id: "k-i-3", nama: "Shadaqah", klasifikasi: "UNRESTRICTED" },
    { id: "k-i-4", nama: "Donasi Operasional", klasifikasi: "UNRESTRICTED" },
    { id: "k-i-5", nama: "Zakat Mal", klasifikasi: "TEMP_RESTRICTED" },
    { id: "k-i-6", nama: "Zakat Fitrah", klasifikasi: "TEMP_RESTRICTED" },
    { id: "k-i-7", nama: "Donasi Pembangunan", klasifikasi: "TEMP_RESTRICTED" },
    { id: "k-i-8", nama: "Donasi Yatim & Dhuafa", klasifikasi: "TEMP_RESTRICTED" },
    { id: "k-i-9", nama: "Donasi Kegiatan", klasifikasi: "TEMP_RESTRICTED" },
    { id: "k-i-10", nama: "Wakaf Uang", klasifikasi: "PERM_RESTRICTED" },
    { id: "k-i-11", nama: "Wakaf Aset", klasifikasi: "PERM_RESTRICTED" },
    { id: "k-i-12", nama: "Pendapatan Sewa Aset", klasifikasi: "UNRESTRICTED" },
  ],
  kategoriOut: [
    { id: "k-o-1", nama: "Honor Imam" },
    { id: "k-o-2", nama: "Honor Muadzin" },
    { id: "k-o-3", nama: "Honor Marbot / Penjaga" },
    { id: "k-o-4", nama: "Honor Guru TPA" },
    { id: "k-o-5", nama: "Listrik" },
    { id: "k-o-6", nama: "Air PDAM" },
    { id: "k-o-7", nama: "Internet & Telepon" },
    { id: "k-o-8", nama: "Pemeliharaan Bangunan" },
    { id: "k-o-9", nama: "Perlengkapan Ibadah" },
    { id: "k-o-10", nama: "Konsumsi Kegiatan" },
    { id: "k-o-11", nama: "Honor Penceramah" },
    { id: "k-o-12", nama: "Santunan Yatim & Dhuafa" },
    { id: "k-o-13", nama: "Penyaluran Zakat (8 Asnaf)" },
    { id: "k-o-14", nama: "Pembangunan & Renovasi" },
    { id: "k-o-15", nama: "Administrasi & ATK" },
    { id: "k-o-16", nama: "Lain-lain" },
  ],
  transaksi: [],
  selectedPeriode: "CURRENT_MONTH",
};

export const NAV_GROUPS = [
  {
    title: "Ringkasan",
    items: [{ id: "dashboard", label: "Beranda" }],
  },
  {
    title: "Transaksi",
    items: [
      { id: "transaksi", label: "Catat Transaksi" },
      { id: "buku-kas", label: "Buku Kas" },
    ],
  },
  {
    title: "Laporan ISAK 35",
    items: [
      { id: "lap-posisi", label: "Posisi Keuangan" },
      { id: "lap-aktivitas", label: "Penghasilan Komprehensif" },
      { id: "lap-arus-kas", label: "Arus Kas" },
      { id: "catatan", label: "Catatan Laporan" },
    ],
  },
  {
    title: "Setelan",
    items: [
      { id: "kategori", label: "Bagan Akun" },
      { id: "masjid", label: "Profil Masjid" },
      { id: "data", label: "Data & Backup" },
    ],
  },
];

export const VIEW_TITLE = {
  dashboard: "Beranda Keuangan",
  transaksi: "Catat Transaksi",
  "buku-kas": "Buku Kas",
  "lap-posisi": "Laporan Posisi Keuangan",
  "lap-aktivitas": "Laporan Penghasilan Komprehensif",
  "lap-arus-kas": "Laporan Arus Kas",
  catatan: "Catatan atas Laporan Keuangan",
  kategori: "Bagan Akun",
  masjid: "Profil Masjid",
  data: "Data & Backup",
};
