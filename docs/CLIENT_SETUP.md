# 📱 Panduan Setup Client — Kopdes Tools (Managed SaaS Library)

> **Dokumen ini ditujukan untuk Koperasi Desa yang akan menggunakan sistem Kopdes Gerai Online.**
> Estimasi waktu setup: **10–15 menit**.

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menyiapkan:
- ✅ Akun Google (Gmail) yang aktif
- ✅ **Spreadsheet ID** dan **Script ID** dari vendor (penyedia layanan)
- ✅ Koneksi internet stabil

---

## 🚀 Langkah 1: Buat Google Spreadsheet Baru

1. Buka [Google Drive](https://drive.google.com) milik Koperasi Desa Anda.
2. Klik tombol **`+ Baru`** ➔ pilih **Google Spreadsheet**.
3. Beri nama file, misalnya: **`Database Kopdes [Nama Desa]`**
   *(contoh: `Database Kopdes Lenteng`)*.
4. Salin **Spreadsheet ID** dari URL browser:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID_ANDA]/edit
   ```
   👉 Kirimkan **Spreadsheet ID** tersebut ke penyedia layanan untuk didaftarkan lisensinya.

---

## 🚀 Langkah 2: Buka Apps Script

1. Dari Google Spreadsheet yang baru dibuat, klik menu:
   **Ekstensi (Extensions)** ➔ **Apps Script**
2. Tab baru akan terbuka berisi **Google Apps Script Editor**.

---

## 🚀 Langkah 3: Tambahkan Library KopdesEngine

1. Di bilah menu kiri Apps Script, klik tanda tambah **`+`** di sebelah tulisan **Libraries (Pustaka)**.
2. Masukkan **Script ID Core Engine** berikut:
   ```
   1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y
   ```
3. Klik tombol **Look up (Cari)**.
4. Pilih **versi terbaru** dari dropdown (tanyakan ke penyedia layanan untuk versi terkini).
5. Pastikan kolom **Identifier** tertulis: **`KopdesEngine`** *(jangan diubah)*.
6. Klik **Add (Tambahkan)**.

> ✅ Library **`KopdesEngine`** kini muncul di bilah menu kiri Apps Script Anda.

---

## 🚀 Langkah 4: Salin Kode Client Shell

1. Hapus seluruh isi file **`Code.gs`** yang ada di editor.
2. Salin dan tempelkan seluruh kode berikut:

```javascript
/**
 * KOPDES GERAI ONLINE — CLIENT SHELL SCRIPT
 * Versi ini adalah jembatan tipis yang menghubungkan
 * spreadsheet Anda ke Core Engine (KopdesEngine Library).
 *
 * JANGAN UBAH KODE INI KECUALI DIARAHKAN OLEH PENYEDIA LAYANAN.
 */
var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  return KopdesEngine.serve(e, { spreadsheetId: SPREADSHEET_ID });
}

function include(filename) {
  return KopdesEngine.include(filename);
}

function setupApp()   { return KopdesEngine.setupApp({ spreadsheetId: SPREADSHEET_ID }); }
function seedData()   { return KopdesEngine.seedData({ spreadsheetId: SPREADSHEET_ID }); }

