# STYLE.md — Frontend Design System Final

**Produk:** Sistem Informasi Inventory, Monitoring Pertumbuhan, dan Online Order Tanaman pada Nursery Berbasis Web  
**Perusahaan:** CV. Delta Sinergi Utama (DSU)  
**Versi:** 2.0 — 22 September 2026  
**Status:** Final, selaras dengan `PRD.md` v2.0, `task.md` v3.0, dan `aturan.md` v2.0.  
**Stack:** Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Lucide React, Recharts.  
**Bahasa antarmuka:** Bahasa Indonesia. **Tema MVP:** light mode.

> **Aset merek wajib:** `/public/brand/cvdeltasinergiutama.png`. Nama file ini adalah kontrak lokasi aset dalam project, bukan klaim bahwa file PNG tersebut telah tersedia. Sumber referensi logo yang diberikan adalah gambar DSU dengan huruf D dan U hitam, simbol S bergradasi biru–sian, serta tulisan “CV. Delta Sinergi Utama”. Salin **file logo resmi asli** ke lokasi tersebut; jangan menggambar ulang, mengubah bentuk, atau memakai hasil generatif sebagai pengganti. Jika file resmi hanya tersedia sebagai JPG, minta/konversi aset yang diizinkan secara lossless tanpa mengubah logo; jangan mengganti ekstensi tanpa mengonversi format. Jangan mengambil warna dari poster mockup sebagai klaim spesifikasi brand resmi.

## 1. Hierarki dokumen dan prinsip produk

1. `PRD.md` menentukan fitur, aktor, alur, status, dan aturan bisnis; `task.md` menentukan urutan implementasi; `aturan.md` menentukan kualitas kode dan batasan; `style.md` mengatur presentasi visual dan interaksi. Jika konflik, ikuti PRD untuk bisnis dan selaraskan dokumen sebelum mengubah implementasi.
2. Tepat **tiga role**: `ADMIN`, `PETUGAS`, `PELANGGAN`. Jangan menambahkan role manajer, kepala nursery, kasir, atau kurir.
3. Tiga modul inti: **Inventory** (ADMIN), **Monitoring Pertumbuhan Manual** (PETUGAS), dan **Online Order** (PELANGGAN). ADMIN memverifikasi siap jual, pembayaran manual, dan pemenuhan pesanan.
4. Gunakan identitas **biru DSU** untuk navigasi, aksi utama, tautan, dan fokus. Hijau hanya warna semantik keberhasilan/kondisi tanaman; bukan warna merek utama.
5. UI operasional harus data-first, jelas, hemat dekorasi, dapat digunakan di lapangan lewat ponsel. Katalog pelanggan lebih visual, tetapi tetap satu sistem desain.

## 2. Logo dan identitas visual DSU

- Tampilkan logo resmi tanpa distorsi, crop, recolor, filter, bayangan dekoratif, animasi bentuk, atau rekonstruksi simbol. Gunakan `object-fit: contain`, rasio aspek asli, dan ruang kosong minimal setengah tinggi simbol di sekelilingnya jika ruang memungkinkan.
- Header desktop: logo utuh dengan tulisan perusahaan, tinggi area logo sekitar 36–44 px; jika tulisan tidak terbaca pada layar kecil, gunakan aset ikon **resmi** terpisah jika tersedia, atau tampilkan logo utuh dalam area lebih lebar. **Jangan** memotong sendiri huruf D/U untuk menciptakan ikon baru.
- Pada sidebar internal, logo mengarah ke dashboard sesuai role; pada storefront, logo mengarah ke katalog/beranda. Nama aplikasi dapat ditulis terpisah: “Sistem Informasi Nursery”.
- Background logo: putih atau warna solid terang dengan kontras memadai. Jangan letakkan logo di atas foto tanaman, gradient ramai, atau bidang biru yang menghilangkan simbol birunya.
- Alt text: `Logo CV. Delta Sinergi Utama`; untuk logo dekoratif yang bersebelahan dengan nama identik, gunakan alt kosong agar tidak dibacakan dua kali.
- Simpan sumber resmi sebagai file terpisah dan jangan menanamkan logo hasil tracing AI dalam komponen.

