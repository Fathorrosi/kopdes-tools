# KOPDES TOOLS - PROJECT REQUIREMENTS & ARCHITECTURE

## 1. Project Overview
**Kopdes Tools** adalah ekosistem aplikasi ringan (*Micro-SaaS*) modern yang dirancang khusus untuk Koperasi Desa (Kopdes). Aplikasi ini memungkinkan Koperasi Desa memiliki layanan digital lengkap (Gerai Online, Manajemen Stok, Panel Pengurus, Pelacakan Pesanan Pembeli, dan Portal Khusus Kurir Pengantaran) tanpa perlu menyewa *server database* berbayar.

* **Target Solusi:** Gerai Kopdes Online (PWA Mobile-First, Katalog Produk, Keranjang, Checkout COD, Manajemen Pesanan, Penyesuaian Stok Otomatis, dan Aplikasi Pengantaran Kurir Lapangan).
* **Live Custom Domain (PWA Master):** `https://kopdes-samatan.vercel.app`
* **Google Apps Script Core Library ID:** `1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y` (Versi: `119`)
* **Status:** ✅ Production Ready — Versi Terpadu 1 Aplikasi (Toko + Admin + Kurir + PWA APK + Managed Library Mode).

---

## 2. Technology Stack & Ekosistem
* **Backend & API:** Google Apps Script (GAS) — Runtime V8 Engine.
* **Database:** Google Sheets (berada di Google Drive milik Koperasi Desa masing-masing).
* **Asset Storage:** Google Drive (Folder otomatis *Gerai Kopdes Assets* untuk foto produk, logo koperasi, dan foto bukti serah terima kurir).
* **Frontend:** Vanilla JavaScript (ES6+), HTML5 Semantic, Custom Vanilla CSS Design System.
* **PWA & Domain Wrapper:** Vercel Hosting (`vercel-app/`) + Service Worker + Web App Manifest (Dapat diinstall sebagai APK / Add to Home Screen di Android & iOS).
* **Deployment CLI:** `@google/clasp` (`rootDir: ./src`).

---

## 3. Core Architecture Principles (Aturan Baku Proyek)

1. **Database Abstraction (Crucial & Wajib):**
   * DILARANG KERAS memanggil `SpreadsheetApp` langsung di controller atau view.
   * Semua interaksi *database* HARUS melalui abstraksi di `src/core/database/Database.js`.
   * `SheetAdapter.js` adalah **satu-satunya** file yang boleh memanggil `SpreadsheetApp`.
2. **Tenant Isolation:**
   * Satu lisensi aplikasi = Satu Kopdes = Satu Google Sheet.
3. **Modularitas & Managed SaaS Library Architecture:**
   * Seluruh logika backend (`core/` dan `apps/`) di-deploy sebagai **Google Apps Script Library (`KopdesEngine`)**.
   * Klien (Koperasi Desa) hanya menyalin file jembatan tipis (`client-template/Code.js`) yang terhubung ke Library Master.
   * **Hasil:** Source code Anda 100% aman (tidak bisa dicuri/dijual lagi) dan data warga tetap aman di Google Drive desa.
4. **License Enforcement (Fail-Closed):**
   * `LicenseService.require()` dipanggil saat operasi penulisan data utama (*checkout* order). Cache validasi disimpan di `CacheService`.
5. **Single Unified Application Architecture:**
   * Seluruh antarmuka (Toko Pembeli, Panel Admin, dan Mode Kurir) berada dalam **1 aplikasi yang sama**, diatur melalui parameter routing `?page=` dan *Safe Navigation Message Bus*.

---

## 4. Struktur Direktori Proyek

