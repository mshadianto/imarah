<div align="center">

<br>

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██╗███╗   ███╗ █████╗ ██████╗  █████╗ ██╗  ██╗           ║
║    ██║████╗ ████║██╔══██╗██╔══██╗██╔══██╗██║  ██║           ║
║    ██║██╔████╔██║███████║██████╔╝███████║███████║           ║
║    ██║██║╚██╔╝██║██╔══██║██╔══██╗██╔══██║██╔══██║           ║
║    ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██║██║  ██║           ║
║    ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝           ║
║                                                              ║
║          🕌  Mosque Management Platform  🕌                  ║
║               إعمارة  — memakmurkan                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**Sistem pengelolaan masjid terlengkap — keuangan, operasional, dakwah & sosial.**
**Terinspirasi dari manajemen Masjid Jogokariyan Yogyakarta.**

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/CSS--in--JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

<br>

[🚀 Live Demo](#-live-demo) · [📦 Instalasi](#-quick-start) · [🗂️ Fitur](#-9-modul-lengkap) · [🤝 Kontribusi](#-kontribusi)

<br>

---

</div>

## 🌟 Kenapa IMARAH?

> *"Dari Masjid Membangun Umat"*
> — Motto Masjid Jogokariyan Yogyakarta

**IMARAH** (إعمارة) berarti *memakmurkan* — dari QS At-Taubah:18: *"Sesungguhnya yang memakmurkan masjid-masjid Allah..."*

Kebanyakan masjid di Indonesia masih mengelola keuangan dan operasional secara manual — buku catatan, spreadsheet, atau bahkan hanya mengandalkan ingatan. **IMARAH** hadir sebagai solusi digital yang **realistis**, dirancang khusus untuk kebutuhan DKM (Dewan Kemakmuran Masjid) dengan pendekatan yang tidak memberatkan pengurus. Terinspirasi dari manajemen Masjid Jogokariyan — masjid kampung percontohan nasional.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   📊 Dashboard    →  Ringkasan lengkap satu layar          │
│   💰 Keuangan     →  Pemasukan, pengeluaran, perbandingan  │
│   📒 Akuntansi    →  ISAK 35 — laporan keuangan formal     │
│   🏪 Usaha Masjid →  Unit usaha sektor riil & laba rugi    │
│   📅 Kegiatan     →  Jadwal kajian, TPA, rapat DKM         │
│   🔧 Sarpras      →  Inventaris, laporan rusak, jadwal     │
│   💚 Donatur      →  Rutin, insidentil, wakaf, follow-up   │
│   🗺️ Dakwah       →  Peta dakwah, Infaq Nol, program sosial│
│   👥 Jamaah       →  Kesan mingguan tanpa ribet            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🕌 9 Modul Lengkap

### 1. 📊 Dashboard
Ringkasan seluruh aktivitas masjid dalam satu layar — total pemasukan/pengeluaran bulan berjalan, saldo kas, jumlah donatur rutin, laba usaha masjid, donut chart komposisi keuangan, kegiatan mendatang, dan transaksi terakhir.

### 2. 💰 Keuangan
Pencatatan keuangan lengkap dengan fitur:
- **Filter per periode** (bulan) dan **per jenis** (pemasukan/pengeluaran)
- **Breakdown per kategori** — Infaq Jumat, Donasi, Zakat, Wakaf, Listrik, Honorarium, dll
- **Perbandingan antar periode** — klik tombol "Bandingkan" untuk melihat persentase naik/turun vs bulan sebelumnya
- **Filter kategori spesifik** — lihat hanya "Pengeluaran Pemeliharaan" misalnya
- Status verifikasi per transaksi

### 3. 📒 Akuntansi *(ISAK 35)*
Sistem akuntansi formal untuk masjid berbasis **ISAK 35 — Penyajian Laporan Keuangan Entitas Berorientasi Non-Laba** (interpretasi PSAK 1). Dirancang siap audit & transparan ke jamaah:

- **3 klasifikasi aset neto** otomatis sesuai ISAK 35
  - 🟢 *Tanpa Pembatasan* — infaq, shadaqah, operasional
  - 🟡 *Terikat Temporer* — zakat, donasi pembangunan, santunan yatim
  - ⚫ *Terikat Permanen* — wakaf uang & aset wakaf
- **4 laporan keuangan formal**
  1. Laporan Posisi Keuangan (Neraca)
  2. Laporan Penghasilan Komprehensif (Laba Rugi)
  3. Laporan Arus Kas — metode langsung (Operasi · Investasi · Pendanaan)
  4. Catatan atas Laporan Keuangan (CALK)
- **Buku Kas** — jurnal harian dengan saldo berjalan, sort asc/desc, filter periode, total Σ Masuk/Keluar/Net, search uraian
- **Bagan Akun** (Chart of Accounts) — 12 akun penerimaan + 16 akun beban pre-loaded, dapat diubah
- **Quick add** — tombol brass di top bar untuk catat transaksi dari halaman manapun
- **Undo on delete** — toast dengan tombol "Urungkan" 6 detik setelah hapus, tidak ada lagi popup `confirm` browser
- **Filter periode** — Bulan ini / Bulan lalu / YTD / Seluruh data / Per tahun
- **Profil Masjid** — muncul di kop semua laporan
- **Export CSV** transaksi (Excel-friendly, BOM UTF-8) & **Backup JSON** penuh + Import
- **Print-ready** — Ctrl+P di tiap laporan langsung jadi PDF rapi untuk rapat DKM
- **Data lokal** — `localStorage` key `imarah_akuntansi_v1` (siap diganti ke backend kapan saja)

> Cocok untuk dipakai bendahara langsung — atau sebagai *single source of truth* yang nanti dipindah ke backend multi-user via Cloudflare D1.

### 4. 🏪 Usaha Masjid *(Sektor Riil)*
Modul untuk masjid yang ingin mandiri secara finansial:
- **8 unit usaha** — Aula Serbaguna, Minimarket, Katering, Koperasi Syariah, Parkir, Lapak PKL, Layanan Jenazah, Laundry
- **Laba Rugi per kategori** — Sewa, Retail, Jasa, Koperasi, Parkir
- **Ranking unit usaha** berdasarkan profit + margin
- **Booking & Sewa** — manajemen reservasi aula dan pesanan katering, konfirmasi/tolak
- **Riwayat transaksi** per unit usaha

### 5. 📅 Kegiatan
Jadwal kegiatan masjid dengan 5 kategori berkode warna:
- 🟣 Kajian — pengajian rutin, majelis taklim
- 🟢 Sholat — Jumat, Hari Raya
- 🔵 Pendidikan — TPA, tahfidz
- 🟡 Organisasi — rapat DKM
- 🔴 Operasional — bersih-bersih, maintenance

### 6. 🔧 Sarana & Prasarana
Pengelolaan aset masjid dengan 3 sub-modul:
- **📦 Inventaris** — daftar aset per area (Ruang Utama, Wudhu, Serambi, dll) + filter lokasi
- **🛠️ Laporan Kerusakan** — sistem tiket: siapapun bisa lapor, prioritas 🔴🟡🔵, status Baru → Proses → Selesai
- **📅 Jadwal Perawatan** — countdown otomatis: berapa hari lagi AC, genset, pompa, CCTV perlu di-service

### 7. 💚 Donatur
Manajemen donatur lengkap:
- **5 jenis** — 🔄 Rutin, 🎁 Insidentil, 🌙 Ramadhan, 🐑 Qurban, 🏛️ Wakaf
- **Follow-up otomatis** — alert donatur rutin yang belum berdonasi > 35 hari
- **Top Donatur** 🥇🥈🥉 berdasarkan total lifetime
- **Breakdown visual** per jenis donasi
- Filter & pencarian by nama/HP

### 8. 🗺️ Dakwah & Sosial *(Adopsi Masjid Jogokariyan)*
Modul paling unik — mengadopsi 4 pilar manajemen Masjid Jogokariyan:

#### 🗺️ Peta Dakwah
Pendataan warga per KK dengan status warna:
- 🟢 Aktif Berjamaah · 🟡 Sholat tapi Jarang ke Masjid · 🔴 Belum Terdata
- Badge per keluarga: 🕋 Haji · 🐑 Qurban · 💰 Zakat · 🕌 Berjamaah
- Catatan per KK untuk da'i · Target 80%+ hijau

#### 💰 Infaq Nol Rupiah
Filosofi revolusioner: *"Infaq itu ditunggu pahalanya, bukan disimpan di rekening."*
- Dashboard saldo yang targetnya **NOL** — semakin cepat tersalurkan, semakin baik
- Progress bar menuju nol · Riwayat penyaluran lengkap

#### 🤲 8 Program Sosial
| Program | Penerima | Deskripsi |
|---------|----------|-----------|
| 🍚 ATM Beras | 85 KK | Distribusi beras via KTP untuk dhuafa |
| 🏥 Kartu Sehat | 42 orang | Jaminan berobat di RS/klinik rekanan |
| 🎓 Beasiswa | 28 siswa | Bantuan biaya SD-SMA |
| 🤲 Santunan | 35 orang | Yatim piatu & janda |
| 🌅 Gerakan Subuh | 120 jamaah | Undangan subuh + sarapan gratis + uang jajan anak |
| 💼 Modal Usaha | 12 orang | Pinjaman tanpa bunga |
| 🌙 Buka Bersama | 1000+ porsi/hari | Ramadhan |
| 🚗 Jemput Jamaah | 8 orang | Antar-jemput lansia & disabilitas |

### 9. 👥 Jamaah
Tracking kehadiran yang **realistis** — bukan input per waktu sholat (bikin repot marbot), tapi **kesan mingguan** oleh pengurus:
- Cukup pilih 🟢 Ramai / 🟡 Normal / 🔴 Sepi
- Opsional: catatan singkat ("Ramadhan", "hujan terus")
- Visual trend 12 minggu terakhir
- 10 detik per minggu, tanpa memberatkan siapapun

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/mshadianto/imarah.git
cd imarah

# Install dependencies
npm install

# Run development server
npm run dev
```

Buka `http://localhost:5173` — selesai.

### Tech Stack

```
Frontend    →  React 19 + Vite 6
Styling     →  CSS-in-JS (inline styles + CSS variables)
Fonts       →  Playfair Display + DM Sans (main)
              Fraunces + Plus Jakarta Sans + JetBrains Mono (Akuntansi)
Charts      →  Chart.js 4 + react-chartjs-2 (lazy-loaded dgn Akuntansi)
State       →  useState + useReducer + useMemo
Persistence →  localStorage (key: imarah_akuntansi_v1 untuk modul Akuntansi)
Build       →  Vite (SPA, code-split per route)
Deploy      →  GitHub Pages → imarah.mshadianto.id (CNAME, auto via Actions)
```

---

## 📐 Arsitektur

```
imarah.jsx                   ← Main app, single-file (~2500 lines)
│
├── Constants & Data         ← Initial data untuk 8 modul utama
├── UI Components            ← Icon (14 SVG), StatCard, DonutChart, Modal, Field, Btn
├── 9 Page Renderers         ← 8 inline + Akuntansi (lazy-loaded)
└── 7 Modal Forms            ← Transaksi, Event, Inventaris, Ticket, Donatur, Booking, Jamaah

src/components/Akuntansi/    ← Modul ISAK 35, code-split chunk
│
├── index.jsx                ← Container — sub-sidebar + topbar + sub-routing
├── useAkuntansiStore.js     ← useReducer hook + localStorage sync + safe quota
├── constants.js             ← DEFAULT_STATE, palet jade/brass, NAV_GROUPS
├── helpers.js               ← fmtRp, fmtDate, period bounds, aggregateBuckets
├── ui.jsx                   ← Card, Btn, Input, Modal, Pill, Toast, Confirm
├── exports.js               ← CSV / JSON export + import
├── demoData.js              ← ~240 transaksi demo realistic 6 bulan
│
├── Dashboard.jsx            ← Hero + 4 KPI + Bar 6-bln + Doughnut + Recent
├── Transaksi.jsx            ← Form input penuh dengan auto-format ribuan
├── TransaksiModal.jsx       ← Quick add/edit dari top bar
├── BukuKas.jsx              ← Jurnal harian, sort, totals, sticky header, undo
├── LaporanShared.jsx        ← Header, Row, GroupRow, PrintBar, Signatures
├── LaporanPosisi.jsx        ← Neraca (Aset, Liabilitas, Aset Neto)
├── LaporanAktivitas.jsx     ← Penghasilan Komprehensif
├── LaporanArusKas.jsx       ← Arus Kas metode langsung
├── Catatan.jsx              ← CALK collapsible (5 catatan baku)
├── BaganAkun.jsx            ← CRUD chart of accounts
├── Profil.jsx               ← Profil masjid untuk kop laporan
└── DataBackup.jsx           ← Export/Import/Reset/Demo
```

---

## 🗺️ Roadmap

- [x] **Sistem Akuntansi ISAK 35** — Laporan keuangan formal untuk audit & transparansi ✓
- [ ] **Backend Integration** — Cloudflare Workers + D1 database
- [ ] **Multi-tenant** — Satu platform untuk banyak masjid (per-masjid namespace)
- [ ] **WhatsApp Notification** — Reminder donatur, jadwal kegiatan, laporan kerusakan
- [ ] **Laporan PDF generator** — Server-side PDF biar tidak bergantung print browser
- [ ] **QR Code Infaq** — QRIS integration untuk infaq digital, auto-catat ke modul Akuntansi
- [ ] **PWA** — Installable di HP marbot & pengurus, mode offline
- [ ] **Role-based Access** — Ketua DKM, Bendahara, Marbot, Jamaah
- [ ] **AI Assistant** — Chatbot untuk jamaah (jadwal sholat, info kegiatan)

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Baik itu perbaikan bug, penambahan fitur, atau sekedar saran.

```bash
# Fork repo ini
# Buat branch baru
git checkout -b fitur/nama-fitur

# Commit perubahan
git commit -m "Tambah fitur XYZ"

# Push & buat Pull Request
git push origin fitur/nama-fitur
```

---

## 📜 Lisensi

Dirilis di bawah [MIT License](LICENSE). Bebas digunakan untuk masjid manapun.

---

<div align="center">

## 👨‍💻 Developer

<br>

```
 ╔═══════════════════════════════════════════════════════╗
 ║                                                       ║
 ║              M. SOPIAN HADIANTO                       ║
 ║                                                       ║
 ║     GRC Expert  ·  AI-Powered Builder  ·  Founder     ║
 ║                                                       ║
 ╚═══════════════════════════════════════════════════════╝
```

**Curious → Coding → Deploy → Repeat**

<br>

[![CACP®](https://img.shields.io/badge/CACP®-Certified-0D6EFD?style=flat-square)](https://www.theiia.org/)
[![CCFA®](https://img.shields.io/badge/CCFA®-Certified-0D6EFD?style=flat-square)](https://acfe.com/)
[![QIA®](https://img.shields.io/badge/QIA®-Certified-0D6EFD?style=flat-square)](https://ypia.or.id/)
[![CA®](https://img.shields.io/badge/CA®-Chartered_Accountant-0D6EFD?style=flat-square)](https://iai.or.id/)
[![GRCP®](https://img.shields.io/badge/GRCP®-Certified-0D6EFD?style=flat-square)](https://oceg.org/)
[![GRCA®](https://img.shields.io/badge/GRCA®-Certified-0D6EFD?style=flat-square)](https://oceg.org/)
[![CGP®](https://img.shields.io/badge/CGP®-Certified-0D6EFD?style=flat-square)](https://iicd.or.id/)
[![ISO 37001](https://img.shields.io/badge/ISO_37001-Senior_Lead_Auditor-10B981?style=flat-square)](https://www.iso.org/)
[![ISO 9001](https://img.shields.io/badge/ISO_9001-Lead_Implementer-10B981?style=flat-square)](https://www.iso.org/)

<br>

🏢 Founder of [**Labbaik AI**](https://github.com/mshadianto) — AI solutions for Islamic finance & governance

🏆 **#1 Compliance Creator Indonesia 2025** (Favikon)

🎥 YouTube: [@MSHadianto](https://youtube.com/@MSHadianto) — AI, Islamic Finance & Tech

<br>

[![GitHub](https://img.shields.io/badge/GitHub-mshadianto-181717?style=for-the-badge&logo=github)](https://github.com/mshadianto)
[![YouTube](https://img.shields.io/badge/YouTube-MSHadianto-FF0000?style=for-the-badge&logo=youtube)](https://youtube.com/@MSHadianto)
[![Website](https://img.shields.io/badge/Web-mshadianto.my.id-000000?style=for-the-badge&logo=cloudflare)](https://mshadianto.my.id)

<br>

---

<br>

*Built with ☕ + 🤖 + ❤️ in Ciputat, South Tangerang*

*Bismillah, semoga bermanfaat untuk umat.*

<br>

```
   ___
  /   \
 | 🕌  |    "Barangsiapa membangun masjid karena Allah,
 |     |     niscaya Allah membangunkan untuknya
 |_____|     rumah di surga." — HR. Bukhari & Muslim
  |   |
══╧═══╧══
```

<br>

</div>
