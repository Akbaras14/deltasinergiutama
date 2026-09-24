# ATURAN.md — Aturan Pengembangan Final

**Project:** Sistem Informasi Inventory, Monitoring Pertumbuhan, dan Online Order Tanaman pada Nursery Berbasis Web  
**Organisasi:** CV. Delta Sinergi Utama (DSU)  
**Versi:** 2.0 — 22 September 2026  
**Status:** Baseline implementasi skripsi; berlaku untuk developer dan AI coding assistant.

## 0. Hirarki dokumen dan cara bekerja

1. `PRD.md` v2.0 adalah sumber kebenaran kebutuhan, aktor, alur, state machine, dan acceptance criteria. `task.md` v3.0 adalah urutan dan bukti pengerjaan. `style.md` adalah pedoman UI; **jika versi yang tersedia masih bertema hijau sebagai warna merek, bagian tersebut belum selaras dan harus diperbarui ke identitas biru DSU sebelum implementasi UI**. Dokumen ini mengatur cara kerja dan kualitas kode.
2. Bila terjadi konflik, jangan diam-diam mengubah bisnis atau menganggap dokumen lama lebih baru. Ikuti PRD final untuk kebutuhan bisnis; catat keputusan yang memerlukan konfirmasi dan sinkronkan dokumen terdampak.
3. Sebelum mulai task: baca kebutuhan dan ID acceptance criteria terkait di PRD; periksa dependensi pada task; identifikasi file, migrasi, risiko, kasus gagal, dan rencana uji. Kerjakan satu unit perubahan yang dapat diuji.
4. Setelah task: jalankan pemeriksaan relevan, tunjukkan bukti hasil, perbarui checklist hanya jika benar-benar lulus. Jangan mengklaim kode, tes, deployment, atau integrasi selesai tanpa verifikasi.
5. Jangan menambah fitur di luar MVP tanpa persetujuan dan perubahan terdokumentasi. Gunakan data contoh yang ditandai sebagai simulasi, bukan klaim kondisi aktual CV. DSU.

## 1. Batas produk dan aktor — wajib

**Tepat tiga role:** `ADMIN`, `PETUGAS`, `PELANGGAN`. Jangan membuat role Kepala Nursery, Manajer, Kasir, atau role keempat; fungsi manajerial MVP berada pada ADMIN.

| Domain | ADMIN | PETUGAS | PELANGGAN |
|---|---|---|---|
| Master tanaman, lokasi, batch, penugasan | Kelola | Lihat batch yang ditugaskan | Tidak mengakses data internal |
| Inventory fisik | Mencatat, memverifikasi, merekonsiliasi | Lihat stok batch terkait dan **laporkan temuan**; tidak posting transaksi | Lihat stok yang dapat dipesan di katalog |
| Monitoring pertumbuhan | Lihat dan evaluasi | **Input manual**, foto, pengukuran, riwayat, koreksi teraudit | Tidak mengakses observasi internal |
| Kesiapan jual | Setujui/tolak jumlah per batch | Ajukan berdasarkan observasi | Lihat produk yang sudah dipublikasikan |
| Produk, harga, katalog | Kelola dan publikasi | Tidak mengubah | Lihat |
| Keranjang dan checkout | Tidak | Tidak | Kelola pesanan milik sendiri |
| Pembayaran manual dan pemenuhan | Verifikasi, proses, selesaikan | Tidak | Unggah bukti dan lihat status sendiri |
| Laporan | Operasional, stok, monitoring, penjualan | Monitoring tugas sendiri | Riwayat pesanan sendiri |

Tiga modul inti: **Inventory Tanaman, Monitoring Pertumbuhan manual oleh PETUGAS, dan Online Order oleh PELANGGAN**. Fitur pendukung hanya yang diperlukan PRD: autentikasi, master data, katalog, persetujuan siap jual, pembayaran transfer manual, pengambilan di nursery, dashboard, dan laporan dasar. Jangan menambah IoT, AI/ML, diagnosis otomatis, payment gateway, perhitungan ongkir otomatis, marketplace, multi-tenant, atau aplikasi native ke MVP.

## 2. Arsitektur dan struktur repository

