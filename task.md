# task.md — Roadmap Frontend-First Sistem Informasi Nursery DSU

> **Versi final 3.0 · 23 September 2026**  
> **Strategi pengerjaan:** selesaikan frontend dan validasi alur UI dengan data mock terlebih dahulu, kemudian implementasikan backend, database, dan integrasi secara bertahap.  
> **Acuan:** `PRD.md` (kebutuhan dan aturan bisnis), `style.md` (identitas visual DSU), `aturan.md` (standar implementasi), `uml.md` (rancangan diagram). Jika terjadi konflik, ikuti PRD dan perbarui dokumen terkait secara eksplisit.  
> **Aktor tepat tiga:** `ADMIN`, `PETUGAS`, `PELANGGAN`. **Modul inti:** Inventory Tanaman, Monitoring Pertumbuhan Manual, Online Order.  
> **Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui; backend tahap lanjutan Node.js + Express + TypeScript; PostgreSQL + Prisma.

## 0. Aturan eksekusi

- Checklist awal seluruhnya `[ ]`: tidak ada pekerjaan yang diasumsikan sudah selesai.
- **Frontend-first bukan berarti hanya membuat halaman statis.** Setiap fitur harus memiliki alur interaksi, validasi form, state loading/empty/error, mock API, dan pengujian sebelum dinyatakan selesai.
- Selama fase frontend, gunakan mock repository/service yang dapat diganti dengan HTTP client tanpa mengubah komponen presentasi. **Jangan** menghubungkan UI langsung ke database atau menyimpan aturan otorisasi hanya di client.
- Labeli data dan transaksi simulasi secara jelas. Tombol bayar, checkout, ubah stok, dan persetujuan pada fase mock **tidak boleh diklaim memproses transaksi nyata**.
- Gunakan logo asli `cvdeltasinergiutama.png`, warna utama biru DSU, tema terang, dan ketentuan anti-AI-slop pada `style.md`/`aturan.md`.
- Simpan screenshot, keputusan desain, hasil uji, dan perubahan scope di `docs/`. Pekerjaan baru selesai jika acceptance criteria dan pengujian terkait terpenuhi.

## FASE A — FRONTEND DULU (prioritas implementasi)

### Tahap F0 — Audit kebutuhan dan peta layar
**Dependensi:** Tidak ada. **Output:** daftar layar, alur pengguna, dan kontrak data UI.

- [x] F00.01 Baca `PRD.md`, `style.md`, `aturan.md`, `uml.md`; susun matriks fitur dan halaman untuk tiga aktor tanpa menambah role baru.
- [x] F00.02 Tetapkan route map publik, pelanggan, admin, dan petugas; identifikasi halaman yang memerlukan login dan pembatasan role.
- [x] F00.03 Petakan alur: admin mengelola tanaman/batch/stok → petugas mencatat monitoring → admin menyetujui kesiapan jual → pelanggan checkout → admin memproses pesanan.
- [x] F00.04 Definisikan tipe data frontend dan status bisnis yang mengacu PRD, termasuk stok fisik, stok siap jual, stok terreservasi, stok tersedia, status monitoring, dan status pesanan.
- [x] F00.05 Buat daftar data simulasi representatif: beberapa jenis tanaman, batch/lokasi, pengukuran berkala, stok, produk, pelanggan, dan pesanan; tandai sebagai mock.
- [x] F00.06 Susun wireframe desktop dan mobile untuk alur utama; pastikan penggunaan petugas di lapangan nyaman pada layar ponsel.

**Gate F0:** Semua layar dan transisi antaraktor dapat ditelusuri ke kebutuhan PRD; tidak ada asumsi bahwa observasi pertumbuhan otomatis mengubah stok.

### Tahap F1 — Setup Next.js dan fondasi desain
**Dependensi:** F0. **Output:** aplikasi frontend siap dikembangkan.

