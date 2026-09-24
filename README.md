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

Demo otomatis tersedia dalam development. Build produksi menonaktifkan portal demo kecuali server dijalankan dengan `DSU_DEMO=true`; opt-in ini hanya untuk demonstrasi/pengujian, bukan produksi operasional.

## Deploy ke Vercel

Konfigurasi `vercel.json` dijalankan dari root repository dan mengarahkan hasil build ke `apps/web/.next`.

- Root Directory: kosong (root repository), bukan `apps/web`.
- Framework Preset: Next.js.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: `apps/web/.next`.

Build/install/output sudah ditetapkan di `vercel.json`. Jangan gunakan `.next` di root karena script build menjalankan workspace `apps/web`.

Untuk menampilkan aplikasi simulasi, tambahkan environment variable `DSU_DEMO=true` pada environment Vercel yang akan digunakan (Production dan/atau Preview), kemudian deploy ulang. Tanpa opt-in ini, halaman produksi menampilkan layanan belum diaktifkan.

Jika mengubah pengaturan deployment lama, lakukan Redeploy tanpa memakai build cache. Jangan mengunggah folder `.next` atau `node_modules` ke GitHub.

Referensi: https://vercel.com/docs/project-configuration/vercel-json

## Verifikasi lokal

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Uji browser: install Chromium dengan `npx playwright install chromium`. Jalankan build pada port 3001 dengan `DSU_DEMO=true`, lalu `npx playwright test`. Screenshot 360/768/1280 px tersimpan di `docs/testing`. Tes ini memverifikasi fondasi baca, bukan seluruh acceptance criteria PRD.
