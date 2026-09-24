# Wireframe F00.06

Wireframe ini menetapkan struktur layar rencana, bukan klaim bahwa semua kontrol sudah diimplementasikan. Semua aksi mutasi di fase frontend berlabel simulasi.

## ADMIN — desktop (INV-01–06, MON-06, RPT-01)

```text
┌──────────────────┬────────────────────────────────────────────────────────┐
│ Logo resmi       │ Breadcrumb                              Akun / Keluar │
│                  ├────────────────────────────────────────────────────────┤
│ Ringkasan        │ Mode Demo                                             │
│ Inventory        │ Inventory tanaman                   [+ Transaksi]     │
│ Master / batch   │ Fisik | Siap jual | Reservasi | Tersedia               │
│ Monitoring      │ [Cari batch............] [Lokasi] [Kategori]          │
│ Kesiapan jual    │ Tanaman / Batch | Lokasi | Saldo | Status | Detail     │
│ Produk           │ ---------------------------------------------------   │
│ Pesanan          │ [Baris transaksi / stok]                              │
│ Laporan          │ [Sebelumnya] Halaman n dari N [Berikutnya]             │
│ Pengguna         │                                                       │
└──────────────────┴────────────────────────────────────────────────────────┘
```

Dialog transaksi: jenis → batch/lokasi → jumlah → alasan → dampak saldo awal/akhir/reservasi → konfirmasi → simpan (pending) → hasil. Konflik tidak menghilangkan input. Mutasi lokasi membutuhkan lokasi tujuan berbeda.

## ADMIN — mobile

```text
┌──────────────────────────────┐
│ Menu   Nursery        Akun   │
│ Mode Demo                    │
│ Inventory tanaman            │
│ [+ Transaksi]                │
│ Fisik       | Siap jual      │
│ Reservasi   | Tersedia       │
│ [Cari batch...............]  │
│ [Lokasi v] [Kategori v]      │
│ Tabel dapat digeser →        │
│ Batch | Saldo | Detail       │
│ [Sebelumnya] [Berikutnya]    │
└──────────────────────────────┘
```

## PETUGAS — mobile (MON-01–06, INV-05)

```text
┌──────────────────────────────┐
│ Menu   Monitoring     Akun   │
│ Mode Demo                    │
│ Catat pengamatan             │
│ [Batch tugas v]              │
│ [Tanggal] [Jam WIB]          │
│ [Metode sampling v]          │
│ [Jumlah sampel]              │
│ Sampel 1 dari 3              │
│ Tinggi [____] cm             │
│ Jumlah daun [____] helai     │
│ Kondisi [_____________ v]    │
│ Error inline jika tidak sah  │
│ [+ Sampel berikutnya]        │
│ Catatan [________________]   │
│ [Tambah foto] [Preview]      │
│ Format / ukuran / retry      │
│ [Simpan pengamatan]          │
└──────────────────────────────┘
```

Desktop: sidebar tugas + form utama dua kolom (identitas/metode di kiri, sampel di kanan) + foto/catatan + simpan. Riwayat menampilkan batch, tanggal, metode, jumlah sampel, grafik bersumbu/satuan/periode, dan catatan batas sampling. Tindakan laporan temuan dan pengajuan siap jual terpisah dari simpan observasi.

## PELANGGAN — desktop (ORD-01–09)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Logo resmi   Katalog   [Cari tanaman........]   Keranjang   Akun         │
│ Mode Demo                                                               │
│ Katalog tanaman                         [Kategori v]                    │
│ [Foto produk]       [Foto produk]       [Foto produk]                    │
│ Nama / Harga        Nama / Harga        Nama / Harga                    │
│ Stok tersedia       Stok tersedia       Stok tersedia                   │
│ [Lihat detail]      [Lihat detail]      [Lihat detail]                   │
└─────────────────────────────────────────────────────────────────────────┘
```

Detail: foto asli/fallback + nama/deskripsi + harga/stok + jumlah + tambah keranjang. Checkout: kiri kontak/alamat/pengambilan, kanan snapshot item/harga/total, tenggat, konfirmasi. Transfer dan upload bukti berada pada detail pesanan setelah checkout; status menunggu review, bukan langsung lunas.

## PELANGGAN — mobile

```text
┌──────────────────────────────┐
│ Logo    Menu   Keranjang     │
│ Mode Demo                    │
│ Ringkasan pesanan            │
│ Item / jumlah / harga        │
│ Subtotal dan total           │
│ Nama [_________________]     │
│ Kontak [_______________]     │
│ Alamat [_______________]     │
│ Ambil di nursery             │
│ Transfer bank manual         │
│ [Konfirmasi pesanan]         │
│ Error stok / harga berubah   │
└──────────────────────────────┘
```

Tombol minimum 44 px; label permanen; fokus keyboard terlihat; satu aksi primer per langkah. Layar data selalu menyediakan skeleton, kosong dengan langkah berikutnya, error/retry, dan akses ditolak. Input tetap tersimpan pada kegagalan jaringan. Persetujuan/pembatalan menampilkan dampak sebelum konfirmasi.