- [x] F01.01 Inisialisasi `apps/web` dengan Next.js App Router, TypeScript strict, Tailwind CSS, ESLint, formatter, dan alias import.
- [x] F01.02 Pasang dan konfigurasi shadcn/ui, Lucide React, serta font sesuai `style.md`; buat design tokens CSS untuk biru DSU, warna netral, warna status, radius, spacing, dan tipografi.
- [ ] F01.03 Letakkan aset logo asli pada `apps/web/public/brand/cvdeltasinergiutama.png`; gunakan `next/image` dan buat varian penggunaan yang tidak mengubah bentuk atau warna logo.
- [x] F01.04 Bangun komponen dasar: Button, Input, Select, Textarea, Dialog, Drawer, Table, Badge, Card, Tabs, Toast, Pagination, Skeleton, EmptyState, ErrorState, ConfirmDialog.
- [x] F01.05 Bangun layout publik, dashboard admin, dashboard petugas, dan area akun pelanggan; sidebar dan navigasi hanya menampilkan menu sesuai role.
- [x] F01.06 Siapkan aksesibilitas dasar: label form, fokus keyboard, kontras, pesan error yang dapat dipahami, dan responsivitas.
- [x] F01.07 Siapkan test runner dan uji render komponen utama; pastikan lint dan typecheck lulus.

**Gate F1:** Halaman dasar responsif, logo dan identitas visual konsisten, komponen reusable, tanpa gradient/glow/dekorasi generik yang tidak relevan.

### Tahap F2 — Lapisan mock dan simulasi autentikasi
**Dependensi:** F1. **Output:** seluruh frontend dapat diuji tanpa backend.

- [ ] F02.01 Buat `types`/schema Zod untuk user, tanaman, batch, observasi, temuan, pengajuan siap jual, produk, keranjang, pesanan, dan pembayaran sesuai PRD.
- [ ] F02.02 Buat antarmuka repository/service (`AuthService`, `InventoryService`, `MonitoringService`, `CatalogService`, `OrderService`) dan implementasi mock yang terpisah dari UI.
- [ ] F02.03 Sediakan seed data mock yang deterministik, realistis, mencakup berbagai jenis tanaman dan status bisnis; jangan memakai angka dashboard acak.
- [ ] F02.04 Buat simulasi login dan role switch **khusus development** untuk ADMIN, PETUGAS, dan PELANGGAN; tampilkan penanda jelas “Mode Demo”.
- [ ] F02.05 Implementasikan route guard UI untuk pengalaman pengguna, tetapi dokumentasikan bahwa otorisasi sebenarnya wajib ditegakkan ulang oleh backend.
- [ ] F02.06 Implementasikan state loading, error, empty, optimistic update bila aman, dan skenario respons mock gagal/latensi.
- [ ] F02.07 Buat helper format mata uang IDR, tanggal/waktu lokal, unit pengukuran, dan label status yang konsisten.

**Gate F2:** Perubahan sumber data mock → REST API dapat dilakukan pada lapisan service, tanpa menulis ulang halaman atau komponen.

### Tahap F3 — Frontend ADMIN: inventory dan katalog
**Dependensi:** F2. **Output:** alur inventory admin berjalan end-to-end dalam mode demo.

- [ ] F03.01 Dashboard admin dengan ringkasan stok berdasarkan data mock yang konsisten, tanaman siap jual, pengajuan petugas, dan pesanan menunggu tindakan.
- [ ] F03.02 Halaman master jenis tanaman/kategori dan formulir tambah, ubah, detail, cari, filter, pagination, serta validasi input.
- [ ] F03.03 Halaman batch/lokasi tanaman: stok awal, penerimaan, mutasi, penyesuaian, dan riwayat transaksi stok; tampilkan alasan serta pelaku perubahan.
- [ ] F03.04 Tampilkan terpisah stok fisik, stok siap jual disetujui, stok terreservasi, dan stok tersedia untuk dipesan; jangan menyamakan keempat angka.
- [ ] F03.05 Halaman daftar pengajuan siap jual dari petugas dengan detail bukti monitoring dan aksi setujui/tolak beserta alasan.
- [ ] F03.06 Halaman produk/katalog admin untuk memilih batch yang telah disetujui, menetapkan harga, foto, deskripsi, status publikasi, dan ketersediaan.
- [ ] F03.07 Sediakan konfirmasi untuk aksi berisiko, larang nilai stok negatif pada validasi UI, dan tampilkan pesan ketika stok tidak mencukupi.
- [ ] F03.08 Uji alur mock penerimaan → monitoring → persetujuan → publikasi; pastikan perubahan angka stok mengikuti aturan PRD.

**Gate F3:** Admin dapat menyelesaikan skenario inventory dan publikasi katalog tanpa backend, dengan angka stok konsisten dan tindakan berisiko memiliki konfirmasi.

### Tahap F4 — Frontend PETUGAS: monitoring manual
**Dependensi:** F2 dan data batch dari F3. **Output:** alur monitoring nyaman digunakan pada ponsel.

