# Rancangan frontend — F0 / task.md v3.0

Baseline: PRD v2.0, aturan v2.0, style v2.0. Urutan implementasi mengikuti task v3.0; frontend menggunakan service simulasi yang dapat diganti API. Semua jalur di bawah adalah rencana, bukan klaim seluruh halaman sudah tersedia.

## Matriks layar dan akses

| Area / route rencana                              | Aktor              | Requirement      | Isi dan interaksi                                    |
| ------------------------------------------------- | ------------------ | ---------------- | ---------------------------------------------------- |
| `/`, `/katalog`, `/katalog/[id]`                  | Publik             | ORD-01, ORD-02   | Pencarian, kategori, detail, stok siap pesan         |
| `/masuk`, `/daftar`                               | Publik             | AUTH-01, AUTH-02 | Login; registrasi selalu pelanggan                   |
| `/admin`                                          | ADMIN              | RPT-01           | Saldo dan pekerjaan menunggu tindakan                |
| `/admin/tanaman`, `/admin/lokasi`, `/admin/batch` | ADMIN              | INV-01, MON-01   | CRUD master, parameter dan penugasan                 |
| `/admin/inventory`                                | ADMIN              | INV-02–06        | Penerimaan, mutasi, kematian, penyesuaian, ledger    |
| `/admin/temuan`, `/admin/kesiapan-jual`           | ADMIN              | INV-05, MON-06   | Verifikasi temuan; tinjau bukti dan jumlah siap jual |
| `/admin/produk`                                   | ADMIN              | ORD-01           | Harga, foto, alokasi batch, publikasi                |
| `/admin/pesanan`, `/admin/pesanan/[id]`           | ADMIN              | ORD-06–08        | Verifikasi pembayaran, proses, ambil, batal          |
| `/admin/laporan`, `/admin/pengguna`               | ADMIN              | RPT-03, AUTH-04  | Filter laporan dan manajemen akun                    |
| `/petugas`, `/petugas/batch/[id]`                 | PETUGAS ditugaskan | MON-01, RPT-02   | Batch tugas, stok terkait, observasi terbaru         |
| `/petugas/monitoring`, `/petugas/riwayat`         | PETUGAS ditugaskan | MON-02–05        | Input per sampel dan parameter; riwayat/grafik       |
| `/petugas/temuan`, `/petugas/kesiapan-jual`       | PETUGAS ditugaskan | INV-05, MON-06   | Laporan tanpa posting stok; pengajuan berbukti       |
| `/keranjang`, `/checkout`                         | PELANGGAN          | ORD-02–04        | Kuantitas, hitung ulang, kontak, ambil di nursery    |
| `/akun`, `/akun/pesanan/[id]`                     | PELANGGAN pemilik  | ORD-05, ORD-09   | Pesanan sendiri, unggah bukti, status                |
| `/akun/profil`                                    | Pemilik akun       | AUTH-01, ORD-04  | Profil dan alamat/kontak                             |

Seluruh route internal akan memerlukan sesi dan role; saat ini hanya pratinjau layout demo, belum autentikasi. UI guard tidak menggantikan RBAC backend. Respons 403/404 tidak boleh mengungkap objek pengguna lain. Route group Next.js bukan batas otorisasi.

## Alur lintas aktor

ADMIN membuat master/batch dan penerimaan → menugaskan PETUGAS → PETUGAS mencatat sampel → mengajukan siap jual → ADMIN menyetujui jumlah → ADMIN memublikasikan produk → PELANGGAN menambahkan keranjang (tanpa reservasi) → checkout (reservasi) → unggah bukti → ADMIN verifikasi → proses → siap diambil → pemenuhan (stok keluar sekali).

Observasi kematian → temuan → verifikasi ADMIN → transaksi kematian. Observasi tidak mengubah saldo. Batal/kedaluwarsa hanya melepas reservasi. Pembayaran ditolak dapat kembali menunggu pembayaran selama tenggat belum lewat. Refund setelah lunas memerlukan audit dan proses manual.

## Kontrak data

Tipe dasar ada di `packages/contracts/src/index.ts`. Tipe awal belum merupakan schema runtime final F02.01.

| Objek       | Data penting                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| User        | id, nama, role tiga nilai, aktif; tanpa password di respons                                                  |
| Batch       | species, lokasi, tanggal tanam, petugas, physical/approved/reserved                                          |
| Observation | observedAt berzona, observedBy, metode, sampleCount, nilai per sampleNumber/parameter/unit, kondisi, catatan |
| Finding     | batch, kuantitas temuan, bukti, pelapor, status review, referensi posting                                    |
| Readiness   | observationId, batch/lokasi, proposedQuantity, approvedQuantity, reviewer, alasan                            |
| Product     | nama, kategori, harga integer rupiah, batchIds, publikasi, image key                                         |
| Cart        | customerId, productId, quantity positif; tidak mereservasi                                                   |
| Order       | customerId, status PRD, snapshot item/harga/kontak, deadline, total, idempotencyKey                          |
| Payment     | orderId, nominal, private proof key, verifier, status, alasan penolakan                                      |