## 3. Design tokens

**Catatan:** Palet berikut adalah **usulan token UI turunan visual logo referensi**, bukan kode warna resmi perusahaan yang telah diverifikasi dari file master. Jika brand book tersedia, ganti token merek secara terpusat setelah verifikasi.

| Token | Nilai | Penggunaan |
|---|---|---|
| `--brand-50` | `#EFF8FF` | Highlight sangat ringan |
| `--brand-100` | `#DCEFFF` | Item navigasi terpilih |
| `--brand-500` | `#007ACC` | Aksen merek dan elemen nonteks |
| `--brand-600` | `#0068AD` | Tombol utama / tautan |
| `--brand-700` | `#00538A` | Hover / teks merek |
| `--brand-800` | `#003E69` | Penekanan pada latar terang |
| `--cyan-500` | `#29A9DF` | Aksen sekunder terbatas, bukan CTA utama |
| `--canvas` | `#F8FAFC` | Latar aplikasi |
| `--surface` | `#FFFFFF` | Kartu, dialog, tabel |
| `--surface-muted` | `#F1F5F9` | Section alternatif |
| `--text-primary` | `#0F172A` | Heading dan teks utama |
| `--text-secondary` | `#475569` | Deskripsi dan label sekunder |
| `--border` | `#E2E8F0` | Garis pembatas |
| `--success` | `#15803D` | Berhasil / tersedia |
| `--warning` | `#B45309` | Menunggu / perlu perhatian |
| `--danger` | `#B91C1C` | Gagal / habis / aksi destruktif |
| `--info` | `#1D4ED8` | Informasi nonbrand |

- Warna foreground/background wajib lolos WCAG AA: minimal 4.5:1 untuk teks biasa dan 3:1 untuk teks besar serta batas komponen penting. Jangan memakai `--brand-500` otomatis untuk teks kecil tanpa mengecek kontras; gunakan `--brand-700` atau `--brand-800` bila perlu.
- Jangan gunakan hijau untuk seluruh grafik hanya karena domainnya tanaman. Grafik multi-seri gunakan warna berbeda plus legenda, label, atau pola.
- Status selalu menyertakan **teks**; warna bukan satu-satunya penanda.

### 3.1 Contoh token CSS (sesuaikan dengan sistem token Tailwind/shadcn versi terpasang)

```css
:root {
  --brand-50: #eff8ff;
  --brand-100: #dcefff;
  --brand-500: #007acc;
  --brand-600: #0068ad;
  --brand-700: #00538a;
  --brand-800: #003e69;
  --cyan-500: #29a9df;
  --canvas: #f8fafc;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border: #e2e8f0;
  --success: #15803d;
  --warning: #b45309;
  --danger: #b91c1c;
  --info: #1d4ed8;
}
```

Peta token semantik shadcn (`primary`, `primary-foreground`, `background`, `foreground`, `muted`, `border`, `ring`, `destructive`) ke token di atas pada konfigurasi yang **sesuai versi shadcn yang dipasang**. Jangan mengedit file komponen generated satu per satu untuk mengganti warna merek.

## 4. Tipografi, spasi, dan bentuk