```text
kopdes-tools/
├── .clasp.json                  ← Konfigurasi clasp (rootDir: ./src)
├── appsscript.json              ← Manifest GAS root
├── ARCHITECTURE.md              ← Dokumentasi arsitektur sistem & spesifikasi teknis
├── README.md                    ← Panduan umum penggunaan & deployment
├── client-template/             ← Template script jembatan untuk Koperasi Klien
│   ├── Code.js                  ← Shell script 1-file yang disalin ke Apps Script Klien
│   └── README.md                ← Panduan instalasi 2 menit untuk Koperasi Klien
├── vercel-app/                  ← PWA Wrapper & Custom Domain (Vercel)
│   ├── index.html               ← Wrapper iframe GAS, Service Worker & PWA Install handler
│   ├── manifest.json            ← PWA Manifest (Nama Kopdes, icons, theme color)
│   ├── sw.js                    ← Service Worker PWA
│   ├── vercel.json              ← Konfigurasi routing rewrite Vercel
│   └── icons/                   ← Icon PWA (192x192, 512x512)
└── src/                         ← Sumber kode utama yang di-push ke GAS
    ├── appsscript.json          ← Manifest GAS (Timezone Jakarta, V8 runtime)
    ├── Code.js                  ← Entry point: doGet() router + endpoint exposed + KopdesEngine exports
    ├── Seed.js                  ← Script seed data demo (Akun, Produk & Gambar)
    ├── core/
    │   ├── database/
    │   │   ├── Database.js      ← ORM abstraction: getAll, getById, insert, update, query
    │   │   └── SheetAdapter.js  ← Low-level Google Sheets adapter (SpreadsheetApp & openById)
    │   ├── auth/
    │   │   └── Auth.js          ← RBAC, Normalisasi Phone, Login PIN, Multi-Role
    │   └── license/
    │       └── LicenseService.js← Validasi lisensi Kopdes Micro-SaaS
    └── apps/
        └── gerai-online/
            ├── controllers/
            │   ├── ProductController.js  ← CRUD produk, filter promo & upload gambar Drive
            │   └── OrderController.js   ← createOrder, updateOrderStatus, updateOrderItems
            └── views/
                ├── styles.html  ← CSS Global Design System & Variables
                ├── index.html   ← Storefront Pembeli (Katalog, Keranjang, Checkout, Tracking)
                ├── admin.html   ← Panel Pengurus (Produk, Pesanan, Profil Desa, Penugasan Kurir)
                └── courier.html ← Portal Khusus Kurir (Mobile-First, Bukti Foto, Struk Thermal POS)
```

---

## 5. Halaman & Web App Routing

Routing halaman ditangani secara terpusat oleh `doGet()` di `src/Code.js` dan dihubungkan secara mulus dengan wrapper Vercel.

| URL Path | Parameter GAS | Target View | Deskripsi & Akses Pengguna |
| :--- | :--- | :--- | :--- |
| `/` | `?page=index` | `index.html` | **Storefront Publik:** Belanja, katalog produk, keranjang, checkout COD, riwayat & pelacakan pesanan pembeli. |
| `/admin` | `?page=admin` | `admin.html` | **Panel Pengurus:** Manajemen katalog produk, update pesanan, penyesuaian stok kosong, profil desa, dan penugasan kurir. *(Hanya role `admin` & `pengurus`)*. |
| `/courier` / `/kurir` | `?page=courier` | `courier.html` | **Mode Khusus Kurir:** Dashboard tugas antar aktif, rute Google Maps 1-klik, WhatsApp pembeli, upload foto bukti serah terima kamera HP, struk POS Bluetooth, dan total setoran kas COD hari ini. *(Hanya role `kurir`, `admin`, `pengurus`)*. |

---

## 6. Autentikasi & Role-Based Access Control (RBAC)

Sistem menggunakan autentikasi berbasis Kredensial (Nomor HP / Email / Username) + PIN 4-digit.

### Hak Akses (Roles) & Ketentuan Navigasi:
1. **Super Admin (`admin`)**:
   * Memiliki akses menyeluruh ke Toko, Panel Admin, Profil Desa, dan Mode Kurir.
2. **Pengurus Koperasi (`pengurus`)**:
   * Akses ke Toko dan Panel Admin untuk mengelola stok, memvalidasi pesanan masuk, dan menugaskan kurir.
