# 📋 Rencana Pengembangan — Kopdes Tools

Dokumen ini berisi backlog fitur yang sedang direncanakan, termasuk konteks diskusi dan detail implementasi teknis.

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
