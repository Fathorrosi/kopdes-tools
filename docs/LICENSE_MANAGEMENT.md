# 🔐 Panduan Manajemen Lisensi — Kopdes Tools (Vendor Guide)

> **Dokumen ini HANYA untuk Penyedia Layanan (Vendor/Developer).**
> Dokumen ini TIDAK dibagikan ke Koperasi Desa Klien.

---

## 📋 Ringkasan Sistem Lisensi

Kopdes Tools menggunakan **Central Master License Sheet** (Google Spreadsheet di Google Drive Vendor) sebagai pusat kendali seluruh lisensi klien. Sistem ini memungkinkan vendor untuk:
- ✅ **Mengaktifkan** layanan klien baru
- 🚫 **Menonaktifkan** layanan klien yang belum bayar
- ⏰ **Mengatur tanggal kedaluwarsa** otomatis per klien
- 🔄 **Mengaktifkan kembali** layanan setelah pembayaran diterima

---

## 🏗️ Cara Kerja Teknis

```
┌──────────────────────────────────────────────────────────────────┐
│         GOOGLE SHEET MASTER LISENSI (Di Google Drive Vendor)      │
│                                                                  │
│  spreadsheetId    │ clientName     │ status    │ expiresAt        │
│  1dBn__NieR3...   │ Kopdes Samatan │ ACTIVE    │ 2027-08-24       │
│  1GnbXJYsw...     │ Kopdes Lenteng │ SUSPENDED │ 2027-08-24       │
└───────────────────────────────┬──────────────────────────────────┘
                                │ Dibaca oleh Core Library (~10 detik)
                                │
         ┌──────────────────────┴─────────────────────┐
         ▼                                            ▼
  [Status: ACTIVE]                          [Status: SUSPENDED/EXPIRED]
         │                                            │
  ✅ Toko berjalan normal                  ⛔ Layar Kunci Otomatis
  (Belanja, Admin, Kurir)                  "Layanan Ditangguhkan"
```

---

## 🚀 Inisialisasi Awal (Hanya 1 Kali)

### Langkah 1: Buat Master Spreadsheet Lisensi

1. Buka **Google Apps Script Master** Anda (`kopdes-tools`).
2. Pilih fungsi **`createMasterLicenseSheet`** di dropdown toolbar atas.
3. Klik **▶️ Run**.
4. Google Spreadsheet baru bernama **"Master Lisensi Kopdes Tools"** otomatis terbuat di Google Drive Anda, beserta Sheet ID-nya tersimpan otomatis.

> **Catatan:** Fungsi ini hanya perlu dijalankan **sekali seumur hidup**. Jika dijalankan ulang, akan membuat file baru.

### Langkah 2: Atur Akses File Master Lisensi

> [!CAUTION]
> File Master Lisensi **JANGAN dibagikan** ke publik atau ke akun klien.

1. Buka file Google Sheet **"Master Lisensi Kopdes Tools"** di Google Drive Anda.
2. Klik tombol **Bagikan (Share 🔗)** di pojok kanan atas.
3. Pastikan pengaturan akses adalah: **"Dibatasi (Restricted)"** — hanya akun Anda yang bisa membuka.
4. Library KopdesEngine berjalan menggunakan akun Google Anda (*Execute as: Me*), sehingga otomatis dapat membaca file ini tanpa perlu berbagi akses ke klien.

---

## 📝 Mendaftarkan Klien Baru

Setiap ada Koperasi Desa baru yang bergabung:

1. Minta **Spreadsheet ID** dari klien:
   - Spreadsheet ID ada di URL Google Spreadsheet mereka:
     `https://docs.google.com/spreadsheets/d/` **`[SPREADSHEET_ID_KLIEN]`** `/edit`
2. Buka file **"Master Lisensi Kopdes Tools"** di Google Drive Anda.
3. Tambahkan **1 baris baru** di paling bawah tabel:

   | Kolom | Contoh Nilai | Keterangan |
   | :--- | :--- | :--- |
   | `spreadsheetId` | `1GnbXJYswBqAhbc...` | ID Google Sheet klien (bukan Script ID!) |
   | `clientName` | `Kopdes Lenteng` | Nama koperasi desa |
   | `status` | `ACTIVE` | Status awal layanan |
   | `expiresAt` | `2027-08-24` | Tanggal jatuh tempo langganan |
   | `contactPhone` | `081234567890` | Nomor WhatsApp pengurus |
   | `registeredAt` | `2026-08-24` | Tanggal pendaftaran |
   | `notes` | `Paket 1 Tahun` | Catatan internal |