Nilai tersedia dihitung dari alokasi batch yang sah. Data saldo tidak valid menghasilkan error rekonsiliasi. Semua uang integer rupiah; tanggal ISO dan tampilan Asia/Jakarta/WIB. State pesanan lengkap tersimpan dalam `OrderStatus`, tanpa state pengiriman tambahan.

Service rencana: AuthService (me/login/logout/register), InventoryService (list/post/findings), MonitoringService (assigned/observe/history/requestReadiness), CatalogService (list/detail/publish), OrderService (cart/checkout/proof/review/fulfill/cancel). Respons list berpaginasi; error berisi code, message, fieldErrors. Implementasi awal NurseryReadService hanya mendemonstrasikan pemisahan akses data dari tampilan baca.

## Data simulasi

Daftar skenario seed lanjutan F02.03: observasi 15 dan 22 September pada batch Monstera dengan tiga sampel acak berbeda (tidak dianggap individu longitudinal); pelanggan demo A dan B; pesanan menunggu pembayaran, review, ditolak, lunas, diproses, siap diambil, selesai, batal, kedaluwarsa; temuan menunggu/terposting/ditolak; pengajuan siap jual menunggu/disetujui/ditolak. Reservasi hanya untuk order aktif, disertai alokasi item/batch dan total snapshot yang dapat direkonsiliasi. Skenario stok terakhir digunakan untuk concurrency pada fase backend. Daftar ini adalah rencana data, bukan fixture yang sudah lengkap.

Empat batch: Monstera 120 fisik/80 siap/12 reservasi; Philodendron 85/40/5; Tabebuya 160/60/0; pucuk merah 240/0/0. Total 605 fisik, 180 siap, 17 reservasi, 163 tersedia. Tiga lokasi, tiga kategori; satu batch di luar penugasan petugas demo. Tiga produk publik; satu observasi tiga sampel 42/45/39 cm; satu pesanan review. Dataset awal belum meliputi semua state atau pengukuran berkala F02.03.

Pengukuran, harga, identitas pelanggan dan tanggal merupakan contoh, bukan fakta DSU atau standar agronomis. Dataset ditampilkan sebagai demo secara eksplisit.

## Wireframe desktop / mobile

Wireframe konkret dan interaksi form rencana tersedia pada `docs/wireframes.md`.

Desktop admin: sidebar 248 px | header | label demo | judul + konteks | saldo empat kategori | pencarian/filter | tabel batch | ringkasan tindak lanjut. Detail muncul setelah memilih baris.

Mobile admin: header + toggle navigasi | label demo | judul | saldo 2×2 | filter vertikal | tabel scroll berlabel | ringkasan satu kolom. Target tombol 44 px.

Desktop petugas: sidebar tugas | daftar batch tugas | input batch/tanggal/metode | sampel dan parameter | foto/catatan | simpan | riwayat dan grafik.

Mobile petugas: satu kolom, batch aktif tetap jelas, input bersatuan, progres sampel, error dekat input; konfirmasi keluar jika belum disimpan. Foto gagal tidak menghapus pengukuran.

Desktop pelanggan: header katalog/keranjang/akun | cari/filter | grid 3 kolom | detail foto/info | checkout kontak dan ringkasan | transfer | status.

Mobile pelanggan: header ringkas/keranjang | pencarian | produk satu kolom | detail | kuantitas | keranjang | checkout vertikal dengan ringkasan dan satu aksi utama.

Semua layar data: loading, kosong, error/retry, akses ditolak. Mutasi: pending, sukses terkonfirmasi, gagal dengan input dipertahankan.

## Keputusan dan dependensi

- `uml.md` tidak tersedia pada audit awal; dibuat rancangan awal dari PRD, bukan hasil validasi perusahaan.
- Logo resmi belum ditemukan. Identitas teks sementara; F01.03 tetap terbuka. Tidak menggambar ulang logo.
- Jadwal MON-07 dan ekspor RPT-04 tetap P1 meskipun disebut pada beberapa daftar UI. Pengiriman tidak masuk MVP.
- Style masih menyebut task v2.0; rujukan diperbarui ke v3.0 tanpa mengubah bisnis.
- Kebijakan agronomis, tenggat, rekening dan refund tetap memerlukan validasi objek penelitian; tidak dikunci dari seed.
