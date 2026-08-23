# 🛒 Kopdes Gerai Online — Panduan Penggunaan & Dokumentasi Sistem

**Kopdes Gerai Online** adalah sistem aplikasi belanja digital (Micro-SaaS) berbasis cloud terpadu untuk Koperasi Desa (Kopdes), yang mengintegrasikan Storefront Pembeli, Panel Pengurus Koperasi, dan Portal Pengantaran Khusus Kurir dalam **1 aplikasi terpadu**.

* 🌐 **Aplikasi Web & PWA:** [https://kopdes-samatan.vercel.app](https://kopdes-samatan.vercel.app)
* ⚡ **Backend Engine:** Google Apps Script & Google Sheets
* 📁 **Penyimpanan Media:** Google Drive (*Folder: Gerai Kopdes Assets*)

---

## 🔑 Kredensial Akun Pengguna (PIN Default: `1234`)

| Role / Jabatan | Nomor HP / Username | Email | Nama Akun | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `081100000001` / `admin` | `admin@kopdes.id` | Ketua Koperasi | Akses penuh Toko, Admin Panel, Profil Desa, & Sistem |
| 👔 **Pengurus 1** | `081100000002` | `budi.pengurus@kopdes.id` | Budi Santoso | Kelola Produk, Stok, Validasi Pesanan, & Penugasan Kurir |
| 👔 **Pengurus 2** | `081100000003` | `siti.pengurus@kopdes.id` | Siti Aminah | Kas Koperasi & Validasi Pesanan |
| 🛵 **Kurir 1** | `081300000001` / `kurir` | `kurir1@kopdes.id` | Kurir Budi | Tugas Antar, Foto Bukti Serah Terima, & Struk Thermal POS |
| 🛵 **Kurir 2** | `081300000002` | `kurir2@kopdes.id` | Kurir Ahmad Fauzi | Tugas Antar, Foto Bukti Serah Terima, & Struk Thermal POS |
| 👥 **Anggota (10 Warga)**| `081200000001` s/d `081200000010` | `ahmad.fauzi@...` | Ahmad Fauzi, Dewi, dll. | Belanja di Toko, Riwayat & Pelacakan Pesanan |

---

## 🛠️ Panduan Setup Awal & Inisialisasi Aplikasi (Fresh Install)

Berikut adalah panduan langkah demi langkah saat menyiapkan aplikasi Kopdes Tools dari awal:

### Langkah 1: Konfigurasi Script Properties (GAS)
1. Buka project script di **Google Apps Script Editor**.
2. Masuk ke menu **Project Settings** (ikon gerigi ⚙️ di sebelah kiri) ➔ gulir ke bagian **Script Properties**.
3. Tambahkan properti berikut:
   * `KOPDES_NAME` : `Samatan` (atau nama koperasi desa Anda)
   * `VILLAGE_NAME` : `Desa Samatan`
   * `VILLAGE_ADDRESS` : `Jl. Raya Desa Samatan No. 12`
   * `VILLAGE_CONTACT` : `081234567890`
   * `LOGO_URL` : URL gambar logo resmi koperasi
   * `HERO_BG_URL` : URL gambar background banner utama toko
   * `ADMIN_PIN` : `1234` (Master PIN pengurus)

### Langkah 2: Inisialisasi Database (`setupApp`)
1. Di Google Apps Script Editor, buka file `Code.gs` / `Code.js`.
2. Pada dropdown fungsi di toolbar atas, pilih fungsi **`setupApp`**.
3. Klik tombol **▶️ Run**.
4. Berikan izin otorisasi akses Google Spreadsheet & Google Drive jika diminta.
5. Sistem akan otomatis membuat tab sheet `products`, `orders`, dan `users` dengan header kolom yang lengkap.

### Langkah 3: Pengisian Data Awal Demo (`seedData`)
1. Pada dropdown fungsi di toolbar atas, pilih fungsi **`seedData`**.
2. Klik tombol **▶️ Run**.
3. Fungsi ini otomatis mengisi:
   * **Katalog Produk:** 25+ produk sembako dan kebutuhan harian desa lengkap dengan foto, kategori, dan promo diskon.
   * **Akun Pengguna:** Super Admin, 2 Akun Pengurus, 2 Akun Kurir (`Kurir Budi` & `Kurir Ahmad Fauzi`), dan 10 Akun Anggota Koperasi.
   * **Pesanan Sample:** 4 pesanan contoh dalam berbagai status (*pending*, *processing*, *delivering*, dan *completed*) untuk pengujian alur Toko ➔ Admin ➔ Kurir.

### Langkah 4: Publikasi Web App & PWA Vercel
1. Klik tombol **Deploy** di pojok kanan atas ➔ pilih **New Deployment** (atau **Manage Deployments**).
2. Konfigurasi:
   * **Select type:** Web app
   * **Execute as:** *Me (email Anda)*
   * **Who has access:** *Anyone (Siapa saja)*
3. Salin Web App URL atau Deployment ID.
4. Pada file `vercel-app/index.html`, pastikan `GAS_BASE_URL` mengarah ke Deployment ID aktif tersebut.
5. Deploy folder `vercel-app/` ke Vercel untuk mengaktifkan custom domain dan dukungan PWA APK.

---

## 📱 Panduan Pemasangan Aplikasi di HP (PWA APK / Add to Home Screen)

Aplikasi dapat dipasang di layar utama smartphone layaknya aplikasi Android/iOS asli:

1. Buka tautan **`https://kopdes-samatan.vercel.app`** di browser smartphone (Google Chrome untuk Android, Safari untuk iPhone).
2. **Android (Chrome):**
   * Saat pertama kali membuka, akan muncul banner **"Pasang Aplikasi Kopdes"** di bagian bawah layar. Klik **`[Install]`**.
   * Atau ketuk menu titik tiga (⋮) di pojok kanan atas ➔ pilih **"Instal Aplikasi"** / **"Tambahkan ke Layar Utama"**.
3. **iPhone (Safari):**
   * Ketuk tombol **Bagikan (Share ⎋)** di baris bawah Safari ➔ gulir ke bawah dan pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)**.