4. Simpan file.

> ✅ Layanan untuk klien tersebut **langsung aktif dalam ~10 detik** tanpa perlu deploy ulang apapun!

---

## 🚫 Menonaktifkan Layanan Klien (Suspend)

Jika klien belum membayar perpanjangan atau ingin dinonaktifkan:

1. Buka file **"Master Lisensi Kopdes Tools"**.
2. Cari baris nama koperasi klien yang bersangkutan.
3. Ubah kolom **`status`**:
   - Dari: **`ACTIVE`**
   - Menjadi: **`SUSPENDED`**
4. Simpan.

> ⏱️ Dalam **~10-20 detik**, seluruh halaman Web App milik klien tersebut (Toko, Admin, Kurir) **otomatis terkunci** dan menampilkan layar:
>
> 🔒 *"Layanan Kopdes Tools untuk [Nama Desa] Sedang Ditangguhkan. Silakan hubungi penyedia layanan."*

---

## ✅ Mengaktifkan Kembali Layanan Klien

Setelah menerima pembayaran perpanjangan:

1. Buka file **"Master Lisensi Kopdes Tools"**.
2. Cari baris nama koperasi klien tersebut.
3. Ubah kolom **`status`** kembali menjadi: **`ACTIVE`**.
4. Perbarui juga kolom **`expiresAt`** ke tanggal jatuh tempo baru.
5. Simpan.

> ⏱️ Dalam **~10-20 detik**, layanan klien **langsung aktif kembali** tanpa perlu langkah tambahan apapun! 🟢

---

## ⏰ Auto-Expiry (Kedaluwarsa Otomatis)

Sistem secara otomatis mengunci layanan klien jika tanggal di kolom `expiresAt` sudah terlampaui, **meskipun status masih `ACTIVE`**.

**Skenario Perpanjangan Otomatis:**
- Klien berlangganan paket 1 tahun → Set `expiresAt: 2027-08-24`
- Pada tanggal 25 Agustus 2027, aplikasi **otomatis terkunci**
- Layar kunci menampilkan: *"Masa lisensi ... telah berakhir pada 2027-08-24"*
- Klien menghubungi Anda → Anda perpanjang `expiresAt` ke tahun berikutnya → Toko aktif kembali

---

## 🔧 Fungsi Admin Tersedia di GAS Master

Beberapa fungsi utilitas yang dapat dijalankan dari GAS Editor Master:

| Fungsi | Kegunaan |
| :--- | :--- |
| `createMasterLicenseSheet()` | Membuat file Master Lisensi baru (hanya 1x) |
| `clearLicenseCache()` | Menghapus cache lisensi untuk refresh instan |
| `checkLicense()` | Mengecek status lisensi aktif dari Apps Script |

---

## ❓ FAQ Vendor

**Q: Apakah klien bisa melihat isi file Master Lisensi?**
> Tidak. ID file Master Lisensi tersembunyi di dalam kode Library yang hanya Anda miliki. Klien tidak bisa melihat source code library, dan file dibatasi hanya akun Anda yang bisa buka.

**Q: Apakah perlu deploy ulang setiap mengubah status?**
> Tidak sama sekali. Cukup ubah nilai kolom `status` di Google Sheet ➔ otomatis terupdate dalam ~10 detik.

**Q: Bagaimana cara mengupdate library ke versi baru untuk semua klien?**
> Setiap klien harus mengupdate versi library di Apps Script mereka (menu Libraries ➔ KopdesEngine ➔ pilih versi terbaru) dan membuat deployment baru. Informasikan ke klien via WhatsApp/Email jika ada update penting.

**Q: Berapa banyak klien yang bisa dikelola?**
> Tidak terbatas. Satu Google Sheet Master bisa menampung ribuan baris klien.

**Q: Apakah cache bisa disetel lebih cepat?**
> Saat ini cache ~10 detik. Bisa dikurangi hingga 1 detik di `LicenseService.js` variabel `CACHE_DURATION_SECONDS`, namun ini akan meningkatkan jumlah request ke Google Spreadsheet.