3. **Kurir Pengantar (`kurir`)**:
   * **Akses Khusus:** Saat login, sistem **langsung otomatis mengarahkan ke Mode Kurir (`courier.html`)**.
   * Dilarang membuka Panel Admin (`admin.html`) dan dialihkan langsung ke halaman kurir jika mencoba mengaksesnya.
   * Header mode kurir bersih dari tautan admin/toko umum, hanya memiliki tombol aksi tugas dan tombol Keluar (Logout).
4. **Anggota Koperasi (`anggota`)**:
   * Warga desa terdaftar. Data nama, nomor HP, dan alamat otomatis terisi saat checkout. Dilarang mengakses Panel Admin dan Mode Kurir.
5. **Pengunjung Umum (`guest`)**:
   * Dapat berbelanja bebas dan melacak pesanan berdasarkan nomor HP / ID pesanan.

### Daftar Akun Demo Siap Pakai (PIN: `1234`):
* 👑 **Super Admin:** `081100000001` / `admin@kopdes.id` / Username: `admin` (*Ketua Koperasi*)
* 👔 **Pengurus 1:** `081100000002` / `budi.pengurus@kopdes.id` (*Budi Santoso - Manajer Gerai*)
* 👔 **Pengurus 2:** `081100000003` / `siti.pengurus@kopdes.id` (*Siti Aminah - Bendahara Gerai*)
* 🛵 **Kurir 1:** `081300000001` / `kurir1@kopdes.id` / Alias: `kurir` (*Kurir Budi*)
* 🛵 **Kurir 2:** `081300000002` / `kurir2@kopdes.id` (*Kurir Ahmad Fauzi*)
* 👥 **Anggota Koperasi (10 Akun):** `081200000001` s/d `081200000010` (*Ahmad Fauzi, Dewi Lestari, Bambang P, dll.*)

---

## 7. Database Schema (Google Sheets)

### 1. Tabel: `products`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | String | Primary key unik produk |
| `name` | String | Nama barang / produk gerai |
| `description` | String | Deskripsi produk |
| `price` | Number | Harga reguler (Rupiah) |
| `promoPrice` | Number | Harga promo coret (opsional) |
| `stock` | Number | Jumlah stok fisik |
| `category` | String | Kategori (Sembako, Makanan, Minuman, dll.) |
| `imageUrl` | String | URL gambar produk (Google Drive / CDN) |
| `isPromo` | Boolean | Status produk promo |
| `isActive` | Boolean | Tampil di etalase toko |
| `createdAt` / `updatedAt` | ISO String | Timestamp pencatatan data |

### 2. Tabel: `orders`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | String | Primary key ID Pesanan |
| `userId` | String | ID akun pembeli (jika login) |
| `customerName` | String | Nama lengkap pembeli |
| `customerPhone` | String | Nomor WhatsApp pembeli |
| `customerAddress`| String | Alamat pengantaran di desa |
| `items` | JSON String | Array item belanja (nama, qty, harga, `isUnavailable`) |
| `total` | Number | Total tagihan tunai COD aktif |
| `status` | String | `pending` ➔ `processing` ➔ `delivering` ➔ `completed` / `cancelled` |
| `paymentMethod` | String | Metode bayar (`COD` / Tunai) |
| `courierName` | String | Nama kurir yang ditugaskan |
| `deliveryProofUrl` | String | URL foto bukti serah terima dari kamera HP kurir |
| `completedAt` | ISO String | Waktu penyelesaian pengantaran |
| `notes` | String | Catatan pembeli / catatan penyesuaian stok |
| `createdAt` / `updatedAt` | ISO String | Timestamp pembuatan & modifikasi |

### 3. Tabel: `users`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | String | Primary key ID pengguna |
| `name` | String | Nama lengkap pengguna / kurir / pengurus |
| `email` | String | Alamat email terdaftar |
| `phone` | String | Nomor HP / WhatsApp (Format baku `08xxx`) |
| `role` | String | `admin` / `pengurus` / `kurir` / `anggota` |
| `pin` | String | PIN keamanan 4-digit |
| `address` | String | Alamat domisili |
| `isActive` | Boolean | Status aktif akun |

---