- Gunakan monorepo `apps/web` (Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui), `apps/api` (Node.js, Express, TypeScript), dan `packages/contracts` (kontrak API yang dibagikan). PostgreSQL + Prisma berada pada lapisan backend; frontend **tidak** melakukan query database langsung.
- Backend adalah **modular monolith**, bukan microservices. Modul minimal: `auth`, `users`, `plants`, `batches`, `inventory`, `growth`, `catalog`, `orders`, `payments`, `reports`.
- Dalam setiap modul, pisahkan route/controller (HTTP), schema (validasi runtime), service/use case (aturan bisnis), dan repository (persistensi). Controller tidak berisi perhitungan stok, transaksi bisnis, atau query database.
- Dependency mengarah dari transport/persistensi ke logika bisnis, bukan sebaliknya. Hindari abstraksi, event bus, cache, atau dependency baru yang tidak dibutuhkan kebutuhan nyata.
- Simpan konfigurasi dalam environment tervalidasi; sediakan `.env.example` tanpa secret. Gunakan lockfile dan versi dependency yang kompatibel. Migration database dan seed simulasi harus dapat dijalankan ulang pada lingkungan pengembangan.
- Semua mutasi domain melewati backend; kontrak respons, status, dan error konsisten. Gunakan HTTPS di deployment dan same-origin `/api` melalui reverse proxy bila memungkinkan.

## 3. Standar TypeScript, Clean Code, dan error handling

- Gunakan TypeScript strict; hindari `any`, non-null assertion sembarangan, dan cast untuk menutupi input tidak valid. Gunakan `unknown` + narrowing pada data eksternal. Validasi body, params, query, upload, dan environment pada runtime menggunakan schema.
- Fungsi mempunyai satu tanggung jawab; gunakan nama yang menjelaskan domain. Setiap fungsi publik dan aturan bisnis nontrivial memiliki dokumentasi tujuan, parameter, nilai balik, serta error/efek samping yang relevan. Komentar menjelaskan *mengapa*, bukan mengulang kode.
- Gunakan tipe uang aman (`numeric/decimal` atau nominal integer satuan terkecil); jangan memakai floating point untuk total pembayaran. Simpan waktu dengan timezone yang konsisten dan tampilkan zona waktu lokal secara eksplisit.
- Error tidak boleh ditelan diam-diam. Bedakan validation (400/422), unauthenticated (401), forbidden (403), not found (404), conflict (409), dan server error (500). Jangan bocorkan stack trace, query, password, session, bukti bayar, atau data pelanggan dalam response/log.
- Semua operasi penting memiliki log terstruktur dan audit: siapa, kapan, objek, tindakan, referensi transaksi, dan alasan; hindari menyimpan rahasia atau PII berlebihan.
- Jangan membuat mock permanen, hard-coded angka stok, status pesanan palsu, atau TODO tersembunyi pada alur produksi. Empty/loading/error state harus nyata.

## 4. Aturan domain Inventory — invariants

1. Pisahkan **stok fisik**, **stok siap jual yang disetujui ADMIN**, **stok terreservasi**, dan **stok dapat dipesan**. Stok dapat dipesan per batch/lokasi = `max(0, stok siap jual disetujui - stok terreservasi)`; agregasi produk hanya dari batch yang layak dan terhubung.
2. Penerimaan, kematian, penyesuaian, mutasi, dan pengeluaran fisik dicatat sebagai transaksi append-only yang dapat diaudit. Jangan mengubah saldo secara langsung atau menghapus transaksi sah; koreksi menggunakan transaksi kompensasi.
3. Hanya ADMIN dapat mem-posting transaksi stok. PETUGAS melaporkan temuan kematian/selisih; menyimpan observasi kesehatan **tidak** otomatis mengubah saldo.
4. Mutasi lokasi harus atomik: mengurangi saldo asal dan menambah saldo tujuan tanpa mengubah total nursery. Tolak kuantitas tidak positif, saldo negatif, dan sumber/tujuan yang tidak valid.
5. Stok siap jual tidak boleh melampaui stok fisik yang sah. Kematian/penyesuaian memicu rekonsiliasi kesiapan jual dan penanganan konflik bila ada reservasi aktif; jangan diam-diam merusak alokasi pelanggan.
6. Checkout, reservasi, pelepasan, dan pemenuhan memakai transaksi database dengan locking atau conditional update yang diuji saat concurrency; operasi berulang harus idempoten untuk mencegah overselling dan pengeluaran ganda.

## 5. Aturan domain Monitoring — PETUGAS

