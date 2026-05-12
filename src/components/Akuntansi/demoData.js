// ═════════════════════════════════════════════════════════════════════
// Akuntansi · demo data builder
// Generates ~180 realistic transactions spanning the last 6 months,
// touching every kategori in DEFAULT_STATE and all 3 ISAK 35 klasifikasi.
// ═════════════════════════════════════════════════════════════════════

import { uid } from "./helpers.js";

const DONATUR_POOL = [
  "Hamba Allah",
  "H. Ahmad Fauzi",
  "Bpk. Subandi",
  "Ibu Siti Aminah",
  "Kel. Bpk. Hasan",
  "H. Mustafa",
  "Ibu Rohmah",
  "Bpk. Yono Purnama",
  "Ibu Hj. Maryam",
];
const JAMAAH_POOL = ["Jamaah", "Jamaah Subuh", "Jamaah Jumat", "Jamaah Tarawih"];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function buildDemoTransaksi() {
  const today = new Date();
  const demo = [];

  // Bukti counter per (YYYY-MM, tipe).
  const buktiCounter = {};
  const nextBukti = (date, tipe) => {
    const ym = date.toISOString().slice(0, 7);
    const key = `${ym}|${tipe}`;
    buktiCounter[key] = (buktiCounter[key] || 0) + 1;
    const prefix = tipe === "IN" ? "BKM" : "BKK";
    return `${prefix}-${ym.replace("-", "/")}/${String(buktiCounter[key]).padStart(4, "0")}`;
  };

  const push = (date, tipe, kategoriId, klasifikasi, nominal, uraian, pihak, metode = "Tunai") => {
    demo.push({
      id: uid(),
      tipe,
      tanggal: date.toISOString().slice(0, 10),
      kategoriId,
      nominal,
      uraian,
      pihak: pihak || "",
      metode,
      bukti: nextBukti(date, tipe),
      klasifikasi,
      createdAt: date.toISOString(),
    });
  };

  // Walk back 6 months and forward to today.
  const start = new Date(today);
  start.setMonth(start.getMonth() - 6);
  start.setDate(1);
  start.setHours(8, 0, 0, 0);

  // ── Routine transactions: weekly + monthly cycles ─────────────────
  const d = new Date(start);
  while (d <= today) {
    const dow = d.getDay();
    const dom = d.getDate();

    // Friday — Infaq Jumat berjamaah
    if (dow === 5) {
      const cursor = new Date(d);
      cursor.setHours(13, 30, 0, 0);
      push(cursor, "IN", "k-i-1", "UNRESTRICTED", rand(1200, 2800) * 1000,
        "Infaq Jumat berjamaah", choice(JAMAAH_POOL));
    }

    // Sun & Wed — Kotak amal harian
    if (dow === 0 || dow === 3) {
      const cursor = new Date(d);
      cursor.setHours(19, 30, 0, 0);
      push(cursor, "IN", "k-i-2", "UNRESTRICTED", rand(180, 520) * 1000,
        "Kotak amal harian", "");
    }

    // Day 5 — utilities
    if (dom === 5) {
      const t1 = new Date(d); t1.setHours(10, 0);
      push(t1, "OUT", "k-o-5", "UNRESTRICTED", rand(750, 950) * 1000,
        "Tagihan listrik bulanan", "PLN", "Transfer Bank");
      const t2 = new Date(d); t2.setHours(10, 15);
      push(t2, "OUT", "k-o-6", "UNRESTRICTED", rand(150, 250) * 1000,
        "Tagihan air PDAM bulanan", "PDAM Kota", "Transfer Bank");
      const t3 = new Date(d); t3.setHours(10, 30);
      push(t3, "OUT", "k-o-7", "UNRESTRICTED", 350 * 1000,
        "Internet & WiFi bulanan", "IndiHome", "Transfer Bank");
    }

    // Day 10 — honorarium pengurus
    if (dom === 10) {
      const t = new Date(d); t.setHours(9, 0);
      push(t, "OUT", "k-o-1", "UNRESTRICTED", 1500 * 1000,
        "Honor imam bulanan", "Ust. Ahmad Hidayat", "Tunai");
      push(t, "OUT", "k-o-2", "UNRESTRICTED", 800 * 1000,
        "Honor muadzin bulanan", "Pak Mardi", "Tunai");
      push(t, "OUT", "k-o-3", "UNRESTRICTED", 1200 * 1000,
        "Honor marbot / penjaga", "Mas Udin", "Tunai");
      push(t, "OUT", "k-o-4", "UNRESTRICTED", 700 * 1000,
        "Honor guru TPA bulanan", "Ust. Hadi Saputra", "Tunai");
    }

    // Day 15 — donasi operasional + pemeliharaan
    if (dom === 15) {
      const t1 = new Date(d); t1.setHours(8, 30);
      push(t1, "IN", "k-i-4", "UNRESTRICTED", rand(2000, 3500) * 1000,
        "Donasi operasional bulanan", choice(DONATUR_POOL), "Transfer Bank");
      const t2 = new Date(d); t2.setHours(14, 0);
      push(t2, "OUT", "k-o-8", "UNRESTRICTED", rand(400, 700) * 1000,
        "Pemeliharaan AC & lampu utama", "Teknisi Pak Joko");
    }

    // Day 20 — perlengkapan + administrasi
    if (dom === 20) {
      const t1 = new Date(d); t1.setHours(11, 0);
      push(t1, "OUT", "k-o-9", "UNRESTRICTED", rand(200, 400) * 1000,
        "Pembelian sajadah & mukena tambahan", "Toko Berkah");
      const t2 = new Date(d); t2.setHours(11, 30);
      push(t2, "OUT", "k-o-15", "UNRESTRICTED", rand(100, 250) * 1000,
        "ATK & administrasi sekretariat", "Toko ATK Sumber Rezeki");
    }

    // Day 25 — kajian rutin + shadaqah
    if (dom === 25) {
      const t1 = new Date(d); t1.setHours(8, 0);
      push(t1, "OUT", "k-o-11", "UNRESTRICTED", 500 * 1000,
        "Honor penceramah kajian Ahad", "Ust. Farid Mubarak", "Tunai");
      const t2 = new Date(d); t2.setHours(8, 15);
      push(t2, "OUT", "k-o-10", "UNRESTRICTED", rand(250, 500) * 1000,
        "Konsumsi kajian Ahad", "Catering Bu Ratna");
      const t3 = new Date(d); t3.setHours(20, 0);
      push(t3, "IN", "k-i-3", "UNRESTRICTED", rand(500, 800) * 1000,
        "Shadaqah dari jamaah", choice(DONATUR_POOL));
    }

    d.setDate(d.getDate() + 1);
  }

  // ── One-off larger transactions ──────────────────────────────────
  const oneOffs = [];
  const dateFor = (monthsAgo, day, hours = 10) => {
    const x = new Date(today);
    x.setMonth(x.getMonth() - monthsAgo);
    x.setDate(day);
    x.setHours(hours, 0, 0, 0);
    return x;
  };

  // — Wakaf uang gelombang 1 (6 bulan lalu)
  oneOffs.push([dateFor(6, 8), "IN", "k-i-10", "PERM_RESTRICTED", 10_000_000,
    "Wakaf uang dari donatur senior", "H. Abdul Karim", "Transfer Bank"]);

  // — Donasi pembangunan atap (5 bulan lalu)
  oneOffs.push([dateFor(5, 12), "IN", "k-i-7", "TEMP_RESTRICTED", 5_000_000,
    "Donasi renovasi atap masjid", "Hamba Allah", "Transfer Bank"]);
  oneOffs.push([dateFor(5, 18), "IN", "k-i-7", "TEMP_RESTRICTED", 3_500_000,
    "Donasi renovasi atap masjid", "Bpk. Hidayat", "Transfer Bank"]);

  // — Pembangunan tahap I (4 bulan lalu)
  oneOffs.push([dateFor(4, 7), "OUT", "k-o-14", "TEMP_RESTRICTED", 3_500_000,
    "Pembangunan tahap I — bongkar atap lama", "CV Mitra Bangun", "Transfer Bank"]);

  // — Pembangunan tahap II (3 bulan lalu)
  oneOffs.push([dateFor(3, 14), "OUT", "k-o-14", "TEMP_RESTRICTED", 4_200_000,
    "Pembangunan tahap II — pemasangan rangka baru", "CV Mitra Bangun", "Transfer Bank"]);

  // — Ramadhan ops (Februari–Maret 2026 di sistem; pakai today.getFullYear)
  const y = today.getFullYear();
  const ramadhanRows = [
    // Penerimaan zakat mal — sepanjang Ramadhan
    [new Date(y, 1, 22, 8), "IN", "k-i-5", "TEMP_RESTRICTED", 5_000_000,
      "Zakat mal", "H. Sulaiman", "Transfer Bank"],
    [new Date(y, 1, 26, 8), "IN", "k-i-5", "TEMP_RESTRICTED", 3_500_000,
      "Zakat mal", "Ibu Hj. Maryam", "Transfer Bank"],
    [new Date(y, 2, 3, 8), "IN", "k-i-5", "TEMP_RESTRICTED", 2_500_000,
      "Zakat mal", "Bpk. Indra", "Transfer Bank"],
    [new Date(y, 2, 8, 8), "IN", "k-i-5", "TEMP_RESTRICTED", 4_000_000,
      "Zakat mal", "H. Burhan", "Transfer Bank"],
    [new Date(y, 2, 14, 8), "IN", "k-i-5", "TEMP_RESTRICTED", 7_500_000,
      "Zakat mal", "Hamba Allah", "Transfer Bank"],
    // Zakat fitrah
    [new Date(y, 2, 17, 16), "IN", "k-i-6", "TEMP_RESTRICTED", 1_850_000,
      "Zakat fitrah dari jamaah (250 jiwa @ Rp 35.000 + beras)", "Jamaah", "Tunai"],
    // Donasi kegiatan Ramadhan
    [new Date(y, 1, 18, 10), "IN", "k-i-9", "TEMP_RESTRICTED", 6_500_000,
      "Donasi takjil & buka puasa Ramadhan", "Hamba Allah", "Transfer Bank"],
    [new Date(y, 1, 24, 10), "IN", "k-i-9", "TEMP_RESTRICTED", 2_200_000,
      "Donasi sahur on the road", "Komunitas Hijrah", "Transfer Bank"],
    // Donasi yatim
    [new Date(y, 2, 10, 9), "IN", "k-i-8", "TEMP_RESTRICTED", 5_000_000,
      "Donasi santunan yatim & dhuafa Ramadhan", "Hamba Allah", "Transfer Bank"],
    [new Date(y, 2, 12, 9), "IN", "k-i-8", "TEMP_RESTRICTED", 2_500_000,
      "Donasi yatim — bagi-bagi sembako", "Kel. Bpk. Hasan", "Transfer Bank"],
    // Konsumsi buka puasa
    [new Date(y, 1, 25, 17), "OUT", "k-o-10", "TEMP_RESTRICTED", 4_500_000,
      "Konsumsi buka puasa 10 hari pertama Ramadhan", "Catering Bu Ratna"],
    [new Date(y, 2, 5, 17), "OUT", "k-o-10", "TEMP_RESTRICTED", 5_800_000,
      "Konsumsi buka puasa 10 hari kedua Ramadhan", "Catering Bu Ratna"],
    [new Date(y, 2, 15, 17), "OUT", "k-o-10", "TEMP_RESTRICTED", 6_200_000,
      "Konsumsi buka puasa 10 hari terakhir Ramadhan", "Catering Bu Ratna"],
    // Honor penceramah tarawih
    [new Date(y, 1, 19, 21), "OUT", "k-o-11", "TEMP_RESTRICTED", 1_500_000,
      "Honor penceramah kultum tarawih (3 ust.)", "Tim Penceramah", "Tunai"],
    [new Date(y, 2, 1, 21), "OUT", "k-o-11", "TEMP_RESTRICTED", 1_500_000,
      "Honor penceramah kultum tarawih (3 ust.)", "Tim Penceramah", "Tunai"],
    [new Date(y, 2, 12, 21), "OUT", "k-o-11", "TEMP_RESTRICTED", 1_500_000,
      "Honor penceramah kultum tarawih (3 ust.)", "Tim Penceramah", "Tunai"],
    // Penyaluran zakat ke asnaf
    [new Date(y, 2, 18, 13), "OUT", "k-o-13", "TEMP_RESTRICTED", 18_000_000,
      "Penyaluran zakat ke 8 asnaf — daftar mustahiq terlampir", "8 Asnaf (35 jiwa)", "Tunai"],
    // Santunan yatim Idul Fitri
    [new Date(y, 2, 19, 9), "OUT", "k-o-12", "TEMP_RESTRICTED", 4_500_000,
      "Santunan yatim & dhuafa menjelang Idul Fitri", "30 anak yatim", "Tunai"],
    [new Date(y, 2, 19, 11), "OUT", "k-o-12", "TEMP_RESTRICTED", 2_800_000,
      "Paket sembako dhuafa Idul Fitri", "40 KK dhuafa", "Tunai"],
  ];
  ramadhanRows.forEach((row) => {
    if (row[0] <= today) oneOffs.push(row);
  });

  // — Wakaf aset (April)
  const wakafAsetDate = new Date(y, 3, 5, 10);
  if (wakafAsetDate <= today) {
    oneOffs.push([wakafAsetDate, "IN", "k-i-11", "PERM_RESTRICTED", 15_000_000,
      "Wakaf aset: 50 sajadah, 30 mukena, 1 unit AC standing 2PK",
      "Kel. Alm. H. Karim", "Tunai"]);
  }

  // — Sewa ruang serbaguna
  const sewa1Date = new Date(y, 3, 12, 14);
  if (sewa1Date <= today) {
    oneOffs.push([sewa1Date, "IN", "k-i-12", "UNRESTRICTED", 1_500_000,
      "Sewa ruang serbaguna — acara walimah", "Bpk. Hendra Wijaya", "Transfer Bank"]);
  }
  const sewa2Date = new Date(y, 4, 3, 14);
  if (sewa2Date <= today) {
    oneOffs.push([sewa2Date, "IN", "k-i-12", "UNRESTRICTED", 2_000_000,
      "Sewa ruang serbaguna — seminar UMKM PKK", "PKK RW 05", "Transfer Bank"]);
  }

  // — Donasi pembangunan menara (May)
  const donMenaraDate = new Date(y, 4, 8, 10);
  if (donMenaraDate <= today) {
    oneOffs.push([donMenaraDate, "IN", "k-i-7", "TEMP_RESTRICTED", 7_500_000,
      "Donasi pembangunan menara — gelombang 2", "Yayasan Al-Hidayah", "Transfer Bank"]);
  }

  // — Wakaf uang gelombang 2
  const wakaf2Date = new Date(y, 4, 1, 9);
  if (wakaf2Date <= today) {
    oneOffs.push([wakaf2Date, "IN", "k-i-10", "PERM_RESTRICTED", 5_000_000,
      "Wakaf uang", "Hamba Allah", "Transfer Bank"]);
  }

  // — Lain-lain (k-o-16) scattered
  const lainRows = [
    [dateFor(6, 22, 11), 350_000, "Biaya kebersihan kamar mandi & toilet", "Petugas Kebersihan"],
    [dateFor(5, 18, 15), 280_000, "Perbaikan keran wudhu rusak (4 titik)", "Tukang Ledeng"],
    [dateFor(4, 22, 9), 450_000, "Cat tembok aula serbaguna", "Tukang Cat"],
    [dateFor(3, 28, 16), 220_000, "Ganti lampu LED 6 titik", "Mas Udin"],
    [dateFor(1, 18, 13), 380_000, "Servis sound system mimbar", "Tukang Audio"],
    [dateFor(2, 8, 11), 650_000, "Penggantian karpet utama 2 gulungan", "Toko Karpet"],
    [dateFor(0, 5, 10), 175_000, "Biaya parkir & retribusi event", "Pengelola Parkir"],
  ];
  lainRows.forEach(([date, amt, ur, pi]) => {
    if (date <= today) oneOffs.push([date, "OUT", "k-o-16", "UNRESTRICTED", amt, ur, pi]);
  });

  // — Extra donasi operasional besar (jamaah affluent, ad-hoc)
  oneOffs.push([dateFor(4, 28, 9), "IN", "k-i-4", "UNRESTRICTED", 8_500_000,
    "Donasi operasional tahunan", "PT Berkah Sejahtera", "Transfer Bank"]);
  oneOffs.push([dateFor(1, 22, 9), "IN", "k-i-4", "UNRESTRICTED", 6_000_000,
    "Donasi operasional triwulanan", "Bpk. H. Mustafa", "Transfer Bank"]);

  // Append one-offs (chronologically sorted so bukti numbers feel natural).
  oneOffs
    .slice()
    .sort((a, b) => a[0] - b[0])
    .forEach(([date, tipe, katId, klas, nominal, uraian, pihak, metode]) => {
      push(new Date(date), tipe, katId, klas, nominal, uraian, pihak || "", metode);
    });

  // Final sort by date+createdAt for clean Buku Kas rendering.
  demo.sort(
    (a, b) =>
      a.tanggal.localeCompare(b.tanggal) ||
      (a.createdAt || "").localeCompare(b.createdAt || "")
  );

  return demo;
}