## 8. Alur Fitur Unggulan Sistem

### A. Penyesuaian Ketersediaan Stok (*Item Availability Adjustment*)
1. Saat pesanan masuk (`pending`), pengurus memeriksa ketersediaan barang di gerai.
2. Jika ada item yang kosong, pengurus klik tombol **`[🚫 Stok Kosong]`** pada baris barang di modal detail pesanan.
3. Total tagihan otomatis terhitung ulang secara *real-time* (item kosong dicoret dan dihitung Rp 0).
4. Pengurus klik **`[💾 Simpan Penyesuaian]`** lalu klik **`[💬 Konfirmasi WA Pembeli]`** untuk mengirim konfirmasi perubahan tagihan otomatis ke WhatsApp pembeli.
5. Pada pelacakan pesanan pembeli (`index.html`) dan surat jalan kurir, item yang habis diberi badge merah *Stok Habis* sehingga pembeli dan kurir mengetahui nominal tagihan COD yang sebenarnya.

### B. Integrasi Penugasan Kurir & Operasional Pengantaran
1. Saat pesanan siap dikemas (`processing`), Admin memilih kurir dari **Dropdown Kurir Terdaftar** (otomatis membaca data akun kurir di tabel `users`).
2. Pesanan beralih ke status `delivering`.
3. Kurir membuka aplikasi di HP ➔ Login dengan nomor HP kurir ➔ Langsung masuk ke **Mode Kurir**.
4. Kurir melihat daftar tugas aktif, membuka navigasi Google Maps atau menghubungi pembeli via WhatsApp dengan 1 ketukan.
5. Saat tiba di lokasi:
   * Kurir klik **`[📸 Foto & Selesai]`** ➔ Kamera HP aktif mengambil foto penyerahan barang/uang ➔ Foto dikompresi otomatis & diunggah ke Google Drive.
   * Kurir klik **"Selesai & Lunas"** ➔ Status pesanan otomatis menjadi `completed` dengan nama kurir tercatat rapi.
   * Kurir dapat mencetak bukti pembayaran ke printer thermal mini Bluetooth (58mm).
6. Di sore hari, kurir membuka tab **Riwayat Selesai Hari Ini** untuk melihat rekapan total uang tunai COD yang wajib disetorkan ke Bendahara Koperasi.

### C. Custom Logo & Profil Desa
* Logo Koperasi Desa dapat diunggah langsung dari tab **Profil Desa** di Panel Admin.
* File gambar diunggah ke Google Drive dan langsung terdistribusi secara dinamis ke Favicon, Header Toko, Header Admin, Mode Kurir, dan Struk Thermal.

---

## 9. Konfigurasi Script Properties (Google Apps Script Master)

| Property Key | Contoh Nilai | Deskripsi |
| :--- | :--- | :--- |
| `KOPDES_NAME` | `Samatan` | Nama Koperasi Desa (tampil di navbar & judul) |
| `VILLAGE_NAME` | `Desa Samatan` | Nama Desa |
| `VILLAGE_ADDRESS`| `Jl. Raya Desa Samatan No. 12` | Alamat kantor Koperasi |
| `VILLAGE_CONTACT`| `081234567890` | Kontak resmi pengurus Kopdes |
| `LOGO_URL` | `https://lh3.googleusercontent.com/d/...` | URL logo resmi koperasi desa |
| `HERO_BG_URL` | `https://images.unsplash.com/...` | Gambar background hero banner storefront |
| `LICENSE_TOKEN` | *(Signed JWT Token)* | Token lisensi Micro-SaaS |
| `ADMIN_PIN` | `1234` | Master PIN cadangan |

---

## 10. Perintah Deployment & Pemeliharaan

```bash
# Push perubahan sumber kode ke Google Apps Script Master
clasp push --force

# Buat versi baru Library
clasp create-version "library-release-note"

# Update deployment ID aktif
clasp update-deployment AKfycbwKJn5sJ8lhSBbHs8gclTI-GneWRy6DU9HMqPxfbz0mXGkrwr-fmB6TkAm9w-4LXvv41A
```