# Sistem Informasi Nursery DSU

Baseline bisnis: PRD v2.0. Urutan pengerjaan: task.md v3.0 (frontend-first).

## Menjalankan

Dari root project:

```sh
npm install
npm run dev
```

Di PowerShell yang membatasi script, gunakan `npm.cmd` sebagai pengganti `npm`.
Port khusus: `npm run dev --workspace @dsu/web -- --port 3002`.

## Struktur

- `apps/web`: Next.js, layout dan pratinjau data simulasi.
- `packages/contracts`: kontrak data UI dan aturan saldo awal.
- `docs/frontend-plan.md`: matriks requirement, route map, wireframe, dependensi.
- `docs/testing`: hasil pengujian dan screenshot.
- `uml.md`: rancangan alur awal dari PRD.

## Status implementasi

Tersedia: halaman pemilihan portal, ringkasan admin/inventory baca, daftar batch petugas dan riwayat pengamatan, katalog baca, serta riwayat pesanan pelanggan demo. Pencarian, filter kategori batch, detail batch, loading, kosong, gagal/retry tersedia.

Ini fondasi frontend, belum seluruh F0–F7. Belum ada autentikasi, CRUD/mutasi inventory, input monitoring, persetujuan siap jual, keranjang, checkout, upload pembayaran, backend, atau database. Pemfilteran batch/pesanan di UI bukan otorisasi. Jangan gunakan demo untuk data nyata.

Logo resmi belum tersedia. Nama perusahaan ditampilkan sebagai teks; tidak ada logo hasil rekonstruksi. Letakkan logo resmi pada `apps/web/public/brand/cvdeltasinergiutama.png` untuk pengerjaan F01.03.

Demo tersedia otomatis dalam development dan build produksi. Katalog, login demo, checkout simulasi, dan portal internal memakai data contoh; deployment ini merupakan demonstrasi frontend, bukan sistem operasional dengan backend.

## Deploy ke Vercel

Konfigurasi `vercel.json` dijalankan dari root repository dan mengarahkan hasil build ke `apps/web/.next`.

- Root Directory: kosong (root repository), bukan `apps/web`.
- Framework Preset: Next.js.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: `apps/web/.next`.

Build/install/output sudah ditetapkan di `vercel.json`. Jangan gunakan `.next` di root karena script build menjalankan workspace `apps/web`.

Aplikasi simulasi langsung tampil tanpa environment variable tambahan. `DSU_DEMO` tidak lagi digunakan; pengaturan lama di Vercel boleh dihapus. Halaman pelanggan dan portal demo tersedia pada Production maupun Preview.

Jika mengubah pengaturan deployment lama, lakukan Redeploy tanpa memakai build cache. Jangan mengunggah folder `.next` atau `node_modules` ke GitHub.

Referensi: https://vercel.com/docs/project-configuration/vercel-json

## Verifikasi lokal

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Uji browser: install Chromium dengan `npx playwright install chromium`. Jalankan `npm run build`, lalu `npm run start --workspace @dsu/web -- --port 3001` dan `npx playwright test`. Tidak diperlukan environment variable demo. Screenshot 360/768/1280 px tersimpan di `docs/testing`.
