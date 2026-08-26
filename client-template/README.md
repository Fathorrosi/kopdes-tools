# 📦 Panduan Pemasangan Klien (Managed SaaS Library Mode)

Dokumen ini adalah panduan bagi **Developer / Koperasi Desa** untuk memasang sistem Gerai Online menggunakan model **Managed Core Library**.

---

### 🌟 Cara Kerja Model Ini:
1. **Source Code Utama & Hak Cipta:** Tersimpan aman di akun Google Anda (Library `KopdesEngine`).
2. **Database & File Transaksi:** Tersimpan di Google Drive milik Koperasi Desa masing-masing.
3. **Proteksi Anti-Jual Ulang:** Klien tidak bisa melihat/mencuri kodingan engine, dan sistem mengunci lisensi berdasarkan `Spreadsheet ID`.

---

### 🚀 Langkah 1: Koperasi Desa Menyiapkan Spreadsheet
1. Buka Google Drive milik Koperasi Desa ➔ Buat **Google Spreadsheet Baru** (Beri nama misal: `Database Kopdes Samatan`).
2. Buka menu **Ekstensi (Extensions)** ➔ **Apps Script**.

---

### 🚀 Langkah 2: Tambahkan Library `KopdesEngine`
1. Di bilah menu sebelah kiri Apps Script Editor, cari bagian **Libraries (Pustaka)** ➔ Klik tanda tambah (**+**).
2. Masukkan **Script ID Core Engine Anda**:
   ```text
   1dBn__NieR3_CqWolLFmfc4tIxFBt976HwPGtXaZlwd1MfBGS7APDjq1Y
   ```
3. Klik **Look up (Cari)**.
4. Pada dropdown **Version**, pilih **Versi Terbaru** (tanyakan ke penyedia layanan untuk nomor versi terkini).
5. Pada kolom **Identifier**, ketik:
   ```text
   KopdesEngine
   ```
6. Klik **Add (Tambahkan)**.

> 💡 **Kebijakan Versi:** Master & klien memakai **versi terbaru yang sama**. Tidak perlu memakai versi di bawahnya.

---

### 🚀 Langkah 3: Salin Kode Client Shell
1. Buka file `Code.gs` di Apps Script Koperasi Desa.
2. Hapus seluruh isi file dan ganti dengan isi dari file **[`client-template/Code.js`](file:///Users/thorsi/Documents/work/kopdes-tools/client-template/Code.js)**.
3. Klik **Save (Simpan 💾)**.

---

### 🚀 Langkah 4: Inisialisasi Database & Data Demo
1. Pada toolbar atas Apps Script, pilih fungsi **`setupApp`** ➔ Klik **▶️ Run**.
   * *Google Sheet koperasi otomatis terisi tab sheet `products`, `orders`, dan `users`.*
2. Pilih fungsi **`seedData`** ➔ Klik **▶️ Run**.
   * *Otomatis mengisi 25+ produk sembako, akun pengurus, kurir, dan pesanan sample.*

---

### 🚀 Langkah 5: Publikasikan Sebagai Web App
1. Klik tombol **Deploy** di pojok kanan atas ➔ **New Deployment**.
2. Konfigurasi:
   - **Type:** Web app
   - **Execute as:** *Me (Akun Google Koperasi)*
   - **Who has access:** *Anyone (Siapa saja)*
3. Klik **Deploy** ➔ Salin **Web App URL**.
4. Aplikasi Gerai Online Koperasi Desa sudah langsung aktif, live, dan siap digunakan! 🎉

---

### ⚡ Opsional: Aktifkan Update Otomatis (Tanpa Deploy Ulang)
Agar klien **tidak perlu deploy ulang** setiap kali penyedia merilis perbaikan, gunakan deployment versi **`HEAD`**:

1. Buka **Deploy** ➔ **Manage deployments (Kelola deployment)**.
2. Klik ikon **Pensil (Edit ✏️)** pada deployment aktif.
3. Pada baris **Version**, pilih **`HEAD`** (bukan versi bernomor).
4. Klik **Deploy**.

> ✅ Dengan `HEAD`, setiap kali library `KopdesEngine` di-update, Web App klien **otomatis memakai versi terbaru** tanpa perlu deploy ulang.
>
> ⚠️ **Catatan:** Deployment `HEAD` selalu mengikuti kode terbaru. Untuk produksi yang sangat sensitif, gunakan versi bernomor (perlu deploy ulang saat ganti versi).