- [ ] F04.01 Dashboard petugas berisi batch/lokasi yang ditugaskan, jadwal/riwayat observasi, dan temuan yang memerlukan tindak lanjut.
- [ ] F04.02 Daftar dan detail batch yang ditugaskan; petugas tidak diberi menu mengubah harga, menyetujui siap jual, atau memproses pesanan.
- [ ] F04.03 Form observasi manual dengan tanggal, batch, metode dan jumlah sampel, tinggi tanaman, jumlah daun, parameter relevan per jenis, kondisi kesehatan, catatan, dan foto.
- [ ] F04.04 Validasi satuan, rentang angka, tanggal, jumlah sampel, jenis/ukuran file, serta tampilkan preview foto dan pesan kesalahan yang spesifik.
- [ ] F04.05 Riwayat observasi dan grafik pertumbuhan dengan sumbu, satuan, periode, dan jumlah sampel yang jelas; jangan membuat kesimpulan otomatis tanpa dasar data.
- [ ] F04.06 Form laporan tanaman mati/rusak/sakit dan pengajuan siap jual disertai bukti; tampilkan status menunggu, disetujui, atau ditolak.
- [ ] F04.07 Pastikan menyimpan observasi **tidak** otomatis mengurangi stok; laporan kematian baru memengaruhi inventory setelah tindakan admin sesuai PRD.
- [ ] F04.08 Uji skenario petugas pada viewport ponsel, termasuk foto, validasi, loading, jaringan gagal, dan pembatasan akses batch yang bukan penugasannya.

**Gate F4:** Petugas dapat melakukan monitoring lengkap melalui UI mock tanpa memiliki kewenangan admin.

### Tahap F5 — Frontend PELANGGAN: katalog hingga pemesanan
**Dependensi:** F2 dan katalog F3. **Output:** customer journey berfungsi dalam mode demo.

- [ ] F05.01 Landing/katalog publik dengan identitas DSU, daftar tanaman nyata atau berlabel mock, pencarian, filter kategori, dan empty state.
- [ ] F05.02 Detail produk: foto, nama/jenis, deskripsi, harga IDR, status siap jual, dan stok tersedia untuk dipesan; jangan menampilkan stok fisik sebagai stok siap pesan.
- [ ] F05.03 Registrasi/login pelanggan (simulasi), profil, alamat/kontak, dan halaman pesanan milik sendiri.
- [ ] F05.04 Keranjang dengan perubahan jumlah, hapus item, ringkasan harga, serta validasi stok tersedia saat kuantitas berubah.
- [ ] F05.05 Checkout bertahap: data pelanggan/pengambilan atau pengiriman sesuai keputusan PRD, ringkasan item, metode pembayaran transfer manual, konfirmasi pesanan.
- [ ] F05.06 Halaman instruksi pembayaran, unggah bukti transfer jika berlaku, status pesanan, dan riwayat; beri label “Simulasi” selama backend belum aktif.
- [ ] F05.07 Uji stok habis, kuantitas melebihi stok, harga berubah, keranjang kosong, sesi kedaluwarsa, dan pembayaran belum diverifikasi.

**Gate F5:** Pelanggan dapat menyelesaikan alur katalog → keranjang → checkout → riwayat secara simulatif, tanpa klaim pembayaran atau reservasi nyata.

### Tahap F6 — Frontend ADMIN: pemrosesan pesanan dan laporan
**Dependensi:** F3 dan F5. **Output:** siklus pesanan mock terhubung ke dashboard admin.

- [ ] F06.01 Daftar/detail pesanan admin dengan filter status, item, jumlah, harga saat checkout, kontak pelanggan, dan riwayat perubahan status.
- [ ] F06.02 UI verifikasi bukti pembayaran: lihat bukti, setujui/tolak dengan alasan, dan tampilkan jejak tindakan.
- [ ] F06.03 UI proses pemenuhan, penyerahan/pengiriman, pembatalan, dan penanganan kedaluwarsa reservasi sesuai state machine PRD.
- [ ] F06.04 Tampilkan pengaruh simulasi pesanan pada stok terreservasi/tersedia; stok fisik baru berkurang pada peristiwa pemenuhan yang ditetapkan PRD.
- [ ] F06.05 Laporan admin: rekap inventory, monitoring, dan pesanan dengan filter periode, label sumber data, serta state tanpa data.
- [ ] F06.06 Uji transisi status valid/tidak valid, klik ganda, stok berubah sebelum checkout, dan pembatalan yang melepaskan reservasi.

