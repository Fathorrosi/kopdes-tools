# 🛒 Kopdes Gerai Online — Panduan Penggunaan & Dokumentasi Sistem

**Kopdes Gerai Online** adalah sistem aplikasi belanja digital (*Micro-SaaS*) berbasis cloud terpadu untuk Koperasi Desa (Kopdes), mengintegrasikan Storefront Pembeli, Panel Pengurus, dan Portal Kurir dalam **1 aplikasi terpadu**.

* 🌐 **Aplikasi Web & PWA Master:** [https://kopdes-samatan.vercel.app](https://kopdes-samatan.vercel.app)
* ⚡ **Core Library Script ID:** `1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y` (Versi: `153`)
* 📁 **Penyimpanan Media:** Google Drive (*Folder: Gerai Kopdes Assets*)
* 🏢 **Arsitektur:** Managed SaaS Library — Anti-Bypass & Anti-Jual Ulang

---

## 📚 Dokumentasi Lengkap

| Dokumen | Deskripsi | Ditujukan Untuk |
| :--- | :--- | :--- |
| 📄 [README.md](./README.md) | Panduan umum, kredensial, dan ringkasan sistem | Semua pihak |
| 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) | Spesifikasi teknis, skema database, RBAC, dan arsitektur sistem | Developer / Vendor |
| 📱 [docs/CLIENT_SETUP.md](./docs/CLIENT_SETUP.md) | **Panduan setup awal untuk Koperasi Desa klien baru (10-15 menit)** | Koperasi Desa Klien |
| 🔐 [docs/LICENSE_MANAGEMENT.md](./docs/LICENSE_MANAGEMENT.md) | Panduan manajemen lisensi, aktivasi & nonaktivasi klien | Vendor/Developer |

---

## 🔑 Kredensial Akun Demo (PIN Default: `1234`)

| Role | Nomor HP / Username | Email | Hak Akses |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `081100000001` / `admin` | `admin@kopdes.id` | Akses penuh semua fitur |
| 👔 **Pengurus 1** | `081100000002` | `budi.pengurus@kopdes.id` | Kelola produk, stok & kurir |
| 👔 **Pengurus 2** | `081100000003` | `siti.pengurus@kopdes.id` | Validasi pesanan & kas |
| 🛵 **Kurir 1** | `081300000001` / `kurir` | `kurir1@kopdes.id` | Mode pengantaran |
| 🛵 **Kurir 2** | `081300000002` | `kurir2@kopdes.id` | Mode pengantaran |
| 👥 **Anggota** | `081200000001` s/d `081200000010` | `ahmad.fauzi@...` | Belanja & lacak pesanan |

---

## 🚀 Quick Start — Klien Baru

> Untuk panduan lengkap, baca **[docs/CLIENT_SETUP.md](./docs/CLIENT_SETUP.md)**

1. Buat Google Spreadsheet baru ➔ Buka **Ekstensi ➔ Apps Script**
2. Tambahkan Library `KopdesEngine` *(Script ID di atas)*
3. Salin kode dari [`client-template/Code.js`](./client-template/Code.js) ke `Code.gs`
4. Jalankan **`setupApp`** ➔ lalu **`seedData`**
5. Klik **Deploy ➔ New deployment ➔ Web app** ➔ Toko langsung live! 🎉

---

## 🏢 Managed SaaS Library Architecture

Seluruh logika bisnis, database engine, dan tampilan UI disimpan aman sebagai **GAS Library** di akun Developer. Koperasi Desa klien hanya memiliki file jembatan tipis 1 file (`Code.gs`) yang terhubung ke library tersebut.

**Keunggulan:**
- 🔒 **Source code terlindungi** — klien tidak bisa membaca atau menyalin kode
- 🛡️ **Anti-jual ulang** — kode tidak bisa diduplikasi dan dijual ke pihak lain
- 🗄️ **Data tersimpan aman** di Google Drive milik masing-masing Koperasi Desa
- ⚡ **Update fitur instan** — vendor update library, semua klien otomatis mendapat fitur baru (setelah update versi)

---

## 🔐 Sistem Kontrol Lisensi

Vendor dapat mengaktifkan / menonaktifkan layanan setiap klien kapan saja melalui **Google Sheet Master Lisensi** tanpa menyentuh kode apapun.

> 📖 Panduan lengkap: **[docs/LICENSE_MANAGEMENT.md](./docs/LICENSE_MANAGEMENT.md)**

| Status | Efek |
| :--- | :--- |
| `ACTIVE` | Toko, Admin, dan Mode Kurir berjalan normal |
| `SUSPENDED` | Seluruh halaman terkunci otomatis (*Lock Screen*) |
| Tanggal `expiresAt` terlampaui | Otomatis terkunci dengan pesan *"Masa lisensi habis"* |

Perubahan status aktif dalam **~10 detik**, tanpa perlu deploy ulang. 🚀

---

## 📱 PWA (Progressive Web App)

Aplikasi dapat diinstall di HP seperti APK Android / iOS:
- **Android (Chrome):** Banner install otomatis muncul saat pertama buka
- **iPhone (Safari):** Share ⎋ ➔ "Tambahkan ke Layar Utama"

---

## 💻 Perintah Developer

```bash
# Push perubahan source code ke GAS Master
clasp push --force

# Buat versi baru library
clasp create-version "deskripsi-update"

# Update deployment aktif
clasp update-deployment [DEPLOYMENT_ID]
```

---

## 📞 Struktur Proyek

```
kopdes-tools/
├── README.md                    ← Dokumen ini
├── ARCHITECTURE.md              ← Spesifikasi teknis lengkap
├── docs/
│   ├── CLIENT_SETUP.md          ← Panduan setup untuk klien baru
│   └── LICENSE_MANAGEMENT.md    ← Panduan manajemen lisensi (vendor)
├── client-template/
│   ├── Code.js                  ← Template Code.gs untuk klien
│   └── README.md                ← Ringkasan setup untuk klien
├── vercel-app/                  ← PWA Wrapper & Vercel Domain
│   ├── index.html               ← Wrapper iframe + Service Worker
│   ├── manifest.json            ← PWA Manifest
│   └── vercel.json              ← Konfigurasi Vercel SPA
└── src/                         ← Source code Master GAS Library
    ├── Code.js                  ← Entry point & exported functions
    ├── Seed.js                  ← Script data demo
    ├── core/
    │   ├── database/            ← Database abstraction layer
    │   ├── auth/                ← RBAC & Authentication
    │   └── license/             ← Master License System
    └── apps/gerai-online/
        ├── controllers/         ← Business logic controllers
        └── views/               ← HTML UI (Storefront, Admin, Kurir)
```
