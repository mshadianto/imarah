import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Constants & Data ────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const initialFinance = [
  // April 2026
  { id: 1, date: "2026-04-11", type: "income", category: "Infaq Jumat", amount: 8500000, desc: "Kotak infaq Jumat 11 April", verified: true },
  { id: 2, date: "2026-04-10", type: "income", category: "Donasi", amount: 25000000, desc: "Donasi renovasi dari Bpk. Ahmad", verified: true },
  { id: 3, date: "2026-04-09", type: "expense", category: "Listrik & Air", amount: 2800000, desc: "Tagihan listrik & air bulan April", verified: true },
  { id: 4, date: "2026-04-08", type: "income", category: "Zakat", amount: 15000000, desc: "Zakat maal jamaah", verified: false },
  { id: 5, date: "2026-04-07", type: "expense", category: "Kebersihan", amount: 1500000, desc: "Gaji petugas kebersihan", verified: true },
  { id: 6, date: "2026-04-06", type: "expense", category: "Honorarium", amount: 3000000, desc: "Honor imam & muadzin", verified: true },
  { id: 7, date: "2026-04-05", type: "income", category: "Infaq Harian", amount: 3200000, desc: "Kotak infaq harian minggu pertama", verified: true },
  { id: 8, date: "2026-04-04", type: "expense", category: "Pemeliharaan", amount: 5000000, desc: "Perbaikan AC ruang utama", verified: false },
  { id: 9, date: "2026-04-03", type: "income", category: "Wakaf", amount: 10000000, desc: "Wakaf tanah parkir", verified: true },
  { id: 10, date: "2026-04-02", type: "expense", category: "Lainnya", amount: 800000, desc: "ATK dan perlengkapan sekretariat", verified: true },
  // Maret 2026
  { id: 101, date: "2026-03-28", type: "income", category: "Infaq Jumat", amount: 7200000, desc: "Kotak infaq Jumat 28 Maret", verified: true },
  { id: 102, date: "2026-03-25", type: "income", category: "Infaq Jumat", amount: 6800000, desc: "Kotak infaq Jumat 25 Maret", verified: true },
  { id: 103, date: "2026-03-21", type: "income", category: "Donasi", amount: 10000000, desc: "Donasi pembangunan musholla", verified: true },
  { id: 104, date: "2026-03-18", type: "income", category: "Zakat", amount: 8000000, desc: "Zakat maal jamaah", verified: true },
  { id: 105, date: "2026-03-15", type: "income", category: "Infaq Harian", amount: 4500000, desc: "Kotak infaq harian", verified: true },
  { id: 106, date: "2026-03-12", type: "expense", category: "Listrik & Air", amount: 2600000, desc: "Tagihan listrik & air Maret", verified: true },
  { id: 107, date: "2026-03-10", type: "expense", category: "Kebersihan", amount: 1500000, desc: "Gaji petugas kebersihan Maret", verified: true },
  { id: 108, date: "2026-03-08", type: "expense", category: "Honorarium", amount: 3000000, desc: "Honor imam & muadzin Maret", verified: true },
  { id: 109, date: "2026-03-05", type: "expense", category: "Pemeliharaan", amount: 2000000, desc: "Service sound system", verified: true },
  { id: 110, date: "2026-03-02", type: "income", category: "Wakaf", amount: 5000000, desc: "Wakaf kitab/buku", verified: true },
  { id: 111, date: "2026-03-01", type: "expense", category: "Lainnya", amount: 1200000, desc: "Konsumsi rapat DKM", verified: true },
  // Februari 2026
  { id: 201, date: "2026-02-27", type: "income", category: "Infaq Jumat", amount: 7000000, desc: "Kotak infaq Jumat", verified: true },
  { id: 202, date: "2026-02-20", type: "income", category: "Infaq Jumat", amount: 6500000, desc: "Kotak infaq Jumat", verified: true },
  { id: 203, date: "2026-02-15", type: "income", category: "Donasi", amount: 15000000, desc: "Donasi renovasi toilet", verified: true },
  { id: 204, date: "2026-02-10", type: "income", category: "Infaq Harian", amount: 3800000, desc: "Kotak infaq harian", verified: true },
  { id: 205, date: "2026-02-08", type: "expense", category: "Listrik & Air", amount: 2500000, desc: "Tagihan listrik & air Feb", verified: true },
  { id: 206, date: "2026-02-06", type: "expense", category: "Kebersihan", amount: 1500000, desc: "Gaji petugas kebersihan Feb", verified: true },
  { id: 207, date: "2026-02-04", type: "expense", category: "Honorarium", amount: 3000000, desc: "Honor imam & muadzin Feb", verified: true },
  { id: 208, date: "2026-02-02", type: "expense", category: "Pemeliharaan", amount: 8000000, desc: "Renovasi toilet wudhu", verified: true },
];

const initialEvents = [
  { id: 1, title: "Kajian Rutin Ba'da Maghrib", date: "2026-04-12", time: "18:30", speaker: "Ust. Abdullah", status: "upcoming", type: "kajian" },
  { id: 2, title: "Sholat Jumat", date: "2026-04-11", time: "12:00", speaker: "Ust. Mahmud", status: "today", type: "sholat" },
  { id: 3, title: "TPA Anak-anak", date: "2026-04-13", time: "08:00", speaker: "Ust. Fatimah", status: "upcoming", type: "pendidikan" },
  { id: 4, title: "Rapat DKM Bulanan", date: "2026-04-15", time: "20:00", speaker: "Ketua DKM", status: "upcoming", type: "organisasi" },
  { id: 5, title: "Bersih-bersih Masjid", date: "2026-04-14", time: "07:00", speaker: "Tim Kebersihan", status: "upcoming", type: "operasional" },
  { id: 6, title: "Pengajian Ibu-ibu", date: "2026-04-16", time: "09:00", speaker: "Ustdzh. Khadijah", status: "upcoming", type: "kajian" },
];

const initialInventory = [
  { id: 1, name: "Sajadah Besar", qty: 120, condition: "Baik", lastCheck: "2026-04-01", area: "Ruang Utama", nextMaint: "" },
  { id: 2, name: "Al-Quran", qty: 200, condition: "Baik", lastCheck: "2026-04-01", area: "Ruang Utama", nextMaint: "" },
  { id: 3, name: "Mukena", qty: 50, condition: "Sebagian Perlu Ganti", lastCheck: "2026-03-28", area: "Ruang Wanita", nextMaint: "" },
  { id: 4, name: "Speaker/Sound System", qty: 4, condition: "Baik", lastCheck: "2026-04-05", area: "Ruang Utama", nextMaint: "2026-07-05" },
  { id: 5, name: "AC / Pendingin", qty: 8, condition: "1 Unit Rusak", lastCheck: "2026-04-04", area: "Ruang Utama", nextMaint: "2026-04-20" },
  { id: 6, name: "Kipas Angin", qty: 12, condition: "Baik", lastCheck: "2026-03-20", area: "Serambi", nextMaint: "" },
  { id: 7, name: "Karpet Lantai (m²)", qty: 450, condition: "Baik", lastCheck: "2026-04-01", area: "Ruang Utama", nextMaint: "" },
  { id: 8, name: "Sandal Wudhu", qty: 30, condition: "Perlu Tambah", lastCheck: "2026-03-15", area: "Area Wudhu", nextMaint: "" },
  { id: 9, name: "Pompa Air", qty: 2, condition: "Baik", lastCheck: "2026-03-10", area: "Area Wudhu", nextMaint: "2026-06-10" },
  { id: 10, name: "Lampu Utama", qty: 24, condition: "3 Mati", lastCheck: "2026-04-08", area: "Ruang Utama", nextMaint: "" },
  { id: 11, name: "CCTV", qty: 6, condition: "Baik", lastCheck: "2026-03-01", area: "Luar/Parkir", nextMaint: "2026-09-01" },
  { id: 12, name: "Genset", qty: 1, condition: "Baik", lastCheck: "2026-02-15", area: "Gudang", nextMaint: "2026-08-15" },
];

const AREAS = ["Semua", "Ruang Utama", "Ruang Wanita", "Serambi", "Area Wudhu", "Luar/Parkir", "Gudang"];

const initialTickets = [
  { id: 1, item: "AC / Pendingin", area: "Ruang Utama", issue: "Unit AC #3 tidak dingin, bunyi berdecit", priority: "tinggi", status: "proses", reportedBy: "Marbot Udin", reportedDate: "2026-04-04", resolvedDate: "", notes: "Teknisi sudah datang, menunggu sparepart kompresor" },
  { id: 2, item: "Lampu Utama", area: "Ruang Utama", issue: "3 lampu mati di sisi kanan shaf depan", priority: "sedang", status: "baru", reportedBy: "Ketua DKM", reportedDate: "2026-04-08", resolvedDate: "", notes: "" },
  { id: 3, item: "Kran Wudhu", area: "Area Wudhu", issue: "Kran #5 dan #8 bocor, air menggenang", priority: "tinggi", status: "proses", reportedBy: "Marbot Udin", reportedDate: "2026-04-02", resolvedDate: "", notes: "Sudah dipesan kran pengganti" },
  { id: 4, item: "Atap Serambi", area: "Serambi", issue: "Bocor saat hujan deras di sudut kanan", priority: "sedang", status: "baru", reportedBy: "Jamaah Ahmad", reportedDate: "2026-04-09", resolvedDate: "", notes: "" },
  { id: 5, item: "Speaker/Sound System", area: "Ruang Utama", issue: "Speaker kiri kadang mati sendiri", priority: "rendah", status: "selesai", reportedBy: "Imam Mahmud", reportedDate: "2026-03-15", resolvedDate: "2026-03-22", notes: "Kabel konektor diganti, sudah normal" },
  { id: 6, item: "Pompa Air", area: "Area Wudhu", issue: "Tekanan air lemah saat jamaah ramai", priority: "sedang", status: "selesai", reportedBy: "Marbot Udin", reportedDate: "2026-03-05", resolvedDate: "2026-03-12", notes: "Filter pompa dibersihkan, sudah lancar" },
  { id: 7, item: "Pintu Utama", area: "Ruang Utama", issue: "Engsel pintu kanan bunyi & berat ditarik", priority: "rendah", status: "baru", reportedBy: "Sekretaris DKM", reportedDate: "2026-04-10", resolvedDate: "", notes: "" },
];

const DONATUR_TYPES = [
  { value: "rutin", label: "Rutin Bulanan", color: "#10b981", emoji: "🔄" },
  { value: "insidentil", label: "Insidentil", color: "#3b82f6", emoji: "🎁" },
  { value: "ramadhan", label: "Ramadhan", color: "#8b5cf6", emoji: "🌙" },
  { value: "qurban", label: "Qurban", color: "#f59e0b", emoji: "🐑" },
  { value: "wakaf", label: "Wakaf", color: "#ec4899", emoji: "🏛️" },
];

const initialDonatur = [
  { id: 1, name: "H. Ahmad Fauzi", phone: "0812-3456-7890", type: "rutin", amount: 2000000, frequency: "Bulanan", since: "2024-01", lastDonation: "2026-04-05", totalLifetime: 52000000, notes: "Transfer otomatis tiap tanggal 5", active: true },
  { id: 2, name: "Ibu Siti Aminah", phone: "0813-2222-3333", type: "rutin", amount: 500000, frequency: "Bulanan", since: "2025-03", lastDonation: "2026-04-01", totalLifetime: 7000000, notes: "Via kotak infaq langsung", active: true },
  { id: 3, name: "Bpk. Ridwan Kamil", phone: "0821-9876-5432", type: "rutin", amount: 5000000, frequency: "Bulanan", since: "2023-06", lastDonation: "2026-04-10", totalLifetime: 170000000, notes: "Transfer ke rekening masjid BSI", active: true },
  { id: 4, name: "CV Berkah Jaya", phone: "0811-4444-5555", type: "rutin", amount: 3000000, frequency: "Bulanan", since: "2025-01", lastDonation: "2026-03-28", totalLifetime: 48000000, notes: "CSR perusahaan", active: true },
  { id: 5, name: "Dr. Hasan Basri", phone: "0857-6666-7777", type: "insidentil", amount: 25000000, frequency: "-", since: "2026-04", lastDonation: "2026-04-10", totalLifetime: 25000000, notes: "Donasi renovasi AC", active: false },
  { id: 6, name: "Ibu Khadijah", phone: "0878-8888-9999", type: "rutin", amount: 1000000, frequency: "Bulanan", since: "2024-07", lastDonation: "2026-04-03", totalLifetime: 22000000, notes: "", active: true },
  { id: 7, name: "H. Mahmud Syafii", phone: "0852-1111-2222", type: "wakaf", amount: 50000000, frequency: "-", since: "2025-11", lastDonation: "2025-11-15", totalLifetime: 50000000, notes: "Wakaf lahan parkir masjid", active: false },
  { id: 8, name: "Bpk. Umar Said", phone: "0838-3333-4444", type: "ramadhan", amount: 10000000, frequency: "Tahunan", since: "2024-03", lastDonation: "2026-03-01", totalLifetime: 30000000, notes: "Rutin setiap Ramadhan", active: true },
  { id: 9, name: "Ibu Fatimah Zahra", phone: "0822-5555-6666", type: "qurban", amount: 8000000, frequency: "Tahunan", since: "2023-06", lastDonation: "2025-06-17", totalLifetime: 24000000, notes: "Qurban sapi bersama", active: true },
  { id: 10, name: "Keluarga Anwar", phone: "0815-7777-8888", type: "rutin", amount: 750000, frequency: "Bulanan", since: "2025-08", lastDonation: "2026-04-07", totalLifetime: 6750000, notes: "Atas nama alm. H. Anwar", active: true },
];

