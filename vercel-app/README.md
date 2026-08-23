# 🚀 Deploy Gerai Kopdes ke Vercel

Folder ini berisi konfigurasi siap pakai untuk menghubungkan Gerai Online Kopdes ke domain **Vercel** atau **Custom Domain Desa** (misal: `https://kopdes-makmur.vercel.app` atau `https://toko.namadesa.id`).

---

## 📦 Cara Deploy (Pilih salah satu)

### 🌟 Cara 1: Deploy via Terminal (1 Perintah)
Buka terminal di folder project dan jalankan:
```bash
cd vercel-app
npx vercel
```
- Jika diminta login, pilih akun GitHub / Email Vercel Anda.
- Tekan `Enter` untuk setiap pertanyaan default (Set up and deploy? **Y**, Link to existing? **N**, Project name? **gerai-kopdes**).
- Vercel akan langsung memberikan link publik HTTPS aktif!

Untuk update versi production:
```bash
npx vercel --prod
```

---

### 🌟 Cara 2: Deploy via GitHub + Vercel Dashboard
1. Push repository ini ke GitHub Anda.
2. Buka [vercel.com/new](https://vercel.com/new).
3. Import repository GitHub ini.
4. Pada kolom **Root Directory**, pilih folder `vercel-app`.
5. Klik **Deploy**.

---

## 🌐 Pasang Custom Domain Desa (Opsional)
Setelah terdeploy di Vercel:
1. Buka dashboard project di Vercel ➔ Menu **Settings** ➔ **Domains**.
2. Masukkan domain desa Anda (misal: `toko.desasuka.id` atau `kopdes.id`).
3. Tambahkan CNAME record yang diberikan Vercel ke DNS domain Anda.
4. SSL/HTTPS otomatis aktif gratis selamanya!
