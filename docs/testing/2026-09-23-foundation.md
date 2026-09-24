# Bukti pengujian fondasi frontend

Tanggal: 23 September 2026. Windows, Node.js/npm lokal, Next.js 16.3.6; Playwright Chromium 153. Build dijalankan dari workspace `apps/web`, browser mengakses build pada port 3001 dengan `DSU_DEMO=true`.

## Hasil

| Pemeriksaan | Hasil |
|---|---|
| `npm.cmd run lint` | Lulus, exit 0 setelah penambahan komponen dan drawer |
| `npm.cmd run typecheck` | Lulus pada fondasi; build final juga menyelesaikan TypeScript tanpa error |
| `npm.cmd test` | 2/2 lulus: saldo tersedia, saldo tidak valid |
| `npm.cmd run build` | Lulus; root statis dan route portal dinamis |
| `npm.cmd exec playwright -- test` | 6/6 lulus, 26,7 detik |

Uji browser: pencarian batch, detail batch, data kosong, gagal/retry, pemulihan skenario normal; batch di luar penugasan tidak tampil; konteks jumlah/metode sampel; katalog menampilkan 68 tersedia, bukan 120 fisik; riwayat demo menunjukkan menunggu verifikasi; drawer mobile dapat ditutup dengan Escape dan mengembalikan fokus; viewport 360/768/1280 tanpa overflow halaman.

Screenshot: `admin-{360,768,1280}.png`, `petugas-{360,768,1280}.png`, `katalog-{360,768,1280}.png`. Screenshot admin desktop dan petugas mobile diperiksa secara visual. Tabel mobile menggunakan scroll horizontal berlabel.

## Traceability dan checklist

- F00.01–06: matriks requirement, route map, alur tiga aktor, kontrak awal, daftar data simulasi dan wireframe ada di `docs/frontend-plan.md`, `docs/wireframes.md`, `uml.md`, `packages/contracts/src/index.ts`.
- F01.01: workspace `apps/web`, TypeScript strict, Tailwind, ESLint, formatter, alias; build lulus.
- F01.02: Geist, shadcn Base UI, Lucide dan token biru DSU terpusat. Palet masih usulan UI dari style, bukan brand book resmi.
- F01.04: Button/Input/Select/Textarea/Dialog/Drawer/Table/Badge/Card/Tabs/Toast/Pagination/Skeleton dan EmptyState/ErrorState/ConfirmDialog tersedia. Drawer berbasis Sheet yang mengelola fokus. Komponen belum diuji dalam semua alur transaksi F3–F6.
- F01.05–07: layout tiga portal dan area publik, menu sesuai portal demo, aksesibilitas dasar, test runner dan uji render/interaksi halaman awal. Ini bukan RBAC atau autentikasi nyata.
- F01.03 tetap terbuka: logo resmi belum tersedia. Nama perusahaan sementara berupa teks; tidak membuat pengganti logo.

## Perbaikan selama verifikasi

Build pertama gagal pada hasil transformasi CSS. Encoding CSS dinormalisasi tanpa BOM dan pemindaian Tailwind dibatasi ke workspace web; build ulang lulus. Tes browser awal gagal karena executable headless masih diunduh; konfigurasi memakai Chromium yang sudah tersedia. Selector alert tes admin diperjelas ke area main agar tidak bertabrakan dengan announcer aksesibilitas Next.js. Tes ulang lulus.

## Batas hasil

F0 selesai sebagai rancangan. Gate F1 belum lengkap karena aset logo. Pratinjau baca menggunakan service terpisah dan fixture terbatas; F2–F7 belum selesai. Belum ada login, CRUD/mutasi stok, form monitoring, approval, keranjang/checkout/pembayaran, backend/database atau integrasi. Tidak ada pengujian concurrency, RBAC backend, ownership lintas pelanggan, performa atau UAT. Hasil ini tidak membuktikan acceptance criteria keseluruhan MVP.

Seluruh data simulasi. Diagram/kebijakan agronomis dan operasional masih memerlukan validasi objek penelitian sebagaimana PRD. Tindakan berikutnya: integrasikan logo resmi F01.03, lalu lengkapi schema runtime dan service domain F2 sesuai dependensi task v3.0.