// ─── Usaha Masjid Data ──────────────────────────────────────────────
const USAHA_CATEGORIES = [
  { value: "sewa", label: "Sewa Aset", color: "#8b5cf6", emoji: "🏢", desc: "Aula, lahan, ruang" },
  { value: "retail", label: "Retail / Toko", color: "#10b981", emoji: "🛒", desc: "Minimarket, perlengkapan ibadah" },
  { value: "jasa", label: "Jasa", color: "#3b82f6", emoji: "🔧", desc: "Katering, laundry, jenazah" },
  { value: "koperasi", label: "Koperasi", color: "#f59e0b", emoji: "🤝", desc: "Simpan pinjam syariah" },
  { value: "parkir", label: "Parkir & Lahan", color: "#ec4899", emoji: "🅿️", desc: "Parkir, lapak, ATM" },
];

const initialUsahaUnits = [
  { id: 1, name: "Aula Serbaguna Al-Ikhlas", category: "sewa", status: "aktif", capacity: "200 orang", ratePerDay: 3500000, rateLabel: "/ hari", location: "Lantai 2", pic: "Bpk. Rahmat", phone: "0812-1111-0001", desc: "Aula untuk walimah, seminar, rapat besar. Termasuk kursi, meja, sound system, AC.", operatingCost: 500000 },
  { id: 2, name: "Minimarket Barokah", category: "retail", status: "aktif", capacity: "24 m²", ratePerDay: 0, rateLabel: "", location: "Samping Masjid", pic: "Ibu Nuraini", phone: "0813-2222-0002", desc: "Menjual sembako, perlengkapan ibadah, snack, minuman. Buka 06.00-21.00.", operatingCost: 3500000 },
  { id: 3, name: "Katering Masjid As-Sakinah", category: "jasa", status: "aktif", capacity: "Maks 500 porsi", ratePerDay: 25000, rateLabel: "/ porsi", location: "Dapur Masjid", pic: "Ibu Halimah", phone: "0821-3333-0003", desc: "Nasi kotak untuk acara jamaah, aqiqah, tahlilan, arisan.", operatingCost: 2000000 },
  { id: 4, name: "Koperasi Simpan Pinjam Amanah", category: "koperasi", status: "aktif", capacity: "387 anggota", ratePerDay: 0, rateLabel: "", location: "Ruang Sekretariat", pic: "H. Darmawan", phone: "0857-4444-0004", desc: "Koperasi syariah: simpanan wadiah, pembiayaan murabahah, gadai emas.", operatingCost: 1500000 },
  { id: 5, name: "Parkir Masjid (Motor & Mobil)", category: "parkir", status: "aktif", capacity: "Motor 80, Mobil 20", ratePerDay: 0, rateLabel: "", location: "Halaman Depan", pic: "Mas Joko", phone: "0838-5555-0005", desc: "Parkir harian & bulanan. Motor Rp2.000, Mobil Rp5.000. Langganan: Motor Rp50.000/bln.", operatingCost: 800000 },
  { id: 6, name: "Sewa Lapak PKL (6 unit)", category: "parkir", status: "aktif", capacity: "6 lapak", ratePerDay: 0, rateLabel: "", location: "Depan Pagar Masjid", pic: "Bpk. Rahmat", phone: "0812-1111-0001", desc: "Lapak untuk jualan takjil, gorengan, makanan ringan. Sewa Rp500.000/bulan/lapak.", operatingCost: 200000 },
  { id: 7, name: "Layanan Jenazah Al-Firdaus", category: "jasa", status: "aktif", capacity: "Ambulans 1 unit", ratePerDay: 0, rateLabel: "Infaq seikhlasnya", location: "Gudang Belakang", pic: "Ust. Salim", phone: "0852-6666-0006", desc: "Pemulasaraan jenazah lengkap: ambulans, perlengkapan, pendampingan sholat jenazah.", operatingCost: 400000 },
  { id: 8, name: "Laundry Berkah", category: "jasa", status: "nonaktif", capacity: "3 mesin cuci", ratePerDay: 7000, rateLabel: "/ kg", location: "Belakang Masjid", pic: "Mas Adi", phone: "0822-7777-0007", desc: "Laundry kiloan. Sementara tutup karena mesin rusak.", operatingCost: 1200000 },
];

const initialUsahaTransactions = [
  // April 2026
  { id: 1, unitId: 1, date: "2026-04-10", type: "pendapatan", amount: 3500000, desc: "Sewa aula — Walimah Bpk. Irfan", category: "sewa" },
  { id: 2, unitId: 1, date: "2026-04-06", type: "pendapatan", amount: 3500000, desc: "Sewa aula — Seminar Kesehatan RW 05", category: "sewa" },
  { id: 3, unitId: 1, date: "2026-04-08", type: "biaya", amount: 500000, desc: "Listrik & kebersihan aula", category: "sewa" },
  { id: 4, unitId: 2, date: "2026-04-10", type: "pendapatan", amount: 8200000, desc: "Penjualan minimarket minggu 1-2", category: "retail" },
  { id: 5, unitId: 2, date: "2026-04-10", type: "biaya", amount: 6100000, desc: "Kulakan barang + gaji kasir", category: "retail" },
  { id: 6, unitId: 3, date: "2026-04-09", type: "pendapatan", amount: 7500000, desc: "Katering 300 porsi — Aqiqah Bpk. Faisal", category: "jasa" },
  { id: 7, unitId: 3, date: "2026-04-09", type: "biaya", amount: 4500000, desc: "Bahan baku + upah masak", category: "jasa" },
  { id: 8, unitId: 4, date: "2026-04-05", type: "pendapatan", amount: 4200000, desc: "Bagi hasil pembiayaan murabahah April", category: "koperasi" },
  { id: 9, unitId: 4, date: "2026-04-05", type: "biaya", amount: 1500000, desc: "Operasional koperasi + ATK", category: "koperasi" },
  { id: 10, unitId: 5, date: "2026-04-10", type: "pendapatan", amount: 3800000, desc: "Pendapatan parkir harian + langganan", category: "parkir" },
  { id: 11, unitId: 5, date: "2026-04-10", type: "biaya", amount: 800000, desc: "Gaji tukang parkir", category: "parkir" },
  { id: 12, unitId: 6, date: "2026-04-01", type: "pendapatan", amount: 3000000, desc: "Sewa 6 lapak PKL bulan April", category: "parkir" },
  { id: 13, unitId: 7, date: "2026-04-07", type: "pendapatan", amount: 1500000, desc: "Infaq layanan jenazah (3 kali)", category: "jasa" },
  { id: 14, unitId: 7, date: "2026-04-07", type: "biaya", amount: 400000, desc: "BBM ambulans + perlengkapan", category: "jasa" },
  // Maret 2026
  { id: 101, unitId: 1, date: "2026-03-20", type: "pendapatan", amount: 7000000, desc: "Sewa aula 2x (rapat & pengajian)", category: "sewa" },
  { id: 102, unitId: 1, date: "2026-03-20", type: "biaya", amount: 900000, desc: "Maintenance + listrik aula Maret", category: "sewa" },
  { id: 103, unitId: 2, date: "2026-03-28", type: "pendapatan", amount: 15500000, desc: "Penjualan minimarket Maret (full)", category: "retail" },
  { id: 104, unitId: 2, date: "2026-03-28", type: "biaya", amount: 11800000, desc: "Kulakan + gaji + listrik Maret", category: "retail" },
  { id: 105, unitId: 3, date: "2026-03-15", type: "pendapatan", amount: 12500000, desc: "Katering 500 porsi — Maulid Nabi", category: "jasa" },
  { id: 106, unitId: 3, date: "2026-03-15", type: "biaya", amount: 7800000, desc: "Bahan baku Maulid", category: "jasa" },
  { id: 107, unitId: 4, date: "2026-03-05", type: "pendapatan", amount: 3800000, desc: "Bagi hasil pembiayaan Maret", category: "koperasi" },
  { id: 108, unitId: 5, date: "2026-03-28", type: "pendapatan", amount: 3500000, desc: "Parkir Maret", category: "parkir" },
  { id: 109, unitId: 6, date: "2026-03-01", type: "pendapatan", amount: 3000000, desc: "Sewa lapak Maret", category: "parkir" },
  { id: 110, unitId: 7, date: "2026-03-20", type: "pendapatan", amount: 2000000, desc: "Layanan jenazah Maret (4x)", category: "jasa" },
];

const initialBookings = [
  { id: 1, unitId: 1, unitName: "Aula Serbaguna Al-Ikhlas", client: "Bpk. Hendra", phone: "0812-9999-1111", date: "2026-04-19", endDate: "2026-04-19", purpose: "Walimah putra", amount: 3500000, status: "confirmed", notes: "Dekorasi sendiri, butuh kursi 150" },
  { id: 2, unitId: 1, unitName: "Aula Serbaguna Al-Ikhlas", client: "Ibu Dewi (PKK)", phone: "0813-8888-2222", date: "2026-04-26", endDate: "2026-04-26", purpose: "Arisan + seminar UMKM", amount: 3500000, status: "pending", notes: "Request projector & mic wireless" },
  { id: 3, unitId: 3, unitName: "Katering Masjid As-Sakinah", client: "Bpk. Yusuf", phone: "0821-7777-3333", date: "2026-04-20", endDate: "2026-04-20", purpose: "Aqiqah 200 porsi", amount: 5000000, status: "confirmed", notes: "Menu: nasi kebuli + ayam" },
  { id: 4, unitId: 1, unitName: "Aula Serbaguna Al-Ikhlas", client: "Karang Taruna", phone: "0857-6666-4444", date: "2026-05-03", endDate: "2026-05-03", purpose: "Rapat tahunan + buka bersama", amount: 3500000, status: "pending", notes: "" },
];

// ─── Dakwah & Sosial (Adopsi Masjid Jogokariyan) ────────────────────
const DAKWAH_STATUS = [
  { value: "hijau", label: "Aktif Berjamaah", color: "#10b981", emoji: "🟢" },
  { value: "kuning", label: "Sholat tapi Jarang ke Masjid", color: "#f59e0b", emoji: "🟡" },
  { value: "merah", label: "Belum Sholat / Belum Terdata", color: "#ef4444", emoji: "🔴" },
];
const DAKWAH_BADGES = [
  { key: "haji", emoji: "🕋", label: "Sudah Haji" },
  { key: "qurban", emoji: "🐑", label: "Sudah Qurban" },
  { key: "zakat", emoji: "💰", label: "Zakat di Masjid" },
  { key: "jamaah", emoji: "🕌", label: "Rutin Berjamaah" },
];

const initialPetaDakwah = [
  { id: 1, rt: "01", name: "Kel. H. Ahmad Fauzi", members: 5, status: "hijau", badges: ["haji","qurban","zakat","jamaah"], notes: "Donatur tetap" },
  { id: 2, rt: "01", name: "Kel. Budi Santoso", members: 4, status: "hijau", badges: ["qurban","zakat","jamaah"], notes: "" },
  { id: 3, rt: "01", name: "Kel. Ibu Siti", members: 3, status: "kuning", badges: ["zakat"], notes: "Suami kerja shift malam" },
  { id: 4, rt: "02", name: "Kel. Agus Hermawan", members: 6, status: "hijau", badges: ["haji","qurban","zakat","jamaah"], notes: "Ketua RT" },
  { id: 5, rt: "02", name: "Kel. Doni Prasetyo", members: 4, status: "kuning", badges: [], notes: "Baru pindah, belum kenal" },
  { id: 6, rt: "02", name: "Kel. Joko Widodo", members: 3, status: "merah", badges: [], notes: "Perlu kunjungan da'i" },
  { id: 7, rt: "03", name: "Kel. Ridwan", members: 5, status: "hijau", badges: ["qurban","jamaah"], notes: "" },
  { id: 8, rt: "03", name: "Kel. Umar", members: 4, status: "hijau", badges: ["haji","qurban","zakat","jamaah"], notes: "Pengurus DKM" },
  { id: 9, rt: "03", name: "Kel. Bambang", members: 7, status: "kuning", badges: ["zakat"], notes: "Istri aktif pengajian" },
  { id: 10, rt: "04", name: "Kel. Supardi", members: 3, status: "merah", badges: [], notes: "Lansia, perlu dijemput" },
  { id: 11, rt: "04", name: "Kel. Hasan", members: 5, status: "hijau", badges: ["qurban","zakat","jamaah"], notes: "" },
  { id: 12, rt: "04", name: "Kel. Yanto", members: 4, status: "kuning", badges: [], notes: "Anak remaja jarang ke masjid" },
];

const initialProgramSosial = [
  { id: 1, name: "ATM Beras", emoji: "🍚", desc: "Distribusi beras gratis via KTP untuk keluarga dhuafa", beneficiaries: 85, unit: "KK", budget: 8500000, distributed: 7200000, frequency: "Bulanan", status: "aktif" },
  { id: 2, name: "Kartu Sehat Masjid", emoji: "🏥", desc: "Jaminan berobat di klinik/RS rekanan untuk warga tidak mampu", beneficiaries: 42, unit: "orang", budget: 15000000, distributed: 11000000, frequency: "Bulanan", status: "aktif" },
  { id: 3, name: "Beasiswa Pelajar", emoji: "🎓", desc: "Bantuan biaya sekolah SD-SMA untuk anak yatim & dhuafa", beneficiaries: 28, unit: "siswa", budget: 14000000, distributed: 14000000, frequency: "Per Semester", status: "aktif" },
  { id: 4, name: "Santunan Yatim & Janda", emoji: "🤲", desc: "Santunan tunai bulanan untuk yatim piatu dan janda miskin", beneficiaries: 35, unit: "orang", budget: 10500000, distributed: 10500000, frequency: "Bulanan", status: "aktif" },
  { id: 5, name: "Gerakan Subuh Berjamaah", emoji: "🌅", desc: "Undangan subuh + kuliah subuh + sarapan gratis + uang jajan anak", beneficiaries: 120, unit: "jamaah", budget: 3000000, distributed: 2800000, frequency: "Harian", status: "aktif" },
  { id: 6, name: "Modal Usaha Jamaah", emoji: "💼", desc: "Pemberian modal usaha tanpa bunga untuk jamaah kurang mampu", beneficiaries: 12, unit: "orang", budget: 24000000, distributed: 18000000, frequency: "Per Kuartal", status: "aktif" },
  { id: 7, name: "Buka Bersama Ramadhan", emoji: "🌙", desc: "Makan buka puasa gratis 1000+ porsi/hari selama Ramadhan", beneficiaries: 1000, unit: "porsi/hari", budget: 150000000, distributed: 0, frequency: "Ramadhan", status: "terjadwal" },
  { id: 8, name: "Jemput Jamaah", emoji: "🚗", desc: "Layanan antar-jemput lansia & disabilitas untuk sholat berjamaah", beneficiaries: 8, unit: "orang", budget: 1200000, distributed: 900000, frequency: "Harian", status: "aktif" },
];