**Gate F6:** Semua alur tiga aktor saling tersambung di demo frontend; angka laporan konsisten dengan seed dan aksi mock.

### Tahap F7 — Audit dan sign-off frontend
**Dependensi:** F0–F6. **Output:** frontend siap diintegrasikan dengan backend.

- [ ] F07.01 Audit seluruh route dan hak akses tiga role; pastikan menu dan tindakan tidak melampaui kewenangan.
- [ ] F07.02 Uji seluruh halaman pada desktop, tablet, dan ponsel; prioritaskan form monitoring petugas dan checkout pelanggan.
- [ ] F07.03 Audit aksesibilitas keyboard, fokus, label, kontras, dan pesan error; audit konsistensi logo, palet biru, tipografi, serta komponen.
- [ ] F07.04 Jalankan lint, typecheck, unit/component test, dan uji alur E2E mock untuk tiga aktor; dokumentasikan hasil dan bug.
- [ ] F07.05 Buat inventaris endpoint yang dibutuhkan tiap service UI, payload, response, kode error, dan status; cocokkan dengan PRD.
- [ ] F07.06 Rekam demo dan screenshot untuk dokumentasi skripsi; nyatakan eksplisit bahwa transaksi pada fase ini masih simulasi.

**GATE UTAMA FRONTEND:** Jangan mulai integrasi produksi sebelum alur tiga aktor, desain, responsivitas, validasi, dan kontrak API disetujui. Pekerjaan backend boleh dirancang lebih awal, tetapi implementasi diprioritaskan setelah gate ini.

## FASE B — BACKEND DAN DATABASE (setelah frontend siap)

### Tahap B1 — Fondasi API, database, dan autentikasi
**Dependensi:** F7. **Output:** API aman dengan database persisten.

- [ ] B01.01 Inisialisasi `apps/api` Express + TypeScript strict; konfigurasi environment, logging, error handler, Zod, dan struktur modul domain.
- [ ] B01.02 Buat schema Prisma PostgreSQL, migrasi, constraint, indeks, relasi, dan seed khusus development sesuai PRD.
- [ ] B01.03 Implementasikan autentikasi, hashing password, sesi/token aman, RBAC server-side untuk ADMIN/PETUGAS/PELANGGAN, dan ownership check.
- [ ] B01.04 Buat kontrak `/api/v1`, pagination, filter, format error, upload foto/bukti aman, dan audit log.
- [ ] B01.05 Uji akses lintas role, akses objek pengguna lain, validasi input, dan kegagalan autentikasi.

**Gate B1:** Semua endpoint terlindungi sesuai role dan data pengguna tidak dapat diakses oleh pengguna lain.

### Tahap B2 — API inventory, monitoring, dan persetujuan
**Dependensi:** B1. **Output:** alur stok dan pertumbuhan persisten.

- [ ] B02.01 Implementasikan master tanaman, kategori, batch/lokasi, penerimaan, mutasi, penyesuaian, dan ledger stok dengan audit.
- [ ] B02.02 Terapkan invariant stok serta transaksi database untuk mencegah stok negatif dan perubahan bersamaan yang tidak konsisten.
- [ ] B02.03 Implementasikan penugasan batch, observasi manual, foto, riwayat, laporan temuan, dan pengajuan siap jual oleh petugas.
- [ ] B02.04 Implementasikan persetujuan/penolakan siap jual oleh admin; temuan kematian hanya mengubah stok melalui transaksi inventory yang berwenang.
- [ ] B02.05 Implementasikan katalog dan stok tersedia berdasarkan stok siap jual disetujui dikurangi reservasi aktif.
- [ ] B02.06 Uji transaksi bersamaan, akses petugas di luar penugasan, validasi sampel, dan konsistensi ledger.

**Gate B2:** Angka stok dapat direkonsiliasi dari ledger dan tidak berubah hanya karena observasi disimpan.

### Tahap B3 — API online order, pembayaran, dan laporan
**Dependensi:** B2. **Output:** pesanan nyata tercatat dengan integritas stok.