// --- Bridge API ---
function getActiveProducts()                          { return KopdesEngine.getActiveProducts(); }
function getAllProducts(uid)                          { return KopdesEngine.getAllProducts(uid); }
function getProductById(id)                          { return KopdesEngine.getProductById(id); }
function getProductCategories()                      { return KopdesEngine.getProductCategories(); }
function createProduct(data, uid)                    { return KopdesEngine.createProduct(data, uid); }
function updateProduct(id, data, uid)                { return KopdesEngine.updateProduct(id, data, uid); }
function deleteProduct(id, uid)                      { return KopdesEngine.deleteProduct(id, uid); }
function uploadImage(base64, name, type)             { return KopdesEngine.uploadImage(base64, name, type); }
function uploadImageFile(base64, name, type)         { return KopdesEngine.uploadImageFile(base64, name, type); }
function createNewOrder(orderData)                   { return KopdesEngine.createNewOrder(orderData); }
function createOrder(orderData)                      { return KopdesEngine.createOrder(orderData); }
function getMyOrders(uid, phone)                     { return KopdesEngine.getMyOrders(uid, phone); }
function getCustomerOrders(uid, phone)               { return KopdesEngine.getCustomerOrders(uid, phone); }
function getAllOrders(uid)                            { return KopdesEngine.getAllOrders(uid); }
function getOrderById(id)                            { return KopdesEngine.getOrderById(id); }
function updateOrderStatus(id, status, uid, extra)   { return KopdesEngine.updateOrderStatus(id, status, uid, extra); }
function updateOrderItems(id, items, total, notes, uid) { return KopdesEngine.updateOrderItems(id, items, total, notes, uid); }
function getCourierOrders(name)                      { return KopdesEngine.getCourierOrders(name); }
function getCourierBootstrapData(uid, name)          { return KopdesEngine.getCourierBootstrapData(uid, name); }
function completeCourierDelivery(payload)            { return KopdesEngine.completeCourierDelivery(payload); }
function getVillageProfile()                         { return KopdesEngine.getVillageProfile(); }
function updateVillageProfile(data, uid)             { return KopdesEngine.updateVillageProfile(data, uid); }
function updateAppSettings(settings, uid)            { return KopdesEngine.updateVillageProfile(settings, uid); }
function getAuthStatus(uid)                          { return KopdesEngine.getAuthStatus(uid); }
function loginUser(payload, pin)                     { return KopdesEngine.loginUser(payload, pin); }
function registerUser(data)                          { return KopdesEngine.registerUser(data); }
function getAllUsers(uid)                             { return KopdesEngine.getAllUsers(uid); }
function getCouriers()                               { return KopdesEngine.getCouriers(); }
function checkLicense()                              { return KopdesEngine.checkLicense(); }
function checkAppLicense()                           { return KopdesEngine.checkAppLicense(); }
```

3. Klik **Save (Simpan 💾)** atau tekan **Cmd+S** / **Ctrl+S**.

---

## 🚀 Langkah 5: Inisialisasi Database (setupApp)

1. Pada dropdown fungsi di toolbar atas editor, pilih fungsi: **`setupApp`**
2. Klik tombol **▶️ Run (Jalankan)**.
3. Jika muncul popup **"Otorisasi dibutuhkan"**:
   - Klik **Tinjau Izin (Review Permissions)**.
   - Pilih akun Google Koperasi Anda.
   - Klik **Lanjutkan (Continue)** ➔ Klik **Izinkan (Allow)**.
4. Tunggu hingga selesai. Tabel `products`, `orders`, dan `users` otomatis terbuat di Google Spreadsheet Anda.

---

## 🚀 Langkah 6: Isi Data Demo (seedData)

1. Pada dropdown fungsi, pilih fungsi: **`seedData`**
2. Klik tombol **▶️ Run (Jalankan)**.
3. Proses ini secara otomatis mengisi:
   - 📦 **25+ Produk Sembako & Kebutuhan Desa** (lengkap dengan foto & kategori)
   - 👥 **Akun Demo:** Super Admin, 2 Pengurus, 2 Kurir, dan 10 Anggota Koperasi
   - 🛒 **4 Pesanan Contoh** untuk pengujian alur Toko ➔ Admin ➔ Kurir

---

## 🚀 Langkah 7: Publikasi Web App

1. Klik tombol **Deploy** di pojok kanan atas ➔ pilih **New deployment (Deployment baru)**.
2. Klik ikon ⚙️ lalu pilih **Web app**.
3. Konfigurasi deployment:

   | Pengaturan | Nilai |
   | :--- | :--- |
   | **Description** | `Kopdes Gerai Online - v1` |
   | **Execute as** | `Me (email Anda)` |
   | **Who has access** | `Anyone` |

4. Klik **Deploy**.
5. Klik **Authorize access** jika diminta.
6. **Salin Web App URL** yang tampil di layar:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> 🎉 **Selamat! Toko online Koperasi Desa Anda sudah LIVE dan siap digunakan!**

---

## 🚀 Langkah 8 (Opsional): Pasang PWA di HP Warga

Bagikan link toko kepada warga desa. Mereka dapat memasang aplikasi seperti APK Android / iOS:

**Android (Chrome):**
- Buka link di Chrome ➔ Akan muncul banner **"Pasang Aplikasi Kopdes"** di bawah layar ➔ Klik **Install**.

**iPhone (Safari):**
- Buka link di Safari ➔ Ketuk tombol **Bagikan (Share ⎋)** ➔ Pilih **"Tambahkan ke Layar Utama"**.

---

## 🔑 Kredensial Akun Demo (PIN: `1234`)

| Role | Nomor HP / Username | Hak Akses |
| :--- | :--- | :--- |
| 👑 **Super Admin** | `081100000001` / `admin` | Akses penuh semua fitur |
| 👔 **Pengurus 1** | `081100000002` | Kelola produk, pesanan, kurir |
| 👔 **Pengurus 2** | `081100000003` | Validasi pesanan & kas |
| 🛵 **Kurir 1** | `081300000001` / `kurir` | Mode pengantaran |
| 🛵 **Kurir 2** | `081300000002` | Mode pengantaran |
| 👥 **Anggota** | `081200000001` s/d `081200000010` | Belanja & lacak pesanan |

> **Penting:** Segera ganti PIN akun Admin melalui **Panel Admin ➔ Profil** setelah pertama kali login!

---

## 🛠️ Kustomisasi Nama & Logo Koperasi

Setelah login sebagai Admin, buka **Panel Admin ➔ Tab Profil Desa & Koperasi**:
- Unggah **Logo Koperasi** (otomatis terpasang di semua halaman).
- Ubah **Nama Koperasi**, **Nama Desa**, **Alamat**, dan **Nomor Kontak**.
- Ganti **Gambar Banner** halaman utama toko.

---

## 🔄 Cara Memperbarui Versi Aplikasi (Saat Ada Fitur Baru)

Ketika penyedia layanan merilis fitur baru atau perbaikan sistem, Anda **tidak perlu mengubah atau menyalin kode ulang**. Cukup lakukan 3 langkah mudah berikut (hanya 30 detik):

1. Buka **Google Spreadsheet** Koperasi Anda ➔ **Ekstensi** ➔ **Apps Script**.
2. Pada bilah menu kiri, klik nama library **`KopdesEngine`** (di bawah tulisan *Libraries*):
   - Klik dropdown **Version (Versi)** ➔ pilih **nomor versi terbaru** yang diinfokan penyedia layanan.
   - Klik tombol **Save (Simpan)**.
3. Klik tombol **Deploy** di pojok kanan atas ➔ pilih **Manage deployments (Kelola deployment)**:
   - Klik ikon **Pensil (Edit ✏️)** pada deployment yang sedang aktif.
   - Pada baris **Version**, klik dropdown lalu pilih **"New version" (Versi baru)**.
   - Klik tombol biru **Deploy**.

> ✅ Selesai! Web App toko online Anda otomatis menggunakan fitur dan perbaikan terbaru.

---

## ❓ FAQ (Tanya Jawab)

**Q: Kapan saya harus melakukan Deploy New Version?**
> Hanya saat ada pembaruan versi library dari penyedia layanan. Menambah produk baru, mengubah stok, memproses pesanan, mengganti profil desa, atau perpanjangan lisensi **TIDAK PERLU** deploy ulang.

**Q: Apakah data transaksi dan data warga disimpan di mana?**
> Seluruh data tersimpan aman di Google Spreadsheet Anda sendiri di Google Drive Koperasi. Penyedia layanan tidak dapat mengakses data pribadi warga Anda.

**Q: Apa yang terjadi jika masa langganan koperasi habis?**
> Aplikasi toko akan otomatis terkunci dengan pesan informasi. Warga tidak dapat berbelanja sementara waktu sampai langganan diperpanjang melalui penyedia layanan.

**Q: Apakah perlu server atau hosting berbayar?**
> Tidak. Seluruh sistem berjalan di Google Apps Script & Google Sheets (infrastruktur Google Workspace) yang gratis dan andal.

---

## 📞 Butuh Bantuan?

Hubungi penyedia layanan Kopdes Tools melalui:
- 💬 WhatsApp: *(nomor penyedia layanan)*
- 📧 Email: *(email penyedia layanan)*