1. Monitoring **manual** dan berbasis batch; catat waktu, petugas, metode sampling, jumlah sampel, parameter per jenis tanaman dan satuan, nilai per sampel, kondisi, catatan, serta foto opsional.
2. PETUGAS hanya dapat mengakses batch yang ditugaskan. ADMIN dapat melihat hasil; koreksi observasi oleh PETUGAS mengikuti kebijakan batas waktu dan jejak audit. Tidak boleh mengubah catatan historis tanpa rekam perubahan.
3. Jangan menganggap rata-rata sampel sebagai ukuran pasti seluruh tanaman. Tampilkan jumlah sampel dan metode; gunakan identitas sampel tetap bila ingin membandingkan individu antarwaktu.
4. Validasi angka tidak negatif, parameter wajib sesuai jenis, waktu observasi masuk akal, jenis/ukuran foto, dan akses file. Jangan membuat diagnosis penyakit otomatis.
5. PETUGAS dapat mengajukan jumlah tanaman siap jual dengan referensi observasi; **hanya ADMIN** yang menyetujui/menolak. Pengajuan tidak otomatis memublikasikan produk atau mengubah stok fisik.

## 6. Aturan domain Online Order — PELANGGAN

1. Katalog hanya menampilkan produk yang dipublikasikan ADMIN dan kuantitas siap jual yang belum direservasi. Keranjang tidak mereservasi stok; checkout berhasil baru membuat reservasi atomik dengan masa berlaku yang dikonfigurasi.
2. Server menghitung ulang harga, diskon jika kelak disetujui, kuantitas, ketersediaan, dan total saat checkout. Simpan snapshot nama produk, harga, kuantitas, dan detail pesanan pada `order_items`; perubahan katalog tidak mengubah histori.
3. Ikuti state machine PRD **persis**: `PENDING_PAYMENT → PAYMENT_REVIEW → PAID → PROCESSING → READY_FOR_PICKUP → COMPLETED`. Alternatif `PENDING_PAYMENT/PAYMENT_REVIEW → EXPIRED/CANCELLED` dan `PAYMENT_REVIEW → PAYMENT_REJECTED → PENDING_PAYMENT` selama masa pembayaran masih berlaku.
4. Pembayaran MVP melalui transfer manual. Unggah bukti **tidak** berarti lunas; hanya ADMIN yang dapat memverifikasi dan mengubah status ke `PAID`. Bukti pembayaran bersifat privat dan divalidasi ukuran/tipe/aksesnya.
5. Pada pesanan batal/kedaluwarsa sebelum pemenuhan, lepaskan reservasi secara idempoten **tanpa menambah stok fisik**. Pada pengambilan/pemenuhan, catat pengeluaran stok fisik dan tutup reservasi dalam satu transaksi tepat satu kali.
6. Pembatalan setelah pembayaran memerlukan proses refund manual dan audit; jangan otomatis melepas stok setelah pesanan dipenuhi. Pelanggan hanya boleh mengakses keranjang, alamat, pembayaran, dan pesanan miliknya sendiri.
7. MVP menggunakan pengambilan di nursery. Jangan menampilkan checkout ekspedisi, tarif ongkir, atau status pengiriman sebagai fitur wajib tanpa perubahan PRD.

## 7. Identitas visual DSU dan anti-AI-slop

- **Merek:** CV. Delta Sinergi Utama. Gunakan logo DSU asli dari aset perusahaan, pertahankan bentuk, rasio, dan warna. Jangan menggambar ulang logo, mengubahnya menjadi ikon daun, atau menambahkan nama brand fiktif.
- **Arah visual:** light theme profesional, bersih, data-first; biru DSU sebagai primary brand, putih dan netral sebagai fondasi. Hijau hanya warna semantik keberhasilan/pertumbuhan atau warna natural pada foto tanaman, **bukan** primary brand. Nilai token biru final harus ditetapkan di `style.md` yang diselaraskan dengan logo; jangan mengasumsikan hex dari gambar terkompresi sebagai brand guideline resmi.
- Larang gradient neon, glow, glassmorphism, blob, ilustrasi 3D acak, shadow berat, kartu statistik berulang tanpa kebutuhan, dekorasi AI generik, dan copy bombastis. Gradient brand hanya bila benar-benar diperlukan, sangat terbatas, dan konsisten dengan pedoman visual yang disetujui.
- Gunakan hierarki halaman yang jelas: judul spesifik, konteks, satu aksi utama, filter relevan, konten, dan feedback. Hindari halaman kosong yang diisi kartu dummy, grafik tanpa makna, atau metrik tanpa periode/satuan.
- Gunakan font, spacing, radius, ikon Lucide, komponen shadcn/ui, token, dan breakpoint konsisten. Status harus memiliki label teks, bukan warna saja. Gunakan bahasa Indonesia yang lugas; hindari label campuran seperti “Create Batch Baru”.
- Portal ADMIN berorientasi tabel, transaksi, dan laporan; portal PETUGAS mengutamakan form monitoring mobile, satuan, foto, dan target sentuh nyaman; portal PELANGGAN mengutamakan foto tanaman nyata, informasi produk, harga, stok tersedia, checkout ringkas, dan pelacakan pesanan.
- Foto produk harus merepresentasikan tanaman yang benar-benar dijual; jangan menyajikan gambar generatif atau foto spesies lain sebagai bukti kondisi aktual stok. Gunakan fallback yang jelas saat foto tidak tersedia.
- Ikuti WCAG 2.2 AA sebagai target: kontras, navigasi keyboard, label form, focus visible, alt text, error yang dapat dipahami, dan `prefers-reduced-motion`. Semua halaman data menangani loading, empty, error, success, dan forbidden.

