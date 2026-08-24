# 🛒 Kopdes Gerai Online — Panduan Penggunaan & Dokumentasi Sistem

**Kopdes Gerai Online** adalah sistem aplikasi belanja digital (*Micro-SaaS*) berbasis cloud terpadu untuk Koperasi Desa (Kopdes), yang mengintegrasikan Storefront Pembeli, Panel Pengurus Koperasi, dan Portal Pengantaran Khusus Kurir dalam **1 aplikasi terpadu**.

* 🌐 **Aplikasi Web & PWA Master:** [https://kopdes-samatan.vercel.app](https://kopdes-samatan.vercel.app)
* ⚡ **Core Library ID:** `1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y` (Versi: `119`)
* 📁 **Penyimpanan Media:** Google Drive (*Folder: Gerai Kopdes Assets*)
* 🏢 **Arsitektur Distribusi:** Managed SaaS Library Mode (Anti-Bypass & Anti-Jual Ulang)

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

## 🏢 Panduan Pemasangan Klien Baru (Managed SaaS Library Mode)

Dengan arsitektur **Managed SaaS Library**, Koperasi Desa klien mendapatkan aplikasi yang berjalan di Google Drive mereka sendiri, namun **source code logika bisnis dan UI Anda tetap 100% aman dan tidak bisa dicuri/dijual lagi**.

### Langkah 1: Klien Menyiapkan Google Sheet
1. Buka Google Drive Koperasi Desa ➔ Buat **Google Spreadsheet Baru** (Beri nama misal: `Database Kopdes Lenteng`).
2. Buka menu **Ekstensi (Extensions)** ➔ **Apps Script**.

### Langkah 2: Tambahkan Library Core Engine
1. Di bilah menu kiri Apps Script, klik tanda tambah (**+**) di sebelah **Libraries (Pustaka)**.
2. Masukkan **Script ID Core Engine**:
   ```text
   1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y
   ```
3. Klik **Look up (Cari)**.
4. Pilih versi terbaru (**`119`**), pastikan Identifier tertulis: **`KopdesEngine`**.
5. Klik **Add (Tambahkan)**.

### Langkah 3: Salin Kode Client Shell
1. Buka file `Code.gs` di Apps Script Klien.
2. Hapus kodenya dan ganti dengan isi dari file **[`client-template/Code.js`](file:///Users/thorsi/Documents/work/kopdes-tools/client-template/Code.js)**.
3. Klik **Save (Simpan 💾)**.

### Langkah 4: Inisialisasi Database Klien
1. Pada dropdown toolbar fungsi di atas, pilih fungsi **`setupApp`** ➔ Klik **▶️ Run**.
   * *Google Sheet klien otomatis terbuat tabel `products`, `orders`, dan `users`.*
2. Pilih fungsi **`seedData`** ➔ Klik **▶️ Run**.
   * *Otomatis mengisi 25+ produk sembako dan akun demo ke spreadsheet klien.*

### Langkah 5: Deploy Web App Klien
1. Klik tombol **Deploy** di kanan atas ➔ **New deployment**.
2. Pilih **Web app**, set *Execute as: Me*, *Who has access: Anyone*.
3. Klik **Deploy** ➔ Salin **Web app URL** yang dihasilkan.
4. Toko Online Koperasi Desa sudah langsung aktif dan siap digunakan!

---

## 📱 Panduan Pemasangan Aplikasi di HP (PWA APK / Add to Home Screen)

Aplikasi dapat dipasang di layar utama smartphone layaknya aplikasi Android/iOS asli:

1. Buka tautan web app di browser smartphone (Google Chrome untuk Android, Safari untuk iPhone).
2. **Android (Chrome):**
   * Saat pertama kali membuka, akan muncul banner **"Pasang Aplikasi Kopdes"** di bagian bawah layar. Klik **`[Install]`**.
   * Atau ketuk menu titik tiga (⋮) di pojok kanan atas ➔ pilih **"Instal Aplikasi"** / **"Tambahkan ke Layar Utama"**.
3. **iPhone (Safari):**
   * Ketuk tombol **Bagikan (Share ⎋)** di baris bawah Safari ➔ gulir ke bawah dan pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)**.
4. Ikon **Kopdes Online** akan muncul di layar utama HP dan dapat dibuka secara *fullscreen* tanpa *browser bar*.

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

## 💻 Panduan Teknis & Pemeliharaan Kode Master

```bash
# Push perubahan kode ke Google Apps Script Master
clasp push --force

# Membuat versi baru Library untuk seluruh klien
clasp create-version "library-release-note"
clasp update-deployment AKfycbwKJn5sJ8lhSBbHs8gclTI-GneWRy6DU9HMqPxfbz0mXGkrwr-fmB6TkAm9w-4LXvv41A
```

Untuk detail arsitektur teknis lengkap, silakan lihat dokumen [ARCHITECTURE.md](file:///Users/thorsi/Documents/work/kopdes-tools/ARCHITECTURE.md).