4. Ikon **Kopdes Samatan** akan muncul di layar utama HP dan dapat dibuka secara *fullscreen* tanpa *browser bar*.

---

## 🛵 Panduan Operasional Kurir Pengantaran

1. **Masuk ke Mode Kurir:**
   * Buka aplikasi, masuk/login menggunakan nomor HP Kurir (misal: `081300000001` / PIN `1234`).
   * Sistem akan **langsung otomatis mengarahkan ke Mode Kurir** (`/courier`).
2. **Menjalankan Pengantaran:**
   * Pada tab **Pengantaran Aktif**, periksa daftar pesanan yang siap dikirim.
   * Ketuk **`[🗺️ Buka Maps]`** untuk membuka panduan rute GPS langsung ke rumah pembeli.
   * Ketuk **`[💬 WhatsApp]`** untuk menyapa pembeli bahwa pesanan sedang dalam perjalanan.
3. **Penyelesaian & Foto Bukti Serah Terima:**
   * Saat barang dan uang tunai COD diterima, ketuk **`[📸 Foto & Selesai]`**.
   * Kamera HP akan aktif mengambil foto bukti serah terima (otomatis dikompresi agar hemat kuota).
   * Ketuk **`[Selesai & Lunas]`** ➔ Pesanan otomatis berstatus lunas dan tercatat atas nama kurir yang bertugas.
4. **Cetak Struk Thermal Bluetooth (Opsional):**
   * Ketuk **`[🖨️ Struk]`** untuk mencetak struk thermal 58mm ke printer Bluetooth mini.
5. **Setoran Kas COD di Sore Hari:**
   * Buka tab **Selesai Hari Ini** untuk melihat total uang tunai COD yang wajib disetorkan ke Bendahara Koperasi.

---

## 👔 Panduan Pengurus / Administrator Koperasi

1. **Mengakses Panel Admin:**
   * Login dengan akun Pengurus / Super Admin (`081100000001` / PIN `1234`).
   * Akses URL `/admin` atau klik menu Profil ➔ **`[Masuk ke Panel Admin]`**.
2. **Menangani Pesanan & Stok Habis (Item Availability):**
   * Buka tab **Pesanan** ➔ klik pesanan berstatus *Pending*.
   * Jika ada barang yang kosong di gerai, klik tombol **`[🚫 Stok Kosong]`** pada baris barang tersebut.
   * Tagihan COD akan otomatis terkalkulasi ulang. Klik **`[💾 Simpan Penyesuaian]`** lalu klik **`[💬 Konfirmasi WA Pembeli]`** untuk mengirim pemberitahuan otomatis ke WhatsApp pembeli.
3. **Menugaskan Kurir:**
   * Setelah pesanan dikemas, pilih kurir dari **Dropdown Kurir Terdaftar** (misal: *Kurir Budi*).
   * Klik **`[Tugaskan Kurir & Mulai Pengantaran]`** ➔ Pesanan otomatis muncul di HP kurir yang bersangkutan.
4. **Kustomisasi Logo & Profil Desa:**
   * Buka tab **Profil Desa & Koperasi**.
   * Unggah logo resmi desa/koperasi ➔ Logo otomatis diperbarui di semua halaman, tab browser, dan struk belanja.

---

## 💻 Panduan Teknis & Pemeliharaan Kode

```bash
# Push perubahan kode ke Google Apps Script
clasp push --force

# Membuat versi baru dan memperbarui deployment aktif
clasp create-version "update-note"
clasp update-deployment AKfycbwKJn5sJ8lhSBbHs8gclTI-GneWRy6DU9HMqPxfbz0mXGkrwr-fmB6TkAm9w-4LXvv41A
```

Untuk detail arsitektur teknis lengkap, silakan lihat dokumen [ARCHITECTURE.md](file:///Users/thorsi/Documents/work/kopdes-tools/ARCHITECTURE.md).