- [ ] B03.01 Implementasikan keranjang/checkout dan snapshot harga-item; validasi ulang harga, ketersediaan, dan kepemilikan pesanan di server.
- [ ] B03.02 Buat reservasi stok atomik dan idempotensi checkout; cegah overselling dan duplikasi pesanan saat permintaan diulang.
- [ ] B03.03 Implementasikan pembayaran transfer manual, unggah bukti, verifikasi admin, tenggat, pembatalan, dan pelepasan reservasi sesuai PRD.
- [ ] B03.04 Implementasikan state machine pemenuhan; kurangi stok fisik hanya pada event yang telah ditetapkan, dengan audit dan pencegahan pemrosesan ganda.
- [ ] B03.05 Buat laporan inventory, monitoring, dan pesanan dari data aktual dengan pembatasan akses admin.
- [ ] B03.06 Uji checkout bersamaan pada stok terakhir, pembayaran ditolak, pesanan kedaluwarsa, pembatalan, dan retry request.

**Gate B3:** Seluruh perubahan stok dan pesanan bersifat transaksional, terotorisasi, dapat diaudit, dan lulus uji konkurensi.

## FASE C — INTEGRASI, PENGUJIAN, DAN PENYERAHAN

### Tahap I1 — Ganti mock service dengan REST API
**Dependensi:** F7 dan B1–B3. **Output:** frontend terhubung ke backend tanpa perubahan besar pada UI.

- [ ] I01.01 Tambahkan HTTP client terpusat, environment API URL, manajemen sesi, dan penanganan error terstruktur.
- [ ] I01.02 Ganti implementasi mock pada tiap service secara bertahap: autentikasi → inventory → monitoring → katalog → order → laporan.
- [ ] I01.03 Hapus role switch demo dan seluruh data/label simulasi dari mode produksi; pertahankan mock hanya untuk development/test.
- [ ] I01.04 Uji ulang loading/error/empty state, upload file, validasi server, logout/sesi kedaluwarsa, dan sinkronisasi stok antarhalaman.
- [ ] I01.05 Lakukan E2E tiga aktor pada database uji, termasuk persetujuan siap jual, checkout, verifikasi pembayaran, dan pemenuhan.

**Gate I1:** Tidak ada UI produksi yang bergantung pada mock atau mengklaim transaksi berhasil sebelum server mengonfirmasi.

### Tahap I2 — Quality assurance, deployment, dan skripsi
**Dependensi:** I1. **Output:** sistem teruji dan dapat dipresentasikan.

- [ ] I02.01 Jalankan unit, integration, E2E, RBAC, ownership, concurrency, dan regression test; dokumentasikan hasil terhadap acceptance criteria PRD.
- [ ] I02.02 Audit keamanan: validasi server, rate limit yang relevan, upload file, secret, CORS, cookie/token, log sensitif, dan backup database.
- [ ] I02.03 Audit performa, aksesibilitas, responsivitas, SEO halaman publik, serta kejelasan status stok dan pesanan.
- [ ] I02.04 Siapkan environment staging/produksi, migrasi, backup-restore, akun role uji, dan prosedur deployment/rollback.
- [ ] I02.05 Susun panduan pengguna per aktor, dokumentasi arsitektur/API/database, bukti pengujian, screenshot, serta materi demo/sidang.
- [ ] I02.06 Verifikasi kesesuaian implementasi dengan `PRD.md`, `style.md`, `aturan.md`, dan `uml.md`; catat setiap deviasi yang disetujui.

**Gate final:** Ketiga aktor dapat menjalankan tugasnya dengan data persisten, hak akses benar, transaksi stok aman, dan bukti pengujian tersedia.

## Definition of Done per task

Task hanya boleh dicentang jika: (1) sesuai PRD dan hak akses; (2) UI mengikuti `style.md`; (3) state normal/loading/empty/error tersedia jika relevan; (4) validasi dan pengujian lulus; (5) tidak ada data mock tersamar sebagai data produksi; (6) perubahan didokumentasikan. Untuk task backend/integrasi, tambah syarat otorisasi server, audit transaksi, dan konsistensi database.

## Urutan kerja praktis

**F0 → F1 → F2 → F3 → F4 → F5 → F6 → F7 → B1 → B2 → B3 → I1 → I2.**  
Mulai dari **F00.01**. Jangan membangun backend sebagai prasyarat membuat halaman frontend; gunakan kontrak data dan mock service terlebih dahulu.

## Catatan implementasi 23 September 2026

F0 selesai sebagai rancangan; F1 belum melewati gate karena logo resmi (F01.03) belum tersedia. Bukti dan batas pengujian: [docs/testing/2026-09-23-foundation.md](docs/testing/2026-09-23-foundation.md). Pratinjau data baca tidak berarti F2–F7 selesai.
