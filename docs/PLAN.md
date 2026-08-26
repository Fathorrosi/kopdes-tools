# 📋 Rencana Pengembangan — Kopdes Tools

Dokumen ini berisi backlog fitur yang sedang direncanakan serta riwayat rilis fitur yang telah selesai diimplementasikan.

---

## ✅ Selesai Diimplementasikan (v145)

### 🛠️ Admin Panel — Fitur Lengkap Koperasi
- [x] **Dashboard Overview**: Stat card omzet bulan ini, pesanan hari ini, pesanan pending/delivering, anggota aktif, produk aktif, 5 pesanan terbaru, dan peringatan stok menipis.
- [x] **Manajemen Anggota**: Tabel data seluruh user, pencarian & filter berdasarkan role/status, modal detail anggota, suspend/aktifkan akun, dan reset PIN anggota oleh admin.
- [x] **Manajemen Kurir**: Tabel kurir khusus, penambahan kurir baru dengan validasi PIN & kontak, edit profil kurir, dan toggle aktif/nonaktif.
- [x] **Laporan & Rekap Pesanan**: Filter rentang tanggal (*from/to*), filter status pesanan, preview tabel rekapitulasi, dan ekspor langsung ke format CSV (Excel-ready).
- [x] **Notifikasi Pesanan Baru**: Polling otomatis interval 30 detik mendeteksi pesanan masuk baru dengan toast alert dan pembaruan badge counter.
- [x] **Satuan Produk (*Unit*)**: Field satuan fleksibel (*kg, pcs, liter, ikat, bungkus, dll.*) pada form produk, tabel produk, dan struk/pesanan.
- [x] **Bulk Action Produk**: Checkbox *select-all* & per-baris, aksi massal aktifkan/nonaktifkan produk, dan hapus massal dengan modal konfirmasi.

---

## 🗂️ Backlog — Fitur yang Direncanakan

---

### 💰 [PLAN] Proteksi Harga dari Guest / Desa Lain

**Latar Belakang:**
Karena aplikasi ini bersifat per-desa (koperasi desa), ada risiko bahwa tamu (*guest*) atau pengunjung dari desa lain dapat melihat seluruh daftar harga produk dan menjadikannya patokan untuk bersaing atau melakukan *underselling*.

**Opsi yang Dipertimbangkan:**

| Opsi | Deskripsi | Pro | Kontra |
|---|---|---|---|
| **A — Login-Only Catalog** | Harga & stok hanya muncul setelah login sebagai anggota | Paling protektif | Guest tidak bisa preview, konversi pendaftaran lebih sulit |
| **B — Blur Harga untuk Guest** ⭐ *Direkomendasikan* | Harga ditampilkan tapi di-blur, dengan CTA *"Login untuk lihat harga"* | UX baik, mendorong pendaftaran, tidak bisa di-screenshot langsung | Harga masih ada di DOM (bisa di-inspect), tapi cukup menghalangi orang awam |
| **C — Biarkan Terbuka** | Status quo, tidak ada perubahan | Paling praktis, transparan | Risiko benchmark harga oleh kompetitor desa |

**Keputusan:** **Opsi B** — Blur harga untuk guest, dengan CTA login.

**Detail Implementasi (jika disetujui):**
- **`src/apps/gerai-online/views/index.html`**
  - Pada render kartu produk: jika user belum login (`!AuthUI.isLoggedIn()`), tampilkan harga dengan class `price-blurred` + overlay tombol *"🔐 Login untuk lihat harga"*.
  - Pada promo carousel: blur `promo-card-price` dan `promo-card-orig` untuk guest.
  - Saat user login berhasil, re-render atau hapus class blur tanpa reload halaman.
- **CSS:** Tambah style `.price-blurred { filter: blur(5px); user-select: none; pointer-events: none; }` dan overlay CTA.

> [!NOTE]
> Implementasi Opsi B tidak memerlukan perubahan backend/GAS. Seluruhnya di sisi frontend `index.html`.

---