// Infaq Nol Rupiah tracker
const infaqNolData = {
  totalMasuk: 51700000, // April
  totalKeluar: 49800000, // disalurkan
  saldoSekarang: 1900000,
  target: 0, // target NOL
  penyaluran: [
    { id: 1, date: "2026-04-10", amount: 15000000, to: "ATM Beras + Santunan", desc: "Penyaluran rutin mingguan" },
    { id: 2, date: "2026-04-08", amount: 14000000, to: "Beasiswa Pelajar", desc: "Beasiswa semester genap 2026" },
    { id: 3, date: "2026-04-05", amount: 10500000, to: "Santunan Yatim & Janda", desc: "Santunan bulanan April" },
    { id: 4, date: "2026-04-03", amount: 5000000, to: "Kartu Sehat Masjid", desc: "Klaim RS 3 warga" },
    { id: 5, date: "2026-04-01", amount: 5300000, to: "Operasional + Subuh", desc: "Gaji marbot, sarapan, uang jajan" },
  ],
};

const KONDISI_OPTIONS = [
  { value: "ramai", label: "🟢 Ramai", color: "#10b981", emoji: "🟢", score: 3 },
  { value: "normal", label: "🟡 Normal", color: "#f59e0b", emoji: "🟡", score: 2 },
  { value: "sepi", label: "🔴 Sepi", color: "#ef4444", emoji: "🔴", score: 1 },
];

const initialJamaah = [
  { id: 1, week: "2026-W15", label: "7-11 Apr", kondisi: "ramai", catatan: "Nuzulul Quran, jamaah meningkat", by: "Ketua DKM" },
  { id: 2, week: "2026-W14", label: "31 Mar-4 Apr", kondisi: "normal", catatan: "", by: "Ketua DKM" },
  { id: 3, week: "2026-W13", label: "24-28 Mar", kondisi: "normal", catatan: "Cuaca cerah", by: "Sekretaris" },
  { id: 4, week: "2026-W12", label: "17-21 Mar", kondisi: "ramai", catatan: "Isra Mi'raj", by: "Ketua DKM" },
  { id: 5, week: "2026-W11", label: "10-14 Mar", kondisi: "sepi", catatan: "Hujan deras sepanjang minggu", by: "Sekretaris" },
  { id: 6, week: "2026-W10", label: "3-7 Mar", kondisi: "normal", catatan: "", by: "Ketua DKM" },
  { id: 7, week: "2026-W09", label: "24-28 Feb", kondisi: "normal", catatan: "", by: "Ketua DKM" },
  { id: 8, week: "2026-W08", label: "17-21 Feb", kondisi: "ramai", catatan: "Tabligh Akbar", by: "Ketua DKM" },
  { id: 9, week: "2026-W07", label: "10-14 Feb", kondisi: "sepi", catatan: "Banyak warga mudik", by: "Sekretaris" },
  { id: 10, week: "2026-W06", label: "3-7 Feb", kondisi: "normal", catatan: "", by: "Ketua DKM" },
  { id: 11, week: "2026-W05", label: "27-31 Jan", kondisi: "normal", catatan: "", by: "Ketua DKM" },
  { id: 12, week: "2026-W04", label: "20-24 Jan", kondisi: "ramai", catatan: "Maulid Nabi", by: "Ketua DKM" },
];

// ─── Formatters ──────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);
const fmtDate = (d) => {
  const dt = new Date(d);
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
};

// ─── Icon Components ─────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    finance: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    inventory: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    jamaah: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow_up: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrow_down: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    mosque: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C9 5 4 8 4 13v7h16v-7c0-5-5-8-8-11z"/><path d="M8 20v-4a4 4 0 0 1 8 0v4"/><line x1="12" y1="2" x2="12" y2="5"/><circle cx="12" cy="1.5" r="0.5" fill="currentColor"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    shop: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9"/><path d="M9 21V13h6v8"/><path d="M3 9h18"/><path d="M6 9v2a3 3 0 006 0V9"/><path d="M12 9v2a3 3 0 006 0V9"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  };
  return icons[name] || null;
};