## 8. Keamanan, privasi, dan performa

- Autentikasi menggunakan session/cookie `HttpOnly`, `Secure` pada HTTPS, `SameSite` yang sesuai; terapkan proteksi CSRF pada mutasi berbasis cookie. Hash password dengan algoritme password hashing yang sesuai, rate limit login dan endpoint sensitif, serta invalidasi session saat logout.
- RBAC dan pemeriksaan kepemilikan objek dilakukan pada **setiap endpoint backend**; menyembunyikan menu frontend bukan otorisasi. Uji akses silang antar pelanggan dan akses PETUGAS ke fungsi ADMIN.
- Validasi input dan upload di server; batasi ukuran, MIME, ekstensi, jumlah, dan akses file. Simpan bukti pembayaran dan foto internal secara privat dengan URL sementara/endpoint terotorisasi jika diperlukan.
- Hindari secret dalam repository, browser bundle, dan log. Gunakan migrasi terkontrol, backup, prinsip least privilege, dan penanganan error terstruktur. Jangan memasukkan data pribadi asli ke seed atau screenshot skripsi tanpa izin.
- Gunakan pagination/filter server-side untuk tabel besar, indeks query yang sering dipakai, dan optimasi gambar. Jangan mengoptimalkan prematur; ukur bottleneck yang relevan.

## 9. Pengujian dan Definition of Done

Setiap task wajib memiliki: implementasi sesuai ID PRD, validasi dan otorisasi, penanganan state UI, test untuk jalur sukses dan gagal, serta bukti hasil. Jalankan lint, typecheck, unit test, integration test, dan build sesuai komponen yang diubah.

**Skenario wajib lintas modul:**

- PETUGAS tidak dapat posting inventory, mengubah harga, memverifikasi pembayaran, atau melihat pesanan pelanggan; ADMIN tidak menginput monitoring atas nama PETUGAS tanpa aturan eksplisit.
- Observasi tanaman mati menghasilkan laporan temuan, bukan perubahan stok otomatis; ADMIN mem-posting kematian tepat satu kali.
- Persetujuan siap jual tidak melebihi stok fisik; katalog tidak menawarkan tanaman belum siap jual.
- Dua checkout bersamaan pada stok terakhir tidak menghasilkan overselling; retry checkout/pemenuhan tidak menduplikasi reservasi/pengeluaran.
- Pesanan batal/kedaluwarsa melepas reservasi tanpa menambah stok fisik; unggahan bukti bayar tidak otomatis menjadi `PAID`.
- Pelanggan A tidak dapat membaca/mengubah pesanan atau bukti bayar pelanggan B.
- Form monitoring dan checkout berfungsi di mobile, keyboard, serta pada loading/empty/error state.

Jangan centang `[x]` di `task.md` sebelum kriteria penerimaan dan tes terkait lulus. Catat hasil uji, keterbatasan, serta bukti pada `docs/testing/`. Gunakan data simulasi yang jelas ditandai untuk demo dan pengujian; klaim efektivitas skripsi harus didukung evaluasi sesuai metode penelitian.

## 10. Prosedur kerja AI coding assistant

Untuk setiap permintaan implementasi: (1) sebutkan task ID dan requirement PRD terkait; (2) ringkas perubahan serta risiko; (3) periksa kode yang sudah ada sebelum mengedit; (4) ubah hanya file yang relevan; (5) sertakan dokumentasi fungsi/aturan bisnis penting; (6) jalankan uji yang tersedia dan laporkan hasil faktual; (7) perbarui checklist jika gate terpenuhi; (8) sebutkan pekerjaan yang masih tertunda tanpa mengklaim selesai. Jangan menulis ulang modul yang sudah berjalan tanpa alasan dan persetujuan.

**Prioritas akhir:** ketepatan alur tiga aktor, integritas stok, keterlacakan monitoring manual, keamanan pemesanan, kesesuaian identitas DSU, dan implementasi yang dapat diuji serta dipertanggungjawabkan dalam skripsi.