- Font: **Inter** atau Geist Sans jika sudah digunakan; fallback `ui-sans-serif, system-ui, sans-serif`. Gunakan maksimal satu keluarga font utama untuk MVP.
- Skala: H1 30/38 px desktop dan 26/34 px mobile (700); H2 24/32 (600); H3 20/28 (600); judul kartu 16/24 (600); body 14–16/22–24 (400); label 14/20 (500); caption 12/16 (400), jangan gunakan caption untuk instruksi kritis.
- Angka stok, harga, tanggal, dan ukuran memakai `font-variant-numeric: tabular-nums`; satuan selalu terlihat (`cm`, `helai`, `tanaman`, `Rp`). Format rupiah `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
- Spacing gunakan skala Tailwind 4 px; jarak antarseksi 24–32 px desktop, 16–24 px mobile; padding kartu 16–24 px.
- Radius: input/tombol 8 px, kartu 12 px, dialog 12–16 px. Shadow sangat ringan hanya untuk elevasi yang benar-benar diperlukan; border halus lebih diutamakan.
- Konten internal max-width sekitar 1440 px; storefront konten utama sekitar 1200 px. Jangan membuat semua elemen full-width pada desktop.

## 5. Layout dan navigasi menurut role

### 5.1 ADMIN — portal internal

- Sidebar desktop 240–256 px: Dashboard, Inventory, Master Tanaman, Batch & Lokasi, Kesiapan Jual, Produk/Katalog, Pesanan, Pembayaran, Laporan, Pengguna, Pengaturan.
- Header: breadcrumb, judul halaman, aksi primer kontekstual, avatar/menu akun. Hindari menaruh lebih dari satu CTA primer dalam satu area.
- Dashboard: stok fisik, siap jual, terreservasi, tersedia dipesan, pesanan menunggu pembayaran, dan ringkasan monitoring. Semua angka diambil dari API, tidak hard-coded.
- Inventory: tabel terfilter, pencarian, lokasi/batch, rincian transaksi, dan modal konfirmasi untuk perubahan stok. Admin **saja** yang dapat mem-posting transaksi.
- Monitoring admin bersifat baca/evaluasi; persetujuan siap jual harus memperlihatkan batch, hasil observasi, jumlah yang disetujui, dan dampak terhadap ketersediaan.

### 5.2 PETUGAS — portal monitoring

- Navigasi hanya: Dashboard Tugas, Batch Ditugaskan, Input Monitoring, Riwayat Monitoring, Pengajuan Siap Jual, Profil.
- Form mobile-first: batch aktif jelas, tanggal/jam, metode sampling, nomor sampel, parameter wajib sesuai spesies, satuan, kondisi, catatan, dan foto opsional.
- Tampilkan progres input per sampel; validasi dekat field; sediakan penyimpanan dengan status jelas, konfirmasi sebelum keluar jika ada perubahan belum tersimpan, dan pesan sukses yang menyebut batch serta waktu.
- Petugas dapat **melaporkan** tanaman mati/selisih, bukan mengurangi stok langsung. Tidak ada menu harga, pembayaran, pesanan pelanggan, atau pengelolaan akun.
- Grafik pertumbuhan menampilkan jumlah sampel, metode sampling, satuan, periode, dan penjelasan bahwa rata-rata sampel bukan pengukuran semua individu.

### 5.3 PELANGGAN — storefront dan akun

- Header publik: logo resmi, Katalog, pencarian, Keranjang, Masuk/Akun. Mobile: menu ringkas dengan tombol keranjang terlihat.
- Katalog: kartu produk berfoto nyata, nama tanaman, harga, kategori, status tersedia/habis, dan jumlah tersedia bila kebijakan menampilkannya. Foto tidak boleh mengklaim tanaman yang berbeda dari produk.
- Detail produk: foto, deskripsi, harga, stok dapat dipesan, pilihan kuantitas, dan CTA Tambah ke Keranjang. Jangan tampilkan observasi internal atau informasi batch yang tidak disetujui untuk publikasi.
- Keranjang: edit jumlah/hapus, subtotal, status stok terbaru; checkout: ringkasan → identitas/kontak → metode pengambilan di nursery → konfirmasi → instruksi transfer bank manual → unggah bukti bayar → status pesanan.
- **MVP: pengambilan di nursery**, bukan alur kurir/ongkir otomatis. Jangan menampilkan pilihan pengiriman yang tidak didukung PRD.
- Halaman akun hanya menampilkan pesanan milik pelanggan yang sedang login.

## 6. Komponen dan pola UI

| Komponen | Ketentuan |
|---|---|
| Button | Primary biru untuk aksi utama; secondary outline; destructive merah hanya aksi berisiko; disabled dan loading eksplisit. |
| Input | Label persisten, contoh format, required indicator, error di bawah field, fokus terlihat. |
| Select / combobox | Cari batch dan tanaman pada daftar panjang; tampilkan kode + nama untuk menghindari ambiguitas. |
| Data table | Header jelas, sort/filter bila diperlukan, alignment angka kanan, sticky header bila membantu, pagination nyata. |
| Status badge | Teks ringkas + warna semantik: Tersedia, Dalam Pembibitan, Siap Jual, Dialokasikan, Habis. |
| Dialog | Konfirmasi hanya untuk tindakan berkonsekuensi; tampilkan ringkasan dampak stok/pesanan. |
| Toast | Hasil aksi singkat; error validasi tetap tampil dekat field, bukan hanya toast. |
| Chart | Sumbu, satuan, rentang tanggal, legenda, empty state, jumlah sampel, dan tooltip aksesibel. |
| Product card | Foto rasio konsisten, nama max 2 baris, harga terbaca, stok/status, CTA jelas; tanpa fake discount/urgency. |
| Upload foto | Preview, ukuran/format yang diizinkan, progress, retry, dan pesan gagal; jangan unggah otomatis tanpa indikasi. |

Gunakan ikon Lucide berukuran 18–20 px, stroke konsisten, selalu dengan label atau accessible name untuk aksi. Jangan memakai ikon berbeda untuk arti yang sama di tiga portal.

### 6.1 Peta status yang harus mengikuti API/PRD

- **Tanaman:** Dalam Pembibitan, Perlu Perhatian, Siap Jual (disetujui admin), Habis; gunakan label tampilan dari state yang sah, jangan membuat state bisnis baru hanya untuk kebutuhan warna.
- **Pesanan:** Menunggu Pembayaran, Menunggu Verifikasi, Diproses, Siap Diambil, Selesai, Dibatalkan — tampilkan hanya status yang benar-benar didukung kontrak PRD/API; nama state backend adalah sumber kebenaran.
- **Pembayaran:** Belum Dibayar, Menunggu Verifikasi, Terverifikasi, Ditolak — status pembayaran tidak otomatis sama dengan status pesanan.
- **Stok:** bedakan stok fisik, stok siap jual disetujui, stok terreservasi, dan stok tersedia dipesan. Jangan menyebut stok fisik sebagai “tersedia untuk dibeli”.

## 7. Loading, kosong, error, dan feedback transaksi

- Semua halaman berbasis API memiliki loading skeleton yang mengikuti struktur konten, empty state yang menjelaskan langkah berikutnya, error state dengan retry, dan tampilan akses ditolak.
- Checkout harus mengunci aksi submit saat request berlangsung dan menangani retry idempoten; tampilkan pesan bila stok berubah atau reservasi gagal, tanpa menjanjikan pesanan berhasil sebelum API mengonfirmasi.
- Penyesuaian inventory dan persetujuan siap jual tampilkan kuantitas awal, perubahan, kuantitas akhir, alasan, serta konsekuensi terhadap stok terreservasi jika relevan.
- Jangan menghapus input monitoring ketika upload foto gagal; sediakan retry atau pemulihan input yang aman.
- Informasi sukses, error, dan status pesanan berasal dari backend; tidak boleh memalsukan status untuk demo produksi.

## 8. Responsivitas dan aksesibilitas

| Lebar viewport | Pola |
|---|---|
| `< 640px` | Sidebar menjadi drawer; form monitoring satu kolom; tombol penting mudah dijangkau; tabel kompleks menjadi kartu/ringkasan atau scroll horizontal berlabel. |
| `640–1023px` | Layout dua kolom bila konten cukup; sidebar dapat dipadatkan; katalog 2 kolom. |
| `>= 1024px` | Sidebar internal tetap; tabel penuh; katalog 3–4 kolom sesuai lebar dan konten. |

- Target sentuh minimal sekitar 44 × 44 px untuk aksi lapangan; semua fitur dapat digunakan dengan keyboard, fokus terlihat, urutan tab logis, dan dialog mengelola fokus.
- Label form tidak boleh hanya placeholder. Pesan error dihubungkan ke input melalui `aria-describedby`; perubahan penting seperti hasil simpan diumumkan secara aksesibel.
- Gunakan `next/image` untuk foto produk/observasi dan logo jika sesuai; selalu sediakan ukuran/aspect ratio agar layout tidak bergeser. Foto produk gunakan `object-fit: cover` tanpa memotong objek utama; **logo selalu `contain`**.
- Hormati `prefers-reduced-motion`; animasi hanya untuk feedback singkat, bukan dekorasi berulang.

## 9. Aturan anti-AI-slop — wajib

**Hindari:** gradient penuh halaman, glow/neon, glassmorphism, blob abstrak, kartu metrik identik tanpa prioritas, emoji sebagai ikon navigasi, hero raksasa di dashboard internal, dekorasi daun acak, ilustrasi AI yang menyamar sebagai foto produk, placeholder lorem ipsum pada layar final, animasi terus-menerus, dan CTA generik tanpa tujuan.

**Lakukan:** gunakan grid rapi, ruang kosong yang terukur, satu aksi utama per konteks, hierarki informasi berdasarkan tugas aktor, copy Bahasa Indonesia yang spesifik, data aktual, foto produk yang representatif, serta warna biru DSU secukupnya. Biru menunjukkan identitas/aksi; hijau hanya keadaan semantik tanaman/keberhasilan.

**Review visual wajib:** apakah pengguna langsung tahu apa yang bisa dilakukan, dari mana angka berasal, status apa yang sedang berlaku, dan tindakan apa yang mengubah stok atau pesanan? Jika tidak, perbaiki informasi sebelum menambah dekorasi.

## 10. Struktur frontend yang direkomendasikan

```text
apps/web/
├── public/
│   └── brand/
│       └── cvdeltasinergiutama.png   # Logo resmi asli, disediakan pemilik
├── src/
│   ├── app/
│   │   ├── (public)/                # Beranda, katalog, detail produk
│   │   ├── (auth)/                  # Login dan registrasi
│   │   ├── (admin)/                 # Dashboard, inventory, produk, pesanan, laporan
│   │   ├── (petugas)/               # Tugas, monitoring, pengajuan siap jual
│   │   └── (pelanggan)/             # Keranjang, checkout, pembayaran, riwayat
│   ├── components/
│   │   ├── ui/                      # Primitif shadcn/ui
│   │   ├── brand/                   # Logo resmi dan nama produk
│   │   ├── layout/                  # Header, sidebar, breadcrumb
│   │   └── charts/                  # Grafik berlabel dan bersatuan
│   ├── features/
│   │   ├── inventory/
│   │   ├── monitoring/
│   │   ├── catalog/
│   │   └── orders/
│   ├── lib/
│   │   ├── api/
│   │   └── formatters/
│   └── styles/
│       └── globals.css             # Token semantik DSU
└── package.json
```

Nama route group Next.js tidak menentukan URL publik; tetapkan URL eksplisit, misalnya `/admin/inventory`, `/petugas/monitoring`, `/katalog`, dan `/akun/pesanan`, sesuai PRD dan RBAC.

## 11. Acceptance checklist frontend (Definition of Done)

- [ ] Logo resmi `cvdeltasinergiutama.png` telah tersedia, rasio/warna/bentuk tetap, dan tampil jelas pada header/sidebar/storefront.
- [ ] Seluruh UI memakai token biru DSU; tidak ada sisa tema hijau sebagai primary brand.
- [ ] Hanya tiga portal/role: ADMIN, PETUGAS, PELANGGAN; menu dan akses backend konsisten dengan PRD.
- [ ] ADMIN dapat membedakan stok fisik, siap jual, terreservasi, dan tersedia dipesan.
- [ ] PETUGAS dapat menginput monitoring manual di ponsel dan tidak mendapat akses untuk mem-posting transaksi stok.
- [ ] PELANGGAN dapat menjalani katalog → keranjang → checkout → transfer manual → unggah bukti → lacak pesanan, dengan pengambilan di nursery.
- [ ] Tidak ada fitur ongkir otomatis, payment gateway, IoT, AI/ML, atau role tambahan yang menyelinap ke MVP.
- [ ] Seluruh halaman memiliki loading, empty, error, success, dan permission state yang sesuai.
- [ ] Form, tabel, grafik, dan kartu produk responsif, berlabel, serta dapat diakses dengan keyboard.
- [ ] Tidak ada angka stok/harga/status palsu pada alur produksi, tidak ada UI dekoratif yang tidak melayani tugas pengguna.
- [ ] Perubahan UI diperiksa terhadap `PRD.md`, `task.md`, `aturan.md`, dan pengujian relevan sebelum checklist dinyatakan selesai.