// ─── Mini Bar Chart ──────────────────────────────────────────────────
const MiniBarChart = ({ data, color, height = 80 }) => {
  const max = Math.max(...data.filter(d => d > 0));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height, padding: "4px 0" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: "100%", borderRadius: 3,
            height: v > 0 ? Math.max(4, (v / max) * (height - 16)) : 4,
            background: v > 0 ? color : "rgba(255,255,255,0.1)",
            transition: "height 0.5s ease",
          }} />
          <span style={{ fontSize: 8, opacity: 0.5, fontFamily: "var(--font-body)" }}>{MONTHS[i].substring(0, 1)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Donut Chart ─────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 120 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const r = 42, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const offset = c * (1 - cumulative / total);
        cumulative += seg.value;
        return (
          <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={seg.color}
            strokeWidth="14" strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
            strokeDashoffset={offset} transform="rotate(-90 60 60)"
            style={{ transition: "all 0.6s ease" }} />
        );
      })}
      <text x="60" y="56" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700" fontFamily="var(--font-display)">
        {fmt(total / 1000000)}
      </text>
      <text x="60" y="72" textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-body)">
        Juta Rupiah
      </text>
    </svg>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, accent }) => (
  <div style={{
    background: "var(--card-bg)", borderRadius: 16, padding: "20px 18px",
    border: "1px solid var(--border)", position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: -20, right: -20, width: 80, height: 80,
      borderRadius: "50%", background: accent || color, opacity: 0.07,
    }} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}18`, color,
      }}>
        <Icon name={icon} size={18} />
      </div>
      <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{label}</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, fontFamily: "var(--font-body)" }}>{sub}</div>}
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--card-bg)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480,
        border: "1px solid var(--border)", maxHeight: "85vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 4 }}>
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Input Field ─────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 5, fontFamily: "var(--font-body)" }}>{label}</label>
    {props.as === "select" ? (
      <select {...props} as={undefined} style={{
        width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)",
        background: "var(--bg)", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none",
      }}>
        {props.children}
      </select>
    ) : props.as === "textarea" ? (
      <textarea {...props} as={undefined} rows={3} style={{
        width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)",
        background: "var(--bg)", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none", resize: "vertical", boxSizing: "border-box",
      }} />
    ) : (
      <input {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)",
        background: "var(--bg)", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)",
        outline: "none", boxSizing: "border-box",
      }} />
    )}
  </div>
);

const Btn = ({ children, variant = "primary", ...props }) => (
  <button {...props} style={{
    padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600,
    fontSize: 13, fontFamily: "var(--font-body)", transition: "all 0.2s",
    background: variant === "primary" ? "var(--accent)" : "var(--border)",
    color: variant === "primary" ? "#fff" : "var(--text-primary)",
    ...props.style,
  }}>
    {children}
  </button>
);

// ═════════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════════
export default function MasjidManager() {
  const [page, setPage] = useState("dashboard");
  const [finance, setFinance] = useState(initialFinance);
  const [events, setEvents] = useState(initialEvents);
  const [inventory, setInventory] = useState(initialInventory);
  const [showModal, setShowModal] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  // ── Form states
  const [finForm, setFinForm] = useState({ type: "income", category: "", amount: "", desc: "", date: "2026-04-11" });
  const [eventForm, setEventForm] = useState({ title: "", date: "", time: "", speaker: "", type: "kajian" });
  const [invForm, setInvForm] = useState({ name: "", qty: "", condition: "Baik", area: "Ruang Utama" });
  const [tickets, setTickets] = useState(initialTickets);
  const [ticketForm, setTicketForm] = useState({ item: "", area: "Ruang Utama", issue: "", priority: "sedang", reportedBy: "" });
  const [invTab, setInvTab] = useState("inventaris"); // "inventaris" | "laporan" | "jadwal"
  const [invAreaFilter, setInvAreaFilter] = useState("Semua");
  const [jamaah, setJamaah] = useState(initialJamaah);
  const [jamaahForm, setJamaahForm] = useState({ label: "", kondisi: "normal", catatan: "" });
  const [donatur, setDonatur] = useState(initialDonatur);
  const [donaturForm, setDonaturForm] = useState({ name: "", phone: "", type: "rutin", amount: "", frequency: "Bulanan", notes: "" });
  const [donaturFilter, setDonaturFilter] = useState("semua"); // "semua" | type values
  const [donaturSearch, setDonaturSearch] = useState("");
  const [usahaUnits, setUsahaUnits] = useState(initialUsahaUnits);
  const [usahaTx, setUsahaTx] = useState(initialUsahaTransactions);
  const [bookings, setBookings] = useState(initialBookings);
  const [usahaTab, setUsahaTab] = useState("ringkasan"); // ringkasan | units | booking | transaksi
  const [usahaCatFilter, setUsahaCatFilter] = useState("semua");
  const [bookingForm, setBookingForm] = useState({ unitId: 1, client: "", phone: "", date: "", purpose: "", amount: "", notes: "" });
  const [petaDakwah] = useState(initialPetaDakwah);
  const [programSosial] = useState(initialProgramSosial);
  const [dakwahTab, setDakwahTab] = useState("peta"); // peta | infaqnol | program

  // ── Finance filters
  const [finPeriod, setFinPeriod] = useState("2026-04"); // current period
  const [finView, setFinView] = useState("all"); // "all" | "income" | "expense"
  const [finCategory, setFinCategory] = useState("Semua");
  const [showComparison, setShowComparison] = useState(false);

  // ── Finance helpers
  const getPrevPeriod = (p) => {
    const [y, m] = p.split("-").map(Number);
    const pm = m === 1 ? 12 : m - 1;
    const py = m === 1 ? y - 1 : y;
    return `${py}-${String(pm).padStart(2, "0")}`;
  };
  const periodLabel = (p) => {
    const [y, m] = p.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  };
  const prevPeriod = getPrevPeriod(finPeriod);
  const availablePeriods = useMemo(() => {
    const set = new Set();
    finance.forEach(f => set.add(f.date.substring(0, 7)));
    return [...set].sort().reverse();
  }, [finance]);

  // ── Computed — period-aware
  const filterByPeriod = useCallback((data, period) => data.filter(f => f.date.startsWith(period)), []);

  const currentData = useMemo(() => filterByPeriod(finance, finPeriod), [finance, finPeriod, filterByPeriod]);
  const prevData = useMemo(() => filterByPeriod(finance, prevPeriod), [finance, prevPeriod, filterByPeriod]);

  const calcByCategory = useCallback((data, type) => {
    const map = {};
    data.filter(f => f.type === type).forEach(f => { map[f.category] = (map[f.category] || 0) + f.amount; });
    return map;
  }, []);

  const totalIncome = useMemo(() => currentData.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0), [currentData]);
  const totalExpense = useMemo(() => currentData.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0), [currentData]);
  const balance = totalIncome - totalExpense;

  const prevIncome = useMemo(() => prevData.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0), [prevData]);
  const prevExpense = useMemo(() => prevData.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0), [prevData]);

  const incomeByCategory = useMemo(() => calcByCategory(currentData, "income"), [currentData, calcByCategory]);
  const expenseByCategory = useMemo(() => calcByCategory(currentData, "expense"), [currentData, calcByCategory]);
  const prevIncomeByCategory = useMemo(() => calcByCategory(prevData, "income"), [prevData, calcByCategory]);
  const prevExpenseByCategory = useMemo(() => calcByCategory(prevData, "expense"), [prevData, calcByCategory]);

  const allCategories = useMemo(() => {
    const set = new Set();
    currentData.forEach(f => set.add(f.category));
    return ["Semua", ...set];
  }, [currentData]);

  // filtered transaction list
  const filteredTransactions = useMemo(() => {
    let data = currentData;
    if (finView !== "all") data = data.filter(f => f.type === finView);
    if (finCategory !== "Semua") data = data.filter(f => f.category === finCategory);
    return data;
  }, [currentData, finView, finCategory]);

  // percentage change helper
  const pctChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const incomeColors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
  const expenseColors = ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"];

  // ── Handlers
  const addFinance = () => {
    if (!finForm.category || !finForm.amount) return;
    setFinance(prev => [{
      id: Date.now(), date: finForm.date, type: finForm.type,
      category: finForm.category, amount: Number(finForm.amount),
      desc: finForm.desc, verified: false,
    }, ...prev]);
    setFinForm({ type: "income", category: "", amount: "", desc: "", date: "2026-04-11" });
    setShowModal(null);
  };

  const addEvent = () => {
    if (!eventForm.title || !eventForm.date) return;
    setEvents(prev => [{
      id: Date.now(), ...eventForm, status: "upcoming",
    }, ...prev]);
    setEventForm({ title: "", date: "", time: "", speaker: "", type: "kajian" });
    setShowModal(null);
  };

  const addInventory = () => {
    if (!invForm.name || !invForm.qty) return;
    setInventory(prev => [{
      id: Date.now(), name: invForm.name, qty: Number(invForm.qty),
      condition: invForm.condition, lastCheck: "2026-04-11",
      area: invForm.area, nextMaint: "",
    }, ...prev]);
    setInvForm({ name: "", qty: "", condition: "Baik", area: "Ruang Utama" });
    setShowModal(null);
  };

  const addTicket = () => {
    if (!ticketForm.item || !ticketForm.issue) return;
    setTickets(prev => [{
      id: Date.now(), item: ticketForm.item, area: ticketForm.area,
      issue: ticketForm.issue, priority: ticketForm.priority,
      status: "baru", reportedBy: ticketForm.reportedBy || "Anonim",
      reportedDate: "2026-04-11", resolvedDate: "", notes: "",
    }, ...prev]);
    setTicketForm({ item: "", area: "Ruang Utama", issue: "", priority: "sedang", reportedBy: "" });
    setShowModal(null);
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, status: newStatus, resolvedDate: newStatus === "selesai" ? "2026-04-11" : t.resolvedDate } : t
    ));
  };

  const addJamaah = () => {
    if (!jamaahForm.label || !jamaahForm.kondisi) return;
    setJamaah(prev => [{
      id: Date.now(), week: `2026-W${prev.length + 4}`, label: jamaahForm.label,
      kondisi: jamaahForm.kondisi, catatan: jamaahForm.catatan, by: "Pengurus",
    }, ...prev]);
    setJamaahForm({ label: "", kondisi: "normal", catatan: "" });
    setShowModal(null);
  };

  const addDonatur = () => {
    if (!donaturForm.name || !donaturForm.amount) return;
    setDonatur(prev => [{
      id: Date.now(), name: donaturForm.name, phone: donaturForm.phone,
      type: donaturForm.type, amount: Number(donaturForm.amount),
      frequency: donaturForm.frequency, since: "2026-04",
      lastDonation: "2026-04-11", totalLifetime: Number(donaturForm.amount),
      notes: donaturForm.notes, active: true,
    }, ...prev]);
    setDonaturForm({ name: "", phone: "", type: "rutin", amount: "", frequency: "Bulanan", notes: "" });
    setShowModal(null);
  };

  const toggleDonaturActive = (id) => {
    setDonatur(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const addBooking = () => {
    if (!bookingForm.client || !bookingForm.date || !bookingForm.purpose) return;
    const unit = usahaUnits.find(u => u.id === Number(bookingForm.unitId));
    setBookings(prev => [{
      id: Date.now(), unitId: Number(bookingForm.unitId),
      unitName: unit?.name || "", client: bookingForm.client,
      phone: bookingForm.phone, date: bookingForm.date, endDate: bookingForm.date,
      purpose: bookingForm.purpose,
      amount: Number(bookingForm.amount) || unit?.ratePerDay || 0,
      status: "pending", notes: bookingForm.notes,
    }, ...prev]);
    setBookingForm({ unitId: 1, client: "", phone: "", date: "", purpose: "", amount: "", notes: "" });
    setShowModal(null);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const eventTypeColors = {
    kajian: "#8b5cf6", sholat: "#10b981", pendidikan: "#3b82f6",
    organisasi: "#f59e0b", operasional: "#ef4444",
  };

  // ── Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "finance", label: "Keuangan", icon: "finance" },
    { id: "usaha", label: "Usaha Masjid", icon: "shop" },
    { id: "events", label: "Kegiatan", icon: "calendar" },
    { id: "inventory", label: "Sarana & Prasarana", icon: "inventory" },
    { id: "donatur", label: "Donatur", icon: "heart" },
    { id: "dakwah", label: "Dakwah & Sosial", icon: "map" },
    { id: "jamaah", label: "Jamaah", icon: "jamaah" },
  ];

  // ═══ PAGES ═══
  const renderDashboard = () => (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>
          Assalamu'alaikum 🕌
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4, fontFamily: "var(--font-body)" }}>
          Ringkasan pengelolaan masjid — Jumat, 11 April 2026
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon="arrow_up" label="Total Pemasukan" value={`Rp ${fmt(totalIncome)}`} sub="Bulan ini" color="#10b981" />
        <StatCard icon="arrow_down" label="Total Pengeluaran" value={`Rp ${fmt(totalExpense)}`} sub="Bulan ini" color="#f59e0b" />
        <StatCard icon="finance" label="Saldo Kas" value={`Rp ${fmt(balance)}`} sub={balance > 0 ? "Surplus" : "Defisit"} color={balance > 0 ? "#3b82f6" : "#ef4444"} />
        <StatCard icon="heart" label="Donatur Rutin" value={`${donatur.filter(d => d.active && d.type === "rutin").length} Orang`} sub={`Rp ${fmt(donatur.filter(d => d.active && d.type === "rutin").reduce((s,d) => s + d.amount, 0))}/bln`} color="#ec4899" />
        <StatCard icon="shop" label="Usaha Masjid" value={`Rp ${fmt(usahaTx.filter(t => t.type === "pendapatan" && t.date.startsWith("2026-04")).reduce((s,t) => s + t.amount, 0) - usahaTx.filter(t => t.type === "biaya" && t.date.startsWith("2026-04")).reduce((s,t) => s + t.amount, 0))}`} sub={`${usahaUnits.filter(u => u.status === "aktif").length} unit aktif`} color="#8b5cf6" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 24 }}>
        {/* Income Donut */}
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Komposisi Pemasukan</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart segments={Object.entries(incomeByCategory).map(([k, v], i) => ({ label: k, value: v, color: incomeColors[i % incomeColors.length] }))} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(incomeByCategory).map(([k, v], i) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: incomeColors[i % incomeColors.length] }} />
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Donut */}
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Komposisi Pengeluaran</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart segments={Object.entries(expenseByCategory).map(([k, v], i) => ({ label: k, value: v, color: expenseColors[i % expenseColors.length] }))} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(expenseByCategory).map(([k, v], i) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: expenseColors[i % expenseColors.length] }} />
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events + Recent Transactions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 14px" }}>Kegiatan Mendatang</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.slice(0, 4).map(ev => (
              <div key={ev.id} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: eventTypeColors[ev.type] || "#888",
                  boxShadow: `0 0 8px ${eventTypeColors[ev.type] || "#888"}60`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{fmtDate(ev.date)} • {ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 14px" }}>Transaksi Terakhir</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {finance.slice(0, 5).map(f => (
              <div key={f.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: f.type === "income" ? "#10b98118" : "#f59e0b18",
                    color: f.type === "income" ? "#10b981" : "#f59e0b",
                  }}>
                    <Icon name={f.type === "income" ? "arrow_up" : "arrow_down"} size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{f.category}</div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{fmtDate(f.date)}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)",
                  color: f.type === "income" ? "#10b981" : "#f59e0b",
                }}>
                  {f.type === "income" ? "+" : "-"}Rp {fmt(f.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => {
    const incPct = pctChange(totalIncome, prevIncome);
    const expPct = pctChange(totalExpense, prevExpense);
    const ChgBadge = ({ val }) => {
      const up = val >= 0;
      return (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
          background: up ? "#10b98118" : "#ef444418", color: up ? "#10b981" : "#ef4444",
          fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 2,
        }}>
          {up ? "▲" : "▼"} {Math.abs(val)}%
        </span>
      );
    };

    // Horizontal bar for category breakdown
    const CategoryBar = ({ data, prevDataMap, colors, type }) => {
      const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
      const total = entries.reduce((s, [, v]) => s + v, 0);
      if (entries.length === 0) return <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", padding: 12 }}>Belum ada data</div>;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {entries.map(([cat, val], i) => {
            const pv = prevDataMap[cat] || 0;
            const chg = pctChange(val, pv);
            return (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: colors[i % colors.length] }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{cat}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                      Rp {fmt(val)}
                    </span>
                    {showComparison && <ChgBadge val={type === "expense" ? -chg : chg} />}
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--bg)", overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${(val / total) * 100}%`,
                    background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}aa)`,
                    transition: "width 0.6s ease",
                  }} />
                  {showComparison && pv > 0 && (
                    <div style={{
                      position: "absolute", top: 0, height: "100%", width: 2,
                      background: "var(--text-secondary)", opacity: 0.5,
                      left: `${(pv / total) * 100}%`,
                    }} />
                  )}
                </div>
                {showComparison && (
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                    {periodLabel(prevPeriod)}: Rp {fmt(pv)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Keuangan Masjid</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Kelola pemasukan & pengeluaran</p>
          </div>
          <Btn onClick={() => setShowModal("finance")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Tambah Transaksi
          </Btn>
        </div>

        {/* Period selector + comparison toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, background: "var(--card-bg)",
            borderRadius: 12, padding: "6px 10px", border: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Periode:</span>
            <select value={finPeriod} onChange={e => { setFinPeriod(e.target.value); setFinCategory("Semua"); }} style={{
              background: "transparent", border: "none", color: "var(--text-primary)",
              fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer", outline: "none",
            }}>
              {availablePeriods.map(p => <option key={p} value={p}>{periodLabel(p)}</option>)}
            </select>
          </div>
          <button onClick={() => setShowComparison(v => !v)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12,
            border: showComparison ? "1px solid #8b5cf650" : "1px solid var(--border)",
            background: showComparison ? "#8b5cf615" : "var(--card-bg)",
            color: showComparison ? "#8b5cf6" : "var(--text-secondary)",
            cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)",
            transition: "all 0.2s",
          }}>
            📊 Bandingkan vs {periodLabel(prevPeriod)}
          </button>
        </div>

        {/* Summary Cards with comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div style={{
            background: "var(--card-bg)", borderRadius: 16, padding: "20px 18px",
            border: "1px solid var(--border)", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "#10b981", opacity: 0.07 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#10b98118", color: "#10b981" }}>
                <Icon name="arrow_up" size={18} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Pemasukan</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Rp {fmt(totalIncome)}</div>
            {showComparison && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <ChgBadge val={incPct} />
                <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>vs {periodLabel(prevPeriod)} (Rp {fmt(prevIncome)})</span>
              </div>
            )}
          </div>

          <div style={{
            background: "var(--card-bg)", borderRadius: 16, padding: "20px 18px",
            border: "1px solid var(--border)", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "#f59e0b", opacity: 0.07 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#f59e0b18", color: "#f59e0b" }}>
                <Icon name="arrow_down" size={18} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Pengeluaran</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Rp {fmt(totalExpense)}</div>
            {showComparison && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <ChgBadge val={-expPct} />
                <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>vs {periodLabel(prevPeriod)} (Rp {fmt(prevExpense)})</span>
              </div>
            )}
          </div>

          <div style={{
            background: "var(--card-bg)", borderRadius: 16, padding: "20px 18px",
            border: "1px solid var(--border)", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "#3b82f6", opacity: 0.07 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#3b82f618", color: "#3b82f6" }}>
                <Icon name="finance" size={18} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Saldo</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: balance >= 0 ? "#10b981" : "#ef4444", fontFamily: "var(--font-display)" }}>Rp {fmt(balance)}</div>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
              {balance >= 0 ? "Surplus" : "Defisit"} {periodLabel(finPeriod)}
            </div>
          </div>
        </div>

        {/* Category Breakdown — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>
                Pemasukan per Kategori
              </h4>
            </div>
            <CategoryBar data={incomeByCategory} prevDataMap={prevIncomeByCategory} colors={incomeColors} type="income" />
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#10b981", fontFamily: "var(--font-display)" }}>Rp {fmt(totalIncome)}</span>
            </div>
          </div>

          <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>
                Pengeluaran per Kategori
              </h4>
            </div>
            <CategoryBar data={expenseByCategory} prevDataMap={prevExpenseByCategory} colors={expenseColors} type="expense" />
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "var(--bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#f59e0b", fontFamily: "var(--font-display)" }}>Rp {fmt(totalExpense)}</span>
            </div>
          </div>
        </div>

        {/* Filter tabs + Category dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "Semua" },
            { id: "income", label: "Pemasukan", color: "#10b981" },
            { id: "expense", label: "Pengeluaran", color: "#f59e0b" },
          ].map(t => (
            <button key={t.id} onClick={() => { setFinView(t.id); setFinCategory("Semua"); }} style={{
              padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: finView === t.id ? 700 : 500, fontFamily: "var(--font-body)",
              background: finView === t.id ? (t.color ? `${t.color}20` : "var(--accent)") : "var(--card-bg)",
              color: finView === t.id ? (t.color || "#fff") : "var(--text-secondary)",
              transition: "all 0.2s",
              border: `1px solid ${finView === t.id ? (t.color ? `${t.color}40` : "var(--accent)") : "var(--border)"}`,
            }}>
              {t.label}
            </button>
          ))}
          <select value={finCategory} onChange={e => setFinCategory(e.target.value)} style={{
            padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--card-bg)", color: "var(--text-primary)", fontSize: 12,
            fontFamily: "var(--font-body)", cursor: "pointer", outline: "none",
          }}>
            {allCategories.map(c => <option key={c}>{c}</option>)}
          </select>
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            {filteredTransactions.length} transaksi
          </span>
        </div>

        {/* Transaction List */}
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>
            Riwayat Transaksi — {periodLabel(finPeriod)}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredTransactions.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                Tidak ada transaksi untuk filter ini
              </div>
            )}
            {filteredTransactions.map(f => (
              <div key={f.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 14, background: "var(--bg)", border: "1px solid var(--border)",
                flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: f.type === "income" ? "#10b98115" : "#f59e0b15",
                    color: f.type === "income" ? "#10b981" : "#f59e0b",
                  }}>
                    <Icon name={f.type === "income" ? "arrow_up" : "arrow_down"} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{f.category}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{f.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)",
                      color: f.type === "income" ? "#10b981" : "#f59e0b",
                    }}>
                      {f.type === "income" ? "+" : "-"}Rp {fmt(f.amount)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{fmtDate(f.date)}</div>
                  </div>
                  {f.verified && (
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "#10b98120", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check" size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Kegiatan Masjid</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Jadwal kegiatan & kajian</p>
        </div>
        <Btn onClick={() => setShowModal("event")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={16} /> Tambah Kegiatan
        </Btn>
      </div>

      {/* Event Type Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(eventTypeColors).map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: `${c}15`, border: `1px solid ${c}30` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            <span style={{ fontSize: 11, color: c, fontWeight: 600, textTransform: "capitalize", fontFamily: "var(--font-body)" }}>{k}</span>
          </div>
        ))}
      </div>

      {/* Event Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
        {events.map(ev => {
          const c = eventTypeColors[ev.type] || "#888";
          return (
            <div key={ev.id} style={{
              background: "var(--card-bg)", borderRadius: 16, padding: 20,
              border: `1px solid var(--border)`, borderLeft: `4px solid ${c}`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, borderRadius: "50%", background: c, opacity: 0.06 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                  color: c, fontFamily: "var(--font-body)",
                }}>{ev.type}</span>
                {ev.status === "today" && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: "#10b98120", color: "#10b981", fontFamily: "var(--font-body)",
                  }}>Hari Ini</span>
                )}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px", fontFamily: "var(--font-display)" }}>{ev.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                <span>📅 {fmtDate(ev.date)} • {ev.time}</span>
                <span>🎤 {ev.speaker}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInventory = () => {
    const priorityConfig = {
      tinggi: { color: "#ef4444", label: "Tinggi", emoji: "🔴" },
      sedang: { color: "#f59e0b", label: "Sedang", emoji: "🟡" },
      rendah: { color: "#3b82f6", label: "Rendah", emoji: "🔵" },
    };
    const statusConfig = {
      baru: { color: "#ef4444", label: "Baru", bg: "#ef444418" },
      proses: { color: "#f59e0b", label: "Dalam Proses", bg: "#f59e0b18" },
      selesai: { color: "#10b981", label: "Selesai", bg: "#10b98118" },
    };

    const filteredInv = invAreaFilter === "Semua" ? inventory : inventory.filter(i => i.area === invAreaFilter);
    const openTickets = tickets.filter(t => t.status !== "selesai");
    const maintSchedule = inventory.filter(i => i.nextMaint);

    // stat counts
    const condBaik = inventory.filter(i => i.condition === "Baik").length;
    const condIssue = inventory.length - condBaik;

    return (
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Sarana & Prasarana</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Inventaris, pemeliharaan & laporan kerusakan</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={() => setShowModal("ticket")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              🛠️ Laporkan Kerusakan
            </Btn>
            <Btn onClick={() => setShowModal("inventory")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="plus" size={16} /> Tambah Item
            </Btn>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard icon="inventory" label="Total Aset" value={`${inventory.length} Item`} color="#3b82f6" />
          <StatCard icon="check" label="Kondisi Baik" value={`${condBaik} Item`} color="#10b981" />
          <StatCard icon="close" label="Perlu Perhatian" value={`${condIssue} Item`} color="#f59e0b" />
          <StatCard icon="star" label="Laporan Aktif" value={`${openTickets.length} Tiket`} sub={openTickets.filter(t => t.priority === "tinggi").length > 0 ? `${openTickets.filter(t => t.priority === "tinggi").length} prioritas tinggi` : ""} color="#ef4444" />
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {[
            { id: "inventaris", label: "📦 Inventaris", count: inventory.length },
            { id: "laporan", label: "🛠️ Laporan Kerusakan", count: openTickets.length },
            { id: "jadwal", label: "📅 Jadwal Perawatan", count: maintSchedule.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setInvTab(tab.id)} style={{
              padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: invTab === tab.id ? 700 : 500, fontFamily: "var(--font-body)",
              background: invTab === tab.id ? "var(--accent)" : "var(--card-bg)",
              color: invTab === tab.id ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${invTab === tab.id ? "var(--accent)" : "var(--border)"}`,
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
            }}>
              {tab.label}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8,
                background: invTab === tab.id ? "rgba(255,255,255,0.2)" : "var(--bg)",
                color: invTab === tab.id ? "#fff" : "var(--text-secondary)",
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── TAB: Inventaris ── */}
        {invTab === "inventaris" && (
          <div>
            {/* Area Filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {AREAS.map(a => (
                <button key={a} onClick={() => setInvAreaFilter(a)} style={{
                  padding: "6px 14px", borderRadius: 20, border: `1px solid ${invAreaFilter === a ? "var(--accent)" : "var(--border)"}`,
                  background: invAreaFilter === a ? "var(--accent)" : "transparent",
                  color: invAreaFilter === a ? "#fff" : "var(--text-secondary)",
                  fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                  {a}
                </button>
              ))}
            </div>

            <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1.2fr 1fr",
                padding: "14px 20px", borderBottom: "1px solid var(--border)",
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                color: "var(--text-secondary)", fontFamily: "var(--font-body)",
              }}>
                <span>Nama</span><span>Jml</span><span>Area</span><span>Kondisi</span><span>Cek Terakhir</span>
              </div>
              {filteredInv.map((item, idx) => {
                const condColor = item.condition === "Baik" ? "#10b981" : item.condition.includes("Rusak") || item.condition.includes("Mati") ? "#ef4444" : "#f59e0b";
                return (
                  <div key={item.id} style={{
                    display: "grid", gridTemplateColumns: "2fr 0.8fr 1fr 1.2fr 1fr",
                    padding: "12px 20px", alignItems: "center",
                    borderBottom: idx < filteredInv.length - 1 ? "1px solid var(--border)" : "none",
                    fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-body)",
                  }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span>{fmt(item.qty)}</span>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{item.area}</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                      background: `${condColor}15`, color: condColor, width: "fit-content",
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: condColor }} />
                      {item.condition}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{fmtDate(item.lastCheck)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: Laporan Kerusakan ── */}
        {invTab === "laporan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tickets.map(t => {
              const pr = priorityConfig[t.priority];
              const st = statusConfig[t.status];
              return (
                <div key={t.id} style={{
                  background: "var(--card-bg)", borderRadius: 16, padding: 20,
                  border: `1px solid var(--border)`, borderLeft: `4px solid ${pr.color}`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: -12, right: -12, width: 50, height: 50, borderRadius: "50%", background: pr.color, opacity: 0.06 }} />
                  {/* Top row: priority + status + actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: pr.color, fontFamily: "var(--font-body)" }}>
                        {pr.emoji} {pr.label}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: st.bg, color: st.color, fontFamily: "var(--font-body)",
                      }}>{st.label}</span>
                    </div>
                    {t.status !== "selesai" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {t.status === "baru" && (
                          <button onClick={() => updateTicketStatus(t.id, "proses")} style={{
                            padding: "5px 12px", borderRadius: 8, border: "1px solid #f59e0b40",
                            background: "#f59e0b15", color: "#f59e0b", fontSize: 10, fontWeight: 700,
                            cursor: "pointer", fontFamily: "var(--font-body)",
                          }}>Proses</button>
                        )}
                        <button onClick={() => updateTicketStatus(t.id, "selesai")} style={{
                          padding: "5px 12px", borderRadius: 8, border: "1px solid #10b98140",
                          background: "#10b98115", color: "#10b981", fontSize: 10, fontWeight: 700,
                          cursor: "pointer", fontFamily: "var(--font-body)",
                        }}>Selesai ✓</button>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>{t.item}</h4>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 10, lineHeight: 1.5 }}>{t.issue}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    <span>📍 {t.area}</span>
                    <span>👤 {t.reportedBy}</span>
                    <span>📅 {fmtDate(t.reportedDate)}</span>
                    {t.resolvedDate && <span>✅ Selesai {fmtDate(t.resolvedDate)}</span>}
                  </div>
                  {t.notes && (
                    <div style={{
                      marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "var(--bg)",
                      fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.5,
                      borderLeft: "3px solid var(--border)",
                    }}>
                      💬 {t.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: Jadwal Perawatan ── */}
        {invTab === "jadwal" && (
          <div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 16 }}>
              Daftar aset yang memiliki jadwal perawatan berkala.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {maintSchedule.length === 0 && (
                <div style={{ padding: 24, textAlign: "center", fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)" }}>
                  Belum ada jadwal perawatan
                </div>
              )}
              {maintSchedule.sort((a, b) => a.nextMaint.localeCompare(b.nextMaint)).map(item => {
                const daysLeft = Math.ceil((new Date(item.nextMaint) - new Date("2026-04-11")) / 86400000);
                const urgency = daysLeft <= 7 ? "#ef4444" : daysLeft <= 30 ? "#f59e0b" : "#10b981";
                return (
                  <div key={item.id} style={{
                    background: "var(--card-bg)", borderRadius: 14, padding: "16px 20px",
                    border: "1px solid var(--border)", display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        background: `${urgency}15`, color: urgency,
                      }}>
                        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: 1 }}>{daysLeft}</span>
                        <span style={{ fontSize: 8, fontWeight: 600, fontFamily: "var(--font-body)" }}>hari</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>📍 {item.area} • Terakhir: {fmtDate(item.lastCheck)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: urgency, fontFamily: "var(--font-display)" }}>
                        {fmtDate(item.nextMaint)}
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                        background: `${urgency}18`, color: urgency, fontFamily: "var(--font-body)",
                      }}>
                        {daysLeft <= 7 ? "SEGERA" : daysLeft <= 30 ? "Bulan Ini" : "Terjadwal"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUsaha = () => {
    // computations
    const totalPendapatan = usahaTx.filter(t => t.type === "pendapatan" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
    const totalBiaya = usahaTx.filter(t => t.type === "biaya" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
    const labaKotor = totalPendapatan - totalBiaya;
    const prevPendapatan = usahaTx.filter(t => t.type === "pendapatan" && t.date.startsWith("2026-03")).reduce((s, t) => s + t.amount, 0);
    const prevBiaya = usahaTx.filter(t => t.type === "biaya" && t.date.startsWith("2026-03")).reduce((s, t) => s + t.amount, 0);
    const activeUnits = usahaUnits.filter(u => u.status === "aktif").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;

    // per-unit P&L
    const unitPnL = usahaUnits.filter(u => u.status === "aktif").map(u => {
      const rev = usahaTx.filter(t => t.unitId === u.id && t.type === "pendapatan" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
      const cost = usahaTx.filter(t => t.unitId === u.id && t.type === "biaya" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
      return { ...u, revenue: rev, cost, profit: rev - cost };
    }).sort((a, b) => b.profit - a.profit);

    // per-category
    const catPnL = {};
    USAHA_CATEGORIES.forEach(c => {
      const rev = usahaTx.filter(t => t.category === c.value && t.type === "pendapatan" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
      const cost = usahaTx.filter(t => t.category === c.value && t.type === "biaya" && t.date.startsWith("2026-04")).reduce((s, t) => s + t.amount, 0);
      catPnL[c.value] = { rev, cost, profit: rev - cost };
    });

    const filteredUnits = usahaCatFilter === "semua" ? usahaUnits : usahaUnits.filter(u => u.category === usahaCatFilter);

    const bookingStatusConfig = {
      confirmed: { color: "#10b981", label: "Dikonfirmasi", bg: "#10b98118" },
      pending: { color: "#f59e0b", label: "Menunggu", bg: "#f59e0b18" },
      cancelled: { color: "#ef4444", label: "Dibatalkan", bg: "#ef444418" },
      done: { color: "#6b7a8d", label: "Selesai", bg: "#6b7a8d18" },
    };

    return (
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Usaha Masjid</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Kelola unit usaha sektor riil & pendapatan masjid</p>
          </div>
          <Btn onClick={() => setShowModal("booking")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Booking / Sewa Baru
          </Btn>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard icon="shop" label="Unit Usaha Aktif" value={`${activeUnits}`} sub={`dari ${usahaUnits.length} unit`} color="#8b5cf6" />
          <StatCard icon="arrow_up" label="Pendapatan Apr" value={`Rp ${fmt(totalPendapatan)}`} sub={`Mar: Rp ${fmt(prevPendapatan)}`} color="#10b981" />
          <StatCard icon="arrow_down" label="Biaya Operasional" value={`Rp ${fmt(totalBiaya)}`} sub={`Mar: Rp ${fmt(prevBiaya)}`} color="#f59e0b" />
          <StatCard icon="finance" label="Laba Kotor Apr" value={`Rp ${fmt(labaKotor)}`} sub={labaKotor >= 0 ? "Surplus" : "Defisit"} color={labaKotor >= 0 ? "#10b981" : "#ef4444"} />
          <StatCard icon="calendar" label="Booking Pending" value={`${pendingBookings}`} sub="Perlu konfirmasi" color={pendingBookings > 0 ? "#f59e0b" : "#10b981"} />
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { id: "ringkasan", label: "📊 Laba Rugi" },
            { id: "units", label: "🏪 Unit Usaha" },
            { id: "booking", label: "📅 Booking & Sewa" },
            { id: "transaksi", label: "📝 Transaksi" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setUsahaTab(tab.id)} style={{
              padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: usahaTab === tab.id ? 700 : 500, fontFamily: "var(--font-body)",
              background: usahaTab === tab.id ? "var(--accent)" : "var(--card-bg)",
              color: usahaTab === tab.id ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${usahaTab === tab.id ? "var(--accent)" : "var(--border)"}`,
              transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Laba Rugi ── */}
        {usahaTab === "ringkasan" && (
          <div>
            {/* Per Category P&L */}
            <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)", marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Laba Rugi per Kategori — April 2026</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {USAHA_CATEGORIES.map(c => {
                  const d = catPnL[c.value];
                  if (!d || d.rev === 0) return null;
                  return (
                    <div key={c.value} style={{ padding: "14px 16px", borderRadius: 14, background: "var(--bg)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                          {c.emoji} {c.label}
                        </span>
                        <span style={{
                          fontSize: 14, fontWeight: 800, fontFamily: "var(--font-display)",
                          color: d.profit >= 0 ? "#10b981" : "#ef4444",
                        }}>
                          {d.profit >= 0 ? "+" : ""}Rp {fmt(d.profit)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 8, height: 8, borderRadius: 4, overflow: "hidden", background: "var(--card-bg)" }}>
                        <div style={{ height: "100%", borderRadius: 4, flex: d.rev, background: "#10b981", transition: "flex 0.5s" }} />
                        <div style={{ height: "100%", borderRadius: 4, flex: d.cost, background: "#f59e0b", transition: "flex 0.5s" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, fontFamily: "var(--font-body)" }}>
                        <span style={{ color: "#10b981" }}>Pendapatan: Rp {fmt(d.rev)}</span>
                        <span style={{ color: "#f59e0b" }}>Biaya: Rp {fmt(d.cost)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Grand Total */}
              <div style={{
                marginTop: 16, padding: "14px 16px", borderRadius: 14,
                background: labaKotor >= 0 ? "#10b98110" : "#ef444410",
                border: `1px solid ${labaKotor >= 0 ? "#10b98130" : "#ef444430"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Total Laba Kotor</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: labaKotor >= 0 ? "#10b981" : "#ef4444", fontFamily: "var(--font-display)" }}>
                  Rp {fmt(labaKotor)}
                </span>
              </div>
            </div>

            {/* Per Unit ranking */}
            <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>🏆 Ranking Unit Usaha (Laba Tertinggi)</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {unitPnL.map((u, i) => {
                  const cat = USAHA_CATEGORIES.find(c => c.value === u.category);
                  const margin = u.revenue > 0 ? Math.round((u.profit / u.revenue) * 100) : 0;
                  return (
                    <div key={u.id} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                      borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
                    }}>
                      <span style={{ fontSize: 18, minWidth: 28, textAlign: "center" }}>
                        {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i+1}`}
                      </span>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{u.name}</div>
                        <div style={{ fontSize: 10, color: cat?.color || "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{cat?.emoji} {cat?.label}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: u.profit >= 0 ? "#10b981" : "#ef4444", fontFamily: "var(--font-display)" }}>
                          Rp {fmt(u.profit)}
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                          margin {margin}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Unit Usaha ── */}
        {usahaTab === "units" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              <button onClick={() => setUsahaCatFilter("semua")} style={{
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${usahaCatFilter === "semua" ? "var(--accent)" : "var(--border)"}`,
                background: usahaCatFilter === "semua" ? "var(--accent)" : "transparent",
                color: usahaCatFilter === "semua" ? "#fff" : "var(--text-secondary)",
                fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer",
              }}>Semua</button>
              {USAHA_CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setUsahaCatFilter(c.value)} style={{
                  padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                  border: `1px solid ${usahaCatFilter === c.value ? `${c.color}50` : "var(--border)"}`,
                  background: usahaCatFilter === c.value ? `${c.color}18` : "transparent",
                  color: usahaCatFilter === c.value ? c.color : "var(--text-secondary)",
                  fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                }}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
              {filteredUnits.map(u => {
                const cat = USAHA_CATEGORIES.find(c => c.value === u.category);
                const pnl = unitPnL.find(p => p.id === u.id);
                return (
                  <div key={u.id} style={{
                    background: "var(--card-bg)", borderRadius: 16, padding: 20,
                    border: `1px solid var(--border)`, borderLeft: `4px solid ${cat?.color || "#888"}`,
                    position: "relative", overflow: "hidden", opacity: u.status === "nonaktif" ? 0.6 : 1,
                  }}>
                    <div style={{ position: "absolute", top: -12, right: -12, width: 50, height: 50, borderRadius: "50%", background: cat?.color, opacity: 0.06 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cat?.color, fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {cat?.emoji} {cat?.label}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 10,
                        background: u.status === "aktif" ? "#10b98118" : "#ef444418",
                        color: u.status === "aktif" ? "#10b981" : "#ef4444",
                        fontFamily: "var(--font-body)", textTransform: "capitalize",
                      }}>{u.status}</span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px", fontFamily: "var(--font-display)" }}>{u.name}</h4>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.5, marginBottom: 10 }}>{u.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 10 }}>
                      <span>📍 {u.location}</span>
                      <span>📐 {u.capacity}</span>
                      <span>👤 {u.pic}</span>
                      {u.ratePerDay > 0 && <span>💰 Rp {fmt(u.ratePerDay)} {u.rateLabel}</span>}
                    </div>
                    {pnl && pnl.revenue > 0 && (
                      <div style={{ padding: "8px 12px", borderRadius: 10, background: "var(--bg)", display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-body)" }}>
                        <span style={{ color: "#10b981" }}>📈 Rp {fmt(pnl.revenue)}</span>
                        <span style={{ color: "#f59e0b" }}>📉 Rp {fmt(pnl.cost)}</span>
                        <span style={{ color: pnl.profit >= 0 ? "#10b981" : "#ef4444", fontWeight: 700 }}>
                          = Rp {fmt(pnl.profit)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB: Booking & Sewa ── */}
        {usahaTab === "booking" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-secondary)", fontSize: 13, fontFamily: "var(--font-body)", background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)" }}>
                Belum ada booking
              </div>
            )}
            {bookings.map(b => {
              const st = bookingStatusConfig[b.status];
              const days = Math.ceil((new Date(b.date) - new Date("2026-04-11")) / 86400000);
              return (
                <div key={b.id} style={{
                  background: "var(--card-bg)", borderRadius: 16, padding: 20,
                  border: "1px solid var(--border)", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10,
                          background: st.bg, color: st.color, fontFamily: "var(--font-body)",
                        }}>{st.label}</span>
                        {days > 0 && days <= 7 && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, background: "#f59e0b18", color: "#f59e0b", fontFamily: "var(--font-body)" }}>
                            {days} hari lagi
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>{b.purpose}</h4>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 4 }}>{b.unitName}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                        <span>👤 {b.client}</span>
                        {b.phone && <span>📱 {b.phone}</span>}
                        <span>📅 {fmtDate(b.date)}</span>
                      </div>
                      {b.notes && <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontStyle: "italic", marginTop: 4 }}>💬 {b.notes}</div>}
                    </div>
                    <div style={{ textAlign: "right", minWidth: 130 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#8b5cf6", fontFamily: "var(--font-display)" }}>Rp {fmt(b.amount)}</div>
                      {b.status === "pending" && (
                        <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                          <button onClick={() => updateBookingStatus(b.id, "confirmed")} style={{
                            padding: "6px 14px", borderRadius: 8, border: "1px solid #10b98140",
                            background: "#10b98115", color: "#10b981", fontSize: 11, fontWeight: 700,
                            cursor: "pointer", fontFamily: "var(--font-body)",
                          }}>✓ Konfirmasi</button>
                          <button onClick={() => updateBookingStatus(b.id, "cancelled")} style={{
                            padding: "6px 14px", borderRadius: 8, border: "1px solid #ef444440",
                            background: "#ef444415", color: "#ef4444", fontSize: 11, fontWeight: 700,
                            cursor: "pointer", fontFamily: "var(--font-body)",
                          }}>✕ Tolak</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: Transaksi ── */}
        {usahaTab === "transaksi" && (
          <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Transaksi Usaha — April 2026</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {usahaTx.filter(t => t.date.startsWith("2026-04")).map(t => {
                const unit = usahaUnits.find(u => u.id === t.unitId);
                const cat = USAHA_CATEGORIES.find(c => c.value === t.category);
                return (
                  <div key={t.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
                    flexWrap: "wrap", gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        background: t.type === "pendapatan" ? "#10b98115" : "#f59e0b15",
                        color: t.type === "pendapatan" ? "#10b981" : "#f59e0b", fontSize: 14,
                      }}>
                        {t.type === "pendapatan" ? "📈" : "📉"}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{t.desc}</div>
                        <div style={{ fontSize: 10, color: cat?.color || "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                          {cat?.emoji} {unit?.name || ""} • {fmtDate(t.date)}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
                      color: t.type === "pendapatan" ? "#10b981" : "#f59e0b",
                    }}>
                      {t.type === "pendapatan" ? "+" : "-"}Rp {fmt(t.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDonatur = () => {
    const filtered = donatur.filter(d => {
      const matchType = donaturFilter === "semua" || d.type === donaturFilter;
      const matchSearch = donaturSearch === "" || d.name.toLowerCase().includes(donaturSearch.toLowerCase()) || d.phone.includes(donaturSearch);
      return matchType && matchSearch;
    });

    const totalRutinMonthly = donatur.filter(d => d.active && d.type === "rutin").reduce((s, d) => s + d.amount, 0);
    const totalLifetime = donatur.reduce((s, d) => s + d.totalLifetime, 0);
    const activeCount = donatur.filter(d => d.active).length;
    const rutinCount = donatur.filter(d => d.active && d.type === "rutin").length;

    // donation by type for donut
    const byType = {};
    donatur.forEach(d => { byType[d.type] = (byType[d.type] || 0) + d.totalLifetime; });
    const typeColors = {};
    DONATUR_TYPES.forEach(t => { typeColors[t.value] = t.color; });

    // who needs follow-up (last donation > 35 days ago for rutin)
    const needFollowUp = donatur.filter(d => {
      if (!d.active || d.type !== "rutin") return false;
      const days = Math.ceil((new Date("2026-04-11") - new Date(d.lastDonation)) / 86400000);
      return days > 35;
    });

    return (
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Data Donatur</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Kelola donatur rutin, insidentil, wakaf, qurban & Ramadhan</p>
          </div>
          <Btn onClick={() => setShowModal("donatur")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Tambah Donatur
          </Btn>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard icon="heart" label="Total Donatur" value={`${donatur.length}`} sub={`${activeCount} aktif`} color="#ec4899" />
          <StatCard icon="refresh" label="Donatur Rutin" value={`${rutinCount}`} sub={`Rp ${fmt(totalRutinMonthly)} /bulan`} color="#10b981" />
          <StatCard icon="finance" label="Total Terkumpul" value={`Rp ${fmt(totalLifetime)}`} sub="Sepanjang waktu" color="#8b5cf6" />
          <StatCard icon="phone" label="Perlu Follow-up" value={`${needFollowUp.length}`} sub={needFollowUp.length > 0 ? "Belum donasi > 35 hari" : "Semua lancar"} color={needFollowUp.length > 0 ? "#f59e0b" : "#10b981"} />
        </div>

        {/* Donasi by Type — visual */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
          <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Donasi per Jenis</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DONATUR_TYPES.map(t => {
                const val = byType[t.value] || 0;
                const pct = totalLifetime > 0 ? (val / totalLifetime) * 100 : 0;
                const count = donatur.filter(d => d.type === t.value).length;
                return (
                  <div key={t.value}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                        {t.emoji} {t.label} ({count})
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: t.color, fontFamily: "var(--font-display)" }}>Rp {fmt(val)}</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--bg)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, width: `${pct}%`, background: t.color, transition: "width 0.6s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow-up alerts */}
          <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>
              {needFollowUp.length > 0 ? "⚠️ Perlu Follow-up" : "✅ Semua Donatur Lancar"}
            </h4>
            {needFollowUp.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                Semua donatur rutin sudah berdonasi dalam 35 hari terakhir. Alhamdulillah!
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {needFollowUp.map(d => {
                const days = Math.ceil((new Date("2026-04-11") - new Date(d.lastDonation)) / 86400000);
                return (
                  <div key={d.id} style={{
                    padding: "12px 14px", borderRadius: 12, background: "#f59e0b08",
                    border: "1px solid #f59e0b20", display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Terakhir: {fmtDate(d.lastDonation)} ({days} hari lalu)</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10, background: "#f59e0b18", color: "#f59e0b", fontFamily: "var(--font-body)" }}>
                      Rp {fmt(d.amount)}/bln
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Top Donors */}
            {needFollowUp.length < 3 && (
              <div style={{ marginTop: needFollowUp.length > 0 ? 20 : 0 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 10px" }}>🏆 Top Donatur</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...donatur].sort((a, b) => b.totalLifetime - a.totalLifetime).slice(0, 3).map((d, i) => (
                    <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontFamily: "var(--font-body)" }}>
                      <span style={{ fontSize: 16 }}>{["🥇","🥈","🥉"][i]}</span>
                      <span style={{ flex: 1, fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                      <span style={{ fontWeight: 700, color: "#8b5cf6", fontFamily: "var(--font-display)" }}>Rp {fmt(d.totalLifetime)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters + Search */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => setDonaturFilter("semua")} style={{
            padding: "7px 14px", borderRadius: 10, border: `1px solid ${donaturFilter === "semua" ? "var(--accent)" : "var(--border)"}`,
            background: donaturFilter === "semua" ? "var(--accent)" : "var(--card-bg)",
            color: donaturFilter === "semua" ? "#fff" : "var(--text-secondary)",
            fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer",
          }}>Semua</button>
          {DONATUR_TYPES.map(t => (
            <button key={t.value} onClick={() => setDonaturFilter(t.value)} style={{
              padding: "7px 14px", borderRadius: 10, cursor: "pointer",
              border: `1px solid ${donaturFilter === t.value ? `${t.color}50` : "var(--border)"}`,
              background: donaturFilter === t.value ? `${t.color}18` : "var(--card-bg)",
              color: donaturFilter === t.value ? t.color : "var(--text-secondary)",
              fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
            }}>
              {t.emoji} {t.label}
            </button>
          ))}
          <input value={donaturSearch} onChange={e => setDonaturSearch(e.target.value)} placeholder="🔍 Cari nama / HP..."
            style={{
              padding: "7px 12px", borderRadius: 10, border: "1px solid var(--border)",
              background: "var(--card-bg)", color: "var(--text-primary)", fontSize: 12,
              fontFamily: "var(--font-body)", outline: "none", minWidth: 160, boxSizing: "border-box",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{filtered.length} donatur</span>
        </div>

        {/* Donatur List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(d => {
            const typeConf = DONATUR_TYPES.find(t => t.value === d.type);
            const days = Math.ceil((new Date("2026-04-11") - new Date(d.lastDonation)) / 86400000);
            return (
              <div key={d.id} style={{
                background: "var(--card-bg)", borderRadius: 16, padding: "18px 20px",
                border: `1px solid var(--border)`, borderLeft: `4px solid ${typeConf.color}`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -12, right: -12, width: 50, height: 50, borderRadius: "50%", background: typeConf.color, opacity: 0.06 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  {/* Left info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{d.name}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                        background: `${typeConf.color}18`, color: typeConf.color, fontFamily: "var(--font-body)",
                      }}>{typeConf.emoji} {typeConf.label}</span>
                      {d.active && d.type === "rutin" && (
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#10b98118", color: "#10b981", fontFamily: "var(--font-body)" }}>Aktif</span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 4 }}>
                      {d.phone && <span>📱 {d.phone}</span>}
                      <span>📅 Sejak {d.since}</span>
                      <span>🕐 Terakhir {fmtDate(d.lastDonation)} ({days} hari)</span>
                      {d.frequency !== "-" && <span>🔄 {d.frequency}</span>}
                    </div>
                    {d.notes && <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontStyle: "italic" }}>💬 {d.notes}</div>}
                  </div>
                  {/* Right amounts */}
                  <div style={{ textAlign: "right", minWidth: 140 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: typeConf.color, fontFamily: "var(--font-display)" }}>
                      Rp {fmt(d.amount)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {d.type === "rutin" ? "per bulan" : "donasi"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 4 }}>
                      Total: <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Rp {fmt(d.totalLifetime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDakwah = () => {
    const statusCounts = { hijau: 0, kuning: 0, merah: 0 };
    const totalKK = petaDakwah.length;
    const totalJiwa = petaDakwah.reduce((s, d) => s + d.members, 0);
    petaDakwah.forEach(d => { statusCounts[d.status]++; });
    const pctHijau = Math.round((statusCounts.hijau / totalKK) * 100);

    const totalBudget = programSosial.reduce((s, p) => s + p.budget, 0);
    const totalDistributed = programSosial.reduce((s, p) => s + p.distributed, 0);
    const infaqPct = infaqNolData.totalMasuk > 0 ? Math.round((infaqNolData.totalKeluar / infaqNolData.totalMasuk) * 100) : 0;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Dakwah & Sosial</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)", maxWidth: 500, lineHeight: 1.5 }}>
              Adopsi konsep Masjid Jogokariyan: Pemetaan · Pelayanan · Pemberdayaan · Infaq Nol Rupiah
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { id: "peta", label: "🗺️ Peta Dakwah" },
            { id: "infaqnol", label: "💰 Infaq Nol Rupiah" },
            { id: "program", label: "🤲 Program Sosial" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setDakwahTab(tab.id)} style={{
              padding: "10px 16px", borderRadius: 12, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: dakwahTab === tab.id ? 700 : 500, fontFamily: "var(--font-body)",
              background: dakwahTab === tab.id ? "var(--accent)" : "var(--card-bg)",
              color: dakwahTab === tab.id ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${dakwahTab === tab.id ? "var(--accent)" : "var(--border)"}`,
              transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Peta Dakwah ── */}
        {dakwahTab === "peta" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 20 }}>
              <StatCard icon="jamaah" label="Total KK Terdata" value={`${totalKK} KK`} sub={`${totalJiwa} jiwa`} color="#3b82f6" />
              {DAKWAH_STATUS.map(s => (
                <div key={s.value} style={{
                  background: "var(--card-bg)", borderRadius: 16, padding: "18px 16px",
                  border: `1px solid ${s.color}25`, position: "relative", overflow: "hidden",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.emoji}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "var(--font-display)" }}>{statusCounts[s.value]}</div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pemetaan bar */}
            <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)", marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 12px" }}>Komposisi Dakwah Kampung</h4>
              <div style={{ display: "flex", gap: 2, height: 24, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                {DAKWAH_STATUS.map(s => (
                  <div key={s.value} style={{ flex: statusCounts[s.value], background: s.color, transition: "flex 0.5s" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, fontFamily: "var(--font-body)" }}>
                {DAKWAH_STATUS.map(s => (
                  <span key={s.value} style={{ color: s.color, fontWeight: 600 }}>
                    {s.emoji} {statusCounts[s.value]} KK ({Math.round((statusCounts[s.value] / totalKK) * 100)}%)
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: pctHijau >= 50 ? "#10b98110" : "#f59e0b10", border: `1px solid ${pctHijau >= 50 ? "#10b98130" : "#f59e0b30"}`, fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                {pctHijau >= 50 ? "✅" : "⚠️"} {pctHijau}% warga sudah aktif berjamaah. Target: 80%+
              </div>
            </div>

            {/* Data per KK */}
            <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 14px" }}>Data Warga per KK</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {petaDakwah.map(d => {
                  const st = DAKWAH_STATUS.find(s => s.value === d.status);
                  return (
                    <div key={d.id} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      borderRadius: 12, background: "var(--bg)", border: `1px solid var(--border)`,
                      borderLeft: `4px solid ${st.color}`, flexWrap: "wrap",
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${st.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{st.emoji}</div>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{d.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>RT {d.rt} • {d.members} jiwa</div>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {DAKWAH_BADGES.map(b => (
                          <span key={b.key} title={b.label} style={{ fontSize: 14, opacity: d.badges.includes(b.key) ? 1 : 0.15 }}>{b.emoji}</span>
                        ))}
                      </div>
                      {d.notes && <div style={{ width: "100%", fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontStyle: "italic", paddingLeft: 44 }}>💬 {d.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Infaq Nol Rupiah ── */}
        {dakwahTab === "infaqnol" && (
          <div>
            {/* Philosophy banner */}
            <div style={{
              background: "linear-gradient(135deg, #10b98115, #05966910)", borderRadius: 16,
              padding: 24, border: "1px solid #10b98130", marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#10b981", fontFamily: "var(--font-display)", margin: "0 0 8px" }}>
                💡 Filosofi Infaq Nol Rupiah
              </h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.7, margin: 0 }}>
                Infaq itu ditunggu pahalanya untuk menjadi amal shalih, bukan disimpan di rekening. Saldo infaq harus segera disalurkan kembali ke jamaah dalam bentuk pelayanan. Semakin cepat tersalurkan, semakin besar kepercayaan jamaah.
              </p>
            </div>

            {/* Infaq gauge */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
              <StatCard icon="arrow_up" label="Infaq Masuk (Apr)" value={`Rp ${fmt(infaqNolData.totalMasuk)}`} color="#10b981" />
              <StatCard icon="arrow_down" label="Tersalurkan" value={`Rp ${fmt(infaqNolData.totalKeluar)}`} sub={`${infaqPct}% tersalurkan`} color="#3b82f6" />
              <div style={{
                background: "var(--card-bg)", borderRadius: 16, padding: "20px 18px",
                border: `1px solid ${infaqNolData.saldoSekarang <= 2000000 ? "#10b98130" : "#f59e0b30"}`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 8 }}>Saldo Saat Ini</div>
                <div style={{
                  fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)",
                  color: infaqNolData.saldoSekarang <= 2000000 ? "#10b981" : "#f59e0b",
                }}>
                  Rp {fmt(infaqNolData.saldoSekarang)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: infaqNolData.saldoSekarang <= 2000000 ? "#10b981" : "#f59e0b", fontFamily: "var(--font-body)", marginTop: 4 }}>
                  {infaqNolData.saldoSekarang <= 2000000 ? "✅ Mendekati target NOL!" : "⚠️ Perlu segera disalurkan"}
                </div>
                {/* Progress to zero */}
                <div style={{ marginTop: 10, height: 8, borderRadius: 4, background: "var(--bg)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, width: `${infaqPct}%`,
                    background: `linear-gradient(90deg, #10b981, #059669)`,
                    transition: "width 0.6s",
                  }} />
                </div>
              </div>
            </div>

            {/* Penyaluran log */}
            <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 14px" }}>Riwayat Penyaluran April 2026</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {infaqNolData.penyaluran.map(p => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)",
                    flexWrap: "wrap", gap: 8,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{p.to}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{p.desc} • {fmtDate(p.date)}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#10b981", fontFamily: "var(--font-display)" }}>Rp {fmt(p.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Program Sosial ── */}
        {dakwahTab === "program" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
              <StatCard icon="heart" label="Total Program" value={`${programSosial.length}`} sub={`${programSosial.filter(p => p.status === "aktif").length} aktif`} color="#ec4899" />
              <StatCard icon="finance" label="Total Anggaran" value={`Rp ${fmt(totalBudget)}`} color="#8b5cf6" />
              <StatCard icon="check" label="Tersalurkan" value={`Rp ${fmt(totalDistributed)}`} sub={`${Math.round((totalDistributed / totalBudget) * 100)}%`} color="#10b981" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
              {programSosial.map(p => {
                const pct = p.budget > 0 ? Math.round((p.distributed / p.budget) * 100) : 0;
                return (
                  <div key={p.id} style={{
                    background: "var(--card-bg)", borderRadius: 16, padding: 20,
                    border: "1px solid var(--border)", position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 28 }}>{p.emoji}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 10,
                        background: p.status === "aktif" ? "#10b98118" : "#f59e0b18",
                        color: p.status === "aktif" ? "#10b981" : "#f59e0b",
                        fontFamily: "var(--font-body)", textTransform: "capitalize",
                      }}>{p.status}</span>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", fontFamily: "var(--font-display)" }}>{p.name}</h4>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", lineHeight: 1.5, marginBottom: 10 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 10 }}>
                      <span>👥 {fmt(p.beneficiaries)} {p.unit}</span>
                      <span>🔄 {p.frequency}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-body)", marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)" }}>Anggaran: Rp {fmt(p.budget)}</span>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "var(--bg)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: pct >= 80 ? "#10b981" : "#f59e0b", transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJamaah = () => {
    const counts = { ramai: 0, normal: 0, sepi: 0 };
    jamaah.forEach(j => { counts[j.kondisi] = (counts[j.kondisi] || 0) + 1; });
    const total = jamaah.length;

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: 0 }}>Kesan Jamaah Mingguan</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2, fontFamily: "var(--font-body)" }}>Cukup 1x seminggu, catat kesan umum oleh pengurus</p>
          </div>
          <Btn onClick={() => setShowModal("jamaah")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Catat Minggu Ini
          </Btn>
        </div>

        {/* Summary pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
          {KONDISI_OPTIONS.map(k => (
            <div key={k.value} style={{
              background: "var(--card-bg)", borderRadius: 16, padding: "18px 16px",
              border: `1px solid ${k.color}25`, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -10, right: -10, width: 50, height: 50, borderRadius: "50%", background: k.color, opacity: 0.07 }} />
              <div style={{ fontSize: 28, marginBottom: 4 }}>{k.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color, fontFamily: "var(--font-display)" }}>{counts[k.value]}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Minggu {k.label.split(" ")[1]}</div>
              <div style={{
                marginTop: 8, height: 4, borderRadius: 2, background: "var(--bg)", overflow: "hidden",
              }}>
                <div style={{ height: "100%", borderRadius: 2, background: k.color, width: total > 0 ? `${(counts[k.value] / total) * 100}%` : "0%", transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Visual Timeline - dot strip */}
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 24, border: "1px solid var(--border)", marginBottom: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 20px" }}>Trend 12 Minggu Terakhir</h4>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {[...jamaah].reverse().map((j, i) => {
              const opt = KONDISI_OPTIONS.find(o => o.value === j.kondisi);
              const barH = opt.score === 3 ? 80 : opt.score === 2 ? 50 : 24;
              return (
                <div key={j.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: 90 }}>
                    <div style={{
                      width: "70%", minWidth: 12, borderRadius: 6, height: barH,
                      background: `linear-gradient(180deg, ${opt.color}, ${opt.color}88)`,
                      boxShadow: `0 2px 8px ${opt.color}30`,
                      transition: "height 0.4s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: 8, color: "var(--text-secondary)", fontFamily: "var(--font-body)", textAlign: "center", lineHeight: 1.1 }}>
                    {j.label.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
            {KONDISI_OPTIONS.map(k => (
              <div key={k.value} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: k.color }} />
                <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{k.label.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Log */}
        <div style={{ background: "var(--card-bg)", borderRadius: 16, padding: 20, border: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)", margin: "0 0 16px" }}>Catatan Mingguan</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {jamaah.map(j => {
              const opt = KONDISI_OPTIONS.find(o => o.value === j.kondisi);
              return (
                <div key={j.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  borderRadius: 14, background: "var(--bg)", border: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center",
                    justifyContent: "center", background: `${opt.color}15`, fontSize: 20,
                    flexShrink: 0,
                  }}>
                    {opt.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{j.label}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                        background: `${opt.color}18`, color: opt.color, fontFamily: "var(--font-body)",
                      }}>{opt.label.split(" ")[1]}</span>
                    </div>
                    {j.catatan && (
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginTop: 2 }}>
                        💬 {j.catatan}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    oleh {j.by}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const pages = { dashboard: renderDashboard, finance: renderFinance, usaha: renderUsaha, events: renderEvents, inventory: renderInventory, donatur: renderDonatur, dakwah: renderDakwah, jamaah: renderJamaah };

  return (
    <div style={{
      "--bg": "#0c0f14",
      "--card-bg": "#141820",
      "--border": "#1e2530",
      "--text-primary": "#e8ecf4",
      "--text-secondary": "#6b7a8d",
      "--accent": "#10b981",
      "--accent-glow": "#10b98140",
      "--font-display": "'Playfair Display', Georgia, serif",
      "--font-body": "'DM Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)",
      fontFamily: "var(--font-body)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Sidebar (desktop) ─────────────────────────────────── */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 240,
        background: "var(--card-bg)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", zIndex: 100,
        transform: mobileNav ? "translateX(0)" : undefined,
      }}
        className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            }}>
              <Icon name="mosque" size={22} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", lineHeight: 1.2 }}>
                IMARAH
              </div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)", letterSpacing: 1 }}>
                MOSQUE MANAGEMENT
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileNav(false); }} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "12px 14px", borderRadius: 12, border: "none", cursor: "pointer",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--text-secondary)",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: active ? 700 : 500,
                marginBottom: 4, transition: "all 0.2s",
                boxShadow: active ? "0 4px 16px var(--accent-glow)" : "none",
              }}>
                <Icon name={item.icon} size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>IMARAH v1.0</div>
          <div>Powered by Labbaik AI 🕌</div>
        </div>
      </div>

      {/* ── Mobile Header ─────────────────────────────────────── */}
      <div className="mobile-header" style={{
        display: "none", position: "fixed", top: 0, left: 0, right: 0,
        background: "var(--card-bg)", borderBottom: "1px solid var(--border)",
        padding: "12px 16px", zIndex: 101,
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="mosque" size={18} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "var(--font-display)" }}>IMARAH</span>
        </div>
        <button onClick={() => setMobileNav(!mobileNav)} style={{
          background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: 4,
        }}>
          <Icon name={mobileNav ? "close" : "menu"} size={24} />
        </button>
      </div>

      {/* ── Mobile Nav Overlay ────────────────────────────────── */}
      {mobileNav && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }} onClick={() => setMobileNav(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", top: 56, left: 0, right: 0,
            background: "var(--card-bg)", borderBottom: "1px solid var(--border)",
            padding: "12px",
          }}>
            {navItems.map(item => {
              const active = page === item.id;
              return (
                <button key={item.id} onClick={() => { setPage(item.id); setMobileNav(false); }} style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "14px 16px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "#fff" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: active ? 700 : 500,
                  marginBottom: 2, transition: "all 0.2s",
                }}>
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="main-content" style={{ marginLeft: 240, padding: "28px 32px", minHeight: "100vh" }}>
        {pages[page]()}
      </main>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <Modal open={showModal === "finance"} onClose={() => setShowModal(null)} title="Tambah Transaksi">
        <Field label="Jenis" as="select" value={finForm.type} onChange={e => setFinForm(p => ({ ...p, type: e.target.value }))}>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </Field>
        <Field label="Kategori" as="select" value={finForm.category} onChange={e => setFinForm(p => ({ ...p, category: e.target.value }))}>
          <option value="">-- Pilih --</option>
          {finForm.type === "income" ? (
            <>
              <option>Infaq Jumat</option><option>Infaq Harian</option>
              <option>Donasi</option><option>Zakat</option><option>Wakaf</option>
            </>
          ) : (
            <>
              <option>Listrik & Air</option><option>Kebersihan</option>
              <option>Honorarium</option><option>Pemeliharaan</option><option>Lainnya</option>
            </>
          )}
        </Field>
        <Field label="Jumlah (Rp)" type="number" value={finForm.amount} onChange={e => setFinForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
        <Field label="Tanggal" type="date" value={finForm.date} onChange={e => setFinForm(p => ({ ...p, date: e.target.value }))} />
        <Field label="Keterangan" as="textarea" value={finForm.desc} onChange={e => setFinForm(p => ({ ...p, desc: e.target.value }))} placeholder="Catatan transaksi..." />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addFinance}>Simpan</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "event"} onClose={() => setShowModal(null)} title="Tambah Kegiatan">
        <Field label="Nama Kegiatan" value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="Kajian Rutin..." />
        <Field label="Jenis" as="select" value={eventForm.type} onChange={e => setEventForm(p => ({ ...p, type: e.target.value }))}>
          <option value="kajian">Kajian</option><option value="sholat">Sholat</option>
          <option value="pendidikan">Pendidikan</option><option value="organisasi">Organisasi</option>
          <option value="operasional">Operasional</option>
        </Field>
        <Field label="Tanggal" type="date" value={eventForm.date} onChange={e => setEventForm(p => ({ ...p, date: e.target.value }))} />
        <Field label="Waktu" type="time" value={eventForm.time} onChange={e => setEventForm(p => ({ ...p, time: e.target.value }))} />
        <Field label="Pemateri / PJ" value={eventForm.speaker} onChange={e => setEventForm(p => ({ ...p, speaker: e.target.value }))} placeholder="Ust. ..." />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addEvent}>Simpan</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "inventory"} onClose={() => setShowModal(null)} title="Tambah Inventaris">
        <Field label="Nama Barang" value={invForm.name} onChange={e => setInvForm(p => ({ ...p, name: e.target.value }))} placeholder="Sajadah, Mukena, dll" />
        <Field label="Jumlah" type="number" value={invForm.qty} onChange={e => setInvForm(p => ({ ...p, qty: e.target.value }))} placeholder="0" />
        <Field label="Area / Lokasi" as="select" value={invForm.area} onChange={e => setInvForm(p => ({ ...p, area: e.target.value }))}>
          {AREAS.filter(a => a !== "Semua").map(a => <option key={a}>{a}</option>)}
        </Field>
        <Field label="Kondisi" as="select" value={invForm.condition} onChange={e => setInvForm(p => ({ ...p, condition: e.target.value }))}>
          <option>Baik</option><option>Sebagian Perlu Ganti</option><option>Rusak</option><option>Perlu Tambah</option>
        </Field>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addInventory}>Simpan</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "ticket"} onClose={() => setShowModal(null)} title="🛠️ Laporkan Kerusakan">
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 14, lineHeight: 1.5 }}>
          Laporkan fasilitas yang rusak atau butuh perbaikan. Siapapun bisa melapor — jamaah, marbot, atau pengurus.
        </p>
        <Field label="Fasilitas / Barang" value={ticketForm.item} onChange={e => setTicketForm(p => ({ ...p, item: e.target.value }))} placeholder="AC, Kran Wudhu, Lampu, dll" />
        <Field label="Area" as="select" value={ticketForm.area} onChange={e => setTicketForm(p => ({ ...p, area: e.target.value }))}>
          {AREAS.filter(a => a !== "Semua").map(a => <option key={a}>{a}</option>)}
        </Field>
        <Field label="Apa masalahnya?" as="textarea" value={ticketForm.issue} onChange={e => setTicketForm(p => ({ ...p, issue: e.target.value }))} placeholder="Jelaskan kerusakannya secara singkat..." />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "var(--font-body)" }}>Seberapa mendesak?</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { v: "rendah", l: "Rendah", e: "🔵", d: "Bisa ditunda" },
              { v: "sedang", l: "Sedang", e: "🟡", d: "Perlu segera" },
              { v: "tinggi", l: "Tinggi", e: "🔴", d: "Darurat" },
            ].map(p => (
              <button key={p.v} onClick={() => setTicketForm(prev => ({ ...prev, priority: p.v }))} style={{
                flex: 1, padding: "12px 8px", borderRadius: 14, cursor: "pointer",
                border: ticketForm.priority === p.v ? `2px solid ${p.v === "tinggi" ? "#ef4444" : p.v === "sedang" ? "#f59e0b" : "#3b82f6"}` : "2px solid var(--border)",
                background: ticketForm.priority === p.v ? `${p.v === "tinggi" ? "#ef4444" : p.v === "sedang" ? "#f59e0b" : "#3b82f6"}12` : "var(--bg)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 22 }}>{p.e}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{p.l}</span>
                <span style={{ fontSize: 9, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{p.d}</span>
              </button>
            ))}
          </div>
        </div>
        <Field label="Nama Pelapor (opsional)" value={ticketForm.reportedBy} onChange={e => setTicketForm(p => ({ ...p, reportedBy: e.target.value }))} placeholder="Marbot Udin, Jamaah Ahmad, dll" />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addTicket}>Kirim Laporan</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "donatur"} onClose={() => setShowModal(null)} title="💚 Tambah Donatur">
        <Field label="Nama Lengkap" value={donaturForm.name} onChange={e => setDonaturForm(p => ({ ...p, name: e.target.value }))} placeholder="H. Ahmad Fauzi" />
        <Field label="No. HP / WhatsApp" value={donaturForm.phone} onChange={e => setDonaturForm(p => ({ ...p, phone: e.target.value }))} placeholder="0812-xxxx-xxxx" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "var(--font-body)" }}>Jenis Donasi</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DONATUR_TYPES.map(t => (
              <button key={t.value} onClick={() => setDonaturForm(p => ({ ...p, type: t.value, frequency: t.value === "rutin" ? "Bulanan" : t.value === "ramadhan" || t.value === "qurban" ? "Tahunan" : "-" }))} style={{
                padding: "8px 14px", borderRadius: 12, cursor: "pointer",
                border: donaturForm.type === t.value ? `2px solid ${t.color}` : "2px solid var(--border)",
                background: donaturForm.type === t.value ? `${t.color}15` : "var(--bg)",
                display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 14 }}>{t.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: donaturForm.type === t.value ? t.color : "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Field label="Jumlah Donasi (Rp)" type="number" value={donaturForm.amount} onChange={e => setDonaturForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
        {donaturForm.type === "rutin" && (
          <Field label="Frekuensi" as="select" value={donaturForm.frequency} onChange={e => setDonaturForm(p => ({ ...p, frequency: e.target.value }))}>
            <option>Bulanan</option><option>Mingguan</option><option>Per Jumat</option>
          </Field>
        )}
        <Field label="Catatan (opsional)" as="textarea" value={donaturForm.notes} onChange={e => setDonaturForm(p => ({ ...p, notes: e.target.value }))} placeholder="Transfer otomatis, via kotak infaq, dll..." />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addDonatur}>Simpan Donatur</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "booking"} onClose={() => setShowModal(null)} title="📅 Booking / Sewa Baru">
        <Field label="Unit Usaha" as="select" value={bookingForm.unitId} onChange={e => setBookingForm(p => ({ ...p, unitId: e.target.value }))}>
          {usahaUnits.filter(u => u.status === "aktif").map(u => (
            <option key={u.id} value={u.id}>{u.name}{u.ratePerDay > 0 ? ` (Rp ${fmt(u.ratePerDay)} ${u.rateLabel})` : ""}</option>
          ))}
        </Field>
        <Field label="Nama Penyewa / Klien" value={bookingForm.client} onChange={e => setBookingForm(p => ({ ...p, client: e.target.value }))} placeholder="Bpk. Hendra / PKK RT 05" />
        <Field label="No. HP" value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} placeholder="0812-xxxx-xxxx" />
        <Field label="Tanggal" type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} />
        <Field label="Keperluan" value={bookingForm.purpose} onChange={e => setBookingForm(p => ({ ...p, purpose: e.target.value }))} placeholder="Walimah, Seminar, Aqiqah, dll" />
        <Field label="Biaya / Harga (Rp)" type="number" value={bookingForm.amount} onChange={e => setBookingForm(p => ({ ...p, amount: e.target.value }))} placeholder="Otomatis dari tarif jika kosong" />
        <Field label="Catatan (opsional)" as="textarea" value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} placeholder="Request khusus, jumlah porsi, dll" />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addBooking}>Simpan Booking</Btn>
        </div>
      </Modal>

      <Modal open={showModal === "jamaah"} onClose={() => setShowModal(null)} title="Catat Kesan Minggu Ini">
        <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", marginBottom: 16, lineHeight: 1.6 }}>
          Cukup pilih kesan umum minggu ini. Tidak perlu hitung — cukup berdasarkan pengamatan.
        </p>
        <Field label="Periode (contoh: 13-17 Apr)" value={jamaahForm.label} onChange={e => setJamaahForm(p => ({ ...p, label: e.target.value }))} placeholder="13-17 Apr" />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontFamily: "var(--font-body)" }}>Bagaimana jamaah minggu ini?</label>
          <div style={{ display: "flex", gap: 8 }}>
            {KONDISI_OPTIONS.map(k => (
              <button key={k.value} onClick={() => setJamaahForm(p => ({ ...p, kondisi: k.value }))} style={{
                flex: 1, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
                border: jamaahForm.kondisi === k.value ? `2px solid ${k.color}` : "2px solid var(--border)",
                background: jamaahForm.kondisi === k.value ? `${k.color}15` : "var(--bg)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 28 }}>{k.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: jamaahForm.kondisi === k.value ? k.color : "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {k.label.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>
        <Field label="Catatan (opsional)" as="textarea" value={jamaahForm.catatan} onChange={e => setJamaahForm(p => ({ ...p, catatan: e.target.value }))} placeholder="Contoh: Ramadhan, hujan, ada tabligh akbar..." />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn variant="secondary" onClick={() => setShowModal(null)}>Batal</Btn>
          <Btn onClick={addJamaah}>Simpan</Btn>
        </div>
      </Modal>

      {/* ── Responsive CSS ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding: 72px 16px 24px !important; }
        }
      `}</style>
    </div>
  );
}
